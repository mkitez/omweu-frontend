import { Booking } from '../../pages/bookings/[bookingId]';
import { useIsDriver } from '../../hooks/useIsDriver';
import { BookingStatus } from './BookingStatus';
import TripData from '../TripDetails/TripData';
import UserData from '../TripDetails/UserData';

export type Props = {
  booking: Booking;
};

const BookingDetails: React.FC<Props> = ({ booking }) => {
  const isDriver = useIsDriver(booking.driver);

  return (
    <div>
      {!isDriver && <BookingStatus booking={booking} />}
      <TripData trip={booking.trip} />
      <UserData user={isDriver ? booking.passenger : booking.driver} />
    </div>
  );
};

export default BookingDetails;
