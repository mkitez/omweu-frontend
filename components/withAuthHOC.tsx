import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { NextComponentType, NextPageContext } from 'next/types';
import { useEffect } from 'react';
import { selectAuthStatus, selectRefreshTokenData } from '../redux/authSlice';
import { useAppSelector } from '../redux/hooks';

const withAuth = (Component: NextComponentType<NextPageContext, any, any>) => {
  const Auth = (props: AppProps['pageProps']) => {
    const authReady = useAppSelector(selectAuthStatus());
    const userData = useAppSelector(selectRefreshTokenData());
    const router = useRouter();
    useEffect(() => {
      if (!router.isReady) {
        return;
      }
      if (authReady && userData === null) {
        router.push({
          pathname: '/login',
          query: { returnUrl: router.pathname },
        });
      }
    }, [router, authReady, userData]);

    if (!authReady || userData === null) {
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
