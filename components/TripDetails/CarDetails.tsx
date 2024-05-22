import { Col, Row } from 'antd';

import InlineCar from '../InlineCar';

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
        <InlineCar car={car} showType />
      </Col>
    </Row>
  );
};

export default CarDetails;
