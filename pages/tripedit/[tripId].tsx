import useSWR from 'swr';
import { useRouter } from 'next/router';
import TripEditForm from '../../components/TripEditForm';
import TripService from '../../services/trip.service';
import { getServerSideProps } from '../dashboard/trips';
import api from '../../services/api';
import AuthService from '../../services/auth.service';
import { useTranslation } from 'next-i18next';
import { useSession } from 'next-auth/react';
import { LoadingOutlined } from '@ant-design/icons';
import { Trip } from '../../components/Trips';
import styles from '../../styles/TripEdit.module.css';
import Head from 'next/head';

const TripEdit = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const { t, i18n } = useTranslation(['dashboard', 'common']);
  const { data, error, isLoading } = useSWR<Trip>(
    router.isReady ? `/trips/${router.query.tripId}/` : null,
    async (url) => {
      const response = await api.get(url, {
        headers: {
          ...AuthService.getAuthHeaders(session?.accessToken as string),
          'Accept-Language': i18n.language,
        },
      });
      return response.data;
    }
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
              initialDate={data.date}
              initialPrice={data.price}
              initialDescription={data.description}
              submitValue={t('save', { ns: 'common' })}
              submit={async (data: any) => {
                await TripService.updateTrip(
                  router.query.tripId,
                  data,
                  session?.accessToken as string
                );
                router.push('/dashboard');
              }}
              onDelete={async () => {
                await TripService.deleteTrip(
                  router.query.tripId,
                  session?.accessToken as string
                );
                router.push('/dashboard');
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
