#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client';
import { getAllServices, getOrganismeMapping } from '../lib/data/gabon-services-detailles';
import { getAllAdministrations } from '../lib/data/gabon-administrations';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Début de l\'importation des 558 services du Gabon...');

  try {
    // 1. Récupérer tous les services depuis le fichier
    const allServices = getAllServices();
    const organismeMapping = getOrganismeMapping();

    console.log(`📊 ${allServices.length} services trouvés dans les données`);

    // 2. Créer un mapping des codes organismes vers les IDs en base
    const organismeMap = new Map<string, string>();

    for (const [organismeCode, organismeInfo] of Object.entries(organismeMapping)) {
            // Chercher l'organisme dans notre configuration
      const allAdministrations = getAllAdministrations();
      const organisme = allAdministrations.find(admin =>
        admin.code === organismeCode ||
        admin.nom.toLowerCase().includes(organismeInfo.nom.toLowerCase().substring(0, 10))
      );

      if (organisme) {
        // Créer ou trouver l'organisme en base
        let orgInDb = await prisma.organization.findFirst({
          where: { code: organisme.code }
        });

        if (!orgInDb) {
          orgInDb = await prisma.organization.create({
            data: {
              name: organisme.nom,
              code: organisme.code,
              type: organisme.type as any,
              description: organisme.services?.join(', ') || 'Services administratifs',
              isActive: true,
              workingHours: {},
              address: organisme.localisation || '',
              phone: '',
              email: '',
            }
          });
        }

        organismeMap.set(organismeCode, orgInDb.id);
        console.log(`✅ Organisme mappé: ${organismeCode} -> ${orgInDb.name}`);
      } else {
        console.warn(`⚠️ Organisme non trouvé: ${organismeCode} (${organismeInfo.nom})`);
      }
    }

    // 3. Importer tous les services
    let importedCount = 0;
    let skippedCount = 0;

    for (const service of allServices) {
      const organizationId = organismeMap.get(service.organisme_responsable);

      if (!organizationId) {
        console.warn(`⚠️ Service ignoré (organisme non trouvé): ${service.nom} - ${service.organisme_responsable}`);
        skippedCount++;
        continue;
      }

      // Vérifier si le service existe déjà
      const existingService = await prisma.serviceConfig.findFirst({
        where: {
          organizationId,
          serviceType: service.code as any
        }
      });

      if (existingService) {
        console.log(`🔄 Service existe déjà: ${service.nom}`);
        skippedCount++;
        continue;
      }

      // Mapper les coûts
      const parseCost = (cout: string): number => {
        if (cout.toLowerCase().includes('gratuit')) return 0;
        const numbers = cout.match(/\d+/g);
        if (numbers && numbers.length > 0) {
          return parseInt(numbers[0]);
        }
        return 0;
      };

      // Mapper les délais en jours
      const parseDelai = (delai: string): number => {
        if (delai.toLowerCase().includes('immédiat')) return 0;
        if (delai.includes('24-48 heures')) return 2;
        if (delai.includes('7-15 jours')) return 10;
        if (delai.includes('15-30 jours')) return 22;
        if (delai.includes('30-45 jours')) return 37;
        if (delai.includes('2-3 mois')) return 75;
        if (delai.includes('3-6 mois')) return 135;
        if (delai.includes('6-12 mois')) return 270;
        return 7; // défaut
      };

      try {
        await prisma.serviceConfig.create({
          data: {
            organizationId,
            serviceType: service.code as any,
            isActive: true,
            processingDays: parseDelai(service.delai_traitement),
            requiredDocs: service.documents_requis.map(doc => {
              const cleanDoc = doc.toUpperCase().replace(/[^A-Z_]/g, '_');
              // Mapper vers les types DocumentType disponibles
              if (cleanDoc.includes('PHOTO') || cleanDoc.includes('IDENTITE')) return 'PHOTO_IDENTITE';
              if (cleanDoc.includes('NAISSANCE')) return 'ACTE_NAISSANCE';
              if (cleanDoc.includes('DOMICILE') || cleanDoc.includes('RESIDENCE')) return 'JUSTIFICATIF_DOMICILE';
              if (cleanDoc.includes('DIPLOME')) return 'DIPLOME';
              if (cleanDoc.includes('TRAVAIL') || cleanDoc.includes('EMPLOI')) return 'ATTESTATION_TRAVAIL';
              if (cleanDoc.includes('CASIER') || cleanDoc.includes('JUDICIAIRE')) return 'CASIER_JUDICIAIRE';
              if (cleanDoc.includes('MEDICAL')) return 'CERTIFICAT_MEDICAL';
              if (cleanDoc.includes('MARIAGE')) return 'ACTE_MARIAGE';
              if (cleanDoc.includes('CNI')) return 'CNI_RECTO';
              if (cleanDoc.includes('PASSEPORT')) return 'PASSEPORT';
              if (cleanDoc.includes('PERMIS')) return 'PERMIS_CONDUIRE';
              // Par défaut, utiliser PHOTO_IDENTITE
              return 'PHOTO_IDENTITE';
            }),
            description: service.nom,
            instructions: service.documents_requis.join(', '),
            cost: parseCost(service.cout),
            slaHours: parseDelai(service.delai_traitement) * 24,
            autoAssign: false,
            requiresAppointment: service.cout !== 'Gratuit', // Services payants nécessitent RDV
            formSchema: {
              title: service.nom,
              description: `Demande de ${service.nom.toLowerCase()}`,
              fields: [
                {
                  name: 'motif',
                  label: 'Motif de la demande',
                  type: 'text',
                  required: true
                },
                {
                  name: 'urgence',
                  label: 'Caractère urgent',
                  type: 'boolean',
                  required: false
                },
                ...service.documents_requis.map((doc, idx) => ({
                  name: `document_${idx}`,
                  label: doc,
                  type: 'file',
                  required: true
                }))
              ]
            }
          }
        });

        importedCount++;
        console.log(`✅ Service importé: ${service.nom} (${service.organisme_responsable})`);
      } catch (error) {
        console.error(`❌ Erreur lors de l'importation de ${service.nom}:`, error);
        skippedCount++;
      }
    }

    console.log('\n📈 Résumé de l\'importation:');
    console.log(`✅ Services importés: ${importedCount}`);
    console.log(`⚠️ Services ignorés: ${skippedCount}`);
    console.log(`📊 Total traité: ${importedCount + skippedCount}/${allServices.length}`);

    // 4. Statistiques finales
    const totalServicesInDb = await prisma.serviceConfig.count();
    console.log(`🎯 Total services en base: ${totalServicesInDb}`);

  } catch (error) {
    console.error('❌ Erreur lors de l\'importation:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Fonction utilitaire pour nettoyer les services existants (optionnel)
async function cleanExistingServices() {
  console.log('🧹 Nettoyage des services existants...');
  const deleted = await prisma.serviceConfig.deleteMany({});
  console.log(`🗑️ ${deleted.count} services supprimés`);
}

// Exécuter le script
if (require.main === module) {
  main().catch(console.error);
}

export { main as importAllServices, cleanExistingServices };
