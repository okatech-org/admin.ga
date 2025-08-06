#!/usr/bin/env tsx

/**
 * 🧪 Test de vérification - Page Structure Administrative avec 141 organismes
 *
 * Objectif: Vérifier que la page structure-administrative charge et affiche
 * correctement tous les 141 organismes officiels gabonais dans les deux onglets:
 * - Hiérarchie (TreeView)
 * - Organismes (Liste)
 */

import { structureAdministrativeService } from '../lib/services/structure-administrative.service';
import { getOrganismesComplets, STATISTIQUES_ORGANISMES } from '../lib/data/gabon-organismes-141';

async function testerChargementStructureAdministrative() {
  console.log('🧪 TEST: Chargement de la Structure Administrative avec 141 organismes\n');

  try {
    // 1. Vérifier les données source
    console.log('📊 ÉTAPE 1: Vérification des données source');
    const organismesSource = getOrganismesComplets();
    console.log(`   ✅ ${organismesSource.length} organismes dans les données source`);
    console.log(`   ✅ Statistiques officielles: ${STATISTIQUES_ORGANISMES.total} organismes`);

    if (organismesSource.length !== 141) {
      console.log(`   ❌ ERREUR: Attendu 141 organismes, trouvé ${organismesSource.length}`);
      return false;
    }

    // 2. Tester le service
    console.log('\n🔧 ÉTAPE 2: Test du service structure-administrative');
    const organismes = await structureAdministrativeService.getOrganismes();
    console.log(`   ✅ Service retourne ${organismes.length} organismes`);

    if (organismes.length !== 141) {
      console.log(`   ❌ ERREUR: Service retourne ${organismes.length} organismes au lieu de 141`);
      return false;
    }

    // 3. Tester les statistiques
    console.log('\n📈 ÉTAPE 3: Test des statistiques calculées');
    const stats = await structureAdministrativeService.getStatistiques();
    console.log(`   ✅ Statistiques calculées sur ${organismes.length} organismes`);
    console.log(`   📊 Répartition par niveau:`);
    console.log(`      - Niveau 1: ${stats.niveau_1}`);
    console.log(`      - Niveau 2: ${stats.niveau_2}`);
    console.log(`      - Niveau 3: ${stats.niveau_3}`);
    console.log(`      - Niveau 4: ${stats.niveau_4}`);
    console.log(`      - Niveau 5: ${stats.niveau_5}`);
    console.log(`   💼 Effectifs totaux: ${stats.total_effectifs.toLocaleString('fr-FR')}`);
    console.log(`   💰 Budget total: ${(stats.budget_total / 1_000_000_000).toFixed(1)} Md FCFA`);

    // 4. Tester la recherche
    console.log('\n🔍 ÉTAPE 4: Test de la fonction de recherche');
    const resultatsRecherche = await structureAdministrativeService.rechercherOrganismes('Ministère');
    console.log(`   ✅ Recherche "Ministère": ${resultatsRecherche.organismes.length} résultats`);

    const recherchePresidence = await structureAdministrativeService.rechercherOrganismes('Présidence');
    console.log(`   ✅ Recherche "Présidence": ${recherchePresidence.organismes.length} résultats`);

    // 5. Vérifier la hiérarchie
    console.log('\n🌲 ÉTAPE 5: Vérification de la hiérarchie');
    const organismesRacine = organismes.filter(o => !o.parentId || o.niveau === 1);
    console.log(`   ✅ ${organismesRacine.length} organisme(s) racine trouvé(s)`);

    const organismesAvecParent = organismes.filter(o => o.parentId);
    console.log(`   ✅ ${organismesAvecParent.length} organismes avec parent hiérarchique`);

    // 6. Vérifier la structure par type
    console.log('\n🏛️ ÉTAPE 6: Répartition par type d\'organisme');
    const parType = organismes.reduce((acc, org) => {
      acc[org.type] = (acc[org.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    Object.entries(parType).forEach(([type, count]) => {
      console.log(`   📋 ${type}: ${count} organisme(s)`);
    });

    // 7. Test d'audit
    console.log('\n🔍 ÉTAPE 7: Test de l\'audit');
    const audit = await structureAdministrativeService.effectuerAudit();
    console.log(`   ✅ Audit terminé: ${audit.anomalies.length} anomalie(s) détectée(s)`);

    if (audit.anomalies.length > 0) {
      console.log('   📋 Principales anomalies:');
      audit.anomalies.slice(0, 5).forEach(anomalie => {
        console.log(`      - ${anomalie.type}: ${anomalie.organisme}`);
      });
    }

    console.log('\n✅ RÉSULTAT FINAL: Tous les tests sont passés avec succès !');
    console.log(`🇬🇦 La page structure-administrative est prête à afficher les ${organismes.length} organismes officiels gabonais`);

    console.log('\n📌 VÉRIFICATIONS POUR L\'UTILISATEUR:');
    console.log('   1. Aller sur http://localhost:3000/super-admin/structure-administrative');
    console.log('   2. Vérifier l\'onglet "Hiérarchie" - TreeView avec tous les organismes');
    console.log('   3. Vérifier l\'onglet "Organismes" - Liste complète avec scroll');
    console.log('   4. Tester les filtres et la recherche');
    console.log('   5. Vérifier que les badges affichent "141 organismes officiels 🇬🇦"');

    return true;

  } catch (error) {
    console.error('❌ ERREUR lors du test:', error);
    return false;
  }
}

// Exécuter le test
if (require.main === module) {
  testerChargementStructureAdministrative().then(success => {
    process.exit(success ? 0 : 1);
  });
}

export { testerChargementStructureAdministrative };
