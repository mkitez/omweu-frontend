import { Session } from 'next-auth';

import { getInstance } from '../api';
import { getDefaultHeaders } from '../getDefaultHeaders';
import UserService from '../user.service';

export const getUserApi = (session: Session | null, locale?: string) => {
  const headers = getDefaultHeaders(session, locale);
  const api = getInstance(headers);
  return new UserService(api);
};
