import { FC } from 'react';
import Image from 'next/image';
import type { Trip } from '../components/Trips';
import styles from '../styles/TripDetails.module.css';
import { useTranslation } from 'next-i18next';
import { TripLine } from './TripLine';

interface Props {
  trip: Trip;
}

const TripDetails: FC<Props> = ({ trip }) => {
  const { t, i18n } = useTranslation('trip');
  const tripTime = new Date(trip.date).toLocaleTimeString(i18n.language, {
    timeStyle: 'short',
  });
  const { phone_number, telegram_username } = trip.driver;
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
      {trip.description && (
        <div className={styles.description}>{trip.description}</div>
      )}
      <div className={styles.contacts}>
        <ul>
          {phone_number && (
            <li>
              {t('phone')}:{' '}
              <a className={styles.contactValue} href={`tel:${phone_number}`}>
                {phone_number}
              </a>
            </li>
          )}
          {telegram_username && (
            <li>
              Telegram:{' '}
              <a
                href={`https://web.telegram.org/k/#${telegram_username}`}
                target="_blank"
                rel="noreferrer"
                className={styles.contactValue}
              >
                {telegram_username}
              </a>
            </li>
          )}
        </ul>
      </div>
      <div className={styles.reach}>{t('reachDriver')}</div>
    </div>
  );
};

export default TripDetails;
