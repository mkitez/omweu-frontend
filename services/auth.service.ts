import api from './api';

const getAuthHeaders = (accessToken: string) => {
  return {
    Authorization: `Bearer ${accessToken}`,
  };
};

interface SignupData {
  email: string;
  password: string;
  captcha: string;
}

const signUp = (data: SignupData, lang?: string) => {
  return api.post('/users/', data, { headers: { 'Accept-Language': lang } });
};

const AuthService = {
  getAuthHeaders,
  signUp,
};

export default AuthService;
