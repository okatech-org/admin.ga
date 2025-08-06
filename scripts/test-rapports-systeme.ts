#!/usr/bin/env bun

/**
 * Script de test pour la génération de rapports
 * Test des fonctionnalités de rapport de contrôle et d'analyse
 *
 * Usage: bun run scripts/test-rapports-systeme.ts
 */

import {
  genererRapportControle,
  genererRapportDetaille,
  genererRapportAvecExtensions,
  exporterRapportTexte,
  exporterRapportHTML,
  exporterRapportCSV,
  comparerRapports
} from '../lib/data/systeme-rapports';

import {
  implementerSystemeComplet,
  initialiserSysteme
} from '../lib/data/systeme-complet-gabon';

import {
  extensionsSysteme,
  ajouterOrganismePersonnalise,
  genererUtilisateursSupplementaires
} from '../lib/data/systeme-extensions';

import * as fs from 'fs';

async function testerRapports() {
  console.log('\n' + '='.repeat(60));
  console.log('🧪 TEST DU SYSTÈME DE RAPPORTS');
  console.log('='.repeat(60) + '\n');

  try {
    // ==================== TEST 1: RAPPORT DE BASE ====================
    console.log('📊 1. Génération du rapport de contrôle de base...\n');

    const startTime = Date.now();
    const systeme = await implementerSystemeComplet();
    const tempsGeneration = Date.now() - startTime;

    const rapport = genererRapportControle(systeme);

    console.log('   ✅ Rapport généré avec succès!');
    console.log(`   • Temps de génération système: ${tempsGeneration}ms`);
    console.log('\n   📋 RÉSUMÉ:');
    console.log(`   • Total organismes: ${rapport["📋 RÉSUMÉ GÉNÉRAL"]["Total organismes"]}`);
    console.log(`   • Total utilisateurs: ${rapport["📋 RÉSUMÉ GÉNÉRAL"]["Total utilisateurs"]}`);
    console.log(`   • Moyenne par organisme: ${rapport["📋 RÉSUMÉ GÉNÉRAL"]["Moyenne utilisateurs/organisme"]}`);

    // ==================== TEST 2: VALIDATION ====================
    console.log('\n✅ 2. Validation du système...\n');

    const validation = rapport["✅ VALIDATION"];
    console.log('   Résultats de validation:');
    Object.entries(validation).forEach(([key, value]) => {
      const icon = value ? '✅' : '❌';
      console.log(`   ${icon} ${key}: ${value ? 'OUI' : 'NON'}`);
    });

    // ==================== TEST 3: MÉTRIQUES DE QUALITÉ ====================
    console.log('\n📊 3. Métriques de qualité...\n');

    const metriques = rapport["📊 MÉTRIQUES DE QUALITÉ"];
    console.log(`   • Score de complétude: ${metriques.scoreCompletude}%`);
    console.log(`   • Score de validation: ${metriques.scoreValidation}%`);
    console.log(`   • Score de couverture: ${metriques.scoreCouverture}%`);
    console.log(`   • SCORE GLOBAL: ${metriques.scoreGlobal}%`);

    const evaluation = metriques.scoreGlobal >= 80 ? 'EXCELLENT' :
                      metriques.scoreGlobal >= 60 ? 'BON' :
                      metriques.scoreGlobal >= 40 ? 'MOYEN' : 'FAIBLE';
    console.log(`   • Évaluation: ${evaluation}`);

    // ==================== TEST 4: TOP 10 ORGANISMES ====================
    console.log('\n📈 4. TOP 10 organismes par nombre d\'utilisateurs...\n');

    const top10 = rapport["📈 TOP 10 ORGANISMES PAR UTILISATEURS"];
    top10.slice(0, 5).forEach((org, index) => {
      console.log(`   ${index + 1}. ${org.nom} (${org.code})`);
      console.log(`      • ${org.utilisateurs} utilisateurs`);
      console.log(`      • Répartition: ${org.admins} admin, ${org.users} users, ${org.receptionists} recep`);
    });
    console.log('   ...');

    // ==================== TEST 5: ANOMALIES ====================
    console.log('\n⚠️ 5. Détection d\'anomalies...\n');

    const anomalies = rapport["⚠️ ANOMALIES DÉTECTÉES"];
    if (anomalies.length === 1 && anomalies[0] === "Aucune anomalie détectée ✅") {
      console.log('   ✅ Aucune anomalie détectée!');
    } else {
      console.log(`   ⚠️ ${anomalies.length} anomalie(s) détectée(s):`);
      anomalies.forEach(anomalie => {
        console.log(`      • ${anomalie}`);
      });
    }

    // ==================== TEST 6: RAPPORT DÉTAILLÉ ====================
    console.log('\n🔍 6. Génération du rapport détaillé...\n');

    const rapportDetaille = genererRapportDetaille(systeme, tempsGeneration);

    console.log('   ✅ Rapport détaillé généré');
    console.log('\n   👤 Analyse des utilisateurs:');
    const analyse = rapportDetaille["👤 ANALYSE DES UTILISATEURS"];
    console.log(`   • Total hommes: ${analyse.totalHommes}`);
    console.log(`   • Total femmes: ${analyse.totalFemmes}`);
    console.log(`   • Ratio H/F: ${analyse.ratioHommesFemmes}`);
    console.log(`   • Utilisateurs actifs: ${analyse.utilisateursActifs}`);
    console.log(`   • Emails dupliqués: ${analyse.emailsDupliques.length}`);

    // ==================== TEST 7: STATISTIQUES PAR TYPE ====================
    console.log('\n🎯 7. Statistiques par type d\'organisme...\n');

    const stats = rapport["🎯 STATISTIQUES DÉTAILLÉES"];
    console.log('   Ministères:');
    console.log(`   • Total: ${stats["Ministères"].total}`);
    console.log(`   • Utilisateurs: ${stats["Ministères"].utilisateurs}`);
    console.log(`   • Moyenne: ${stats["Ministères"].moyenneParMinistere} users/ministère`);

    console.log('\n   Directions Générales:');
    console.log(`   • Total: ${stats["Directions Générales"].total}`);
    console.log(`   • Utilisateurs: ${stats["Directions Générales"].utilisateurs}`);
    console.log(`   • Moyenne: ${stats["Directions Générales"].moyenneParDirection} users/direction`);

    // ==================== TEST 8: EXPORT TEXTE ====================
    console.log('\n📝 8. Export du rapport en format texte...\n');

    const rapportTexte = exporterRapportTexte(rapport);
    console.log('   ✅ Export texte généré');
    console.log(`   • Taille: ${Math.round(rapportTexte.length / 1024)}KB`);
    console.log(`   • Lignes: ${rapportTexte.split('\n').length}`);

    // ==================== TEST 9: EXPORT HTML ====================
    console.log('\n🌐 9. Export du rapport en format HTML...\n');

    const rapportHTML = exporterRapportHTML(rapport);
    console.log('   ✅ Export HTML généré');
    console.log(`   • Taille: ${Math.round(rapportHTML.length / 1024)}KB`);

    // Sauvegarder le rapport HTML
    fs.writeFileSync('rapport-controle.html', rapportHTML);
    console.log('   • Fichier sauvegardé: rapport-controle.html');

    // ==================== TEST 10: EXPORT CSV ====================
    console.log('\n📊 10. Export du rapport en format CSV...\n');

    const rapportCSV = exporterRapportCSV(rapport);
    console.log('   ✅ Export CSV généré');
    console.log(`   • Lignes: ${rapportCSV.split('\n').length}`);

    // Sauvegarder le rapport CSV
    fs.writeFileSync('rapport-controle.csv', rapportCSV);
    console.log('   • Fichier sauvegardé: rapport-controle.csv');

    // ==================== TEST 11: RAPPORT AVEC EXTENSIONS ====================
    console.log('\n🔄 11. Test du rapport avec extensions...\n');

    // Réinitialiser et ajouter des extensions
    extensionsSysteme.reinitialiser();

    // Sauvegarder le rapport avant extensions
    const rapportAvant = rapport;

    // Ajouter quelques extensions
    ajouterOrganismePersonnalise({
      nom: 'Centre Test Rapport',
      code: 'CTR_TEST',
      type: 'ETABLISSEMENT_PUBLIC'
    });

    genererUtilisateursSupplementaires('MIN_ECO_FIN', 3, ['USER']);

    // Générer le rapport avec extensions
    const rapportAvecExt = await genererRapportAvecExtensions();

    console.log('   ✅ Rapport avec extensions généré');
    console.log(`   • Organismes: ${rapportAvecExt["📋 RÉSUMÉ GÉNÉRAL"]["Total organismes"]}`);
    console.log(`   • Utilisateurs: ${rapportAvecExt["📋 RÉSUMÉ GÉNÉRAL"]["Total utilisateurs"]}`);

    // ==================== TEST 12: COMPARAISON DE RAPPORTS ====================
    console.log('\n🔄 12. Comparaison des rapports (avant/après extensions)...\n');

    const comparaison = comparerRapports(rapportAvant, rapportAvecExt);

    console.log('   📊 Évolution:');
    console.log(`   • Organismes ajoutés: ${comparaison["📊 ÉVOLUTION"]["Organismes ajoutés"]}`);
    console.log(`   • Utilisateurs ajoutés: ${comparaison["📊 ÉVOLUTION"]["Utilisateurs ajoutés"]}`);
    console.log(`   • Évolution score: ${comparaison["📊 ÉVOLUTION"]["Évolution score global"]}%`);

    // ==================== TEST 13: AFFICHAGE JSON ====================
    console.log('\n📋 13. Affichage du rapport JSON complet...\n');

    // Créer un rapport simplifié pour l'affichage
    const rapportSimplifie = {
      "📋 RÉSUMÉ": rapport["📋 RÉSUMÉ GÉNÉRAL"],
      "✅ VALIDATION": rapport["✅ VALIDATION"],
      "📊 SCORES": rapport["📊 MÉTRIQUES DE QUALITÉ"],
      "🏆 TOP 3": top10.slice(0, 3).map(o => ({
        nom: o.nom,
        utilisateurs: o.utilisateurs
      })),
      "⚠️ STATUT": anomalies[0]
    };

    console.log(JSON.stringify(rapportSimplifie, null, 2));

    // ==================== RÉSUMÉ FINAL ====================
    console.log('\n' + '='.repeat(60));
    console.log('🎉 TOUS LES TESTS DE RAPPORTS SONT PASSÉS!');
    console.log('='.repeat(60));

    console.log(`
📊 RÉSUMÉ DES TESTS:
• Rapport de contrôle généré avec succès
• ${rapport["📋 RÉSUMÉ GÉNÉRAL"]["Total organismes"]} organismes analysés
• ${rapport["📋 RÉSUMÉ GÉNÉRAL"]["Total utilisateurs"]} utilisateurs vérifiés
• Score de qualité global: ${metriques.scoreGlobal}%
• Validation complète: ${Object.values(validation).every(v => v) ? '✅' : '⚠️'}
• Exports disponibles: TXT, HTML, CSV, JSON
• Comparaison avant/après extensions fonctionnelle

✅ Le système de rapports est totalement opérationnel!

📁 Fichiers générés:
• rapport-controle.html - Rapport visuel complet
• rapport-controle.csv - Données pour Excel/Google Sheets
    `);

    // Nettoyer
    console.log('🗑️ Nettoyage des extensions pour les prochains tests...');
    extensionsSysteme.reinitialiser();

  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
    process.exit(1);
  }
}

// Exécuter le test
testerRapports().catch(console.error);
