import axios from 'axios';
import Head from 'next/head';
import { InferGetServerSidePropsType } from 'next';
import { SSRConfig, useTranslation } from 'next-i18next';
import api from '../../services/api';
import styles from '../../styles/Trip.module.css';
import { GetServerSideProps } from 'next';
import { Session, unstable_getServerSession } from 'next-auth';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { authOptions } from '../api/auth/[...nextauth]';
import Error from 'next/error';
import type { Trip, User } from '../../components/Trips';
import { formatDate } from '../../utils/formatDate';

export interface Booking {
  trip: Trip
  driver: User
  passenger: User
  is_confirmed: boolean
  response_timestamp: string
  booking_date: string
}

const BookingDetailsPage = ({
  booking,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { t, i18n } = useTranslation(['trip', 'common']);

  if (booking === null) {
    return <Error statusCode={500} />;
  }

  const formattedDate = formatDate(new Date(booking.trip.date), i18n.language);
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
    'trip',
  ]);

  const session = await unstable_getServerSession(req, res, authOptions);

  let notFound = false;
  let booking: Booking | null = null;
  try {
    const bookingResponse = await api.get(`/bookings/${params?.bookingId}/`, {
      headers: {
        Authorization: session ? `Bearer ${session.accessToken}` : undefined,
        'Accept-Language': locale,
      },
    });
    booking = bookingResponse.data;
  } catch (e) {
    if (axios.isAxiosError(e) && e.response?.status === 404) {
      notFound = true;
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
