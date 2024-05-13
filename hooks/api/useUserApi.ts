import UserService from '../../services/user.service';

import { createApiHook } from './hookFactory';

const useUserApi = createApiHook<UserService>(UserService);
export { useUserApi };
