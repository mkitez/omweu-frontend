import { AxiosBasicCredentials } from 'axios';

import BaseService from './baseService';

export interface TripInputData {
  origin_id: string;
  dest_id: string;
  date: string;
  price: string;
  car_id: number;
  description: string;
  route_stop_ids: string[];
}

class TripService extends BaseService {
  getCurrentUserTrips() {
    return this.api.get('/trips/');
  }

  getUpcomingTrips() {
    return this.api.get('/trips/upcoming/');
  }

  getTripsForNextMonth(auth?: AxiosBasicCredentials) {
    return this.api.get('/trips/nextmonth/', { auth });
  }

  getTrip(tripId: number) {
    return this.api.get(`/trips/${tripId}/`);
  }

  getTripBySlug(slug: string) {
    return this.api.get(`/trips/${slug}/`);
  }

  createTrip(data: TripInputData) {
    return this.api.post('/trips/', data);
  }

  updateTrip(tripId: number, data: TripInputData) {
    return this.api.put(`/trips/${tripId}/`, data);
  }

  deleteTrip(tripId: number) {
    return this.api.delete(`/trips/${tripId}/`);
  }
}

export default TripService;
