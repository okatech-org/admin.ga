import { NextRequest, NextResponse } from 'next/server';
import { domainService } from '@/lib/services/domain-management.service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { domain, records } = body;

    if (!domain || !records || !Array.isArray(records)) {
      return NextResponse.json({
        success: false,
        error: 'Domaine et enregistrements DNS requis'
      }, { status: 400 });
    }

    const success = await domainService.configureNetimDNS(domain, records);

    if (success) {
      return NextResponse.json({
        success: true,
        data: {
          message: 'Configuration DNS réussie',
          domain,
          recordsCount: records.length
        }
      });
    } else {
      return NextResponse.json({
        success: false,
        error: 'Échec de la configuration DNS'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Erreur configuration DNS:', error);
    return NextResponse.json({
      success: false,
      error: (error as Error).message || 'Erreur serveur interne'
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

    // Serveurs DNS actuels (Netim)
    const netimDNSServers = [
      { name: 'ns1.netim.net', type: 'primary', status: 'active' },
      { name: 'ns2.netim.net', type: 'secondary', status: 'active' },
      { name: 'ns3.netim.net', type: 'secondary', status: 'active' }
    ];

    // Enregistrements cibles
    const expectedIP = '185.26.106.234';
    const targetRecords = {
      A_ROOT: { name: '@', value: expectedIP },
      A_WWW: { name: 'www', value: expectedIP },
      MX1: { name: '@', value: 'mx1.netim.net', priority: 10 },
      MX2: { name: '@', value: 'mx2.netim.net', priority: 10 },
      TXT_SPF: { name: '@', value: 'v=spf1 ip4:185.26.104.0/22 ~all' }
    } as const;

    // Résolution DNS en temps réel (Google DNS over HTTPS)
    const resolveA = async (host: string) => {
      try {
        const res = await fetch(`https://dns.google/resolve?name=${host}&type=A`, { cache: 'no-store' });
        const json = await res.json();
        const answers = json.Answer || [];
        return answers.some((a: any) => a.data === expectedIP);
      } catch {
        return false;
      }
    };

    const resolveMX = async (host: string) => {
      try {
        const res = await fetch(`https://dns.google/resolve?name=${host}&type=MX`, { cache: 'no-store' });
        const json = await res.json();
        const answers = json.Answer || [];
        const datas = answers.map((a: any) => String(a.data));
        const ok1 = datas.some((d: string) => d.includes('mx1.netim.net'));
        const ok2 = datas.some((d: string) => d.includes('mx2.netim.net'));
        return { ok1, ok2 };
      } catch {
        return { ok1: false, ok2: false };
      }
    };

    const resolveTXT = async (host: string) => {
      try {
        const res = await fetch(`https://dns.google/resolve?name=${host}&type=TXT`, { cache: 'no-store' });
        const json = await res.json();
        const answers = json.Answer || [];
        const datas = answers.map((a: any) => String(a.data).replace(/^"|"$/g, ''));
        return datas.some((d: string) => d.includes(targetRecords.TXT_SPF.value));
      } catch {
        return false;
      }
    };

    const [aRootOK, aWwwOK, mxStatus, txtOK] = await Promise.all([
      resolveA(domain),
      resolveA(`www.${domain}`),
      resolveMX(domain),
      resolveTXT(domain)
    ]);

    // Enregistrements DNS avec statut dynamique
    const dnsRecords = [
      {
        id: '1',
        type: 'A',
        name: targetRecords.A_ROOT.name,
        value: targetRecords.A_ROOT.value,
        ttl: 3600,
        status: aRootOK ? 'active' : 'pending',
        description: 'Apex vers l\'adresse IP du serveur'
      },
      {
        id: '2',
        type: 'A',
        name: targetRecords.A_WWW.name,
        value: targetRecords.A_WWW.value,
        ttl: 3600,
        status: aWwwOK ? 'active' : 'pending',
        description: 'Sous-domaine www vers l\'adresse IP du serveur'
      },
      {
        id: '3',
        type: 'MX',
        name: targetRecords.MX1.name,
        value: targetRecords.MX1.value,
        ttl: 3600,
        priority: targetRecords.MX1.priority,
        status: mxStatus.ok1 ? 'active' : 'pending',
        description: 'Serveur mail primaire (Netim)'
      },
      {
        id: '4',
        type: 'MX',
        name: targetRecords.MX2.name,
        value: targetRecords.MX2.value,
        ttl: 3600,
        priority: targetRecords.MX2.priority,
        status: mxStatus.ok2 ? 'active' : 'pending',
        description: 'Serveur mail secondaire (Netim)'
      },
      {
        id: '5',
        type: 'TXT',
        name: targetRecords.TXT_SPF.name,
        value: targetRecords.TXT_SPF.value,
        ttl: 3600,
        status: txtOK ? 'active' : 'pending',
        description: 'SPF autorisant le bloc 185.26.104.0/22'
      }
    ];

    return NextResponse.json({
      success: true,
      data: {
        domain,
        records: dnsRecords,
        dnsServers: netimDNSServers,
        provider: 'Netim.com',
        configured: domain === 'administration.ga' ? true : false,
        lastUpdate: new Date(),
        whoisInfo: {
          registrar: 'NETIM',
          createdDate: '2025-07-31T03:19:37.588212Z',
          expiryDate: '2026-07-31T03:19:37.500489Z',
          status: 'actif',
          lastModified: '2025-08-08T07:46:08.662928Z'
        },
        instructions: {
          step1: 'Connectez-vous à Netim.com',
          step2: 'Vérifiez que les serveurs DNS sont ns1/2/3.netim.net',
          step3: 'Ajoutez/validez les enregistrements ci-dessus (A, MX, TXT)',
          step4: 'Attendez la propagation (quelques minutes à 24h)'
        }
      }
    });
  } catch (error) {
    console.error('Erreur récupération DNS:', error);
    return NextResponse.json({
      success: false,
      error: 'Erreur serveur interne'
    }, { status: 500 });
  }
}
