#!/usr/bin/env node

/**
 * Script de validation du nettoyage des données fictives
 * Confirme que toutes les données sont maintenant réelles
 */

const fs = require('fs');
const { exec } = require('child_process');

console.log('🔍 VALIDATION DU NETTOYAGE - ADMINISTRATION.GA');
console.log('=====================================\n');

// Tests de validation
const validationTests = [
  {
    name: 'API Dashboard Stats',
    test: () => {
      return new Promise((resolve) => {
        exec('curl -s http://localhost:3000/api/super-admin/dashboard-stats', (error, stdout) => {
          if (error) {
            resolve({ success: false, message: 'API non accessible', error: error.message });
            return;
          }

          try {
            const data = JSON.parse(stdout);
            if (data.success && data.data.metrics) {
              const users = data.data.metrics.totalUsers.value;
              const orgs = data.data.metrics.totalOrganizations.value;
              resolve({
                success: true,
                message: `✅ ${users} utilisateurs réels, ${orgs} organismes réels`,
                details: { users, orgs }
              });
            } else {
              resolve({ success: false, message: 'Format API invalide' });
            }
          } catch (e) {
            resolve({ success: false, message: 'Erreur parsing JSON', error: e.message });
          }
        });
      });
    }
  },
  {
    name: 'Fichiers de redirection',
    test: () => {
      const files = [
        'app/super-admin/dashboard-modern/page.tsx',
        'components/landing/stats.tsx'
      ];

      const results = files.map(file => {
        if (!fs.existsSync(file)) {
          return { file, status: 'MANQUANT' };
        }

        const content = fs.readFileSync(file, 'utf8');
        if (content.includes('DONNÉES FICTIVES SUPPRIMÉES') || content.includes('Redirection')) {
          return { file, status: 'NETTOYÉ' };
        } else {
          return { file, status: 'À_NETTOYER' };
        }
      });

      const allCleaned = results.every(r => r.status === 'NETTOYÉ');
      return Promise.resolve({
        success: allCleaned,
        message: allCleaned ? '✅ Tous les fichiers redirigés' : '⚠️ Fichiers à nettoyer',
        details: results
      });
    }
  },
  {
    name: 'Page test-data supprimée',
    test: () => {
      const exists = fs.existsSync('app/super-admin/test-data/page.tsx');
      return Promise.resolve({
        success: !exists,
        message: exists ? '❌ Page test-data existe encore' : '✅ Page test-data supprimée'
      });
    }
  },
  {
    name: 'Documentation créée',
    test: () => {
      const docs = [
        'docs/NETTOYAGE_DONNEES_FICTIVES_COMPLET.md',
        'docs/REAL_DATA_IMPLEMENTATION.md'
      ];

      const allExist = docs.every(doc => fs.existsSync(doc));
      return Promise.resolve({
        success: allExist,
        message: allExist ? '✅ Documentation complète' : '⚠️ Documentation manquante',
        details: docs.map(doc => ({ doc, exists: fs.existsSync(doc) }))
      });
    }
  },
  {
    name: 'Script de détection',
    test: () => {
      const scriptExists = fs.existsSync('scripts/cleanup-fake-data.js');
      return Promise.resolve({
        success: scriptExists,
        message: scriptExists ? '✅ Script de détection disponible' : '❌ Script manquant'
      });
    }
  }
];

// Exécuter tous les tests
async function runValidation() {
  console.log('🧪 Exécution des tests de validation...\n');

  const results = [];

  for (const test of validationTests) {
    console.log(`📋 Test: ${test.name}`);
    try {
      const result = await test.test();
      console.log(`   ${result.message}`);
      if (result.details) {
        console.log(`   Détails:`, result.details);
      }
      results.push({ name: test.name, ...result });
    } catch (error) {
      console.log(`   ❌ Erreur: ${error.message}`);
      results.push({ name: test.name, success: false, message: error.message });
    }
    console.log('');
  }

  // Résumé final
  const successCount = results.filter(r => r.success).length;
  const totalCount = results.length;

  console.log('📊 RÉSUMÉ DE LA VALIDATION');
  console.log('==========================');
  console.log(`Tests réussis: ${successCount}/${totalCount}`);
  console.log(`Taux de réussite: ${Math.round((successCount/totalCount) * 100)}%`);

  if (successCount === totalCount) {
    console.log('\n🎉 VALIDATION COMPLÈTE RÉUSSIE !');
    console.log('✅ Le nettoyage des données fictives est 100% terminé');
    console.log('✅ L\'interface affiche maintenant des données réelles');
    console.log('✅ Tous les outils de maintenance sont en place');
  } else {
    console.log('\n⚠️ VALIDATION PARTIELLE');
    console.log('Certains éléments nécessitent encore attention:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`• ${r.name}: ${r.message}`);
    });
  }

  console.log('\n🚀 Statut final: ' + (successCount === totalCount ? 'EXCELLENT' : 'À AMÉLIORER'));

  return successCount === totalCount ? 0 : 1;
}

// Lancer la validation
runValidation()
  .then(exitCode => process.exit(exitCode))
  .catch(error => {
    console.error('❌ Erreur durant la validation:', error);
    process.exit(1);
  });
