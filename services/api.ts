import axios from 'axios';
import { API_URL } from '../utils/constants';
import { getSession } from 'next-auth/react';

const reloadSession = () => {
  const event = new Event('visibilitychange');
  document.dispatchEvent(event);
};

const errorInterceptor = async (error: any) => {
  const originalConfig = error.config;

  if (
    !error.response ||
    originalConfig.__retry ||
    typeof window === 'undefined' // TODO: remove after refactoring
  ) {
    return Promise.reject(error);
  }

  const { status, data } = error.response;
  if (status === 403 && data.code === 'token_not_valid') {
    originalConfig.__retry = true;
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
};

type Headers = Record<string, string | null>;

const getInstance = (headers: Headers = {}) => {
  const instance = axios.create({
    baseURL: API_URL,
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
  });
  return instance;
};

const getClientInstance = (headers: Headers = {}) => {
  const instance = getInstance(headers);
  instance.interceptors.response.use((response) => response, errorInterceptor);
  return instance;
};

// TODO: refactor all components/pages to use proper client
const api = getClientInstance();

export { getClientInstance, getInstance };
export default api;
