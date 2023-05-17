import Link from 'next/link';
import { Row, Col, Button } from 'antd';
import { useTranslation } from 'next-i18next';
import DriverSectionImage from '../assets/driverSectionImg.svg';
import styles from '../styles/DriverSection.module.css';

const DriverSection = () => {
  const { t } = useTranslation('common');

  return (
    <section className={styles.root}>
      <div className="content">
        <Row gutter={[20, 10]}>
          <Col md={12}>
            <div className={styles.imgContainer}>
              <DriverSectionImage />
            </div>
          </Col>
          <Col md={12}>
            <h2>
              <span className="highlight">Вы водитель?</span>
            </h2>
            <div className={styles.textContainer}>
              Lorem ipsum dolor sit amet consectetur. Neque quam pellentesque
              malesuada elit nunc mattis. In quis ipsum purus risus in lobortis
              neque bibendum. Eget quis a a non mauris mollis. Lorem ipsum dolor
              sit amet consectetur. Neque quam pellentesque malesuada elit nunc
              mattis.
            </div>
            <div className={styles.buttonContainer}>
              <Link href="/newtrip" passHref legacyBehavior>
                <Button type="primary">{t('offerTrip')}</Button>
              </Link>
            </div>
          </Col>
        </Row>
      </div>
    </section>
  );
};

export default DriverSection;
