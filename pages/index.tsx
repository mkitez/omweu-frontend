import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import Banner from '../components/Banner';
import TripSearch from '../components/TripSearch';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { InferGetServerSidePropsType } from 'next';
import { GetServerSideProps } from 'next';

const Home = (
  _props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const { t } = useTranslation('common');
  return (
    <div>
      <Head>
        <title>EUbyCar.com</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="omw EU" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Banner />
      <TripSearch />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  const translations = await serverSideTranslations(locale as string, [
    'common',
  ]);
  return {
    props: {
      ...translations,
    },
  };
};

export default Home;
