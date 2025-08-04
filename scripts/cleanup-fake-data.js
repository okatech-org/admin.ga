#!/usr/bin/env node

/**
 * Script de nettoyage des données fictives obsolètes
 * Supprime toutes les données hardcodées polluantes du code
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🧹 NETTOYAGE DES DONNÉES FICTIVES - ADMIN.GA');
console.log('============================================\n');

// Patterns de données fictives à détecter
const FAKE_DATA_PATTERNS = [
  /value.*["\'][\d,]+["\']/, // Valeurs numériques hardcodées
  /Mock\s+data|mock.*data|dummy.*data|fake.*data/i, // Commentaires de données fictives
  /const.*metrics.*=.*\[/i, // Tableaux de métriques hardcodées
  /todayMetrics|dashboardMetrics|stats.*=.*\[/i, // Variables de stats
  /["\']Organismes?\s+Actifs?["\']/, // Textes d'organismes actifs
  /["\']Utilisateurs?\s+(Connectés?|Totaux?)["\']/, // Textes d'utilisateurs
  /value.*["\'][\d,]+\+?["\']/, // Valeurs avec format type "50,000+"
];

// Fichiers déjà nettoyés ou à ignorer
const CLEANED_FILES = [
  'app/super-admin/page.tsx', // Nouveau fichier avec API
  'app/super-admin/dashboard-modern/page.tsx', // Redirection
  'components/landing/stats.tsx', // Warning component
  'components/landing/stats-api.tsx', // Nouveau avec API
];

// Dossiers à analyser
const DIRECTORIES_TO_SCAN = [
  'app',
  'components',
  'lib',
  'hooks'
];

let totalFilesScanned = 0;
let filesWithFakeData = [];
let filesCleaned = [];

function scanFile(filePath) {
  totalFilesScanned++;

  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) {
    return;
  }

  if (CLEANED_FILES.some(cleanedFile => filePath.includes(cleanedFile))) {
    return;
  }

  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');

    let hasIssues = false;
    const issues = [];

    lines.forEach((line, index) => {
      FAKE_DATA_PATTERNS.forEach(pattern => {
        if (pattern.test(line)) {
          hasIssues = true;
          issues.push({
            line: index + 1,
            content: line.trim(),
            pattern: pattern.toString()
          });
        }
      });
    });

    if (hasIssues) {
      filesWithFakeData.push({
        file: filePath,
        issues: issues
      });
    }

  } catch (error) {
    console.error(`❌ Erreur lecture fichier ${filePath}:`, error.message);
  }
}

function scanDirectory(dirPath) {
  try {
    const items = fs.readdirSync(dirPath);

    items.forEach(item => {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        scanDirectory(fullPath);
      } else if (stat.isFile()) {
        scanFile(fullPath);
      }
    });
  } catch (error) {
    console.error(`❌ Erreur scan dossier ${dirPath}:`, error.message);
  }
}

console.log('🔍 Analyse des fichiers...\n');

// Scanner tous les dossiers
DIRECTORIES_TO_SCAN.forEach(dir => {
  if (fs.existsSync(dir)) {
    console.log(`📂 Scan: ${dir}/`);
    scanDirectory(dir);
  }
});

console.log(`\n📊 RÉSULTATS DU SCAN`);
console.log(`==================`);
console.log(`• Fichiers analysés: ${totalFilesScanned}`);
console.log(`• Fichiers avec données fictives: ${filesWithFakeData.length}`);

if (filesWithFakeData.length > 0) {
  console.log(`\n⚠️  FICHIERS AVEC DONNÉES FICTIVES DÉTECTÉES:`);
  console.log(`===========================================`);

  filesWithFakeData.forEach(({ file, issues }) => {
    console.log(`\n📄 ${file}`);
    issues.slice(0, 3).forEach(issue => { // Limiter à 3 issues par fichier
      console.log(`   Ligne ${issue.line}: ${issue.content.substring(0, 60)}${issue.content.length > 60 ? '...' : ''}`);
    });
    if (issues.length > 3) {
      console.log(`   ... et ${issues.length - 3} autres occurrences`);
    }
  });
}

console.log(`\n✅ FICHIERS DÉJÀ NETTOYÉS:`);
console.log(`==========================`);
CLEANED_FILES.forEach(file => {
  console.log(`• ${file}`);
});

console.log(`\n📋 ACTIONS RECOMMANDÉES:`);
console.log(`========================`);
console.log(`1. Remplacer les données hardcodées par des appels API`);
console.log(`2. Utiliser '/api/super-admin/dashboard-stats' pour les métriques`);
console.log(`3. Ajouter des TODOs avec ⚠️ pour les données temporaires`);
console.log(`4. Supprimer les valeurs fictives et les remplacer par du loading`);

if (filesWithFakeData.length === 0) {
  console.log(`\n🎉 EXCELLENT ! Aucune donnée fictive détectée !`);
  console.log(`   Le code est propre et utilise des données réelles.`);
} else {
  console.log(`\n⚠️  ${filesWithFakeData.length} fichier(s) nécessitent encore un nettoyage.`);
}

console.log(`\n🚀 Nettoyage terminé !`);
console.log(`====================\n`);

// Retourner le code d'erreur si des problèmes sont trouvés
process.exit(filesWithFakeData.length > 0 ? 1 : 0);
