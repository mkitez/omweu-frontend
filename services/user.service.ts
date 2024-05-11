import { UserFormData } from '../components/UserProfileForm';
import BaseService from './baseService';

class UserService extends BaseService {
  async getSelf() {
    const response = await this.api.get('/users/self/');
    return response.data;
  }

  async updateSelf(data: Partial<UserFormData>) {
    const response = await this.api.put('/users/self/', data);
    return response.data;
  }
}

export default UserService;
