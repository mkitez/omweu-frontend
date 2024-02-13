import { useTranslation } from 'next-i18next';
import { Booking } from '../../pages/bookings/[bookingId]';
import TripData from '../TripDetails/TripData';
import UserData from '../TripDetails/UserData';
import { BookingStatus } from './BookingStatus';
import Link from 'next/link';
import { Button } from 'antd';
import { useBookingApi } from '../../hooks/api/useBookingApi';
import { useRouter } from 'next/router';
import { CloseCircleOutlined, ExportOutlined } from '@ant-design/icons';
import styles from './BookingDetails.module.css';
import TripDescription from '../TripDetails/TripDescription';

type Props = {
  booking: Booking;
};

const PassengerBookingView: React.FC<Props> = ({ booking }) => {
  const router = useRouter();
  const { t } = useTranslation('booking');
  const api = useBookingApi();

  const tripURL = `/trips/${booking.trip.id}`;
  return (
    <div className={styles.root}>
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
              router.push(tripURL);
            }}
          >
            {t('actions.cancel')}
          </Button>
        </div>
      )}
      <div className={styles.tripLinkContainer}>
        <Link href={tripURL}>
          <ExportOutlined /> {t('go_to_trip')}
        </Link>
      </div>
    </div>
  );
};

export default PassengerBookingView;
