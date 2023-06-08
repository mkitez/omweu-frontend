import { useRouter } from 'next/router';
import TripService from '../services/trip.service';
import TripEditForm from '../components/TripEditForm';
import { unstable_getServerSession } from 'next-auth';
import { useTranslation } from 'next-i18next';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { authOptions } from './api/auth/[...nextauth]';
import { useSession } from 'next-auth/react';
import api from '../services/api';
import { User } from '../components/Trips';
import styles from '../styles/NewTrip.module.css';
import Head from 'next/head';

const NewTrip = () => {
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
    </div>
  );
};

NewTrip.auth = true;

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  locale,
}) => {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (session) {
    const userResponse = await api.get(`/users/${session.user.id}/`, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        'Accept-Language': locale,
      },
    });
    const userData = userResponse.data as User;
    if (!userData.phone_number && !userData.telegram_username) {
      return {
        redirect: { destination: '/add-contacts' },
        props: {},
      };
    }
  }

  const translations = await serverSideTranslations(locale as string, [
    'common',
    'dashboard',
  ]);

  return {
    props: {
      ...translations,
      session,
    },
  };
};

export default NewTrip;
