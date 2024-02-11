import { AxiosRequestConfig } from 'axios';
import api from './api';

type Headers = AxiosRequestConfig['headers'];

class BookingService {
  readonly headers: Headers;

  constructor(headers: Headers) {
    this.headers = headers;
  }

  async getBookingForTrip(tripId: number) {
    const response = await api.get(`/trips/${tripId}/booking/`, {
      headers: this.headers,
    });
    return response.data;
  }

  async getBookingsForTrip(tripId: number) {
    const response = await api.get(`/trips/${tripId}/bookings/`, {
      headers: this.headers,
    });
    return response.data;
  }

  async submitBookingForTrip(tripId: number) {
    const response = await api.post(`/trips/${tripId}/booking/`, null, {
      headers: this.headers,
    });
    return response.data;
  }

  async getBooking(bookingId: string) {
    const response = await api.get(`/bookings/${bookingId}/`, {
      headers: this.headers,
    });
    return response.data;
  }

  async cancelBooking(bookingId: string) {
    const response = await api.post(`/bookings/${bookingId}/cancel/`, null, {
      headers: this.headers,
    });
    return response.data;
  }

  async confirmBooking(bookingId: string) {
    const response = await api.post(`/bookings/${bookingId}/confirm/`, null, {
      headers: this.headers,
    });
    return response.data;
  }

  async rejectBooking(bookingId: string) {
    const response = await api.post(`/bookings/${bookingId}/reject/`, null, {
      headers: this.headers,
    });
    return response.data;
  }
}

export default BookingService;
