import { Col, Row } from 'antd';

import InlineCarComponent from '../InlineCar';

type Props = {
  car: InlineCarComponent | null;
};

const CarDetails: React.FC<Props> = ({ car }) => {
  if (!car) {
    return null;
  }

  return (
    <Row>
      <Col>
        <InlineCarComponent car={car} showType />
      </Col>
    </Row>
  );
};

export default CarDetails;
