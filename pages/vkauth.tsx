import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import AuthService from '../services/auth.service';
import TokenService from '../services/token.service';

interface QueryParams {
  code?: string;
  error?: string;
  error_reason?: string;
  error_description?: string;
}

const VkAuth: NextPage = () => {
  const router = useRouter();
  const [error, setError] = useState('');
  useEffect(() => {
    if (!router.isReady) {
      return;
    }
    const { code, error, error_description } = router.query as QueryParams;
    if (error && error_description) {
      setError(error_description);
      return;
    }

    const vkAuth = async () => {
      const response = await AuthService.vkAuth(code);
      const { access, refresh } = response;
      TokenService.setLocalTokens(access, refresh);
      router.push('/dashboard');
    };
    vkAuth();
  }, [router]);

  if (error) {
    return <div>{error}</div>;
  }

  return <div>Authenticating with VK...</div>;
};

export default VkAuth;
