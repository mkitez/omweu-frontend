import { PlusOutlined } from '@ant-design/icons';
import { Button, Col, Row } from 'antd';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';

import { Car } from '../../services/car.service';

import InlineCar from '../InlineCar';
import styles from './UserProfileForm.module.css';

type Props = {
  cars: Car[];
};

const CarsSection: React.FC<Props> = ({ cars }) => {
  const { t } = useTranslation('dashboard');

  return (
    <div className={styles.carsSection}>
      <h3>{t('cars.title')}</h3>
      {cars.length > 0 && (
        <Row gutter={[10, 10]} className={styles.carsRow}>
          {cars
            .sort((a) => (a.is_primary ? -1 : 0))
            .map((car) => (
              <Col key={car.id} xs={24} md={6}>
                <InlineCar car={car} showYear isClickable />
              </Col>
            ))}
        </Row>
      )}
      <Row>
        <Col xs={24} md={6}>
          <Link href="/newcar" legacyBehavior passHref>
            <Button icon={<PlusOutlined />}>{t('cars.add_new')}</Button>
          </Link>
        </Col>
      </Row>
    </div>
  );
};

export default CarsSection;
