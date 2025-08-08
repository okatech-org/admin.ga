const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Données utilisateurs réalistes pour l'administration gabonaise
const USERS_DATA = [
  // Super Administrateurs
  {
    email: 'superadmin@administration.ga',
    phone: '+241 01 44 30 00',
    firstName: 'Alexandre',
    lastName: 'NGOUA',
    role: 'SUPER_ADMIN',
    isActive: true,
    isVerified: true,
    jobTitle: 'Super Administrateur Système',
    organizationCode: 'admin-ga'
  },
  {
    email: 'tech.lead@administration.ga',
    phone: '+241 01 44 30 01',
    firstName: 'Marie-Claire',
    lastName: 'OBAME',
    role: 'SUPER_ADMIN',
    isActive: true,
    isVerified: true,
    jobTitle: 'Lead Technique',
    organizationCode: 'admin-ga'
  },

  // Ministère de la Justice
  {
    email: 'ministre@justice.gouv.ga',
    phone: '+241 01 44 20 03',
    firstName: 'Paulette',
    lastName: 'MISSAMBO',
    role: 'ADMIN',
    isActive: true,
    isVerified: true,
    jobTitle: 'Ministre de la Justice',
    organizationCode: 'MIN_JUSTICE'
  },
  {
    email: 'sg@justice.gouv.ga',
    phone: '+241 01 44 20 04',
    firstName: 'Jean-Baptiste',
    lastName: 'NKOGHE',
    role: 'MANAGER',
    isActive: true,
    isVerified: true,
    jobTitle: 'Secrétaire Général',
    organizationCode: 'MIN_JUSTICE'
  },
  {
    email: 'chef.cabinet@justice.gouv.ga',
    phone: '+241 01 44 20 05',
    firstName: 'Régine',
    lastName: 'MBOUMBA',
    role: 'MANAGER',
    isActive: true,
    isVerified: true,
    jobTitle: 'Chef de Cabinet',
    organizationCode: 'MIN_JUSTICE'
  },
  {
    email: 'directeur.affaires.juridiques@justice.gouv.ga',
    phone: '+241 01 44 20 06',
    firstName: 'Alain',
    lastName: 'ESSONO',
    role: 'AGENT',
    isActive: true,
    isVerified: true,
    jobTitle: 'Directeur des Affaires Juridiques',
    organizationCode: 'MIN_JUSTICE'
  },

  // Ministère de la Santé
  {
    email: 'ministre@sante.gouv.ga',
    phone: '+241 01 44 20 02',
    firstName: 'Guy Patrick',
    lastName: 'OBIANG NDONG',
    role: 'ADMIN',
    isActive: true,
    isVerified: true,
    jobTitle: 'Ministre de la Santé',
    organizationCode: 'MIN_SANTE'
  },
  {
    email: 'sg@sante.gouv.ga',
    phone: '+241 01 44 20 07',
    firstName: 'Micheline',
    lastName: 'ONDO',
    role: 'MANAGER',
    isActive: true,
    isVerified: true,
    jobTitle: 'Secrétaire Générale',
    organizationCode: 'MIN_SANTE'
  },
  {
    email: 'directeur.sante.publique@sante.gouv.ga',
    phone: '+241 01 44 20 08',
    firstName: 'Dr. Roland',
    lastName: 'MOUNGUENGUI',
    role: 'AGENT',
    isActive: true,
    isVerified: true,
    jobTitle: 'Directeur de la Santé Publique',
    organizationCode: 'MIN_SANTE'
  },

  // Ministère de l'Intérieur
  {
    email: 'ministre@interieur.gouv.ga',
    phone: '+241 01 44 20 01',
    firstName: 'Hermann',
    lastName: 'IMMONGAULT',
    role: 'ADMIN',
    isActive: true,
    isVerified: true,
    jobTitle: 'Ministre de l\'Intérieur',
    organizationCode: 'MIN_INTERIEUR'
  },
  {
    email: 'sg@interieur.gouv.ga',
    phone: '+241 01 44 20 09',
    firstName: 'Sylvie',
    lastName: 'BAKOMBA',
    role: 'MANAGER',
    isActive: true,
    isVerified: true,
    jobTitle: 'Secrétaire Générale',
    organizationCode: 'MIN_INTERIEUR'
  },

  // Mairie de Libreville
  {
    email: 'maire@mairie-libreville.ga',
    phone: '+241 01 44 10 01',
    firstName: 'Christine',
    lastName: 'MARIN',
    role: 'ADMIN',
    isActive: true,
    isVerified: true,
    jobTitle: 'Maire de Libreville',
    organizationCode: 'MAIRIE_LIBREVILLE'
  },
  {
    email: 'dgs@mairie-libreville.ga',
    phone: '+241 01 44 10 02',
    firstName: 'François',
    lastName: 'NDONG',
    role: 'MANAGER',
    isActive: true,
    isVerified: true,
    jobTitle: 'Directeur Général des Services',
    organizationCode: 'MAIRIE_LIBREVILLE'
  },
  {
    email: 'etat.civil@mairie-libreville.ga',
    phone: '+241 01 44 10 03',
    firstName: 'Georgette',
    lastName: 'KOMBILA',
    role: 'AGENT',
    isActive: true,
    isVerified: true,
    jobTitle: 'Chef du Service État Civil',
    organizationCode: 'MAIRIE_LIBREVILLE'
  },

  // Citoyens utilisateurs
  {
    email: 'jean.pierre@gmail.com',
    phone: '+241 06 12 34 56',
    firstName: 'Jean-Pierre',
    lastName: 'MOUNANGA',
    role: 'USER',
    isActive: true,
    isVerified: true,
    jobTitle: 'Ingénieur',
    organizationCode: null
  },
  {
    email: 'marie.christine@yahoo.fr',
    phone: '+241 07 23 45 67',
    firstName: 'Marie-Christine',
    lastName: 'LEYAMA',
    role: 'USER',
    isActive: true,
    isVerified: true,
    jobTitle: 'Enseignante',
    organizationCode: null
  },
  {
    email: 'paul.ekomo@hotmail.com',
    phone: '+241 05 34 56 78',
    firstName: 'Paul',
    lastName: 'EKOMO',
    role: 'USER',
    isActive: true,
    isVerified: false,
    jobTitle: 'Commerçant',
    organizationCode: null
  },
  {
    email: 'grace.ndong@gmail.com',
    phone: '+241 06 45 67 89',
    firstName: 'Grâce',
    lastName: 'NDONG',
    role: 'USER',
    isActive: false,
    isVerified: true,
    jobTitle: 'Étudiante',
    organizationCode: null
  },
  {
    email: 'bertrand.mba@yahoo.com',
    phone: '+241 07 56 78 90',
    firstName: 'Bertrand',
    lastName: 'MBA',
    role: 'USER',
    isActive: true,
    isVerified: true,
    jobTitle: 'Informaticien',
    organizationCode: null
  }
];

