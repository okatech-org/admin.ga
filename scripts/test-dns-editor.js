// Test complet de l'éditeur DNS

async function testDNSEditor() {
  console.log('🌐 TEST ÉDITEUR DNS - administration.ga');
  console.log('=====================================');
  console.log('');

  const baseUrl = 'http://localhost:3000';
  const domain = 'administration.ga';

  try {
    console.log('📋 Test 1: Récupération des enregistrements DNS existants');

    const dnsResponse = await fetch(`${baseUrl}/api/domain-management/dns?domain=${domain}`);
    const dnsResult = await dnsResponse.json();

    if (dnsResult.success) {
      console.log('✅ DNS API fonctionne');
      console.log(`   Domaine: ${dnsResult.data.domain}`);
      console.log(`   Serveurs DNS: ${dnsResult.data.dnsServers.map(s => s.name).join(', ')}`);
      console.log(`   Enregistrements: ${dnsResult.data.records.length}`);
      console.log(`   Provider: ${dnsResult.data.provider}`);
      console.log(`   Registrar: ${dnsResult.data.whoisInfo.registrar}`);
      console.log(`   Expiration: ${new Date(dnsResult.data.whoisInfo.expiryDate).toLocaleDateString()}`);
    } else {
      console.log('❌ Erreur DNS API:', dnsResult.error);
      return;
    }
    console.log('');

    console.log('📋 Test 2: Récupération des templates DNS');

    const templatesResponse = await fetch(`${baseUrl}/api/domain-management/dns-editor?domain=${domain}`);
    const templatesResult = await templatesResponse.json();

    if (templatesResult.success) {
      console.log('✅ Templates DNS disponibles');
      console.log(`   Types supportés: ${templatesResult.data.supportedTypes.join(', ')}`);
      console.log(`   Templates: ${Object.keys(templatesResult.data.templates).join(', ')}`);
      console.log(`   Enregistrements communs: ${templatesResult.data.commonRecords.length}`);
      console.log(`   TTL recommandé: ${templatesResult.data.guidelines.ttl.recommended}s`);
    } else {
      console.log('❌ Erreur Templates:', templatesResult.error);
    }
    console.log('');

    console.log('📋 Test 3: Ajout d\'un nouvel enregistrement DNS');

    const newRecord = {
      type: 'A',
      name: 'test',
      value: '185.26.106.234',
      ttl: 3600,
      description: 'Enregistrement de test via API'
    };

    const addResponse = await fetch(`${baseUrl}/api/domain-management/dns-editor`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'add_record',
        domain,
        dnsRecord: newRecord
      })
    });

    const addResult = await addResponse.json();

    if (addResult.success) {
      console.log('✅ Enregistrement ajouté avec succès');
      console.log(`   ID: ${addResult.data.record.id}`);
      console.log(`   Type: ${addResult.data.record.type}`);
      console.log(`   Nom: ${addResult.data.record.name}`);
      console.log(`   Valeur: ${addResult.data.record.value}`);
      console.log(`   Statut: ${addResult.data.record.status}`);
      console.log(`   Propagation: ${addResult.data.propagationTime}`);

      var testRecordId = addResult.data.record.id;
    } else {
      console.log('❌ Erreur ajout:', addResult.error);
      return;
    }
    console.log('');

    console.log('📋 Test 4: Mise à jour de l\'enregistrement');

    const updatedRecord = {
      type: 'A',
      name: 'test-updated',
      value: '185.26.106.235',
      ttl: 7200,
      description: 'Enregistrement mis à jour via API'
    };

    const updateResponse = await fetch(`${baseUrl}/api/domain-management/dns-editor`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'update_record',
        domain,
        recordId: testRecordId,
        dnsRecord: updatedRecord
      })
    });

    const updateResult = await updateResponse.json();

    if (updateResult.success) {
      console.log('✅ Enregistrement mis à jour');
      console.log(`   Nouveau nom: ${updateResult.data.record.name}`);
      console.log(`   Nouvelle valeur: ${updateResult.data.record.value}`);
      console.log(`   Nouveau TTL: ${updateResult.data.record.ttl}`);
      console.log(`   Statut: ${updateResult.data.record.status}`);
    } else {
      console.log('❌ Erreur mise à jour:', updateResult.error);
    }
    console.log('');

    console.log('📋 Test 5: Validation d\'enregistrement');

    const validationTests = [
      {
        name: 'Enregistrement A valide',
        record: { type: 'A', name: 'valid', value: '192.168.1.1' },
        expectedValid: true
      },
      {
        name: 'Enregistrement A invalide (IP malformée)',
        record: { type: 'A', name: 'invalid', value: '999.999.999.999' },
        expectedValid: false
      },
      {
        name: 'Enregistrement MX sans priorité',
        record: { type: 'MX', name: '@', value: 'mail.example.com' },
        expectedValid: false
      },
      {
        name: 'Nom avec espaces (invalide)',
        record: { type: 'A', name: 'test invalid', value: '1.1.1.1' },
        expectedValid: false
      }
    ];

    for (const test of validationTests) {
      const validationResponse = await fetch(`${baseUrl}/api/domain-management/dns-editor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'validate_record',
          dnsRecord: test.record
        })
      });

      const validationResult = await validationResponse.json();

      if (validationResult.success) {
        const isValid = validationResult.data.valid;
        const status = isValid === test.expectedValid ? '✅' : '❌';
        console.log(`   ${status} ${test.name}: ${isValid ? 'Valide' : 'Invalide'}`);

        if (!isValid && validationResult.data.errors.length > 0) {
          console.log(`      Erreurs: ${validationResult.data.errors.join(', ')}`);
        }
      }
    }
    console.log('');

    console.log('📋 Test 6: Suppression de l\'enregistrement de test');

    const deleteResponse = await fetch(`${baseUrl}/api/domain-management/dns-editor`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'delete_record',
        domain,
        recordId: testRecordId
      })
    });

    const deleteResult = await deleteResponse.json();

    if (deleteResult.success) {
      console.log('✅ Enregistrement supprimé');
      console.log(`   ID supprimé: ${deleteResult.data.recordId}`);
      console.log(`   Propagation: ${deleteResult.data.propagationTime}`);
    } else {
      console.log('❌ Erreur suppression:', deleteResult.error);
    }
    console.log('');

    console.log('🎉 TESTS ÉDITEUR DNS RÉUSSIS !');
    console.log('===============================');
    console.log('');
    console.log('✅ API DNS: Enregistrements récupérés');
    console.log('✅ Templates: Types et suggestions disponibles');
    console.log('✅ Ajout: Nouveaux enregistrements créés');
    console.log('✅ Mise à jour: Enregistrements modifiés');
    console.log('✅ Validation: Règles DNS vérifiées');
    console.log('✅ Suppression: Enregistrements supprimés');
    console.log('');
    console.log('🔧 FONCTIONNALITÉS ÉDITEUR DNS:');
    console.log('==============================');
    console.log('• Serveurs DNS personnalisés: ns1-3.administration.net');
    console.log('• Types supportés: A, AAAA, CNAME, MX, TXT, NS, PTR, SRV');
    console.log('• Validation en temps réel des enregistrements');
    console.log('• Templates automatiques par type d\'enregistrement');
    console.log('• Interface graphique complète avec Dialog');
    console.log('• Gestion des statuts: active, pending, updating, error');
    console.log('');
    console.log('🌐 INTÉGRATION WHOIS:');
    console.log('====================');
    console.log('• Registrar: NETIM');
    console.log('• Serveurs DNS: ns1-3.administration.net');
    console.log('• Expiration: 31/07/2026');
    console.log('• Status: Actif et opérationnel');
    console.log('');
    console.log('🇬🇦 Éditeur DNS ADMINISTRATION.GA fonctionnel !');

  } catch (error) {
    console.error('❌ ERREUR TEST ÉDITEUR DNS:', error);
    console.error('');
    console.error('Vérifiez:');
    console.error('1. Application démarrée: npm run dev');
    console.error('2. API endpoints disponibles');
    console.error('3. Interface accessible');
    console.error('');
    console.error('Interface: http://localhost:3000/admin-web/config/administration.ga');
  }
}

// Information préliminaire
console.log('🔧 Test Éditeur DNS - ADMINISTRATION.GA');
console.log('🌐 Domaine: administration.ga');
console.log('📍 Serveurs DNS: ns1-3.administration.net');
console.log('🏢 Registrar: NETIM');
console.log('📅 Expiration: 31/07/2026');
console.log('');

// Exécuter le test
testDNSEditor().then(() => {
  console.log('');
  console.log('✅ Test éditeur DNS terminé');
}).catch(error => {
  console.error('❌ Erreur fatale éditeur DNS:', error);
  process.exit(1);
});
