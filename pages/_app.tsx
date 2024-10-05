import { StyleProvider } from '@ant-design/cssinjs';
import { GoogleAnalytics } from '@next/third-parties/google';
import { App as AntApp, ConfigProvider } from 'antd';
import 'antd/dist/reset.css';
import type { Locale } from 'antd/lib/locale';
import ru from 'antd/locale/ru_RU';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import type { NextPage } from 'next';
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { appWithTranslation } from 'next-i18next';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ReactElement, ReactNode, useEffect } from 'react';
import { getCookieConsentValue } from 'react-cookie-consent';

import AppLayout from '../components/AppLayout';
import AuthWrapper from '../components/AuthWrapper';
import CookieConsentBar from '../components/CookieConsentBar';
import NotificationProvider from '../components/NotificationProvider';
import '../styles/globals.css';
import theme from '../theme';
import { GA_DISABLE_PROPERTY, GTM_ID } from '../utils/constants';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(localizedFormat);

const locales: Record<string, Locale> = {
  ru,
};

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement, pageProps?: P) => ReactNode;
  auth?: boolean;
};

interface MyAppProps {
  session: Session;
}

type AppPropsWithLayout = AppProps &
  MyAppProps & {
    Component: NextPageWithLayout;
  };

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const { locale } = useRouter();
  useEffect(() => {
    const consentValue = getCookieConsentValue();
    if (consentValue !== 'true') {
      window[GA_DISABLE_PROPERTY] = true;
    }
  }, []);

  const getLayout =
    Component.getLayout ?? ((page) => <AppLayout>{page}</AppLayout>);

  return (
    <SessionProvider session={pageProps.session}>
      <ConfigProvider locale={locales[locale as string]} theme={theme}>
        <AntApp>
          <StyleProvider ssrInline>
            <Head>
              <title>EUbyCar.com</title>
              <link rel="icon" href="/favicon.png" />
            </Head>
            <NotificationProvider>
              {Component.auth ? (
                <AuthWrapper>
                  {getLayout(<Component {...pageProps} />, pageProps)}
                </AuthWrapper>
              ) : (
                getLayout(<Component {...pageProps} />, pageProps)
              )}
            </NotificationProvider>
            <CookieConsentBar />
            <GoogleAnalytics gaId={GTM_ID} />
          </StyleProvider>
        </AntApp>
      </ConfigProvider>
    </SessionProvider>
  );
}

export default appWithTranslation(MyApp);
