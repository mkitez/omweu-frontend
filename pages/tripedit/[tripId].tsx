import useSWR from 'swr';
import { useRouter } from 'next/router';
import TripEditForm from '../../components/TripEditForm';
import TripService from '../../services/trip.service';
import { getServerSideProps } from '../dashboard';
import { Session } from 'next-auth';
import withAuth from '../../components/withAuthHOC';
import api from '../../services/api';

const TripEdit = ({ session }: { session: Session }) => {
  const router = useRouter();
  const { data, error, isLoading } = useSWR(
    router.isReady ? `/trips/${router.query.tripId}/` : null,
    async (url) => {
      const response = await api.get(url);
      return response.data;
    }
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!data) {
    return null;
  }

  return (
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
  );
};

export default withAuth(TripEdit);

export { getServerSideProps };
