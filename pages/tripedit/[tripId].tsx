import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import TripEditForm from '../../components/TripEditForm';
import TripService from '../../services/trip.service';
import { getServerSideProps } from '../dashboard';
import { Session } from 'next-auth';
import withAuth from '../../components/withAuthHOC';

const TripEdit = ({ session }: { session: Session }) => {
  const router = useRouter();

  const [isLoading, setLoading] = useState(false);
  const [tripData, setTripData] = useState<any>(null);
  const [error, setError] = useState('');
  useEffect(() => {
    if (!router.isReady) {
      return;
    }
    const fetchData = async () => {
      const { tripId } = router.query;
      setLoading(true);
      try {
        const tripData = await TripService.getTripDetails(tripId);
        setLoading(false);
        setTripData(tripData);
      } catch (error: any) {
        setLoading(false);
        setError(error.message);
      }
    };
    fetchData();
  }, [router]);

  if (tripData === null) {
    return null;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <TripEditForm
        initialOrigin={tripData.origin}
        initialDest={tripData.dest}
        initialDate={tripData.date}
        submitValue="Save"
        submit={async (data: any) => {
          await TripService.updateTrip(
            router.query.tripId,
            data,
            session.accessToken
          );
          router.push('/dashboard');
        }}
      />
    </div>
  );
};

export default withAuth(TripEdit);

export { getServerSideProps };
