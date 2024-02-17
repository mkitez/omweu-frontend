import { Trip } from '../Trips';
import TripOutline from '../TripOutline';
import { useTranslation } from 'next-i18next';
import { InBookingTrip } from '../../pages/bookings/[bookingId]';
import styles from './TripDetails.module.css';
import TripTime from './TripTime';

type Props = {
  trip: Trip | InBookingTrip;
};

const TripData: React.FC<Props> = ({ trip }) => {
  const { i18n } = useTranslation();
  return (
    <div className={styles.tripDetails}>
      <TripTime trip={trip} />
      <TripOutline
        origin={trip.origin.name}
        dest={trip.dest.name}
        routeStops={trip.route_stops.map((stop) => stop.name)}
      />
      <div className={styles.price}>
        &euro;
        {Number(trip.price).toLocaleString(i18n.language, {
          minimumFractionDigits: 2,
        })}
      </div>
    </div>
  );
};

export default TripData;
