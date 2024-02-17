import { useDefaultHeaders } from '../useDefaultHeaders';
import BookingService from '../../services/booking.service';
import { getClientInstance } from '../../services/api';
import { useMemo } from 'react';

export const useBookingApi = () => {
  const headers = useDefaultHeaders();

  const bookingService = useMemo(() => {
    const api = getClientInstance(headers);
    return new BookingService(api);
  }, [headers]);
  return bookingService;
};
