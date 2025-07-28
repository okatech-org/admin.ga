/* @ts-nocheck */
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import type { UserRole } from "@prisma/client";
import { DEMO_ACCOUNTS } from "@/lib/constants";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Check if it's a demo account first
        const demoAccount = DEMO_ACCOUNTS.find(
          account => account.email === credentials.email && 
                     account.password === credentials.password
        );

        if (demoAccount) {
          // Return demo account directly
          return {
            id: `demo-${demoAccount.email}`,
            email: demoAccount.email,
            name: `${demoAccount.firstName} ${demoAccount.lastName}`,
            firstName: demoAccount.firstName,
            lastName: demoAccount.lastName,
            role: demoAccount.role as any,
            organizationId: null,
            organization: demoAccount.organization,
            isVerified: true,
          };
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
            include: { 
              profile: true
            }
          });

          if (!user || !user.password || !user.isActive) {
            return null;
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password, 
            user.password
          );

          if (!isPasswordValid) {
            return null;
          }

          // Update last login
          await prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() }
          });

          return {
            id: user.id,
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role as any,
            organizationId: (user as any).primaryOrganizationId,
            organization: null,
            isVerified: user.isVerified,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      }
    })
  ],
  
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  
  secret: process.env.NEXTAUTH_SECRET,
  
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.role = user.role;
        token.organizationId = user.organizationId;
        token.organization = user.organization;
        token.isVerified = user.isVerified;
      }
      return token;
    },
    
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.firstName = token.firstName as string;
        session.user.lastName = token.lastName as string;
        session.user.role = token.role as UserRole;
        session.user.organizationId = token.organizationId as string;
        session.user.organization = token.organization as any;
        session.user.isVerified = token.isVerified as boolean;
      }
      
      // Ensure we always return a valid session object
      return {
        ...session,
        expires: session.expires,
      };
    }
  },
  
  pages: {
    signIn: "/auth/connexion",
    error: "/auth/erreur",
  },
  
  events: {
    async signIn({ user, account, profile }) {
      // Skip audit log for demo accounts
      if (user.id?.startsWith('demo-')) {
        return;
      }
      
      try {
        await (prisma as any).auditLog.create({
          data: {
            action: 'USER_LOGIN',
            entityType: 'USER',
            entityId: user.id,
            userId: user.id,
            metadata: {
              provider: account?.provider || 'credentials',
              ip: null, // Would need request context
              userAgent: null, // Would need request context
            },
          },
        });
      } catch (error) {
        console.error('Failed to create audit log:', error);
        // Don't block login if audit log fails
      }
    },
    async signOut({ session }) {
      // Skip audit log for demo accounts
      if (session?.user?.id?.startsWith('demo-')) {
        return;
      }
      
      if (session?.user?.id) {
        try {
          await (prisma as any).auditLog.create({
            data: {
              action: 'USER_LOGOUT',
              entityType: 'USER',
              entityId: session.user.id,
              userId: session.user.id,
              metadata: {},
            },
          });
        } catch (error) {
          console.error('Failed to create audit log:', error);
          // Don't block logout if audit log fails
        }
      }
    },
  },
  
  debug: process.env.NODE_ENV === "development",
};