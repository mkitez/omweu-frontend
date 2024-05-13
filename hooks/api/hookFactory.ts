import { useMemo } from 'react';

import { getClientInstance } from '../../services/api';
import BaseService, { IBaseService } from '../../services/baseService';

import { useDefaultHeaders } from '../useDefaultHeaders';

export function createApiHook<T extends BaseService>(Service: IBaseService) {
  return () => {
    const headers = useDefaultHeaders();

    const service = useMemo(() => {
      const api = getClientInstance(headers);
      return new Service(api) as T;
    }, [headers]);
    return service;
  };
}
