import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import type { User } from '../components/Trips';
import AuthService from '../services/auth.service';
import TokenService from '../services/token.service';

interface Tokens {
  access: string;
  refresh: string;
}

interface AuthState {
  isInitialized: boolean;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string;
  userData: null | User;
  tokens: null | Tokens;
  timer: null | ReturnType<typeof setTimeout>;
}

interface SetUserAction {
  userData: null | User;
}

interface SetAuthAction {
  userData: null | User;
  tokens: null | Tokens;
  timer: null | ReturnType<typeof setTimeout>;
}

const initialState: AuthState = {
  isInitialized: false,
  status: 'idle',
  error: '',
  userData: null,
  tokens: null,
  timer: null,
};

export interface AuthResponse {
  user: User;
  tokens: Tokens;
}

interface Credentials {
  username: string;
  password: string;
}

export const logIn = createAsyncThunk(
  'auth/logIn',
  async ({ username, password }: Credentials) => {
    const response: AuthResponse = await AuthService.logIn(username, password);
    const timer = TokenService.getExpirationTimer(response.tokens.refresh);
    return { response, timer };
  }
);

export const vkLogin = createAsyncThunk(
  'auth/vkLogin',
  async (code: string) => {
    const response: AuthResponse = await AuthService.vkAuth(code);
    const timer = TokenService.getExpirationTimer(response.tokens.refresh);
    return { response, timer };
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<SetUserAction>) => {
      state.userData = action.payload.userData;
    },
    setAuthData: (state, action: PayloadAction<SetAuthAction>) => {
      state.isInitialized = true;
      state.userData = action.payload.userData;
      state.tokens = action.payload.tokens;
      state.timer = action.payload.timer;
    },
    clearAuthData: (state) => {
      state.isInitialized = true;
      state.userData = null;
      state.tokens = null;
      state.timer = null;
    },
    updateAccessToken: (state, action: PayloadAction<string>) => {
      if (!state.tokens) {
        return;
      }
      state.tokens.access = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logIn.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(logIn.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.userData = action.payload.response.user;
      state.tokens = action.payload.response.tokens;
      state.timer = action.payload.timer;
    });
    builder.addCase(logIn.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.error.message || '';
    });

    builder.addCase(vkLogin.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(vkLogin.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.userData = action.payload.response.user;
      state.tokens = action.payload.response.tokens;
      state.timer = action.payload.timer;
    });
    builder.addCase(vkLogin.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.error.message || '';
    });
  },
});

export const selectAuthInitStatus = () => (state: RootState) =>
  state.auth.isInitialized;
export const selectAuthLoadStatus = () => (state: RootState) =>
  state.auth.status;
export const selectUserData = () => (state: RootState) => state.auth.userData;

export const { setAuthData, updateAccessToken, clearAuthData } =
  authSlice.actions;

export default authSlice.reducer;
