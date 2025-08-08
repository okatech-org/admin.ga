#!/usr/bin/env bun

/**
 * VÉRIFICATION RAPIDE DE LA VUE D'ENSEMBLE
 * Script simple pour vérifier que les statistiques se chargent
 */

async function verifierVueEnsemble() {
  console.log('🔍 Vérification rapide de la vue d\'ensemble...\n');

  try {
    // Test de l'API statistiques
    const response = await fetch('http://localhost:3000/api/rh/statistiques');
    const result = await response.json();

    if (!result.success) {
      throw new Error('API statistiques échoue');
    }

    // Extraire les données comme le fait la page
    const vueEnsemble = result.data['📊 VUE D\'ENSEMBLE'] || {};
    const situationPostes = result.data['📋 SITUATION DES POSTES'] || {};
    const ressourcesHumaines = result.data['👥 RESSOURCES HUMAINES'] || {};
    const statistiquesDetailees = result.data['statistiques_detaillees'] || {};

    // Test des 4 cartes
    const cartes = [
      { nom: 'Organismes', valeur: vueEnsemble['Total organismes'] },
      { nom: 'Postes', valeur: vueEnsemble['Total postes'] },
      { nom: 'Fonctionnaires', valeur: vueEnsemble['Total fonctionnaires'] },
      { nom: 'Taux d\'occupation', valeur: statistiquesDetailees.taux_occupation }
    ];

    console.log('📊 CARTES DE LA VUE D\'ENSEMBLE:');
    cartes.forEach(carte => {
      const valeur = carte.nom === 'Taux d\'occupation' ? `${carte.valeur}%` : carte.valeur;
      const status = carte.valeur && carte.valeur > 0 ? '✅' : '❌';
      console.log(`   ${status} ${carte.nom}: ${valeur}`);
    });

    // Données additionnelles
    console.log('\n📋 DONNÉES ADDITIONNELLES:');
    console.log(`   • Postes vacants: ${situationPostes['Postes vacants']}`);
    console.log(`   • Fonctionnaires en attente: ${ressourcesHumaines['En attente d\'affectation']}`);

    // Vérification globale
    const toutFonctionne = cartes.every(carte => carte.valeur && carte.valeur > 0);

    console.log('\n' + '='.repeat(50));
    if (toutFonctionne) {
      console.log('✅ TOUTES LES STATISTIQUES SE CHARGENT CORRECTEMENT !');
      console.log('\n🎯 Pour voir les données:');
      console.log('   → http://localhost:3000/super-admin/postes-emploi');
      console.log('   → Cliquer sur l\'onglet "Vue d\'ensemble"');
    } else {
      console.log('❌ Certaines statistiques ne se chargent pas');
      console.log('\n🔧 Vérifiez:');
      console.log('   • Le serveur de développement est actif');
      console.log('   • L\'API /api/rh/statistiques fonctionne');
    }

    return toutFonctionne;

  } catch (error) {
    console.error('❌ Erreur:', error instanceof Error ? error.message : 'Erreur inconnue');
    console.log('\n🔧 Vérifiez que le serveur est démarré sur localhost:3000');
    return false;
  }
}

// Exécution
verifierVueEnsemble()
  .then(success => process.exit(success ? 0 : 1))
  .catch(() => process.exit(1));
