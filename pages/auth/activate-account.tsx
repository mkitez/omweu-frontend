import { Result } from 'antd';
import { GetServerSideProps } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { signIn } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import ResendLinkButton from '../../components/ResendLinkButton';
import styles from '../../styles/ActivateAccount.module.css';
import { authOptions } from '../api/auth/[...nextauth]';

type Status = 'loading' | 'success' | 'activationError' | 'error';

const ActivateAccount = () => {
  const router = useRouter();
  const { t } = useTranslation(['auth', 'common']);
  const [status, setStatus] = useState<Status>('loading');
  const [countdown, setCountdown] = useState<number | null>(null);

  const startCountdown = (count: number) => {
    const { callbackUrl } = router.query;
    const redirectUrl =
      (callbackUrl && String(callbackUrl)) || '/dashboard/profile';
    return setInterval(() => {
      setCountdown((prev) => {
        if (prev === null) {
          return count;
        }
        if (prev === 1) {
          router.push(redirectUrl);
          return prev;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    if (!router.isReady) {
      return;
    }
    const { uid: uidb64, token } = router.query;
    let timer: ReturnType<typeof setInterval>;
    signIn('account-activation', {
      uidb64,
      token,
      redirect: false,
    }).then((response) => {
      if (response?.ok) {
        setStatus('success');
        timer = startCountdown(3);
      } else if (response?.status === 401) {
        setStatus('activationError');
      } else {
        setStatus('error');
      }
    });
    return () => {
      clearInterval(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  return (
    <div className="container">
      <Head>
        <title>{`${t('activation.title')} | EUbyCar.com`}</title>
      </Head>
      <div className={styles.root}>
        <div className={styles.content}>
          {status === 'success' && (
            <Result
              status="success"
              title={t('activation.success')}
              subTitle={
                countdown !== null &&
                t('activation.successSubtitle', { sec: countdown })
              }
            />
          )}
          {status === 'activationError' && (
            <Result
              status="error"
              title={t('errors.activationTokenInvalid')}
              extra={<ResendLinkButton />}
            />
          )}
          {status === 'error' && (
            <Result
              status="error"
              className={styles.error}
              title={t('errors.common', { ns: 'common' })}
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
  query,
}) => {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (session) {
    return { redirect: { destination: '/dashboard' }, props: [] };
  }

  const { uid, token } = query;
  if (!uid || !token) {
    return { redirect: { destination: '/' }, props: [] };
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
