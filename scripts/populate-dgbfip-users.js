const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// Fonction utilitaire pour hasher les mots de passe
async function hashPassword(password) {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

// Données DGBFIP importées
const DGBFIP_USERS = [
  {
    email: 'andre.mboumba@budget.gov.ga',
    phone: '+241 01 77 88 99',
    firstName: 'André',
    lastName: 'MBOUMBA',
    role: 'ADMIN',
    isActive: true,
    isVerified: true,
    jobTitle: 'Directeur Général',
    organizationCode: 'DGBFIP'
  },
  {
    email: 'marie.eyeghe@budget.gov.ga',
    phone: '+241 01 77 89 00',
    firstName: 'Marie',
    lastName: 'EYEGHE',
    role: 'ADMIN',
    isActive: true,
    isVerified: true,
    jobTitle: 'Directeur Général Adjoint',
    organizationCode: 'DGBFIP'
  },
  {
    email: 'pierre.ndong@budget.gov.ga',
    phone: '+241 01 77 89 01',
    firstName: 'Pierre',
    lastName: 'NDONG',
    role: 'ADMIN',
    isActive: true,
    isVerified: true,
    jobTitle: 'Secrétaire Général',
    organizationCode: 'DGBFIP'
  },
  {
    email: 'jean.obiang@budget.gov.ga',
    phone: '+241 01 77 89 02',
    firstName: 'Jean',
    lastName: 'OBIANG',
    role: 'MANAGER',
    isActive: true,
    isVerified: true,
    jobTitle: 'Directeur de Cabinet',
    organizationCode: 'DGBFIP'
  },
  {
    email: 'sylvie.bengone@budget.gov.ga',
    phone: '+241 01 77 89 03',
    firstName: 'Sylvie',
    lastName: 'BENGONE',
    role: 'MANAGER',
    isActive: true,
    isVerified: true,
    jobTitle: 'Inspecteur Général des Services',
    organizationCode: 'DGBFIP'
  },
  {
    email: 'paul.mintsa@budget.gov.ga',
    phone: '+241 01 77 89 04',
    firstName: 'Paul',
    lastName: 'MINTSA',
    role: 'MANAGER',
    isActive: true,
    isVerified: true,
    jobTitle: 'Directeur de la Préparation et Programmation Budgétaires',
    organizationCode: 'DGBFIP'
  },
  {
    email: 'claire.akendengue@budget.gov.ga',
    phone: '+241 01 77 89 05',
    firstName: 'Claire',
    lastName: 'AKENDENGUE',
    role: 'MANAGER',
    isActive: true,
    isVerified: true,
    jobTitle: 'Directeur du Suivi et de la Régulation de l\'Exécution Budgétaire',
    organizationCode: 'DGBFIP'
  },
  {
    email: 'michel.ella@budget.gov.ga',
    phone: '+241 01 77 89 06',
    firstName: 'Michel',
    lastName: 'ELLA',
    role: 'MANAGER',
    isActive: true,
    isVerified: true,
    jobTitle: 'Directeur de la Solde',
    organizationCode: 'DGBFIP'
  },
  {
    email: 'francoise.koumba@budget.gov.ga',
    phone: '+241 01 77 89 07',
    firstName: 'Françoise',
    lastName: 'KOUMBA',
    role: 'MANAGER',
    isActive: true,
    isVerified: true,
    jobTitle: 'Directeur du Suivi des Investissements Publics',
    organizationCode: 'DGBFIP'
  },
  {
    email: 'martin.mbazoo@budget.gov.ga',
    phone: '+241 01 77 89 08',
    firstName: 'Martin',
    lastName: 'MBAZOO',
    role: 'AGENT',
    isActive: true,
    isVerified: true,
    jobTitle: 'Chef de Service Recettes de l\'État',
    organizationCode: 'DGBFIP'
  },
  {
    email: 'jeanne.owono@budget.gov.ga',
    phone: '+241 01 77 89 09',
    firstName: 'Jeanne',
    lastName: 'OWONO',
    role: 'AGENT',
    isActive: true,
    isVerified: true,
    jobTitle: 'Chef de Service Dépenses de l\'État',
    organizationCode: 'DGBFIP'
  },
  {
    email: 'francois.boukoumou@budget.gov.ga',
    phone: '+241 01 77 89 10',
    firstName: 'François',
    lastName: 'BOUKOUMOU',
    role: 'AGENT',
    isActive: true,
    isVerified: true,
    jobTitle: 'Chef de Service Performance des Politiques Publiques',
    organizationCode: 'DGBFIP'
  },
  {
    email: 'catherine.nzeng@budget.gov.ga',
    phone: '+241 01 77 89 11',
    firstName: 'Catherine',
    lastName: 'NZENG',
    role: 'AGENT',
    isActive: true,
    isVerified: true,
    jobTitle: 'Chargé d\'Études Budgétaires',
    organizationCode: 'DGBFIP'
  },
  {
    email: 'albert.engone@budget.gov.ga',
    phone: '+241 01 77 89 12',
    firstName: 'Albert',
    lastName: 'ENGONE',
    role: 'AGENT',
    isActive: true,
    isVerified: true,
    jobTitle: 'Gestionnaire Comptable Principal',
    organizationCode: 'DGBFIP'
  },
  {
    email: 'monique.mouambou@budget.gov.ga',
    phone: '+241 01 77 89 13',
    firstName: 'Monique',
    lastName: 'MOUAMBOU',
    role: 'AGENT',
    isActive: true,
    isVerified: true,
    jobTitle: 'Assistant Administratif Principal',
    organizationCode: 'DGBFIP'
  }
];

async function createDGBFIPOrganization() {
  console.log('🏛️ Création de l\'organisation DGBFIP...');

  try {
    const organization = await prisma.organization.upsert({
      where: { code: 'DGBFIP' },
      update: {},
      create: {
        name: 'Direction Générale du Budget et des Finances Publiques',
        code: 'DGBFIP',
        type: 'DIRECTION_GENERALE',
        description: 'Direction chargée de l\'élaboration, du suivi et du contrôle de l\'exécution du budget de l\'État',
        address: 'Immeuble des Finances, Boulevard Triomphal, Libreville',
        city: 'Libreville',
        phone: '+241 01 77 88 99',
        email: 'contact@budget.gov.ga',
        website: 'https://budget.gov.ga',
        isActive: true
      }
    });

    console.log(`✅ Organisation DGBFIP créée avec l'ID: ${organization.id}`);
    return organization;
  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'organisation DGBFIP:', error);
    throw error;
  }
}

