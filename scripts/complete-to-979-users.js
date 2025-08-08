const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Noms et prénoms gabonais authentiques
const PRENOMS_MASCULINS = [
  'Alexandre', 'Jean-Baptiste', 'Guy Patrick', 'Hermann', 'Roger', 'François', 'Alain', 'Paul',
  'Bertrand', 'Michel', 'Pierre', 'André', 'Joseph', 'Emmanuel', 'Daniel', 'David', 'Martin',
  'Claude', 'Bernard', 'Philippe', 'Pascal', 'Thierry', 'Christian', 'Olivier', 'Laurent',
  'Stéphane', 'Sébastien', 'Nicolas', 'Vincent', 'Patrick', 'Frédéric', 'Jérôme', 'Didier',
  'Jean-Claude', 'Jean-Marie', 'Jean-Pierre', 'Jean-Paul', 'Marie-Joseph', 'Sylvain', 'Lucien'
];

const PRENOMS_FEMININS = [
  'Marie-Claire', 'Paulette', 'Régine', 'Micheline', 'Sylvie', 'Christine', 'Antoinette', 'Georgette',
  'Marie-Christine', 'Grâce', 'Véronique', 'Claudine', 'Françoise', 'Sylviane', 'Monique', 'Catherine',
  'Brigitte', 'Isabelle', 'Nathalie', 'Sophie', 'Martine', 'Nicole', 'Chantal', 'Dominique',
  'Élisabeth', 'Jacqueline', 'Marie-France', 'Anne-Marie', 'Marie-José', 'Patricia', 'Christiane'
];

const NOMS_FAMILLES_GABONAIS = [
  'NGOUA', 'OBAME', 'MISSAMBO', 'NKOGHE', 'MBOUMBA', 'ESSONO', 'OBIANG NDONG', 'ONDO',
  'MOUNGUENGUI', 'IMMONGAULT', 'BAKOMBA', 'MARIN', 'NDONG', 'KOMBILA', 'MOUNANGA', 'LEYAMA',
  'EKOMO', 'MBA', 'OWONO MEBA', 'NDZANG', 'RUFIN ONDZONDO', 'OYANE', 'MINDZIE', 'NGUEMA',
  'BIYOGHE', 'BOUROUMBA', 'ELLA', 'EYEGHE', 'FANG', 'KOMBILA', 'MABIALA', 'MEZUI',
  'MINKO', 'MOUSSOUNDA', 'NDONG AYONG', 'NGOUA', 'NKOGHE MVEANG', 'NTOUTOUME', 'NZIGOU'
];

const POSTES_ADMIN = [
  'Ministre', 'Ministre Délégué', 'Secrétaire d\'État', 'Directeur Général',
  'Directeur Central', 'Directeur des Affaires Juridiques', 'Directeur des Ressources Humaines',
  'Directeur de la Communication', 'Directeur de la Planification', 'Directeur des Études',
  'Inspecteur Général', 'Conseiller Technique', 'Attaché de Cabinet', 'Chef de Cabinet',
  'Directeur de Cabinet', 'Conseiller Spécial'
];

