import { useTranslation } from 'next-i18next';

import { Booking } from '../../pages/bookings/[bookingId]';
import ContactUser from '../ContactUser';
import TripData from '../TripDetails/TripData';
import UserData from '../TripDetails/UserData';
import styles from './BookingDetails.module.css';
import { BookingStatus } from './BookingStatus';
import PassengerActions from './PassengerActions';
import TripLink from './TripLink';

type Props = {
  booking: Booking;
};

const PassengerBookingView: React.FC<Props> = ({ booking }) => {
  const { t } = useTranslation('booking');

  return (
    <div className={styles.bookingView}>
      <BookingStatus booking={booking} />
      <TripData trip={booking.trip} />
      <UserData user={booking.driver} />
      <PassengerActions booking={booking} />
      <ContactUser
        tripSlug={booking.trip.slug}
        userId={booking.driver.id}
        label={t('goToChat')}
      />
      <TripLink tripSlug={booking.trip.slug} />
    </div>
  );
};

export default PassengerBookingView;
