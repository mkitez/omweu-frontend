import useSWR from 'swr';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { Descriptions } from 'antd';
import api from '../../services/api';
import AuthService from '../../services/auth.service';
import { getServerSideProps } from '../dashboard/trips';
import styles from '../../styles/Trip.module.css';
import { useSession } from 'next-auth/react';
import TripDetails from '../../components/TripDetails';

const formatDate = (date: Date, lang: string) => {
  const [weekday, comma, ...rest] = new Intl.DateTimeFormat(lang, {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
  }).formatToParts(date);
  return [rest.map((v) => v.value).join(''), comma.value, weekday.value].join(
    ''
  );
};

const Trip = () => {
  const { data: session } = useSession({ required: true });
  const router = useRouter();
  const { t, i18n } = useTranslation(['trip', 'common']);
  const { data, error, isLoading } = useSWR(
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

  if (isLoading) {
    return <div className="content">{t('loading', { ns: 'common' })}</div>;
  }

  if (error) {
    return (
      <div className="content">{t('errors.common', { ns: 'common' })}</div>
    );
  }

  const date = new Date(data.date);
  return (
    <div className="container">
      <div className={styles.root}>
        <h1>
          {t('tripDetails')} {formatDate(date, i18n.language)}
        </h1>
        <TripDetails trip={data} />
      </div>
    </div>
  );
};

Trip.auth = true;

export { getServerSideProps };

export default Trip;
