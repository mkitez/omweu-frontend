import dayjs from 'dayjs';
import { GetServerSideProps } from 'next';
import { Trans, useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useSWR from 'swr';

import InlineTrip from '../components/InlineTrip';
import NotifyMe from '../components/NotifyMe';
import PreFooter from '../components/PreFooter';
import type { Trip } from '../components/Trips';
import TripSearch from '../components/TripSearch';
import { usePublicFetcher } from '../hooks/usePublicFetcher';
import styles from '../styles/Search.module.css';
import { formatDate } from '../utils/formatDate';
import { NextPageWithLayout } from './_app';

type SearchResult = {
  count: number;
  next: number | null;
  previous: number | null;
  results: Trip[];
};

const SearchPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { t, i18n } = useTranslation('common');
  const fetcher = usePublicFetcher();
  const { data, error, isLoading } = useSWR<SearchResult>(
    `/trips/search/?origin_id=${router.query.from}&dest_id=${router.query.to}&date=${router.query.date}`,
    fetcher
  );

  const formattedDateWeekday = formatDate(
    new Date(router.query.date as string),
    i18n.language
  );
  const formattedDateFull = dayjs(router.query.date as string)
    .locale(i18n.language)
    .format('ll');

  const route = `${router.query.from_input} – ${router.query.to_input}`;
  const title = `${t('search_title')}${
    router.query.from_input && router.query.to_input
      ? ` ${route} ${formattedDateWeekday}`
      : ''
  } | EUbyCar.com`;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta
          name="description"
          content={`${t('search_description')} ${route} ${formattedDateFull}`}
        />
      </Head>
      <div className={styles.searchContainer}>
        <TripSearch />
      </div>
      <div className={styles.root}>
        <div className={styles.result}>
          <h2>
            {t('tripsFound')} {formattedDateWeekday}
          </h2>
          {(() => {
            if (isLoading) {
              return <div className={styles.statusText}>{t('searching')}</div>;
            }
            if (error) {
              return (
                <div className={styles.statusText}>{t('errors.common')}</div>
              );
            }
            if (data?.results.length === 0) {
              return (
                <div className={styles.statusText}>{t('tripsNotFound')}</div>
              );
            }
            return data?.results.map((trip) => (
              <Link href={`/trips/${trip.id}`} key={trip.id}>
                <InlineTrip trip={trip} showPrice showDriver />
              </Link>
            ));
          })()}
          <NotifyMe />
        </div>
      </div>
      <PreFooter>
        <Trans values={{ route, date: formattedDateFull }}>
          {t('search_footer')}
        </Trans>
      </PreFooter>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  const translations = await serverSideTranslations(locale as string, [
    'common',
    'trip',
  ]);
  return {
    props: {
      ...translations,
    },
  };
};

export default SearchPage;
