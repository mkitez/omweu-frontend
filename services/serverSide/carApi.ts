import CarService from '../car.service';
import { createApiGetter } from './apiFactory';

const getCarApi = createApiGetter<CarService>(CarService);
export { getCarApi };
