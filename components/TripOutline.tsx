import { FC } from 'react';
import styles from '../styles/TripOutline.module.css';

type PlaceRowProps = {
  value: string;
};

type InlinePlaceRowProps = {
  inline?: boolean;
} & PlaceRowProps;

const OriginRow: FC<InlinePlaceRowProps> = ({ value, inline }) => (
  <div className={`${styles.origin} ${inline && styles.inlineOrigin}`}>
    <div className={styles.originLine}>
      <div className={styles.circle}></div>
      <div className={styles.box}></div>
    </div>
    <div className={styles.originName}>{value}</div>
  </div>
);

const StopRow: FC<InlinePlaceRowProps> = ({ value, inline }) => (
  <div className={`${styles.stop} ${inline && styles.inlineStop}`}>
    <div className={styles.routeStopLine}>
      <div className={styles.circleSm}></div>
      <div className={styles.routeStopBox}></div>
    </div>
    <div className={styles.routeStopName}>{value}</div>
  </div>
);

const DestRow: FC<PlaceRowProps> = ({ value }) => (
  <div className={styles.dest}>
    <div className={styles.destLine}>
      <div className={styles.circle}></div>
    </div>
    <div className={styles.originName}>{value}</div>
  </div>
);

type Props = {
  origin: string;
  dest: string;
  routeStops: string[];
  inline?: boolean;
};

const TripOutline: FC<Props> = ({ origin, dest, routeStops, inline }) => {
  return (
    <div className={styles.root}>
      <OriginRow value={origin} inline={inline} />
      {routeStops.map((stop, i) => (
        <StopRow key={i} value={stop} inline={inline} />
      ))}
      <DestRow value={dest} />
    </div>
  );
};

export default TripOutline;
