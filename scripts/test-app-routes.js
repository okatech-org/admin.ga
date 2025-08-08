#!/usr/bin/env node

/**
 * Script de test des routes des applications
 * Usage: node scripts/test-app-routes.js
 */

const { spawn } = require('child_process');
const http = require('http');

const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const BLUE = '\x1b[34m';
const RESET = '\x1b[0m';

function log(color, message) {
  console.log(`${color}${message}${RESET}`);
}

function success(message) {
  log(GREEN, `✅ ${message}`);
}

function error(message) {
  log(RED, `❌ ${message}`);
}

function warning(message) {
  log(YELLOW, `⚠️  ${message}`);
}

function info(message) {
  log(BLUE, `ℹ️  ${message}`);
}

// Routes à tester
const routes = [
  { path: '/', name: 'ADMINISTRATION.GA - Page d\'accueil', app: 'administration' },
  { path: '/admin-web', name: 'Interface Admin Web', app: 'administration' },
  { path: '/demarche', name: 'DEMARCHE.GA - Page d\'accueil', app: 'demarche' },
  { path: '/travail', name: 'TRAVAIL.GA - Page d\'accueil', app: 'travail' },
  { path: '/super-admin', name: 'Super Admin Dashboard', app: 'administration' }
];

function testRoute(port, path) {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:${port}${path}`, (res) => {
      resolve({
        success: res.statusCode >= 200 && res.statusCode < 400,
        statusCode: res.statusCode,
        error: null
      });
    });

    req.on('error', (err) => {
      resolve({
        success: false,
        statusCode: null,
        error: err.message
      });
    });

    req.setTimeout(10000, () => {
      req.destroy();
      resolve({
        success: false,
        statusCode: null,
        error: 'Timeout'
      });
    });
  });
}

function startDevServer() {
  return new Promise((resolve, reject) => {
    info('Démarrage du serveur de développement...');

    const devServer = spawn('npm', ['run', 'dev'], {
      stdio: ['pipe', 'pipe', 'pipe'],
      detached: false
    });

    let output = '';
    let serverReady = false;

    devServer.stdout.on('data', (data) => {
      output += data.toString();
      if (output.includes('localhost:3000') || output.includes('Ready in')) {
        if (!serverReady) {
          serverReady = true;
          success('Serveur de développement prêt !');
          resolve(devServer);
        }
      }
    });

    devServer.stderr.on('data', (data) => {
      const errorText = data.toString();
      if (errorText.includes('Error:') || errorText.includes('EADDRINUSE')) {
        if (!serverReady) {
          warning('Le serveur semble déjà en cours d\'exécution ou il y a une erreur');
          resolve(null); // On continue quand même pour tester
        }
      }
    });

    devServer.on('error', (err) => {
      if (!serverReady) {
        reject(err);
      }
    });

    // Timeout après 60 secondes
    setTimeout(() => {
      if (!serverReady) {
        info('Timeout démarrage serveur - on continue avec les tests');
        resolve(null);
      }
    }, 60000);
  });
}

async function testAllRoutes() {
  console.log('\n🧪 Test des Routes d\'Applications');
  console.log('===================================\n');

  let devServer;
  let totalTests = 0;
  let passedTests = 0;

  try {
    // Démarrer le serveur de développement
    devServer = await startDevServer();

    // Attendre un peu que le serveur soit stable
    await new Promise(resolve => setTimeout(resolve, 5000));

    info('Test des routes...\n');

    for (const route of routes) {
      totalTests++;
      info(`Test: ${route.name} (${route.path})`);

      const result = await testRoute(3000, route.path);

      if (result.success) {
        success(`✓ ${route.name} - Status: ${result.statusCode}`);
        passedTests++;
      } else {
        if (result.error) {
          error(`✗ ${route.name} - Erreur: ${result.error}`);
        } else {
          error(`✗ ${route.name} - Status: ${result.statusCode}`);
        }
      }
    }

  } catch (err) {
    error(`Erreur lors des tests: ${err.message}`);
  } finally {
    if (devServer && devServer.pid) {
      info('\nArrêt du serveur de développement...');
      try {
        process.kill(-devServer.pid, 'SIGTERM');
      } catch (e) {
        // Le processus peut déjà être arrêté
      }
    }
  }

  // Résultats
  console.log('\n📊 Résultats des Tests');
  console.log('=====================\n');

  const percentage = Math.round((passedTests / totalTests) * 100);

  if (percentage >= 90) {
    success(`Tests réussis: ${passedTests}/${totalTests} (${percentage}%)`);
    success('🎉 Toutes les applications sont accessibles !');
  } else if (percentage >= 70) {
    warning(`Tests réussis: ${passedTests}/${totalTests} (${percentage}%)`);
    warning('⚠️  Quelques routes nécessitent attention');
  } else {
    error(`Tests réussis: ${passedTests}/${totalTests} (${percentage}%)`);
    error('❌ Plusieurs routes sont inaccessibles');
  }

  console.log('\n🌐 URLs des Applications:');
  console.log('• ADMINISTRATION.GA: http://localhost:3000/');
  console.log('• DEMARCHE.GA: http://localhost:3000/demarche');
  console.log('• TRAVAIL.GA: http://localhost:3000/travail');
  console.log('• Admin Web: http://localhost:3000/admin-web');

  console.log('\n📝 Notes:');
  console.log('• Assurez-vous que le port 3000 est libre');
  console.log('• Les tests peuvent échouer si les dépendances ne sont pas installées');
  console.log('• Utilisez "npm run dev" pour démarrer manuellement');

  return percentage >= 70;
}

// Exécution des tests
if (require.main === module) {
  testAllRoutes()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('\n💥 Erreur fatale lors des tests:', error.message);
      process.exit(1);
    });
}

module.exports = { testAllRoutes };
