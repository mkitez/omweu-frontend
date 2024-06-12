import axios from 'axios';
import { InferGetServerSidePropsType } from 'next';
import { GetServerSideProps } from 'next';
import { Session, unstable_getServerSession } from 'next-auth';
import { SSRConfig, useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Error from 'next/error';
import Head from 'next/head';

import { getUserApi } from '../../services/serverSide/userApi';

import PublicUserProfile from '../../components/PublicUserProfile';
import type { User } from '../../components/Trips';
import { NextPageWithLayout } from '../_app';
import { authOptions } from '../api/auth/[...nextauth]';

type PageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const PublicUserProfilePage: NextPageWithLayout<PageProps> = ({ user }) => {
  const { t } = useTranslation('profile');

  if (user === null) {
    return <Error statusCode={500} />;
  }

  return (
    <>
      <Head>
        <title>{`${t('title')} ${user.first_name} | EUbyCar.com`}</title>
        <meta name="robots" content="noindex" />
      </Head>
      <div className="container">
        <PublicUserProfile user={user} />
      </div>
    </>
  );
};

type Props = {
  user: User | null;
  session: Session | null;
} & SSRConfig;

export const getServerSideProps: GetServerSideProps<Props> = async ({
  req,
  res,
  locale,
  params,
}) => {
  const translations = await serverSideTranslations(locale as string, [
    'common',
    'profile',
    'dashboard',
    'car',
  ]);
  const session = await unstable_getServerSession(req, res, authOptions);
  const api = getUserApi(session, locale);

  let notFound = false;
  let user: User | null = null;
  try {
    const response = await api.getUser(params?.userId as string);
    user = response.data;
  } catch (e) {
    if (axios.isAxiosError(e)) {
      if (e.response?.status && [401, 404].includes(e.response?.status))
        notFound = true;
    }
  }

  return {
    notFound,
    props: {
      ...translations,
      session,
      user,
    },
  };
};

export default PublicUserProfilePage;
