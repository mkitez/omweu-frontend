import type { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import AuthService from '../services/auth.service';
import Trips from '../components/Trips';
import withAuth from '../components/withAuthHOC';

const Dashboard: NextPage = () => {
  const router = useRouter();

  const handleLogout = async () => {
    await router.push('/');
    AuthService.logOut();
  };

  return (
    <div>
      <Link href="/">Home</Link>
      <button onClick={handleLogout}>Log out</button>
      <Trips />
      <Link href="/newtrip">Add trip</Link>
    </div>
  );
};

export default withAuth(Dashboard);
