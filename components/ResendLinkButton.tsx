import { Alert, Button } from 'antd';
import axios from 'axios';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { useUserApi } from '../hooks/api/useUserApi';
import styles from '../styles/ResendLinkButton.module.css';

type Status =
  | 'idle'
  | 'loading'
  | 'success'
  | 'alreadyActivated'
  | 'sendError'
  | 'error';

const ResendLinkButton = () => {
  const { t } = useTranslation(['auth', 'common']);
  const [status, setStatus] = useState<Status>('idle');
  const userApi = useUserApi();
  const router = useRouter();

  const handleClick = async () => {
    setStatus('loading');
    try {
      const response = await userApi.sendActivationLink({
        uidb64: router.query.uid as string,
      });
      if (response?.status === 200) {
        setStatus('success');
      }
    } catch (e) {
      if (axios.isAxiosError(e)) {
        const { response } = e;
        if (response?.status === 400) {
          setStatus('sendError');
        } else if (response?.status === 409) {
          setStatus('alreadyActivated');
        } else {
          setStatus('error');
        }
      }
    }
  };

  return (
    <div className={styles.root}>
      <div className={styles.btnContainer}>
        <Button
          type="link"
          className={styles.btn}
          onClick={handleClick}
          loading={status === 'loading'}
        >
          {t('activation.resendLink')}
        </Button>
      </div>
      {status === 'success' && (
        <Alert type="success" message={t('registration.success')} />
      )}
      {status === 'alreadyActivated' && (
        <Alert type="info" message={t('activation.alreadyActivated')} />
      )}
      {status === 'sendError' && (
        <Alert type="error" message={t('errors.activationLinkNotSent')} />
      )}
      {status === 'error' && (
        <Alert type="error" message={t('errors.common', { ns: 'common' })} />
      )}
    </div>
  );
};

export default ResendLinkButton;
