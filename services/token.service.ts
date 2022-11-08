import jwtDecode, { JwtPayload } from 'jwt-decode';
import { store } from '../redux/store';
import {
  setAuthTokens,
  clearAuthTokens,
  updateAccessToken,
} from '../redux/authSlice';

const ACCESS_TOKEN_FIELD = 'accessToken';
const REFRESH_TOKEN_FIELD = 'refreshToken';

export interface JwtUserPayload extends JwtPayload {
  user_id: string;
}

const getLocalAccessToken = () => {
  return localStorage.getItem(ACCESS_TOKEN_FIELD);
};

const getLocalRefreshToken = () => {
  return localStorage.getItem(REFRESH_TOKEN_FIELD);
};

const getLocalTokens = () => {
  return {
    accessToken: localStorage.getItem(ACCESS_TOKEN_FIELD),
    refreshToken: localStorage.getItem(REFRESH_TOKEN_FIELD),
  };
};

const updateLocalAccessToken = (token: string) => {
  localStorage.setItem(ACCESS_TOKEN_FIELD, token);

  store.dispatch(updateAccessToken(jwtDecode<JwtUserPayload>(token)));
};

const setLocalTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem(ACCESS_TOKEN_FIELD, accessToken);
  localStorage.setItem(REFRESH_TOKEN_FIELD, refreshToken);

  setExpiringTokenData(accessToken, refreshToken);
};

const restoreTokenDataFromLocalStorage = () => {
  const { accessToken, refreshToken } = getLocalTokens();
  if (!accessToken || !refreshToken) {
    return;
  }
  setExpiringTokenData(accessToken, refreshToken);
};

const removeLocalTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_FIELD);
  localStorage.removeItem(REFRESH_TOKEN_FIELD);

  const timer = store.getState().auth.timer;
  if (timer) {
    clearTimeout(timer);
  }
  store.dispatch(clearAuthTokens());
};

const setExpiringTokenData = (accessToken: string, refreshToken: string) => {
  const accessTokenData = jwtDecode<JwtUserPayload>(accessToken);
  const refreshTokenData = jwtDecode<JwtUserPayload>(refreshToken);

  const { exp } = refreshTokenData;
  let timer = null;
  if (exp) {
    const expDate = new Date(exp * 1000);
    const expiresIn = expDate.valueOf() - Date.now();
    if (expiresIn <= 0) {
      removeLocalTokens();
      return;
    }
    timer = setTimeout(removeLocalTokens, expiresIn);
  }
  store.dispatch(setAuthTokens({ accessTokenData, refreshTokenData, timer }));
};

const TokenService = {
  getLocalRefreshToken,
  getLocalAccessToken,
  getLocalTokens,
  updateLocalAccessToken,
  setExpiringTokenData,
  restoreTokenDataFromLocalStorage,
  removeLocalTokens,
  setLocalTokens,
};

export default TokenService;
