import { Booking } from '../../pages/bookings/[bookingId]';
import {
  StatusPending,
  StatusConfirmed,
  StatusRejected,
  StatusCancelled,
} from '../BookingStatus';
import styles from './BookingDetails.module.css';

type Props = {
  booking: Booking;
};

export const BookingStatus: React.FC<Props> = ({ booking }) => {
  return (
    <div className={styles.status}>
      {booking.state === 'CONFIRMED' && <StatusConfirmed />}
      {booking.state === 'REJECTED' && <StatusRejected />}
      {booking.state === 'PENDING' && <StatusPending mode="short" />}
      {booking.state === 'CANCELLED' && <StatusCancelled />}
    </div>
  );
};
