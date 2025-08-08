import { describe, it, expect, vi } from 'vitest';
import { organizationsRouter } from '../organizations';
import { prisma } from '../../prisma';

// Mock prisma client
vi.mock('../../prisma', () => ({
  prisma: {
    organization: {
      findUnique: vi.fn(),
    },
  },
}));

describe('organizationsRouter.get', () => {
  it('should return an organization if found', async () => {
    const mockOrganization = {
      id: '1',
      name: 'Test Organization',
      code: 'TEST',
      users: [],
      parent: null,
      children: [],
    };
    (prisma.organization.findUnique as any).mockResolvedValue(mockOrganization);

    const caller = organizationsRouter.createCaller({
      prisma: prisma,
      session: {
        user: { id: '1', name: 'Test User', email: 'test@test.com', role: 'ADMIN' },
        expires: new Date().toISOString(),
      },
    } as any);

    const result = await caller.get({ id: '1' });

    expect(result).toEqual(mockOrganization);
    expect(prisma.organization.findUnique).toHaveBeenCalledWith({
      where: { id: '1' },
      include: {
        users: {
          select: { id: true, name: true, email: true, role: true },
          take: 10,
          orderBy: { name: 'asc' },
        },
        parent: { select: { id: true, name: true, code: true } },
        children: { select: { id: true, name: true, code: true }, take: 10 },
      },
    });
  });

  it('should throw a TRPCError if organization not found', async () => {
    (prisma.organization.findUnique as any).mockResolvedValue(null);

    const caller = organizationsRouter.createCaller({
      prisma: prisma,
      session: {
        user: { id: '1', name: 'Test User', email: 'test@test.com', role: 'ADMIN' },
        expires: new Date().toISOString(),
      },
    } as any);

    await expect(caller.get({ id: '2' })).rejects.toThrowError(
      /Organisme avec ID '2' non trouvé/
    );
  });
});
