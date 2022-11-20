import jwtDecode, { JwtPayload } from 'jwt-decode';
import { store } from '../redux/store';
import {
  setAuthData,
  clearAuthData,
  updateAccessToken,
} from '../redux/authSlice';
import { User } from '../components/Trips';

const ACCESS_TOKEN_FIELD = 'accessToken';
const REFRESH_TOKEN_FIELD = 'refreshToken';
const USER_DATA_FIELD = 'userData';

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

const getLocalUserData = () => {
  const userDataJson = localStorage.getItem(USER_DATA_FIELD);
  if (!userDataJson) {
    return null;
  }
  let userData;
  try {
    userData = JSON.parse(userDataJson);
  } catch {
    return null;
  }
  return userData;
};

const updateLocalAccessToken = (token: string) => {
  localStorage.setItem(ACCESS_TOKEN_FIELD, token);

  store.dispatch(updateAccessToken(token));
};

const setLocalTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem(ACCESS_TOKEN_FIELD, accessToken);
  localStorage.setItem(REFRESH_TOKEN_FIELD, refreshToken);
};

const restoreAuthDataFromLocalStorage = () => {
  const { accessToken, refreshToken } = getLocalTokens();
  const userData = getLocalUserData();
  if (!accessToken || !refreshToken || !userData) {
    removeLocalAuthData();
    return;
  }
  const timer = getExpirationTimer(refreshToken);
  if (!timer) {
    return;
  }
  store.dispatch(
    setAuthData({
      userData,
      tokens: { access: accessToken, refresh: refreshToken },
      timer,
    })
  );
};

const setLocalUserData = (userData: User) => {
  const userDataJson = JSON.stringify(userData);
  localStorage.setItem(USER_DATA_FIELD, userDataJson);
};

const removeLocalAuthData = () => {
  localStorage.removeItem(ACCESS_TOKEN_FIELD);
  localStorage.removeItem(REFRESH_TOKEN_FIELD);
  localStorage.removeItem(USER_DATA_FIELD);

  const timer = store.getState().auth.timer;
  if (timer) {
    clearTimeout(timer);
  }
  store.dispatch(clearAuthData());
};

const getExpirationTimer = (refreshToken: string) => {
  const refreshTokenData = jwtDecode<JwtUserPayload>(refreshToken);

  const { exp } = refreshTokenData;
  let timer = null;
  if (exp) {
    const expDate = new Date(exp * 1000);
    const expiresIn = expDate.valueOf() - Date.now();
    if (expiresIn <= 0) {
      removeLocalAuthData();
      return null;
    }
    timer = setTimeout(removeLocalAuthData, expiresIn);
  }
  return timer;
};

const TokenService = {
  getLocalRefreshToken,
  getLocalAccessToken,
  getLocalTokens,
  updateLocalAccessToken,
  getExpirationTimer,
  removeLocalAuthData,
  setLocalTokens,
  getLocalUserData,
  setLocalUserData,
  restoreAuthDataFromLocalStorage,
};

export default TokenService;
