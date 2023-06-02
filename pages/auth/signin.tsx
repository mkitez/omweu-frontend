import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import LoginForm from '../../components/LoginForm';
import { useTranslation } from 'next-i18next';
import styles from '../../styles/SignIn.module.css';
import { useRouter } from 'next/router';
import { Alert, Col, Row } from 'antd';

const SignIn = () => {
  const { t } = useTranslation('auth');
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
        </div>
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
