import { Booking } from '../../pages/bookings/[bookingId]';
import { useIsAuthenticatedUser } from '../../hooks/useIsAuthenticatedUser';
import PassengerBookingView from './PassengerBookingView';
import DriverBookingView from './DriverBookingView';

type Props = {
  booking: Booking;
};

const BookingDetails: React.FC<Props> = ({ booking }) => {
  const isDriver = useIsAuthenticatedUser(booking.driver);

  return isDriver ? (
    <DriverBookingView booking={booking} />
  ) : (
    <PassengerBookingView booking={booking} />
  );
};

export default BookingDetails;
