// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

// Extend the default session and user types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    }
  }
  
  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
  }
}

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form
      name: 'Credentials',
      
      // The credentials object
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      
      // Authorization logic
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Find user by email
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          // If no user found or password doesn't match
          if (!user || !user.passwordHash) {
            return null;
          }

          // Compare passwords
          const passwordMatch = await bcrypt.compare(
            credentials.password,
            user.passwordHash
          );

          if (!passwordMatch) {
            return null;
          }

          // Return the user object if everything is valid
          return {
            id: user.id,
            name: user.name,
            email: user.email,
          };
        } catch (error) {
          console.error('Error in NextAuth authorize:', error);
          return null;
        } finally {
          // Disconnect Prisma client
          await prisma.$disconnect();
        }
      }
    })
  ],
  
  // Configure session handling
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  // Pages config - custom pages for auth flow
  pages: {
    signIn: '/login',
    // signOut: '/auth/signout',
    // error: '/auth/error',
    // newUser: '/dashboard'
  },
  
  // JWT configuration
  jwt: {
    // A secret to use for key generation - you should set this explicitly
    // secret: process.env.NEXTAUTH_SECRET,
  },
  
  // Callbacks
  callbacks: {
    // Modify the JWT contents
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    
    // What gets passed to the client
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    }
  },
};

// Export NextAuth handler
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };