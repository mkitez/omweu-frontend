import TripEditForm from '../components/TripEditForm';
import TripService from '../services/trip.service';
import api from '../services/api';
import { SSRConfig, useTranslation } from 'next-i18next';
import { Trip } from '../components/Trips';
import styles from '../styles/TripEdit.module.css';
import Head from 'next/head';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { Session, unstable_getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import axios from 'axios';
import Error from 'next/error';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import dayjs from 'dayjs';

const TripCopy = ({
  trip: data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const { data: session } = useSession();
  const { t } = useTranslation(['dashboard', 'common']);

  if (data === null) {
    return <Error statusCode={500} />;
  }

  const tripIsInPast = dayjs(data.date) < dayjs();
  const newTripDate = tripIsInPast
    ? dayjs().add(2, 'hour').startOf('hour')
    : dayjs(data.date).add(1, 'day');

  return (
    <div className="container">
      <Head>
        <title>{`${t('trips.copyTitle')} | EUbyCar.com`}</title>
      </Head>
      <div className={styles.root}>
        <h1>{t('trips.copyTitle')}</h1>
        <TripEditForm
          initialOrigin={data.origin}
          initialDest={data.dest}
          initialRouteStops={data.route_stops}
          initialDate={newTripDate}
          initialPrice={data.price}
          initialDescription={data.description}
          tripTimezone={data.origin.time_zone}
          submitValue={t('create', { ns: 'common' })}
          submit={async (data: any) => {
            await TripService.createTrip(data, session?.accessToken as string);
            router.push('/dashboard');
          }}
        />
      </div>
    </div>
  );
};

TripCopy.auth = true;

export default TripCopy;

type Props = {
  trip: Trip | null;
  session: Session | null;
} & SSRConfig;

export const getServerSideProps: GetServerSideProps<Props> = async ({
  req,
  res,
  locale,
  query,
}) => {
  const session = await unstable_getServerSession(req, res, authOptions);

  const translations = await serverSideTranslations(locale as string, [
    'common',
    'dashboard',
    'trip',
  ]);

  let notFound = false;
  let trip: Trip | null = null;
  if (session) {
    try {
      const tripResponse = await api.get(`/trips/${query?.tripId}/`, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          'Accept-Language': locale,
        },
      });
      trip = tripResponse.data;
    } catch (e) {
      if (axios.isAxiosError(e) && e.response?.status === 404) {
        notFound = true;
      }
    }
  }

  const props = {
    ...translations,
    session,
    trip,
  };

  if (notFound) {
    return { redirect: { destination: '/newtrip' }, props };
  }

  return {
    props,
  };
};
