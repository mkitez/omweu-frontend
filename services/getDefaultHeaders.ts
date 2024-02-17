import { Session } from 'next-auth';

export const getDefaultHeaders = (session: Session | null, locale?: string) => {
  return {
    Authorization: session && `Bearer ${session.accessToken}`,
    'Accept-Language': locale || 'en',
  };
};
