/**
 * VÉRIFICATION DES LIENS DE NAVIGATION
 * Vérifie que tous les liens du menu pointent vers des pages existantes
 */

const fs = require('fs');
const path = require('path');

// Fonction pour vérifier si un fichier page.tsx existe
function checkPageExists(href) {
  // Convertir le href en chemin de fichier
  const pagePath = path.join('app', href.replace('/super-admin/', 'super-admin/'), 'page.tsx');
  return fs.existsSync(pagePath);
}

// Links extraits du sidebar hiérarchique
const navigationLinks = [
  // Dashboard
  { title: 'Dashboard', href: '/super-admin/dashboard-unified' },

  // Organismes
  { title: 'Vue d\'Ensemble Organismes', href: '/super-admin/organismes' },
  { title: 'Structure Administrative', href: '/super-admin/structure-administrative' },
  { title: 'Relations Inter-Organismes', href: '/super-admin/relations' },
  { title: 'Communications Inter-Administration', href: '/super-admin/communications' },

  // Utilisateurs
  { title: 'Vue d\'Ensemble Utilisateurs', href: '/super-admin/utilisateurs' },
  { title: 'Création Comptes', href: '/super-admin/gestion-comptes' },
  { title: 'Restructuration', href: '/super-admin/restructuration-comptes' },
  { title: 'Fonctionnaires en Attente', href: '/super-admin/fonctionnaires-attente' },
  { title: 'Postes & Fonctions', href: '/super-admin/postes-administratifs' },

  // Services
  { title: 'Vue d\'Ensemble Services', href: '/super-admin/services' },
  { title: 'Configuration', href: '/super-admin/configuration' },

  // Analytics
  { title: 'Tableau de Bord Analytics', href: '/super-admin/analytics' },
  { title: 'Statistiques Système', href: '/super-admin/systeme' },
  { title: 'Base de Données', href: '/super-admin/base-donnees' },

  // Outils

  { title: 'Test Data', href: '/super-admin/test-data' },

];

console.log('🔍 VÉRIFICATION DES LIENS DE NAVIGATION\n');
console.log('=' .repeat(80));

let validLinks = 0;
let missingPages = [];

navigationLinks.forEach(link => {
  const exists = checkPageExists(link.href);
  const status = exists ? '✅' : '❌';
  const pagePath = link.href.replace('/super-admin/', 'app/super-admin/') + '/page.tsx';

  console.log(`${status} ${link.title}`);
  console.log(`   ${link.href} → ${pagePath}`);

  if (exists) {
    validLinks++;
  } else {
    missingPages.push({
      title: link.title,
      href: link.href,
      path: pagePath
    });
  }
  console.log('');
});

console.log('\n📊 RÉSUMÉ');
console.log('-'.repeat(60));
console.log(`✅ Pages existantes: ${validLinks}/${navigationLinks.length}`);
console.log(`❌ Pages manquantes: ${missingPages.length}`);
console.log(`📈 Taux de couverture: ${Math.round((validLinks/navigationLinks.length)*100)}%`);

if (missingPages.length > 0) {
  console.log('\n🚨 PAGES MANQUANTES À CRÉER:');
  console.log('-'.repeat(60));
  missingPages.forEach(page => {
    console.log(`📄 ${page.title}`);
    console.log(`   Chemin: ${page.path}`);
    console.log(`   URL: ${page.href}`);
    console.log('');
  });
}

if (validLinks === navigationLinks.length) {
  console.log('\n✅ TOUS LES LIENS DE NAVIGATION SONT VALIDES !');
} else {
  console.log('\n⚠️ CERTAINES PAGES MANQUENT ET DOIVENT ÊTRE CRÉÉES');
}
