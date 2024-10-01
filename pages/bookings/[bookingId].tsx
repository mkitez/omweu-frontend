import axios from 'axios';
import { InferGetServerSidePropsType } from 'next';
import { GetServerSideProps } from 'next';
import { Session, unstable_getServerSession } from 'next-auth';
import { SSRConfig, useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Error from 'next/error';
import Head from 'next/head';

import { getBookingApi } from '../../services/serverSide/bookingApi';

import BookingDetails from '../../components/BookingDetails';
import type { Trip, User } from '../../components/Trips';
import styles from '../../styles/Trip.module.css';
import { formatDate } from '../../utils/formatDate';
import { authOptions } from '../api/auth/[...nextauth]';

export type InBookingTrip = Omit<Trip, 'driver'>;

export type BookingState = 'PENDING' | 'CONFIRMED' | 'REJECTED' | 'CANCELLED';

export interface Booking {
  booking_id: string;
  trip: InBookingTrip;
  driver: User;
  passenger: User;
  state: BookingState;
  response_timestamp: string;
  booking_date: string;
  cancellation_reason: string;
  rejection_reason: string;
}

const BookingDetailsPage = ({
  booking,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { t, i18n } = useTranslation(['booking', 'common']);

  if (booking === null) {
    return <Error statusCode={500} />;
  }

  const formattedDate = formatDate(
    new Date(booking.trip.date),
    i18n.language,
    booking.trip.origin.time_zone
  );
  return (
    <>
      <Head>
        <title>{`${t('title')} ${booking.trip.origin.name} – ${
          booking.trip.dest.name
        } ${formattedDate} | EUbyCar.com`}</title>
      </Head>
      <div className="container">
        <div className={styles.root}>
          <h1>
            {t('title')} {formattedDate}
          </h1>
          <BookingDetails booking={booking} />
        </div>
      </div>
    </>
  );
};

type Props = {
  booking: Booking | null;
  session: Session | null;
} & SSRConfig;

export const getServerSideProps: GetServerSideProps<Props> = async ({
  req,
  res,
  locale,
  params,
}) => {
  const translations = await serverSideTranslations(locale as string, [
    'common',
    'dashboard',
    'booking',
  ]);

  const session = await unstable_getServerSession(req, res, authOptions);
  const api = getBookingApi(session, locale);

  let notFound = false;
  let booking: Booking | null = null;
  try {
    booking = await api.getBooking(params?.bookingId as string);
  } catch (e) {
    if (axios.isAxiosError(e)) {
      if (e.response?.status === 403) {
        return {
          redirect: {
            permanent: false,
            destination: '/',
          },
        };
      }
      if (e.response?.status === 404) {
        notFound = true;
      }
    }
  }

  return {
    notFound,
    props: {
      ...translations,
      session,
      booking,
    },
  };
};

export default BookingDetailsPage;
