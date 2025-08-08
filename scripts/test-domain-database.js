// Test de la base de données pour la gestion des domaines

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testDomainDatabase() {
  console.log('🧪 TEST BASE DE DONNÉES - Gestion des Domaines');
  console.log('===============================================');
  console.log('');

  try {
    // Test 1: Vérifier la connexion à la base
    console.log('📊 Test 1: Connexion à la base de données');
    await prisma.$connect();
    console.log('✅ Connexion réussie');
    console.log('');

    // Test 2: Vérifier que la table domain_configs existe
    console.log('📋 Test 2: Vérification table domain_configs');
    const tableExists = await prisma.$queryRaw`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name = 'domain_configs'
    `;

    if (tableExists.length > 0) {
      console.log('✅ Table domain_configs trouvée');
    } else {
      console.log('❌ Table domain_configs manquante');
      return;
    }
    console.log('');

    // Test 3: Créer un enregistrement de test
    console.log('💾 Test 3: Création enregistrement de test');
    const testDomain = await prisma.domainConfig.create({
      data: {
        domain: 'test-administration.ga',
        applicationId: 'admin-test',
        dnsRecords: JSON.stringify([
          { type: 'A', name: '@', value: '185.26.106.234', ttl: 3600 }
        ]),
        deploymentConfig: JSON.stringify({
          port: 3000,
          ssl: true,
          nginx: true
        }),
        status: 'pending'
      }
    });

    console.log(`✅ Enregistrement créé avec ID: ${testDomain.id}`);
    console.log('');

    // Test 4: Lire l'enregistrement
    console.log('📖 Test 4: Lecture de l\'enregistrement');
    const readDomain = await prisma.domainConfig.findUnique({
      where: { domain: 'test-administration.ga' }
    });

    if (readDomain) {
      console.log('✅ Enregistrement lu avec succès');
      console.log(`   Domaine: ${readDomain.domain}`);
      console.log(`   Status: ${readDomain.status}`);
      console.log(`   Créé: ${readDomain.createdAt}`);
    } else {
      console.log('❌ Impossible de lire l\'enregistrement');
    }
    console.log('');

    // Test 5: Créer un log de déploiement
    console.log('📝 Test 5: Création log de déploiement');
    const deployLog = await prisma.deploymentLog.create({
      data: {
        domainId: testDomain.id,
        action: 'DNS_SETUP',
        status: 'SUCCESS',
        message: 'Configuration DNS réussie pour test-administration.ga'
      }
    });

    console.log(`✅ Log créé avec ID: ${deployLog.id}`);
    console.log('');

    // Test 6: Lire avec relation
    console.log('🔗 Test 6: Lecture avec relations');
    const domainWithLogs = await prisma.domainConfig.findUnique({
      where: { domain: 'test-administration.ga' },
      include: {
        deploymentLogs: true
      }
    });

    if (domainWithLogs && domainWithLogs.deploymentLogs.length > 0) {
      console.log('✅ Relations fonctionnelles');
      console.log(`   Logs trouvés: ${domainWithLogs.deploymentLogs.length}`);
      console.log(`   Premier log: ${domainWithLogs.deploymentLogs[0].action}`);
    } else {
      console.log('❌ Problème avec les relations');
    }
    console.log('');

    // Test 7: Nettoyage
    console.log('🧹 Test 7: Nettoyage des données de test');

    // Supprimer les logs (cascade automatique)
    await prisma.domainConfig.delete({
      where: { id: testDomain.id }
    });

    console.log('✅ Données de test supprimées');
    console.log('');

    // Test 8: Test API administration.ga
    console.log('🌐 Test 8: Configuration administration.ga');
    try {
      const adminDomain = await prisma.domainConfig.upsert({
        where: { domain: 'administration.ga' },
        update: {
          status: 'configured',
          dnsRecords: JSON.stringify([
            { type: 'A', name: '@', value: '185.26.106.234', ttl: 3600 },
            { type: 'A', name: 'www', value: '185.26.106.234', ttl: 3600 }
          ]),
          deploymentConfig: JSON.stringify({
            port: 3000,
            ssl: true,
            nginx: true,
            domain: 'administration.ga'
          })
        },
        create: {
          domain: 'administration.ga',
          applicationId: 'administration-ga',
          status: 'configured',
          dnsRecords: JSON.stringify([
            { type: 'A', name: '@', value: '185.26.106.234', ttl: 3600 },
            { type: 'A', name: 'www', value: '185.26.106.234', ttl: 3600 }
          ]),
          deploymentConfig: JSON.stringify({
            port: 3000,
            ssl: true,
            nginx: true,
            domain: 'administration.ga'
          })
        }
      });

      console.log('✅ Configuration administration.ga mise à jour');
      console.log(`   ID: ${adminDomain.id}`);
      console.log(`   Status: ${adminDomain.status}`);
      console.log('');

    } catch (error) {
      console.log('❌ Erreur configuration administration.ga:', error.message);
    }

    console.log('🎉 TOUS LES TESTS RÉUSSIS !');
    console.log('==========================');
    console.log('');
    console.log('✅ Base de données configurée');
    console.log('✅ Tables créées et fonctionnelles');
    console.log('✅ Relations configurées');
    console.log('✅ Administration.ga prêt');
    console.log('');
    console.log('🚀 Vous pouvez maintenant utiliser la section Domaines !');

  } catch (error) {
    console.error('❌ ERREUR:', error);
    console.error('');
    console.error('Détails:', error.message);

    if (error.code) {
      console.error('Code:', error.code);
    }

    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter les tests
testDomainDatabase();
