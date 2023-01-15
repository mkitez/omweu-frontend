import Head from 'next/head';
import TripSearch from '../components/TripSearch';
import styles from '../styles/Home.module.css';

const Home = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>omw EU</title>
        <meta name="description" content="omw EU" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <TripSearch />
    </div>
  );
};

export default Home;
