/**
 * VÉRIFICATION DES LIENS DE NAVIGATION
 * Vérifie que tous les liens du menu sidebar correspondent à des pages existantes
 */

const fs = require('fs');
const path = require('path');

const navigationItems = [
  // Dashboard
  '/super-admin/dashboard-unified',

  // Organismes
  '/super-admin/organismes',
  '/super-admin/structure-administrative',
  '/super-admin/relations',
  '/super-admin/communications',

  // Utilisateurs
  '/super-admin/utilisateurs',
  '/super-admin/gestion-comptes',
  '/super-admin/restructuration-comptes',
  '/super-admin/fonctionnaires-attente',
  '/super-admin/postes-administratifs',

  // Services
  '/super-admin/services',
  '/super-admin/configuration',

  // Analytics
  '/super-admin/analytics',
  '/super-admin/systeme',
  '/super-admin/base-donnees',

  // Outils

  '/super-admin/test-data',

];

function checkNavigationLinks() {
  console.log('🔍 VÉRIFICATION DES LIENS DE NAVIGATION\n');
  console.log('=' .repeat(80));

  let existingPages = 0;
  let missingPages = 0;
  const missingPaths = [];

  navigationItems.forEach(route => {
    // Convertir le route en chemin de fichier
    const filePath = `app${route}/page.tsx`;
    const fullPath = path.join(process.cwd(), filePath);

    if (fs.existsSync(fullPath)) {
      console.log(`✅ ${route} → ${filePath}`);
      existingPages++;
    } else {
      console.log(`❌ ${route} → ${filePath} (MANQUANT)`);
      missingPages++;
      missingPaths.push(route);
    }
  });

  console.log('\n📊 RÉSUMÉ');
  console.log('-'.repeat(60));
  console.log(`✅ Pages existantes: ${existingPages}`);
  console.log(`❌ Pages manquantes: ${missingPages}`);
  console.log(`📈 Taux de complétude: ${Math.round((existingPages / navigationItems.length) * 100)}%`);

  if (missingPaths.length > 0) {
    console.log('\n📋 PAGES À CRÉER');
    console.log('-'.repeat(60));
    missingPaths.forEach(route => {
      console.log(`- ${route}`);
    });
  } else {
    console.log('\n🎉 Toutes les pages de navigation existent !');
  }

  return { existingPages, missingPages, missingPaths };
}

// Exécuter la vérification
const result = checkNavigationLinks();

// Créer un rapport
const report = {
  timestamp: new Date().toISOString(),
  totalRoutes: navigationItems.length,
  existingPages: result.existingPages,
  missingPages: result.missingPages,
  missingPaths: result.missingPaths,
  completionRate: Math.round((result.existingPages / navigationItems.length) * 100)
};

fs.writeFileSync('navigation-check-report.json', JSON.stringify(report, null, 2));
console.log('\n📄 Rapport généré: navigation-check-report.json');
