import api from './api';
import AuthService from './auth.service';

const getCurrentUserTrips = async (accessToken: string) => {
  const response = await api.get('/trips/', {
    headers: AuthService.getAuthHeaders(accessToken),
  });
  return response.data;
};

const getTripDetails = async (tripId: any) => {
  const response = await api.get(`/trips/${tripId}/`);
  return response.data;
};

const createTrip = async (tripData: any, accessToken: string) => {
  const response = await api.post('/trips/', tripData, {
    headers: AuthService.getAuthHeaders(accessToken),
  });
  return response.data;
};

const updateTrip = async (tripId: any, tripData: any, accessToken: string) => {
  const response = await api.put(`/trips/${tripId}/`, tripData, {
    headers: AuthService.getAuthHeaders(accessToken),
  });
  return response.data;
};

const deleteTrip = async (tripId: any, accessToken: string) => {
  const response = await api.delete(`/trips/${tripId}/`, {
    headers: AuthService.getAuthHeaders(accessToken),
  });
  return response.data;
};

const TripService = {
  getCurrentUserTrips,
  getTripDetails,
  createTrip,
  updateTrip,
  deleteTrip,
};

export default TripService;