async function main() {
  console.log('🚀 Démarrage du peuplement de la base de données avec des utilisateurs...');

  try {
    // Supprimer tous les utilisateurs existants
    console.log('🗑️ Suppression des utilisateurs existants...');
    await prisma.user.deleteMany();

    // Récupérer les organisations existantes pour faire le mapping
    console.log('📋 Récupération des organisations...');
    const organizations = await prisma.organization.findMany();
    console.log(`✅ ${organizations.length} organisations trouvées`);

    const orgMap = {};
    organizations.forEach(org => {
      orgMap[org.code] = org.id;
    });

    // Créer les utilisateurs
    console.log('👥 Création des utilisateurs...');

    let createdCount = 0;
    let skippedCount = 0;

    for (const userData of USERS_DATA) {
      try {
        // Trouver l'ID de l'organisation
        let primaryOrganizationId = null;
        if (userData.organizationCode && orgMap[userData.organizationCode]) {
          primaryOrganizationId = orgMap[userData.organizationCode];
        }

        const user = await prisma.user.create({
          data: {
            email: userData.email,
            phone: userData.phone,
            firstName: userData.firstName,
            lastName: userData.lastName,
            role: userData.role,
            isActive: userData.isActive,
            isVerified: userData.isVerified,
            jobTitle: userData.jobTitle,
            primaryOrganizationId,
            lastLoginAt: new Date()
          }
        });

        console.log(`✅ Utilisateur créé: ${user.firstName} ${user.lastName} (${user.email})`);
        createdCount++;

      } catch (userError) {
        console.log(`⚠️ Erreur lors de la création de ${userData.firstName} ${userData.lastName}: ${userError.message}`);
        skippedCount++;
      }
    }

    console.log('\n📊 Résumé du peuplement:');
    console.log(`✅ ${createdCount} utilisateurs créés`);
    console.log(`⚠️ ${skippedCount} utilisateurs ignorés`);

    // Statistiques finales
    const totalUsers = await prisma.user.count();
    const activeUsers = await prisma.user.count({ where: { isActive: true } });
    const verifiedUsers = await prisma.user.count({ where: { isVerified: true } });
    const superAdmins = await prisma.user.count({ where: { role: 'SUPER_ADMIN' } });
    const admins = await prisma.user.count({ where: { role: 'ADMIN' } });
    const managers = await prisma.user.count({ where: { role: 'MANAGER' } });
    const agents = await prisma.user.count({ where: { role: 'AGENT' } });
    const citizens = await prisma.user.count({ where: { role: 'USER' } });

    console.log('\n📈 Statistiques de la base de données:');
    console.log(`👥 Total utilisateurs: ${totalUsers}`);
    console.log(`✅ Utilisateurs actifs: ${activeUsers}`);
    console.log(`☑️ Utilisateurs vérifiés: ${verifiedUsers}`);
    console.log(`👑 Super Admins: ${superAdmins}`);
    console.log(`🛡️ Admins: ${admins}`);
    console.log(`💼 Managers: ${managers}`);
    console.log(`⚙️ Agents: ${agents}`);
    console.log(`🏠 Citoyens: ${citizens}`);

    console.log('\n🎉 Peuplement terminé avec succès !');

  } catch (error) {
    console.error('❌ Erreur lors du peuplement:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
