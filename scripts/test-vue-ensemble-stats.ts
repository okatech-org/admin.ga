#!/usr/bin/env bun

/**
 * TEST SPÉCIFIQUE DE LA VUE D'ENSEMBLE
 * Vérifie que les statistiques se chargent correctement dans la page postes-emploi
 */

async function testVueEnsembleStats() {
  console.log('\n' + '='.repeat(70));
  console.log('🧪 TEST VUE D\'ENSEMBLE - STATISTIQUES');
  console.log('='.repeat(70) + '\n');

  try {
    // 1. Test de l'API statistiques
    console.log('📊 1. Test de l\'API /api/rh/statistiques...');
    const statsResponse = await fetch('http://localhost:3000/api/rh/statistiques');

    if (!statsResponse.ok) {
      throw new Error(`API statistiques échoué: ${statsResponse.status}`);
    }

    const statsResult = await statsResponse.json();

    if (!statsResult.success) {
      throw new Error('API statistiques retourne success: false');
    }

    console.log('   ✅ API statistiques fonctionne');

    // 2. Analyser la structure des données
    console.log('\n📋 2. Structure des données statistiques...');
    const rawStats = statsResult.data;

    console.log('   📊 Sections disponibles:');
    Object.keys(rawStats).forEach(key => {
      if (typeof rawStats[key] === 'object' && rawStats[key] !== null && !Array.isArray(rawStats[key])) {
        console.log(`      • ${key}: ${Object.keys(rawStats[key]).length} métriques`);
      } else if (Array.isArray(rawStats[key])) {
        console.log(`      • ${key}: ${rawStats[key].length} éléments`);
      } else {
        console.log(`      • ${key}: ${rawStats[key]}`);
      }
    });

    // 3. Extraire les données clés
    console.log('\n🔢 3. Extraction des données clés...');

    const vueEnsemble = rawStats['📊 VUE D\'ENSEMBLE'] || {};
    const situationPostes = rawStats['📋 SITUATION DES POSTES'] || {};
    const ressourcesHumaines = rawStats['👥 RESSOURCES HUMAINES'] || {};
    const statistiquesDetailees = rawStats['statistiques_detaillees'] || {};

    console.log('   📊 Vue d\'ensemble:');
    Object.entries(vueEnsemble).forEach(([key, value]) => {
      console.log(`      • ${key}: ${value}`);
    });

    console.log('   📋 Situation des postes:');
    Object.entries(situationPostes).forEach(([key, value]) => {
      console.log(`      • ${key}: ${value}`);
    });

    console.log('   👥 Ressources humaines:');
    Object.entries(ressourcesHumaines).forEach(([key, value]) => {
      console.log(`      • ${key}: ${value}`);
    });

    // 4. Simuler la transformation des données comme dans la page
    console.log('\n🔄 4. Simulation de la transformation des données...');

    const transformedStats = {
      global: {
        total_organismes: vueEnsemble['Total organismes'] || 0,
        total_postes: vueEnsemble['Total postes'] || 0,
        total_fonctionnaires: vueEnsemble['Total fonctionnaires'] || 0,
        taux_occupation: statistiquesDetailees.taux_occupation || 60,
        postes_vacants: situationPostes['Postes vacants'] || 0,
        fonctionnaires_disponibles: ressourcesHumaines['En attente d\'affectation'] || 0
      }
    };

    console.log('   ✅ Données transformées pour la page:');
    Object.entries(transformedStats.global).forEach(([key, value]) => {
      console.log(`      • ${key}: ${value}`);
    });

    // 5. Validation des données
    console.log('\n✅ 5. Validation des données...');

    const validations = [
      {
        test: 'Total organismes > 0',
        result: transformedStats.global.total_organismes > 0,
        value: transformedStats.global.total_organismes
      },
      {
        test: 'Total postes > 0',
        result: transformedStats.global.total_postes > 0,
        value: transformedStats.global.total_postes
      },
      {
        test: 'Total fonctionnaires > 0',
        result: transformedStats.global.total_fonctionnaires > 0,
        value: transformedStats.global.total_fonctionnaires
      },
      {
        test: 'Postes vacants > 0',
        result: transformedStats.global.postes_vacants > 0,
        value: transformedStats.global.postes_vacants
      },
      {
        test: 'Fonctionnaires disponibles > 0',
        result: transformedStats.global.fonctionnaires_disponibles > 0,
        value: transformedStats.global.fonctionnaires_disponibles
      },
      {
        test: 'Taux occupation réaliste (0-100%)',
        result: transformedStats.global.taux_occupation >= 0 && transformedStats.global.taux_occupation <= 100,
        value: `${transformedStats.global.taux_occupation}%`
      }
    ];

    let validationsPassees = 0;
    validations.forEach(validation => {
      if (validation.result) {
        console.log(`   ✅ ${validation.test}: ${validation.value}`);
        validationsPassees++;
      } else {
        console.log(`   ❌ ${validation.test}: ${validation.value}`);
      }
    });

    // 6. Test de cohérence
    console.log('\n🔍 6. Tests de cohérence...');

    const coherenceTests = [
      {
        test: 'Organismes = 141 (attendu)',
        result: transformedStats.global.total_organismes === 141,
        detail: `${transformedStats.global.total_organismes} organismes`
      },
      {
        test: 'Postes vacants < Total postes',
        result: transformedStats.global.postes_vacants < transformedStats.global.total_postes,
        detail: `${transformedStats.global.postes_vacants} vacants sur ${transformedStats.global.total_postes} total`
      },
      {
        test: 'Fonctionnaires disponibles < Total fonctionnaires',
        result: transformedStats.global.fonctionnaires_disponibles < transformedStats.global.total_fonctionnaires,
        detail: `${transformedStats.global.fonctionnaires_disponibles} disponibles sur ${transformedStats.global.total_fonctionnaires} total`
      }
    ];

    let coherenceScore = 0;
    coherenceTests.forEach(test => {
      if (test.result) {
        console.log(`   ✅ ${test.test}`);
        console.log(`      ${test.detail}`);
        coherenceScore++;
      } else {
        console.log(`   ❌ ${test.test}`);
        console.log(`      ${test.detail}`);
      }
    });

    // Résultats finaux
    console.log('\n' + '='.repeat(50));
    console.log('🎯 RÉSULTATS FINAUX');
    console.log('='.repeat(50));

    if (validationsPassees === validations.length && coherenceScore === coherenceTests.length) {
      console.log('\n🎉 TOUS LES TESTS SONT PASSÉS !');
      console.log('\n✨ La vue d\'ensemble affichera maintenant:');
      console.log(`   📊 ${transformedStats.global.total_organismes} organismes`);
      console.log(`   📋 ${transformedStats.global.total_postes} postes (${transformedStats.global.postes_vacants} vacants)`);
      console.log(`   👥 ${transformedStats.global.total_fonctionnaires} fonctionnaires (${transformedStats.global.fonctionnaires_disponibles} disponibles)`);
      console.log(`   📈 ${transformedStats.global.taux_occupation}% taux d'occupation`);

      console.log('\n🚀 RECOMMANDATIONS:');
      console.log('   • Actualiser la page /super-admin/postes-emploi');
      console.log('   • Vérifier l\'onglet "Vue d\'ensemble"');
      console.log('   • Les 4 cartes de statistiques doivent afficher les vraies données');

      return { success: true, stats: transformedStats };
    } else {
      console.log(`\n⚠️  Problèmes détectés:`);
      console.log(`   • ${validations.length - validationsPassees} validation(s) échouée(s)`);
      console.log(`   • ${coherenceTests.length - coherenceScore} test(s) de cohérence échoué(s)`);

      return { success: false, validationsPassees, coherenceScore };
    }

  } catch (error) {
    console.error('\n❌ ERREUR LORS DU TEST:', error);
    console.log('\nℹ️  Vérifiez que:');
    console.log('   • Le serveur de développement est démarré');
    console.log('   • L\'API /api/rh/statistiques fonctionne');
    console.log('   • Le système RH gabonais est initialisé');

    return { success: false, error };
  }
}

// Fonction principale
async function main() {
  console.log('🧪 Test des statistiques de la vue d\'ensemble...');
  console.log('ℹ️  Ce test vérifie que les données se chargent correctement');

  try {
    const result = await testVueEnsembleStats();

    if (result.success) {
      console.log('\n✅ Test réussi - Les statistiques sont prêtes!');
      process.exit(0);
    } else {
      console.log('\n❌ Test échoué - Vérifiez les erreurs ci-dessus');
      process.exit(1);
    }
  } catch (error) {
    console.error('\n💥 Erreur fatale:', error);
    process.exit(1);
  }
}

// Lancer le test
setTimeout(() => {
  main().catch(console.error);
}, 500);
