import type { ReactElement } from 'react';
import useSWR from 'swr';
import { Session } from 'next-auth';
import { getServerSideProps } from './trips';
import withAuth from '../../components/withAuthHOC';
import { API_URL } from '../../utils/constants';
import api from '../../services/api';
import DashboardLayout from '../../components/DashboardLayout';

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
      <h2>User Profile</h2>
      <div>Email: {data.email}</div>
      <div>
        Name: {data.first_name} {data.last_name}
      </div>
    </div>
  );
};

Profile.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export { getServerSideProps };

export default withAuth(Profile);
