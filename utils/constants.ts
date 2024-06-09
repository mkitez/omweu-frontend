const BASE_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://127.0.0.1:8000'
    : 'https://eubycar.com';

export const CMS_API_URL = process.env.STRAPI_CONTAINER_NAME
  ? `http://${process.env.STRAPI_CONTAINER_NAME}:1337/api`
  : 'https://cms.eubycar.com/api';

export const API_URL = `${BASE_URL}/api/v1`;
export const HERE_API_KEY = process.env.NEXT_PUBLIC_HERE_API_KEY;
export const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
export const STRAPI_ACCESS_TOKEN = process.env.STRAPI_ACCESS_TOKEN;
export const GTM_ID = 'G-0ZVVNHC0SN';
export const GA_DISABLE_PROPERTY = `ga-disable-${GTM_ID}`

export const REVALIDATE_INTERVAL = 60;
