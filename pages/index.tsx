import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import BannerSection from '../components/BannerSection';
import PromoSection from '../components/PromoSection';
import ForWhoSection from '../components/ForWhoSection';
import DriverSection from '../components/DriverSection';
import PopularTripsSection from '../components/PopularTripsSection';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticProps } from 'next';
import styles from '../styles/Home.module.css';
import UpcomingTripsSection from '../components/UpcomingTripsSection';

const Home = () => {
  const { t } = useTranslation('home');
  return (
    <div className={styles.root}>
      <Head>
        <title>{`${t('title')} | EUbyCar.com`}</title>
        <meta name="description" content={t('description') as string} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <BannerSection />
      <PromoSection />
      <ForWhoSection />
      <DriverSection />
      <UpcomingTripsSection />
      <PopularTripsSection />
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const translations = await serverSideTranslations(locale as string, [
    'common',
    'home',
  ]);

  return {
    props: {
      ...translations,
    },
  };
};

export default Home;
