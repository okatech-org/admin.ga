/**
 * Script de seeding pour Administration.GA
 * Initialise la base de données avec les données de base et les configurations IA
 */

// @ts-nocheck
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Organisations de base
const baseOrganizations = [
  {
    name: 'Présidence de la République',
    code: 'PRESIDENCE',
    type: 'INSTITUTION_SUPREME',
    address: 'Libreville, Gabon',
    email: 'contact@presidence.ga',
    phone: '+241 01 44 30 00',
    website: 'https://presidence.ga',
    isActive: true,
  },
  {
    name: 'Primature',
    code: 'PRIMATURE',
    type: 'INSTITUTION_SUPREME',
    address: 'Libreville, Gabon',
    email: 'contact@primature.ga',
    phone: '+241 01 44 30 01',
    website: 'https://primature.ga',
    isActive: true,
  },
  {
    name: 'Ministère de l\'Intérieur',
    code: 'MIN_INTERIEUR',
    type: 'MINISTERE',
    address: 'Libreville, Gabon',
    email: 'contact@interieur.gouv.ga',
    phone: '+241 01 44 20 01',
    website: 'https://interieur.gouv.ga',
    isActive: true,
  },
  {
    name: 'Ministère de la Santé',
    code: 'MIN_SANTE',
    type: 'MINISTERE',
    address: 'Libreville, Gabon',
    email: 'contact@sante.gouv.ga',
    phone: '+241 01 44 20 02',
    website: 'https://sante.gouv.ga',
    isActive: true,
  },
  {
    name: 'Ministère de l\'Éducation Nationale',
    code: 'MIN_EDUCATION',
    type: 'MINISTERE',
    address: 'Libreville, Gabon',
    email: 'contact@education.gouv.ga',
    phone: '+241 01 44 20 03',
    website: 'https://education.gouv.ga',
    isActive: true,
  },
  {
    name: 'Préfecture du Haut-Ogooué',
    code: 'PREF_HAUT_OGOOUE',
    type: 'PREFECTURE',
    address: 'Franceville, Gabon',
    email: 'contact@prefecture-haut-ogooue.ga',
    phone: '+241 01 67 30 01',
    isActive: true,
  },
  {
    name: 'Mairie de Libreville',
    code: 'MAIRIE_LIBREVILLE',
    type: 'MAIRIE',
    address: 'Libreville, Gabon',
    email: 'contact@mairie-libreville.ga',
    phone: '+241 01 44 25 01',
    website: 'https://mairie-libreville.ga',
    isActive: true,
  },
];

// Utilisateurs de base
const baseUsers = [
  {
    email: 'admin@administration.ga',
    firstName: 'Super',
    lastName: 'Admin',
    role: 'SUPER_ADMIN',
    password: 'admin123',
  },
  {
    email: 'demo.citoyen@administration.ga',
    firstName: 'Demo',
    lastName: 'Citoyen',
    role: 'CITOYEN',
    password: 'demo123',
  },
  {
    email: 'demo.agent@administration.ga',
    firstName: 'Demo',
    lastName: 'Agent',
    role: 'AGENT',
    password: 'demo123',
  },
];

async function seedOrganizations() {
  console.log('🏢 Seeding organizations...');

  for (const org of baseOrganizations) {
    await prisma.organization.upsert({
      where: { code: org.code },
      update: org,
      create: org,
    });
  }

  console.log(`✅ ${baseOrganizations.length} organizations created`);
}

async function seedUsers() {
  console.log('👥 Seeding users...');

  for (const user of baseUsers) {
    const hashedPassword = await bcrypt.hash(user.password, 12);

    const userData = {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role as any,
      password: hashedPassword,
      isVerified: true,
      emailVerifiedAt: new Date(),
    };

    const createdUser = await prisma.user.upsert({
      where: { email: user.email },
      update: userData,
      create: userData,
    });

    // Créer le profil utilisateur
    await prisma.profile.upsert({
      where: { userId: createdUser.id },
      update: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
      create: {
        userId: createdUser.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  }

  console.log(`✅ ${baseUsers.length} users created with profiles`);
}

async function main() {
  console.log('🚀 Starting seed...\n');

  try {
    await seedOrganizations();
    await seedUsers();

    console.log('\n🎉 Seed completed successfully!');

    // Statistiques
    const orgCount = await prisma.organization.count();
    const userCount = await prisma.user.count();
    const profileCount = await prisma.profile.count();

    console.log('\n📊 Statistics:');
    console.log(`   Organizations: ${orgCount}`);
    console.log(`   Users: ${userCount}`);
    console.log(`   Profiles: ${profileCount}`);

  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
