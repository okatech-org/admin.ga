#!/usr/bin/env ts-node

/**
 * Script pour peupler la base de données avec des organismes gabonais réalistes
 * Usage: npx ts-node scripts/populate-organizations.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Organismes gabonais réalistes
const ORGANISMES_GABONAIS = [
  // MINISTÈRES
  {
    name: 'Ministère de l\'Intérieur et de la Sécurité',
    code: 'MIN-INTER',
    type: 'MINISTRY',
    description: 'Ministère chargé de l\'administration territoriale, de la sécurité publique et de la police nationale',
    city: 'Libreville',
    address: 'BP 2110, Libreville',
    phone: '+241 01 44 25 25',
    email: 'contact@interieur.gouv.ga',
    website: 'https://www.interieur.gouv.ga'
  },
  {
    name: 'Ministère de l\'Économie et des Finances',
    code: 'MIN-ECO-FIN',
    type: 'MINISTRY',
    description: 'Ministère chargé de la politique économique, fiscale et financière du pays',
    city: 'Libreville',
    address: 'BP 747, Libreville',
    phone: '+241 01 76 14 25',
    email: 'contact@finances.gouv.ga',
    website: 'https://www.finances.gouv.ga'
  },
  {
    name: 'Ministère de la Santé et des Affaires Sociales',
    code: 'MIN-SANTE',
    type: 'MINISTRY',
    description: 'Ministère chargé de la santé publique et de la protection sociale',
    city: 'Libreville',
    address: 'BP 50, Libreville',
    phone: '+241 01 76 23 97',
    email: 'contact@sante.gouv.ga'
  },
  {
    name: 'Ministère de l\'Éducation Nationale',
    code: 'MIN-EDU-NAT',
    type: 'MINISTRY',
    description: 'Ministère chargé de l\'enseignement primaire, secondaire et de l\'alphabétisation',
    city: 'Libreville',
    address: 'BP 6, Libreville',
    phone: '+241 01 72 35 55',
    email: 'contact@education.gouv.ga'
  },
  {
    name: 'Ministère des Transports',
    code: 'MIN-TRANSPORT',
    type: 'MINISTRY',
    description: 'Ministère chargé des infrastructures de transport terrestre, maritime et aérien',
    city: 'Libreville',
    address: 'BP 803, Libreville',
    phone: '+241 01 74 29 86',
    email: 'contact@transports.gouv.ga'
  },

  // PRÉFECTURES
  {
    name: 'Préfecture de l\'Estuaire',
    code: 'PREF-ESTUAIRE',
    type: 'PREFECTURE',
    description: 'Administration territoriale de la province de l\'Estuaire',
    city: 'Libreville',
    address: 'Boulevard de l\'Indépendance, Libreville',
    phone: '+241 01 72 13 45'
  },
  {
    name: 'Préfecture du Haut-Ogooué',
    code: 'PREF-HAUT-OGOOUE',
    type: 'PREFECTURE',
    description: 'Administration territoriale de la province du Haut-Ogooué',
    city: 'Franceville',
    address: 'Avenue Savorgnan de Brazza, Franceville',
    phone: '+241 02 67 25 14'
  },
  {
    name: 'Préfecture de l\'Ogooué-Maritime',
    code: 'PREF-OGOOUE-MAR',
    type: 'PREFECTURE',
    description: 'Administration territoriale de la province de l\'Ogooué-Maritime',
    city: 'Port-Gentil',
    address: 'Boulevard du Gouverneur Ballay, Port-Gentil',
    phone: '+241 05 55 26 73'
  },
  {
    name: 'Préfecture de la Ngounié',
    code: 'PREF-NGOUNIE',
    type: 'PREFECTURE',
    description: 'Administration territoriale de la province de la Ngounié',
    city: 'Mouila',
    address: 'Centre-ville, Mouila',
    phone: '+241 03 86 12 45'
  },
  {
    name: 'Préfecture du Woleu-Ntem',
    code: 'PREF-WOLEU-NTEM',
    type: 'PREFECTURE',
    description: 'Administration territoriale de la province du Woleu-Ntem',
    city: 'Oyem',
    address: 'Avenue de la République, Oyem',
    phone: '+241 04 98 27 35'
  },

  // MUNICIPALITÉS
  {
    name: 'Mairie de Libreville',
    code: 'MAIRIE-LIBREVILLE',
    type: 'MUNICIPALITY',
    description: 'Administration municipale de la capitale du Gabon',
    city: 'Libreville',
    address: 'Hôtel de Ville, Place de l\'Indépendance, Libreville',
    phone: '+241 01 72 10 65',
    email: 'contact@mairie-libreville.ga',
    website: 'https://www.libreville.ga'
  },
  {
    name: 'Mairie de Port-Gentil',
    code: 'MAIRIE-PORT-GENTIL',
    type: 'MUNICIPALITY',
    description: 'Administration municipale de la capitale économique',
    city: 'Port-Gentil',
    address: 'Hôtel de Ville, Port-Gentil',
    phone: '+241 05 55 23 87',
    email: 'contact@mairie-portgentil.ga'
  },
  {
    name: 'Mairie de Franceville',
    code: 'MAIRIE-FRANCEVILLE',
    type: 'MUNICIPALITY',
    description: 'Administration municipale de Franceville',
    city: 'Franceville',
    address: 'Hôtel de Ville, Franceville',
    phone: '+241 02 67 34 12',
    email: 'contact@mairie-franceville.ga'
  },
  {
    name: 'Mairie d\'Oyem',
    code: 'MAIRIE-OYEM',
    type: 'MUNICIPALITY',
    description: 'Administration municipale d\'Oyem',
    city: 'Oyem',
    address: 'Hôtel de Ville, Oyem',
    phone: '+241 04 98 15 73',
    email: 'contact@mairie-oyem.ga'
  },
  {
    name: 'Mairie de Mouila',
    code: 'MAIRIE-MOUILA',
    type: 'MUNICIPALITY',
    description: 'Administration municipale de Mouila',
    city: 'Mouila',
    address: 'Hôtel de Ville, Mouila',
    phone: '+241 03 86 28 94',
    email: 'contact@mairie-mouila.ga'
  },

  // AGENCES PUBLIQUES
  {
    name: 'Direction Générale de la Documentation et de l\'Immigration',
    code: 'DGDI',
    type: 'AGENCY',
    description: 'Organisme chargé des passeports, visas et cartes d\'identité',
    city: 'Libreville',
    address: 'Quartier Louis, Libreville',
    phone: '+241 01 73 25 94',
    email: 'contact@dgdi.ga'
  },
  {
    name: 'Caisse Nationale de Sécurité Sociale',
    code: 'CNSS',
    type: 'AGENCY',
    description: 'Organisme de protection sociale et de retraite',
    city: 'Libreville',
    address: 'Boulevard Triomphal Omar Bongo, Libreville',
    phone: '+241 01 76 42 85',
    email: 'contact@cnss.ga',
    website: 'https://www.cnss.ga'
  },
  {
    name: 'Office des Postes et Télécommunications',
    code: 'OPT',
    type: 'AGENCY',
    description: 'Opérateur public des télécommunications',
    city: 'Libreville',
    address: 'Avenue Colonel Parant, Libreville',
    phone: '+241 01 70 03 00',
    email: 'contact@opt.ga'
  },
  {
    name: 'Société d\'Énergie et d\'Eau du Gabon',
    code: 'SEEG',
    type: 'AGENCY',
    description: 'Distributeur d\'électricité et d\'eau potable',
    city: 'Libreville',
    address: 'BP 2187, Libreville',
    phone: '+241 01 76 14 58',
    email: 'contact@seeg.ga'
  },
  {
    name: 'Agence Nationale des Bourses du Gabon',
    code: 'ANBG',
    type: 'AGENCY',
    description: 'Organisme chargé de la gestion des bourses d\'études',
    city: 'Libreville',
    address: 'Quartier Batterie IV, Libreville',
    phone: '+241 01 44 35 27',
    email: 'contact@anbg.ga'
  },

  // DÉPARTEMENTS MINISTÉRIELS
  {
    name: 'Direction Générale des Impôts',
    code: 'DGI',
    type: 'DEPARTMENT',
    description: 'Direction chargée de la collecte des impôts et taxes',
    city: 'Libreville',
    address: 'BP 928, Libreville',
    phone: '+241 01 76 24 97',
    email: 'contact@impots.gouv.ga'
  },
  {
    name: 'Direction Générale des Douanes',
    code: 'DGD',
    type: 'DEPARTMENT',
    description: 'Direction chargée du contrôle douanier et du commerce extérieur',
    city: 'Libreville',
    address: 'Port MOL, Libreville',
    phone: '+241 01 70 24 55',
    email: 'contact@douanes.gouv.ga'
  },
  {
    name: 'Direction de la Police Nationale',
    code: 'DPN',
    type: 'DEPARTMENT',
    description: 'Direction nationale des forces de police',
    city: 'Libreville',
    address: 'Camp de Gaulle, Libreville',
    phone: '+241 01 72 35 68'
  },
  {
    name: 'Direction Générale de la Santé Publique',
    code: 'DGSP',
    type: 'DEPARTMENT',
    description: 'Direction chargée de la politique sanitaire nationale',
    city: 'Libreville',
    address: 'BP 50, Libreville',
    phone: '+241 01 76 28 74',
    email: 'contact@sante-publique.gouv.ga'
  },
  {
    name: 'Inspection Générale d\'État',
    code: 'IGE',
    type: 'DEPARTMENT',
    description: 'Corps de contrôle supérieur de l\'administration',
    city: 'Libreville',
    address: 'Présidence de la République, Libreville',
    phone: '+241 01 44 56 12'
  },

  // INSTITUTIONS PUBLIQUES
  {
    name: 'Centre Hospitalier Universitaire de Libreville',
    code: 'CHUL',
    type: 'PUBLIC_INSTITUTION',
    description: 'Principal hôpital de référence du Gabon',
    city: 'Libreville',
    address: 'BP 2228, Libreville',
    phone: '+241 01 76 22 78',
    email: 'contact@chul.ga'
  },
  {
    name: 'Université Omar Bongo',
    code: 'UOB',
    type: 'PUBLIC_INSTITUTION',
    description: 'Principale université publique du Gabon',
    city: 'Libreville',
    address: 'BP 13131, Libreville',
    phone: '+241 01 73 24 56',
    email: 'contact@univ-ob.ga',
    website: 'https://www.univ-ob.ga'
  },
  {
    name: 'École Nationale d\'Administration',
    code: 'ENA',
    type: 'PUBLIC_INSTITUTION',
    description: 'École de formation des cadres de l\'administration',
    city: 'Libreville',
    address: 'BP 1001, Libreville',
    phone: '+241 01 73 45 89',
    email: 'contact@ena.ga'
  },
  {
    name: 'Bibliothèque Nationale du Gabon',
    code: 'BNG',
    type: 'PUBLIC_INSTITUTION',
    description: 'Institution de conservation du patrimoine documentaire',
    city: 'Libreville',
    address: 'Quartier Louis, Libreville',
    phone: '+241 01 72 18 34',
    email: 'contact@bibliotheque-nationale.ga'
  },
  {
    name: 'Archives Nationales du Gabon',
    code: 'ANG',
    type: 'PUBLIC_INSTITUTION',
    description: 'Service de conservation des archives publiques',
    city: 'Libreville',
    address: 'BP 1188, Libreville',
    phone: '+241 01 73 42 67',
    email: 'contact@archives-nationales.ga'
  }
];

async function populateOrganizations() {
  console.log('🏛️ Début du peuplement des organismes gabonais...');

  try {
    // Vérifier si des organismes existent déjà
    const existingCount = await prisma.organization.count();

    if (existingCount > 0) {
      console.log(`⚠️  ${existingCount} organismes existent déjà. Suppression avant insertion...`);
      await prisma.organization.deleteMany({});
    }

    // Insérer les nouveaux organismes
    console.log(`📝 Insertion de ${ORGANISMES_GABONAIS.length} organismes...`);

    for (const org of ORGANISMES_GABONAIS) {
      await prisma.organization.create({
        data: {
          name: org.name,
          code: org.code,
          type: org.type,
          description: org.description,
          city: org.city,
          address: org.address,
          phone: org.phone,
          email: org.email || null,
          website: org.website || null,
          isActive: true
        }
      });

      console.log(`✅ ${org.name} (${org.code}) créé`);
    }

    // Statistiques finales
    const finalStats = await prisma.organization.groupBy({
      by: ['type'],
      _count: {
        type: true
      }
    });

    console.log('\n📊 Statistiques des organismes créés :');
    finalStats.forEach(stat => {
      console.log(`  - ${stat.type}: ${stat._count.type} organismes`);
    });

    const totalCount = await prisma.organization.count();
    console.log(`\n🎉 Peuplement terminé avec succès ! ${totalCount} organismes gabonais créés.`);

  } catch (error) {
    console.error('❌ Erreur lors du peuplement:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Exécution du script
if (require.main === module) {
  populateOrganizations()
    .then(() => {
      console.log('✨ Script de peuplement terminé !');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Échec du script:', error);
      process.exit(1);
    });
}

export { populateOrganizations, ORGANISMES_GABONAIS };
