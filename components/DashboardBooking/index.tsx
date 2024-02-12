import { InlineBooking } from '../Trips';
import InlineTrip from '../InlineTrip';
import { BookingStatus } from './BookingStatus';

type Props = {
  booking: InlineBooking;
};

const DashboardBooking = ({ booking }: Props) => {
  return (
    <InlineTrip
      trip={booking.trip}
      header={<BookingStatus booking={booking} />}
      showDate
      hidePrice
    />
  );
};

export default DashboardBooking;
