import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, domain, dnsRecord, recordId } = body;

    switch (action) {
      case 'add_record':
        if (!domain || !dnsRecord) {
          return NextResponse.json({
            success: false,
            error: 'Domaine et enregistrement DNS requis'
          }, { status: 400 });
        }

        // Validation des données d'enregistrement DNS
        if (!dnsRecord.type || !dnsRecord.name || !dnsRecord.value) {
          return NextResponse.json({
            success: false,
            error: 'Type, nom et valeur de l\'enregistrement requis'
          }, { status: 400 });
        }

        // Simuler l'ajout d'un enregistrement DNS
        const newRecord = {
          id: Date.now().toString(),
          type: dnsRecord.type,
          name: dnsRecord.name,
          value: dnsRecord.value,
          ttl: dnsRecord.ttl || 3600,
          priority: dnsRecord.priority || null,
          status: 'pending',
          created: new Date().toISOString(),
          description: dnsRecord.description || ''
        };

        console.log(`✅ Nouvel enregistrement DNS ajouté pour ${domain}:`, newRecord);

        return NextResponse.json({
          success: true,
          data: {
            message: 'Enregistrement DNS ajouté avec succès',
            record: newRecord,
            propagationTime: '5-30 minutes',
            domain
          }
        });

      case 'update_record':
        if (!domain || !recordId || !dnsRecord) {
          return NextResponse.json({
            success: false,
            error: 'Domaine, ID enregistrement et données requis'
          }, { status: 400 });
        }

        // Simuler la mise à jour d'un enregistrement DNS
        const updatedRecord = {
          id: recordId,
          type: dnsRecord.type,
          name: dnsRecord.name,
          value: dnsRecord.value,
          ttl: dnsRecord.ttl || 3600,
          priority: dnsRecord.priority || null,
          status: 'updating',
          lastModified: new Date().toISOString(),
          description: dnsRecord.description || ''
        };

        console.log(`🔄 Enregistrement DNS mis à jour pour ${domain}:`, updatedRecord);

        return NextResponse.json({
          success: true,
          data: {
            message: 'Enregistrement DNS mis à jour avec succès',
            record: updatedRecord,
            propagationTime: '5-30 minutes',
            domain
          }
        });

      case 'delete_record':
        if (!domain || !recordId) {
          return NextResponse.json({
            success: false,
            error: 'Domaine et ID enregistrement requis'
          }, { status: 400 });
        }

        console.log(`🗑️ Enregistrement DNS supprimé pour ${domain}, ID: ${recordId}`);

        // Simuler la suppression d'un enregistrement DNS
        return NextResponse.json({
          success: true,
          data: {
            message: 'Enregistrement DNS supprimé avec succès',
            recordId,
            propagationTime: '5-30 minutes',
            domain
          }
        });

      case 'validate_record':
        if (!dnsRecord) {
          return NextResponse.json({
            success: false,
            error: 'Enregistrement DNS requis pour validation'
          }, { status: 400 });
        }

        // Validation des règles DNS
        const validationErrors = [];

        if (!['A', 'AAAA', 'CNAME', 'MX', 'TXT', 'NS', 'PTR', 'SRV'].includes(dnsRecord.type)) {
          validationErrors.push('Type d\'enregistrement non supporté');
        }

        if (dnsRecord.type === 'A') {
          const ipParts = dnsRecord.value.split('.');
          if (ipParts.length !== 4 || ipParts.some(part => {
            const num = parseInt(part);
            return isNaN(num) || num < 0 || num > 255;
          })) {
            validationErrors.push('Adresse IPv4 invalide pour enregistrement A');
          }
        }

        if (dnsRecord.type === 'MX' && !dnsRecord.priority) {
          validationErrors.push('Priorité requise pour enregistrement MX');
        }

        if (dnsRecord.name && dnsRecord.name.includes(' ')) {
          validationErrors.push('Le nom ne peut pas contenir d\'espaces');
        }

        return NextResponse.json({
          success: validationErrors.length === 0,
          data: {
            valid: validationErrors.length === 0,
            errors: validationErrors,
            suggestions: validationErrors.length === 0 ? [
              'Enregistrement valide',
              'TTL recommandé: 3600 secondes (1h) pour les changements fréquents',
              'TTL recommandé: 86400 secondes (24h) pour les enregistrements stables'
            ] : []
          }
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Action non reconnue'
        }, { status: 400 });
    }
  } catch (error) {
    console.error('Erreur éditeur DNS:', error);
    return NextResponse.json({
      success: false,
      error: 'Erreur serveur interne'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get('domain');
    const recordType = searchParams.get('type');

    if (!domain) {
      return NextResponse.json({
        success: false,
        error: 'Domaine requis'
      }, { status: 400 });
    }

    // Fournir des templates et suggestions pour les enregistrements DNS
    const dnsTemplates = {
      A: {
        name: '@',
        value: '185.26.106.234',
        ttl: 3600,
        description: 'Pointe vers l\'adresse IP du serveur'
      },
      AAAA: {
        name: '@',
        value: '2001:db8::1',
        ttl: 3600,
        description: 'Adresse IPv6 du serveur'
      },
      CNAME: {
        name: 'www',
        value: domain,
        ttl: 3600,
        description: 'Alias pour le sous-domaine www'
      },
      MX: {
        name: '@',
        value: `mail.${domain}`,
        ttl: 3600,
        priority: 10,
        description: 'Serveur de messagerie'
      },
      TXT: {
        name: '@',
        value: 'v=spf1 include:_spf.google.com ~all',
        ttl: 3600,
        description: 'Enregistrement SPF pour l\'email'
      },
      NS: {
        name: '@',
        value: 'ns1.administration.net',
        ttl: 86400,
        description: 'Serveur de noms'
      }
    };

    const commonRecords = [
      {
        type: 'A',
        name: 'api',
        value: '185.26.106.234',
        description: 'API endpoint'
      },
      {
        type: 'CNAME',
        name: 'admin',
        value: domain,
        description: 'Interface d\'administration'
      },
      {
        type: 'TXT',
        name: '@',
        value: 'google-site-verification=your-verification-code',
        description: 'Vérification Google'
      }
    ];

    return NextResponse.json({
      success: true,
      data: {
        domain,
        templates: recordType ? { [recordType]: dnsTemplates[recordType] } : dnsTemplates,
        commonRecords,
        supportedTypes: ['A', 'AAAA', 'CNAME', 'MX', 'TXT', 'NS', 'PTR', 'SRV'],
        guidelines: {
          ttl: {
            min: 300,
            max: 86400,
            recommended: 3600,
            description: 'Temps de cache DNS en secondes'
          },
          naming: {
            rules: [
              'Pas d\'espaces dans les noms',
              'Utilisez @ pour le domaine racine',
              'Les sous-domaines peuvent contenir lettres, chiffres et tirets'
            ]
          }
        }
      }
    });
  } catch (error) {
    console.error('Erreur récupération templates DNS:', error);
    return NextResponse.json({
      success: false,
      error: 'Erreur serveur interne'
    }, { status: 500 });
  }
}
