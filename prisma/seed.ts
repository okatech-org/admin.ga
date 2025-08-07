import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Start seeding...');

  // 1. Create Permissions
  const permissions = [
    // User Management
    'manage:users',
    'read:users',
    'create:users',
    'update:users',
    'delete:users',

    // Organization Management
    'manage:organizations',
    'read:organizations',
    'create:organizations',
    'update:organizations',
    'delete:organizations',

    // System Configuration
    'manage:system',
    'read:configuration',
    'update:configuration',

    // Reporting and Analytics
    'read:reports',
    'read:analytics',
    'export:data',
  ];

  for (const name of permissions) {
    await prisma.permission.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  console.log('✅ Permissions created');

  // 2. Create Roles
  const superAdminRole = await prisma.role.upsert({
    where: { name: 'SUPER_ADMIN' },
    update: {},
    create: {
      name: 'SUPER_ADMIN',
      description: 'Full access to all system features',
    },
  });

  const adminRole = await prisma.role.upsert({
    where: { name: 'ADMIN' },
    update: {},
    create: {
      name: 'ADMIN',
      description: 'Administrative access to most features',
    },
  });

  const userRole = await prisma.role.upsert({
    where: { name: 'USER' },
    update: {},
    create: {
      name: 'USER',
      description: 'Standard user access',
    },
  });
  console.log('✅ Roles created');

  // 3. Assign Permissions to Roles
  const allPermissions = await prisma.permission.findMany();

  // Super Admin gets all permissions
  for (const permission of allPermissions) {
    await prisma.rolesOnPermissions.upsert({
      where: {
        roleId_permissionId: {
          roleId: superAdminRole.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: superAdminRole.id,
        permissionId: permission.id,
      },
    });
  }

  // Admin gets most permissions (except system management)
  const adminPermissions = allPermissions.filter(p => !p.name.startsWith('manage:system'));
  for (const permission of adminPermissions) {
    await prisma.rolesOnPermissions.upsert({
      where: {
        roleId_permissionId: {
          roleId: adminRole.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: adminRole.id,
        permissionId: permission.id,
      },
    });
  }

  // User gets read-only permissions
  const userPermissions = allPermissions.filter(p => p.name.startsWith('read:'));
  for (const permission of userPermissions) {
    await prisma.rolesOnPermissions.upsert({
      where: {
        roleId_permissionId: {
          roleId: userRole.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: userRole.id,
        permissionId: permission.id,
      },
    });
  }
  console.log('✅ Permissions assigned to roles');

  // 4. Create a default Super Admin user
  const superAdminUser = await prisma.user.upsert({
    where: { email: 'superadmin@administration.ga' },
    update: {},
    create: {
      email: 'superadmin@administration.ga',
      firstName: 'Super',
      lastName: 'Admin',
      roleId: superAdminRole.id,
      isVerified: true,
    },
  });
  console.log('✅ Super Admin user created:', superAdminUser.email);

  console.log('🌱 Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
