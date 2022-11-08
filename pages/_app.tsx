import '../styles/globals.css';
import { Provider } from 'react-redux';
import { useEffect, FC, PropsWithChildren } from 'react';
import { store as appStore } from '../redux/store';
import TokenService from '../services/token.service';
import type { AppProps } from 'next/app';

const AuthWrapper: FC<PropsWithChildren> = ({ children }) => {
  useEffect(() => {
    TokenService.restoreTokenDataFromLocalStorage();
  }, []);
  return <>{children}</>;
};

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={appStore}>
      <AuthWrapper>
        <Component {...pageProps} />
      </AuthWrapper>
    </Provider>
  );
}

export default MyApp;
