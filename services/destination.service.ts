import BaseService from './baseService';

class DestinationService extends BaseService {
  getAllDestinations() {
    return this.api.get('/destinations/');
  }
}

export default DestinationService;
