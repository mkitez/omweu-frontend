import NextAuth, { NextAuthOptions, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import VkProvider from 'next-auth/providers/vk';

import api from '../../../services/api';

import { isJwtExpired } from '../../../utils/commonUtils';

const generateUserFromAuthResponse = (
  response: Awaited<ReturnType<typeof api.post<any>>>
): User => {
  const { user, tokens } = response.data;
  return {
    id: user.id,
    name: `${user.first_name} ${user.last_name}`,
    email: user.email,
    image: user.photo,
    tokens,
  };
};

export const authOptions: NextAuthOptions = {
  providers: [
    VkProvider({
      clientId: process.env.VK_CLIENT_ID as string,
      clientSecret: process.env.VK_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      id: 'email-password',
      name: 'Email and Password',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const response = await api.post('/token/', credentials);
        return generateUserFromAuthResponse(response);
      },
    }),
    CredentialsProvider({
      id: 'account-activation',
      name: 'Account Activation',
      credentials: {
        uidb64: { type: 'text' },
        token: { type: 'text' },
      },
      async authorize(credentials) {
        const response = await api.post('/users/activate', credentials);
        return generateUserFromAuthResponse(response);
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, user, trigger, session }) {
      // first sign in
      if (account && user) {
        if (account.provider === 'vk') {
          const response = await api.post('/users/vkauth', account);
          const { access, refresh } = response.data.tokens;
          token.accessToken = access;
          token.refreshToken = refresh;
          token.id = response.data.user.id;
        }
        if (account.type === 'credentials') {
          const { access, refresh } = user?.tokens;
          token.accessToken = access;
          token.refreshToken = refresh;
          token.id = user?.id;
        }
      }

      if (isJwtExpired(token.refreshToken)) {
        return {
          ...token,
          error: 'RefreshTokenExpired',
        };
      }

      if (isJwtExpired(token.accessToken)) {
        try {
          const response = await api.post('/token/refresh/', {
            refresh: token.refreshToken,
          });
          token.accessToken = response.data.access;
        } catch {
          return {
            ...token,
            error: 'RefreshAccessTokenError',
          };
        }
      }
      return token;
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.user.id = token.id;
      session.user.email = token.email || null;
      session.error = token.error || null;
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
  },
};

export default NextAuth(authOptions);
