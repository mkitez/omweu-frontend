import Head from 'next/head';
import Link from 'next/link';
import DestinationSearch from '../components/DestinationSearch';
import styles from '../styles/Home.module.css';
import { signIn, useSession } from 'next-auth/react';

const Home = () => {
  const { data: session, status } = useSession();
  return (
    <div className={styles.container}>
      <Head>
        <title>omw EU</title>
        <meta name="description" content="omw EU" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {status === 'loading' && null}
      {status === 'authenticated' && <Link href="/dashboard">Dashboard</Link>}
      {status === 'unauthenticated' && (
        <>
          <button
            onClick={() => signIn(undefined, { callbackUrl: '/dashboard' })}
          >
            Sign in
          </button>
          <Link href="/signup">Sign up</Link>{' '}
        </>
      )}
      <DestinationSearch />
    </div>
  );
};

export default Home;
