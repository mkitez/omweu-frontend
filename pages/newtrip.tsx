import { useRouter } from 'next/router';
import TripService from '../services/trip.service';
import TripEditForm from '../components/TripEditForm';
import { Session } from 'next-auth';
import { getServerSideProps } from './dashboard/trips';
import withAuth from '../components/withAuthHOC';
import { useTranslation } from 'next-i18next';

const NewTrip = ({ session }: { session: Session }) => {
  const router = useRouter();
  const { t } = useTranslation(['dashboard', 'common']);

  const handleSubmit = async (data: any) => {
    await TripService.createTrip(data, session.accessToken as string);
    router.push('/dashboard');
  };

  return (
    <div className="content">
      <h1>{t('trips.createTitle')}</h1>
      <TripEditForm submitValue={t('create')} submit={handleSubmit} />
    </div>
  );
};

export { getServerSideProps };

export default withAuth(NewTrip);
