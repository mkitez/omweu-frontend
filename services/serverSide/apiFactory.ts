import { Session } from 'next-auth';

import { getInstance } from '../api';
import BaseService, { IBaseService } from '../baseService';
import { getDefaultHeaders } from '../getDefaultHeaders';

export function createApiGetter<T extends BaseService>(Service: IBaseService) {
  return (session: Session | null, locale?: string) => {
    const headers = getDefaultHeaders(session, locale);
    const api = getInstance(headers);
    return new Service(api) as T;
  };
}
