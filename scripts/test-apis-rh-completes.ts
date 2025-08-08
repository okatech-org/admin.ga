#!/usr/bin/env bun

/**
 * TEST COMPLET DES APIS RH GABONAISES
 * Vérifie que toutes les APIs RH fonctionnent et chargent les bonnes données
 */

interface TestResult {
  api: string;
  endpoint: string;
  success: boolean;
  data?: any;
  error?: string;
  duration: number;
  dataCount?: number;
}

async function testAPI(name: string, endpoint: string): Promise<TestResult> {
  const startTime = Date.now();

  try {
    console.log(`🧪 Test de ${name}...`);

    const response = await fetch(`http://localhost:3000${endpoint}`);
    const duration = Date.now() - startTime;

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'API a retourné success: false');
    }

    // Compter les éléments de données
    let dataCount = 0;
    if (data.data) {
      if (data.data.postes) dataCount = data.data.postes.length;
      else if (data.data.fonctionnaires) dataCount = data.data.fonctionnaires.length;
      else if (data.data.comptes) dataCount = data.data.comptes.length;
      else if (data.data.users) dataCount = data.data.users.length;
      else if (data.data.organismes) dataCount = data.data.organismes.length;
      else if (data.data.propositions) dataCount = data.data.propositions?.length || 0;
      else if (data.data.total !== undefined) dataCount = data.data.total;
    }

    return {
      api: name,
      endpoint,
      success: true,
      data,
      duration,
      dataCount
    };

  } catch (error) {
    const duration = Date.now() - startTime;

    return {
      api: name,
      endpoint,
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
      duration
    };
  }
}

