/**
 * Script de configuration automatique des domaines Netim.com
 * Usage: npx ts-node scripts/setup-netim-domain.ts --domain=example.ga --ip=192.168.1.100
 */

import { domainService } from '@/lib/services/domain-management.service';
import { DNSRecord } from '@/lib/types/domain-management';

interface SetupOptions {
  domain: string;
  ip: string;
  application: 'administration' | 'demarche' | 'travail';
  ssl?: boolean;
  subdomains?: string[];
}

async function setupNetimDomain(options: SetupOptions) {
  console.log(`🚀 Configuration du domaine ${options.domain} pour ${options.application.toUpperCase()}.GA`);

  try {
    // 1. Création des enregistrements DNS de base
    const dnsRecords: Omit<DNSRecord, 'id' | 'status'>[] = [
      {
        type: 'A',
        name: '@',
        value: options.ip,
        ttl: 3600
      },
      {
        type: 'CNAME',
        name: 'www',
        value: options.domain,
        ttl: 3600
      }
    ];

    // Ajouter des sous-domaines si spécifiés
    if (options.subdomains) {
      options.subdomains.forEach(subdomain => {
        dnsRecords.push({
          type: 'CNAME',
          name: subdomain,
          value: options.domain,
          ttl: 3600
        });
      });
    }

    // 2. Configuration DNS via Netim API
    console.log('📡 Configuration DNS via Netim...');
    const dnsSuccess = await domainService.configureNetimDNS(options.domain, dnsRecords);

    if (!dnsSuccess) {
      throw new Error('Échec de la configuration DNS Netim');
    }
    console.log('✅ DNS configuré avec succès');

    // 3. Configuration du domaine dans notre système
    console.log('⚙️ Configuration du domaine dans le système...');

    const applicationPaths = {
      administration: '',
      demarche: '/demarche',
      travail: '/travail'
    };

    const domainConfig = {
      domain: options.domain,
      applicationId: options.application,
      status: 'dns_configured' as const,
      dnsRecords,
      deploymentConfig: {
        serverId: `server_${Date.now()}`,
        serverType: 'vps' as const,
        ipAddress: options.ip,
        port: 80,
        nginxConfig: {
          serverName: options.domain,
          documentRoot: `/var/www/${options.domain}`,
          proxyPass: `http://localhost:3000${applicationPaths[options.application]}`,
          sslEnabled: options.ssl || false
        }
      }
    };

    const domainId = await domainService.setupDomain(domainConfig);
    console.log(`✅ Domaine configuré avec l'ID: ${domainId}`);

    // 4. Vérification DNS
    console.log('🔍 Vérification de la propagation DNS...');

    // Attendre un peu pour la propagation
    await new Promise(resolve => setTimeout(resolve, 30000));

    const isVerified = await domainService.verifyDNS(options.domain, options.ip);
    if (isVerified) {
      console.log('✅ DNS vérifié avec succès');
    } else {
      console.log('⚠️ DNS non encore propagé (peut prendre jusqu\'à 24h)');
    }

    // 5. Configuration SSL si demandée
    if (options.ssl) {
      console.log('🔒 Configuration SSL Let\'s Encrypt...');
      try {
        const certificate = await domainService.provisionSSL(options.domain, domainConfig.deploymentConfig);
        console.log(`✅ SSL configuré: ${certificate.id}`);
      } catch (error) {
        console.log(`⚠️ Erreur SSL: ${error.message}`);
        console.log('Le SSL peut être configuré manuellement plus tard');
      }
    }

    console.log(`🎉 Configuration terminée pour ${options.domain}!`);
    console.log(`🌐 URL: https://${options.domain}`);

    return {
      success: true,
      domainId,
      domain: options.domain,
      application: options.application
    };

  } catch (error) {
    console.error(`❌ Erreur lors de la configuration: ${error.message}`);
    return {
      success: false,
      error: error.message
    };
  }
}

// Fonction pour analyser les arguments de ligne de commande
function parseArguments(): SetupOptions | null {
  const args = process.argv.slice(2);
  const options: Partial<SetupOptions> = {};

  args.forEach(arg => {
    if (arg.startsWith('--domain=')) {
      options.domain = arg.split('=')[1];
    } else if (arg.startsWith('--ip=')) {
      options.ip = arg.split('=')[1];
    } else if (arg.startsWith('--app=')) {
      const app = arg.split('=')[1];
      if (['administration', 'demarche', 'travail'].includes(app)) {
        options.application = app as any;
      }
    } else if (arg === '--ssl') {
      options.ssl = true;
    } else if (arg.startsWith('--subdomains=')) {
      options.subdomains = arg.split('=')[1].split(',');
    }
  });

  if (!options.domain || !options.ip || !options.application) {
    console.log('❌ Usage: npx ts-node scripts/setup-netim-domain.ts --domain=example.ga --ip=192.168.1.100 --app=administration [--ssl] [--subdomains=api,admin]');
    console.log('');
    console.log('Arguments requis:');
    console.log('  --domain=DOMAIN     Nom de domaine (ex: administration.ga)');
    console.log('  --ip=IP            Adresse IP du serveur');
    console.log('  --app=APP          Application (administration|demarche|travail)');
    console.log('');
    console.log('Arguments optionnels:');
    console.log('  --ssl              Activer SSL automatiquement');
    console.log('  --subdomains=LIST  Sous-domaines séparés par des virgules');
    return null;
  }

  return options as SetupOptions;
}

// Fonction principale
async function main() {
  console.log('🔧 Script de configuration automatique des domaines Netim.com');
  console.log('');

  const options = parseArguments();
  if (!options) {
    process.exit(1);
  }

  const result = await setupNetimDomain(options);

  if (result.success) {
    console.log('');
    console.log('📋 Prochaines étapes:');
    console.log('1. Vérifiez que votre domaine pointe vers nos serveurs DNS chez Netim.com');
    console.log('2. Attendez la propagation DNS (jusqu\'à 24h)');
    console.log('3. Testez l\'accès via votre navigateur');
    console.log('4. Configurez SSL manuellement si nécessaire');
    process.exit(0);
  } else {
    process.exit(1);
  }
}

// Vérification si le script est exécuté directement
if (require.main === module) {
  main().catch(error => {
    console.error('💥 Erreur fatale:', error);
    process.exit(1);
  });
}

export { setupNetimDomain, SetupOptions };
