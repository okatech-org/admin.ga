// types/next-auth.d.ts
// import { UserRole } from '@prisma/client'; // UserRole is a string in current schema
import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      role: string;
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
    role: string;
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
    role: string;
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
