const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Noms et prénoms gabonais authentiques
const PRENOMS_MASCULINS = [
  'Alexandre', 'Jean-Baptiste', 'Guy Patrick', 'Hermann', 'Roger', 'François', 'Alain', 'Paul',
  'Bertrand', 'Michel', 'Pierre', 'André', 'Joseph', 'Emmanuel', 'Daniel', 'David', 'Martin',
  'Claude', 'Bernard', 'Philippe', 'Pascal', 'Thierry', 'Christian', 'Olivier', 'Laurent',
  'Stéphane', 'Sébastien', 'Nicolas', 'Vincent', 'Patrick', 'Frédéric', 'Jérôme', 'Didier',
  'Jean-Claude', 'Jean-Marie', 'Jean-Pierre', 'Jean-Paul', 'Marie-Joseph', 'Sylvain', 'Lucien',
  'Albert', 'Émile', 'Henri', 'Louis', 'Maurice', 'Raymond', 'Robert', 'André-Marie', 'Gaston',
  'Dieudonné', 'Pacôme', 'Serge', 'Yves', 'Marcel', 'Georges', 'René', 'Fernand', 'Augustin',
  'Stanislas', 'Hilaire', 'Édouard', 'Antoine', 'Léon', 'Jules', 'Victor', 'Armand', 'Gabriel'
];

const PRENOMS_FEMININS = [
  'Marie-Claire', 'Paulette', 'Régine', 'Micheline', 'Sylvie', 'Christine', 'Antoinette', 'Georgette',
  'Marie-Christine', 'Grâce', 'Véronique', 'Claudine', 'Françoise', 'Sylviane', 'Monique', 'Catherine',
  'Brigitte', 'Isabelle', 'Nathalie', 'Sophie', 'Martine', 'Nicole', 'Chantal', 'Dominique',
  'Élisabeth', 'Jacqueline', 'Marie-France', 'Anne-Marie', 'Marie-José', 'Patricia', 'Christiane',
  'Danielle', 'Josette', 'Colette', 'Denise', 'Simone', 'Thérèse', 'Jeanne', 'Marguerite',
  'Bernadette', 'Odette', 'Yvette', 'Ginette', 'Solange', 'Fernande', 'Germaine', 'Lucienne',
  'Pierrette', 'Andrée', 'Renée', 'Henriette', 'Marcelle', 'Angèle', 'Cécile', 'Claire',
  'Hélène', 'Irène', 'Juliette', 'Madeleine', 'Mathilde', 'Pascale', 'Roseline', 'Sabine'
];

const NOMS_FAMILLES_GABONAIS = [
  'NGOUA', 'OBAME', 'MISSAMBO', 'NKOGHE', 'MBOUMBA', 'ESSONO', 'OBIANG NDONG', 'ONDO',
  'MOUNGUENGUI', 'IMMONGAULT', 'BAKOMBA', 'MARIN', 'NDONG', 'KOMBILA', 'MOUNANGA', 'LEYAMA',
  'EKOMO', 'MBA', 'OWONO MEBA', 'NDZANG', 'RUFIN ONDZONDO', 'OYANE', 'MINDZIE', 'NGUEMA',
  'BIYOGHE', 'BOUROUMBA', 'ELLA', 'EYEGHE', 'FANG', 'KOMBILA', 'MABIALA', 'MEZUI',
  'MINKO', 'MOUSSOUNDA', 'NDONG AYONG', 'NGOUA', 'NKOGHE MVEANG', 'NTOUTOUME', 'NZIGOU',
  'OBIANG', 'ONDO METHOGO', 'OVONO', 'ROPIVIA', 'TCHIBINDA', 'YEMBI', 'ZANG NGUEMA',
  'AKENDENGUE', 'ANGONE', 'ANGOUE', 'BEKALE', 'BERRE', 'BIGNOUMBA', 'BITEGHE', 'BOUKA',
  'BOUNDONO', 'CHABRAT', 'CHATELET', 'DAMAS', 'DJEMBO', 'DOUCKAGA', 'EBANG', 'EDA',
  'EMANE', 'ETOUGHE', 'EYENE', 'FANDJA', 'GANONGO', 'GNAMA', 'IGNOUMBA', 'KOUMBA',
  'LEBIGRE', 'MACOSSO', 'MAGANGA', 'MALONGA', 'MAMFOUMBI', 'MANE', 'MANFOUMBI', 'MAVOUROULOU',
  'MBADINGA', 'MBOUROU', 'MEBIAME', 'MENDAME', 'METOGO', 'MEYEGUE', 'MILAMA', 'MINKUE',
  'MOUBAMBA', 'MOUENDOU', 'MOUGANGA', 'MOUISSI', 'MOULOMBI', 'MOUSSIROU', 'MOUVAGHA', 'MOUZEO',
  'MVOUO', 'NANG', 'NCHARE', 'NDEMBI', 'NDJAVE', 'NDONG MEFANE', 'NKENE', 'NKOMBE',
  'NKOUKOU', 'NSAMBI', 'NTOUTOUME NKOGHE', 'OBONO', 'OGANDAGA', 'OGOULIGUENDE', 'OKOME',
  'OMBANDA', 'ONDOUA', 'OPOUNGOU', 'OSSALA', 'OTABELA', 'OVANG', 'OYEGUE', 'PACCA',
  'PEMBA', 'SIMA', 'TCHUISSEU', 'TSOUNGUI', 'VIGOUROUX', 'WANDJI', 'YEMBI YAN', 'ZOMO'
];

