import { useTranslation } from 'next-i18next';
import { Booking } from '../../pages/bookings/[bookingId]';
import TripData from '../TripDetails/TripData';
import UserData from '../TripDetails/UserData';
import { BookingStatus } from './BookingStatus';
import { Button } from 'antd';
import { useBookingApi } from '../../hooks/api/useBookingApi';
import { useRouter } from 'next/router';
import { CloseCircleOutlined } from '@ant-design/icons';
import TripDescription from '../TripDetails/TripDescription';
import TripLink from './TripLink';
import styles from './BookingDetails.module.css';

type Props = {
  booking: Booking;
};

const PassengerBookingView: React.FC<Props> = ({ booking }) => {
  const router = useRouter();
  const { t } = useTranslation('booking');
  const api = useBookingApi();

  return (
    <div className={styles.bookingView}>
      <BookingStatus booking={booking} />
      <TripData trip={booking.trip} />
      <UserData user={booking.driver} />
      <TripDescription content={booking.trip.description} />
      {!booking.response_timestamp && (
        <div className={styles.cancelBtnContainer}>
          <Button
            icon={<CloseCircleOutlined />}
            onClick={async () => {
              await api.cancelBooking(booking.booking_id);
              router.push(`/trips/${booking.trip.id}`);
            }}
          >
            {t('actions.cancel')}
          </Button>
        </div>
      )}
      <TripLink tripId={booking.trip.id} />
    </div>
  );
};

export default PassengerBookingView;
