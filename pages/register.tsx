import { useRouter } from 'next/router';
import type { NextPage } from 'next';
import { FormEventHandler, useEffect } from 'react';
import { useState } from 'react';
import AuthService from '../services/auth.service';
import TokenService from '../services/token.service';
import { AuthResponse, selectUserData, setAuthData } from '../redux/authSlice';
import { useAppDispatch, useAppSelector } from '../redux/hooks';

const Register: NextPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const userData = useAppSelector(selectUserData());
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [repeatedPassword, setRepeatedPassword] = useState('');

  useEffect(() => {
    if (!router.isReady) {
      return;
    }
    if (userData) {
      const returnUrl = (router.query.returnUrl as string) || '/';
      router.push(returnUrl);
    }
  }, [router, userData]);

  const handleSubmit: FormEventHandler = async (e) => {
    e.preventDefault();
    if (username === '' || password === '' || repeatedPassword === '') {
      return;
    }
    if (password !== repeatedPassword) {
      return;
    }
    setLoading(true);
    const authResponse: AuthResponse = await AuthService.register(
      username,
      password
    );
    setLoading(false);
    const timer = TokenService.getExpirationTimer(authResponse.tokens.refresh);
    dispatch(
      setAuthData({
        userData: authResponse.user,
        tokens: authResponse.tokens,
        timer,
      })
    );
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onInput={(e) => setUsername(e.currentTarget.value)}
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onInput={(e) => setPassword(e.currentTarget.value)}
          />
        </label>
        <label>
          Confirm password:
          <input
            type="password"
            value={repeatedPassword}
            onInput={(e) => setRepeatedPassword(e.currentTarget.value)}
          />
        </label>
        <input type="submit" value="Register" disabled={isLoading} />
      </form>
    </div>
  );
};

export default Register;
