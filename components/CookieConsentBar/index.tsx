import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { CSSProperties } from 'react';
import CookieConsent from 'react-cookie-consent';

import { GA_DISABLE_PROPERTY } from '../../utils/constants';
import styles from './CookieConsentBar.module.css';

const containerStyle: CSSProperties = {
  background: 'white',
  color: 'rgba(0, 0, 0, 0.75)',
  fontSize: '0.8rem',
  boxShadow: '0px 0px 15px 0px hsla(0, 0%, 0%, 0.2)',
};

const acceptButtonStyle: CSSProperties = {
  color: 'white',
  background: '#294a54',
  borderRadius: '0.3rem',
  padding: '0.5rem 1rem',
  margin: '0 0 0.5rem 1rem',
};

const declineButtonStyle: CSSProperties = {
  color: 'inherit',
  background: 'white',
  border: '1px solid #294a54',
  borderRadius: '0.3rem',
  padding: '0.5rem 1rem',
  margin: '0 0.5rem',
};

const CookieConsentBar: React.FC = () => {
  const { t } = useTranslation('common');
  return (
    <CookieConsent
      enableDeclineButton
      flipButtons
      buttonText={t('cookie_consent.accept')}
      declineButtonText={t('cookie_consent.decline')}
      onAccept={() => {
        window[GA_DISABLE_PROPERTY] = false;
      }}
      onDecline={() => {
        window[GA_DISABLE_PROPERTY] = true;
      }}
      style={containerStyle}
      contentClasses={styles.content}
      buttonStyle={acceptButtonStyle}
      declineButtonStyle={declineButtonStyle}
    >
      {t('cookie_consent.content')}{' '}
      <Link href="/privacy-policy" className={styles.privacy}>
        {t('footer.privacy')}
      </Link>
    </CookieConsent>
  );
};

export default CookieConsentBar;
