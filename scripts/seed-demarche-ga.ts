#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { organismes, servicesGabon } from '../lib/data/services-gabon-demarche'

const prisma = new PrismaClient()

async function seedDemarcheGA() {
  console.log('🌱 Début du seed pour DEMARCHE.GA...')

  try {
    // 1. Créer ou mettre à jour les organismes
    console.log('📋 Création des organismes...')
    const organismeMap = new Map<string, string>()

    for (const orgData of organismes) {
      const organisme = await prisma.organization.upsert({
        where: { code: orgData.code },
        update: {
          name: orgData.nom,
          type: orgData.type,
          organismeType: orgData.organismeType,
          description: orgData.description,
          address: orgData.adresse,
          city: orgData.ville,
          phone: orgData.telephone,
          email: orgData.email,
          website: orgData.siteWeb,
          isActive: true
        },
        create: {
          code: orgData.code,
          name: orgData.nom,
          type: orgData.type,
          organismeType: orgData.organismeType,
          description: orgData.description,
          address: orgData.adresse,
          city: orgData.ville,
          phone: orgData.telephone,
          email: orgData.email,
          website: orgData.siteWeb,
          isActive: true
        }
      })

      organismeMap.set(orgData.code, organisme.id)
      console.log(`✅ Organisme créé/mis à jour: ${orgData.nom}`)
    }

    // 2. Créer les services
    console.log('🛠️ Création des services...')
    for (const serviceData of servicesGabon) {
      const organismeId = organismeMap.get(serviceData.organismeCode)

      if (!organismeId) {
        console.warn(`⚠️ Organisme ${serviceData.organismeCode} non trouvé pour le service ${serviceData.nom}`)
        continue
      }

      await prisma.service.upsert({
        where: { code: serviceData.code },
        update: {
          nom: serviceData.nom,
          description: serviceData.description,
          category: serviceData.category,
          cout: serviceData.cout,
          dureeEstimee: serviceData.dureeEstimee,
          documentsRequis: serviceData.documentsRequis,
          procedure: serviceData.procedure,
          isActive: true,
          organismeId
        },
        create: {
          code: serviceData.code,
          nom: serviceData.nom,
          description: serviceData.description,
          category: serviceData.category,
          cout: serviceData.cout,
          dureeEstimee: serviceData.dureeEstimee,
          documentsRequis: serviceData.documentsRequis,
          procedure: serviceData.procedure,
          isActive: true,
          organismeId
        }
      })

      console.log(`✅ Service créé/mis à jour: ${serviceData.nom}`)
    }

    // 3. Créer des utilisateurs de test
    console.log('👥 Création des utilisateurs de test...')

    // Mot de passe par défaut pour tous les comptes de test
    const defaultPassword = await bcrypt.hash('Test123!', 12)

    // Super Admin
    await prisma.user.upsert({
      where: { email: 'admin@demarche.ga' },
      update: {},
      create: {
        email: 'admin@demarche.ga',
        firstName: 'Super',
        lastName: 'ADMIN',
        password: defaultPassword,
        userRole: 'SUPER_ADMIN',
        isActive: true,
        isVerified: true
      }
    })
    console.log('✅ Super Admin créé: admin@demarche.ga')

    // Administrateurs d'organismes
    const adminOrganismes = [
      { organisme: 'DGDI', email: 'admin@dgdi.ga', prenom: 'Directeur', nom: 'DGDI' },
      { organisme: 'DGI', email: 'admin@dgi.ga', prenom: 'Directeur', nom: 'DGI' },
      { organisme: 'CNSS', email: 'admin@cnss.ga', prenom: 'Directeur', nom: 'CNSS' },
      { organisme: 'CNAMGS', email: 'admin@cnamgs.ga', prenom: 'Directeur', nom: 'CNAMGS' },
      { organisme: 'MAIRIE_LBV', email: 'admin@mairie-libreville.ga', prenom: 'Maire', nom: 'LIBREVILLE' }
    ]

    for (const admin of adminOrganismes) {
      const organismeId = organismeMap.get(admin.organisme)
      if (organismeId) {
        await prisma.user.upsert({
          where: { email: admin.email },
          update: {},
          create: {
            email: admin.email,
            firstName: admin.prenom,
            lastName: admin.nom,
            password: defaultPassword,
            userRole: 'ADMIN',
            primaryOrganizationId: organismeId,
            isActive: true,
            isVerified: true
          }
        })
        console.log(`✅ Admin ${admin.organisme} créé: ${admin.email}`)
      }
    }

    // Agents
    const agents = [
      { organisme: 'DGDI', email: 'agent1@dgdi.ga', prenom: 'Marie Claire', nom: 'AKOMO' },
      { organisme: 'DGDI', email: 'agent2@dgdi.ga', prenom: 'Paul Henri', nom: 'MBENG' },
      { organisme: 'DGI', email: 'agent1@dgi.ga', prenom: 'Sophie', nom: 'NZAMBA' },
      { organisme: 'CNSS', email: 'agent1@cnss.ga', prenom: 'Michel', nom: 'OBAME' },
      { organisme: 'MAIRIE_LBV', email: 'agent1@mairie-libreville.ga', prenom: 'Sylvie', nom: 'MBOUMBA' }
    ]

    for (const agent of agents) {
      const organismeId = organismeMap.get(agent.organisme)
      if (organismeId) {
        await prisma.user.upsert({
          where: { email: agent.email },
          update: {},
          create: {
            email: agent.email,
            firstName: agent.prenom,
            lastName: agent.nom,
            password: defaultPassword,
            userRole: 'AGENT',
            primaryOrganizationId: organismeId,
            isActive: true,
            isVerified: true
          }
        })
        console.log(`✅ Agent ${agent.organisme} créé: ${agent.email}`)
      }
    }

    // Citoyens de test
    const citoyens = [
      { email: 'citoyen1@exemple.com', prenom: 'Jean Pierre', nom: 'MVENG' },
      { email: 'citoyen2@exemple.com', prenom: 'Sarah', nom: 'NDONG' },
      { email: 'citoyen3@exemple.com', prenom: 'Michel', nom: 'OBAME' },
      { email: 'citoyen4@exemple.com', prenom: 'Fatou', nom: 'DIALLO' },
      { email: 'citoyen5@exemple.com', prenom: 'André', nom: 'BONGO' }
    ]

    for (const citoyen of citoyens) {
      await prisma.user.upsert({
        where: { email: citoyen.email },
        update: {},
        create: {
          email: citoyen.email,
          firstName: citoyen.prenom,
          lastName: citoyen.nom,
          password: defaultPassword,
          userRole: 'CITOYEN',
          phone: `+241 06 ${Math.floor(Math.random() * 90) + 10} ${Math.floor(Math.random() * 90) + 10} ${Math.floor(Math.random() * 90) + 10}`,
          ville: 'Libreville',
          province: 'Estuaire',
          isActive: true,
          isVerified: true
        }
      })
      console.log(`✅ Citoyen créé: ${citoyen.email}`)
    }

    // 4. Créer quelques démarches d'exemple
    console.log('📄 Création de démarches d\'exemple...')

    const citoyenTest = await prisma.user.findFirst({
      where: { email: 'citoyen1@exemple.com' }
    })

    const serviceCNI = await prisma.service.findFirst({
      where: { code: 'CNI_PREMIERE' }
    })

    const servicePasseport = await prisma.service.findFirst({
      where: { code: 'PASSEPORT_BIOMETRIQUE' }
    })

    if (citoyenTest && serviceCNI) {
      await prisma.demarche.create({
        data: {
          numero: 'DEM-2025-000001',
          status: 'EN_TRAITEMENT',
          citoyenId: citoyenTest.id,
          serviceId: serviceCNI.id,
          organismeId: serviceCNI.organismeId,
          donneesFormulaire: {
            nom: citoyenTest.lastName,
            prenom: citoyenTest.firstName,
            dateNaissance: '1985-03-15',
            lieuNaissance: 'Libreville',
            profession: 'Ingénieur'
          },
          dateSoumission: new Date('2025-01-10'),
          dateExpiration: new Date('2025-02-10')
        }
      })
      console.log('✅ Démarche CNI créée')
    }

    if (citoyenTest && servicePasseport) {
      await prisma.demarche.create({
        data: {
          numero: 'DEM-2025-000002',
          status: 'SOUMISE',
          citoyenId: citoyenTest.id,
          serviceId: servicePasseport.id,
          organismeId: servicePasseport.organismeId,
          donneesFormulaire: {
            nom: citoyenTest.lastName,
            prenom: citoyenTest.firstName,
            motifVoyage: 'Tourisme',
            destination: 'France'
          },
          dateSoumission: new Date('2025-01-15'),
          dateExpiration: new Date('2025-03-15')
        }
      })
      console.log('✅ Démarche Passeport créée')
    }

    console.log('🎉 Seed DEMARCHE.GA terminé avec succès!')
    console.log('\n📋 Comptes de test créés:')
    console.log('Super Admin: admin@demarche.ga (mot de passe: Test123!)')
    console.log('Admin DGDI: admin@dgdi.ga (mot de passe: Test123!)')
    console.log('Agent DGDI: agent1@dgdi.ga (mot de passe: Test123!)')
    console.log('Citoyen: citoyen1@exemple.com (mot de passe: Test123!)')
    console.log('\n🔗 Vous pouvez maintenant tester DEMARCHE.GA!')

  } catch (error) {
    console.error('❌ Erreur lors du seed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Exécution du script
if (require.main === module) {
  seedDemarcheGA()
    .then(() => {
      console.log('✅ Script de seed terminé')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Erreur fatale:', error)
      process.exit(1)
    })
}

export { seedDemarcheGA }
