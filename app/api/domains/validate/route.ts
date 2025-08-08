/* @ts-nocheck */
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { domainManager, validateDomain, validateSubdomain } from '@/lib/domain-config';
import dns from 'dns';
import { promisify } from 'util';

const dnsLookup = promisify(dns.lookup);
const dnsResolve = promisify(dns.resolve);

// POST - Valider un domaine
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      );
    }

    const { domain, subdomain, checkDNS = false } = await request.json();

    if (!domain) {
      return NextResponse.json(
        { error: 'Domaine requis' },
        { status: 400 }
      );
    }

    const validation = {
      domain: {
        valid: false,
        message: '',
      },
      subdomain: {
        valid: true,
        message: '',
      },
      availability: {
        available: false,
        message: '',
      },
      dns: {
        valid: false,
        message: '',
        records: null as any,
      },
      ssl: {
        valid: false,
        message: '',
        certificate: null as any,
      },
    };

    // Validation du format de domaine
    if (validateDomain(domain)) {
      validation.domain.valid = true;
      validation.domain.message = 'Format de domaine valide';
    } else {
      validation.domain.valid = false;
      validation.domain.message = 'Format de domaine invalide';
    }

    // Validation du sous-domaine si fourni
    if (subdomain) {
      if (validateSubdomain(subdomain)) {
        validation.subdomain.valid = true;
        validation.subdomain.message = 'Format de sous-domaine valide';
      } else {
        validation.subdomain.valid = false;
        validation.subdomain.message = 'Format de sous-domaine invalide';
      }
    }

    // Vérification de la disponibilité
    const fullDomain = subdomain ? `${subdomain}.${domain}` : domain;
    const isAlreadyTaken = domainManager.isDomainTaken(fullDomain);

    if (!isAlreadyTaken) {
      validation.availability.available = true;
      validation.availability.message = 'Domaine disponible';
    } else {
      validation.availability.available = false;
      validation.availability.message = 'Domaine déjà utilisé';
    }

    // Vérification DNS si demandée
    if (checkDNS && validation.domain.valid) {
      try {
        // Vérifier l'existence du domaine
        await dnsLookup(domain);
        validation.dns.valid = true;
        validation.dns.message = 'Domaine résolvable';

        // Obtenir les enregistrements DNS
        try {
          const [aRecords, aaaaRecords, mxRecords, txtRecords] = await Promise.allSettled([
            dnsResolve(domain, 'A').catch(() => []),
            dnsResolve(domain, 'AAAA').catch(() => []),
            dnsResolve(domain, 'MX').catch(() => []),
            dnsResolve(domain, 'TXT').catch(() => []),
          ]);

          validation.dns.records = {
            A: aRecords.status === 'fulfilled' ? aRecords.value : [],
            AAAA: aaaaRecords.status === 'fulfilled' ? aaaaRecords.value : [],
            MX: mxRecords.status === 'fulfilled' ? mxRecords.value : [],
            TXT: txtRecords.status === 'fulfilled' ? txtRecords.value : [],
          };
        } catch (error) {
          console.warn('Erreur lors de la récupération des enregistrements DNS:', error);
        }

      } catch (error) {
        validation.dns.valid = false;
        validation.dns.message = 'Domaine non résolvable ou inexistant';
      }
    }

    // Vérification SSL si le domaine est résolvable
    if (validation.dns.valid) {
      try {
        const sslInfo = await checkSSLCertificate(fullDomain);
        validation.ssl = sslInfo;
      } catch (error) {
        validation.ssl.valid = false;
        validation.ssl.message = 'Impossible de vérifier le certificat SSL';
      }
    }

    // Calcul du score de validation global
    const scores = [
      validation.domain.valid,
      validation.subdomain.valid,
      validation.availability.available,
      checkDNS ? validation.dns.valid : true,
    ];

    const validationScore = (scores.filter(Boolean).length / scores.length) * 100;

    return NextResponse.json({
      validation,
      score: validationScore,
      recommendations: generateRecommendations(validation),
      fullDomain,
    });

  } catch (error) {
    console.error('Erreur lors de la validation du domaine:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// Fonction pour vérifier le certificat SSL
async function checkSSLCertificate(domain: string) {
  try {
    const https = require('https');
    const options = {
      hostname: domain,
      port: 443,
      method: 'HEAD',
      timeout: 5000,
    };

    return new Promise((resolve) => {
      const req = https.request(options, (res: any) => {
        const cert = res.socket.getPeerCertificate();

        if (cert && Object.keys(cert).length > 0) {
          const validFrom = new Date(cert.valid_from);
          const validTo = new Date(cert.valid_to);
          const now = new Date();

          const isValid = now >= validFrom && now <= validTo;
          const daysUntilExpiry = Math.ceil((validTo.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

          resolve({
            valid: isValid,
            message: isValid ? `Certificat SSL valide (expire dans ${daysUntilExpiry} jours)` : 'Certificat SSL expiré',
            certificate: {
              issuer: cert.issuer,
              subject: cert.subject,
              validFrom: cert.valid_from,
              validTo: cert.valid_to,
              fingerprint: cert.fingerprint,
              serialNumber: cert.serialNumber,
            },
          });
        } else {
          resolve({
            valid: false,
            message: 'Aucun certificat SSL trouvé',
            certificate: null,
          });
        }
      });

      req.on('error', () => {
        resolve({
          valid: false,
          message: 'Erreur de connexion SSL',
          certificate: null,
        });
      });

      req.on('timeout', () => {
        req.destroy();
        resolve({
          valid: false,
          message: 'Timeout de connexion SSL',
          certificate: null,
        });
      });

      req.end();
    });
  } catch (error) {
    return {
      valid: false,
      message: 'Erreur lors de la vérification SSL',
      certificate: null,
    };
  }
}

// Générer des recommandations basées sur la validation
function generateRecommendations(validation: any): string[] {
  const recommendations: string[] = [];

  if (!validation.domain.valid) {
    recommendations.push('Vérifiez le format du domaine (ex: exemple.com)');
  }

  if (!validation.subdomain.valid) {
    recommendations.push('Le sous-domaine doit contenir uniquement des lettres, chiffres et tirets');
  }

  if (!validation.availability.available) {
    recommendations.push('Choisissez un autre nom de domaine car celui-ci est déjà utilisé');
  }

  if (!validation.dns.valid) {
    recommendations.push('Assurez-vous que le domaine existe et pointe vers les bons serveurs DNS');
  }

  if (!validation.ssl.valid) {
    recommendations.push('Configurez un certificat SSL valide pour sécuriser le domaine');
  }

  if (validation.ssl.valid && validation.ssl.certificate) {
    const validTo = new Date(validation.ssl.certificate.validTo);
    const now = new Date();
    const daysUntilExpiry = Math.ceil((validTo.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiry < 30) {
      recommendations.push('Le certificat SSL expire bientôt, prévoyez son renouvellement');
    }
  }

  if (recommendations.length === 0) {
    recommendations.push('Le domaine est prêt à être configuré');
  }

  return recommendations;
}
