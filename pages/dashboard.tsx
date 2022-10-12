import type { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import type { Destination } from '../components/DestinationSearch';
import AuthService from '../services/auth.service';
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
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [trips, setTrips] = useState<Trip[]>([]);
  useEffect(() => {
    const getTrips = async () => {
      try {
        const tripsResponse = await TripService.getCurrentUserTrips();
        setTrips(tripsResponse);
      } catch (error: any) {
        if ([401, 403].includes(error.response?.status)) {
          AuthService.logOut();
          return router.push('/login');
        }
        setError(error.message);
      }
      setLoading(false);
    };
    getTrips();
  }, [router]);

  const handleLogout = () => {
    AuthService.logOut();
    router.push('/');
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

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
