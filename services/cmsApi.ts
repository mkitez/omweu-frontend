import axios from 'axios';
import { CMS_API_URL, STRAPI_ACCESS_TOKEN } from '../utils/constants';

const instance = axios.create({
  baseURL: CMS_API_URL,
  headers: {
    Authorization: `Bearer ${STRAPI_ACCESS_TOKEN}`,
  },
});

export default instance;
