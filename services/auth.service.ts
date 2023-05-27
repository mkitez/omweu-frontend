import api from './api';

const getAuthHeaders = (accessToken: string) => {
  return {
    Authorization: `Bearer ${accessToken}`,
  };
};

const signUp = (email: string, password: string, lang?: string) => {
  return api.post(
    '/users/',
    {
      email,
      password,
    },
    { headers: { 'Accept-Language': lang } }
  );
};

const AuthService = {
  getAuthHeaders,
  signUp,
};

export default AuthService;
