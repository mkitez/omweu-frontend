import { useDefaultHeaders } from '../useDefaultHeaders';
import BookingService from '../../services/booking.service';
import { getClientInstance } from '../../services/api';

export const useBookingApi = () => {
  const headers = useDefaultHeaders();

  const api = getClientInstance(headers);
  const bookingService = new BookingService(api);
  return bookingService;
};
