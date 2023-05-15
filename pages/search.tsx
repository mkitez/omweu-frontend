import useSWR from 'swr';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Card } from 'antd';
import { API_URL } from '../utils/constants';
import type { Trip } from '../components/Trips';
import TripSearch from '../components/TripSearch';
import styles from '../styles/Search.module.css';

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
        <Card hoverable style={{ marginBottom: 10 }}>
          <Card.Meta
            title={new Date(trip.date).toLocaleTimeString(i18n.language, {
              timeStyle: 'short',
            })}
            description={
              <div>
                <div>
                  {trip.origin.name} &mdash; {trip.dest.name}
                </div>
                <div className={styles.driver}>
                  <div className={styles.imgContainer}>
                    <Image
                      src={trip.driver.photo}
                      width={100}
                      height={100}
                      alt=""
                    />
                  </div>
                  <div className={styles.driverName}>
                    {trip.driver.first_name}
                  </div>
                </div>
              </div>
            }
          />
        </Card>
      </Link>
    ));
  }

  return (
    <div className="content">
      <TripSearch />
      {searchResults}
    </div>
  );
};

export const getServerSideProps = async ({ locale }: any) => {
  const translations = await serverSideTranslations(locale, ['common']);
  return {
    props: {
      ...translations,
    },
  };
};

export default Search;
