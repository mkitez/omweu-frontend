import { UserFormData } from '../components/UserProfileForm';
import BaseService from './baseService';

export interface SignupData {
  email: string;
  password: string;
  first_name: string;
  last_name?: string;
  phone_number: string;
  birth_date: string;
  captcha: string;
  callback_url?: string;
}

interface ActivationLinkData {
  uidb64: string;
}

class UserService extends BaseService {
  createUser(data: SignupData) {
    return this.api.post('/users/', data);
  }

  getSelf() {
    return this.api.get('/users/self/');
  }

  updateSelf(data: Partial<UserFormData>) {
    return this.api.put('/users/self/', data);
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

  sendActivationLink(data: ActivationLinkData) {
    return this.api.post('/users/send-activation-link', data)
  }

  getPendingActions() {
    return this.api.get('/users/pending-actions/')
  }
}

export default UserService;
