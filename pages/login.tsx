import { useRouter } from 'next/router';
import type { NextPage } from 'next';
import type { FormEventHandler } from 'react';
import { useState } from 'react';
import { API_URL } from '../utils/constants';

const Login: NextPage = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit: FormEventHandler = async (e) => {
    e.preventDefault();
    const data = {
      username,
      password,
    };
    const response = await fetch(`${API_URL}/token/`, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const responseJson = await response.json();
    localStorage.setItem('access', responseJson.access);
    localStorage.setItem('refresh', responseJson.refresh);
    router.push('/');
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
        <input type="submit" value="Login" />
      </form>
    </div>
  );
};

export default Login;
