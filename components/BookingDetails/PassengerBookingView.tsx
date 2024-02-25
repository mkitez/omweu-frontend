import { Booking } from '../../pages/bookings/[bookingId]';
import TripData from '../TripDetails/TripData';
import UserData from '../TripDetails/UserData';
import { BookingStatus } from './BookingStatus';
import BookingMessage from './BookingMessage';
import TripLink from './TripLink';
import PassengerActions from './PassengerActions';
import styles from './BookingDetails.module.css';

type Props = {
  booking: Booking;
};

const PassengerBookingView: React.FC<Props> = ({ booking }) => {
  return (
    <div className={styles.bookingView}>
      <BookingStatus booking={booking} />
      <TripData trip={booking.trip} />
      <UserData user={booking.driver} />
      <BookingMessage content={booking.booking_message} />
      <PassengerActions booking={booking} />
      <TripLink tripId={booking.trip.id} />
    </div>
  );
};

export default PassengerBookingView;
