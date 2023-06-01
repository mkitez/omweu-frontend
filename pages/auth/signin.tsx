import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import LoginForm from '../../components/LoginForm';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';

const SignIn = () => {
  const { t } = useTranslation('auth');
  return (
    <>
      <Head>
        <title>{`${t('login.title')} | EUbyCar.com`}</title>
      </Head>
      <div className="container">
        <h1>{t('login.title')}</h1>
        <LoginForm />
      </div>
    </>
  );
};

export default SignIn;

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
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
