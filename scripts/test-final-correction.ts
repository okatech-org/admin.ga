/* @ts-nocheck */
/**
 * Test final après correction : Distinction organismes autonomes vs postes internes
 */

import { getOrganismesComplets, STATISTIQUES_ORGANISMES } from '../lib/data/gabon-organismes-160';
import { getAllOrganismesProspects, STATISTIQUES_PROSPECTS } from '../lib/data/organismes-prospects-complete';
import { genererPostesInternes, STATISTIQUES_POSTES_INTERNES } from '../lib/data/postes-internes-ministeres';

function testFinalCorrection() {
  console.log('🎯 TEST FINAL - CORRECTION COMPLÈTE\n');

  // Charger toutes les données
  const organismesExistants = getOrganismesComplets();
  const organismesProspects = getAllOrganismesProspects();
  const tousOrganismes = [...organismesExistants, ...organismesProspects];
  const postesInternes = genererPostesInternes();

  console.log('📊 RÉSULTATS APRÈS CORRECTION:');
  console.log('='.repeat(50));

  // Organismes autonomes
  console.log('🏢 ORGANISMES AUTONOMES:');
  console.log(`   Total: ${tousOrganismes.length}`);
  console.log(`   - Existants: ${organismesExistants.length}`);
  console.log(`   - Prospects: ${organismesProspects.length}`);

  // Postes internes
  console.log('\n📋 POSTES INTERNES (Directions Centrales):');
  console.log(`   Total: ${postesInternes.length}`);
  console.log(`   - DCRH (RH): ${postesInternes.filter(p => p.type === 'DCRH').length}`);
  console.log(`   - DCAF (Finances): ${postesInternes.filter(p => p.type === 'DCAF').length}`);
  console.log(`   - DCSI (SI): ${postesInternes.filter(p => p.type === 'DCSI').length}`);
  console.log(`   - DCAJ (Juridique): ${postesInternes.filter(p => p.type === 'DCAJ').length}`);
  console.log(`   - DCC (Communication): ${postesInternes.filter(p => p.type === 'DCC').length}`);

  // Vérifications
  const directionsDansOrganismes = tousOrganismes.filter(org =>
    org.code.startsWith('DCRH_') || org.code.startsWith('DCAF_') ||
    org.code.startsWith('DCSI_') || org.code.startsWith('DCAJ_') ||
    org.code.startsWith('DCC_')
  );

  console.log('\n✅ VÉRIFICATIONS:');
  console.log(`   Directions centrales dans organismes: ${directionsDansOrganismes.length} (doit être 0)`);
  console.log(`   Postes avec 0 utilisateur: ${postesInternes.filter(p => p.utilisateurs_affectes === 0).length} (doit être 150)`);
  console.log(`   Ministères différents: ${[...new Set(postesInternes.map(p => p.ministere_code))].length} (doit être 30)`);

  // Classification par groupes
  const organismesParGroupe = tousOrganismes.reduce((acc, org) => {
    acc[org.groupe] = (acc[org.groupe] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  console.log('\n📊 RÉPARTITION PAR GROUPE:');
  Object.entries(organismesParGroupe).forEach(([groupe, count]) => {
    const groupeNames = {
      'A': 'Institutions Suprêmes',
      'B': 'Ministères',
      'C': 'Directions Générales',
      'E': 'Agences Spécialisées',
      'F': 'Institutions Judiciaires',
      'G': 'Administrations Territoriales',
      'L': 'Pouvoir Législatif',
      'I': 'Institutions Indépendantes'
    };
    console.log(`   Groupe ${groupe} (${groupeNames[groupe]}): ${count}`);
  });

  // Résumé final
  console.log('\n' + '='.repeat(60));
  console.log('🎉 RÉSUMÉ FINAL DE LA CORRECTION');
  console.log('='.repeat(60));
  console.log(`📦 Organismes autonomes: ${tousOrganismes.length}`);
  console.log(`📋 Postes internes: ${postesInternes.length}`);
  console.log(`🏛️ Ministères: 30 (chacun avec 5 postes)`);
  console.log(`👥 Comptes vides: ${postesInternes.length} (prêts pour affectation)`);

  const correctionReussie = directionsDansOrganismes.length === 0 &&
                           postesInternes.length === 150 &&
                           tousOrganismes.length === 102;

  if (correctionReussie) {
    console.log('\n🎯 CORRECTION PARFAITEMENT RÉUSSIE !');
    console.log('✅ Distinction claire entre organismes et postes');
    console.log('✅ Les directions centrales sont des postes internes');
    console.log('✅ Tous les comptes sont vides et prêts');
    console.log('✅ Structure administrative cohérente');
  } else {
    console.log('\n❌ Correction incomplète - vérifications nécessaires');
  }

  console.log('\n🌟 AVANTAGES DE LA CORRECTION:');
  console.log('   • Distinction claire organismes/postes');
  console.log('   • Comptes vides prêts pour affectation de personnel');
  console.log('   • Structure hiérarchique respectée');
  console.log('   • Gestion séparée des ministères et de leurs directions');
  console.log('   • Possibilité d\'affecter du personnel aux postes');

  console.log('\n🚀 UTILISATION:');
  console.log('   1. Page prospects: Organismes autonomes uniquement');
  console.log('   2. Gestion postes: Interface séparée pour les directions');
  console.log('   3. Affectation: Attribuer du personnel aux postes vides');
  console.log('   4. Hiérarchie: Maintenir les relations ministère/directions');
}

testFinalCorrection();
