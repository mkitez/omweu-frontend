import useSWR from 'swr';
import { useRouter } from 'next/router';
import TripEditForm from '../../components/TripEditForm';
import TripService from '../../services/trip.service';
import { getServerSideProps } from '../dashboard/trips';
import { Session } from 'next-auth';
import withAuth from '../../components/withAuthHOC';
import api from '../../services/api';
import AuthService from '../../services/auth.service';
import { useTranslation } from 'next-i18next';

const TripEdit = ({ session }: { session: Session }) => {
  const router = useRouter();
  const { t, i18n } = useTranslation(['dashboard', 'common']);
  const { data, error, isLoading } = useSWR(
    router.isReady ? `/trips/${router.query.tripId}/` : null,
    async (url) => {
      const response = await api.get(url, {
        headers: {
          ...AuthService.getAuthHeaders(session.accessToken as string),
          'Accept-Language': i18n.language,
        },
      });
      return response.data;
    }
  );

  if (error) {
    return <div>{t('errors.common', { ns: 'common' })}</div>;
  }

  if (isLoading) {
    return <div>{t('loading', { ns: 'common' })}</div>;
  }

  if (!data) {
    return null;
  }

  return (
    <div className="content">
      <h2>{t('trips.editTitle')}</h2>
      <TripEditForm
        initialOrigin={data.origin}
        initialDest={data.dest}
        initialDate={data.date}
        submitValue={t('save', { ns: 'common' })}
        submit={async (data: any) => {
          await TripService.updateTrip(
            router.query.tripId,
            data,
            session.accessToken as string
          );
          router.push('/dashboard');
        }}
        onDelete={async () => {
          await TripService.deleteTrip(
            router.query.tripId,
            session.accessToken as string
          );
          router.push('/dashboard');
        }}
      />
    </div>
  );
};

export default withAuth(TripEdit);

export { getServerSideProps };
