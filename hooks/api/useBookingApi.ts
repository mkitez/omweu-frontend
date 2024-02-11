import { useDefaultHeaders } from '../useDefaultHeaders';
import BookingService from '../../services/booking.service';

export const useBookingApi = () => {
  const headers = useDefaultHeaders();

  const bookingService = new BookingService(headers);
  return bookingService;
};
