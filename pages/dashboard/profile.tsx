import useSWR from 'swr';
import { Session } from 'next-auth';
import { Typography } from 'antd';
import { getServerSideProps } from './trips';
import withAuth from '../../components/withAuthHOC';
import { API_URL } from '../../utils/constants';
import api from '../../services/api';

const Profile = ({ session }: { session: Session }) => {
  const { data, error, isLoading } = useSWR(
    `${API_URL}/users/${session.user.id}/`,
    async (url) => {
      const response = await api.get(url, {
        headers: { Authorization: `Bearer ${session.accessToken}` },
      });
      return response.data;
    }
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <Typography.Title level={2}>User Profile</Typography.Title>
      <div>Email: {data.email}</div>
      <div>
        Name: {data.first_name} {data.last_name}
      </div>
    </div>
  );
};

export { getServerSideProps };

export default withAuth(Profile);
