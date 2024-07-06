import { PlaceRowProps } from '.';
import { FC } from 'react';

import styles from './TripOutline.module.css';

export const OriginRow: FC<PlaceRowProps> = ({ value, inline }) => (
  <div className={`${styles.origin} ${inline ? styles.inlineOrigin : ''}`}>
    <div className={styles.originLine}>
      <div className={styles.circle}></div>
      <div className={styles.box}></div>
    </div>
    <div className={styles.originName}>
      {value.name}
      {!inline && (
        <span className={styles.countryName}>, {value.country_name}</span>
      )}
    </div>
  </div>
);
