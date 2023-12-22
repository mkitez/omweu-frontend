import { FC } from 'react';
import Image from 'next/image';
import type { Trip } from '../components/Trips';
import { useTranslation } from 'next-i18next';
import TripOutline from './TripOutline';
import styles from '../styles/InlineTrip.module.css';
import { formatDate } from '../utils/formatDate';

interface Props {
  trip: Trip;
  hidePrice?: boolean;
  showDate?: boolean;
}

const InlineTrip: FC<Props> = ({ trip, hidePrice, showDate }) => {
  const { i18n } = useTranslation('common');
  const tripTime = new Date(trip.date).toLocaleTimeString(i18n.language, {
    timeStyle: 'short',
  });
  const routeStops = trip.route_stops.length
    ? [trip.route_stops.map((stop) => stop.name).join(' — ')]
    : [];
  return (
    <div className={styles.root}>
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
    </div>
  );
};

export default InlineTrip;
