import axios from 'axios';
import { API_URL } from '../utils/constants';
import { getSession } from 'next-auth/react';

const reloadSession = () => {
  const event = new Event('visibilitychange');
  document.dispatchEvent(event);
};

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
        let session;
        try {
          session = await getSession();
          reloadSession(); // workaround for NextAuth issue: https://github.com/nextauthjs/next-auth/pull/4744
        } catch (getSessionError) {
          return Promise.reject(getSessionError);
        }
        if (session?.error) {
          return Promise.reject(session.error);
        }
        originalConfig.headers = {
          ...originalConfig.headers,
          Authorization: `Bearer ${session?.accessToken}`,
        };
        return axios(originalConfig);
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
