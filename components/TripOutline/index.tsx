import { FC } from 'react';

import { Destination } from '../Trips';
import { DestRow } from './DestRow';
import { OriginRow } from './OriginRow';
import { StopRow } from './StopRow';
import styles from './TripOutline.module.css';

export type PlaceRowProps = {
  inline?: boolean;
  value: Destination;
};

type Props = {
  origin: Destination;
  dest: Destination;
  routeStops: Destination[];
  inline?: boolean;
};

const TripOutline: FC<Props> = ({ origin, dest, routeStops, inline }) => {
  return (
    <div className={styles.root}>
      <OriginRow value={origin} inline={inline} />
      {inline
        ? routeStops.length > 0 && (
            <StopRow
              inline
              value={routeStops.map((stop) => stop.name).join(' — ')}
            />
          )
        : routeStops.map((stop, i) => (
            <StopRow
              key={i}
              value={stop.name}
              countryName={stop.country_name}
              inline={inline}
            />
          ))}
      <DestRow value={dest} inline={inline} />
    </div>
  );
};

export default TripOutline;
