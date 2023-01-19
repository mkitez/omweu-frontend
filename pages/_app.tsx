import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth';
import AppLayout from '../components/AppLayout';
import 'antd/dist/reset.css';

interface MyAppProps {
  session: Session;
}

function MyApp({ Component, pageProps }: AppProps<MyAppProps>) {
  return (
    <SessionProvider session={pageProps.session}>
      <AppLayout>
        <Component {...pageProps} />
      </AppLayout>
    </SessionProvider>
  );
}

export default MyApp;
