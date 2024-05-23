import { LoadingOutlined } from '@ant-design/icons';
import { App } from 'antd';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import useSWR from 'swr';

import TripEditForm, { getCarValue } from '../../components/TripEditForm';
import { Trip } from '../../components/Trips';
import { useTripApi } from '../../hooks/api/useTripApi';
import { useAuthorizedFetcher } from '../../hooks/useAuthorizedFetcher';
import styles from '../../styles/TripEdit.module.css';
import { getServerSideProps } from '../dashboard/trips';

const TripEdit = () => {
  const api = useTripApi();
  const fetcher = useAuthorizedFetcher();
  const router = useRouter();
  const { t } = useTranslation(['dashboard', 'common']);
  const { message } = App.useApp();
  const { data, error, isLoading } = useSWR<Trip>(
    router.isReady ? `/trips/${router.query.tripId}/` : null,
    fetcher
  );

  return (
    <div className="container">
      <Head>
        <title>{`${t('trips.editTitle')} | EUbyCar.com`}</title>
      </Head>
      <div className={styles.root}>
        <h1>{t('trips.editTitle')}</h1>
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
          if (!data) {
            return null;
          }
          return (
            <TripEditForm
              initialOrigin={data.origin}
              initialDest={data.dest}
              initialRouteStops={data.route_stops}
              initialDate={data.date}
              initialPrice={data.price}
              initialCar={data.car ? getCarValue(data.car) : undefined}
              initialDescription={data.description}
              submitValue={t('save', { ns: 'common' })}
              submit={async (data) => {
                const tripResponse = await api.updateTrip(
                  Number(router.query.tripId),
                  data
                );
                const tripData = tripResponse.data;
                message.success(t('notifications.trip_update'));
                router.push(`/trips/${tripData.id}`);
              }}
            />
          );
        })()}
      </div>
    </div>
  );
};

TripEdit.auth = true;

export default TripEdit;

export { getServerSideProps };
