import useSWR from 'swr';
import { useRouter } from 'next/router';
import { Descriptions } from 'antd';
import { Session } from 'next-auth';
import withAuth from '../../components/withAuthHOC';
import api from '../../services/api';
import AuthService from '../../services/auth.service';
import { getServerSideProps } from '../dashboard/trips';

const Trip = ({ session }: { session: Session }) => {
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

  return (
    <div className="content">
      <Descriptions title={`${data.origin.name} - ${data.dest.name}`}>
        <Descriptions.Item label="Trip date">{data.date}</Descriptions.Item>
      </Descriptions>
    </div>
  );
};

export { getServerSideProps };

export default withAuth(Trip);
