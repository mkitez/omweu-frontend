import { InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import { SSRConfig, useTranslation } from 'next-i18next';
import api from '../../services/api';
import styles from '../../styles/Trip.module.css';
import TripDetails from '../../components/TripDetails';
import { GetServerSideProps } from 'next';
import { Session, unstable_getServerSession } from 'next-auth';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { authOptions } from '../api/auth/[...nextauth]';
import axios from 'axios';
import type { Trip } from '../../components/Trips';
import Error from 'next/error';
import Link from 'next/link';
import dayjs from 'dayjs';
import { formatDate } from '../../utils/formatDate';
import { LeftOutlined } from '@ant-design/icons';
import InlineBooking from '../../components/InlineBooking';
import { useIsAuthenticatedUser } from '../../hooks/useIsAuthenticatedUser';

const BackButton = ({ trip }: { trip: Trip }) => {
  const { t } = useTranslation('trip');
  const { origin, dest } = trip;
  const fromInput = `${origin.name}, ${origin.country_name}`;
  const toInput = `${dest.name}, ${dest.country_name}`;
  const formattedDate = dayjs(trip.date).format('YYYY-MM-DD');

  return (
    <div className={styles.back}>
      <Link
        href={`/search?from=${origin.place_id}&to=${dest.place_id}&date=${formattedDate}&from_input=${fromInput}&to_input=${toInput}`}
      >
        <LeftOutlined /> {t('back')} {origin.name} – {dest.name}
      </Link>
    </div>
  );
};

const TripDetailsPage = ({
  trip,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { t, i18n } = useTranslation(['trip', 'common']);
  const isCurrentUserDriver = useIsAuthenticatedUser(trip?.driver);

  if (trip === null) {
    return <Error statusCode={500} />;
  }

  const formattedDate = formatDate(new Date(trip.date), i18n.language);
  return (
    <>
      <Head>
        <title>{`${t('title')} ${trip.origin.name} – ${
          trip.dest.name
        } ${formattedDate} | EUbyCar.com`}</title>
      </Head>
      <div className="container">
        <div className={styles.root}>
          <BackButton trip={trip} />
          <h1>
            {t('title')} {formattedDate}
          </h1>
          <TripDetails trip={trip} />
          {!isCurrentUserDriver && <InlineBooking tripId={trip.id} />}
        </div>
      </div>
    </>
  );
};

type Props = {
  trip: Trip | null;
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
    'booking',
  ]);

  const session = await unstable_getServerSession(req, res, authOptions);

  let notFound = false;
  let trip: Trip | null = null;
  try {
    const tripResponse = await api.get(`/trips/${params?.tripId}/`, {
      headers: {
        Authorization: session ? `Bearer ${session.accessToken}` : undefined,
        'Accept-Language': locale,
      },
    });
    trip = tripResponse.data;
  } catch (e) {
    if (axios.isAxiosError(e) && e.response?.status === 404) {
      notFound = true;
    }
  }

  return {
    notFound,
    props: {
      ...translations,
      session,
      trip,
    },
  };
};

export default TripDetailsPage;
