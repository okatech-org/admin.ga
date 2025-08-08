#!/usr/bin/env node

/**
 * 🧪 Script de test pour l'API DEMARCHE.GA
 * Teste les endpoints principaux avec les comptes de démonstration
 */

const BASE_URL = 'http://localhost:3000'

// Comptes de test
const TEST_ACCOUNTS = {
  citoyen: { email: 'citoyen1@exemple.com', password: 'Test123!', userType: 'citoyen' },
  agent: { email: 'agent1@dgdi.ga', password: 'Test123!', userType: 'agent', organismeCode: 'DGDI' },
  admin: { email: 'admin@dgdi.ga', password: 'Test123!', userType: 'admin', organismeCode: 'DGDI' },
  superAdmin: { email: 'admin@demarche.ga', password: 'Test123!', userType: 'admin' }
}

async function testEndpoint(url, options = {}) {
  try {
    const response = await fetch(`${BASE_URL}${url}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    })

    const data = await response.json()

    console.log(`${response.ok ? '✅' : '❌'} ${options.method || 'GET'} ${url}`)
    if (!response.ok) {
      console.log(`   Error: ${data.error || data.message || 'Unknown error'}`)
    } else {
      console.log(`   Success: ${data.message || 'OK'}`)
      if (data.user) {
        console.log(`   User: ${data.user.firstName} ${data.user.lastName} (${data.user.userRole})`)
      }
    }

    return { success: response.ok, data }
  } catch (error) {
    console.log(`❌ ${options.method || 'GET'} ${url}`)
    console.log(`   Network Error: ${error.message}`)
    return { success: false, error: error.message }
  }
}

async function testAuthentication() {
  console.log('\n🔐 Test d\'Authentification\n' + '='.repeat(40))

  for (const [role, credentials] of Object.entries(TEST_ACCOUNTS)) {
    console.log(`\n📝 Test connexion ${role}:`)

    const result = await testEndpoint('/api/demarche/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    })

    if (result.success && result.data.token) {
      // Test de vérification du token
      await testEndpoint('/api/demarche/auth/login', {
        method: 'GET',
        headers: {
          'Cookie': `demarche_token=${result.data.token}`
        }
      })
    }
  }
}

async function testServiceEndpoints() {
  console.log('\n🛠️  Test des Services\n' + '='.repeat(40))

  // Test récupération des services
  await testEndpoint('/api/demarche/services')

  // Test récupération des organismes (via services)
  await testEndpoint('/api/demarche/organismes')
}

async function testDemarcheEndpoints() {
  console.log('\n📄 Test des Démarches\n' + '='.repeat(40))

  // Connexion en tant que citoyen d'abord
  const loginResult = await testEndpoint('/api/demarche/auth/login', {
    method: 'POST',
    body: JSON.stringify(TEST_ACCOUNTS.citoyen)
  })

  if (loginResult.success && loginResult.data.token) {
    const authHeaders = {
      'Authorization': `Bearer ${loginResult.data.token}`,
      'Cookie': `demarche_token=${loginResult.data.token}`
    }

    // Test récupération des démarches
    await testEndpoint('/api/demarche/demarches', {
      headers: authHeaders
    })

    // Test création d'une démarche
    await testEndpoint('/api/demarche/demarches', {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        serviceCode: 'CNI_PREMIERE',
        donneesFormulaire: {
          nom: 'TEST',
          prenom: 'Test',
          dateNaissance: '1990-01-01',
          lieuNaissance: 'Libreville'
        }
      })
    })
  }
}

async function checkServerHealth() {
  console.log('🏥 Vérification de l\'état du serveur\n' + '='.repeat(40))

  try {
    const response = await fetch(`${BASE_URL}/demarche`)
    if (response.ok) {
      console.log('✅ Serveur Next.js accessible')
      console.log(`   URL: ${BASE_URL}/demarche`)
    } else {
      console.log('❌ Serveur Next.js non accessible')
      console.log(`   Status: ${response.status}`)
    }
  } catch (error) {
    console.log('❌ Impossible de contacter le serveur')
    console.log(`   Error: ${error.message}`)
    console.log('\n💡 Assurez-vous que le serveur de développement est démarré:')
    console.log('   npm run dev')
    return false
  }

  return true
}

async function main() {
  console.log('🧪 Test de l\'API DEMARCHE.GA')
  console.log('=' * 50)

  // Vérification préalable du serveur
  const serverOk = await checkServerHealth()
  if (!serverOk) {
    process.exit(1)
  }

  // Tests des endpoints
  await testAuthentication()
  await testServiceEndpoints()
  await testDemarcheEndpoints()

  console.log('\n🎉 Tests terminés!')
  console.log('\n📋 Prochaines étapes:')
  console.log('   1. Tester l\'interface web: http://localhost:3000/demarche')
  console.log('   2. Se connecter avec les comptes de démonstration')
  console.log('   3. Naviguer entre les différents dashboards')
}

// Exécution du script
if (require.main === module) {
  main().catch(console.error)
}
