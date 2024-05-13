import BookingService from '../booking.service';
import { createApiGetter } from './apiFactory';

const getBookingApi = createApiGetter<BookingService>(BookingService);
export { getBookingApi };
