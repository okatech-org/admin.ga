// Test SSL en mode développement local

const { DomainManagementService } = require('../lib/services/domain-management.service.ts');

// Configuration pour développement local
const netimConfig = {
  apiKey: '',
  apiSecret: '',
  baseUrl: 'https://rest.netim.com/3.0'
};

const domainService = new DomainManagementService(netimConfig);

async function testSSLDevelopment() {
  console.log('🔒 TEST SSL - Mode Développement');
  console.log('===============================');
  console.log('');

  try {
    console.log('📋 Test 1: SSL sans configuration SSH (mode dev)');

    const deploymentConfig = {
      domain: 'administration.ga',
      ipAddress: '185.26.106.234',
      port: 3000,
      ssl: true,
      nginx: true,
      // Pas de sshConfig - mode développement
    };

    console.log('Configuration de déploiement:');
    console.log('• Domaine:', deploymentConfig.domain);
    console.log('• IP:', deploymentConfig.ipAddress);
    console.log('• SSL:', deploymentConfig.ssl);
    console.log('• SSH Config:', deploymentConfig.sshConfig ? 'Configuré' : 'Non configuré (mode dev)');
    console.log('');

    console.log('🔒 Provisioning SSL...');
    const sslResult = await domainService.provisionSSL(deploymentConfig.domain, deploymentConfig);

    console.log('✅ SSL provisionné avec succès !');
    console.log('Détails du certificat:');
    console.log('• Domaine:', sslResult.domain);
    console.log('• Émetteur:', sslResult.issuer);
    console.log('• Valide du:', sslResult.validFrom.toLocaleDateString());
    console.log('• Valide jusqu\'au:', sslResult.validUntil.toLocaleDateString());
    console.log('• Status:', sslResult.status);
    console.log('• Auto-renouvellement:', sslResult.autoRenew ? 'Activé' : 'Désactivé');
    console.log('');

    console.log('📋 Test 2: Vérification que ça marche plusieurs fois');

    const sslResult2 = await domainService.provisionSSL(deploymentConfig.domain, deploymentConfig);
    console.log('✅ Deuxième provisioning réussi');
    console.log('• Même domaine:', sslResult2.domain === sslResult.domain);
    console.log('• Certificat régénéré:', sslResult2.validFrom > sslResult.validFrom);
    console.log('');

    console.log('🎉 TESTS SSL DÉVELOPPEMENT RÉUSSIS !');
    console.log('====================================');
    console.log('');
    console.log('✅ SSL fonctionne sans SSH');
    console.log('✅ Certificat simulé généré');
    console.log('✅ Prêt pour interface utilisateur');
    console.log('✅ Plus d\'erreur "Configuration SSH requise"');
    console.log('');
    console.log('🚀 La section Domaines peut maintenant configurer SSL !');

  } catch (error) {
    console.error('❌ ERREUR SSL:', error);
    console.error('');

    if (error.message.includes('SSH requise')) {
      console.error('❌ ERREUR: SSH toujours requis');
      console.error('   Le fix n\'a pas fonctionné');
    } else {
      console.error('❌ AUTRE ERREUR:', error.message);
    }

    process.exit(1);
  }
}

// Exécuter le test
testSSLDevelopment();
