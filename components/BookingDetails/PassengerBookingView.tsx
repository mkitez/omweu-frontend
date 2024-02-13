import { Booking } from '../../pages/bookings/[bookingId]';
import TripData from '../TripDetails/TripData';
import UserData from '../TripDetails/UserData';
import TripDescription from '../TripDetails/TripDescription';
import { BookingStatus } from './BookingStatus';
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
      <TripDescription content={booking.trip.description} />
      <PassengerActions booking={booking} />
      <TripLink tripId={booking.trip.id} />
    </div>
  );
};

export default PassengerBookingView;
