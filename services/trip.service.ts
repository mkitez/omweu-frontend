import api from './api';
import TokenService from './token.service';

const getCurrentUserTrips = async () => {
  try {
    const response = await api.get('/trips/');
    return response.data;
  } catch (error: any) {
    const { response } = error;
    if (response?.status === 403 && response?.data.code === 'token_not_valid') {
      const refresh = TokenService.getLocalRefreshToken();
      if (refresh) {
        const response = await api.post('/token/refresh/', { refresh });
        const { access } = response.data;
        TokenService.updateLocalAccessToken(access);

        const tripsResponse = await api.get('/trips/');
        return tripsResponse.data;
      }
    }
    return Promise.reject(error);
  }
};

const TripService = {
  getCurrentUserTrips,
};

export default TripService;
