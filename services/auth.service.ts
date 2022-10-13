import api from './api';
import TokenService from './token.service';

const getAuthHeaders = () => {
  const accessToken = TokenService.getLocalAccessToken();
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
  return response.data;
};

const logIn = async (username: string, password: string) => {
  const response = await api.post('/token/', {
    username,
    password,
  });
  if (response.data) {
    const { access, refresh } = response.data;
    TokenService.setLocalTokens(access, refresh);
  }
  return response.data;
};

const logOut = () => {
  TokenService.removeLocalTokens();
};

const AuthService = {
  getAuthHeaders,
  register,
  logIn,
  logOut,
};

export default AuthService;
