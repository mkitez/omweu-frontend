import api from '../../../services/api';
import NextAuth, { NextAuthOptions } from 'next-auth';
import VkProvider from 'next-auth/providers/vk';
import CredentialsProvider from 'next-auth/providers/credentials';
import { isJwtExpired } from '../../../utils/commonUtils';

export const authOptions: NextAuthOptions = {
  providers: [
    VkProvider({
      clientId: process.env.VK_CLIENT_ID as string,
      clientSecret: process.env.VK_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const response = await api.post('/token/', credentials);
        const { user, tokens } = response.data;
        return {
          id: user.id,
          name: `${user.first_name} ${user.last_name}`,
          email: user?.email || '',
          image: '',
          tokens,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, user }: any) {
      // first sign in
      if (account) {
        if (account.provider === 'vk') {
          const response = await api.post('/users/vkauth', account);
          const { access, refresh } = response.data.tokens;
          token.accessToken = access;
          token.refreshToken = refresh;
        }
        if (account.provider === 'credentials') {
          const { access, refresh } = user.tokens;
          token.accessToken = access;
          token.refreshToken = refresh;
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

    async session({ session, token }: any) {
      session.accessToken = token.accessToken;
      session.user!.email = null;
      session.error = token.error || null;
      return session;
    },
  },
};

export default NextAuth(authOptions);
