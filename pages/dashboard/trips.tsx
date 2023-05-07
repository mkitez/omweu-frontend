import type { ReactElement } from 'react';
import type { GetServerSideProps } from 'next';
import Link from 'next/link';
import { Button } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import { authOptions } from '../api/auth/[...nextauth]';
import { unstable_getServerSession } from 'next-auth/next';
import Trips from '../../components/Trips';
import withAuth from '../../components/withAuthHOC';
import DashboardLayout from '../../components/DashboardLayout';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

const TripsPage = () => {
  const { t } = useTranslation('dashboard');
  return (
    <div>
      <h2>{t('trips.title')}</h2>
      <Trips />
      <Link href="/newtrip" passHref legacyBehavior>
        <Button icon={<PlusCircleOutlined />}>{t('trips.createTrip')}</Button>
      </Link>
    </div>
  );
};

TripsPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  locale,
}) => {
  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: '/api/auth/signin',
        permanent: false,
      },
    };
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

export default withAuth(TripsPage);
