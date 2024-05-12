import axios from 'axios';
import { InferGetServerSidePropsType } from 'next';
import { GetServerSideProps } from 'next';
import { Session, unstable_getServerSession } from 'next-auth';
import { SSRConfig, useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Error from 'next/error';
import Head from 'next/head';

import { getUserApi } from '../../services/serverSide/userApi';

import type { User } from '../../components/Trips';
import styles from '../../styles/Trip.module.css';
import { authOptions } from '../api/auth/[...nextauth]';

const PublicUserProfilePage = ({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { t } = useTranslation(['common']);

  if (user === null) {
    return <Error statusCode={500} />;
  }

  return (
    <>
      <Head>
        <title>User profile</title>
      </Head>
      <div className="container">
        <div className={styles.root}>
          <h1>User profile</h1>
          <div>Name: {user.first_name}</div>
        </div>
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
  ]);
  const session = await unstable_getServerSession(req, res, authOptions);
  const api = getUserApi(session, locale);

  let notFound = false;
  let user: User | null = null;
  try {
    const response = await api.getUser(params?.userId as string);
    user = response.data;
  } catch (e) {
    if (axios.isAxiosError(e) && e.response?.status === 404) {
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
