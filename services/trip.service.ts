import api from './api';
import AuthService from './auth.service';

const getCurrentUserTrips = async () => {
  const response = await api.get('/trips/', {
    headers: AuthService.getAuthHeaders(),
  });
  return response.data;
};

const getTripDetails = async (tripId: any) => {
  const response = await api.get(`/trips/${tripId}/`);
  return response.data;
};

const createTrip = async (tripData: any) => {
  const response = await api.post('/trips/', tripData, {
    headers: AuthService.getAuthHeaders(),
  });
  return response.data;
};

const updateTrip = async (tripId: any, tripData: any) => {
  const response = await api.put(`/trips/${tripId}/`, tripData, {
    headers: AuthService.getAuthHeaders(),
  });
  return response.data;
};

const deleteTrip = async (tripId: any) => {
  const response = await api.delete(`/trips/${tripId}/`, {
    headers: AuthService.getAuthHeaders(),
  });
  return response.data;
};

const searchDestinations = async (query: string) => {
  const response = await api.get('/destinations/search', {
    params: { query },
  });
  return response.data;
};

const TripService = {
  getCurrentUserTrips,
  getTripDetails,
  createTrip,
  updateTrip,
  deleteTrip,
  searchDestinations,
};

export default TripService;
