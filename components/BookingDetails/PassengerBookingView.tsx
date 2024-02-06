import { useTranslation } from 'next-i18next';
import { Booking } from '../../pages/bookings/[bookingId]';
import TripData from '../TripDetails/TripData';
import UserData from '../TripDetails/UserData';
import { BookingStatus } from './BookingStatus';
import Link from 'next/link';
import { Button } from 'antd';

type Props = {
  booking: Booking;
};

const PassengerBookingView: React.FC<Props> = ({ booking }) => {
  const { t } = useTranslation('booking');

  return (
    <div>
      <BookingStatus booking={booking} />
      <TripData trip={booking.trip} />
      <UserData user={booking.driver} />
      {booking.trip.description && <div>{booking.trip.description}</div>}
      <div>
        <Link href={`/trips/${booking.trip.id}`}>{t('go_to_trip')}</Link>
      </div>
      {!booking.response_timestamp && (
        <div>
          <Button>{t('actions.cancel')}</Button>
        </div>
      )}
    </div>
  );
};

export default PassengerBookingView;
