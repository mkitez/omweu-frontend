import { Button } from 'antd';

import { Car } from '../../services/car.service';

type Props = {
  car: Car;
};

const InlineCar: React.FC<Props> = ({ car }) => {
  return (
    <Button type={car.is_primary ? 'default' : 'text'}>
      {car.brand} {car.model}
    </Button>
  );
};

export default InlineCar;
