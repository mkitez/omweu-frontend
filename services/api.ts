import axios from 'axios';
import TokenService from './token.service';
import { API_URL } from '../utils/constants';

const instance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalConfig = error.config;
    if (error.response) {
      if (
        error.response?.status === 403 &&
        error.response?.data.code === 'token_not_valid' &&
        !originalConfig._retry
      ) {
        originalConfig._retry = true;
        try {
          const refreshResponse = await instance.post('/token/refresh/', {
            refresh: TokenService.getLocalRefreshToken(),
          });
          const { access } = refreshResponse.data;
          TokenService.updateLocalAccessToken(access);
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
        originalConfig.headers = {
          ...originalConfig.headers,
          Authorization: `Bearer ${TokenService.getLocalAccessToken()}`,
        };
        return axios(originalConfig);
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
