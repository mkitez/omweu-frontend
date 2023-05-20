import api from '../../../services/api';
import NextAuth, { NextAuthOptions, User } from 'next-auth';
import VkProvider from 'next-auth/providers/vk';
import CredentialsProvider from 'next-auth/providers/credentials';
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
      name: 'credentials',
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
      name: 'accountActivation',
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
    async jwt({ token, account, user }) {
      // first sign in
      if (account && user) {
        if (account.provider === 'vk') {
          const response = await api.post('/users/vkauth', account);
          const { access, refresh } = response.data.tokens;
          token.accessToken = access;
          token.refreshToken = refresh;
          token.id = response.data.user.id;
        }
        if (account.provider === 'credentials') {
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
};

export default NextAuth(authOptions);
