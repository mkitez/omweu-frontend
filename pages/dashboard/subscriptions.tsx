import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { Session } from 'next-auth';
import { unstable_getServerSession } from 'next-auth/next';
import { SSRConfig, useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import type { ReactElement } from 'react';

import DashboardLayout from '../../components/DashboardLayout';
import { NextPageWithLayout } from '../_app';
import { authOptions } from '../api/auth/[...nextauth]';

type PageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const SubscriptionsPage: NextPageWithLayout<PageProps> = () => {
  const { t } = useTranslation('dashboard');
  return (
    <>
      <Head>
        <title>{`${t('subscriptions.title')} | EUbyCar.com`}</title>
      </Head>
      <h2>{t('subscriptions.title')}</h2>
    </>
  );
};

SubscriptionsPage.auth = true;

SubscriptionsPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

type Props = {
  session: Session | null;
} & SSRConfig;

export const getServerSideProps: GetServerSideProps<Props> = async ({
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

export default SubscriptionsPage;
