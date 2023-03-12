import { signOut, useSession } from 'next-auth/react';
import { AppProps } from 'next/app';
import { useEffect } from 'react';

const withAuth = (Component: any) => {
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

  if (Component.getLayout) {
    Auth.getLayout = Component.getLayout;
  }

  return Auth;
};

export default withAuth;
