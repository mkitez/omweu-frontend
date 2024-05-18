import { Button } from 'antd';
import Link from 'next/link';

import { Car } from '../../services/car.service';

type Props = {
  car: Car;
};

const InlineCar: React.FC<Props> = ({ car }) => {
  return (
    <Link href={`/caredit/${car.id}`} legacyBehavior passHref>
      <Button type={car.is_primary ? 'default' : 'text'}>
        {car.brand.name} {car.model.name}
      </Button>
    </Link>
  );
};

export default InlineCar;
