import useSWRImmutable from 'swr/immutable';
import { Trans, useTranslation } from 'next-i18next';
import { API_URL } from '../../utils/constants';
import InlineTrip from '../InlineTrip';
import { Trip } from '../Trips';
import styles from './UpcomingTripsSection.module.css';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Link from 'next/link';
import { Col, Grid, Row } from 'antd';
import { FC } from 'react';

const LinkedTrip: FC<{ trip: Trip }> = ({ trip }) => (
  <Link href={`/trips/${trip.id}`}>
    <InlineTrip trip={trip} hidePrice showDate />
  </Link>
);

const UpcomingTripsSection = () => {
  const { t, i18n } = useTranslation('home');
  const { lg } = Grid.useBreakpoint();
  const { data, error, isLoading } = useSWRImmutable(
    `${API_URL}/trips/upcoming/`,
    async (url) => {
      const response = await fetch(url, {
        headers: { 'Accept-Language': i18n.language },
      });
      return await response.json();
    }
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
