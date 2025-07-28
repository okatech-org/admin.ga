import { PrismaClient, UserRole, OrganizationType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Début du seeding...');

  // Créer les organisations
  const organizations = [
    {
      name: 'Mairie de Libreville',
      type: OrganizationType.MAIRIE,
      code: 'MAIRE_LBV',
      description: 'Mairie de la capitale du Gabon',
      services: ['ACTE_NAISSANCE', 'ACTE_MARIAGE', 'ACTE_DECES', 'PERMIS_CONSTRUIRE', 'AUTORISATION_COMMERCE'],
      workingHours: {
        monday: { start: '08:00', end: '17:00' },
        tuesday: { start: '08:00', end: '17:00' },
        wednesday: { start: '08:00', end: '17:00' },
        thursday: { start: '08:00', end: '17:00' },
        friday: { start: '08:00', end: '17:00' },
        saturday: { start: '08:00', end: '12:00' }
      }
    },
    {
      name: 'Direction Générale de la Documentation et de l\'Immigration',
      type: OrganizationType.DIRECTION_GENERALE,
      code: 'DGDI',
      description: 'Service national de l\'immigration et des documents d\'identité',
      services: ['PASSEPORT', 'CARTE_SEJOUR', 'CNI'],
      workingHours: {
        monday: { start: '07:30', end: '15:30' },
        tuesday: { start: '07:30', end: '15:30' },
        wednesday: { start: '07:30', end: '15:30' },
        thursday: { start: '07:30', end: '15:30' },
        friday: { start: '07:30', end: '15:30' }
      }
    },
    {
      name: 'Caisse Nationale de Sécurité Sociale',
      type: OrganizationType.ORGANISME_SOCIAL,
      code: 'CNSS',
      description: 'Organisme de sécurité sociale du Gabon',
      services: ['IMMATRICULATION_CNSS', 'ATTESTATION_TRAVAIL'],
      workingHours: {
        monday: { start: '08:00', end: '17:00' },
        tuesday: { start: '08:00', end: '17:00' },
        wednesday: { start: '08:00', end: '17:00' },
        thursday: { start: '08:00', end: '17:00' },
        friday: { start: '08:00', end: '17:00' }
      }
    }
  ];

  for (const org of organizations) {
    await prisma.organization.upsert({
      where: { code: org.code },
      update: {},
      create: org
    });
  }

  console.log('✅ Organisations créées');

  // Récupérer les organisations créées
  const mairieLibreville = await prisma.organization.findUnique({ where: { code: 'MAIRE_LBV' } });
  const dgdi = await prisma.organization.findUnique({ where: { code: 'DGDI' } });
  const cnss = await prisma.organization.findUnique({ where: { code: 'CNSS' } });

  // Créer les utilisateurs de démonstration selon les spécifications exactes
  const users = [
    {
      email: 'superadmin@admin.ga',
      password: await bcrypt.hash('SuperAdmin2024!', 12),
      firstName: 'Jean-Baptiste',
      lastName: 'NGUEMA',
      role: UserRole.SUPER_ADMIN,
      primaryOrganizationId: null,
      isVerified: true,
      isActive: true
    },
    {
      email: 'admin.libreville@admin.ga',
      password: await bcrypt.hash('AdminLib2024!', 12),
      firstName: 'Marie-Claire',
      lastName: 'MBADINGA',
      role: UserRole.ADMIN,
      primaryOrganizationId: mairieLibreville?.id,
      isVerified: true,
      isActive: true
    },
    {
      email: 'manager.cnss@admin.ga',
      password: await bcrypt.hash('Manager2024!', 12),
      firstName: 'Paul',
      lastName: 'MBOUMBA',
      role: UserRole.MANAGER,
      primaryOrganizationId: cnss?.id,
      isVerified: true,
      isActive: true
    },
    {
      email: 'agent.mairie@admin.ga',
      password: await bcrypt.hash('Agent2024!', 12),
      firstName: 'Sophie',
      lastName: 'NZAMBA',
      role: UserRole.AGENT,
      primaryOrganizationId: mairieLibreville?.id,
      isVerified: true,
      isActive: true
    },
    {
      email: 'jean.dupont@gmail.com',
      password: await bcrypt.hash('User2024!', 12),
      firstName: 'Jean',
      lastName: 'DUPONT',
      phone: '+241 07123456',
      role: UserRole.USER,
      primaryOrganizationId: null,
      isVerified: true,
      isActive: true
    },
    // Comptes supplémentaires pour les tests
    {
      email: 'admin.dgdi@admin.ga',
      password: await bcrypt.hash('AdminDGDI2024!', 12),
      firstName: 'Pierre',
      lastName: 'MOUSSAVOU',
      role: UserRole.ADMIN,
      primaryOrganizationId: dgdi?.id,
      isVerified: true,
      isActive: true
    },
    {
      email: 'agent.cnss@admin.ga',
      password: await bcrypt.hash('AgentCNSS2024!', 12),
      firstName: 'André',
      lastName: 'MBOUMBA',
      role: UserRole.AGENT,
      primaryOrganizationId: cnss?.id,
      isVerified: true,
      isActive: true
    },
    {
      email: 'marie.smith@gmail.com',
      password: await bcrypt.hash('User2024!', 12),
      firstName: 'Marie',
      lastName: 'SMITH',
      phone: '+241 06987654',
      role: UserRole.USER,
      primaryOrganizationId: null,
      isVerified: false,
      isActive: true
    }
  ];

  for (const userData of users) {
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: userData
    });

    // Créer un profil pour chaque utilisateur
    await prisma.profile.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        nationality: 'Gabonaise',
        country: 'Gabon'
      }
    });
  }

  console.log('✅ Utilisateurs et profils créés');

  // Créer quelques demandes d'exemple
  const jeanUser = await prisma.user.findUnique({ where: { email: 'jean.dupont@gmail.com' } });
  const agentMairie = await prisma.user.findUnique({ where: { email: 'agent.mairie@admin.ga' } });

  if (jeanUser && agentMairie && mairieLibreville) {
    await prisma.serviceRequest.create({
      data: {
        type: 'ACTE_NAISSANCE',
        status: 'IN_PROGRESS',
        submittedById: jeanUser.id,
        assignedToId: agentMairie.id,
        organizationId: mairieLibreville.id,
        formData: {
          firstName: 'Jean',
          lastName: 'DUPONT',
          dateOfBirth: '1990-05-15',
          placeOfBirth: 'Libreville',
          motherName: 'Marie DUPONT',
          fatherName: 'Pierre DUPONT'
        },
        submittedAt: new Date('2024-01-10'),
        assignedAt: new Date('2024-01-11'),
        estimatedCompletion: new Date('2024-01-20'),
        trackingNumber: 'GA-2024-001'
      }
    });

    // Créer un rendez-vous
    await prisma.appointment.create({
      data: {
        date: new Date('2024-01-15T10:00:00'),
        timeSlot: '10:00-10:30',
        duration: 30,
        status: 'SCHEDULED',
        citizenId: jeanUser.id,
        agentId: agentMairie.id,
        organizationId: mairieLibreville.id,
        serviceType: 'ACTE_NAISSANCE',
        purpose: 'Récupération acte de naissance',
        location: 'Bureau 205, Mairie de Libreville'
      }
    });
  }

  console.log('✅ Demandes et rendez-vous créés');

  console.log('🎉 Seeding terminé avec succès !');
  console.log('\n📋 Comptes de démonstration créés :');
  console.log('🔴 SUPER ADMIN: superadmin@admin.ga / SuperAdmin2024!');
  console.log('🟡 ADMIN: admin.libreville@admin.ga / AdminLib2024!');
  console.log('🟢 AGENT: agent.etatcivil@admin.ga / AgentEC2024!');
  console.log('🔵 USER: jean.dupont@gmail.com / User2024!');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });