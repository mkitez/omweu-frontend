import api from './api';

const getCurrentUserTrips = async () => {
  const response = await api.get('/trips/');
  return response.data;
};

const viewTripDetails = async (tripId: number) => {
  const response = await api.get(`/trips/${tripId}`);
  return response.data;
};

const createTrip = async (tripData: any) => {
  const response = await api.post(`/trips/`, tripData);
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
  viewTripDetails,
  createTrip,
  searchDestinations,
};

export default TripService;
