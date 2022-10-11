import jwt_decode, { JwtPayload } from 'jwt-decode';

const ACCESS_TOKEN_FIELD = 'accessToken';
const REFRESH_TOKEN_FIELD = 'refreshToken';

interface JwtUserPayload extends JwtPayload {
  user_id: string;
}

const getLocalAccessToken = () => {
  return localStorage.getItem(ACCESS_TOKEN_FIELD);
};

const getLocalRefreshToken = () => {
  return localStorage.getItem(REFRESH_TOKEN_FIELD);
};

const updateLocalAccessToken = (token: string) => {
  localStorage.setItem(ACCESS_TOKEN_FIELD, token);
};

const setLocalTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem(ACCESS_TOKEN_FIELD, accessToken);
  localStorage.setItem(REFRESH_TOKEN_FIELD, refreshToken);
};

const removeLocalTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_FIELD);
  localStorage.removeItem(REFRESH_TOKEN_FIELD);
};

const getUserId = () => {
  const token = window.localStorage.getItem(ACCESS_TOKEN_FIELD);
  if (!token) {
    return null;
  }
  const tokenData = jwt_decode<JwtUserPayload>(token);
  return tokenData.user_id;
};

const TokenService = {
  getLocalRefreshToken,
  getLocalAccessToken,
  updateLocalAccessToken,
  removeLocalTokens,
  getUserId,
  setLocalTokens,
};

export default TokenService;
