import type { GetServerSidePropsContext } from 'next';
import Link from 'next/link';
import { authOptions } from '../api/auth/[...nextauth]';
import { unstable_getServerSession } from 'next-auth/next';
import { Typography } from 'antd';
import Trips from '../../components/Trips';
import withAuth from '../../components/withAuthHOC';

const TripsPage = () => {
  return (
    <div>
      <Link href="/dashboard/profile">To user profile</Link>
      <Typography.Title level={2}>User Trips</Typography.Title>
      <Trips />
      <Link href="/newtrip">Add trip</Link>
    </div>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  if (!session) {
    return {
      redirect: {
        destination: '/api/auth/signin',
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
}

export default withAuth(TripsPage);
