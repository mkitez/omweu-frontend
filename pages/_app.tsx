import { ReactElement, ReactNode } from 'react';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth';
import { ConfigProvider } from 'antd';
import { appWithTranslation } from 'next-i18next';
import AppLayout from '../components/AppLayout';
import AuthWrapper from '../components/AuthWrapper';
import '../styles/globals.css';
import 'antd/dist/reset.css';
import { StyleProvider } from '@ant-design/cssinjs';

import type { Locale } from 'antd/lib/locale';
import ru from 'antd/locale/ru_RU';
import 'dayjs/locale/ru';
import theme from '../theme';

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
