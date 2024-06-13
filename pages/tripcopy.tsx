import { App } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { SSRConfig, useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Error from 'next/error';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { getTripApi } from '../services/serverSide/tripApi';

import TripEditForm from '../components/TripEditForm';
import { Trip } from '../components/Trips';
import { useTripApi } from '../hooks/api/useTripApi';
import styles from '../styles/TripEdit.module.css';
import { authOptions } from './api/auth/[...nextauth]';

const TripCopy = ({
  trip: data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const api = useTripApi();
  const { t } = useTranslation(['dashboard', 'common']);
  const { message } = App.useApp();

  if (data === null) {
    return <Error statusCode={500} />;
  }

  const tripDate = dayjs(data.date).tz(data.origin.time_zone);
  const isTripInPast = tripDate < dayjs();
  const newTripDate = isTripInPast
    ? dayjs().add(2, 'hour').startOf('hour')
    : tripDate.add(1, 'day');

  return (
    <div className="container">
      <Head>
        <title>{`${t('trips.copyTitle')} | EUbyCar.com`}</title>
      </Head>
      <div className={styles.root}>
        <h1>{t('trips.copyTitle')}</h1>
        <TripEditForm
          data={{ ...data, date: newTripDate.toISOString() }}
          submitValue={t('create', { ns: 'common' })}
          submit={async (data) => {
            const newTripResponse = await api.createTrip(data);
            const newTrip = newTripResponse.data;
            message.success(t('notifications.new_trip'));
            router.push(`/trips/${newTrip.slug}`);
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
  const tripApi = getTripApi(session, locale);

  let notFound = false;
  let trip: Trip | null = null;
  if (session) {
    try {
      const tripResponse = await tripApi.getTrip(Number(query.tripId));
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