// Postes par type d'organisation
const POSTES_PAR_TYPE = {
  'MINISTERE': {
    'ADMIN': ['Ministre', 'Ministre Délégué', 'Secrétaire d\'État'],
    'MANAGER': ['Secrétaire Général', 'Chef de Cabinet', 'Directeur de Cabinet', 'Conseiller Spécial'],
    'AGENT': [
      'Directeur Général', 'Directeur Central', 'Directeur des Affaires Juridiques',
      'Directeur des Ressources Humaines', 'Directeur de la Communication',
      'Directeur de la Planification', 'Directeur des Études', 'Chef de Service',
      'Inspecteur Général', 'Conseiller Technique', 'Attaché de Cabinet'
    ]
  },
  'DIRECTION_GENERALE': {
    'ADMIN': ['Directeur Général'],
    'MANAGER': ['Directeur Général Adjoint', 'Secrétaire Général'],
    'AGENT': [
      'Directeur Central', 'Directeur Régional', 'Chef de Département',
      'Chef de Division', 'Chef de Service', 'Inspecteur Principal',
      'Contrôleur Principal', 'Analyste Principal'
    ]
  },
  'PREFECTURE': {
    'ADMIN': ['Préfet'],
    'MANAGER': ['Sous-Préfet', 'Secrétaire Général'],
    'AGENT': [
      'Chef de Division Administrative', 'Chef de Service de l\'État Civil',
      'Chef de Service de l\'Urbanisme', 'Responsable Sécurité',
      'Inspecteur Préfectoral', 'Attaché Préfectoral'
    ]
  },
  'MAIRIE': {
    'ADMIN': ['Maire'],
    'MANAGER': ['Maire Adjoint', 'Directeur Général des Services', 'Secrétaire Général'],
    'AGENT': [
      'Chef de Service État Civil', 'Chef de Service Urbanisme',
      'Chef de Service Financier', 'Chef de Service Technique',
      'Responsable Communication', 'Responsable Marchés Publics',
      'Agent d\'État Civil', 'Technicien Municipal'
    ]
  },
  'ORGANISME_SOCIAL': {
    'ADMIN': ['Directeur Général', 'Président Directeur Général'],
    'MANAGER': ['Directeur Général Adjoint', 'Directeur des Opérations'],
    'AGENT': [
      'Chef de Département', 'Responsable Ressources Humaines',
      'Responsable Finances', 'Responsable Informatique',
      'Gestionnaire Principal', 'Analyste', 'Contrôleur'
    ]
  },
  'ETABLISSEMENT_PUBLIC': {
    'ADMIN': ['Directeur Général', 'Directeur'],
    'MANAGER': ['Directeur Adjoint', 'Chef de Département'],
    'AGENT': [
      'Chef de Service', 'Responsable Technique', 'Responsable Administratif',
      'Gestionnaire', 'Technicien Spécialisé', 'Analyste'
    ]
  }
};

// Domaines email par type d'organisation
const DOMAINES_EMAIL = {
  'MINISTERE': 'gouv.ga',
  'DIRECTION_GENERALE': 'ga',
  'PREFECTURE': 'ga',
  'MAIRIE': 'ga',
  'ORGANISME_SOCIAL': 'ga',
  'ETABLISSEMENT_PUBLIC': 'ga',
  'AUTRE': 'ga'
};

