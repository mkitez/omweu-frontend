import { useTranslation } from 'next-i18next';
import { Booking } from '../../pages/bookings/[bookingId]';
import TripData from '../TripDetails/TripData';
import UserData from '../TripDetails/UserData';
import { BookingStatus } from './BookingStatus';
import Link from 'next/link';
import { Button } from 'antd';
import { useBookingApi } from '../../hooks/api/useBookingApi';
import { useRouter } from 'next/router';

type Props = {
  booking: Booking;
};

const PassengerBookingView: React.FC<Props> = ({ booking }) => {
  const router = useRouter();
  const { t } = useTranslation('booking');
  const bookingApi = useBookingApi();

  const tripURL = `/trips/${booking.trip.id}`;
  return (
    <div>
      <BookingStatus booking={booking} />
      <TripData trip={booking.trip} />
      <UserData user={booking.driver} />
      {booking.trip.description && <div>{booking.trip.description}</div>}
      <div>
        <Link href={tripURL}>{t('go_to_trip')}</Link>
      </div>
      {!booking.response_timestamp && (
        <div>
          <Button
            onClick={async () => {
              await bookingApi.cancelBooking(booking.booking_id);
              router.push(tripURL);
            }}
          >
            {t('actions.cancel')}
          </Button>
        </div>
      )}
    </div>
  );
};

export default PassengerBookingView;
