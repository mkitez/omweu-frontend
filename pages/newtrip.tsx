import Head from 'next/head';
import { useRouter } from 'next/router';
import TripService from '../services/trip.service';
import TripEditForm from '../components/TripEditForm';
import { unstable_getServerSession } from 'next-auth';
import { SSRConfig, useTranslation } from 'next-i18next';
import { GetServerSideProps } from 'next';
import type { InferGetServerSidePropsType } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { authOptions } from './api/auth/[...nextauth]';
import { useSession } from 'next-auth/react';
import api from '../services/api';
import { User } from '../components/Trips';
import styles from '../styles/NewTrip.module.css';
import DriverPreferencesModal from '../components/DriverPreferencesModal';

const NewTrip = ({
  shouldShowPreferencesModal,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const { data: session } = useSession();
  const { t } = useTranslation(['dashboard', 'common']);

  const handleSubmit = async (data: any) => {
    await TripService.createTrip(data, session?.accessToken as string);
    router.push('/dashboard');
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
  if (session) {
    const userResponse = await api.get(`/users/${session.user.id}/`, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        'Accept-Language': locale,
      },
    });
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
