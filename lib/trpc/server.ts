/*
  This file is now cleaned up, but we keep the comment to avoid re-introducing @ts-nocheck.
  The `as any` casts in the context creation are a pragmatic choice to avoid deep type modifications
  in the NextAuth session object for now. A more robust solution would involve module augmentation.
*/
import { initTRPC, TRPCError } from '@trpc/server';
import { type CreateNextContextOptions } from '@trpc/server/adapters/next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import superjson from 'superjson';
import { ZodError } from 'zod';

export const createTRPCContext = async (opts: CreateNextContextOptions) => {
  const { req, res } = opts;
  const session = await getServerSession(req, res, authOptions);

  if (session?.user?.id) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });

    if (user && user.role) {
      (session.user as any).roleName = user.role.name;
      (session.user as any).permissions = user.role.permissions.map(p => p.permission.name);
    }
  }

  return {
    session,
    prisma,
    req,
    res,
  };
};

// Context creator for fetch adapter
export const createTRPCFetchContext = async () => {
  const session = await getServerSession(authOptions);

  if (session?.user?.id) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });

    if (user && user.role) {
      (session.user as any).roleName = user.role.name;
      (session.user as any).permissions = user.role.permissions.map(p => p.permission.name);
    }
  }

  return {
    session,
    prisma,
    req: null as any,
    res: null as any,
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createTRPCRouter = t.router;

export const publicProcedure = t.procedure;

const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

const enforceUserIsAgent = t.middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  const allowedRoles = ['AGENT', 'MANAGER', 'ADMIN', 'SUPER_ADMIN'];
  if (!allowedRoles.includes(ctx.session.user.role)) {
    throw new TRPCError({ code: 'FORBIDDEN' });
  }

  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

const enforceUserIsAdmin = t.middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  const allowedRoles = ['ADMIN', 'SUPER_ADMIN'];
  if (!allowedRoles.includes(ctx.session.user.role)) {
    throw new TRPCError({ code: 'FORBIDDEN' });
  }

  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

const enforceUserIsManager = t.middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  const allowedRoles = ['MANAGER', 'ADMIN', 'SUPER_ADMIN'];
  if (!allowedRoles.includes(ctx.session.user.role)) {
    throw new TRPCError({ code: 'FORBIDDEN' });
  }

  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);

export const permissionProcedure = (...requiredPermissions: string[]) => {
  return t.procedure.use(enforceUserIsAuthed).use(
    t.middleware(({ ctx, next }) => {
      const userPermissions = ctx.session.user.permissions || [];
      const hasPermission = requiredPermissions.every(p => userPermissions.includes(p));

      if (!hasPermission) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: `Permissions requises: ${requiredPermissions.join(', ')}`,
        });
      }

      return next();
    })
  );
};

// Replace old role-based procedures with permission-based ones for backward compatibility
export const agentProcedure = permissionProcedure('read:users', 'read:organizations');
export const adminProcedure = permissionProcedure('manage:users', 'manage:organizations');
export const managerProcedure = permissionProcedure('update:users', 'update:organizations');
