import { App } from 'antd';
import { GetServerSideProps, type InferGetServerSidePropsType } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { SSRConfig, useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { getUserApi } from '../services/serverSide/userApi';

import DriverPreferencesModal from '../components/DriverPreferencesModal';
import TripEditForm from '../components/TripEditForm';
import { Trip, User } from '../components/Trips';
import { useTripApi } from '../hooks/api/useTripApi';
import styles from '../styles/NewTrip.module.css';
import { NextPageWithLayout } from './_app';
import { authOptions } from './api/auth/[...nextauth]';

type PageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const NewTrip: NextPageWithLayout<PageProps> = ({
  shouldShowPreferencesModal,
}) => {
  const router = useRouter();
  const api = useTripApi();
  const { t } = useTranslation(['dashboard', 'common']);
  const { message } = App.useApp();

  const handleSubmit = async (data: any) => {
    const newTripResponse = await api.createTrip(data);
    const newTrip: Trip = newTripResponse.data;
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

export const shouldShowDriverDataPage = (user: User) => {
  const hasContacts = Boolean(user.phone_number || user.telegram_username);
  if (!hasContacts || !user.is_email_confirmed || user.cars.length === 0) {
    return true;
  }
  return false;
};

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
    const user: User = userResponse.data;
    shouldShowPreferencesModal = user.driver_preferences === null;
    if (shouldShowDriverDataPage(user)) {
      return {
        redirect: { destination: '/driver-info' },
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
