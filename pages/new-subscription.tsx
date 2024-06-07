import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';

import SubscriptionEditForm from '../components/SubscriptionEditForm';
import styles from '../styles/NewCar.module.css';
import { NextPageWithLayout } from './_app';
import { authOptions } from './api/auth/[...nextauth]';

type PageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const NewSubscriptionPage: NextPageWithLayout<PageProps> = () => {
  const { t } = useTranslation('dashboard');

  return (
    <div className="container">
      <Head>
        <title>{`${t('subscriptions.create_title')} | EUbyCar.com`}</title>
      </Head>
      <div className={styles.root}>
        <h1>{t('subscriptions.create_title')}</h1>
        <SubscriptionEditForm />
      </div>
    </div>
  );
};

NewSubscriptionPage.auth = true;

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  locale,
}) => {
  const session = await unstable_getServerSession(req, res, authOptions);
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

export default NewSubscriptionPage;
