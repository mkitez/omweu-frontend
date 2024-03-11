import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import LoginForm from '../../components/LoginForm';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { Alert, Col, Row, Divider } from 'antd';
import VkButton from '../../components/VkButton';
import AgreeToTermsAndPolicy from '../../components/AgreeToTermsAndPolicy';
import { authOptions } from '../api/auth/[...nextauth]';
import { unstable_getServerSession } from 'next-auth';
import styles from '../../styles/SignIn.module.css';

const SignIn = () => {
  const { t } = useTranslation(['auth', 'common']);
  const router = useRouter();
  return (
    <>
      <Head>
        <title>{`${t('login.title')} | EUbyCar.com`}</title>
      </Head>
      <div className="container">
        <div className={styles.root}>
          <h1>{t('login.title')}</h1>
          {router.query.error === 'SessionRequired' && (
            <Row>
              <Col md={{ span: 16, offset: 4 }}>
                <Alert
                  type="info"
                  message={t('errors.sessionRequired')}
                  className={styles.info}
                />
              </Col>
            </Row>
          )}
          <LoginForm />
          <Divider plain className={styles.divider}>
            {t('login.dividerText')}
          </Divider>
          <VkButton />
          <AgreeToTermsAndPolicy />
          {router.query.error === 'Default' && (
            <Row>
              <Col md={{ span: 16, offset: 4 }}>
                <Alert
                  type="error"
                  message={t('errors.common', { ns: 'common' })}
                  className={styles.error}
                />
              </Col>
            </Row>
          )}
        </div>
      </div>
    </>
  );
};

export default SignIn;

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
