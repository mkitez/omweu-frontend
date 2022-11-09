import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import TripService from '../services/trip.service';
import TripEditForm from '../components/TripEditForm';
import withAuth from '../components/withAuthHOC';

const NewTrip: NextPage = () => {
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    await TripService.createTrip(data);
    router.push('/dashboard');
  };

  return <TripEditForm submitValue="Create" submit={handleSubmit} />;
};

export default withAuth(NewTrip);
