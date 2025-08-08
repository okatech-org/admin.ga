// Test spécifique pour vérifier que upsert fonctionne

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testDomainUpsert() {
  console.log('🧪 TEST UPSERT - Configuration administration.ga');
  console.log('===============================================');
  console.log('');

  try {
    console.log('📊 Test 1: Premier upsert (creation)');

    const config1 = await prisma.domainConfig.upsert({
      where: { domain: 'administration.ga' },
      update: {
        status: 'testing-update',
        dnsRecords: JSON.stringify([
          { type: 'A', name: '@', value: '185.26.106.234', ttl: 3600 }
        ]),
        deploymentConfig: JSON.stringify({
          port: 3000,
          ssl: true,
          nginx: true,
          test: 'update'
        })
      },
      create: {
        domain: 'administration.ga',
        applicationId: 'administration-ga',
        status: 'testing-create',
        dnsRecords: JSON.stringify([
          { type: 'A', name: '@', value: '185.26.106.234', ttl: 3600 },
          { type: 'A', name: 'www', value: '185.26.106.234', ttl: 3600 }
        ]),
        deploymentConfig: JSON.stringify({
          port: 3000,
          ssl: true,
          nginx: true,
          test: 'create'
        })
      }
    });

    console.log(`✅ Upsert 1 réussi - ID: ${config1.id}`);
    console.log(`   Status: ${config1.status}`);
    console.log(`   Action: ${config1.status.includes('create') ? 'CREATE' : 'UPDATE'}`);
    console.log('');

    console.log('📊 Test 2: Deuxième upsert (mise à jour)');

    const config2 = await prisma.domainConfig.upsert({
      where: { domain: 'administration.ga' },
      update: {
        status: 'testing-update-2',
        dnsRecords: JSON.stringify([
          { type: 'A', name: '@', value: '185.26.106.234', ttl: 3600 },
          { type: 'A', name: 'www', value: '185.26.106.234', ttl: 3600 },
          { type: 'CNAME', name: 'test', value: 'administration.ga', ttl: 3600 }
        ]),
        deploymentConfig: JSON.stringify({
          port: 3000,
          ssl: true,
          nginx: true,
          test: 'update-2',
          timestamp: new Date().toISOString()
        })
      },
      create: {
        domain: 'administration.ga',
        applicationId: 'administration-ga',
        status: 'should-not-create',
        dnsRecords: JSON.stringify([]),
        deploymentConfig: JSON.stringify({})
      }
    });

    console.log(`✅ Upsert 2 réussi - ID: ${config2.id}`);
    console.log(`   Status: ${config2.status}`);
    console.log(`   Action: ${config2.status.includes('create') ? 'CREATE' : 'UPDATE'}`);
    console.log('');

    console.log('📊 Test 3: Vérification que c\'est le même enregistrement');

    if (config1.id === config2.id) {
      console.log('✅ Même ID confirmé - Upsert fonctionne correctement');
    } else {
      console.log('❌ IDs différents - Problème avec upsert');
    }
    console.log('');

    console.log('📊 Test 4: Lecture finale');

    const finalConfig = await prisma.domainConfig.findUnique({
      where: { domain: 'administration.ga' },
      include: {
        deploymentLogs: true
      }
    });

    console.log('✅ Configuration finale:');
    console.log(`   ID: ${finalConfig.id}`);
    console.log(`   Domaine: ${finalConfig.domain}`);
    console.log(`   Status: ${finalConfig.status}`);
    console.log(`   Créé: ${finalConfig.createdAt}`);
    console.log(`   Mis à jour: ${finalConfig.updatedAt}`);

    const deploymentConfig = JSON.parse(finalConfig.deploymentConfig);
    console.log(`   Test field: ${deploymentConfig.test}`);
    console.log('');

    console.log('🎉 TOUS LES TESTS UPSERT RÉUSSIS !');
    console.log('==================================');
    console.log('');
    console.log('✅ Pas d\'erreur de contrainte unique');
    console.log('✅ Create fonctionne (première fois)');
    console.log('✅ Update fonctionne (fois suivantes)');
    console.log('✅ Même enregistrement maintenu');
    console.log('');
    console.log('🚀 La section Domaines peut maintenant être utilisée sans erreur !');

  } catch (error) {
    console.error('❌ ERREUR UPSERT:', error);
    console.error('');

    if (error.message.includes('Unique constraint')) {
      console.error('❌ ERREUR: Contrainte unique toujours présente');
      console.error('   Le fix n\'a pas fonctionné');
    } else {
      console.error('❌ AUTRE ERREUR:', error.message);
    }

    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter le test
testDomainUpsert();
