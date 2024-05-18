import { PlusCircleOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import type { GetServerSideProps } from 'next';
import { unstable_getServerSession } from 'next-auth/next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import Link from 'next/link';
import type { ReactElement } from 'react';

import DashboardLayout from '../../components/DashboardLayout';
import Trips from '../../components/Trips';
import { authOptions } from '../api/auth/[...nextauth]';

const TripsPage = () => {
  const { t } = useTranslation('dashboard');
  return (
    <div>
      <Head>
        <title>{`${t('trips.title')} | EUbyCar.com`}</title>
      </Head>
      <h2>{t('trips.title')}</h2>
      <Trips />
      <Link href="/newtrip" passHref legacyBehavior>
        <Button icon={<PlusCircleOutlined />}>{t('trips.createTrip')}</Button>
      </Link>
    </div>
  );
};

TripsPage.auth = true;

TripsPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  locale,
}) => {
  const session = await unstable_getServerSession(req, res, authOptions);

  const translations = await serverSideTranslations(locale as string, [
    'common',
    'dashboard',
    'trip',
    'booking',
    'car',
  ]);

  return {
    props: {
      ...translations,
      session,
    },
  };
};

export default TripsPage;
