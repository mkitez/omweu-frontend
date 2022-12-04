import { useRouter } from 'next/router';
import TripService from '../services/trip.service';
import TripEditForm from '../components/TripEditForm';
import { Session } from 'next-auth';
import { getServerSideProps } from './dashboard';
import withAuth from '../components/withAuthHOC';

const NewTrip = ({ session }: { session: Session }) => {
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    await TripService.createTrip(data, session.accessToken as string);
    router.push('/dashboard');
  };

  return <TripEditForm submitValue="Create" submit={handleSubmit} />;
};

export { getServerSideProps };

export default withAuth(NewTrip);
