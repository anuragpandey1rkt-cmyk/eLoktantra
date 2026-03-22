import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_NESTJS_API_URL || 'https://backend-elokantra.onrender.com'}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
          });

          const data = await response.json();

          if (response.ok && data.success && data.token) {
            // Verify roles - only allow ADMIN
            if (data.user?.role !== 'ADMIN') {
              throw new Error('Access denied: Admin role required');
            }

            return {
              id: data.user.id,
              name: data.user.name,
              email: data.user.email,
              backendToken: data.token,
            };
          }
          
          throw new Error(data.error || 'Login failed');
        } catch (error: any) {
          console.error('BACKEND_AUTH_ERROR:', error.message);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.backendToken = user.backendToken;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (token) {
        session.backendToken = token.backendToken;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
