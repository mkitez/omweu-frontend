import { FC } from 'react';
import { useTranslation, Trans } from 'next-i18next';
import Link from 'next/link';
import styles from '../styles/AgreeToTermsAndPolicy.module.css';

const AgreeToTermsAndPolicy: FC = () => {
  const { t } = useTranslation('common');

  return (
    <div className={styles.root}>
      <Trans
        components={[
          <Link key={0} href="/terms-and-conditions">
            x
          </Link>,
          <Link key={1} href="/privacy-policy">
            x
          </Link>,
        ]}
      >
        {t('agreeToTermsAndPolicy')}
      </Trans>
    </div>
  );
};

export default AgreeToTermsAndPolicy;
