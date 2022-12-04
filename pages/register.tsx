import type { NextPage } from 'next';
import { FormEventHandler } from 'react';
import { useState } from 'react';
import AuthService from '../services/auth.service';

const Register: NextPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [repeatedPassword, setRepeatedPassword] = useState('');

  const handleSubmit: FormEventHandler = async (e) => {
    e.preventDefault();
    if (username === '' || password === '' || repeatedPassword === '') {
      return;
    }
    if (password !== repeatedPassword) {
      return;
    }
    setLoading(true);
    const authResponse = await AuthService.register(username, password);
    setLoading(false);
    // TBD
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
