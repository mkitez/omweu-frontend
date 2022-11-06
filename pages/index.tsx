import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import DestinationSearch from '../components/DestinationSearch';
import { vkRedirectUrl, vkClientId } from '../utils/constants';
import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>omw EU</title>
        <meta name="description" content="omw EU" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Link href="/login">Login</Link>
      <Link href="/register">Register</Link>
      <Link href="/dashboard">Dashboard</Link>
      <a
        href={`https://oauth.vk.com/authorize?client_id=${vkClientId}&redirect_uri=${vkRedirectUrl}&scope=email`}
      >
        VK Auth
      </a>
      <DestinationSearch />
    </div>
  );
};

export default Home;
