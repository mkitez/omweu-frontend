import { PlaceRowProps } from '.';
import { FC } from 'react';

import styles from './TripOutline.module.css';

type Props = {
  value: string;
  inline?: boolean;
  countryName?: string;
};

export const StopRow: FC<Props> = ({ value, inline, countryName }) => (
  <div className={`${styles.stop} ${inline && styles.inlineStop}`}>
    <div className={styles.routeStopLine}>
      <div className={styles.circleSm}></div>
      <div className={styles.routeStopBox}></div>
    </div>
    <div className={styles.routeStopName}>
      {value}
      {!inline && <span className={styles.countryName}>, {countryName}</span>}
    </div>
  </div>
);
