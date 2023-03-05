import type { ReactElement, ReactNode } from 'react';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth';
import { appWithTranslation } from 'next-i18next';
import AppLayout from '../components/AppLayout';
import '../styles/globals.css';
import 'antd/dist/reset.css';

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
      {getLayout(<Component {...pageProps} />)}
    </SessionProvider>
  );
}

export default appWithTranslation(MyApp);
