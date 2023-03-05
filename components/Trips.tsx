import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { Button, List } from 'antd';
import TripService from '../services/trip.service';
import Link from 'next/link';

export interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
}

export interface Destination {
  place_id: string;
  name: string;
  country_name: string;
}

export interface Trip {
  id: number;
  origin: Destination;
  dest: Destination;
  date: string;
  date_created: string;
  driver: User;
}

const Trips = () => {
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
      {trips.length > 0 ? (
        <List
          itemLayout="horizontal"
          dataSource={trips}
          renderItem={(trip) => (
            <List.Item
              actions={[
                <Link key="trip-edit" href={`/tripedit/${trip.id}`}>
                  edit
                </Link>,
                <Button
                  key="trip-delete"
                  onClick={async () => {
                    TripService.deleteTrip(
                      trip.id,
                      session?.accessToken as string
                    );
                    setTrips(trips.filter((t) => t.id !== trip.id));
                  }}
                >
                  delete
                </Button>,
              ]}
            >
              <List.Item.Meta
                title={`${trip.origin.name} - ${trip.dest.name}`}
                description={trip.date}
              />
            </List.Item>
          )}
        />
      ) : (
        <div>No trips found</div>
      )}
    </div>
  );
};

export default Trips;
