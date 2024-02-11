import useSWR from 'swr';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { useAuthorizedFetcher } from '../../hooks/useAuthorizedFetcher';
import { Booking } from '../../pages/bookings/[bookingId]';
import UserAvatar from '../TripDetails/UserAvatar';
import InlineBookingStatus from './InlineBookingStatus';
import styles from './InlineBookings.module.css';

type Props = {
  tripId: number;
};

const InlineBookings: React.FC<Props> = ({ tripId }) => {
  const { t } = useTranslation('booking');
  const fetcher = useAuthorizedFetcher();
  const {
    data: bookings,
    error,
    isLoading,
  } = useSWR<Booking[]>(`/trips/${tripId}/bookings/`, fetcher);

  if (isLoading || error) {
    return null;
  }

  return (
    <>
      <h3>{t('bookings_title')}</h3>
      <ul className={styles.bookings}>
        {bookings?.map((booking) => (
          <li key={booking.booking_id}>
            <Link href={`/bookings/${booking.booking_id}`}>
              <div className={styles.inlineBooking}>
                <UserAvatar user={booking.passenger} />
                <div className={styles.passengerName}>
                  {booking.passenger.first_name}
                </div>
                <InlineBookingStatus booking={booking} />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
};

export default InlineBookings;
