import type { NextPage } from 'next';
import { FormEventHandler } from 'react';
import { useState } from 'react';
import { useAppDispatch, useAppSelector, useAuth } from '../redux/hooks';
import { logIn, selectAuthLoadStatus } from '../redux/authSlice';

const Login: NextPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch();
  const authLoadStatus = useAppSelector(selectAuthLoadStatus());

  useAuth({ redirectTo: '/dashboard ' });

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
