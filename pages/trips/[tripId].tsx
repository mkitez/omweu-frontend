import Head from 'next/head';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import api from '../../services/api';
import AuthService from '../../services/auth.service';
import { getServerSideProps } from '../dashboard/trips';
import styles from '../../styles/Trip.module.css';
import { useSession } from 'next-auth/react';
import TripDetails from '../../components/TripDetails';
import { Button } from 'antd';

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

  let content;
  if (isLoading) {
    content = (
      <div className={styles.loadingErrorContainer}>
        {t('loading', { ns: 'common' })}
      </div>
    );
  } else if (error) {
    content = (
      <div className={styles.loadingErrorContainer}>
        {t('errors.common', { ns: 'common' })}
      </div>
    );
  } else {
    content = <TripDetails trip={data} />;
  }

  return (
    <>
      <Head>
        <title>{`${t('title')} ${
          data
            ? `${data.origin.name} – ${data.dest.name} ${formatDate(
                new Date(data.date),
                i18n.language
              )}`
            : ''
        } | EUbyCar.com`}</title>
      </Head>
      <div className="container">
        <div className={styles.root}>
          <div className={styles.back}>
            <Button type="link" onClick={() => router.back()}>
              &lt; {t('back')}
            </Button>
          </div>
          <h1>
            {t('title')}{' '}
            {data?.date ? formatDate(new Date(data.date), i18n.language) : ''}
          </h1>
          {content}
        </div>
      </div>
    </>
  );
};

Trip.auth = true;

export { getServerSideProps };

export default Trip;
