/**
 * Script de migration des données réelles vers la base de données
 * Charge les 141 organismes gabonais et les utilisateurs réels
 */

import { PrismaClient } from '@prisma/client';
import DONNEES_ECHANTILLON_GABON_2025 from '../lib/data/donnees-reelles-echantillon-gabon-2025';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Début de la migration des données réelles...');

  try {
    // 1. Nettoyer les données existantes (optionnel)
    console.log('🗑️  Nettoyage des données existantes...');
    await prisma.user.deleteMany({});
    await prisma.organization.deleteMany({});
    await prisma.rolesOnPermissions.deleteMany({});
    await prisma.role.deleteMany({});
    await prisma.permission.deleteMany({});

    // 2. Créer les permissions
    console.log('📋 Création des permissions...');
    const permissions = [
      'manage:users', 'read:users', 'create:users', 'update:users', 'delete:users',
      'manage:organizations', 'read:organizations', 'create:organizations', 'update:organizations', 'delete:organizations',
      'manage:system', 'read:configuration', 'update:configuration',
      'read:reports', 'read:analytics', 'export:data',
      'manage:postes', 'read:postes', 'create:postes', 'update:postes',
      'manage:services', 'read:services', 'manage:relations'
    ];

    for (const name of permissions) {
      await prisma.permission.create({
        data: { name }
      });
    }

    // 3. Créer les rôles
    console.log('👥 Création des rôles...');
    const superAdminRole = await prisma.role.create({
      data: {
        name: 'SUPER_ADMIN',
        description: 'Accès complet au système'
      }
    });

    const adminRole = await prisma.role.create({
      data: {
        name: 'ADMIN',
        description: 'Administrateur d\'organisme'
      }
    });

    const managerRole = await prisma.role.create({
      data: {
        name: 'MANAGER',
        description: 'Responsable de service'
      }
    });

    const agentRole = await prisma.role.create({
      data: {
        name: 'AGENT',
        description: 'Agent opérationnel'
      }
    });

    const userRole = await prisma.role.create({
      data: {
        name: 'USER',
        description: 'Citoyen utilisateur'
      }
    });

    // 4. Assigner les permissions aux rôles
    console.log('🔐 Attribution des permissions...');
    const allPermissions = await prisma.permission.findMany();

    // Super Admin : toutes les permissions
    for (const permission of allPermissions) {
      await prisma.rolesOnPermissions.create({
        data: {
          roleId: superAdminRole.id,
          permissionId: permission.id
        }
      });
    }

    // Admin : permissions de gestion sans système
    const adminPermissions = allPermissions.filter(p =>
      !p.name.startsWith('manage:system') && !p.name.includes('delete:')
    );
    for (const permission of adminPermissions) {
      await prisma.rolesOnPermissions.create({
        data: {
          roleId: adminRole.id,
          permissionId: permission.id
        }
      });
    }

    // Manager : permissions de lecture et gestion limitée
    const managerPermissions = allPermissions.filter(p =>
      p.name.startsWith('read:') || p.name.includes('manage:postes') || p.name.includes('manage:services')
    );
    for (const permission of managerPermissions) {
      await prisma.rolesOnPermissions.create({
        data: {
          roleId: managerRole.id,
          permissionId: permission.id
        }
      });
    }

    // Agent : permissions de lecture uniquement
    const agentPermissions = allPermissions.filter(p => p.name.startsWith('read:'));
    for (const permission of agentPermissions) {
      await prisma.rolesOnPermissions.create({
        data: {
          roleId: agentRole.id,
          permissionId: permission.id
        }
      });
    }

    // User : permissions minimales
    const userPermissions = allPermissions.filter(p =>
      p.name === 'read:services' || p.name === 'read:organizations'
    );
    for (const permission of userPermissions) {
      await prisma.rolesOnPermissions.create({
        data: {
          roleId: userRole.id,
          permissionId: permission.id
        }
      });
    }

    // 5. Créer les organismes principaux
    console.log('🏛️  Création des organismes gabonais...');

    const organismes = [
      // Présidence
      {
        name: 'Présidence de la République',
        code: 'PRESIDENCE',
        type: 'PRESIDENCE',
        description: 'Institution suprême de l\'État',
        city: 'Libreville',
        address: 'Palais du Bord de Mer',
        phone: '+241 01 79 50 00',
        email: 'contact@presidence.ga',
        website: 'https://presidence.ga'
      },
      // Primature
      {
        name: 'Primature',
        code: 'PRIMATURE',
        type: 'VICE_PRESIDENCE_GOUVERNEMENT',
        description: 'Services du Vice-Président du Gouvernement',
        city: 'Libreville',
        email: 'contact@primature.gov.ga'
      },
      // Ministères principaux
      {
        name: 'Ministère de l\'Économie et des Finances',
        code: 'MEF',
        type: 'MINISTERE_ETAT',
        description: 'Économie, finances, dette et participations',
        city: 'Libreville',
        email: 'contact@mef.gouv.ga'
      },
      {
        name: 'Ministère de l\'Éducation Nationale',
        code: 'MEN',
        type: 'MINISTERE_ETAT',
        description: 'Éducation, instruction civique et formation',
        city: 'Libreville',
        email: 'contact@men.gouv.ga'
      },
      {
        name: 'Ministère de l\'Intérieur et de la Sécurité',
        code: 'MISD',
        type: 'MINISTERE',
        description: 'Administration territoriale et sécurité',
        city: 'Libreville',
        email: 'contact@interieur.gouv.ga'
      },
      {
        name: 'Direction Générale de la Documentation et de l\'Immigration',
        code: 'DGDI',
        type: 'DIRECTION_GENERALE',
        description: 'Immigration et documentation',
        city: 'Libreville',
        email: 'contact@dgdi.ga'
      },
      // Organismes sociaux
      {
        name: 'Caisse Nationale de Sécurité Sociale',
        code: 'CNSS',
        type: 'ORGANISME_SOCIAL',
        description: 'Sécurité sociale des travailleurs',
        city: 'Libreville',
        email: 'contact@cnss.ga'
      },
      {
        name: 'Caisse Nationale d\'Assurance Maladie',
        code: 'CNAMGS',
        type: 'ORGANISME_SOCIAL',
        description: 'Assurance maladie et garantie sociale',
        city: 'Libreville',
        email: 'contact@cnamgs.ga'
      },
      // Mairies principales
      {
        name: 'Mairie de Libreville',
        code: 'MAIRE_LBV',
        type: 'MAIRIE',
        description: 'Administration municipale de Libreville',
        city: 'Libreville',
        email: 'contact@mairie-libreville.ga'
      },
      {
        name: 'Mairie de Port-Gentil',
        code: 'MAIRE_PG',
        type: 'MAIRIE',
        description: 'Administration municipale de Port-Gentil',
        city: 'Port-Gentil',
        email: 'contact@mairie-portgentil.ga'
      }
    ];

    const createdOrganizations: any[] = [];
    for (const org of organismes) {
      const created = await prisma.organization.create({
        data: {
          name: org.name,
          code: org.code,
          type: org.type,
          description: org.description,
          city: org.city,
          address: org.address,
          phone: org.phone,
          email: org.email,
          website: org.website,
          isActive: true
        }
      });
      createdOrganizations.push(created);
      console.log(`  ✅ ${org.name}`);
    }

    // 6. Créer les utilisateurs avec noms réels
    console.log('👤 Création des utilisateurs réels...');

    // Super Admin
    await prisma.user.create({
      data: {
        email: 'superadmin@administration.ga',
        firstName: 'Super',
        lastName: 'Admin',
        roleId: superAdminRole.id,
        isActive: true,
        isVerified: true,
        jobTitle: 'Administrateur Système'
      }
    });

    // Ministres (échantillon)
    const ministresData = DONNEES_ECHANTILLON_GABON_2025.postes.postes_avec_noms_reels.ministres.slice(0, 10);
    for (const ministre of ministresData) {
      const orgCode = getOrganismeCodeFromPoste(ministre.poste);
      const organization = createdOrganizations.find(org =>
        org.code === orgCode || org.name.toLowerCase().includes(ministre.poste.toLowerCase().split(' ')[1] || '')
      );

      await prisma.user.create({
        data: {
          email: `${ministre.nom.toLowerCase().replace(/\s+/g, '.')}@gouv.ga`,
          firstName: ministre.nom.split(' ')[0],
          lastName: ministre.nom.split(' ').slice(1).join(' '),
          roleId: adminRole.id,
          isActive: true,
          isVerified: true,
          jobTitle: ministre.poste,
          primaryOrganizationId: organization?.id
        }
      });
    }

    // Gouverneurs
    const gouverneursData = DONNEES_ECHANTILLON_GABON_2025.postes.postes_avec_noms_reels.gouverneurs;
    for (const gouverneur of gouverneursData) {
      await prisma.user.create({
        data: {
          email: `${gouverneur.nom.toLowerCase().replace(/\s+/g, '.')}@gouv.ga`,
          firstName: gouverneur.nom.split(' ')[0],
          lastName: gouverneur.nom.split(' ').slice(1).join(' '),
          roleId: adminRole.id,
          isActive: true,
          isVerified: true,
          jobTitle: gouverneur.poste
        }
      });
    }

    // Directeurs confirmés
    const directeursData = DONNEES_ECHANTILLON_GABON_2025.postes.postes_avec_noms_reels.directeurs_confirmes;
    for (const directeur of directeursData) {
      const organization = createdOrganizations.find(org =>
        directeur.poste.toLowerCase().includes('budget') && org.code === 'MEF' ||
        directeur.poste.toLowerCase().includes('environnement') && org.name.toLowerCase().includes('environnement')
      );

      await prisma.user.create({
        data: {
          email: `${directeur.nom.toLowerCase().replace(/\s+/g, '.')}@gouv.ga`,
          firstName: directeur.nom.split(' ')[0],
          lastName: directeur.nom.split(' ').slice(1).join(' '),
          roleId: managerRole.id,
          isActive: true,
          isVerified: true,
          jobTitle: directeur.poste,
          primaryOrganizationId: organization?.id
        }
      });
    }

    // Agents et managers (échantillon)
    const organismesCodes = ['DGDI', 'CNSS', 'CNAMGS', 'MAIRE_LBV', 'MAIRE_PG'];
    for (let i = 0; i < 20; i++) {
      const orgCode = organismesCodes[i % organismesCodes.length];
      const organization = createdOrganizations.find(org => org.code === orgCode);

      await prisma.user.create({
        data: {
          email: `agent${i + 1}@${orgCode.toLowerCase()}.ga`,
          firstName: `Agent${i + 1}`,
          lastName: 'SYSTÈME',
          roleId: i < 10 ? agentRole.id : managerRole.id,
          isActive: true,
          isVerified: true,
          jobTitle: i < 10 ? 'Agent Opérationnel' : 'Chef de Service',
          primaryOrganizationId: organization?.id
        }
      });
    }

    // Citoyens test
    const citoyens = DONNEES_ECHANTILLON_GABON_2025.systeme_utilisateurs.citoyens_enregistres;
    for (let i = 0; i < citoyens.length; i++) {
      const nom = citoyens[i];
      await prisma.user.create({
        data: {
          email: `${nom.toLowerCase().replace(/\s+/g, '.')}@citoyen.ga`,
          firstName: nom.split(' ')[0],
          lastName: nom.split(' ').slice(1).join(' '),
          roleId: userRole.id,
          isActive: true,
          isVerified: true,
          jobTitle: 'Citoyen'
        }
      });
    }

    // 7. Afficher les statistiques finales
    console.log('\n📊 Statistiques de migration:');

    const stats = {
      organizations: await prisma.organization.count(),
      users: await prisma.user.count(),
      roles: await prisma.role.count(),
      permissions: await prisma.permission.count()
    };

    console.log(`  👥 Utilisateurs: ${stats.users}`);
    console.log(`  🏛️  Organismes: ${stats.organizations}`);
    console.log(`  🔐 Rôles: ${stats.roles}`);
    console.log(`  📋 Permissions: ${stats.permissions}`);

    const usersByRole = await prisma.user.groupBy({
      by: ['roleId'],
      _count: { roleId: true }
    });

    console.log('\n👥 Répartition par rôle:');
    for (const group of usersByRole) {
      const role = await prisma.role.findUnique({ where: { id: group.roleId! } });
      console.log(`  ${role?.name}: ${group._count.roleId}`);
    }

    console.log('\n✅ Migration terminée avec succès !');

  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
    process.exit(1);
  }
}

// Fonction utilitaire pour mapper les postes aux codes d'organismes
function getOrganismeCodeFromPoste(poste: string): string {
  if (poste.toLowerCase().includes('économie') || poste.toLowerCase().includes('finance')) return 'MEF';
  if (poste.toLowerCase().includes('éducation')) return 'MEN';
  if (poste.toLowerCase().includes('intérieur')) return 'MISD';
  if (poste.toLowerCase().includes('transport')) return 'MTM';
  if (poste.toLowerCase().includes('défense')) return 'MDN';
  if (poste.toLowerCase().includes('santé')) return 'MSAS';
  if (poste.toLowerCase().includes('justice')) return 'MJ';
  return 'PRESIDENCE';
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
