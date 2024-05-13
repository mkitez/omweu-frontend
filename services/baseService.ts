import { AxiosInstance } from 'axios';

export interface IBaseService {
  new (api: AxiosInstance): BaseService;
}

abstract class BaseService {
  readonly api: AxiosInstance;

  constructor(api: AxiosInstance) {
    this.api = api;
  }
}

export default BaseService;
