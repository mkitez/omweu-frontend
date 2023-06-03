import { InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { SSRConfig, useTranslation } from 'next-i18next';
import api from '../../services/api';
import styles from '../../styles/Trip.module.css';
import TripDetails from '../../components/TripDetails';
import { Button } from 'antd';
import { GetServerSideProps } from 'next';
import { Session, unstable_getServerSession } from 'next-auth';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { authOptions } from '../api/auth/[...nextauth]';
import axios from 'axios';
import type { Trip as TripType } from '../../components/Trips';
import Error from 'next/error';

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

const Trip = ({
  trip: data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const { t, i18n } = useTranslation(['trip', 'common']);

  if (data === null) {
    return <Error statusCode={500} />;
  }

  const formattedDate = formatDate(new Date(data.date), i18n.language);
  return (
    <>
      <Head>
        <title>{`${t('title')} ${data.origin.name} – ${
          data.dest.name
        } ${formattedDate} | EUbyCar.com`}</title>
      </Head>
      <div className="container">
        <div className={styles.root}>
          <div className={styles.back}>
            <Button type="link" onClick={() => router.back()}>
              &lt; {t('back')}
            </Button>
          </div>
          <h1>
            {t('title')} {formattedDate}
          </h1>
          <TripDetails trip={data} />
        </div>
      </div>
    </>
  );
};

Trip.auth = true;

type Props = {
  trip: TripType | null;
  session: Session | null;
} & SSRConfig;

export const getServerSideProps: GetServerSideProps<Props> = async ({
  req,
  res,
  locale,
  params,
}) => {
  const translations = await serverSideTranslations(locale as string, [
    'common',
    'dashboard',
    'trip',
  ]);

  const session = await unstable_getServerSession(req, res, authOptions);

  let trip: TripType | null = null;
  if (session) {
    try {
      const tripResponse = await api.get(`/trips/${params?.tripId}/`, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          'Accept-Language': locale,
        },
      });
      trip = tripResponse.data;
    } catch (e) {
      if (axios.isAxiosError(e) && e.response?.status === 404) {
        return {
          notFound: true,
          props: {
            ...translations,
            session,
          },
        };
      }
    }
  }

  return {
    props: {
      ...translations,
      session,
      trip,
    },
  };
};

export default Trip;
