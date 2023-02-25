import useSWR from 'swr';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { API_URL } from '../utils/constants';

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

  useEffect(() => {
    if (!router.isReady) {
      return;
    }
  }, [router.isReady, router.query]);

  if (isLoading) {
    return <div>Searching...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (data.results.length === 0) {
    return <div>No results</div>;
  }

  return (
    <ul>
      {data.results.map((trip: any) => (
        <li key={trip.id}>
          {trip.origin.name} - {trip.dest.name}
        </li>
      ))}
    </ul>
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
