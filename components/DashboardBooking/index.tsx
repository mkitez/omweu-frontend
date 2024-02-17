import { InlineBooking } from '../Trips';
import InlineTrip from '../InlineTrip';
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
      hidePrice
    />
  );
};

export default DashboardBooking;
