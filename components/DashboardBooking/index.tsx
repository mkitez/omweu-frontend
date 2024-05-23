import InlineTrip from '../InlineTrip';
import { InlineBooking } from '../Trips';
import { DashboardBookingStatus } from './DashboardBookingStatus';

type Props = {
  booking: InlineBooking;
};

const DashboardBooking = ({ booking }: Props) => {
  return (
    <InlineTrip
      trip={booking.trip}
      header={<DashboardBookingStatus booking={booking} />}
      showDate
      showDriver
    />
  );
};

export default DashboardBooking;
