import type { ReactElement, ReactNode } from 'react';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth';
import { ConfigProvider } from 'antd';
import { appWithTranslation } from 'next-i18next';
import AppLayout from '../components/AppLayout';
import '../styles/globals.css';
import 'antd/dist/reset.css';

import localeRu from 'antd/locale/ru_RU';
import 'dayjs/locale/ru';

const locales: Record<string, typeof localeRu> = {
  ru: localeRu,
};

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

interface MyAppProps {
  session: Session;
}

type AppPropsWithLayout = AppProps &
  MyAppProps & {
    Component: NextPageWithLayout;
  };

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout =
    Component.getLayout ?? ((page) => <AppLayout>{page}</AppLayout>);
  return (
    <SessionProvider session={pageProps.session}>
      <ConfigProvider locale={locales[pageProps._nextI18Next?.initialLocale]}>
        {getLayout(<Component {...pageProps} />)}
      </ConfigProvider>
    </SessionProvider>
  );
}

export default appWithTranslation(MyApp);
