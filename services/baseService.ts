import { AxiosInstance } from 'axios';

abstract class BaseService {
  readonly api: AxiosInstance;

  constructor(api: AxiosInstance) {
    this.api = api;
  }
}

export default BaseService;
