/**
 * Script pour peupler la base de données avec la structure gouvernementale gabonaise 2025
 * Crée les organisations et les utilisateurs avec leurs postes respectifs
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Données des noms gabonais pour générer des utilisateurs réalistes
const PRENOMS_GABONAIS = {
  masculins: [
    'Jean', 'Pierre', 'Paul', 'François', 'Michel', 'André', 'Jacques', 'Philippe',
    'Alain', 'Bernard', 'Claude', 'Daniel', 'Georges', 'Henri', 'Louis', 'Marc',
    'Serge', 'Thierry', 'Vincent', 'Yves', 'Augustin', 'Blaise', 'Célestin',
    'Désiré', 'Émile', 'Fabrice', 'Gaston', 'Hugues', 'Isidore', 'Jules'
  ],
  feminins: [
    'Marie', 'Jeanne', 'Anne', 'Claire', 'Sophie', 'Catherine', 'Élise', 'Françoise',
    'Hélène', 'Isabelle', 'Julie', 'Laurence', 'Monique', 'Nathalie', 'Odette',
    'Patricia', 'Rose', 'Sylvie', 'Thérèse', 'Véronique', 'Angélique', 'Béatrice',
    'Célestine', 'Delphine', 'Émilie', 'Félicité', 'Gisèle', 'Henriette', 'Irène'
  ]
};

const NOMS_GABONAIS = [
  'OBIANG', 'NGUEMA', 'MBA', 'NZUE', 'NDONG', 'ESSONO', 'NTOUTOUME', 'MINKO',
  'MOUELE', 'OYONO', 'BEKALE', 'NGOUA', 'MOUSSAVOU', 'MBOUMBA', 'MENGUE',
  'NKOGHE', 'ONDO', 'BIYOGHE', 'MOUNDOUNGA', 'ABESSOLO', 'ENGONGA', 'MEYO',
  'NZENG', 'OBAME', 'MINTSA', 'MBADINGA', 'MAPANGOU', 'KOUMBA', 'BOUSSOUGOU',
  'ANGUE', 'ELLA', 'NKOUROU', 'MOUBAMBA', 'BOUKOUMOU', 'NZIENGUI', 'MADOUNGOU'
];

// Structure gouvernementale
const STRUCTURE_GOUVERNEMENT = {
  presidence: {
    organisation: {
      code: 'PRESIDENCE',
      name: 'Présidence de la République',
      type: 'PRESIDENCE',
      description: 'Institution suprême de l\'État gabonais',
      email: 'contact@presidence.gouv.ga',
      phone: '+241 01 74 21 00',
      address: 'Boulevard Triomphal Omar Bongo Ondimba',
      city: 'Libreville',
      website: 'https://presidence.gouv.ga'
    },
    postes: [
      { titre: 'Président de la République', nom: 'Brice Clotaire OLIGUI NGUEMA', role: 'SUPER_ADMIN' },
      { titre: 'Vice-Président de la République', nom: 'Séraphin MOUNDOUNGA', role: 'SUPER_ADMIN' },
      { titre: 'Vice-Président du Gouvernement', nom: 'Hugues Alexandre BARRO CHAMBRIER', role: 'SUPER_ADMIN' },
      { titre: 'Secrétaire Général de la Présidence', nom: 'Guy ROSSATANGA-RIGNAULT', role: 'SUPER_ADMIN' },
      { titre: 'Directeur de Cabinet Adjoint', nom: 'Andy Grégory LEYINDA BICKOTA', role: 'ADMIN' }
    ]
  },

  secretariat_gouvernement: {
    organisation: {
      code: 'SGG',
      name: 'Secrétariat Général du Gouvernement',
      type: 'SECRETARIAT_GENERAL',
      description: 'Coordination de l\'action gouvernementale',
      email: 'contact@sgg.gouv.ga',
      phone: '+241 01 74 25 00',
      address: 'Immeuble du Gouvernement',
      city: 'Libreville'
    },
    postes: [
      { titre: 'Secrétaire Général du Gouvernement', nom: 'Murielle MINKOUE MEZUI ép MINTSA MI OWONO', role: 'SUPER_ADMIN' },
      { titre: 'Secrétaire Général Adjoint', nom: 'Fortuné MATSINGUI MBOULA', role: 'ADMIN' },
      { titre: 'Directeur de Cabinet', nom: 'Jean-Danice AKARIKI', role: 'ADMIN' },
      { titre: 'Secrétaire du Conseil des Ministres', nom: 'Yves D. Sylvain MOUSSAVOU BOUSSOUGOU', role: 'ADMIN' },
      { titre: 'Secrétaire Adjoint du Conseil', nom: 'Elza Ritchuelle BOUKANDOU', role: 'MANAGER' }
    ]
  }
};

// Ministères d'État
const MINISTERES_ETAT = [
  {
    organisation: {
      code: 'MEF',
      name: 'Ministère d\'État de l\'Économie et des Finances',
      type: 'MINISTERE',
      description: 'Politique économique, finances publiques, dette et participations',
      email: 'contact@mef.gouv.ga',
      phone: '+241 01 79 50 00',
      address: 'BP 165 Libreville',
      city: 'Libreville',
      website: 'https://mef.gouv.ga'
    },
    ministre: { nom: 'Henri-Claude OYIMA', titre: 'Ministre d\'État' },
    postes_cles: [
      { titre: 'Directeur Général du Budget', nom: 'Paule Élisabeth Désirée MBOUMBA LASSY', role: 'ADMIN' },
      { titre: 'Secrétaire Général', nom: 'Jean-Pierre NZOGHE', role: 'ADMIN' },
      { titre: 'Directeur de Cabinet', nom: 'Michel ENGONGA', role: 'ADMIN' }
    ]
  },
  {
    organisation: {
      code: 'MEN',
      name: 'Ministère d\'État de l\'Éducation Nationale',
      type: 'MINISTERE',
      description: 'Éducation nationale, instruction civique et formation professionnelle',
      email: 'contact@men.gouv.ga',
      phone: '+241 01 76 20 00',
      address: 'BP 6 Libreville',
      city: 'Libreville'
    },
    ministre: { nom: 'Camélia NTOUTOUME-LECLERCQ', titre: 'Ministre d\'État' },
    postes_cles: [
      { titre: 'Secrétaire Général', nom: 'Marie-Claire MBOUMBA', role: 'ADMIN' },
      { titre: 'Directeur de Cabinet', nom: 'François NDONG', role: 'ADMIN' }
    ]
  },
  {
    organisation: {
      code: 'MTM',
      name: 'Ministère d\'État des Transports et de la Logistique',
      type: 'MINISTERE',
      description: 'Transports, marine marchande et logistique nationale',
      email: 'contact@mtm.gouv.ga',
      phone: '+241 01 74 47 00',
      address: 'BP 803 Libreville',
      city: 'Libreville'
    },
    ministre: { nom: 'Ulrich MANFOUMBI MANFOUMBI', titre: 'Ministre d\'État' },
    postes_cles: [
      { titre: 'Secrétaire Général', nom: 'André MOUELE', role: 'ADMIN' },
      { titre: 'Directeur de Cabinet', nom: 'Philippe OYONO', role: 'ADMIN' }
    ]
  }
];

// Ministères réguliers (échantillon)
const MINISTERES = [
  {
    organisation: {
      code: 'MAE',
      name: 'Ministère des Affaires Étrangères',
      type: 'MINISTERE',
      description: 'Relations diplomatiques et coopération internationale',
      email: 'contact@mae.gouv.ga',
      phone: '+241 01 79 10 00',
      address: 'BP 2245 Libreville',
      city: 'Libreville'
    },
    ministre: { nom: 'Régis ONANGA NDIAYE', titre: 'Ministre' },
    postes_cles: [
      { titre: 'Secrétaire Général', nom: 'Bernard BEKALE', role: 'ADMIN' },
      { titre: 'Directeur de Cabinet', nom: 'Claude NGOUA', role: 'ADMIN' }
    ]
  },
  {
    organisation: {
      code: 'MJ',
      name: 'Ministère de la Justice',
      type: 'MINISTERE',
      description: 'Justice et droits de l\'homme',
      email: 'contact@justice.gouv.ga',
      phone: '+241 01 76 46 00',
      address: 'BP 547 Libreville',
      city: 'Libreville'
    },
    ministre: { nom: 'Paul-Marie GONDJOUT', titre: 'Ministre, Garde des Sceaux' },
    postes_cles: [
      { titre: 'Secrétaire Général', nom: 'Jacques MOUSSAVOU', role: 'ADMIN' },
      { titre: 'Directeur de Cabinet', nom: 'Pierre MBOUMBA', role: 'ADMIN' }
    ]
  },
  {
    organisation: {
      code: 'MISD',
      name: 'Ministère de l\'Intérieur et de la Sécurité',
      type: 'MINISTERE',
      description: 'Administration territoriale, sécurité et décentralisation',
      email: 'contact@interieur.gouv.ga',
      phone: '+241 01 76 56 00',
      address: 'BP 2110 Libreville',
      city: 'Libreville'
    },
    ministre: { nom: 'Hermann IMMONGAULT', titre: 'Ministre' },
    postes_cles: [
      { titre: 'Inspecteur Général des Services', nom: 'Général Julienne MOUYABI', role: 'ADMIN' },
      { titre: 'Secrétaire Général', nom: 'Daniel MENGUE', role: 'ADMIN' }
    ]
  },
  {
    organisation: {
      code: 'MSAS',
      name: 'Ministère de la Santé et des Affaires Sociales',
      type: 'MINISTERE',
      description: 'Politique sanitaire et protection sociale',
      email: 'contact@sante.gouv.ga',
      phone: '+241 01 76 30 00',
      address: 'BP 50 Libreville',
      city: 'Libreville'
    },
    ministre: { nom: 'Adrien MONGOUNGOU', titre: 'Ministre' },
    postes_cles: [
      { titre: 'Secrétaire Général', nom: 'Dr Marie NKOGHE', role: 'ADMIN' },
      { titre: 'Directeur de Cabinet', nom: 'Dr Georges ONDO', role: 'ADMIN' }
    ]
  },
  {
    organisation: {
      code: 'MEEC',
      name: 'Ministère de l\'Environnement et du Climat',
      type: 'MINISTERE',
      description: 'Protection environnementale et politique climatique',
      email: 'contact@environnement.gouv.ga',
      phone: '+241 01 76 61 00',
      address: 'BP 3241 Libreville',
      city: 'Libreville'
    },
    ministre: { nom: 'Mays MOUISSI', titre: 'Ministre' },
    postes_cles: [
      { titre: 'Directeur de Cabinet', nom: 'Paul-Timothee Il MBOUMBA', role: 'ADMIN' },
      { titre: 'Conseiller Juridique', nom: 'Ruth TSIOUKACKA', role: 'MANAGER' },
      { titre: 'Conseiller Communication', nom: 'Alex Cédric SAIZONOU ANGUILET', role: 'MANAGER' },
      { titre: 'Conseiller Diplomatique', nom: 'Ines Cecilia MOUSSAVOU NGADJI', role: 'MANAGER' }
    ]
  }
];

// Directions Générales importantes
const DIRECTIONS_GENERALES = [
  {
    organisation: {
      code: 'DGDI',
      name: 'Direction Générale de la Documentation et de l\'Immigration',
      type: 'DIRECTION_GENERALE',
      description: 'Gestion des documents d\'identité et de l\'immigration',
      email: 'contact@dgdi.gouv.ga',
      phone: '+241 01 76 56 50',
      address: 'BP 2119 Libreville',
      city: 'Libreville'
    },
    directeur: { nom: 'Colonel Jean-Claude OBAME', titre: 'Directeur Général' },
    postes_cles: [
      { titre: 'Directeur Général Adjoint', nom: 'Lieutenant-Colonel Marie MINTSA', role: 'ADMIN' },
      { titre: 'Directeur des Passeports', nom: 'Commandant Pierre MBADINGA', role: 'MANAGER' }
    ]
  },
  {
    organisation: {
      code: 'DGI',
      name: 'Direction Générale des Impôts',
      type: 'DIRECTION_GENERALE',
      description: 'Administration fiscale et recouvrement des impôts',
      email: 'contact@dgi.gouv.ga',
      phone: '+241 01 79 52 00',
      address: 'BP 37 Libreville',
      city: 'Libreville'
    },
    directeur: { nom: 'Jean-Fidèle OTANDAULT', titre: 'Directeur Général' },
    postes_cles: [
      { titre: 'Directeur Général Adjoint', nom: 'Marie-Louise MAPANGOU', role: 'ADMIN' },
      { titre: 'Directeur des Grandes Entreprises', nom: 'Michel KOUMBA', role: 'MANAGER' }
    ]
  }
];

// Fonction pour générer un email professionnel
function genererEmail(prenom, nom, orgCode) {
  const prenomClean = prenom.toLowerCase().replace(/[^a-z]/g, '');
  const nomClean = nom.toLowerCase().replace(/[^a-z]/g, '');
  const orgClean = orgCode.toLowerCase().replace(/_/g, '-');
  return `${prenomClean}.${nomClean}@${orgClean}.gouv.ga`;
}

// Fonction pour générer un téléphone gabonais
function genererTelephone() {
  const operateurs = ['011', '062', '065', '066', '074', '077'];
  const operateur = operateurs[Math.floor(Math.random() * operateurs.length)];
  const numero = Math.floor(Math.random() * 900000) + 100000;
  return `+241 ${operateur} ${Math.floor(numero / 1000)} ${numero % 1000}`;
}

// Fonction pour créer une organisation
async function creerOrganisation(orgData) {
  try {
    const org = await prisma.organization.create({
      data: {
        ...orgData,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });
    console.log(`✅ Organisation créée: ${org.name}`);
    return org;
  } catch (error) {
    console.error(`❌ Erreur création organisation ${orgData.name}:`, error.message);
    return null;
  }
}

// Fonction pour créer un utilisateur
async function creerUtilisateur(userData, organisationId) {
  try {
    const user = await prisma.user.create({
      data: {
        ...userData,
        primaryOrganizationId: organisationId,
        isActive: true,
        isVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLoginAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
      }
    });
    console.log(`  ✅ Utilisateur créé: ${user.firstName} ${user.lastName} - ${user.jobTitle}`);
    return user;
  } catch (error) {
    console.error(`  ❌ Erreur création utilisateur ${userData.email}:`, error.message);
    return null;
  }
}

// Fonction pour créer le personnel d'une organisation
async function creerPersonnelOrganisation(organisation, postes) {
  console.log(`\n👥 Création du personnel pour ${organisation.name}...`);

  for (const poste of postes) {
    const [prenom, ...nomsArray] = poste.nom.split(' ');
    const nom = nomsArray.join(' ');

    await creerUtilisateur({
      email: genererEmail(prenom, nom.replace(/ /g, '-'), organisation.code),
      phone: genererTelephone(),
      firstName: prenom,
      lastName: nom,
      role: poste.role || 'USER',
      jobTitle: poste.titre
    }, organisation.id);
  }
}

// Fonction pour créer du personnel supplémentaire
async function creerPersonnelSupplementaire(organisation, nombre = 5) {
  console.log(`\n👥 Création de personnel supplémentaire pour ${organisation.name}...`);

  const postes = [
    { titre: 'Chef de Service', role: 'MANAGER' },
    { titre: 'Chargé d\'Études', role: 'AGENT' },
    { titre: 'Attaché Administratif', role: 'AGENT' },
    { titre: 'Secrétaire', role: 'USER' },
    { titre: 'Agent Administratif', role: 'USER' }
  ];

  for (let i = 0; i < nombre; i++) {
    const isFeminin = Math.random() > 0.5;
    const prenom = isFeminin
      ? PRENOMS_GABONAIS.feminins[Math.floor(Math.random() * PRENOMS_GABONAIS.feminins.length)]
      : PRENOMS_GABONAIS.masculins[Math.floor(Math.random() * PRENOMS_GABONAIS.masculins.length)];
    const nom = NOMS_GABONAIS[Math.floor(Math.random() * NOMS_GABONAIS.length)];
    const poste = postes[Math.floor(Math.random() * postes.length)];

    await creerUtilisateur({
      email: genererEmail(prenom, nom, organisation.code),
      phone: genererTelephone(),
      firstName: prenom,
      lastName: nom,
      role: poste.role,
      jobTitle: poste.titre
    }, organisation.id);
  }
}

// Fonction principale
async function main() {
  console.log('🚀 Début du peuplement de la base de données avec la structure gouvernementale gabonaise...\n');

  try {
    // Nettoyer les données existantes
    console.log('🧹 Nettoyage des données existantes...');
    await prisma.user.deleteMany({});
    await prisma.organization.deleteMany({});
    console.log('✅ Base de données nettoyée\n');

    // Créer la Présidence
    console.log('🏛️ CRÉATION DE LA PRÉSIDENCE');
    const presidence = await creerOrganisation(STRUCTURE_GOUVERNEMENT.presidence.organisation);
    if (presidence) {
      await creerPersonnelOrganisation(presidence, STRUCTURE_GOUVERNEMENT.presidence.postes);
    }

    // Créer le Secrétariat Général du Gouvernement
    console.log('\n📋 CRÉATION DU SECRÉTARIAT GÉNÉRAL DU GOUVERNEMENT');
    const sgg = await creerOrganisation(STRUCTURE_GOUVERNEMENT.secretariat_gouvernement.organisation);
    if (sgg) {
      await creerPersonnelOrganisation(sgg, STRUCTURE_GOUVERNEMENT.secretariat_gouvernement.postes);
    }

    // Créer les Ministères d'État
    console.log('\n🏛️ CRÉATION DES MINISTÈRES D\'ÉTAT');
    for (const ministereData of MINISTERES_ETAT) {
      const ministere = await creerOrganisation(ministereData.organisation);
      if (ministere) {
        // Créer le ministre
        const [prenomMin, ...nomsMin] = ministereData.ministre.nom.split(' ');
        await creerUtilisateur({
          email: genererEmail(prenomMin, nomsMin.join('-'), ministere.code),
          phone: genererTelephone(),
          firstName: prenomMin,
          lastName: nomsMin.join(' '),
          role: 'SUPER_ADMIN',
          jobTitle: ministereData.ministre.titre
        }, ministere.id);

        // Créer les postes clés
        await creerPersonnelOrganisation(ministere, ministereData.postes_cles);

        // Créer du personnel supplémentaire
        await creerPersonnelSupplementaire(ministere, 10);
      }
    }

    // Créer les Ministères réguliers
    console.log('\n🏛️ CRÉATION DES MINISTÈRES');
    for (const ministereData of MINISTERES) {
      const ministere = await creerOrganisation(ministereData.organisation);
      if (ministere) {
        // Créer le ministre
        const [prenomMin, ...nomsMin] = ministereData.ministre.nom.split(' ');
        await creerUtilisateur({
          email: genererEmail(prenomMin, nomsMin.join('-'), ministere.code),
          phone: genererTelephone(),
          firstName: prenomMin,
          lastName: nomsMin.join(' '),
          role: 'SUPER_ADMIN',
          jobTitle: ministereData.ministre.titre
        }, ministere.id);

        // Créer les postes clés
        await creerPersonnelOrganisation(ministere, ministereData.postes_cles);

        // Créer du personnel supplémentaire
        await creerPersonnelSupplementaire(ministere, 8);
      }
    }

    // Créer les Directions Générales
    console.log('\n🏢 CRÉATION DES DIRECTIONS GÉNÉRALES');
    for (const dgData of DIRECTIONS_GENERALES) {
      const dg = await creerOrganisation(dgData.organisation);
      if (dg) {
        // Créer le directeur général
        const [prenomDG, ...nomsDG] = dgData.directeur.nom.split(' ');
        await creerUtilisateur({
          email: genererEmail(prenomDG, nomsDG.join('-'), dg.code),
          phone: genererTelephone(),
          firstName: prenomDG,
          lastName: nomsDG.join(' '),
          role: 'ADMIN',
          jobTitle: dgData.directeur.titre
        }, dg.id);

        // Créer les postes clés
        await creerPersonnelOrganisation(dg, dgData.postes_cles);

        // Créer du personnel supplémentaire
        await creerPersonnelSupplementaire(dg, 15);
      }
    }

    // Statistiques finales
    const totalOrgs = await prisma.organization.count();
    const totalUsers = await prisma.user.count();
    const usersByRole = await prisma.user.groupBy({
      by: ['role'],
      _count: {
        role: true
      }
    });

    console.log('\n📊 STATISTIQUES FINALES');
    console.log('=======================');
    console.log(`🏢 Total organisations: ${totalOrgs}`);
    console.log(`👥 Total utilisateurs: ${totalUsers}`);
    console.log('\n📈 Répartition par rôle:');
    usersByRole.forEach(stat => {
      console.log(`   ${stat.role}: ${stat._count.role} utilisateurs`);
    });

    console.log('\n✅ Peuplement terminé avec succès!');

  } catch (error) {
    console.error('❌ Erreur lors du peuplement:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter le script
main();
