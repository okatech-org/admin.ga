#!/usr/bin/env node

/**
 * Script de nettoyage des caches IDE et des fichiers temporaires
 * Résout les problèmes de diagnostic et de références obsolètes
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🧹 Nettoyage des caches IDE et fichiers temporaires...');

// Dossiers de cache à supprimer
const cacheDirs = [
  '.next',
  'node_modules/.cache',
  '.vscode/.ropeproject',
  '.idea',
  '*.tmp',
  'tsconfig.tsbuildinfo'
];

// Supprimer les caches
cacheDirs.forEach(dir => {
  try {
    if (fs.existsSync(dir)) {
      execSync(`rm -rf ${dir}`, { stdio: 'inherit' });
      console.log(`✅ Supprimé: ${dir}`);
    }
  } catch (error) {
    console.log(`⚠️  Erreur lors de la suppression de ${dir}:`, error.message);
  }
});

// Nettoyer le cache TypeScript
try {
  execSync('npx tsc --build --clean', { stdio: 'inherit' });
  console.log('✅ Cache TypeScript nettoyé');
} catch (error) {
  console.log('⚠️  TypeScript clean échoué (normal si pas de build)');
}

// Régénérer Prisma Client
try {
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ Prisma Client régénéré');
} catch (error) {
  console.log('⚠️  Erreur Prisma:', error.message);
}

console.log('\n🎉 Nettoyage terminé !');
console.log('💡 Actions recommandées :');
console.log('   1. Redémarrer votre IDE (VS Code/Cursor)');
console.log('   2. Recharger la fenêtre (Cmd+R ou Ctrl+R)');
console.log('   3. Désactiver temporairement Microsoft Edge Tools si le problème persiste');
