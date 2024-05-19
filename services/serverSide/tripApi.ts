import TripService from '../trip.service';
import { createApiGetter } from './apiFactory';

const getTripApi = createApiGetter<TripService>(TripService);
export { getTripApi };
