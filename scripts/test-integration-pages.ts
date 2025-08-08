#!/usr/bin/env bun

/**
 * SCRIPT DE TEST D'INTÉGRATION
 * Vérifie que les 141 organismes sont bien accessibles via les nouvelles API
 *
 * Usage: bun run scripts/test-integration-pages.ts
 */

import { getOrganismesAPI, getUsersAPI, getFonctionnairesEnAttenteAPI, getStatistiquesAPI } from '../lib/services/systeme-complet-api.service';

async function testerIntegration() {
  console.log('\n' + '='.repeat(60));
  console.log('🧪 TEST D\'INTÉGRATION DES 141 ORGANISMES');
  console.log('='.repeat(60) + '\n');

  let testsReussis = 0;
  let testsEchoues = 0;

  try {
    // ==================== TEST 1: ORGANISMES ====================
    console.log('📊 1. Test de l\'API Organismes...');

    const organismes = await getOrganismesAPI({ limit: 500 });

    if (organismes.success && organismes.data.organizations.length === 141) {
      console.log(`   ✅ ${organismes.data.organizations.length} organismes chargés`);
      console.log(`   ✅ Pagination: ${organismes.data.pagination.total} total`);

      // Vérifier les types
      const types = new Set(organismes.data.organizations.map(o => o.type));
      console.log(`   ✅ ${types.size} types différents trouvés`);

      // Afficher quelques exemples
      console.log('\n   📋 Exemples d\'organismes:');
      organismes.data.organizations.slice(0, 3).forEach(org => {
        console.log(`      • ${org.name} (${org.code}) - ${org.type}`);
      });

      testsReussis++;
    } else {
      console.log(`   ❌ Erreur: ${organismes.data.organizations.length} organismes au lieu de 141`);
      testsEchoues++;
    }

    // ==================== TEST 2: UTILISATEURS ====================
    console.log('\n👥 2. Test de l\'API Utilisateurs...');

    const utilisateurs = await getUsersAPI({ limit: 500 });

    if (utilisateurs.success && utilisateurs.data.users.length > 400) {
      console.log(`   ✅ ${utilisateurs.data.users.length} utilisateurs chargés`);

      // Vérifier les rôles
      const roles = utilisateurs.data.users.reduce((acc, u) => {
        acc[u.role] = (acc[u.role] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      console.log('   ✅ Répartition par rôle:');
      Object.entries(roles).forEach(([role, count]) => {
        console.log(`      • ${role}: ${count}`);
      });

      // Afficher quelques exemples
      console.log('\n   📋 Exemples d\'utilisateurs:');
      utilisateurs.data.users.slice(0, 3).forEach(user => {
        console.log(`      • ${user.name} - ${user.position} (${user.organismeCode})`);
      });

      testsReussis++;
    } else {
      console.log(`   ❌ Erreur: ${utilisateurs.data.users.length} utilisateurs (attendu ~440)`);
      testsEchoues++;
    }

    // ==================== TEST 3: FONCTIONNAIRES ====================
    console.log('\n📋 3. Test de l\'API Fonctionnaires en Attente...');

    const fonctionnaires = await getFonctionnairesEnAttenteAPI({ limit: 50 });

    if (fonctionnaires.success && fonctionnaires.data.length > 0) {
      console.log(`   ✅ ${fonctionnaires.data.length} fonctionnaires chargés`);

      // Vérifier les statuts
      const statuts = fonctionnaires.data.reduce((acc, f) => {
        acc[f.statut] = (acc[f.statut] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      console.log('   ✅ Répartition par statut:');
      Object.entries(statuts).forEach(([statut, count]) => {
        console.log(`      • ${statut}: ${count}`);
      });

      // Afficher quelques exemples
      console.log('\n   📋 Exemples de fonctionnaires:');
      fonctionnaires.data.slice(0, 3).forEach(fonct => {
        console.log(`      • ${fonct.prenom} ${fonct.nom} - ${fonct.matricule} (${fonct.prioriteAffectation})`);
      });

      testsReussis++;
    } else {
      console.log(`   ❌ Erreur: Aucun fonctionnaire chargé`);
      testsEchoues++;
    }

    // ==================== TEST 4: STATISTIQUES ====================
    console.log('\n📈 4. Test de l\'API Statistiques...');

    const stats = await getStatistiquesAPI();

    if (stats) {
      console.log(`   ✅ Statistiques chargées`);
      console.log(`      • Total organismes: ${stats.totalOrganismes}`);
      console.log(`      • Total utilisateurs: ${stats.totalUtilisateurs}`);
      console.log(`      • Organismes actifs: ${stats.organismesActifs}`);
      console.log(`      • Moyenne users/organisme: ${stats.moyenneUsersParOrganisme}`);

      if (stats.top5Organismes && stats.top5Organismes.length > 0) {
        console.log('\n   🏆 TOP 5 Organismes:');
        stats.top5Organismes.forEach((org, index) => {
          console.log(`      ${index + 1}. ${org.nom} - ${org.utilisateurs} users`);
        });
      }

      testsReussis++;
    } else {
      console.log(`   ❌ Erreur: Statistiques non chargées`);
      testsEchoues++;
    }

    // ==================== TEST 5: RECHERCHE ====================
    console.log('\n🔍 5. Test de recherche...');

    const rechercheMinistere = await getOrganismesAPI({ search: 'ministère', limit: 100 });

    if (rechercheMinistere.success) {
      console.log(`   ✅ Recherche "ministère": ${rechercheMinistere.data.organizations.length} résultats`);

      if (rechercheMinistere.data.organizations.length > 0) {
        console.log('   📋 Premiers résultats:');
        rechercheMinistere.data.organizations.slice(0, 3).forEach(org => {
          console.log(`      • ${org.name}`);
        });
      }

      testsReussis++;
    } else {
      console.log(`   ❌ Erreur dans la recherche`);
      testsEchoues++;
    }

    // ==================== TEST 6: FILTRAGE PAR TYPE ====================
    console.log('\n🏛️ 6. Test de filtrage par type...');

    const ministeres = await getOrganismesAPI({ type: 'MINISTERE', limit: 100 });

    if (ministeres.success) {
      console.log(`   ✅ Filtrage MINISTERE: ${ministeres.data.organizations.length} résultats`);

      // Vérifier que tous sont bien des ministères
      const tousMinisteres = ministeres.data.organizations.every(o => o.type === 'MINISTERE');
      if (tousMinisteres) {
        console.log('   ✅ Tous les résultats sont bien des ministères');
      } else {
        console.log('   ⚠️ Certains résultats ne sont pas des ministères');
      }

      testsReussis++;
    } else {
      console.log(`   ❌ Erreur dans le filtrage`);
      testsEchoues++;
    }

  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
    testsEchoues++;
  }

  // ==================== RÉSUMÉ ====================
  console.log('\n' + '='.repeat(60));
  console.log('📊 RÉSUMÉ DES TESTS');
  console.log('='.repeat(60));
  console.log(`   ✅ Tests réussis: ${testsReussis}/6`);
  console.log(`   ❌ Tests échoués: ${testsEchoues}/6`);

  if (testsReussis === 6) {
    console.log('\n🎉 TOUS LES TESTS SONT PASSÉS!');
    console.log('\n✅ Les 141 organismes sont correctement intégrés et accessibles via les API');
    console.log('✅ Les pages devraient maintenant afficher toutes les données');

    console.log('\n📋 VÉRIFICATION FINALE:');
    console.log('   1. Lancez l\'application: npm run dev');
    console.log('   2. Accédez à: http://localhost:3000/super-admin/organismes-vue-ensemble');
    console.log('   3. Vérifiez que 141 organismes s\'affichent');
    console.log('   4. Testez les filtres et la recherche');
  } else {
    console.log('\n⚠️ Certains tests ont échoué');
    console.log('   Vérifiez les erreurs ci-dessus et relancez le test');
  }
}

// Exécuter le test
testerIntegration().catch(console.error);
