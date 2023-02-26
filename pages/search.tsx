import useSWR from 'swr';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Card } from 'antd';
import { API_URL } from '../utils/constants';
import type { Trip } from '../components/Trips';
import TripSearch from '../components/TripSearch';

const Search = () => {
  const router = useRouter();
  const { i18n } = useTranslation('common');
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
    searchResults = <div>Searching...</div>;
  } else if (error) {
    searchResults = <div>Error: {error}</div>;
  } else if (data.results.length === 0) {
    searchResults = <div>No results</div>;
  } else {
    searchResults = data.results.map((trip: Trip) => (
      <Link href={`/trips/${trip.id}`} key={trip.id}>
        <Card hoverable style={{ marginBottom: 10 }}>
          <Card.Meta
            title={`${trip.origin.name} - ${trip.dest.name}`}
            description={trip.date}
          />
        </Card>
      </Link>
    ));
  }

  return (
    <div>
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
