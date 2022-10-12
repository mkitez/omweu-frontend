import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import type { Destination } from '../components/DestinationSearch';
import AuthService from '../services/auth.service';
import TripService from '../services/trip.service';

interface User {
  id: number;
  username: string;
}

interface Trip {
  id: number;
  origin: Destination;
  dest: Destination;
  date: string;
  date_created: string;
  driver: User;
}

const Trips = () => {
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

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h3>My trips</h3>
      {trips.length > 0 ? (
        <ul>
          {trips.map((trip) => (
            <li key={trip.id}>
              {trip.id} {trip.origin.name} - {trip.dest.name} ({trip.date}){' '}
              <button
                onClick={async () => {
                  TripService.deleteTrip(trip.id);
                  setTrips(trips.filter((t) => t.id !== trip.id));
                }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div>No trips found</div>
      )}
    </div>
  );
};

export default Trips;
