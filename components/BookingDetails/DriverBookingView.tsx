import { Booking } from '../../pages/bookings/[bookingId]';
import TripData from '../TripDetails/TripData';
import UserData from '../TripDetails/UserData';
import DriverActions from './DriverActions';
import TripLink from './TripLink';
import styles from './BookingDetails.module.css';

type Props = {
  booking: Booking;
};

const DriverBookingView: React.FC<Props> = ({ booking }) => {
  return (
    <div className={styles.bookingView}>
      <TripData trip={booking.trip} />
      <UserData user={booking.passenger} />
      <DriverActions booking={booking} />
      <TripLink tripId={booking.trip.id} />
    </div>
  );
};

export default DriverBookingView;
