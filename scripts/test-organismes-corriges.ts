/* @ts-nocheck */
/**
 * Script de test pour vérifier la correction des organismes
 * Les directions centrales ne doivent plus être comptées comme des organismes
 */

import { getOrganismesComplets, STATISTIQUES_ORGANISMES } from '../lib/data/gabon-organismes-141';
import { getAllOrganismesProspects } from '../lib/data/organismes-prospects-complete';
import { genererPostesInternes, STATISTIQUES_POSTES_INTERNES } from '../lib/data/postes-internes-ministeres';

function testOrganismesCorrigés() {
  console.log('🧪 TEST CORRECTION - ORGANISMES vs POSTES INTERNES\n');

  // Test 1: Charger les organismes (sans directions centrales)
  const organismesExistants = getOrganismesComplets();
  const organismesProspects = getAllOrganismesProspects();
  const tousOrganismes = [...organismesExistants, ...organismesProspects];

  console.log('📊 ORGANISMES AUTONOMES:');
  console.log(`   - Organismes existants: ${organismesExistants.length}`);
  console.log(`   - Organismes prospects: ${organismesProspects.length}`);
  console.log(`   - Total organismes: ${tousOrganismes.length}`);
  console.log(`   - Statistiques officielles: ${STATISTIQUES_ORGANISMES.total}`);

  // Test 2: Charger les postes internes
  const postesInternes = genererPostesInternes();

  console.log('\n📋 POSTES INTERNES (Directions Centrales):');
  console.log(`   - Total postes: ${postesInternes.length}`);
  console.log(`   - Statistiques postes: ${STATISTIQUES_POSTES_INTERNES.total}`);
  console.log(`   - Comptes vides: ${STATISTIQUES_POSTES_INTERNES.comptes_vides}`);

  // Test 3: Vérifier qu'aucune direction centrale n'est dans les organismes
  const codesOrganismes = tousOrganismes.map(org => org.code);
  const directionsCentralesTrouvees = codesOrganismes.filter(code =>
    code.startsWith('DCRH_') ||
    code.startsWith('DCAF_') ||
    code.startsWith('DCSI_') ||
    code.startsWith('DCAJ_') ||
    code.startsWith('DCC_')
  );

  console.log('\n🔍 VÉRIFICATION DIRECTIONS CENTRALES:');
  if (directionsCentralesTrouvees.length === 0) {
    console.log('   ✅ CORRECT: Aucune direction centrale dans les organismes');
  } else {
    console.log(`   ❌ ERREUR: ${directionsCentralesTrouvees.length} directions centrales trouvées dans les organismes`);
    console.log(`   Codes trouvés: ${directionsCentralesTrouvees.slice(0, 5).join(', ')}...`);
  }

  // Test 4: Vérifier les types de postes internes
  const postesParType = postesInternes.reduce((acc, poste) => {
    acc[poste.type] = (acc[poste.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  console.log('\n📊 RÉPARTITION POSTES INTERNES:');
  Object.entries(postesParType).forEach(([type, count]) => {
    const typeNames = {
      'DCRH': 'Directions Centrales RH',
      'DCAF': 'Directions Centrales Finances',
      'DCSI': 'Directions Centrales SI',
      'DCAJ': 'Directions Centrales Juridiques',
      'DCC': 'Directions Centrales Communication'
    };
    console.log(`   ${typeNames[type] || type}: ${count}`);
  });

  // Test 5: Vérifier les utilisateurs affectés (doivent tous être à 0)
  const postesAvecUtilisateurs = postesInternes.filter(poste => poste.utilisateurs_affectes > 0);

  console.log('\n👥 VÉRIFICATION COMPTES VIDES:');
  if (postesAvecUtilisateurs.length === 0) {
    console.log('   ✅ CORRECT: Tous les postes sont des comptes vides (0 utilisateurs)');
  } else {
    console.log(`   ❌ ERREUR: ${postesAvecUtilisateurs.length} postes ont des utilisateurs affectés`);
  }

  // Test 6: Vérification des ministères
  const ministeresUniques = [...new Set(postesInternes.map(poste => poste.ministere_code))];

  console.log('\n🏛️ VÉRIFICATION MINISTÈRES:');
  console.log(`   - Ministères avec postes: ${ministeresUniques.length}`);
  console.log(`   - Attendus: 30 ministères`);

  if (ministeresUniques.length === 30) {
    console.log('   ✅ CORRECT: Tous les ministères ont leurs postes internes');
  } else {
    console.log('   ❌ ERREUR: Nombre de ministères incorrect');
  }

  // Résumé final
  console.log('\n' + '='.repeat(70));
  console.log('🎯 RÉSUMÉ DE LA CORRECTION');
  console.log('='.repeat(70));
  console.log(`📦 Total organismes autonomes: ${tousOrganismes.length}`);
  console.log(`📋 Total postes internes: ${postesInternes.length}`);
  console.log(`🏛️ Ministères: 30 (avec ${postesInternes.length / 30} postes chacun)`);
  console.log(`👥 Comptes vides: ${postesInternes.length} (tous à 0 utilisateur)`);

  const isCorrect = directionsCentralesTrouvees.length === 0 &&
                   postesAvecUtilisateurs.length === 0 &&
                   ministeresUniques.length === 30 &&
                   postesInternes.length === 150;

  if (isCorrect) {
    console.log('\n🎉 CORRECTION RÉUSSIE !');
    console.log('✅ Les directions centrales sont maintenant des postes internes');
    console.log('✅ Tous les comptes sont vides (0 utilisateurs)');
    console.log('✅ La distinction organismes/postes est respectée');
  } else {
    console.log('\n❌ CORRECTION INCOMPLÈTE');
    console.log('Des ajustements sont encore nécessaires');
  }

  console.log('\n🚀 PROCHAINES ÉTAPES:');
  console.log('1. Tester la page: http://localhost:3000/super-admin/organismes-prospects');
  console.log('2. Vérifier que le compteur d\'organismes a diminué');
  console.log('3. Vérifier que les postes internes peuvent être gérés séparément');
  console.log('4. Implémenter l\'interface de gestion des postes si nécessaire');
}

// Exécuter le test
testOrganismesCorrigés();
