import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { ReactElement, ReactNode } from 'react';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth';
import { ConfigProvider } from 'antd';
import { appWithTranslation } from 'next-i18next';
import AppLayout from '../components/AppLayout';
import AuthWrapper from '../components/AuthWrapper';
import { StyleProvider } from '@ant-design/cssinjs';
import theme from '../theme';
import '../styles/globals.css';
import 'antd/dist/reset.css';

import type { Locale } from 'antd/lib/locale';
import ru from 'antd/locale/ru_RU';
import 'dayjs/locale/ru';

dayjs.extend(utc);
dayjs.extend(timezone);

const locales: Record<string, Locale> = {
  ru,
};

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
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
  const getLayout =
    Component.getLayout ?? ((page) => <AppLayout>{page}</AppLayout>);
  return (
    <SessionProvider session={pageProps.session}>
      <ConfigProvider locale={locales[locale as string]} theme={theme}>
        <StyleProvider ssrInline>
          <Head>
            <title>EUbyCar.com</title>
            <link rel="icon" href="/favicon.png" />
          </Head>
          {Component.auth ? (
            <AuthWrapper>{getLayout(<Component {...pageProps} />)}</AuthWrapper>
          ) : (
            getLayout(<Component {...pageProps} />)
          )}
        </StyleProvider>
      </ConfigProvider>
    </SessionProvider>
  );
}

export default appWithTranslation(MyApp);
