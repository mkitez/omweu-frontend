import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import { JwtUserPayload } from '../services/token.service';

interface AuthState {
  isInitialized: boolean;
  accessTokenData: null | JwtUserPayload;
  refreshTokenData: null | JwtUserPayload;
  timer: null | ReturnType<typeof setTimeout>;
}

interface SetAuthAction {
  accessTokenData: null | JwtUserPayload;
  refreshTokenData: null | JwtUserPayload;
  timer: null | ReturnType<typeof setTimeout>;
}

const initialState: AuthState = {
  isInitialized: false,
  accessTokenData: null,
  refreshTokenData: null,
  timer: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthTokens: (state, action: PayloadAction<SetAuthAction>) => {
      state.isInitialized = true;
      state.accessTokenData = action.payload.accessTokenData;
      state.refreshTokenData = action.payload.refreshTokenData;
      state.timer = action.payload.timer;
    },
    updateAccessToken: (state, action: PayloadAction<JwtUserPayload>) => {
      state.accessTokenData = action.payload;
    },
    clearAuthTokens: (state) => {
      state.isInitialized = true;
      state.accessTokenData = null;
      state.refreshTokenData = null;
      state.timer = null;
    },
  },
});

export const selectAuthStatus = () => (state: RootState) =>
  state.auth.isInitialized;
export const selectAccessTokenData = () => (state: RootState) =>
  state.auth.accessTokenData;
export const selectRefreshTokenData = () => (state: RootState) =>
  state.auth.refreshTokenData;

export const { setAuthTokens, updateAccessToken, clearAuthTokens } =
  authSlice.actions;

export default authSlice.reducer;
