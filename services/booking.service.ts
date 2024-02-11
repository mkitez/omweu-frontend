import BaseService from './baseService';

class BookingService extends BaseService {
  async getBookingForTrip(tripId: number) {
    const response = await this.api.get(`/trips/${tripId}/booking/`);
    return response.data;
  }

  async getBookingsForTrip(tripId: number) {
    const response = await this.api.get(`/trips/${tripId}/bookings/`);
    return response.data;
  }

  async submitBookingForTrip(tripId: number) {
    const response = await this.api.post(`/trips/${tripId}/booking/`);
    return response.data;
  }

  async getBooking(bookingId: string) {
    const response = await this.api.get(`/bookings/${bookingId}/`);
    return response.data;
  }

  async cancelBooking(bookingId: string) {
    const response = await this.api.post(`/bookings/${bookingId}/cancel/`);
    return response.data;
  }

  async confirmBooking(bookingId: string) {
    const response = await this.api.post(`/bookings/${bookingId}/confirm/`);
    return response.data;
  }

  async rejectBooking(bookingId: string) {
    const response = await this.api.post(`/bookings/${bookingId}/reject/`);
    return response.data;
  }
}

export default BookingService;
