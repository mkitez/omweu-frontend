import { List } from 'antd';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import useSWR from 'swr';

import { useAuthorizedFetcher } from '../../hooks/useAuthorizedFetcher';
import { Booking } from '../../pages/bookings/[bookingId]';
import UserAvatar from '../TripDetails/UserAvatar';
import styles from './InlineBookings.module.css';
import { InlineBookingStatus } from './InlineBookingStatus';

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

  if (isLoading || error || bookings?.length === 0) {
    return null;
  }

  return (
    <div className={styles.root}>
      <h3>{t('bookings_title')}</h3>
      <List
        className={styles.bookingList}
        dataSource={bookings}
        renderItem={(booking) => {
          return (
            <List.Item className={styles.booking}>
              <List.Item.Meta
                avatar={<UserAvatar user={booking.passenger} small />}
                description={
                  <Link href={`/bookings/${booking.booking_id}`}>
                    {booking.passenger.first_name}
                  </Link>
                }
                className={styles.userData}
              />
              <InlineBookingStatus booking={booking} />
            </List.Item>
          );
        }}
      />
    </div>
  );
};

export default InlineBookings;
