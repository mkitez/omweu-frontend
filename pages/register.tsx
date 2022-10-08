import { useRouter } from 'next/router';
import type { NextPage } from 'next';
import type { FormEventHandler } from 'react';
import { useState } from 'react';
import { API_URL } from '../utils/constants';
import { saveTokens } from '../utils/commonUtils';

const Register: NextPage = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [repeatedPassword, setRepeatedPassword] = useState('');

  const handleSubmit: FormEventHandler = async (e) => {
    e.preventDefault();
    if (username === '' || password === '' || repeatedPassword === '') {
      return;
    }
    if (password !== repeatedPassword) {
      return;
    }
    const response = await fetch(`${API_URL}/users/`, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    const responseJson = await response.json();
    saveTokens(responseJson.token);
    router.push('/');
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
        <input type="submit" value="Register" />
      </form>
    </div>
  );
};

export default Register;
