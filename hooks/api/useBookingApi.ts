import BookingService from '../../services/booking.service';

import { createApiHook } from './hookFactory';

const useBookingApi = createApiHook<BookingService>(BookingService);
export { useBookingApi };
