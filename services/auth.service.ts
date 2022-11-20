import { store } from '../redux/store';
import api from './api';
import TokenService from './token.service';

const getAuthHeaders = () => {
  const accessToken = store.getState().auth.tokens?.access;
  if (!accessToken) {
    return {};
  }
  return {
    Authorization: `Bearer ${accessToken}`,
  };
};

const register = async (username: string, password: string) => {
  const response = await api.post('/users/', {
    username,
    password,
  });
  if (response.data) {
    const { access, refresh } = response.data.tokens;
    TokenService.setLocalTokens(access, refresh);
    TokenService.setLocalUserData(response.data.user);
  }
  return response.data;
};

const logIn = async (username: string, password: string) => {
  const response = await api.post('/token/', {
    username,
    password,
  });
  if (response.data) {
    const { access, refresh } = response.data.tokens;
    TokenService.setLocalTokens(access, refresh);
    TokenService.setLocalUserData(response.data.user);
  }
  return response.data;
};

const logOut = () => {
  TokenService.removeLocalAuthData();
};

const vkAuth = async (code: string) => {
  const response = await api.post('/users/vkauth', { code });
  if (response.data) {
    const { access, refresh } = response.data.tokens;
    TokenService.setLocalTokens(access, refresh);
    TokenService.setLocalUserData(response.data.user);
  }
  return response.data;
};

const AuthService = {
  getAuthHeaders,
  register,
  logIn,
  logOut,
  vkAuth,
};

export default AuthService;
