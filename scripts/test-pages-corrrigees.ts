/* @ts-nocheck */
/**
 * Test pour vérifier que les pages affichent les données corrigées
 */

import { getOrganismesComplets, STATISTIQUES_ORGANISMES } from '../lib/data/gabon-organismes-141';
import { getAllOrganismesProspects, STATISTIQUES_PROSPECTS } from '../lib/data/organismes-prospects-complete';
import { STATISTIQUES_POSTES_INTERNES } from '../lib/data/postes-internes-ministeres';

function testPagesCorrigees() {
  console.log('🔍 VÉRIFICATION DES PAGES APRÈS CORRECTION\n');

  // Test des données utilisées par les pages
  const organismesExistants = getOrganismesComplets();
  const organismesProspects = getAllOrganismesProspects();
  const tousOrganismes = [...organismesExistants, ...organismesProspects];

  console.log('📊 DONNÉES QUE LES PAGES DEVRAIENT AFFICHER:');
  console.log('='.repeat(50));

  // Page organismes-prospects
  console.log('🎯 PAGE ORGANISMES-PROSPECTS:');
  console.log(`   URL: http://localhost:3000/super-admin/organismes-prospects`);
  console.log(`   Organismes existants: ${organismesExistants.length}`);
  console.log(`   Organismes prospects: ${organismesProspects.length}`);
  console.log(`   Total organismes: ${tousOrganismes.length}`);
  console.log(`   Postes internes: ${STATISTIQUES_POSTES_INTERNES.total}`);
  console.log(`   Message attendu: "${tousOrganismes.length} organismes autonomes + 150 postes internes"`);

  // Page organismes-vue-ensemble (via API)
  console.log('\n📊 PAGE ORGANISMES-VUE-ENSEMBLE:');
  console.log(`   URL: http://localhost:3000/super-admin/organismes-vue-ensemble`);
  console.log(`   Source: API /api/organizations/list`);
  console.log(`   Organismes DB attendus: ${tousOrganismes.length} (si DB mise à jour)`);
  console.log(`   Description attendue: "${tousOrganismes.length} organismes autonomes • + 150 postes internes"`);

  // Test des statistiques utilisées
  console.log('\n📈 STATISTIQUES UTILISÉES:');
  console.log(`   STATISTIQUES_ORGANISMES.total: ${STATISTIQUES_ORGANISMES.total}`);
  console.log(`   STATISTIQUES_PROSPECTS.total: ${STATISTIQUES_PROSPECTS.total}`);
  console.log(`   STATISTIQUES_POSTES_INTERNES.total: ${STATISTIQUES_POSTES_INTERNES.total}`);

  // Vérification de la cohérence
  console.log('\n✅ VÉRIFICATIONS:');
  const totalCalcule = STATISTIQUES_ORGANISMES.total + STATISTIQUES_PROSPECTS.total;
  const totalReel = tousOrganismes.length;

  console.log(`   Total calculé (stats): ${totalCalcule}`);
  console.log(`   Total réel (données): ${totalReel}`);
  console.log(`   Cohérence: ${totalCalcule === totalReel ? '✅ CORRECT' : '❌ INCOHÉRENT'}`);

  // Test de l'API (simulation)
  console.log('\n🌐 TEST API /api/organizations/list:');
  console.log(`   Cette API charge depuis la DB Prisma`);
  console.log(`   Si la DB a été mise à jour avec le script, elle devrait contenir ${tousOrganismes.length} organismes`);
  console.log(`   Sinon, relancer: npx tsx scripts/populate-gabon-160-organismes.ts`);

  // Vérifications directions centrales
  const directionsDansOrganismes = tousOrganismes.filter(org =>
    org.code.startsWith('DCRH_') || org.code.startsWith('DCAF_') ||
    org.code.startsWith('DCSI_') || org.code.startsWith('DCAJ_') ||
    org.code.startsWith('DCC_')
  );

  console.log('\n🚫 VÉRIFICATION DIRECTIONS CENTRALES:');
  if (directionsDansOrganismes.length === 0) {
    console.log('   ✅ CORRECT: Aucune direction centrale dans les organismes');
  } else {
    console.log(`   ❌ ERREUR: ${directionsDansOrganismes.length} directions centrales encore présentes`);
    console.log(`   Codes trouvés: ${directionsDansOrganismes.slice(0, 3).map(d => d.code).join(', ')}...`);
  }

  // Résumé pour les tests manuels
  console.log('\n' + '='.repeat(60));
  console.log('🧪 TESTS MANUELS À EFFECTUER');
  console.log('='.repeat(60));

  console.log('\n1️⃣ PAGE PROSPECTS:');
  console.log('   • Ouvrir: http://localhost:3000/super-admin/organismes-prospects');
  console.log(`   • Vérifier l'en-tête: "Organismes autonomes (Existants: ${STATISTIQUES_ORGANISMES.total}, Prospects: ${STATISTIQUES_PROSPECTS.total}) + ${STATISTIQUES_POSTES_INTERNES.total} postes internes"`);
  console.log(`   • Vérifier le toast: "${tousOrganismes.length} organismes autonomes chargés + 150 postes internes"`);
  console.log(`   • Compter les organismes affichés: doit être ${tousOrganismes.length}`);

  console.log('\n2️⃣ PAGE VUE-ENSEMBLE:');
  console.log('   • Ouvrir: http://localhost:3000/super-admin/organismes-vue-ensemble');
  console.log(`   • Vérifier la description: "${tousOrganismes.length} organismes autonomes gabonais • actifs • + 150 postes internes"`);
  console.log('   • Vérifier les statistiques dans les cartes');
  console.log('   • Vérifier qu\'aucune direction centrale n\'apparaît dans la liste');

  console.log('\n3️⃣ BASE DE DONNÉES:');
  console.log('   • Si les pages affichent encore les anciens nombres, relancer:');
  console.log('   • npx tsx scripts/populate-gabon-160-organismes.ts');
  console.log('   • Puis actualiser les pages web');

  const isAllCorrect = directionsDansOrganismes.length === 0 &&
                      totalCalcule === totalReel &&
                      STATISTIQUES_POSTES_INTERNES.total === 150;

  if (isAllCorrect) {
    console.log('\n🎉 DONNÉES COHÉRENTES !');
    console.log('✅ Les pages devraient afficher les bonnes informations');
    console.log('✅ Vérifiez manuellement les URLs ci-dessus');
  } else {
    console.log('\n⚠️ INCOHÉRENCES DÉTECTÉES');
    console.log('❌ Des ajustements sont nécessaires');
  }
}

testPagesCorrigees();
