import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { Session } from 'next-auth';
import { unstable_getServerSession } from 'next-auth/next';
import { SSRConfig, useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import type { ReactElement } from 'react';

import { getSubscriptionApi } from '../../services/serverSide/subscriptionApi';
import { Subscription } from '../../services/subscription.service';

import DashboardLayout from '../../components/DashboardLayout';
import SubscriptionList from '../../components/SubscriptionList';
import { NextPageWithLayout } from '../_app';
import { authOptions } from '../api/auth/[...nextauth]';

type PageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const SubscriptionsPage: NextPageWithLayout<PageProps> = ({
  subscriptions,
}) => {
  const { t } = useTranslation(['dashboard', 'common']);
  return (
    <>
      <Head>
        <title>{`${t('subscriptions.title')} | EUbyCar.com`}</title>
      </Head>
      <h2>{t('subscriptions.title')}</h2>
      {subscriptions === null ? (
        <div>{t('errors.common', { ns: 'common' })}</div>
      ) : (
        <SubscriptionList data={subscriptions} />
      )}
    </>
  );
};

SubscriptionsPage.auth = true;

SubscriptionsPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

type Props = {
  session: Session | null;
  subscriptions: Subscription[] | null;
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
  const api = getSubscriptionApi(session, locale);

  let subscriptions: Subscription[] | null;
  try {
    const subsResponse = await api.getCurrentUserSubscriptions();
    subscriptions = subsResponse.data;
  } catch (e) {
    subscriptions = null;
  }

  return {
    props: {
      ...translations,
      subscriptions,
      session,
    },
  };
};

export default SubscriptionsPage;
