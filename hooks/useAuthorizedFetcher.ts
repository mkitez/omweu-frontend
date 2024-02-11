import { useDefaultHeaders } from './useDefaultHeaders';
import api from '../services/api';

export const useAuthorizedFetcher = () => {
  const headers = useDefaultHeaders();

  return (url: string) =>
    api.get(url, { headers }).then((response) => response.data);
};