// Générateur de numéros de téléphone gabonais
function genererTelephone() {
  const prefixes = ['01', '02', '03', '04', '05', '06', '07', '08', '09'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const numero = Math.floor(Math.random() * 90000000 + 10000000).toString();
  return `+241 ${prefix} ${numero.slice(0, 2)} ${numero.slice(2, 4)} ${numero.slice(4, 6)}`;
}

// Générateur d'email professionnel
function genererEmail(prenom, nom, poste, organisationCode, domaine) {
  const prenomClean = prenom.toLowerCase().replace(/[^a-z]/g, '');
  const nomClean = nom.toLowerCase().replace(/[^a-z]/g, '');
  const posteCode = poste.toLowerCase()
    .replace(/ministre/g, 'ministre')
    .replace(/directeur/g, 'dir')
    .replace(/chef/g, 'chef')
    .replace(/secrétaire/g, 'sg')
    .replace(/responsable/g, 'resp')
    .replace(/général/g, 'gen')
    .replace(/adjoint/g, 'adj')
    .replace(/principal/g, 'princ')
    .replace(/[^a-z]/g, '.');

  const options = [
    `${prenomClean}.${nomClean}@${organisationCode.toLowerCase()}.${domaine}`,
    `${posteCode}@${organisationCode.toLowerCase()}.${domaine}`,
    `${prenomClean}${nomClean.charAt(0)}@${organisationCode.toLowerCase()}.${domaine}`,
    `${prenomClean.charAt(0)}${nomClean}@${organisationCode.toLowerCase()}.${domaine}`
  ];

  return options[Math.floor(Math.random() * options.length)];
}

// Générateur d'email citoyen
function genererEmailCitoyen(prenom, nom) {
  const prenomClean = prenom.toLowerCase().replace(/[^a-z]/g, '');
  const nomClean = nom.toLowerCase().replace(/[^a-z]/g, '');
  const providers = ['gmail.com', 'yahoo.fr', 'hotmail.com', 'outlook.com', 'live.com'];
  const provider = providers[Math.floor(Math.random() * providers.length)];

  const options = [
    `${prenomClean}.${nomClean}@${provider}`,
    `${prenomClean}${nomClean}@${provider}`,
    `${prenomClean}${Math.floor(Math.random() * 999)}@${provider}`,
    `${nomClean}${prenomClean}@${provider}`
  ];

  return options[Math.floor(Math.random() * options.length)];
}

// Générateur de professions pour citoyens
const PROFESSIONS_CITOYENS = [
  'Ingénieur', 'Enseignant', 'Médecin', 'Avocat', 'Comptable', 'Commerçant', 'Entrepreneur',
  'Informaticien', 'Architecte', 'Journaliste', 'Pharmacien', 'Vétérinaire', 'Dentiste',
  'Infirmier', 'Sage-femme', 'Technicien', 'Mécanicien', 'Électricien', 'Plombier',
  'Menuisier', 'Maçon', 'Chauffeur', 'Cuisinier', 'Coiffeur', 'Couturier', 'Photographe',
  'Musicien', 'Artiste', 'Agriculteur', 'Éleveur', 'Pêcheur', 'Étudiant', 'Retraité',
  'Consultant', 'Analyste', 'Gestionnaire', 'Secrétaire', 'Assistant', 'Vendeur',
  'Agent de sécurité', 'Gardien', 'Femme de ménage', 'Ouvrier', 'Artisan', 'Transporteur'
];

async function main() {
  console.log('🚀 Génération de 979 utilisateurs pour l\'administration gabonaise...\n');

  try {
    // Supprimer tous les utilisateurs existants
    console.log('🗑️ Suppression des utilisateurs existants...');
    await prisma.user.deleteMany();

    // Récupérer toutes les organisations
    console.log('📋 Récupération des organisations...');
    const organizations = await prisma.organization.findMany();
    console.log(`✅ ${organizations.length} organisations trouvées\n`);

    if (organizations.length === 0) {
      throw new Error('Aucune organisation trouvée. Veuillez d\'abord peupler la table des organisations.');
    }

    const orgMap = {};
    const orgsByType = {};

    organizations.forEach(org => {
      orgMap[org.code] = org;
      if (!orgsByType[org.type]) {
        orgsByType[org.type] = [];
      }
      orgsByType[org.type].push(org);
    });

    const usersToCreate = [];
    let userCount = 0;

    // 1. SUPER ADMINISTRATEURS (2)
    console.log('👑 Génération des Super Administrateurs...');
    const adminOrg = orgMap['admin-ga'] || organizations[0];

    for (let i = 0; i < 2; i++) {
      const prenom = PRENOMS_MASCULINS[Math.floor(Math.random() * PRENOMS_MASCULINS.length)];
      const nom = NOMS_FAMILLES_GABONAIS[Math.floor(Math.random() * NOMS_FAMILLES_GABONAIS.length)];

      usersToCreate.push({
        email: `superadmin${i + 1}@administration.ga`,
        phone: genererTelephone(),
        firstName: prenom,
        lastName: nom,
        role: 'SUPER_ADMIN',
        isActive: true,
        isVerified: true,
        jobTitle: i === 0 ? 'Super Administrateur Système' : 'Super Administrateur Technique',
        primaryOrganizationId: adminOrg.id
      });
      userCount++;
    }

        // 2. ADMINISTRATEURS MINISTÉRIELS (68)
    console.log('🏛️ Génération des Administrateurs Ministériels...');
    const ministeres = orgsByType['MINISTERE'] || [];

    for (const ministere of ministeres) {
      const nbAdmins = Math.min(4, Math.max(1, Math.floor(Math.random() * 5))); // 1-4 admins par ministère

      for (let i = 0; i < nbAdmins; i++) {
        const isEven = Math.random() > 0.3; // 70% d'hommes pour les hauts postes
        const prenom = isEven ?
          PRENOMS_MASCULINS[Math.floor(Math.random() * PRENOMS_MASCULINS.length)] :
          PRENOMS_FEMININS[Math.floor(Math.random() * PRENOMS_FEMININS.length)];
        const nom = NOMS_FAMILLES_GABONAIS[Math.floor(Math.random() * NOMS_FAMILLES_GABONAIS.length)];
        const poste = POSTES_PAR_TYPE['MINISTERE']['ADMIN'][i] || 'Directeur Général';

        usersToCreate.push({
          email: genererEmail(prenom, nom, poste, ministere.code, DOMAINES_EMAIL['MINISTERE']),
          phone: genererTelephone(),
          firstName: prenom,
          lastName: nom,
          role: 'ADMIN',
          isActive: Math.random() > 0.05, // 95% actifs
          isVerified: Math.random() > 0.1, // 90% vérifiés
          jobTitle: poste,
          primaryOrganizationId: ministere.id
        });
        userCount++;

        if (userCount >= 70) break; // Limite augmentée pour les admins
      }
      if (userCount >= 70) break;
    }

    // 3. MANAGERS (200)
    console.log('💼 Génération des Managers...');
    const allOrgsForManagers = [...(orgsByType['MINISTERE'] || []), ...(orgsByType['DIRECTION_GENERALE'] || []),
                               ...(orgsByType['PREFECTURE'] || []), ...(orgsByType['MAIRIE'] || []),
                               ...(orgsByType['ORGANISME_SOCIAL'] || [])];

    for (let i = 0; i < 200 && allOrgsForManagers.length > 0; i++) {
      const org = allOrgsForManagers[Math.floor(Math.random() * allOrgsForManagers.length)];
      const postes = POSTES_PAR_TYPE[org.type]?.['MANAGER'] || ['Manager', 'Responsable'];
      const poste = postes[Math.floor(Math.random() * postes.length)];

      const isEven = Math.random() > 0.4; // 60% d'hommes
      const prenom = isEven ?
        PRENOMS_MASCULINS[Math.floor(Math.random() * PRENOMS_MASCULINS.length)] :
        PRENOMS_FEMININS[Math.floor(Math.random() * PRENOMS_FEMININS.length)];
      const nom = NOMS_FAMILLES_GABONAIS[Math.floor(Math.random() * NOMS_FAMILLES_GABONAIS.length)];

      usersToCreate.push({
        email: genererEmail(prenom, nom, poste, org.code, DOMAINES_EMAIL[org.type]),
        phone: genererTelephone(),
        firstName: prenom,
        lastName: nom,
        role: 'MANAGER',
        isActive: Math.random() > 0.1, // 90% actifs
        isVerified: Math.random() > 0.15, // 85% vérifiés
        jobTitle: poste,
        primaryOrganizationId: org.id
      });
      userCount++;
    }

    // 4. AGENTS (317)
    console.log('⚙️ Génération des Agents...');
    const allOrgsForAgents = organizations.filter(org => org.type !== 'AUTRE');

    for (let i = 0; i < 317 && allOrgsForAgents.length > 0; i++) {
      const org = allOrgsForAgents[Math.floor(Math.random() * allOrgsForAgents.length)];
      const postes = POSTES_PAR_TYPE[org.type]?.['AGENT'] || ['Agent', 'Technicien', 'Spécialiste'];
      const poste = postes[Math.floor(Math.random() * postes.length)];

      const isEven = Math.random() > 0.5; // 50/50
      const prenom = isEven ?
        PRENOMS_MASCULINS[Math.floor(Math.random() * PRENOMS_MASCULINS.length)] :
        PRENOMS_FEMININS[Math.floor(Math.random() * PRENOMS_FEMININS.length)];
      const nom = NOMS_FAMILLES_GABONAIS[Math.floor(Math.random() * NOMS_FAMILLES_GABONAIS.length)];

      usersToCreate.push({
        email: genererEmail(prenom, nom, poste, org.code, DOMAINES_EMAIL[org.type]),
        phone: genererTelephone(),
        firstName: prenom,
        lastName: nom,
        role: 'AGENT',
        isActive: Math.random() > 0.15, // 85% actifs
        isVerified: Math.random() > 0.2, // 80% vérifiés
        jobTitle: poste,
        primaryOrganizationId: org.id
      });
      userCount++;
    }

    // 5. CITOYENS (509 pour atteindre 979 au total)
    console.log('🏠 Génération des Citoyens...');
    const citoyensNeeded = 979 - userCount;
    console.log(`Target: ${citoyensNeeded} citoyens pour atteindre 979 utilisateurs au total`);

    for (let i = 0; i < citoyensNeeded; i++) {
      const isEven = Math.random() > 0.52; // 48% de femmes, 52% d'hommes
      const prenom = isEven ?
        PRENOMS_MASCULINS[Math.floor(Math.random() * PRENOMS_MASCULINS.length)] :
        PRENOMS_FEMININS[Math.floor(Math.random() * PRENOMS_FEMININS.length)];
      const nom = NOMS_FAMILLES_GABONAIS[Math.floor(Math.random() * NOMS_FAMILLES_GABONAIS.length)];
      const profession = PROFESSIONS_CITOYENS[Math.floor(Math.random() * PROFESSIONS_CITOYENS.length)];

      usersToCreate.push({
        email: genererEmailCitoyen(prenom, nom),
        phone: genererTelephone(),
        firstName: prenom,
        lastName: nom,
        role: 'USER',
        isActive: Math.random() > 0.2, // 80% actifs
        isVerified: Math.random() > 0.3, // 70% vérifiés
        jobTitle: profession,
        primaryOrganizationId: null
      });
      userCount++;
    }

    console.log(`\n📊 Total utilisateurs à créer: ${usersToCreate.length}`);
    console.log('💾 Insertion en base de données...\n');

    // Insertion par lots pour de meilleures performances
    const batchSize = 50;
    let createdCount = 0;
    let errorCount = 0;

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

        // Essayer de créer individuellement en cas d'erreur de lot
        for (const userData of batch) {
          try {
            await prisma.user.create({ data: userData });
            createdCount++;
          } catch (individualError) {
            errorCount++;
            console.log(`❌ Erreur utilisateur ${userData.firstName} ${userData.lastName}: ${individualError.message}`);
          }
        }
      }
    }

    // Statistiques finales
    console.log('\n📈 Génération terminée ! Calcul des statistiques...\n');

    const stats = await prisma.user.groupBy({
      by: ['role'],
      _count: { role: true }
    });

    const totalUsers = await prisma.user.count();
    const activeUsers = await prisma.user.count({ where: { isActive: true } });
    const verifiedUsers = await prisma.user.count({ where: { isVerified: true } });
    const usersWithOrg = await prisma.user.count({ where: { primaryOrganizationId: { not: null } } });

    console.log('🎉 GÉNÉRATION RÉUSSIE !');
    console.log('========================');
    console.log(`👥 Total utilisateurs créés: ${totalUsers}`);
    console.log(`✅ Utilisateurs créés avec succès: ${createdCount}`);
    console.log(`❌ Erreurs lors de la création: ${errorCount}`);
    console.log(`🟢 Utilisateurs actifs: ${activeUsers} (${Math.round((activeUsers/totalUsers)*100)}%)`);
    console.log(`☑️ Utilisateurs vérifiés: ${verifiedUsers} (${Math.round((verifiedUsers/totalUsers)*100)}%)`);
    console.log(`🏢 Utilisateurs avec organisation: ${usersWithOrg} (${Math.round((usersWithOrg/totalUsers)*100)}%)`);

    console.log('\n📊 Répartition par rôle:');
    stats.forEach(stat => {
      console.log(`   ${stat.role}: ${stat._count.role} utilisateurs`);
    });

    console.log('\n🇬🇦 L\'administration gabonaise dispose maintenant d\'un système complet avec près de 1000 utilisateurs !');

  } catch (error) {
    console.error('❌ Erreur lors de la génération:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
