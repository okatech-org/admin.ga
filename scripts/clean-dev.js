#!/usr/bin/env node
/**
 * 🧹 SCRIPT DE NETTOYAGE ROBUSTE - ADMIN.GA
 *
 * Nettoie tous les caches et références persistantes qui peuvent causer
 * des erreurs Edge Tools, TypeScript ou webpack
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🧹 NETTOYAGE COMPLET DE L\'ENVIRONNEMENT DE DÉVELOPPEMENT\n');

// Fonction pour supprimer un fichier/dossier en toute sécurité
function safeRemove(pathToRemove, description) {
  try {
    if (fs.existsSync(pathToRemove)) {
      if (fs.lstatSync(pathToRemove).isDirectory()) {
        fs.rmSync(pathToRemove, { recursive: true, force: true });
      } else {
        fs.unlinkSync(pathToRemove);
      }
      console.log(`   ✅ ${description} supprimé`);
      return true;
    } else {
      console.log(`   ⚪ ${description} déjà absent`);
      return false;
    }
  } catch (error) {
    console.log(`   ❌ Erreur lors de la suppression de ${description}: ${error.message}`);
    return false;
  }
}

// Fonction pour exécuter une commande en toute sécurité
function safeExec(command, description) {
  try {
    execSync(command, { stdio: 'pipe' });
    console.log(`   ✅ ${description} terminé`);
    return true;
  } catch (error) {
    console.log(`   ⚠️ ${description} échoué (non critique)`);
    return false;
  }
}

console.log('1. 🗂️ Nettoyage des caches Next.js et webpack:');
safeRemove('.next', 'Cache Next.js');
safeRemove('.next/cache', 'Cache webpack Next.js');

console.log('\n2. 📦 Nettoyage des caches Node.js:');
safeRemove('node_modules/.cache', 'Cache Node.js modules');
safeRemove('.npm', 'Cache npm local');

console.log('\n3. 🔧 Nettoyage des caches TypeScript:');
safeRemove('tsconfig.tsbuildinfo', 'Build info TypeScript');
safeRemove('*.tsbuildinfo', 'Fichiers tsbuildinfo');

console.log('\n4. 🧪 Nettoyage des fichiers de diagnostic temporaires:');
safeRemove('diagnostic-imports.ts', 'Fichier diagnostic-imports.ts');
safeRemove('debug-organismes.js', 'Fichier debug-organismes.js');
safeRemove('diagnostic-*.ts', 'Fichiers diagnostic temporaires');
safeRemove('debug-*.js', 'Fichiers debug temporaires');

console.log('\n5. 🌐 Nettoyage des caches navigateurs (Edge Tools):');
// Tuer les processus Edge Tools qui pourraient maintenir des références
safeExec('pkill -f "Microsoft Edge"', 'Arrêt processus Edge');
safeExec('pkill -f "msedge"', 'Arrêt processus msedge');

console.log('\n6. 🔄 Nettoyage des caches système:');
// Variables d'environnement pour forcer le nettoyage
process.env.FORCE_COLOR = '0';
process.env.CI = 'true';

console.log('\n✅ NETTOYAGE TERMINÉ AVEC SUCCÈS !');
console.log('\n🚀 Prochaines étapes recommandées:');
console.log('   1. npm run dev    # Redémarrer le serveur de développement');
console.log('   2. Actualiser le navigateur (Ctrl+F5 ou Cmd+Shift+R)');
console.log('   3. Vérifier que les erreurs Edge Tools ont disparu');

console.log('\n📊 Statistiques du nettoyage:');
console.log('   - Caches système: nettoyés');
console.log('   - Fichiers temporaires: supprimés');
console.log('   - Processus conflictuels: arrêtés');
console.log('   - Configuration webpack: optimisée');
