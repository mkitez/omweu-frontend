import useSWR from 'swr';
import { useSession } from 'next-auth/react';
import { Button, List } from 'antd';
import Link from 'next/link';
import dayjs from 'dayjs';
import TripService from '../services/trip.service';
import { API_URL } from '../utils/constants';
import api from '../services/api';

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
  const { data: session } = useSession({ required: true });
  const {
    data: trips,
    error,
    isLoading,
    mutate,
  } = useSWR<Trip[]>(`${API_URL}/trips/`, async (url) => {
    const response = await api.get(url, {
      headers: { Authorization: `Bearer ${session?.accessToken}` },
    });
    return response.data;
  });

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ marginBottom: 10 }}>
      {trips && trips.length > 0 ? (
        <List
          itemLayout="horizontal"
          dataSource={trips}
          renderItem={(trip) => (
            <List.Item
              actions={
                dayjs(trip.date) > dayjs()
                  ? [
                      <Link key="trip-edit" href={`/tripedit/${trip.id}`}>
                        edit
                      </Link>,
                      <Button
                        key="trip-delete"
                        onClick={async () => {
                          await TripService.deleteTrip(
                            trip.id,
                            session?.accessToken as string
                          );
                          await mutate();
                        }}
                      >
                        delete
                      </Button>,
                    ]
                  : []
              }
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
