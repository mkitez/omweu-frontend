import { useMemo } from 'react';
import { useDefaultHeaders } from './useDefaultHeaders';
import { getClientInstance } from '../services/api';

export const useAuthorizedFetcher = () => {
  const headers = useDefaultHeaders();

  const fetcher = useMemo(() => {
    const api = getClientInstance(headers);
    return (url: string) => api.get(url).then((response) => response.data);
  }, [headers]);
  return fetcher;
};