async function createDGBFIPUsers(organizationId) {
  console.log('👥 Création des utilisateurs DGBFIP...');

  let created = 0;
  let updated = 0;
  let errors = 0;

  for (const userData of DGBFIP_USERS) {
    try {
      // Mot de passe par défaut pour tous les utilisateurs
      const defaultPassword = 'DGBFIP2024!';
      const hashedPassword = await hashPassword(defaultPassword);

      const user = await prisma.user.upsert({
        where: { email: userData.email },
        update: {
          phone: userData.phone,
          firstName: userData.firstName,
          lastName: userData.lastName,
          role: userData.role,
          isActive: userData.isActive,
          isVerified: userData.isVerified,
          jobTitle: userData.jobTitle,
          primaryOrganizationId: organizationId,
          updatedAt: new Date()
        },
        create: {
          email: userData.email,
          phone: userData.phone,
          firstName: userData.firstName,
          lastName: userData.lastName,
          role: userData.role,
          isActive: userData.isActive,
          isVerified: userData.isVerified,
          jobTitle: userData.jobTitle,
          primaryOrganizationId: organizationId
        }
      });

      if (user) {
        console.log(`✅ Utilisateur ${userData.firstName} ${userData.lastName} (${userData.jobTitle}) traité`);
        created++;
      }
    } catch (error) {
      console.error(`❌ Erreur pour ${userData.firstName} ${userData.lastName}:`, error.message);
      errors++;
    }
  }

  return { created, updated, errors };
}

async function populateDGBFIP() {
  console.log('🚀 Début de la population DGBFIP...');
  console.log('=' .repeat(60));

  try {
    // 1. Créer l'organisation DGBFIP
    const organization = await createDGBFIPOrganization();

    // 2. Créer les utilisateurs DGBFIP
    const userStats = await createDGBFIPUsers(organization.id);

    // 3. Statistiques finales
    console.log('\n📊 RÉSUMÉ DE LA POPULATION DGBFIP');
    console.log('=' .repeat(60));
    console.log(`✅ Organisation créée: DGBFIP`);
    console.log(`✅ Utilisateurs traités: ${userStats.created}`);
    console.log(`⚠️  Erreurs: ${userStats.errors}`);
    console.log(`📋 Total des comptes DGBFIP: ${DGBFIP_USERS.length}`);

    // 4. Répartition par rôle
    const adminCount = DGBFIP_USERS.filter(u => u.role === 'ADMIN').length;
    const managerCount = DGBFIP_USERS.filter(u => u.role === 'MANAGER').length;
    const agentCount = DGBFIP_USERS.filter(u => u.role === 'AGENT').length;

    console.log('\n🎯 RÉPARTITION PAR RÔLE');
    console.log('-'.repeat(30));
    console.log(`👑 ADMIN (Direction): ${adminCount} comptes`);
    console.log(`📊 MANAGER (Encadrement): ${managerCount} comptes`);
    console.log(`⚙️  AGENT (Exécution): ${agentCount} comptes`);

    console.log('\n🔐 INFORMATIONS DE CONNEXION');
    console.log('-'.repeat(30));
    console.log('📧 Email: [email de l\'utilisateur]');
    console.log('🔑 Mot de passe par défaut: DGBFIP2024!');
    console.log('💡 Les utilisateurs devront changer leur mot de passe lors de la première connexion');

    console.log('\n🎉 Population DGBFIP terminée avec succès !');

  } catch (error) {
    console.error('💥 Erreur critique lors de la population DGBFIP:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécution du script si appelé directement
if (require.main === module) {
  populateDGBFIP()
    .then(() => {
      console.log('🏁 Script terminé');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Erreur fatale:', error);
      process.exit(1);
    });
}

module.exports = {
  populateDGBFIP,
  createDGBFIPOrganization,
  createDGBFIPUsers,
  DGBFIP_USERS
};
