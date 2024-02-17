import { useTranslation } from 'next-i18next';
import { InBookingTrip } from '../../pages/bookings/[bookingId]';
import { Trip } from '../Trips';
import styles from './TripDetails.module.css';

type Props = {
  trip: Trip | InBookingTrip;
};

const TripTime: React.FC<Props> = ({ trip }) => {
  const { i18n } = useTranslation();
  const tripTime = new Date(trip.date).toLocaleTimeString(i18n.language, {
    timeStyle: 'short',
    timeZone: trip.origin.time_zone,
  });

  return <div className={styles.time}>{tripTime}</div>;
};

export default TripTime;
