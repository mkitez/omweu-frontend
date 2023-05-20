import { Session, DefaultSession } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    error?: string | null;
    user: {
      id?: string;
      tokens?: any;
    } & DefaultSession['user'];
  }

  interface User {
    tokens: {
      access: string;
      refresh: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    error?: string | null;
    accessToken: string;
    refreshToken: string;
  }
}
