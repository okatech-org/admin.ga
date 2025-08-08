#!/usr/bin/env node

/**
 * Script de test pour la configuration du domaine ADMINISTRATION.GA
 * Usage: node scripts/test-administration-domain.js
 */

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

// Couleurs pour les logs
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testAPI(endpoint, method = 'GET', body = null) {
  try {
    const options = {
      method,
      headers: { 'Content-Type': 'application/json' }
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const data = await response.json();

    return { success: response.ok, data, status: response.status };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function runTests() {
  log('blue', '🧪 Test de l\'intégration du domaine ADMINISTRATION.GA');
  log('blue', '=' * 60);

  // Test 1: Vérifier l'API de gestion des domaines
  log('yellow', '\n📋 Test 1: API de gestion des domaines');
  const listResult = await testAPI('/api/domain-management?action=list');

  if (listResult.success) {
    log('green', '✅ API de liste des domaines fonctionne');
    console.log('   Domaines trouvés:', listResult.data.data?.length || 0);
  } else {
    log('red', '❌ Erreur API liste des domaines');
    console.log('   Erreur:', listResult.error || listResult.data.error);
  }

  // Test 2: Configuration d'un domaine de test
  log('yellow', '\n🔧 Test 2: Configuration de domaine');
  const testDomainConfig = {
    action: 'setup_domain',
    domainConfig: {
      domain: 'test-administration.ga',
      applicationId: 'administration',
      status: 'pending',
      dnsRecords: [
        {
          type: 'A',
          name: '@',
          value: '192.168.1.100',
          ttl: 3600
        }
      ],
      deploymentConfig: {
        serverId: `test_server_${Date.now()}`,
        serverType: 'vps',
        ipAddress: '192.168.1.100',
        port: 80,
        nginxConfig: {
          serverName: 'test-administration.ga',
          documentRoot: '/var/www/test-administration.ga',
          sslEnabled: true,
          proxyPass: 'http://localhost:3000'
        }
      }
    }
  };

  const setupResult = await testAPI('/api/domain-management', 'POST', testDomainConfig);

  if (setupResult.success) {
    log('green', '✅ Configuration de domaine fonctionne');
    console.log('   ID du domaine:', setupResult.data.data?.domainId);
  } else {
    log('red', '❌ Erreur configuration de domaine');
    console.log('   Erreur:', setupResult.error || setupResult.data.error);
  }

  // Test 3: Vérification DNS
  log('yellow', '\n🌐 Test 3: Vérification DNS');
  const dnsResult = await testAPI('/api/domain-management', 'POST', {
    action: 'verify_dns',
    domain: 'test-administration.ga',
    expectedIP: '192.168.1.100'
  });

  if (dnsResult.success) {
    log('green', '✅ Vérification DNS fonctionne');
    console.log('   DNS vérifié:', dnsResult.data.data?.verified);
  } else {
    log('red', '❌ Erreur vérification DNS');
    console.log('   Erreur:', dnsResult.error || dnsResult.data.error);
  }

  // Test 4: API SSL
  log('yellow', '\n🔒 Test 4: API SSL');
  const sslResult = await testAPI('/api/domain-management/ssl', 'POST', {
    domain: 'test-administration.ga',
    deploymentConfig: testDomainConfig.domainConfig.deploymentConfig
  });

  if (sslResult.success) {
    log('green', '✅ API SSL fonctionne');
    console.log('   Certificat:', sslResult.data.data?.certificate?.id);
  } else {
    log('red', '❌ Erreur API SSL');
    console.log('   Erreur:', sslResult.error || sslResult.data.error);
  }

  // Test 5: API de déploiement
  log('yellow', '\n🚀 Test 5: API de déploiement');
  const deployResult = await testAPI('/api/domain-management/deploy', 'POST', {
    action: 'deploy',
    domainId: 'test_domain_123',
    deploymentConfig: testDomainConfig.domainConfig.deploymentConfig
  });

  if (deployResult.success) {
    log('green', '✅ API de déploiement fonctionne');
    console.log('   Statut:', deployResult.data.data?.status);
  } else {
    log('red', '❌ Erreur API de déploiement');
    console.log('   Erreur:', deployResult.error || deployResult.data.error);
  }

  // Test 6: Santé du serveur
  log('yellow', '\n💓 Test 6: Health check serveur');
  const healthResult = await testAPI('/api/domain-management?action=health&serverId=test_server_1');

  if (healthResult.success) {
    log('green', '✅ Health check fonctionne');
    console.log('   Statut serveur:', healthResult.data.data?.status);
    console.log('   CPU:', healthResult.data.data?.cpuUsage + '%');
    console.log('   Mémoire:', healthResult.data.data?.memoryUsage + '%');
  } else {
    log('red', '❌ Erreur health check');
    console.log('   Erreur:', healthResult.error || healthResult.data.error);
  }

  // Résumé
  log('blue', '\n📊 Résumé des tests');
  log('blue', '=' * 60);

  const tests = [
    listResult.success,
    setupResult.success,
    dnsResult.success,
    sslResult.success,
    deployResult.success,
    healthResult.success
  ];

  const passed = tests.filter(t => t).length;
  const total = tests.length;

  if (passed === total) {
    log('green', `🎉 Tous les tests passent! (${passed}/${total})`);
    log('green', '✨ L\'intégration du domaine ADMINISTRATION.GA est prête!');
  } else {
    log('yellow', `⚠️  ${passed}/${total} tests passent`);
    log('yellow', '🔧 Vérifiez les erreurs ci-dessus pour finaliser l\'intégration');
  }

  // Instructions pour l'utilisateur
  log('blue', '\n📝 Prochaines étapes:');
  console.log('1. 🌐 Visitez http://localhost:3000/admin-web/config/administration.ga');
  console.log('2. 🏷️  Cliquez sur l\'onglet "Domaines"');
  console.log('3. ⚙️  Configurez votre domaine administration.ga');
  console.log('4. 🚀 Déployez votre application!');

  log('blue', '\n💡 Configuration Netim requise:');
  console.log('- Pointez vos serveurs DNS vers votre serveur');
  console.log('- Configurez les variables d\'environnement NETIM_API_*');
  console.log('- Assurez-vous que votre serveur est accessible');
}

// Exécution du script
if (require.main === module) {
  runTests().catch(error => {
    log('red', '💥 Erreur fatale lors des tests:');
    console.error(error);
    process.exit(1);
  });
}

module.exports = { runTests, testAPI };
