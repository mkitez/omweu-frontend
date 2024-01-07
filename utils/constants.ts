const BASE_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:8000'
    : 'https://eubycar.com';
const CMS_HOST_NAME = process.env.STRAPI_CONTAINER_NAME || '0.0.0.0';

export const API_URL = `${BASE_URL}/api/v1`;
export const CMS_API_URL = `http://${CMS_HOST_NAME}:1337/api`;
export const HERE_API_KEY = process.env.NEXT_PUBLIC_HERE_API_KEY;
export const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
export const STRAPI_ACCESS_TOKEN = process.env.STRAPI_ACCESS_TOKEN;
