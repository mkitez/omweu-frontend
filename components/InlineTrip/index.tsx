import { useTranslation } from 'next-i18next';
import { ReactElement } from 'react';

import { formatDate } from '../../utils/formatDate';
import TripTime from '../TripDetails/TripTime';
import UserAvatar from '../TripDetails/UserAvatar';
import TripOutline from '../TripOutline';
import type { Trip } from '../Trips';
import styles from './InlineTrip.module.css';

interface Props {
  trip: Trip;
  showPrice?: boolean;
  showDriver?: boolean;
  showDate?: boolean;
  header?: ReactElement;
  footer?: ReactElement;
}

const InlineTrip: React.FC<Props> = ({
  trip,
  showPrice,
  showDriver,
  showDate,
  header,
  footer,
}) => {
  const { t, i18n } = useTranslation('trip');
  return (
    <div className={styles.root}>
      {header && <div className={styles.header}>{header}</div>}
      {showDate && (
        <div className={styles.date}>
          {formatDate(
            new Date(trip.date),
            i18n.language,
            trip.origin.time_zone
          )}
        </div>
      )}
      <div className={styles.tripDetails}>
        <TripTime trip={trip} />
        <TripOutline
          origin={trip.origin}
          dest={trip.dest}
          routeStops={trip.route_stops}
          inline={true}
        />
        {showPrice &&
          (!trip.free_seats ? (
            <div className={styles.noSeats}>{t('no_seats')}</div>
          ) : (
            <div className={styles.price}>
              &euro;
              {Number(trip.price).toLocaleString(i18n.language, {
                minimumFractionDigits: 2,
              })}
            </div>
          ))}
      </div>
      {showDriver && (
        <div className={styles.driver}>
          <UserAvatar user={trip.driver} small />
          <div className={styles.driverName}>{trip.driver.first_name}</div>
        </div>
      )}
      {footer && <div className={styles.footer}>{footer}</div>}
    </div>
  );
};

export default InlineTrip;
