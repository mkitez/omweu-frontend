import { FormEventHandler, useState } from 'react';
import { signIn } from 'next-auth/react';
import AuthService from '../services/auth.service';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [repeatedPassword, setRepeatedPassword] = useState('');

  const handleSubmit: FormEventHandler = async (e) => {
    e.preventDefault();
    if (username === '' || password === '' || repeatedPassword === '') {
      return;
    }
    if (password !== repeatedPassword) {
      setError("Passwords don't match");
      return;
    }
    setLoading(true);
    try {
      await AuthService.signUp(username, password);
    } catch {
      setError('Registration error');
    }
    signIn('credentials', {
      callbackUrl: '/dashboard',
      username,
      password,
    });
    setLoading(false);
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
        <input type="submit" value="Sign up" disabled={isLoading} />
      </form>
      <div>{error}</div>
    </div>
  );
};

export default Register;
