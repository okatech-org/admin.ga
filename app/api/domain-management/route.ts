import { NextRequest, NextResponse } from 'next/server';
import { domainService } from '@/lib/services/domain-management.service';
import { DomainConfig } from '@/lib/types/domain-management';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'list':
      case 'get_domains':
        const domains = await domainService.getDomains();
        return NextResponse.json({ success: true, data: domains });

      case 'health':
      case 'health_check':
        const serverId = searchParams.get('serverId');
        if (!serverId) {
          return NextResponse.json({ success: false, error: 'Server ID requis' }, { status: 400 });
        }

        // Simulation health check unifié
        const health = {
          serverId,
          status: 'healthy',
          uptime: Math.floor(Date.now() / 1000),
          cpuUsage: Math.floor(Math.random() * 100),
          memoryUsage: Math.floor(Math.random() * 100),
          diskUsage: Math.floor(Math.random() * 100),
          lastCheck: new Date(),
          timestamp: new Date().toISOString()
        };

        return NextResponse.json({ success: true, data: health });

      default:
        return NextResponse.json({ success: false, error: 'Action GET non reconnue' }, { status: 400 });
    }
  } catch (error) {
    console.error('Erreur API domain-management GET:', error);
    return NextResponse.json({
      success: false,
      error: 'Erreur serveur interne'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'setup_domain':
        const { domainConfig } = body;
        if (!domainConfig) {
          return NextResponse.json({ success: false, error: 'Configuration domaine requise' }, { status: 400 });
        }

        const domainId = await domainService.setupDomain(domainConfig);
        return NextResponse.json({
          success: true,
          data: { domainId, message: 'Configuration du domaine démarrée' }
        });

      case 'verify_dns':
        const { domain, expectedIP } = body;
        if (!domain || !expectedIP) {
          return NextResponse.json({ success: false, error: 'Domaine et IP attendue requis' }, { status: 400 });
        }

        const isVerified = await domainService.verifyDNS(domain, expectedIP);
        return NextResponse.json({
          success: true,
          data: { verified: isVerified, domain, expectedIP }
        });

      case 'provision_ssl':
        const { domainForSSL, deploymentConfig } = body;
        if (!domainForSSL || !deploymentConfig) {
          return NextResponse.json({ success: false, error: 'Domaine et configuration de déploiement requis' }, { status: 400 });
        }

        const certificate = await domainService.provisionSSL(domainForSSL, deploymentConfig);
        return NextResponse.json({
          success: true,
          data: certificate
        });

      case 'deploy_application':
        const { domainIdToDeploy, deploymentConfigToDeploy } = body;
        if (!domainIdToDeploy || !deploymentConfigToDeploy) {
          return NextResponse.json({ success: false, error: 'ID domaine et configuration de déploiement requis' }, { status: 400 });
        }

        await domainService.deployApplication(domainIdToDeploy, deploymentConfigToDeploy);
        return NextResponse.json({
          success: true,
          data: { message: 'Déploiement de l\'application démarré' }
        });

      default:
        return NextResponse.json({ success: false, error: 'Action non reconnue' }, { status: 400 });
    }
  } catch (error) {
    console.error('Erreur API domain-management POST:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Erreur serveur interne'
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const domainId = searchParams.get('domainId');

    if (!domainId) {
      return NextResponse.json({ success: false, error: 'ID domaine requis' }, { status: 400 });
    }

    const deleted = await domainService.deleteDomain(domainId);
    if (deleted) {
      return NextResponse.json({
        success: true,
        data: { message: 'Domaine supprimé avec succès' }
      });
    } else {
      return NextResponse.json({
        success: false,
        error: 'Échec de la suppression du domaine'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Erreur API domain-management DELETE:', error);
    return NextResponse.json({
      success: false,
      error: 'Erreur serveur interne'
    }, { status: 500 });
  }
}
