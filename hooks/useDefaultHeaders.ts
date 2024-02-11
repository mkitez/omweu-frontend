import { useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';

export const useDefaultHeaders = () => {
  const { data: session } = useSession();
  const { i18n } = useTranslation();

  const headers = {
    Authorization: session && `Bearer ${session.accessToken}`,
    'Accept-Language': i18n.language,
  };

  return headers;
};
