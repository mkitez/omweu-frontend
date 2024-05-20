import CarService from '../../services/car.service';

import { createApiHook } from './hookFactory';

const useCarApi = createApiHook<CarService>(CarService);
export { useCarApi  };
