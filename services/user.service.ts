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

  uploadPhoto(data: FormData) {
    return this.api.put('/users/photo/', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  deletePhoto() {
    return this.api.delete('/users/photo/');
  }

  getUser(userId: string) {
    return this.api.get(`/users/${userId}/`);
  }
}

export default UserService;
