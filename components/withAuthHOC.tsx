import { signOut, useSession } from 'next-auth/react';
import { AppProps } from 'next/app';
import { NextComponentType, NextPageContext } from 'next/types';
import { useEffect } from 'react';

const withAuth = (Component: NextComponentType<NextPageContext, any, any>) => {
  const Auth = (props: AppProps['pageProps']) => {
    const { data: session, status } = useSession({ required: true });
    useEffect(() => {
      if (status === 'loading') {
        return;
      }
      if (session === null || session?.error) {
        signOut({ callbackUrl: '/' });
      }
    });

    if (status === 'loading' || session?.error) {
      return null;
    }

    return <Component {...props} />;
  };

  if (Component.getInitialProps) {
    Auth.getInitialProps = Component.getInitialProps;
  }

  return Auth;
};

export default withAuth;
