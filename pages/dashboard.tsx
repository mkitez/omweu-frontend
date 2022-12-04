import type { GetServerSidePropsContext } from 'next';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { authOptions } from './api/auth/[...nextauth]';
import { unstable_getServerSession } from 'next-auth/next';
import { Session } from 'next-auth';
import Trips from '../components/Trips';
import withAuth from '../components/withAuthHOC';

const Dashboard = ({ session }: { session: Session }) => {
  return (
    <div>
      <Link href="/">Home</Link>
      <button onClick={() => signOut({ callbackUrl: '/' })}>Sign out</button>
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

export default withAuth(Dashboard);
