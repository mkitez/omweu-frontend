import type { ReactElement } from 'react';
import type { GetServerSidePropsContext } from 'next';
import Link from 'next/link';
import { authOptions } from '../api/auth/[...nextauth]';
import { unstable_getServerSession } from 'next-auth/next';
import Trips from '../../components/Trips';
import withAuth from '../../components/withAuthHOC';
import DashboardLayout from '../../components/DashboardLayout';

const TripsPage = () => {
  return (
    <div>
      <h2>User Trips</h2>
      <Trips />
      <Link href="/newtrip">Add trip</Link>
    </div>
  );
};

TripsPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
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
