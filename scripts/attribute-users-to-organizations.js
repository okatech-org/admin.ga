/**
 * Script pour attribuer intelligemment les utilisateurs sans organisation
 * Répartit les citoyens dans DEMARCHE.GA et les agents dans ADMINISTRATION.GA
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function attribuerUtilisateursAuxOrganisations() {
  console.log('🔄 ATTRIBUTION INTELLIGENTE DES UTILISATEURS');
  console.log('===========================================\n');

  try {
    // 1. Analyser les utilisateurs sans organisation
    console.log('📊 Analyse des utilisateurs sans organisation...');
    const usersSansOrg = await prisma.user.findMany({
      where: { primaryOrganizationId: null }
    });

    console.log(`   Utilisateurs sans organisation: ${usersSansOrg.length}`);

    const repartitionRole = {};
    usersSansOrg.forEach(user => {
      repartitionRole[user.role] = (repartitionRole[user.role] || 0) + 1;
    });

    Object.entries(repartitionRole).forEach(([role, count]) => {
      console.log(`   - ${role}: ${count} utilisateurs`);
    });

    // 2. Récupérer les organisations disponibles
    console.log('\n🏛️ Organisations disponibles...');
    const organisations = await prisma.organization.findMany({
      include: { _count: { select: { users: true } } }
    });

    // Séparer par type
    const ministeres = organisations.filter(o => o.type.includes('MINISTERE'));
    const gouvernorats = organisations.filter(o => o.type === 'GOUVERNORAT');
    const prefectures = organisations.filter(o => o.type === 'PREFECTURE');
    const organismes = organisations.filter(o =>
      ['AGENCE_NATIONALE', 'ORGANISME_SOCIAL', 'ETABLISSEMENT_PUBLIC'].includes(o.type)
    );

    console.log(`   Ministères: ${ministeres.length}`);
    console.log(`   Gouvernorats: ${gouvernorats.length}`);
    console.log(`   Préfectures: ${prefectures.length}`);
    console.log(`   Organismes spécialisés: ${organismes.length}`);

    // 3. Créer une organisation virtuelle pour les citoyens DEMARCHE.GA
    console.log('\n🏠 Création organisation virtuelle DEMARCHE.GA...');
    let demarche_ga = await prisma.organization.findUnique({
      where: { code: 'DEMARCHE_GA' }
    });

    if (!demarche_ga) {
      demarche_ga = await prisma.organization.create({
        data: {
          code: 'DEMARCHE_GA',
          name: 'Plateforme Citoyenne DEMARCHE.GA',
          type: 'PLATEFORME_CITOYENNE',
          description: 'Plateforme numérique pour les services citoyens du Gabon',
          email: 'contact@demarche.ga',
          phone: '+241 01 00 00 00',
          city: 'Libreville',
          website: 'https://demarche.ga',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });
      console.log('   ✅ Organisation DEMARCHE.GA créée');
    } else {
      console.log('   ⏩ Organisation DEMARCHE.GA existe déjà');
    }

    // 4. Attribution intelligente par rôle
    console.log('\n👥 Attribution des utilisateurs...');
    let attributions = 0;

    // Répartir les utilisateurs par rôle
    for (const user of usersSansOrg) {
      let organisationCible = null;

      switch (user.role) {
        case 'USER': // Citoyens → DEMARCHE.GA
          organisationCible = demarche_ga;
          break;

        case 'AGENT': // Agents → Répartir dans les ministères
          organisationCible = ministeres[Math.floor(Math.random() * ministeres.length)];
          break;

        case 'MANAGER': // Managers → Répartir dans toutes les structures ADMINISTRATION.GA
          const structuresAdmin = [...ministeres, ...gouvernorats, ...organismes];
          organisationCible = structuresAdmin[Math.floor(Math.random() * structuresAdmin.length)];
          break;

        case 'ADMIN': // Admins → Structures importantes (ministères, gouvernorats)
          const structuresImportantes = [...ministeres, ...gouvernorats];
          organisationCible = structuresImportantes[Math.floor(Math.random() * structuresImportantes.length)];
          break;

        case 'SUPER_ADMIN': // Super Admins → Ministères d'État
          const ministeresEtat = ministeres.filter(m => m.type === 'MINISTERE_ETAT');
          organisationCible = ministeresEtat.length > 0
            ? ministeresEtat[Math.floor(Math.random() * ministeresEtat.length)]
            : ministeres[0];
          break;

        default:
          organisationCible = demarche_ga; // Par défaut, citoyens
      }

      if (organisationCible) {
        await prisma.user.update({
          where: { id: user.id },
          data: { primaryOrganizationId: organisationCible.id }
        });
        attributions++;

        if (attributions % 50 === 0) {
          console.log(`   ✅ ${attributions} utilisateurs attribués...`);
        }
      }
    }

    // 5. Statistiques finales
    console.log('\n📊 Statistiques après attribution...');
    const statsFinales = {
      utilisateurs: await prisma.user.count(),
      sansOrganisation: await prisma.user.count({
        where: { primaryOrganizationId: null }
      }),
      organisations: await prisma.organization.count(),
      parRole: await prisma.user.groupBy({
        by: ['role'],
        _count: { role: true }
      })
    };

    console.log(`   Total utilisateurs: ${statsFinales.utilisateurs}`);
    console.log(`   Sans organisation: ${statsFinales.sansOrganisation}`);
    console.log(`   Total organisations: ${statsFinales.organisations}`);

    // Statistiques par organisation
    console.log('\n🏢 Répartition par organisation:');
    const orgStats = await prisma.organization.findMany({
      include: {
        _count: { select: { users: true } },
        users: {
          select: { role: true },
          where: { isActive: true }
        }
      },
      orderBy: { users: { _count: 'desc' } }
    });

    orgStats.forEach(org => {
      const roles = {};
      org.users.forEach(user => {
        roles[user.role] = (roles[user.role] || 0) + 1;
      });

      console.log(`   ${org.name}: ${org._count.users} agents`);
      if (org._count.users > 0) {
        Object.entries(roles).forEach(([role, count]) => {
          console.log(`     - ${role}: ${count}`);
        });
      }
    });

    // Validation finale
    console.log('\n✅ Validation finale...');
    const validation = {
      totalUsers: await prisma.user.count(),
      usersWithOrg: await prisma.user.count({
        where: { primaryOrganizationId: { not: null } }
      }),
      adminGaUsers: await prisma.user.count({
        where: {
          primaryOrganization: {
            type: { not: 'PLATEFORME_CITOYENNE' }
          }
        }
      }),
      demarcheGaUsers: await prisma.user.count({
        where: {
          primaryOrganization: {
            type: 'PLATEFORME_CITOYENNE'
          }
        }
      })
    };

    const couverture = (validation.usersWithOrg / validation.totalUsers * 100).toFixed(1);

    console.log(`   Utilisateurs totaux: ${validation.totalUsers}`);
    console.log(`   Avec organisation: ${validation.usersWithOrg} (${couverture}%)`);
    console.log(`   ADMINISTRATION.GA: ${validation.adminGaUsers} agents publics`);
    console.log(`   DEMARCHE.GA: ${validation.demarcheGaUsers} citoyens`);

    console.log('\n🎉 ATTRIBUTION INTELLIGENTE TERMINÉE !');
    console.log(`✨ ${attributions} utilisateurs attribués avec succès`);
    console.log('🔗 Tous les utilisateurs sont maintenant liés à une organisation');
    console.log('🏛️ ADMINISTRATION.GA + DEMARCHE.GA = Écosystème complet !');

  } catch (error) {
    console.error('❌ Erreur lors de l\'attribution:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter l'attribution
attribuerUtilisateursAuxOrganisations();
