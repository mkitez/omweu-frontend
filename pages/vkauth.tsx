import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { selectUserData, vkLogin } from '../redux/authSlice';
import { useAppDispatch, useAppSelector } from '../redux/hooks';

interface QueryParams {
  code?: string;
  error?: string;
  error_reason?: string;
  error_description?: string;
}

const VkAuth: NextPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const userData = useAppSelector(selectUserData());
  const [error, setError] = useState('');
  useEffect(() => {
    if (!router.isReady) {
      return;
    }
    if (userData) {
      router.push('/dashboard');
      return;
    }
    const { code, error, error_description } = router.query as QueryParams;
    if (error && error_description) {
      setError(error_description);
      return;
    }
    if (!code) {
      setError('Code is not provided.');
      return;
    }
    dispatch(vkLogin(code));
  }, [router, dispatch, userData]);

  if (error) {
    return <div>{error}</div>;
  }

  return <div>Authenticating with VK...</div>;
};

export default VkAuth;
