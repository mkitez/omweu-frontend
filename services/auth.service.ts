import api from './api';

const getAuthHeaders = (accessToken: string) => {
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
  }
  return response.data;
};

const AuthService = {
  getAuthHeaders,
  register,
};

export default AuthService;
