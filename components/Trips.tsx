import { ExclamationCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import { Tag } from 'antd';
import dayjs from 'dayjs';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import useSWR from 'swr';

import {
  BodyType,
  Car,
  CarBrandOrModel,
  CarColor,
} from '../services/car.service';

import { useAuthorizedFetcher } from '../hooks/useAuthorizedFetcher';
import { Booking } from '../pages/bookings/[bookingId]';
import styles from '../styles/Trips.module.css';
import DashboardBooking from './DashboardBooking';
import InlineTrip from './InlineTrip';

export interface DriverPreferences {
  smoking_allowed: boolean;
  pets_allowed: boolean;
  max_two_on_backseat: boolean;
  food_allowed: boolean;
  can_deliver: boolean;
  gender: boolean | null;
  music_allowed: boolean;
}

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  photo: string;
  phone_number?: string;
  whatsapp_number?: string;
  telegram_username?: string;
  is_email_confirmed: boolean;
  driver_preferences: DriverPreferences | null;
  about?: string;
  date_joined?: string;
  birth_date?: string;
  cars: Car[];
}

export interface Destination {
  place_id: string;
  name: string;
  country_name: string;
  time_zone: string;
}

export interface InlineCar {
  id: number;
  brand: CarBrandOrModel;
  model: CarBrandOrModel;
  body_type: BodyType;
  color: CarColor;
  year: number;
  passenger_seats: number;
}

export interface Trip {
  id: number;
  origin: Destination;
  dest: Destination;
  date: string;
  date_created: string;
  driver: User;
  price: string;
  description: string;
  route_stops: Destination[];
  amenities: DriverPreferences | null;
  car: InlineCar | null;
  free_seats: number | null;
  has_pending_bookings?: boolean;
}

export interface InlineBooking extends Booking {
  trip: Trip;
}

const Trips = () => {
  const { t } = useTranslation(['dashboard', 'common']);
  const fetcher = useAuthorizedFetcher();
  const {
    data: trips,
    error: tripsError,
    isLoading: tripsLoading,
  } = useSWR<Trip[]>('/trips/', fetcher);
  const {
    data: bookings,
    error: bookingsError,
    isLoading: bookingsLoading,
  } = useSWR<InlineBooking[]>('/bookings/', fetcher);

  return (
    <div className={styles.root}>
      {(() => {
        if (tripsError || bookingsError) {
          return (
            <div className={styles.errorLoadingContainer}>
              {t('errors.common', { ns: 'common' })}
            </div>
          );
        }
        if (tripsLoading || bookingsLoading) {
          return (
            <div className={styles.errorLoadingContainer}>
              <LoadingOutlined style={{ fontSize: '2rem' }} />
            </div>
          );
        }
        if (trips?.length === 0 && bookings?.length === 0) {
          return <div>{t('trips.noTrips')}</div>;
        }
        const tripsAndBookings = [...(trips || []), ...(bookings || [])];
        const tripsAndBookingsSorted = tripsAndBookings.sort(
          (entityA, entityB) => {
            const tripA = 'booking_id' in entityA ? entityA.trip : entityA;
            const tripB = 'booking_id' in entityB ? entityB.trip : entityB;
            return dayjs(tripB.date).diff(dayjs(tripA.date));
          }
        );

        return (
          <div>
            {tripsAndBookingsSorted.map((entity) => {
              const isBooking = 'booking_id' in entity;
              const entityId = isBooking ? entity.booking_id : entity.id;
              const entityPath = isBooking
                ? `/bookings/${entityId}`
                : `/trips/${entityId}`;
              return (
                <Link key={entityId} href={entityPath}>
                  {isBooking ? (
                    <DashboardBooking booking={entity} />
                  ) : (
                    <InlineTrip
                      trip={entity}
                      showDate
                      footer={
                        entity.has_pending_bookings ? (
                          <Tag
                            className={styles.pendingBookings}
                            color="warning"
                            icon={<ExclamationCircleOutlined />}
                          >
                            {t('trips.pending_bookings')}
                          </Tag>
                        ) : undefined
                      }
                    />
                  )}
                </Link>
              );
            })}
          </div>
        );
      })()}
    </div>
  );
};

export default Trips;
