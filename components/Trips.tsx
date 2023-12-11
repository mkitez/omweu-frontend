import useSWR from 'swr';
import { useSession } from 'next-auth/react';
import { List, Tooltip } from 'antd';
import Link from 'next/link';
import dayjs from 'dayjs';
import api from '../services/api';
import { useTranslation } from 'next-i18next';
import { LoadingOutlined, CopyOutlined } from '@ant-design/icons';
import styles from '../styles/Trips.module.css';

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  photo: string;
  phone_number: string;
  telegram_username: string;
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
  description: string;
  route_stops: Destination[];
}

const Trips = () => {
  const { data: session } = useSession();
  const { t, i18n } = useTranslation(['dashboard', 'common']);
  const {
    data: trips,
    error,
    isLoading,
  } = useSWR<Trip[]>('/trips/', async (url) => {
    const response = await api.get(url, {
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
        'Accept-Language': i18n.language,
      },
    });
    return response.data;
  });

  return (
    <div className={styles.root}>
      {(() => {
        if (error) {
          return (
            <div className={styles.errorLoadingContainer}>
              {t('errors.common', { ns: 'common' })}
            </div>
          );
        }
        if (isLoading) {
          return (
            <div className={styles.errorLoadingContainer}>
              <LoadingOutlined style={{ fontSize: '2rem' }} />
            </div>
          );
        }
        if (trips?.length === 0) {
          return <div>{t('trips.noTrips')}</div>;
        }
        return (
          <List
            itemLayout="horizontal"
            size="small"
            dataSource={trips
              ?.slice()
              .sort((tripA, tripB) =>
                dayjs(tripB.date).diff(dayjs(tripA.date))
              )}
            renderItem={(trip) => (
              <List.Item
                className={styles.row}
                actions={[
                  <Tooltip key={trip.id} title={t('trips.copyTrip')}>
                    <Link
                      href={{
                        pathname: '/tripcopy',
                        query: { tripId: trip.id },
                      }}
                    >
                      <CopyOutlined />
                    </Link>
                  </Tooltip>,
                ]}
              >
                <List.Item.Meta
                  title={
                    <Link key="trip-edit" href={`/tripedit/${trip.id}`}>
                      {trip.origin.name} – {trip.dest.name}
                    </Link>
                  }
                  description={new Date(trip.date).toLocaleString(
                    i18n.language
                  )}
                />
              </List.Item>
            )}
          />
        );
      })()}
    </div>
  );
};

export default Trips;
