/* @ts-nocheck */
// @ts-nocheck
import { PrismaClient } from '@prisma/client';
import { GABON_ADMINISTRATIVE_DATA, getAllAdministrations, getAllServices } from '../lib/data/gabon-administrations';

const prisma = new PrismaClient();

async function importGabonAdministrations() {
  console.log('🇬🇦 Importation des administrations gabonaises...');

  try {
    // 1. Importer toutes les organisations
    const administrations = getAllAdministrations();

    console.log(`📋 Importation de ${administrations.length} organisations...`);

    for (const admin of administrations) {
      try {
        const organization = await prisma.organization.upsert({
          where: { code: admin.code || admin.nom.replace(/\s+/g, '_').toUpperCase() },
          update: {
            name: admin.nom,
            type: admin.type as any,
            address: admin.localisation,
            isActive: true,
          },
          create: {
            code: admin.code || admin.nom.replace(/\s+/g, '_').toUpperCase(),
            name: admin.nom,
            type: admin.type as any,
            address: admin.localisation,
            phone: '+241 01 00 00 00', // Numéro générique
            email: `contact@${admin.code?.toLowerCase() || admin.nom.replace(/\s+/g, '-').toLowerCase()}.ga`,
            website: `https://www.${admin.code?.toLowerCase() || admin.nom.replace(/\s+/g, '-').toLowerCase()}.ga`,
            isActive: true,
          },
        });

        // 2. Créer les services de l'organisation
        for (const serviceName of admin.services) {
          await prisma.service.upsert({
            where: {
              organizationId_name: {
                organizationId: organization.id,
                name: serviceName,
              },
            },
            update: {
              description: `Service ${serviceName} de ${admin.nom}`,
              isActive: true,
            },
            create: {
              organizationId: organization.id,
              name: serviceName,
              description: `Service ${serviceName} de ${admin.nom}`,
              category: getServiceCategory(serviceName),
              estimatedDuration: getEstimatedDuration(serviceName),
              requiredDocuments: getRequiredDocuments(serviceName),
              cost: getServiceCost(serviceName),
              isOnline: true,
              isActive: true,
            },
          });
        }

        console.log(`✅ ${admin.nom} - ${admin.services.length} services`);
      } catch (error) {
        console.error(`❌ Erreur pour ${admin.nom}:`, error);
      }
    }

    // 3. Créer les statistiques de structure administrative
    await createAdministrativeStructureStats();

    console.log('🎉 Importation terminée avec succès !');
    console.log(`📊 Total: ${administrations.length} organisations importées`);

  } catch (error) {
    console.error('💥 Erreur lors de l\'importation:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Utilitaires pour déterminer les propriétés des services
function getServiceCategory(serviceName: string): string {
  const service = serviceName.toLowerCase();

  if (service.includes('acte') || service.includes('état civil') || service.includes('naissance') || service.includes('mariage') || service.includes('décès')) {
    return 'etat_civil';
  }
  if (service.includes('carte') || service.includes('passeport') || service.includes('identité') || service.includes('permis de conduire')) {
    return 'identite';
  }
  if (service.includes('casier') || service.includes('certificat de nationalité') || service.includes('légalisation')) {
    return 'judiciaire';
  }
  if (service.includes('permis de construire') || service.includes('autorisation de commerce') || service.includes('résidence')) {
    return 'municipaux';
  }
  if (service.includes('cnss') || service.includes('cnamgs') || service.includes('chômage') || service.includes('pension')) {
    return 'sociaux';
  }
  if (service.includes('registre de commerce') || service.includes('licence') || service.includes('autorisation d\'exercice')) {
    return 'professionnels';
  }
  if (service.includes('fiscal') || service.includes('déclaration') || service.includes('impôt') || service.includes('quitus')) {
    return 'fiscaux';
  }

  return 'autres';
}

function getEstimatedDuration(serviceName: string): number {
  const service = serviceName.toLowerCase();

  // Services rapides (même jour)
  if (service.includes('certificat') && !service.includes('médical')) {
    return 1;
  }

  // Services d'état civil (2-3 jours)
  if (service.includes('acte') || service.includes('état civil')) {
    return 3;
  }

  // Documents d'identité (1-2 semaines)
  if (service.includes('carte') || service.includes('passeport') || service.includes('permis')) {
    return 10;
  }

  // Autorisations et permis (1-4 semaines)
  if (service.includes('autorisation') || service.includes('permis') || service.includes('licence')) {
    return 14;
  }

  // Services complexes (1-2 mois)
  if (service.includes('registre') || service.includes('concession') || service.includes('titre foncier')) {
    return 30;
  }

  return 7; // Par défaut: 1 semaine
}

function getRequiredDocuments(serviceName: string): string[] {
  const service = serviceName.toLowerCase();
  const baseDocuments = ['Pièce d\'identité', 'Photo d\'identité'];

  if (service.includes('acte de naissance')) {
    return [...baseDocuments, 'Déclaration de naissance', 'Certificat médical de naissance'];
  }

  if (service.includes('acte de mariage')) {
    return [...baseDocuments, 'Certificat de célibat', 'Acte de naissance des époux', 'Témoins'];
  }

  if (service.includes('passeport')) {
    return [...baseDocuments, 'Acte de naissance', 'Certificat de nationalité', 'Justificatif de domicile'];
  }

  if (service.includes('permis de conduire')) {
    return [...baseDocuments, 'Certificat médical', 'Attestation de formation', 'Justificatif de domicile'];
  }

  if (service.includes('permis de construire')) {
    return ['Plan architectural', 'Titre foncier', 'Étude de sol', 'Autorisation d\'urbanisme'];
  }

  return baseDocuments;
}

function getServiceCost(serviceName: string): number {
  const service = serviceName.toLowerCase();

  // Services gratuits
  if (service.includes('certificat de vie') || service.includes('certificat de résidence')) {
    return 0;
  }

  // Services d'état civil (tarifs modérés)
  if (service.includes('acte')) {
    return 2000; // 2000 FCFA
  }

  // Documents d'identité
  if (service.includes('carte nationale')) {
    return 5000;
  }

  if (service.includes('passeport')) {
    return 25000;
  }

  if (service.includes('permis de conduire')) {
    return 15000;
  }

  // Autorisations et permis
  if (service.includes('permis de construire')) {
    return 50000;
  }

  if (service.includes('registre de commerce')) {
    return 30000;
  }

  return 5000; // Tarif par défaut
}

async function createAdministrativeStructureStats() {
  const stats = GABON_ADMINISTRATIVE_DATA.structure_administrative;

  // Créer un enregistrement pour les statistiques administratives
  await prisma.analytics.upsert({
    where: {
      id: 'gabon-admin-stats'
    },
    update: {
      data: {
        provinces: stats.provinces,
        departements: stats.departements,
        communes: stats.communes,
        districts: stats.districts,
        cantons: stats.cantons,
        regroupements_villages: stats.regroupements_villages,
        villages: stats.villages,
        date_mise_a_jour: GABON_ADMINISTRATIVE_DATA.date_mise_a_jour,
      } as any,
    },
    create: {
      id: 'gabon-admin-stats',
      type: 'ADMINISTRATIVE_STRUCTURE',
      data: {
        provinces: stats.provinces,
        departements: stats.departements,
        communes: stats.communes,
        districts: stats.districts,
        cantons: stats.cantons,
        regroupements_villages: stats.regroupements_villages,
        villages: stats.villages,
        date_mise_a_jour: GABON_ADMINISTRATIVE_DATA.date_mise_a_jour,
      } as any,
    },
  });

  console.log('📈 Statistiques de la structure administrative créées');
}

// Exécuter le script si appelé directement
if (require.main === module) {
  importGabonAdministrations()
    .then(() => {
      console.log('✨ Script terminé avec succès');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Erreur fatale:', error);
      process.exit(1);
    });
}

export { importGabonAdministrations };
