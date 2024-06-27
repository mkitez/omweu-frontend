import { PlaceRowProps } from '.';
import { FC } from 'react';

import styles from './TripOutline.module.css';

export const DestRow: FC<PlaceRowProps> = ({ value, inline }) => (
  <div className={styles.dest}>
    <div className={styles.destLine}>
      <div className={styles.circle}></div>
    </div>
    <div className={styles.originName}>
      {value.name}
      {!inline && (
        <span className={styles.countryName}>, {value.country_name}</span>
      )}
    </div>
  </div>
);
