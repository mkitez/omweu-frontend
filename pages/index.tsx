import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import DestinationSearch from '../components/DestinationSearch';
import { useAppSelector } from '../redux/hooks';
import { vkRedirectUrl, vkClientId } from '../utils/constants';
import styles from '../styles/Home.module.css';
import { selectRefreshTokenData } from '../redux/authSlice';

const Home: NextPage = () => {
  const userData = useAppSelector(selectRefreshTokenData());
  return (
    <div className={styles.container}>
      <Head>
        <title>omw EU</title>
        <meta name="description" content="omw EU" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {userData && <Link href="/dashboard">Dashboard</Link>}
      {!userData && (
        <>
          <Link href="/login">Login</Link>{' '}
          <Link href="/register">Register</Link>{' '}
          <a
            href={`https://oauth.vk.com/authorize?client_id=${vkClientId}&redirect_uri=${vkRedirectUrl}&scope=email`}
          >
            VK Auth
          </a>
        </>
      )}
      <DestinationSearch />
    </div>
  );
};

export default Home;
