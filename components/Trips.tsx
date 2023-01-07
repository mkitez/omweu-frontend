import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import TripService from '../services/trip.service';

export interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
}

interface Destination {
  place_id: string;
  name: string;
  country_name: string;
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

  const { data: session } = useSession({ required: true });

  useEffect(() => {
    getTrips();
  }, []);

  const getTrips = async () => {
    const tripsResponse = await TripService.getCurrentUserTrips(
      session?.accessToken as string
    );
    setTrips(tripsResponse);
    setLoading(false);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h3>My trips</h3>
      <div>
        <button onClick={getTrips}>Reload</button>
      </div>
      {trips.length > 0 ? (
        <ul>
          {trips.map((trip) => (
            <li key={trip.id}>
              {trip.id} {trip.origin.name} - {trip.dest.name} ({trip.date}){' '}
              <button onClick={() => router.push(`/tripedit/${trip.id}`)}>
                Edit
              </button>
              <button
                onClick={async () => {
                  TripService.deleteTrip(
                    trip.id,
                    session?.accessToken as string
                  );
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
