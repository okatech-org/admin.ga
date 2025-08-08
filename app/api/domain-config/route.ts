/* @ts-nocheck */
import { NextRequest, NextResponse } from 'next/server';
import { domainManager } from '@/lib/domain-config';

// GET - Récupérer la configuration du domaine actuel
export async function GET(request: NextRequest) {
  try {
    const hostname = request.headers.get('host') || 'localhost:3000';

    // Nettoyer le hostname (enlever le port pour le développement)
    const cleanHostname = hostname.replace(':3000', '').replace(':3001', '');

    // Récupérer la configuration du domaine
    let domainConfig = domainManager.getDomainConfig(cleanHostname);

    // Si pas de configuration trouvée, essayer sans le sous-domaine
    if (!domainConfig && cleanHostname.includes('.')) {
      const baseDomain = cleanHostname.split('.').slice(-2).join('.');
      domainConfig = domainManager.getDomainConfig(baseDomain);
    }

    // Configuration par défaut si aucune trouvée
    if (!domainConfig) {
      domainConfig = {
        id: 'default',
        domain: cleanHostname,
        isActive: true,
        isMainDomain: true,
        ssl: { enabled: false },
        redirects: [],
        customization: {
          primaryColor: '#2563eb',
          title: 'DEMARCHE.GA',
          description: 'Portail des démarches administratives du Gabon',
        },
        features: {
          multipleLanguages: true,
          enabledLanguages: ['fr', 'en'],
          maintenanceMode: false,
          enableRegistration: true,
          enableGuestAccess: false,
          enableAPIAccess: true,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }

    return NextResponse.json({
      domain: domainConfig.domain,
      title: domainConfig.customization.title,
      description: domainConfig.customization.description,
      primaryColor: domainConfig.customization.primaryColor,
      logo: domainConfig.customization.logo,
      favicon: domainConfig.customization.favicon,
      organizationId: domainConfig.organizationId,
      organizationName: domainConfig.organizationName,
      features: domainConfig.features,
      isActive: domainConfig.isActive,
      isMainDomain: domainConfig.isMainDomain,
      ssl: domainConfig.ssl,
    });

  } catch (error) {
    console.error('Erreur lors de la récupération de la configuration du domaine:', error);

    // Retourner une configuration par défaut en cas d'erreur
    return NextResponse.json({
      domain: 'demarche.ga',
      title: 'DEMARCHE.GA',
      description: 'Portail des démarches administratives du Gabon',
      primaryColor: '#2563eb',
      features: {
        multipleLanguages: false,
        enabledLanguages: ['fr'],
        maintenanceMode: false,
        enableRegistration: true,
        enableGuestAccess: false,
        enableAPIAccess: true,
      },
      isActive: true,
      isMainDomain: true,
      ssl: { enabled: false },
    });
  }
}
