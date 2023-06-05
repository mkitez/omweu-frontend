import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import Banner from '../components/Banner';
import TripSearch from '../components/TripSearch';
import PromoSection from '../components/PromoSection';
import ForWhoSection from '../components/ForWhoSection';
import DriverSection from '../components/DriverSection';
import PopularTripsSection from '../components/PopularTripsSection';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { InferGetServerSidePropsType } from 'next';
import { GetServerSideProps } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]';
import styles from '../styles/Home.module.css';

const Home = (
  _props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const { t } = useTranslation('home');
  return (
    <div className={styles.root}>
      <Head>
        <title>{`${t('title')} | EUbyCar.com`}</title>
        <meta name="description" content={t('description') as string} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Banner />
      <TripSearch />
      <PromoSection />
      <ForWhoSection />
      <DriverSection />
      <PopularTripsSection />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  req,
  res,
}) => {
  const translations = await serverSideTranslations(locale as string, [
    'common',
    'home',
  ]);

  const session = await unstable_getServerSession(req, res, authOptions);

  return {
    props: {
      ...translations,
      session,
    },
  };
};

export default Home;
