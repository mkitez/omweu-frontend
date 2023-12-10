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
import Head from 'next/head';
import { formatDate } from '../utils/formatDate';

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

  const title = `${t('searchTitle')}${
    router.query.from_input && router.query.to_input
      ? ` ${router.query.from_input} – ${router.query.to_input}`
      : ''
  } | EUbyCar.com`;

  const formattedDate = formatDate(
    new Date(router.query.date as string),
    i18n.language
  );

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div className={styles.root}>
        <TripSearch />
        <div className={styles.result}>
          {(() => {
            if (isLoading) {
              return t('searching');
            } else if (error) {
              return t('errors.common');
            } else if (data.results.length === 0) {
              return t('tripsNotFound');
            } else {
              return (
                <>
                  <h2>
                    {t('tripsFound')} {formattedDate}
                  </h2>
                  {data.results.map((trip: Trip) => (
                    <Link href={`/trips/${trip.id}`} key={trip.id}>
                      <InlineTrip trip={trip} />
                    </Link>
                  ))}
                </>
              );
            }
          })()}
        </div>
      </div>
    </>
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
