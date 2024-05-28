import { Divider } from 'antd';
import { GetServerSideProps } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';

import AgreeToTermsAndPolicy from '../../components/AgreeToTermsAndPolicy';
import SignupForm from '../../components/SignupForm';
import VkButton from '../../components/VkButton';
import styles from '../../styles/Register.module.css';
import { NextPageWithLayout } from '../_app';
import { authOptions } from '../api/auth/[...nextauth]';

const SignupPage: NextPageWithLayout = () => {
  const { t } = useTranslation(['auth', 'common']);

  return (
    <div className="container">
      <Head>
        <title>{`${t('registration.title')} | EUbyCar.com`}</title>
      </Head>
      <div className={styles.root}>
        <h1>{t('registration.title')}</h1>
        <SignupForm />
        <Divider plain className={styles.divider}>
          {t('login.dividerText')}
        </Divider>
        <VkButton />
        <AgreeToTermsAndPolicy />
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  locale,
}) => {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (session) {
    return { redirect: { destination: '/dashboard' }, props: [] };
  }

  const translations = await serverSideTranslations(locale as string, [
    'auth',
    'common',
  ]);
  return {
    props: {
      ...translations,
    },
  };
};

export default SignupPage;
