import { useRouter } from 'next/router';
import type { NextPage } from 'next';
import { FormEventHandler, useEffect } from 'react';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  logIn,
  selectAuthLoadStatus,
  selectUserData,
} from '../redux/authSlice';

const Login: NextPage = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch();
  const authLoadStatus = useAppSelector(selectAuthLoadStatus());
  const userData = useAppSelector(selectUserData());

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
    dispatch(logIn({ username, password }));
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Username:{' '}
          <input
            value={username}
            onInput={(e) => setUsername(e.currentTarget.value)}
            placeholder="username"
            type="text"
          />
        </label>
        <label>
          Password:{' '}
          <input
            value={password}
            onInput={(e) => setPassword(e.currentTarget.value)}
            placeholder="*****"
            type="password"
          ></input>
        </label>
        <input
          type="submit"
          value="Login"
          disabled={authLoadStatus === 'loading'}
        />
      </form>
    </div>
  );
};

export default Login;
