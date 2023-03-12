import { Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    error?: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
  }
}
