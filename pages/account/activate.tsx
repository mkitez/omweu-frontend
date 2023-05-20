import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const Activate = () => {
  const router = useRouter();
  const { t } = useTranslation(['auth', 'common']);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    if (!router.isReady) {
      return;
    }
    const { uid: uidb64, token } = router.query;
    signIn('account-activation', { uidb64, token, redirect: false }).then(
      (response) => {
        if (response?.ok) {
          setSuccess(true);
        } else if (response?.status === 401) {
          setError(t('errors.activationTokenInvalid') as string);
        } else {
          setError(t('errors.common', { ns: 'common' }) as string);
        }
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  return (
    <div className="content">
      <h1>{t('activation.title')}</h1>
      {success && <div>{t('activation.success')}</div>}
      {error && <div>{error}</div>}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
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

export default Activate;
