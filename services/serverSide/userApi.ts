import UserService from '../user.service';
import { createApiGetter } from './apiFactory';

const getUserApi = createApiGetter<UserService>(UserService);
export { getUserApi };
