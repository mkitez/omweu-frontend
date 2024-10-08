let HOSTNAME: string;
let PROTOCOL: string;

if (process.env.NODE_ENV === 'development') {
  PROTOCOL = 'http';
  HOSTNAME = '127.0.0.1:8000';
} else {
  PROTOCOL = 'https';
  HOSTNAME = 'eubycar.com';
}
export { HOSTNAME };

export const CMS_API_URL = process.env.STRAPI_CONTAINER_NAME
  ? `http://${process.env.STRAPI_CONTAINER_NAME}:1337/api`
  : 'https://cms.eubycar.com/api';

export const API_URL = `${PROTOCOL}://${HOSTNAME}/api/v1`;
export const HERE_API_KEY = process.env.NEXT_PUBLIC_HERE_API_KEY;
export const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
export const STRAPI_ACCESS_TOKEN = process.env.STRAPI_ACCESS_TOKEN;
export const STAFF_USER_EMAIL = process.env.STAFF_USER_EMAIL;
export const STAFF_USER_PASSWORD = process.env.STAFF_USER_PASSWORD;

export const GTM_ID = 'G-0ZVVNHC0SN';
export const GA_DISABLE_PROPERTY = `ga-disable-${GTM_ID}`

export const REVALIDATE_INTERVAL = 60;
