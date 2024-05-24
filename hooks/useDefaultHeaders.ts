import { useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import { useMemo } from 'react';

import { getDefaultHeaders } from '../services/getDefaultHeaders';

export const useDefaultHeaders = () => {
  const { data: session } = useSession();
  const { i18n } = useTranslation();

  const headers = useMemo(
    () => getDefaultHeaders(session, i18n.language),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [session?.accessToken, i18n.language]
  );

  return headers;
};
