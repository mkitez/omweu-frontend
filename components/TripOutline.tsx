import { FC } from 'react';
import styles from '../styles/TripOutline.module.css';

type Props = {
  origin: string;
  dest: string;
  routeStops: string[];
};

const TripOutline: FC<Props> = ({ origin, dest, routeStops }) => {
  return (
    <div className={styles.root}>
      <div className={styles.origin}>
        <div className={styles.originLine}>
          <div className={styles.circle}></div>
          <div className={styles.box}></div>
        </div>
        <div className={styles.originName}>{origin}</div>
      </div>
      {routeStops.map((stop, i) => (
        <div key={i} className={styles.origin}>
          <div className={styles.routeStopLine}>
            <div className={styles.circleSm}></div>
            <div className={styles.routeStopBox}></div>
          </div>
          <div className={styles.routeStopName}>{stop}</div>
        </div>
      ))}
      <div className={styles.origin}>
        <div className={styles.destLine}>
          <div className={styles.circle}></div>
        </div>
        <div className={styles.originName}>{dest}</div>
      </div>
    </div>
  );
};

export default TripOutline;
