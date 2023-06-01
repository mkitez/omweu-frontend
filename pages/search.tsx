import { GetServerSideProps } from 'next';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { API_URL } from '../utils/constants';
import type { Trip } from '../components/Trips';
import TripSearch from '../components/TripSearch';
import styles from '../styles/Search.module.css';
import InlineTrip from '../components/InlineTrip';

const Search = () => {
  const router = useRouter();
  const { t, i18n } = useTranslation('common');
  const { data, error, isLoading } = useSWR(
    `${API_URL}/trips/search/?origin_id=${router.query.from}&dest_id=${router.query.to}&date=${router.query.date}`,
    async (url) => {
      const response = await fetch(url, {
        headers: { 'Accept-Language': i18n.language },
      });
      return await response.json();
    }
  );

  let searchResults;
  if (isLoading) {
    searchResults = <div>{t('searching')}</div>;
  } else if (error) {
    searchResults = <div>{t('errors.common')}</div>;
  } else if (data.results.length === 0) {
    searchResults = <div>{t('tripsNotFound')}</div>;
  } else {
    searchResults = data.results.map((trip: Trip) => (
      <Link href={`/trips/${trip.id}`} key={trip.id}>
        <InlineTrip trip={trip} />
      </Link>
    ));
  }

  return (
    <div className={styles.root}>
      <TripSearch />
      {searchResults}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  const translations = await serverSideTranslations(locale as string, [
    'common',
  ]);
  return {
    props: {
      ...translations,
    },
  };
};

export default Search;
