/**
 * Script de fusion intelligente des données
 * Ajoute les nouvelles structures SANS supprimer les données existantes
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Nouvelles structures à ajouter (sans écraser l'existant)
const NOUVELLES_STRUCTURES = [
  {
    code: "MEF",
    name: "Ministère d'État de l'Économie et des Finances",
    type: "MINISTERE_ETAT",
    description: "Ministère d'État de l'Économie et des Finances - économie, finances, budget",
    email: "contact@mef.gouv.ga",
    phone: "+241 01 76 64 64",
    city: "Libreville",
    website: "https://mef.gouv.ga"
  },
  {
    code: "MEN",
    name: "Ministère d'État de l'Éducation Nationale",
    type: "MINISTERE_ETAT",
    description: "Ministère d'État de l'Éducation Nationale - éducation, formation",
    email: "contact@men.gouv.ga",
    city: "Libreville",
    website: "https://men.gouv.ga"
  },
  {
    code: "MAE",
    name: "Ministère des Affaires Étrangères",
    type: "MINISTERE",
    description: "Ministère des Affaires Étrangères - diplomatie, coopération",
    city: "Libreville",
    website: "https://mae.gouv.ga"
  },
  {
    code: "EST",
    name: "Gouvernorat de l'Estuaire",
    type: "GOUVERNORAT",
    description: "Administration provinciale - Chef-lieu: Libreville",
    email: "gouvernorat.estuaire@gouv.ga",
    city: "Libreville"
  },
  {
    code: "HO",
    name: "Gouvernorat du Haut-Ogooué",
    type: "GOUVERNORAT",
    description: "Administration provinciale - Chef-lieu: Franceville",
    email: "gouvernorat.hautogooue@gouv.ga",
    city: "Franceville"
  },
  {
    code: "ANPN",
    name: "Agence Nationale des Parcs Nationaux",
    type: "AGENCE_NATIONALE",
    description: "Gestion et conservation des parcs nationaux du Gabon",
    email: "contact@anpn.ga",
    city: "Libreville",
    website: "https://anpn.ga"
  },
  {
    code: "CNSS",
    name: "Caisse Nationale de Sécurité Sociale",
    type: "ORGANISME_SOCIAL",
    description: "Régime de sécurité sociale des travailleurs",
    email: "contact@cnss.ga",
    city: "Libreville",
    website: "https://cnss.ga"
  }
];

// Utilisateurs type pour les nouvelles structures
const POSTES_PAR_TYPE = {
  'MINISTERE_ETAT': [
    { titre: 'Ministre d\'État', role: 'SUPER_ADMIN' },
    { titre: 'Secrétaire Général', role: 'ADMIN' },
    { titre: 'Directeur de Cabinet', role: 'ADMIN' },
    { titre: 'Conseiller Juridique', role: 'MANAGER' },
    { titre: 'Chef de Service Budget', role: 'MANAGER' },
    { titre: 'Attaché Administratif', role: 'AGENT' },
    { titre: 'Secrétaire', role: 'USER' }
  ],
  'MINISTERE': [
    { titre: 'Ministre', role: 'SUPER_ADMIN' },
    { titre: 'Secrétaire Général', role: 'ADMIN' },
    { titre: 'Directeur de Cabinet', role: 'ADMIN' },
    { titre: 'Chef de Service', role: 'MANAGER' },
    { titre: 'Attaché Administratif', role: 'AGENT' },
    { titre: 'Secrétaire', role: 'USER' }
  ],
  'GOUVERNORAT': [
    { titre: 'Gouverneur', role: 'ADMIN' },
    { titre: 'Secrétaire Général', role: 'ADMIN' },
    { titre: 'Chef Service Administration', role: 'MANAGER' },
    { titre: 'Agent Administratif', role: 'AGENT' }
  ],
  'AGENCE_NATIONALE': [
    { titre: 'Directeur Général', role: 'ADMIN' },
    { titre: 'Directeur Adjoint', role: 'MANAGER' },
    { titre: 'Chef de Département', role: 'MANAGER' },
    { titre: 'Chargé d\'Études', role: 'AGENT' }
  ],
  'ORGANISME_SOCIAL': [
    { titre: 'Directeur Général', role: 'ADMIN' },
    { titre: 'Directeur Adjoint', role: 'MANAGER' },
    { titre: 'Chef de Service', role: 'MANAGER' },
    { titre: 'Agent Administratif', role: 'AGENT' }
  ]
};

const PRENOMS_GABONAIS = [
  'Jean', 'Marie', 'Pierre', 'Anne', 'Paul', 'Sophie', 'Michel', 'Claire',
  'André', 'Catherine', 'François', 'Élise', 'Henri', 'Jeanne', 'Louis', 'Monique'
];

const NOMS_GABONAIS = [
  'OBIANG', 'NGUEMA', 'MBA', 'NZUE', 'NDONG', 'ESSONO', 'NTOUTOUME', 'MINKO',
  'MOUELE', 'OYONO', 'BEKALE', 'NGOUA', 'MOUSSAVOU', 'MBOUMBA', 'MENGUE'
];

function genererNomPersonne() {
  const prenom = PRENOMS_GABONAIS[Math.floor(Math.random() * PRENOMS_GABONAIS.length)];
  const nom = NOMS_GABONAIS[Math.floor(Math.random() * NOMS_GABONAIS.length)];
  return { prenom, nom };
}

function genererEmail(prenom, nom, orgCode) {
  const prenomClean = prenom.toLowerCase().replace(/[^a-z]/g, '');
  const nomClean = nom.toLowerCase().replace(/[^a-z]/g, '');
  const orgClean = orgCode.toLowerCase().replace(/_/g, '-');
  return `${prenomClean}.${nomClean}@${orgClean}.gouv.ga`;
}

function genererTelephone() {
  const operateurs = ['011', '062', '065', '066', '074', '077'];
  const operateur = operateurs[Math.floor(Math.random() * operateurs.length)];
  const numero = Math.floor(Math.random() * 900000) + 100000;
  return `+241 ${operateur} ${Math.floor(numero / 1000)} ${numero % 1000}`;
}

async function fusionIntelligente() {
  console.log('🔄 FUSION INTELLIGENTE DES DONNÉES');
  console.log('=====================================\n');

  try {
    // 1. Analyser l'état actuel
    console.log('📊 Analyse de l\'état actuel...');
    const statsAvant = {
      organisations: await prisma.organization.count(),
      utilisateurs: await prisma.user.count(),
      parRole: await prisma.user.groupBy({
        by: ['role'],
        _count: { role: true }
      })
    };

    console.log(`   Organisations existantes: ${statsAvant.organisations}`);
    console.log(`   Utilisateurs existants: ${statsAvant.utilisateurs}`);
    statsAvant.parRole.forEach(stat => {
      console.log(`   - ${stat.role}: ${stat._count.role}`);
    });
    console.log();

    // 2. Ajouter les nouvelles organisations (si elles n'existent pas)
    console.log('🏛️ Ajout intelligent des organisations...');
    let organisationsAjoutees = 0;

    for (const nouvelleOrg of NOUVELLES_STRUCTURES) {
      // Vérifier si l'organisation existe déjà
      const existe = await prisma.organization.findUnique({
        where: { code: nouvelleOrg.code }
      });

      if (!existe) {
        await prisma.organization.create({
          data: {
            ...nouvelleOrg,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        });
        console.log(`   ✅ ${nouvelleOrg.name} ajoutée`);
        organisationsAjoutees++;
      } else {
        console.log(`   ⏩ ${nouvelleOrg.name} existe déjà`);
      }
    }

    // 3. Ajouter du personnel pour les nouvelles organisations
    console.log('\n👥 Ajout du personnel pour nouvelles organisations...');
    let utilisateursAjoutes = 0;

    const organisationsNouvellesUniquement = await prisma.organization.findMany({
      where: {
        code: { in: NOUVELLES_STRUCTURES.map(org => org.code) },
        users: { none: {} } // Organisations sans utilisateurs
      }
    });

    for (const org of organisationsNouvellesUniquement) {
      const postes = POSTES_PAR_TYPE[org.type] || POSTES_PAR_TYPE['MINISTERE'];

      console.log(`   🏢 Ajout personnel pour ${org.name}...`);

      for (const poste of postes) {
        const { prenom, nom } = genererNomPersonne();
        const email = genererEmail(prenom, nom, org.code);

        // Vérifier que l'email n'existe pas déjà
        const existeEmail = await prisma.user.findUnique({
          where: { email }
        });

        if (!existeEmail) {
          await prisma.user.create({
            data: {
              email,
              phone: genererTelephone(),
              firstName: prenom,
              lastName: nom,
              role: poste.role,
              jobTitle: poste.titre,
              primaryOrganizationId: org.id,
              isActive: true,
              isVerified: true,
              createdAt: new Date(),
              updatedAt: new Date(),
              lastLoginAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
            }
          });
          utilisateursAjoutes++;
          console.log(`     ✅ ${prenom} ${nom} - ${poste.titre}`);
        }
      }
    }

    // 4. Statistiques finales
    console.log('\n📊 Statistiques après fusion intelligente...');
    const statsApres = {
      organisations: await prisma.organization.count(),
      utilisateurs: await prisma.user.count(),
      parRole: await prisma.user.groupBy({
        by: ['role'],
        _count: { role: true }
      })
    };

    console.log(`   Organisations totales: ${statsApres.organisations} (+${statsApres.organisations - statsAvant.organisations})`);
    console.log(`   Utilisateurs totaux: ${statsApres.utilisateurs} (+${statsApres.utilisateurs - statsAvant.utilisateurs})`);

    console.log('\n📈 Comparaison par rôle:');
    const rolesAvant = Object.fromEntries(statsAvant.parRole.map(r => [r.role, r._count.role]));
    const rolesApres = Object.fromEntries(statsApres.parRole.map(r => [r.role, r._count.role]));

    Object.keys(rolesApres).forEach(role => {
      const avant = rolesAvant[role] || 0;
      const apres = rolesApres[role];
      const diff = apres - avant;
      console.log(`   ${role}: ${avant} → ${apres} (${diff >= 0 ? '+' : ''}${diff})`);
    });

    // 5. Validation d'intégrité
    console.log('\n✅ Validation d\'intégrité...');
    const usersWithoutOrg = await prisma.user.count({
      where: { primaryOrganizationId: null }
    });

    const orgsWithoutUsers = await prisma.organization.count({
      where: { users: { none: {} } }
    });

    console.log(`   Utilisateurs sans organisation: ${usersWithoutOrg}`);
    console.log(`   Organisations sans utilisateurs: ${orgsWithoutUsers}`);

    if (usersWithoutOrg === 0 && orgsWithoutUsers === 0) {
      console.log('   🎉 Intégrité des données PARFAITE!');
    }

    console.log('\n🎯 FUSION INTELLIGENTE TERMINÉE AVEC SUCCÈS!');
    console.log(`✨ ${organisationsAjoutees} nouvelles organisations ajoutées`);
    console.log(`✨ ${utilisateursAjoutes} nouveaux utilisateurs créés`);
    console.log('🔒 AUCUNE donnée existante supprimée');

  } catch (error) {
    console.error('❌ Erreur lors de la fusion intelligente:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter la fusion
fusionIntelligente();
