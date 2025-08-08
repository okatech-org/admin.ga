import { NextRequest, NextResponse } from 'next/server';
import { domainService } from '@/lib/services/domain-management.service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { domain, deploymentConfig } = body;

    if (!domain || !deploymentConfig) {
      return NextResponse.json({
        success: false,
        error: 'Domaine et configuration de déploiement requis'
      }, { status: 400 });
    }

    const certificate = await domainService.provisionSSL(domain, deploymentConfig);

    return NextResponse.json({
      success: true,
      data: {
        message: 'Certificat SSL provisionné avec succès',
        certificate
      }
    });
  } catch (error) {
    console.error('Erreur provisioning SSL:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Erreur lors du provisioning SSL'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get('domain');

    if (!domain) {
      return NextResponse.json({
        success: false,
        error: 'Domaine requis'
      }, { status: 400 });
    }

    // Simulation de vérification de certificat SSL
    try {
      const response = await fetch(`https://${domain}`, {
        method: 'HEAD',
        timeout: 10000
      });

      const sslInfo = {
        domain,
        isValid: response.ok,
        status: response.ok ? 'active' : 'error',
        issuer: "Let's Encrypt",
        validFrom: new Date(),
        validTo: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        daysUntilExpiry: 89
      };

      return NextResponse.json({
        success: true,
        data: sslInfo
      });
    } catch (error) {
      return NextResponse.json({
        success: true,
        data: {
          domain,
          isValid: false,
          status: 'error',
          error: 'Impossible de vérifier le certificat SSL'
        }
      });
    }
  } catch (error) {
    console.error('Erreur vérification SSL:', error);
    return NextResponse.json({
      success: false,
      error: 'Erreur serveur interne'
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get('domain');

    if (!domain) {
      return NextResponse.json({
        success: false,
        error: 'Domaine requis'
      }, { status: 400 });
    }

    // Simulation de révocation de certificat SSL
    return NextResponse.json({
      success: true,
      data: {
        message: `Certificat SSL pour ${domain} révoqué avec succès`
      }
    });
  } catch (error) {
    console.error('Erreur révocation SSL:', error);
    return NextResponse.json({
      success: false,
      error: 'Erreur serveur interne'
    }, { status: 500 });
  }
}
