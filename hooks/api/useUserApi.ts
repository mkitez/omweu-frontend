import { useMemo } from 'react';

import { getClientInstance } from '../../services/api';
import UserService from '../../services/user.service';

import { useDefaultHeaders } from '../useDefaultHeaders';

export const useUserApi = () => {
  const headers = useDefaultHeaders();

  const userService = useMemo(() => {
    const api = getClientInstance(headers);
    return new UserService(api);
  }, [headers]);
  return userService;
};
