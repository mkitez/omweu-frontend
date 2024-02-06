import Link from 'next/link';
import { Booking } from '../../pages/bookings/[bookingId]';
import TripData from '../TripDetails/TripData';
import UserData from '../TripDetails/UserData';
import DriverActions from './DriverActions';
import { useTranslation } from 'next-i18next';

type Props = {
  booking: Booking;
};

const DriverBookingView: React.FC<Props> = ({ booking }) => {
  const { t } = useTranslation('booking');

  return (
    <div>
      <TripData trip={booking.trip} />
      <UserData user={booking.passenger} />
      <div>
        <Link href={`/trips/${booking.trip.id}`}>{t('go_to_trip')}</Link>
      </div>
      <DriverActions booking={booking} />
    </div>
  );
};

export default DriverBookingView;
