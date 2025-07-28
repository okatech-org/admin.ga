// types/next-auth.d.ts
import { UserRole } from '@prisma/client';
import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      role: UserRole;
      organizationId?: string;
      organization?: {
        id: string;
        name: string;
        type: string;
        code: string;
      };
      isVerified: boolean;
    };
  }

  interface User {
    role: UserRole;
    organizationId?: string;
    organization?: {
      id: string;
      name: string;
      type: string;
      code: string;
    };
    isVerified: boolean;
    firstName: string;
    lastName: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: UserRole;
    organizationId?: string;
    organization?: {
      id: string;
      name: string;
      type: string;
      code: string;
    };
    isVerified: boolean;
    firstName: string;
    lastName: string;
  }
}