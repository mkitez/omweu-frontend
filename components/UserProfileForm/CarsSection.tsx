import { Col, Row } from 'antd';
import { useTranslation } from 'next-i18next';

import { Car } from '../../services/car.service';

import InlineCar from '../InlineCar';

type Props = {
  cars: Car[];
};

const CarsSection: React.FC<Props> = ({ cars }) => {
  const { t } = useTranslation('dashboard');

  if (cars.length == 0) {
    return null;
  }

  return (
    <>
      <h3>{t('cars.title')}</h3>
      <Row>
        {cars.map((car) => (
          <Col key={car.id} xs={12} md={6}>
            <InlineCar car={car} />
          </Col>
        ))}
      </Row>
    </>
  );
};

export default CarsSection;
