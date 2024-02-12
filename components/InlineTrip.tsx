import { ReactElement } from 'react';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import type { Trip } from '../components/Trips';
import TripOutline from './TripOutline';
import { formatDate } from '../utils/formatDate';
import styles from '../styles/InlineTrip.module.css';

interface Props {
  trip: Trip;
  hidePrice?: boolean;
  hideDriver?: boolean;
  showDate?: boolean;
  header?: ReactElement;
}

const InlineTrip: React.FC<Props> = ({
  trip,
  hidePrice,
  hideDriver,
  showDate,
  header,
}) => {
  const { i18n } = useTranslation('common');
  const tripTime = new Date(trip.date).toLocaleTimeString(i18n.language, {
    timeStyle: 'short',
  });
  const routeStops = trip.route_stops.length
    ? [trip.route_stops.map((stop) => stop.name).join(' — ')]
    : [];
  return (
    <div className={styles.root}>
      {header && <div className={styles.header}>{header}</div>}
      {showDate && (
        <div className={styles.date}>
          {formatDate(new Date(trip.date), i18n.language)}
        </div>
      )}
      <div className={styles.tripDetails}>
        <div className={styles.time}>{tripTime}</div>
        <TripOutline
          origin={trip.origin.name}
          dest={trip.dest.name}
          routeStops={routeStops}
          inline={true}
        />
        {!hidePrice && (
          <div className={styles.price}>
            &euro;
            {Number(trip.price).toLocaleString(i18n.language, {
              minimumFractionDigits: 2,
            })}
          </div>
        )}
      </div>
      {!hideDriver && (
        <div className={styles.driver}>
          <div className={styles.imgContainer}>
            {trip.driver.photo ? (
              <Image src={trip.driver.photo} width={100} height={100} alt="" />
            ) : (
              trip.driver.first_name.charAt(0)
            )}
          </div>
          <div className={styles.driverName}>{trip.driver.first_name}</div>
        </div>
      )}
    </div>
  );
};

export default InlineTrip;
