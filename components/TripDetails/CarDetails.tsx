import { Col, Row } from 'antd';

import InlineCarComponent from '../InlineCar';
import type { InlineCar } from '../Trips';

type Props = {
  car: InlineCar | null;
};

const CarDetails: React.FC<Props> = ({ car }) => {
  if (!car) {
    return null;
  }

  return (
    <Row>
      <Col>
        <InlineCarComponent car={car} showType showYear />
      </Col>
    </Row>
  );
};

export default CarDetails;
