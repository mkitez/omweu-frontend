import useSWR from 'swr';
import { useSession } from 'next-auth/react';
import { List } from 'antd';
import Link from 'next/link';
import dayjs from 'dayjs';
import { API_URL } from '../utils/constants';
import api from '../services/api';
import { useTranslation } from 'next-i18next';
import styles from '../styles/Trips.module.css';

export interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  photo: string;
}

export interface Destination {
  place_id: string;
  name: string;
  country_name: string;
}

export interface Trip {
  id: number;
  origin: Destination;
  dest: Destination;
  date: string;
  date_created: string;
  driver: User;
  price: string;
}

const Trips = () => {
  const { data: session } = useSession({ required: true });
  const { t, i18n } = useTranslation(['dashboard', 'common']);
  const {
    data: trips,
    error,
    isLoading,
  } = useSWR<Trip[]>(`${API_URL}/trips/`, async (url) => {
    const response = await api.get(url, {
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
        'Accept-Language': i18n.language,
      },
    });
    return response.data;
  });

  if (error) {
    return <div>{t('errors.common', { ns: 'common' })}</div>;
  }

  if (isLoading) {
    return <div>{t('loading', { ns: 'common' })}</div>;
  }

  return (
    <div style={{ marginBottom: 10 }}>
      {trips && trips.length > 0 ? (
        <List
          itemLayout="horizontal"
          size="small"
          dataSource={trips
            .slice()
            .sort((tripA, tripB) => dayjs(tripB.date).diff(dayjs(tripA.date)))}
          renderItem={(trip) => (
            <List.Item className={styles.row}>
              <List.Item.Meta
                title={
                  <Link key="trip-edit" href={`/tripedit/${trip.id}`}>
                    {trip.origin.name} - {trip.dest.name}
                  </Link>
                }
                description={new Date(trip.date).toLocaleString(i18n.language)}
              />
            </List.Item>
          )}
        />
      ) : (
        <div>{t('trips.noTrips')}</div>
      )}
    </div>
  );
};

export default Trips;
