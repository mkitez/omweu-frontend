import UserService from '../../services/user.service';

import { createApiHook } from './hookFactory';

const useBookingApi = createApiHook<UserService>(UserService);
export { useBookingApi };
