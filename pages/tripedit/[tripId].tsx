import useSWR from 'swr';
import { useRouter } from 'next/router';
import TripEditForm from '../../components/TripEditForm';
import TripService from '../../services/trip.service';
import { getServerSideProps } from '../dashboard/trips';
import { Session } from 'next-auth';
import withAuth from '../../components/withAuthHOC';
import api from '../../services/api';
import AuthService from '../../services/auth.service';

const TripEdit = ({ session }: { session: Session }) => {
  const router = useRouter();
  const { data, error, isLoading } = useSWR(
    router.isReady ? `/trips/${router.query.tripId}/` : null,
    async (url) => {
      const response = await api.get(url, {
        headers: AuthService.getAuthHeaders(session.accessToken as string),
      });
      return response.data;
    }
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!data) {
    return null;
  }

  return (
    <div className="content">
      <h2>Редактирование поездки</h2>
      <TripEditForm
        initialOrigin={data.origin}
        initialDest={data.dest}
        initialDate={data.date}
        submitValue="Save"
        submit={async (data: any) => {
          await TripService.updateTrip(
            router.query.tripId,
            data,
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
