import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import TripSearch from '../components/TripSearch';
import styles from '../styles/Home.module.css';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { InferGetServerSidePropsType } from 'next';

interface SSRParams {
  locale: string;
}

const Home = (
  _props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const { t } = useTranslation('common');
  return (
    <div className={styles.container}>
      <Head>
        <title>omw EU</title>
        <meta name="description" content="omw EU" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1>{t('welcomeMessage')}</h1>
      <TripSearch />
    </div>
  );
};

export const getServerSideProps = async ({ locale }: SSRParams) => {
  const translations = await serverSideTranslations(locale, ['common']);
  return {
    props: {
      ...translations,
    },
  };
};

export default Home;
