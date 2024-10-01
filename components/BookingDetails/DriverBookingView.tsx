import { useTranslation } from 'next-i18next';

import { Booking } from '../../pages/bookings/[bookingId]';
import ContactUser from '../ContactUser';
import TripData from '../TripDetails/TripData';
import UserData from '../TripDetails/UserData';
import styles from './BookingDetails.module.css';
import DriverActions from './DriverActions';
import TripLink from './TripLink';

type Props = {
  booking: Booking;
};

const DriverBookingView: React.FC<Props> = ({ booking }) => {
  const { t } = useTranslation('booking');
  return (
    <div className={styles.bookingView}>
      <TripData trip={booking.trip} />
      <UserData user={booking.passenger} />
      <DriverActions booking={booking} />
      <ContactUser
        userId={booking.passenger.id}
        tripId={booking.trip.id}
        label={t('contactPassenger')}
      />
      <TripLink tripSlug={booking.trip.slug} />
    </div>
  );
};

export default DriverBookingView;
