import api from './api';

const getAuthHeaders = (accessToken: string) => {
  return {
    Authorization: `Bearer ${accessToken}`,
  };
};

const signUp = async (username: string, password: string) => {
  const response = await api.post('/users/', {
    username,
    password,
  });
  return response.data;
};

const AuthService = {
  getAuthHeaders,
  signUp,
};

export default AuthService;
