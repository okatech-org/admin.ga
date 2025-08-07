/**
 * Script de test pour vérifier que toutes les nouvelles APIs fonctionnent correctement
 */

const API_BASE_URL = 'http://localhost:3000';

const ENDPOINTS = [
  '/api/super-admin/stats/organismes',
  '/api/super-admin/stats/postes',
  '/api/super-admin/stats/utilisateurs',
  '/api/super-admin/stats/services',
  '/api/super-admin/stats/relations',
  '/api/super-admin/stats/synthese'
];

async function testAPI(endpoint: string) {
  try {
    console.log(`🔍 Test de ${endpoint}...`);

    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    const data = await response.json();

    if (response.ok && data.success) {
      console.log(`✅ ${endpoint} - OK`);
      console.log(`   📊 Données chargées: ${Object.keys(data.data).length} sections`);
      return true;
    } else {
      console.log(`❌ ${endpoint} - ERREUR: ${data.error || 'Réponse invalide'}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ ${endpoint} - ERREUR: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    return false;
  }
}

async function testAllAPIs() {
  console.log('🚀 Test des APIs de statistiques...\n');

  const results = await Promise.all(
    ENDPOINTS.map(endpoint => testAPI(endpoint))
  );

  const successCount = results.filter(result => result).length;
  const totalCount = results.length;

  console.log(`\n📈 Résultats: ${successCount}/${totalCount} APIs fonctionnelles`);

  if (successCount === totalCount) {
    console.log('🎉 Tous les tests sont RÉUSSIS !');
    console.log('\n📋 Prochaines étapes:');
    console.log('   1. Démarrer l\'application: npm run dev');
    console.log('   2. Accéder à /super-admin pour voir les nouvelles données');
    console.log('   3. Tester chaque page: organismes, utilisateurs, postes, services, relations');
  } else {
    console.log('⚠️  Certaines APIs ont échoué. Vérifiez:');
    console.log('   1. Que le serveur Next.js est démarré (npm run dev)');
    console.log('   2. Que les données sont chargées (npm run db:migrate-real)');
    console.log('   3. Les logs du serveur pour plus de détails');
  }
}

// Test rapide des données échantillon
async function testSampleData() {
  try {
    console.log('\n🗂️  Test des données échantillon...');

    // Import dynamique pour éviter les erreurs de module
    const { default: DONNEES_ECHANTILLON } = await import('../lib/data/donnees-reelles-echantillon-gabon-2025');

    console.log('✅ Données échantillon trouvées:');
    console.log(`   📊 ${DONNEES_ECHANTILLON.organismes.total_organismes} organismes`);
    console.log(`   👥 ${DONNEES_ECHANTILLON.fonctionnaires.total_fonctionnaires_reels} fonctionnaires`);
    console.log(`   💼 ${DONNEES_ECHANTILLON.systeme_utilisateurs.total_utilisateurs_systeme} utilisateurs système`);
    console.log(`   🏛️  ${DONNEES_ECHANTILLON.services.total_services} services`);
    console.log(`   🔗 ${DONNEES_ECHANTILLON.relations.total_relations} relations`);

    return true;
  } catch (error) {
    console.log(`❌ Erreur lors du chargement des données: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    return false;
  }
}

// Exécution des tests
async function main() {
  console.log('🇬🇦 TEST DES STATISTIQUES GABON 2025\n');

  // Test des données
  await testSampleData();

  // Test des APIs (uniquement si le serveur est accessible)
  const healthCheck = await fetch(`${API_BASE_URL}/api/auth/health`).catch(() => null);

  if (healthCheck) {
    await testAllAPIs();
  } else {
    console.log('\n⚠️  Serveur Next.js non accessible.');
    console.log('   Démarrez le serveur avec: npm run dev');
    console.log('   Puis relancez ce test avec: npx tsx scripts/test-apis.ts');
  }
}

main().catch(console.error);
