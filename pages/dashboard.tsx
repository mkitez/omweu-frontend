import type { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import type { Destination } from '../components/DestinationSearch';
import AuthService from '../services/auth.service';
import TokenService from '../services/token.service';
import TripService from '../services/trip.service';

interface Trip {
  id: string;
  origin: Destination;
  dest: Destination;
  date: string;
  date_created: string;
}

const Dashboard: NextPage = () => {
  const router = useRouter();
  const [trips, setTrips] = useState<Trip[]>([]);
  useEffect(() => {
    const userId = TokenService.getUserId();
    if (!userId) {
      router.push({ pathname: '/login', query: { returnUrl: router.asPath } });
      return;
    }
    const getTrips = async () => {
      const tripsResponse = await TripService.getCurrentUserTrips();
      setTrips(tripsResponse);
    };
    getTrips();
  }, [router]);

  const handleLogout = () => {
    AuthService.logOut();
    router.push('/');
  };

  return (
    <div>
      <Link href="/">Home</Link>
      <button onClick={handleLogout}>Log out</button>
      <h2>My trips</h2>
      {trips.length > 0 ? (
        <ul>
          {trips.map((trip) => (
            <li key={trip.id}>
              {trip.origin.name} - {trip.dest.name}
            </li>
          ))}
        </ul>
      ) : (
        <div>No trips found</div>
      )}
    </div>
  );
};

export default Dashboard;
