import Head from 'next/head';
import Banner from '../components/Banner';
import TripSearch from '../components/TripSearch';
import PromoSection from '../components/PromoSection';
import ForWhoSection from '../components/ForWhoSection';
import DriverSection from '../components/DriverSection';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { InferGetServerSidePropsType } from 'next';
import { GetServerSideProps } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]';

const Home = (
  _props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  return (
    <>
      <Head>
        <title>EUbyCar.com</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="omw EU" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Banner />
      <TripSearch />
      <PromoSection />
      <ForWhoSection />
      <DriverSection />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  req,
  res,
}) => {
  const translations = await serverSideTranslations(locale as string, [
    'common',
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
