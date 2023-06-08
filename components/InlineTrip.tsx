import { FC } from 'react';
import Image from 'next/image';
import type { Trip } from '../components/Trips';
import styles from '../styles/InlineTrip.module.css';
import { useTranslation } from 'next-i18next';
import { TripLine } from './TripLine';

interface Props {
  trip: Trip;
}

const InlineTrip: FC<Props> = ({ trip }) => {
  const { i18n } = useTranslation('common');
  const tripTime = new Date(trip.date).toLocaleTimeString(i18n.language, {
    timeStyle: 'short',
  });
  return (
    <div className={styles.root}>
      <div className={styles.tripDetails}>
        <div className={styles.time}>{tripTime}</div>
        <TripLine />
        <div className={styles.destContainer}>
          <div className={styles.origin}>{trip.origin.name}</div>
          <div className={styles.dest}>{trip.dest.name}</div>
        </div>
        <div className={styles.price}>
          &euro;
          {Number(trip.price).toLocaleString(i18n.language, {
            minimumFractionDigits: 2,
          })}
        </div>
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
