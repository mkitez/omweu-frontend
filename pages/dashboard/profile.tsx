import type { ReactElement } from 'react';
import useSWR from 'swr';
import { Session } from 'next-auth';
import { Descriptions } from 'antd';
import { getServerSideProps } from './trips';
import withAuth from '../../components/withAuthHOC';
import { API_URL } from '../../utils/constants';
import api from '../../services/api';
import DashboardLayout from '../../components/DashboardLayout';

const { Item } = Descriptions;

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
    <>
      <h2>User Profile</h2>
      <Descriptions column={1} style={{ padding: '10px 0' }}>
        <Item label="Email">{data.email}</Item>
        <Item label="Name">
          {data.first_name} {data.last_name}
        </Item>
        <Item label="Phone number">{data.phone_number || 'none'}</Item>
        <Item label="Telegram">{data.telegram_username || 'none'}</Item>
      </Descriptions>
    </>
  );
};

Profile.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export { getServerSideProps };

export default withAuth(Profile);
