import { useRouter } from 'next/router';
import type { NextPage } from 'next';
import type { FormEventHandler } from 'react';
import { useState } from 'react';
import AuthService from '../services/auth.service';

const Login: NextPage = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit: FormEventHandler = async (e) => {
    e.preventDefault();
    await AuthService.logIn(username, password);
    let returnUrl = router.query.returnUrl || '/';
    if (typeof returnUrl === 'object') {
      returnUrl = returnUrl[0];
    }
    router.push(returnUrl);
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