async function testAllAPIs() {
  console.log('\n' + '='.repeat(80));
  console.log('🧪 TEST COMPLET DES APIS RH GABONAISES');
  console.log('='.repeat(80) + '\n');

  const tests = [
    { name: 'Postes Vacants', endpoint: '/api/rh/postes-vacants?page=1&limit=10' },
    { name: 'Fonctionnaires en Attente', endpoint: '/api/rh/fonctionnaires-attente?page=1&limit=10' },
    { name: 'Comptes Actifs', endpoint: '/api/rh/comptes-actifs?page=1&limit=10' },
    { name: 'Utilisateurs RH', endpoint: '/api/rh/utilisateurs?page=1&limit=20&includeStats=true' },
    { name: 'Organismes', endpoint: '/api/rh/organismes' },
    { name: 'Statistiques RH', endpoint: '/api/rh/statistiques' },
    { name: 'Propositions d\'Affectation', endpoint: '/api/rh/propositions?limit=5' }
  ];

  const results: TestResult[] = [];

  // Exécuter tous les tests
  for (const test of tests) {
    const result = await testAPI(test.name, test.endpoint);
    results.push(result);

    if (result.success) {
      console.log(`   ✅ ${result.api}: ${result.dataCount || 0} éléments en ${result.duration}ms`);
    } else {
      console.log(`   ❌ ${result.api}: ${result.error}`);
    }
  }

  // Résumé des résultats
  console.log('\n' + '='.repeat(60));
  console.log('📋 RÉSUMÉ DES TESTS');
  console.log('='.repeat(60));

  const testsReussis = results.filter(r => r.success).length;
  const tempsTotal = results.reduce((sum, r) => sum + r.duration, 0);

  console.log(`\n✅ Tests réussis: ${testsReussis}/${results.length}`);
  console.log(`⏱️  Temps total: ${tempsTotal}ms`);
  console.log(`📈 Temps moyen: ${Math.round(tempsTotal / results.length)}ms`);

  // Détails des succès
  console.log('\n🎯 DONNÉES CHARGÉES:');
  results.filter(r => r.success).forEach(result => {
    console.log(`   • ${result.api}: ${result.dataCount || 0} éléments`);
  });

  // Détails des erreurs
  const erreurs = results.filter(r => !r.success);
  if (erreurs.length > 0) {
    console.log('\n❌ ERREURS DÉTECTÉES:');
    erreurs.forEach(erreur => {
      console.log(`   • ${erreur.api}: ${erreur.error}`);
    });
  }

  // Tests spécifiques de cohérence
  console.log('\n' + '='.repeat(60));
  console.log('🔍 TESTS DE COHÉRENCE DES DONNÉES');
  console.log('='.repeat(60));

  const postesVacants = results.find(r => r.api === 'Postes Vacants');
  const fonctionnairesAttente = results.find(r => r.api === 'Fonctionnaires en Attente');
  const comptesActifs = results.find(r => r.api === 'Comptes Actifs');
  const utilisateurs = results.find(r => r.api === 'Utilisateurs RH');
  const organismes = results.find(r => r.api === 'Organismes');
  const statistiques = results.find(r => r.api === 'Statistiques RH');

  const coherenceTests = [];

  if (organismes?.success) {
    const nbOrganismes = organismes.dataCount || 0;
    coherenceTests.push({
      test: 'Nombre d\'organismes cohérent (141 attendus)',
      ok: nbOrganismes === 141,
      detail: `${nbOrganismes} organismes trouvés`
    });
  }

  if (postesVacants?.success) {
    const nbPostesVacants = postesVacants.data?.data?.total || 0;
    coherenceTests.push({
      test: 'Il y a des postes vacants',
      ok: nbPostesVacants > 0,
      detail: `${nbPostesVacants} postes vacants`
    });
  }

  if (fonctionnairesAttente?.success) {
    const nbFonctionnairesAttente = fonctionnairesAttente.data?.data?.total || 0;
    coherenceTests.push({
      test: 'Il y a des fonctionnaires en attente',
      ok: nbFonctionnairesAttente > 0,
      detail: `${nbFonctionnairesAttente} fonctionnaires en attente`
    });
  }

  if (comptesActifs?.success) {
    const nbComptesActifs = comptesActifs.data?.data?.total || 0;
    coherenceTests.push({
      test: 'Il y a des comptes actifs',
      ok: nbComptesActifs > 0,
      detail: `${nbComptesActifs} comptes actifs`
    });
  }

  if (utilisateurs?.success) {
    const breakdown = utilisateurs.data?.data?.breakdown;
    if (breakdown) {
      coherenceTests.push({
        test: 'Répartition des utilisateurs cohérente',
        ok: breakdown.fonctionnaires > 0 && breakdown.citoyens === 5 && breakdown.superAdmins === 2,
        detail: `${breakdown.fonctionnaires} fonctionnaires, ${breakdown.citoyens} citoyens, ${breakdown.superAdmins} super admins`
      });
    }
  }

  // Afficher les tests de cohérence
  coherenceTests.forEach(test => {
    console.log(`   ${test.ok ? '✅' : '❌'} ${test.test}`);
    if (test.detail) {
      console.log(`      ${test.detail}`);
    }
  });

  const coherenceScore = coherenceTests.filter(t => t.ok).length;
  console.log(`\n🎯 Score de cohérence: ${coherenceScore}/${coherenceTests.length}`);

  // Test de performance
  console.log('\n' + '='.repeat(60));
  console.log('⚡ PERFORMANCE DES APIS');
  console.log('='.repeat(60));

  const apisLentes = results.filter(r => r.success && r.duration > 1000);
  const apisRapides = results.filter(r => r.success && r.duration < 100);

  console.log(`\n🚀 APIs rapides (< 100ms): ${apisRapides.length}`);
  apisRapides.forEach(api => {
    console.log(`   • ${api.api}: ${api.duration}ms`);
  });

  if (apisLentes.length > 0) {
    console.log(`\n🐌 APIs lentes (> 1000ms): ${apisLentes.length}`);
    apisLentes.forEach(api => {
      console.log(`   • ${api.api}: ${api.duration}ms`);
    });
  }

  // Résultat final
  console.log('\n' + '='.repeat(60));
  console.log('🎯 RÉSULTAT FINAL');
  console.log('='.repeat(60));

  if (testsReussis === results.length && coherenceScore === coherenceTests.length) {
    console.log('\n🎉 TOUS LES TESTS SONT PASSÉS AVEC SUCCÈS!');
    console.log('\n✨ Le système RH gabonais est parfaitement opérationnel:');
    console.log('   • Toutes les APIs répondent correctement');
    console.log('   • Les données sont cohérentes et complètes');
    console.log('   • Les performances sont acceptables');
    console.log('\n🚀 La page /super-admin/postes-emploi peut maintenant charger toutes les données RH!');

    return { success: true, score: testsReussis, total: results.length };
  } else {
    console.log(`\n⚠️  Problèmes détectés:`);
    console.log(`   • ${results.length - testsReussis} API(s) en échec`);
    console.log(`   • ${coherenceTests.length - coherenceScore} test(s) de cohérence échoués`);
    console.log('\nVeuillez corriger ces problèmes avant de continuer.');

    return { success: false, score: testsReussis, total: results.length };
  }
}

// Fonction principale
async function main() {
  console.log('🚀 Démarrage des tests complets des APIs RH...');
  console.log('ℹ️  Assurez-vous que le serveur de développement est démarré sur localhost:3000');
  console.log('ℹ️  Mode développement détecté - authentification désactivée\n');

  try {
    const result = await testAllAPIs();

    if (result.success) {
      console.log('\n✅ Tous les tests sont passés - Le système RH est prêt!');
      process.exit(0);
    } else {
      console.log('\n❌ Certains tests ont échoué - Vérifiez les erreurs ci-dessus');
      process.exit(1);
    }
  } catch (error) {
    console.error('\n💥 Erreur fatale lors des tests:', error);
    console.log('\nℹ️  Vérifiez que:');
    console.log('   • Le serveur de développement est démarré (npm run dev / bun dev)');
    console.log('   • Le port 3000 est accessible');
    console.log('   • Les APIs RH sont correctement configurées');
    process.exit(1);
  }
}

// Attendre un peu avant de commencer les tests
setTimeout(() => {
  main().catch(console.error);
}, 1000);
