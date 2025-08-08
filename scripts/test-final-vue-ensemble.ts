#!/usr/bin/env bun

/**
 * TEST FINAL DE LA VUE D'ENSEMBLE
 * Teste exactement ce que fait la page postes-emploi pour charger les statistiques
 */

async function testFinalVueEnsemble() {
  console.log('\n' + '='.repeat(70));
  console.log('🎯 TEST FINAL - VUE D\'ENSEMBLE PAGE POSTES-EMPLOI');
  console.log('='.repeat(70) + '\n');

  try {
    // Simuler exactement ce que fait la page loadInitialData
    console.log('🚀 Simulation exacte du chargement initial de la page...');

    const [organismesResponse, statistiquesResponse] = await Promise.all([
      fetch('http://localhost:3000/api/rh/organismes'),
      fetch('http://localhost:3000/api/rh/statistiques')
    ]);

    // Test organismes
    if (!organismesResponse.ok) {
      throw new Error(`Organismes API échoué: ${organismesResponse.status}`);
    }

    const organismesResult = await organismesResponse.json();
    if (!organismesResult.success) {
      throw new Error('API organismes retourne success: false');
    }

    console.log('   ✅ Organismes chargés:', organismesResult.data.organismes.length);

    // Test statistiques
    if (!statistiquesResponse.ok) {
      throw new Error(`Statistiques API échoué: ${statistiquesResponse.status}`);
    }

    const statistiquesResult = await statistiquesResponse.json();
    if (!statistiquesResult.success) {
      throw new Error('API statistiques retourne success: false');
    }

    console.log('   ✅ Statistiques chargées');

    // Transformer exactement comme dans la page (lignes 251-302)
    console.log('\n🔄 Transformation des données (exactement comme la page)...');

    const rawStats = statistiquesResult.data;
    const vueEnsemble = rawStats['📊 VUE D\'ENSEMBLE'] || {};
    const situationPostes = rawStats['📋 SITUATION DES POSTES'] || {};
    const ressourcesHumaines = rawStats['👥 RESSOURCES HUMAINES'] || {};
    const statistiquesDetailees = rawStats['statistiques_detaillees'] || {};

    console.log('   📊 Données extraites:', {
      'VUE D\'ENSEMBLE': Object.keys(vueEnsemble),
      'SITUATION DES POSTES': Object.keys(situationPostes),
      'RESSOURCES HUMAINES': Object.keys(ressourcesHumaines),
      'STATISTIQUES DÉTAILLÉES': Object.keys(statistiquesDetailees).slice(0, 5) // Premiers 5 seulement
    });

    const statsData = {
      global: {
        total_organismes: vueEnsemble['Total organismes'] || 0,
        total_postes: vueEnsemble['Total postes'] || 0,
        total_fonctionnaires: vueEnsemble['Total fonctionnaires'] || 0,
        taux_occupation: statistiquesDetailees.taux_occupation || 60,
        postes_vacants: situationPostes['Postes vacants'] || 0,
        fonctionnaires_disponibles: ressourcesHumaines['En attente d\'affectation'] || 0
      }
    };

    console.log('   ✅ Transformation réussie');

    // Test des 4 cartes StatCard de la vue d'ensemble
    console.log('\n📊 Test des 4 cartes de statistiques (StatCard)...');

    const cartes = [
      {
        nom: 'Organismes',
        valeur: statsData.global.total_organismes,
        sousTitre: 'Administration publique',
        test: statsData.global.total_organismes === 141
      },
      {
        nom: 'Postes',
        valeur: statsData.global.total_postes,
        sousTitre: `${statsData.global.postes_vacants} vacants`,
        test: statsData.global.total_postes > 0 && statsData.global.postes_vacants > 0
      },
      {
        nom: 'Fonctionnaires',
        valeur: statsData.global.total_fonctionnaires,
        sousTitre: `${statsData.global.fonctionnaires_disponibles} disponibles`,
        test: statsData.global.total_fonctionnaires > 0 && statsData.global.fonctionnaires_disponibles > 0
      },
      {
        nom: 'Taux d\'Occupation',
        valeur: `${statsData.global.taux_occupation}%`,
        sousTitre: '',
        test: statsData.global.taux_occupation >= 50 && statsData.global.taux_occupation <= 80
      }
    ];

    let cartesValides = 0;
    cartes.forEach(carte => {
      if (carte.test) {
        console.log(`   ✅ ${carte.nom}: ${carte.valeur}${carte.sousTitre ? ` (${carte.sousTitre})` : ''}`);
        cartesValides++;
      } else {
        console.log(`   ❌ ${carte.nom}: ${carte.valeur}${carte.sousTitre ? ` (${carte.sousTitre})` : ''}`);
      }
    });

    // Test des sections additionnelles
    console.log('\n🎯 Test des sections additionnelles...');

    // Section postes stratégiques (sera remplie après loadPostes)
    console.log('   📋 Postes stratégiques: Chargés dynamiquement via loadPostes()');

    // Section fonctionnaires disponibles (sera remplie après loadFonctionnaires)
    console.log('   👥 Personnel en attente: Chargé dynamiquement via loadFonctionnaires()');

    // Section actions rapides
    console.log('   ⚡ Actions rapides: Statique (nouveau poste, recherche, etc.)');

    // Calcul des métriques par niveau (comme dans la page)
    console.log('\n📈 Calcul des métriques par niveau...');

    const parNiveau = {
      DIRECTION: {
        postes_total: Math.floor((vueEnsemble['Total postes'] || 0) * 0.15),
        postes_vacants: Math.floor((situationPostes['Postes vacants'] || 0) * 0.15)
      },
      ENCADREMENT: {
        postes_total: Math.floor((vueEnsemble['Total postes'] || 0) * 0.25),
        postes_vacants: Math.floor((situationPostes['Postes vacants'] || 0) * 0.25)
      },
      EXÉCUTION: {
        postes_total: Math.floor((vueEnsemble['Total postes'] || 0) * 0.60),
        postes_vacants: Math.floor((situationPostes['Postes vacants'] || 0) * 0.60)
      }
    };

    Object.entries(parNiveau).forEach(([niveau, stats]) => {
      console.log(`   📊 ${niveau}: ${stats.postes_total} postes (${stats.postes_vacants} vacants)`);
    });

    // Résultat final
    console.log('\n' + '='.repeat(50));
    console.log('🎯 RÉSULTAT FINAL');
    console.log('='.repeat(50));

    if (cartesValides === cartes.length) {
      console.log('\n🎉 TOUTES LES CARTES STATISTIQUES SONT VALIDES !');

      console.log('\n✨ LA VUE D\'ENSEMBLE AFFICHE MAINTENANT:');
      console.log(`   📊 ${statsData.global.total_organismes} organismes officiels gabonais`);
      console.log(`   📋 ${statsData.global.total_postes} postes administratifs`);
      console.log(`      └── ${statsData.global.postes_vacants} postes vacants (offres d'emploi)`);
      console.log(`   👥 ${statsData.global.total_fonctionnaires} fonctionnaires`);
      console.log(`      └── ${statsData.global.fonctionnaires_disponibles} en attente d'affectation`);
      console.log(`   📈 ${statsData.global.taux_occupation}% taux d'occupation`);

      console.log('\n🎯 RÉPARTITION PAR NIVEAU:');
      Object.entries(parNiveau).forEach(([niveau, stats]) => {
        const pourcentage = ((stats.postes_vacants / stats.postes_total) * 100).toFixed(0);
        console.log(`   • ${niveau}: ${stats.postes_vacants}/${stats.postes_total} vacants (${pourcentage}%)`);
      });

      console.log('\n🚀 ACTIONS RECOMMANDÉES:');
      console.log('   1. Actualiser la page http://localhost:3000/super-admin/postes-emploi');
      console.log('   2. Cliquer sur l\'onglet "Vue d\'ensemble"');
      console.log('   3. Vérifier que les 4 cartes affichent les vraies données');
      console.log('   4. Les sections "Postes Stratégiques" et "Personnel en Attente" se remplissent en cliquant sur leurs onglets respectifs');

      return {
        success: true,
        statistiques: statsData,
        cartes_valides: cartesValides,
        total_cartes: cartes.length
      };
    } else {
      console.log(`\n⚠️  PROBLÈME DÉTECTÉ:`);
      console.log(`   • ${cartes.length - cartesValides} carte(s) invalide(s) sur ${cartes.length}`);
      console.log('\n🔧 VÉRIFICATIONS NÉCESSAIRES:');
      console.log('   • Structure des données statistiques');
      console.log('   • Transformation des données dans la page');
      console.log('   • Affichage des composants StatCard');

      return {
        success: false,
        cartes_valides: cartesValides,
        total_cartes: cartes.length
      };
    }

  } catch (error) {
    console.error('\n❌ ERREUR DURANT LE TEST:', error);
    console.log('\nℹ️  Vérifications:');
    console.log('   • Serveur de développement actif sur localhost:3000');
    console.log('   • APIs /api/rh/organismes et /api/rh/statistiques accessibles');
    console.log('   • Système RH gabonais initialisé');

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    };
  }
}

// Fonction principale
async function main() {
  console.log('🎯 Test final de la vue d\'ensemble...');
  console.log('ℹ️  Ce test simule exactement le comportement de la page postes-emploi');

  try {
    const result = await testFinalVueEnsemble();

    if (result.success) {
      console.log('\n✅ TEST FINAL RÉUSSI !');
      console.log('\n🎊 La vue d\'ensemble de la page postes-emploi charge maintenant toutes les statistiques RH !');
      process.exit(0);
    } else {
      console.log('\n❌ Test final échoué');
      console.log(`   Cartes valides: ${result.cartes_valides}/${result.total_cartes}`);
      process.exit(1);
    }
  } catch (error) {
    console.error('\n💥 Erreur fatale:', error);
    process.exit(1);
  }
}

// Lancer le test final
setTimeout(() => {
  main().catch(console.error);
}, 500);
