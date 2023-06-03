import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';
import { Trans, useTranslation } from 'next-i18next';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Alert } from 'antd';
import styles from '../../styles/ActivateAccount.module.css';
import Link from 'next/link';
import ResendLinkButton from '../../components/ResendLinkButton';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]';

type Status = 'loading' | 'success' | 'activationError' | 'error';

const ActivateAccount = () => {
  const router = useRouter();
  const { t } = useTranslation(['auth', 'common']);
  const [status, setStatus] = useState<Status>('loading');
  useEffect(() => {
    if (!router.isReady) {
      return;
    }
    const { uid: uidb64, token } = router.query;
    signIn('account-activation', { uidb64, token, redirect: false }).then(
      (response) => {
        if (response?.ok) {
          setStatus('success');
        } else if (response?.status === 401) {
          setStatus('activationError');
        } else {
          setStatus('error');
        }
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  return (
    <div className="container">
      <Head>
        <title>{`${t('activation.title')} | EUbyCar.com`}</title>
      </Head>
      <div className={styles.root}>
        <h1>{t('activation.title')}</h1>
        <div className={styles.content}>
          {status === 'success' && (
            <Alert
              type="success"
              showIcon
              className={styles.success}
              message={
                <Trans
                  components={[
                    <Link key={0} href="/dashboard">
                      x
                    </Link>,
                  ]}
                >
                  {t('activation.success')}
                </Trans>
              }
            />
          )}
          {status === 'activationError' && (
            <>
              <Alert
                type="error"
                showIcon
                className={styles.error}
                message={t('errors.activationTokenInvalid')}
              />
              <ResendLinkButton />
            </>
          )}
          {status === 'error' && (
            <Alert
              type="error"
              showIcon
              className={styles.error}
              message={t('errors.common', { ns: 'common' })}
            />
          )}
        </div>
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
    'common',
    'auth',
  ]);
  return {
    props: {
      ...translations,
    },
  };
};

export default ActivateAccount;