// Générateur de numéros de téléphone gabonais
function genererTelephone() {
  const prefixes = ['01', '02', '03', '04', '05', '06', '07', '08', '09'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const numero = Math.floor(Math.random() * 90000000 + 10000000).toString();
  return `+241 ${prefix} ${numero.slice(0, 2)} ${numero.slice(2, 4)} ${numero.slice(4, 6)}`;
}

// Générateur d'email professionnel
function genererEmail(prenom, nom, poste, organisationCode) {
  const prenomClean = prenom.toLowerCase().replace(/[^a-z]/g, '');
  const nomClean = nom.toLowerCase().replace(/[^a-z]/g, '');
  const posteCode = poste.toLowerCase()
    .replace(/ministre/g, 'ministre')
    .replace(/directeur/g, 'dir')
    .replace(/chef/g, 'chef')
    .replace(/secrétaire/g, 'sg')
    .replace(/[^a-z]/g, '.');

  const options = [
    `${prenomClean}.${nomClean}@${organisationCode.toLowerCase()}.gouv.ga`,
    `${posteCode}@${organisationCode.toLowerCase()}.gouv.ga`,
    `${prenomClean}${nomClean.charAt(0)}@${organisationCode.toLowerCase()}.gouv.ga`
  ];

  return options[Math.floor(Math.random() * options.length)];
}

async function completeUsers() {
  console.log('🚀 Complétion pour atteindre 979 utilisateurs...\n');

  try {
    // Vérifier l'état actuel
    const currentCount = await prisma.user.count();
    console.log(`📊 Utilisateurs actuels : ${currentCount}`);

    const missingCount = 979 - currentCount;
    console.log(`➕ Utilisateurs manquants : ${missingCount}\n`);

    if (missingCount <= 0) {
      console.log('✅ Objectif déjà atteint !');
      return;
    }

    // Récupérer les organisations
    const organizations = await prisma.organization.findMany();
    console.log(`📋 ${organizations.length} organisations disponibles`);

    // Répartir les utilisateurs manquants
    const adminCount = Math.min(missingCount, 71); // ADMIN prioritaires
    const restCount = missingCount - adminCount;

    const usersToCreate = [];

    // 1. ADMINS (71 pour compléter)
    console.log(`👑 Création de ${adminCount} Administrateurs...`);

    for (let i = 0; i < adminCount; i++) {
      const org = organizations[Math.floor(Math.random() * organizations.length)];
      const isEven = Math.random() > 0.3; // 70% d'hommes pour les hauts postes
      const prenom = isEven ?
        PRENOMS_MASCULINS[Math.floor(Math.random() * PRENOMS_MASCULINS.length)] :
        PRENOMS_FEMININS[Math.floor(Math.random() * PRENOMS_FEMININS.length)];
      const nom = NOMS_FAMILLES_GABONAIS[Math.floor(Math.random() * NOMS_FAMILLES_GABONAIS.length)];
      const poste = POSTES_ADMIN[Math.floor(Math.random() * POSTES_ADMIN.length)];

      usersToCreate.push({
        email: genererEmail(prenom, nom, poste, org.code),
        phone: genererTelephone(),
        firstName: prenom,
        lastName: nom,
        role: 'ADMIN',
        isActive: Math.random() > 0.05, // 95% actifs
        isVerified: Math.random() > 0.1, // 90% vérifiés
        jobTitle: poste,
        primaryOrganizationId: org.id
      });
    }

    // 2. Compléter le reste avec des citoyens si nécessaire
    if (restCount > 0) {
      console.log(`🏠 Création de ${restCount} Citoyens complémentaires...`);

      const PROFESSIONS_CITOYENS = [
        'Ingénieur', 'Enseignant', 'Médecin', 'Avocat', 'Comptable', 'Commerçant', 'Entrepreneur',
        'Informaticien', 'Architecte', 'Journaliste', 'Pharmacien', 'Vétérinaire', 'Dentiste',
        'Infirmier', 'Sage-femme', 'Technicien', 'Mécanicien', 'Électricien', 'Plombier',
        'Menuisier', 'Maçon', 'Chauffeur', 'Cuisinier', 'Coiffeur', 'Couturier', 'Photographe'
      ];

      for (let i = 0; i < restCount; i++) {
        const isEven = Math.random() > 0.52; // 48% de femmes, 52% d'hommes
        const prenom = isEven ?
          PRENOMS_MASCULINS[Math.floor(Math.random() * PRENOMS_MASCULINS.length)] :
          PRENOMS_FEMININS[Math.floor(Math.random() * PRENOMS_FEMININS.length)];
        const nom = NOMS_FAMILLES_GABONAIS[Math.floor(Math.random() * NOMS_FAMILLES_GABONAIS.length)];
        const profession = PROFESSIONS_CITOYENS[Math.floor(Math.random() * PROFESSIONS_CITOYENS.length)];

        const prenomClean = prenom.toLowerCase().replace(/[^a-z]/g, '');
        const nomClean = nom.toLowerCase().replace(/[^a-z]/g, '');
        const providers = ['gmail.com', 'yahoo.fr', 'hotmail.com', 'outlook.com'];
        const provider = providers[Math.floor(Math.random() * providers.length)];
        const email = `${prenomClean}.${nomClean}${Math.floor(Math.random() * 999)}@${provider}`;

        usersToCreate.push({
          email: email,
          phone: genererTelephone(),
          firstName: prenom,
          lastName: nom,
          role: 'USER',
          isActive: Math.random() > 0.2, // 80% actifs
          isVerified: Math.random() > 0.3, // 70% vérifiés
          jobTitle: profession,
          primaryOrganizationId: null
        });
      }
    }

    console.log(`\n📊 Total utilisateurs à créer: ${usersToCreate.length}`);
    console.log('💾 Insertion en base de données...\n');

    // Insertion par lots
    const batchSize = 50;
    let createdCount = 0;

    for (let i = 0; i < usersToCreate.length; i += batchSize) {
      const batch = usersToCreate.slice(i, i + batchSize);

      try {
        await prisma.user.createMany({
          data: batch,
          skipDuplicates: true
        });
        createdCount += batch.length;
        console.log(`✅ Lot ${Math.floor(i / batchSize) + 1}: ${batch.length} utilisateurs créés (Total: ${createdCount})`);
      } catch (batchError) {
        console.log(`⚠️ Erreur sur le lot ${Math.floor(i / batchSize) + 1}: ${batchError.message}`);

        // Essayer individuellement
        for (const userData of batch) {
          try {
            await prisma.user.create({ data: userData });
            createdCount++;
          } catch (individualError) {
            console.log(`❌ Erreur utilisateur ${userData.firstName} ${userData.lastName}: ${individualError.message}`);
          }
        }
      }
    }

    // Statistiques finales
    const finalCount = await prisma.user.count();
    const stats = await prisma.user.groupBy({
      by: ['role'],
      _count: { role: true }
    });

    console.log('\n🎉 COMPLÉTION RÉUSSIE !');
    console.log('======================');
    console.log(`👥 Total utilisateurs final: ${finalCount}`);
    console.log(`➕ Utilisateurs ajoutés: ${createdCount}`);
    console.log(`🎯 Objectif 979: ${finalCount >= 979 ? '✅ ATTEINT' : `❌ Manque ${979 - finalCount}`}`);

    console.log('\n📊 Répartition finale par rôle:');
    stats.forEach(stat => {
      console.log(`   ${stat.role}: ${stat._count.role} utilisateurs`);
    });

    console.log('\n🇬🇦 L\'administration gabonaise a maintenant un système complet !');

  } catch (error) {
    console.error('❌ Erreur lors de la complétion:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

completeUsers();
