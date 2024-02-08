import useSWR from 'swr';
import { Booking } from '../../pages/bookings/[bookingId]';
import { useTranslation } from 'next-i18next';
import { useSession } from 'next-auth/react';
import api from '../../services/api';
import UserAvatar from '../TripDetails/UserAvatar';
import styles from './InlineBookings.module.css';
import Link from 'next/link';
import InlineBookingActions from './InlineBookingActions';

type Props = {
  tripId: number;
};

const InlineBookings: React.FC<Props> = ({ tripId }) => {
  const { data: session } = useSession();
  const { t, i18n } = useTranslation('booking');
  const {
    data: bookings,
    error,
    isLoading,
  } = useSWR<Booking[]>(`/trips/${tripId}/bookings/`, async (url) => {
    const response = await api.get(url, {
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
        'Accept-Language': i18n.language,
      },
    });
    return response.data;
  });

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
                <UserAvatar user={booking.passenger} />{' '}
                {booking.passenger.first_name}
                <InlineBookingActions booking={booking} />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
};

export default InlineBookings;
