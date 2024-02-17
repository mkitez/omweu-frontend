import { Session } from 'next-auth';
import { getDefaultHeaders } from '../getDefaultHeaders';
import { getInstance } from '../api';
import BookingService from '../booking.service';

export const getBookingApi = (session: Session | null, locale?: string) => {
  const headers = getDefaultHeaders(session, locale);
  const api = getInstance(headers);
  return new BookingService(api);
};
