import { AxiosBasicCredentials } from 'axios';
import BaseService from './baseService';

class DestinationService extends BaseService {
  getAllDestinations(auth?: AxiosBasicCredentials) {
    return this.api.get('/destinations/', { auth });
  }
}

export default DestinationService;
