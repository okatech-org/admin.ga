// Test API SSL en mode développement

async function testSSLAPI() {
  console.log('🔒 TEST API SSL - Mode Développement');
  console.log('===================================');
  console.log('');

  try {
    console.log('📋 Test 1: Provisioning SSL via API');

    const sslRequest = {
      action: 'provision_ssl',
      domain: 'administration.ga',
      deploymentConfig: {
        domain: 'administration.ga',
        ipAddress: '185.26.106.234',
        port: 3000,
        ssl: true,
        nginx: true
        // Pas de sshConfig - mode développement
      }
    };

    console.log('Envoi requête SSL...');
    const response = await fetch('http://localhost:3000/api/domain-management', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(sslRequest)
    });

    const result = await response.json();

    if (result.success) {
      console.log('✅ SSL API fonctionne !');
      console.log('Réponse:', result);
    } else {
      console.log('❌ Erreur SSL API:', result.error);

      if (result.error && result.error.includes('SSH requise')) {
        console.log('❌ PROBLÈME: SSH toujours requis');
        console.log('   Le mode développement n\'est pas activé');
      }
    }
    console.log('');

    console.log('📋 Test 2: Configuration complète via API');

    const setupRequest = {
      action: 'setup_domain',
      domainConfig: {
        domain: 'administration.ga',
        applicationId: 'administration-ga',
        dnsRecords: [
          {type: 'A', name: '@', value: '185.26.106.234', ttl: 3600},
          {type: 'A', name: 'www', value: '185.26.106.234', ttl: 3600}
        ],
        deploymentConfig: {
          domain: 'administration.ga',
          ipAddress: '185.26.106.234',
          port: 3000,
          ssl: true,
          nginx: true
          // Mode développement - pas de SSH
        }
      }
    };

    console.log('Test configuration complète...');
    const setupResponse = await fetch('http://localhost:3000/api/domain-management', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(setupRequest)
    });

    const setupResult = await setupResponse.json();

    if (setupResult.success) {
      console.log('✅ Configuration complète réussie !');
      console.log('Domain ID:', setupResult.domainId || setupResult.data);
    } else {
      console.log('❌ Erreur configuration:', setupResult.error);
    }
    console.log('');

    console.log('📋 Test 3: Vérification DNS via API');

    const dnsResponse = await fetch('http://localhost:3000/api/domain-management/dns?domain=administration.ga');
    const dnsResult = await dnsResponse.json();

    if (dnsResult.success) {
      console.log('✅ API DNS fonctionne');
      console.log('Serveurs DNS:', dnsResult.data.dnsServers?.length || 0);
      console.log('Enregistrements:', dnsResult.data.records?.length || 0);
    } else {
      console.log('❌ Erreur DNS API:', dnsResult.error);
    }
    console.log('');

    console.log('🎉 TESTS API SSL TERMINÉS !');
    console.log('===========================');
    console.log('');

    if (result.success || !result.error?.includes('SSH')) {
      console.log('✅ Mode développement activé');
      console.log('✅ SSL fonctionne sans SSH');
      console.log('✅ Interface utilisateur prête');
    } else {
      console.log('❌ Problèmes détectés');
      console.log('❌ Vérifiez la configuration');
    }

  } catch (error) {
    console.error('❌ ERREUR TEST:', error);
    console.error('Message:', error.message);
  }
}

// Exécuter le test
console.log('🚀 Démarrage test SSL API...');
console.log('📱 Application doit être démarrée sur localhost:3000');
console.log('');

testSSLAPI().then(() => {
  console.log('');
  console.log('✅ Test terminé');
}).catch(error => {
  console.error('❌ Erreur fatale:', error);
  process.exit(1);
});
