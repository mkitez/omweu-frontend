import { Button, Col, Row } from 'antd';
import { Trans, useTranslation } from 'next-i18next';
import Link from 'next/link';

import DriverSectionImage from '../../assets/driverSectionImg.svg';
import styles from './DriverSection.module.css';

const DriverSection = () => {
  const { t } = useTranslation(['home', 'common']);

  return (
    <section className={styles.root}>
      <div className="content">
        <Row gutter={[20, 30]}>
          <Col md={12}>
            <div className={styles.imgContainer}>
              <DriverSectionImage />
            </div>
          </Col>
          <Col md={12}>
            <h2>
              <Trans
                components={{
                  mark: <span className="highlight" />,
                }}
              >
                {t('sectionThree.title')}
              </Trans>
            </h2>
            <div className={styles.textContainer}>{t('sectionThree.text')}</div>
            <div className={styles.buttonContainer}>
              <Link href="/newtrip" passHref legacyBehavior>
                <Button type="primary">
                  {t('offerTrip', { ns: 'common' })}
                </Button>
              </Link>
            </div>
          </Col>
        </Row>
      </div>
    </section>
  );
};

export default DriverSection;
