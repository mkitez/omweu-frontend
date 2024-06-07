import { useMemo } from 'react';
import { getClientInstance } from '../services/api';
import { useTranslation } from 'next-i18next';

export const usePublicFetcher = () => {
  const { i18n } = useTranslation()

  const fetcher = useMemo(() => {
    const api = getClientInstance({ 'Accept-Language': i18n.language });
    return (url: string) => api.get(url).then((response) => response.data);
  }, [i18n.language]);
  return fetcher;
};
