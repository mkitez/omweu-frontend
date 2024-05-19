import { App } from 'antd';
import { GetServerSideProps, type InferGetServerSidePropsType } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { useSession } from 'next-auth/react';
import { SSRConfig, useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { getUserApi } from '../services/serverSide/userApi';
import TripService from '../services/trip.service';

import DriverPreferencesModal from '../components/DriverPreferencesModal';
import TripEditForm from '../components/TripEditForm';
import { Trip, User } from '../components/Trips';
import styles from '../styles/NewTrip.module.css';
import { authOptions } from './api/auth/[...nextauth]';

const NewTrip = ({
  shouldShowPreferencesModal,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const { data: session } = useSession();
  const { t } = useTranslation(['dashboard', 'common']);
  const { message } = App.useApp();

  const handleSubmit = async (data: any) => {
    const newTrip: Trip = await TripService.createTrip(
      data,
      session?.accessToken as string
    );
    message.success(t('notifications.new_trip'));
    router.push(`/trips/${newTrip.id}`);
  };

  return (
    <div className="container">
      <Head>
        <title>{`${t('trips.createTitle')} | EUbyCar.com`}</title>
      </Head>
      <div className={styles.root}>
        <h1>{t('trips.createTitle')}</h1>
        <TripEditForm
          submitValue={t('create', { ns: 'common' })}
          submit={handleSubmit}
        />
      </div>
      <DriverPreferencesModal shouldShowModal={shouldShowPreferencesModal} />
    </div>
  );
};

NewTrip.auth = true;

type Props = {
  shouldShowPreferencesModal: boolean;
} & SSRConfig;

export const getServerSideProps: GetServerSideProps<Props> = async ({
  req,
  res,
  locale,
}) => {
  let shouldShowPreferencesModal = false;
  const session = await unstable_getServerSession(req, res, authOptions);
  const translations = await serverSideTranslations(locale as string, [
    'common',
    'dashboard',
  ]);
  const userApi = getUserApi(session, locale);
  if (session) {
    const userResponse = await userApi.getSelf();
    const userData = userResponse.data as User;
    shouldShowPreferencesModal = userData.driver_preferences === null;
    if (
      (!userData.phone_number && !userData.telegram_username) ||
      !userData.is_email_confirmed
    ) {
      return {
        redirect: { destination: '/add-contacts' },
        props: {
          ...translations,
          session,
          shouldShowPreferencesModal,
        },
      };
    }
  }

  return {
    props: {
      ...translations,
      session,
      shouldShowPreferencesModal,
    },
  };
};

export default NewTrip;
