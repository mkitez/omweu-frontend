import { CopyOutlined, FormOutlined, LeftOutlined } from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';
import { InferGetServerSidePropsType } from 'next';
import { GetServerSideProps } from 'next';
import { Session, unstable_getServerSession } from 'next-auth';
import { useSession } from 'next-auth/react';
import { SSRConfig, useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Error from 'next/error';
import Head from 'next/head';
import Link from 'next/link';

import { getTripApi } from '../../services/serverSide/tripApi';

import ContactUser from '../../components/ContactUser';
import InlineBooking from '../../components/InlineBooking';
import InlineBookings from '../../components/InlineBookings';
import PreFooter from '../../components/PreFooter';
import TripDetails from '../../components/TripDetails';
import type { Trip } from '../../components/Trips';
import { useIsAuthenticatedUser } from '../../hooks/useIsAuthenticatedUser';
import styles from '../../styles/Trip.module.css';
import { formatDate } from '../../utils/formatDate';
import { authOptions } from '../api/auth/[...nextauth]';

const BackButton = ({ trip }: { trip: Trip }) => {
  const { t } = useTranslation('trip');
  const { origin, dest } = trip;
  const fromInput = `${origin.name}, ${origin.country_name}`;
  const toInput = `${dest.name}, ${dest.country_name}`;
  const formattedDate = dayjs(trip.date)
    .tz(trip.origin.time_zone)
    .format('YYYY-MM-DD');

  return (
    <div className={styles.back}>
      <Link
        href={`/search?from=${origin.place_id}&to=${dest.place_id}&date=${formattedDate}&from_input=${fromInput}&to_input=${toInput}`}
      >
        <LeftOutlined /> {t('back')} {origin.name} – {dest.name}
      </Link>
    </div>
  );
};

const TripDetailsPage = ({
  trip,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { t, i18n } = useTranslation(['trip', 'common']);
  const { status } = useSession();
  const isDriver = useIsAuthenticatedUser(trip?.driver);

  if (trip === null) {
    return <Error statusCode={500} />;
  }

  const formattedDateWeekday = formatDate(
    new Date(trip.date),
    i18n.language,
    trip.origin.time_zone
  );
  const formattedDateFull = dayjs(trip.date).locale(i18n.language).format('ll');

  const isTripInPast = dayjs(trip.date) < dayjs();
  const showBookingButton = !isDriver && status === 'authenticated';
  const getDisabledText = () => {
    if (isTripInPast) {
      return t('disabled_text.past');
    }
    if (trip.free_seats === 0) {
      return t('disabled_text.no_seats');
    }
    return;
  };
  const route = [
    trip.origin.name,
    ...trip.route_stops.map((stop) => stop.name),
    trip.dest.name,
  ].join(' – ');

  return (
    <>
      <Head>
        <title>{`${t('title')} ${trip.origin.name} – ${
          trip.dest.name
        } ${formattedDateWeekday} | EUbyCar.com`}</title>
        <meta
          name="description"
          content={`${t('description_text', { date: formattedDateFull, route })}`}
        />
      </Head>
      <div className="container">
        <div className={styles.root}>
          <BackButton trip={trip} />
          <h1>
            {t('title')} {formattedDateWeekday}
          </h1>
          <TripDetails trip={trip} />
          {isDriver ? (
            <>
              <InlineBookings tripId={trip.id} />
              <div className={styles.tripActionsContainer}>
                {!isTripInPast && (
                  <div className={styles.tripAction}>
                    <Link href={`/tripedit/${trip.id}`}>
                      <FormOutlined /> {t('edit')}
                    </Link>
                  </div>
                )}
                <div className={styles.tripAction}>
                  <Link href={`/tripcopy?tripId=${trip.id}`}>
                    <CopyOutlined /> {t('copy')}
                  </Link>
                </div>
              </div>
            </>
          ) : (
            <>
              {showBookingButton && (
                <InlineBooking
                  tripId={trip.id}
                  disabled={isTripInPast || !trip.free_seats}
                  disabledText={getDisabledText()}
                />
              )}
              <ContactUser userId={trip.driver.id} label={t('contactDriver')} />
            </>
          )}
        </div>
      </div>
      {!isDriver && (
        <PreFooter>
          {t('footer_text', { route, date: formattedDateFull })}
        </PreFooter>
      )}
    </>
  );
};

type Props = {
  trip: Trip | null;
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
    'booking',
    'car',
  ]);
  const session = await unstable_getServerSession(req, res, authOptions);
  const tripApi = getTripApi(session, locale);

  let notFound = false;
  let trip: Trip | null = null;

  const slug = Number(params?.slug);
  if (!isNaN(slug)) {
    notFound = true;
    return {
      notFound,
      props: {
        ...translations,
        session,
        trip,
      },
    };
  }

  try {
    const tripResponse = await tripApi.getTripBySlug(String(params?.slug));
    trip = tripResponse.data;
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
      trip,
    },
  };
};

export default TripDetailsPage;
