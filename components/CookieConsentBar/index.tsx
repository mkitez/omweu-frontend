import { useTranslation } from 'next-i18next';
import { CSSProperties } from 'react';
import CookieConsent from 'react-cookie-consent';

const containerStyle: CSSProperties = {
  background: 'white',
  color: 'rgba(0, 0, 0, 0.75)',
  fontSize: '0.9rem',
  boxShadow: '0px 0px 15px 0px hsla(0, 0%, 0%, 0.2)',
};

const contentStyle: CSSProperties = {
  margin: '1rem',
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
      onDecline={() => {
        window['ga-disable-GA_MEASUREMENT_ID'] = true;
      }}
      style={containerStyle}
      contentStyle={contentStyle}
      buttonStyle={acceptButtonStyle}
      declineButtonStyle={declineButtonStyle}
    >
      {t('cookie_consent.content')}
    </CookieConsent>
  );
};

export default CookieConsentBar;
