import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import { prisma } from "@/lib/prisma";
import type { NextAuthOptions } from "next-auth";
import { UserRole } from "@prisma/client";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],
  callbacks: {
    // Called on sign-in, used here to upsert user with name and location
    async signIn({ user, account, profile }) {
      console.log({ "user in authOptions": user });
      console.log({ "profile in authOptions": profile });
      if (!user.email) return false; // email is required

      // Determine name and location from available data
      const name = user.name ?? null;
      // For location, you must pass it from frontend via signIn params or handle differently
      // We'll assume location is passed via user.location or null
      const location = user.location ?? null;

      await prisma.user.upsert({
        where: { email: user.email },
        create: {
          email: user.email,
          name,
          location,
        },
        update: {
          name,
          location,
        },
      });

      return true;
    },

    // JWT callback to persist custom fields in token
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.location = user.location;
        token.role = user.role;
        token.isVerified = user.isVerified;
      }
      return token;
    },

    // Session callback to expose custom fields to client session
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string | null;
        session.user.location = token.location as string | null;
        session.user.role = token.role as UserRole | undefined;
        session.user.isVerified = token.isVerified as boolean | undefined;
      }
      return session;
    },

    // Optional redirect after sign in
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl + "/dashboard";
    },
  },

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/auth/signin",
    newUser: "/auth/signup",
  },
};
