import { Row, Col } from 'antd';
import PopularTrip from './PopularTrip';
import { Trans, useTranslation } from 'next-i18next';
import dayjs from 'dayjs';
import styles from '../../styles/PopularTripsSection.module.css';

const data = [
  {
    originId: 'here:cm:namedplace:20674800',
    destId: 'here:cm:namedplace:20187403',
  },
  {
    originId: 'here:cm:namedplace:20674800',
    destId: 'here:cm:namedplace:23292354',
  },
  {
    originId: 'here:cm:namedplace:20674800',
    destId: 'here:cm:namedplace:20627780',
  },
];

const PopularTripsSection = () => {
  const { t } = useTranslation('home');
  const date = dayjs().format('YYYY-MM-DD');

  return (
    <section className={styles.root}>
      <div className="content">
        <h2>
          <Trans
            components={{
              mark: <span className="highlight" />,
            }}
          >
            {t('sectionFour.title')}
          </Trans>
        </h2>
        <Row>
          {data.map((trip, i) => {
            const from = t(`sectionFour.trips.${i}.origin`);
            const to = t(`sectionFour.trips.${i}.dest`);
            const link = `/search?from=${trip.originId}&to=${trip.destId}&date=${date}&from_input=${from}&to_input=${to}`;
            return (
              <Col key={i} xs={24} lg={8}>
                <PopularTrip originLabel={from} destLabel={to} link={link} />
              </Col>
            );
          })}
        </Row>
      </div>
    </section>
  );
};

export default PopularTripsSection;
