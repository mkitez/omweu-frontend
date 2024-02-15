import { Booking } from '../../pages/bookings/[bookingId]';
import {
  StatusCancelled,
  StatusConfirmed,
  StatusPending,
  StatusRejected,
} from '../BookingStatus';
import styles from './DashboardBooking.module.css';

type Props = {
  booking: Booking;
};

export const DashboardBookingStatus: React.FC<Props> = ({ booking }) => {
  return (
    <div className={styles.status}>
      {booking.state === 'CONFIRMED' && <StatusConfirmed mode="short" />}
      {booking.state === 'REJECTED' && <StatusRejected mode="short" />}
      {booking.state === 'PENDING' && <StatusPending mode="short" />}
      {booking.state === 'CANCELLED' && <StatusCancelled mode="short" />}
    </div>
  );
};
