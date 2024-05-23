import { Col, Grid, Row } from 'antd';
import { Trans, useTranslation } from 'next-i18next';
import Link from 'next/link';
import { FC } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import useSWRImmutable from 'swr/immutable';

import { useAuthorizedFetcher } from '../../hooks/useAuthorizedFetcher';
import InlineTrip from '../InlineTrip';
import { Trip } from '../Trips';
import styles from './UpcomingTripsSection.module.css';

type Props = { trip: Trip };

const LinkedTrip: FC<Props> = ({ trip }) => (
  <Link href={`/trips/${trip.id}`}>
    <InlineTrip trip={trip} showDate showDriver />
  </Link>
);

const UpcomingTripsSection = () => {
  const { t } = useTranslation('home');
  const { lg } = Grid.useBreakpoint();
  const fetcher = useAuthorizedFetcher();
  const { data, error, isLoading } = useSWRImmutable(
    '/trips/upcoming/',
    fetcher
  );
  if (isLoading || error) {
    return null;
  }
  if (data.length < 3) {
    return null;
  }
  return (
    <section className={styles.root}>
      <div className="content">
        <h2>
          <Trans
            components={{
              mark: <span className="highlight" />,
            }}
          >
            {t('sectionUpcoming.title')}
          </Trans>
        </h2>
      </div>
      {lg ? (
        <div className="content">
          <Row gutter={15}>
            {data.map((trip: Trip) => (
              <Col key={trip.id} lg={8}>
                <LinkedTrip trip={trip} />
              </Col>
            ))}
          </Row>
        </div>
      ) : (
        <Carousel showArrows={false} showStatus={false} showThumbs={false}>
          {data.map((trip: Trip) => (
            <div className={styles.tripWrapper} key={trip.id}>
              <LinkedTrip trip={trip} />
            </div>
          ))}
        </Carousel>
      )}
    </section>
  );
};

export default UpcomingTripsSection;
