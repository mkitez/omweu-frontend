import { Booking } from '../../pages/bookings/[bookingId]';
import TripData from '../TripDetails/TripData';
import UserData from '../TripDetails/UserData';
import styles from './BookingDetails.module.css';
import BookingMessage from './BookingMessage';
import { BookingStatus } from './BookingStatus';
import PassengerActions from './PassengerActions';
import TripLink from './TripLink';

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
      <TripLink tripSlug={booking.trip.slug} />
    </div>
  );
};

export default PassengerBookingView;
