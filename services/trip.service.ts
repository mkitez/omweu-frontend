import api from './api';

const getCurrentUserTrips = async () => {
  const response = await api.get('/trips/');
  return response.data;
};

const TripService = {
  getCurrentUserTrips,
};

export default TripService;
