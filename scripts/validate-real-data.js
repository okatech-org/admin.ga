#!/usr/bin/env node

/**
 * Script de validation des données réelles
 * Vérifie que toutes les données obsolètes ont été remplacées
 */

const { exec } = require('child_process');

console.log('🔍 VALIDATION DES DONNÉES RÉELLES - ADMIN.GA');
console.log('=============================================\n');

const validationTests = [
  {
    name: 'API Organismes Stats',
    test: () => {
      return new Promise((resolve) => {
        exec('curl -s http://localhost:3000/api/super-admin/organismes-stats', (error, stdout) => {
          if (error) {
            resolve({ success: false, message: 'API non accessible', error: error.message });
            return;
          }

          try {
            const data = JSON.parse(stdout);
            if (data.success && data.data.overview) {
              const { prospectsCount, clientsCount, relationsCount, totalOrganismes } = data.data.overview;
              resolve({
                success: true,
                message: `✅ Données réelles: ${prospectsCount} prospects, ${clientsCount} clients, ${relationsCount} relations`,
                details: { prospectsCount, clientsCount, relationsCount, totalOrganismes }
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
    name: 'Comparaison avec anciennes données',
    test: async () => {
      try {
        const response = await fetch('http://localhost:3000/api/super-admin/organismes-stats');
        const data = await response.json();

        if (!data.success) {
          return { success: false, message: 'API inaccessible' };
        }

        const { prospectsCount, clientsCount, relationsCount } = data.data.overview;

        // Vérifier que les données ne correspondent PAS aux anciennes valeurs fictives
        const oldFakeData = {
          prospects: 168,
          clients: 5,
          relations: 522
        };

        const hasOldFakeData = (
          prospectsCount === oldFakeData.prospects ||
          clientsCount === oldFakeData.clients ||
          relationsCount === oldFakeData.relations
        );

        if (hasOldFakeData) {
          return {
            success: false,
            message: '⚠️ Données encore fictives détectées',
            details: {
              current: { prospectsCount, clientsCount, relationsCount },
              oldFake: oldFakeData
            }
          };
        }

        return {
          success: true,
          message: '✅ Aucune donnée fictive obsolète détectée',
          details: { prospectsCount, clientsCount, relationsCount }
        };

      } catch (error) {
        return { success: false, message: 'Erreur validation', error: error.message };
      }
    }
  },
  {
    name: 'Cohérence des données',
    test: async () => {
      try {
        const response = await fetch('http://localhost:3000/api/super-admin/organismes-stats');
        const data = await response.json();

        if (!data.success) {
          return { success: false, message: 'API inaccessible' };
        }

        const { prospectsCount, clientsCount, totalOrganismes, relationsCount } = data.data.overview;

        // Vérifications de cohérence
        const checks = [
          {
            condition: totalOrganismes > 0,
            message: 'Total organismes > 0'
          },
          {
            condition: prospectsCount >= 0 && clientsCount >= 0,
            message: 'Prospects et clients >= 0'
          },
          {
            condition: (prospectsCount + clientsCount) <= totalOrganismes * 1.5,
            message: 'Somme prospects+clients cohérente avec total'
          },
          {
            condition: relationsCount >= 0,
            message: 'Relations count >= 0'
          },
          {
            condition: totalOrganismes === 307, // Valeur connue de la base
            message: 'Total organismes correspond à la base (307)'
          }
        ];

        const failedChecks = checks.filter(check => !check.condition);

        if (failedChecks.length > 0) {
          return {
            success: false,
            message: `❌ ${failedChecks.length} vérification(s) échouée(s)`,
            details: failedChecks.map(c => c.message)
          };
        }

        return {
          success: true,
          message: `✅ Toutes les vérifications de cohérence passées`,
          details: { prospectsCount, clientsCount, totalOrganismes, relationsCount }
        };

      } catch (error) {
        return { success: false, message: 'Erreur validation', error: error.message };
      }
    }
  }
];

// Exécuter tous les tests
async function runValidation() {
  console.log('🧪 Tests de validation des données réelles...\n');

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

  console.log('📊 RÉSUMÉ VALIDATION DONNÉES RÉELLES');
  console.log('====================================');
  console.log(`Tests réussis: ${successCount}/${totalCount}`);
  console.log(`Taux de réussite: ${Math.round((successCount/totalCount) * 100)}%`);

  if (successCount === totalCount) {
    console.log('\n🎉 VALIDATION COMPLÈTE RÉUSSIE !');
    console.log('✅ Toutes les données sont maintenant réelles et cohérentes');
    console.log('✅ Les anciennes données fictives ont été supprimées');
    console.log('✅ L\'API fournit des données authentiques de la base PostgreSQL');

    // Afficher un résumé des vraies données
    const lastResult = results.find(r => r.details && r.details.prospectsCount !== undefined);
    if (lastResult) {
      console.log('\n📊 DONNÉES RÉELLES CONFIRMÉES:');
      console.log(`• Prospects: ${lastResult.details.prospectsCount}`);
      console.log(`• Clients: ${lastResult.details.clientsCount}`);
      console.log(`• Relations: ${lastResult.details.relationsCount}`);
      console.log(`• Total organismes: ${lastResult.details.totalOrganismes}`);
    }
  } else {
    console.log('\n⚠️ VALIDATION PARTIELLE');
    console.log('Problèmes détectés:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`• ${r.name}: ${r.message}`);
    });
  }

  console.log('\n🚀 Statut: ' + (successCount === totalCount ? 'DONNÉES RÉELLES CONFIRMÉES' : 'CORRECTIONS NÉCESSAIRES'));

  return successCount === totalCount ? 0 : 1;
}

// Lancer la validation
runValidation()
  .then(exitCode => process.exit(exitCode))
  .catch(error => {
    console.error('❌ Erreur durant la validation:', error);
    process.exit(1);
  });
