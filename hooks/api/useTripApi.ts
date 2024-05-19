import TripService from '../../services/trip.service';

import { createApiHook } from './hookFactory';

const useTripApi = createApiHook<TripService>(TripService);
export { useTripApi };
