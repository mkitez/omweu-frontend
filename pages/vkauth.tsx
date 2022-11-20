import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { vkLogin } from '../redux/authSlice';
import { useAppDispatch, useAuth } from '../redux/hooks';

interface QueryParams {
  code?: string;
  error?: string;
  error_reason?: string;
  error_description?: string;
}

const VkAuth: NextPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [error, setError] = useState('');
  useAuth({ redirectTo: '/dashboard ' });
  useEffect(() => {
    const { code, error, error_description } = router.query as QueryParams;
    if (error && error_description) {
      setError(error_description);
      return;
    }
    if (!code) {
      return;
    }
    dispatch(vkLogin(code));
  }, [router, dispatch]);

  if (error) {
    return <div>{error}</div>;
  }

  return <div>Authenticating with VK...</div>;
};

export default VkAuth;
