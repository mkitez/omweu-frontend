const BASE_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:8000'
    : 'https://omweu.app';

export const API_URL = `${BASE_URL}/api/v1`;
export const HERE_API_KEY = process.env.NEXT_PUBLIC_HERE_API_KEY;
