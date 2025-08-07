// Middleware Multi-Tenant pour détection et isolation des organismes

import { NextRequest, NextResponse } from 'next/server';
import { OrganismeMultiTenant, ConfigurationRoute } from '@/lib/types/multi-tenant';

interface TenantContext {
  organisme: OrganismeMultiTenant | null;
  type_acces: 'domaine_personnalise' | 'sous_domaine' | 'chemin_url' | 'super_admin';
  slug?: string;
  domaine_detecte: string;
}

export class TenantMiddleware {
  private static organismes: Map<string, OrganismeMultiTenant> = new Map();
  private static domaines: Map<string, string> = new Map(); // domaine -> organisme_id
  private static routes: ConfigurationRoute[] = [];

  /**
   * Détecte l'organisme basé sur l'URL de la requête
   */
  static async detectTenant(request: NextRequest): Promise<TenantContext> {
    const url = new URL(request.url);
    const hostname = url.hostname;
    const pathname = url.pathname;

    // 1. Vérifier si c'est une route super-admin
    if (pathname.startsWith('/super-admin')) {
      return {
        organisme: null,
        type_acces: 'super_admin',
        domaine_detecte: hostname
      };
    }

    // 2. Vérifier domaine personnalisé (exemple.com)
    const organismeParDomaine = await this.getOrganismeParDomaine(hostname);
    if (organismeParDomaine) {
      return {
        organisme: organismeParDomaine,
        type_acces: 'domaine_personnalise',
        domaine_detecte: hostname
      };
    }

    // 3. Vérifier sous-domaine (exemple.administration.ga)
    const sousDomaineMatch = hostname.match(/^([a-z0-9-]+)\.administration\.ga$/);
    if (sousDomaineMatch) {
      const slug = sousDomaineMatch[1];
      const organismeParSlug = await this.getOrganismeParSlug(slug);
      if (organismeParSlug) {
        return {
          organisme: organismeParSlug,
          type_acces: 'sous_domaine',
          slug,
          domaine_detecte: hostname
        };
      }
    }

    // 4. Vérifier chemin URL (administration.ga/org/exemple)
    const cheminMatch = pathname.match(/^\/org\/([a-z0-9-]+)/);
    if (cheminMatch && hostname === 'administration.ga') {
      const slug = cheminMatch[1];
      const organismeParSlug = await this.getOrganismeParSlug(slug);
      if (organismeParSlug) {
        return {
          organisme: organismeParSlug,
          type_acces: 'chemin_url',
          slug,
          domaine_detecte: hostname
        };
      }
    }

    // Aucun organisme détecté
    return {
      organisme: null,
      type_acces: 'super_admin',
      domaine_detecte: hostname
    };
  }

  /**
   * Middleware principal pour Next.js
   */
  static async middleware(request: NextRequest): Promise<NextResponse> {
    const tenantContext = await this.detectTenant(request);
    const url = request.nextUrl.clone();

    // Gérer les routes super-admin (pas de tenant)
    if (tenantContext.type_acces === 'super_admin' && !tenantContext.organisme) {
      // Laisser passer les routes super-admin et les assets
      if (url.pathname.startsWith('/super-admin') ||
          url.pathname.startsWith('/_next') ||
          url.pathname.startsWith('/api') ||
          url.pathname.includes('.')) {
        return NextResponse.next();
      }

      // Rediriger vers super-admin pour les autres routes
      url.pathname = '/super-admin';
      return NextResponse.redirect(url);
    }

    // Organisme détecté
    if (tenantContext.organisme) {
      const organisme = tenantContext.organisme;

      // Vérifier que l'organisme est actif
      if (organisme.statut !== 'actif') {
        return this.renderOrganismeInactif(organisme);
      }

      // Ajouter les headers pour l'identification du tenant
      const response = NextResponse.next();
      response.headers.set('X-Tenant-ID', organisme.id);
      response.headers.set('X-Tenant-Slug', organisme.slug);
      response.headers.set('X-Tenant-Type', tenantContext.type_acces);
      response.headers.set('X-Tenant-Domain', tenantContext.domaine_detecte);

      // Gérer les routes spécifiques à l'organisme
      return this.handleOrganismeRoutes(request, response, tenantContext);
    }

    // Organisme non trouvé
    return this.renderOrganismeNonTrouve();
  }

  /**
   * Gère les routes spécifiques à un organisme
   */
  private static handleOrganismeRoutes(
    request: NextRequest,
    response: NextResponse,
    context: TenantContext
  ): NextResponse {
    const url = request.nextUrl.clone();
    const pathname = url.pathname;

    // Rediriger les chemins URL vers la structure interne
    if (context.type_acces === 'chemin_url') {
      // Supprimer /org/slug du chemin
      const newPathname = pathname.replace(`/org/${context.slug}`, '') || '/';
      url.pathname = newPathname;
      return NextResponse.rewrite(url);
    }

    // Routes publiques de l'organisme
    if (pathname === '/' || pathname === '') {
      url.pathname = '/organisme/accueil';
      return NextResponse.rewrite(url);
    }

    if (pathname === '/login' || pathname === '/connexion') {
      url.pathname = '/organisme/auth/connexion';
      return NextResponse.rewrite(url);
    }

    if (pathname === '/dashboard') {
      url.pathname = '/organisme/dashboard';
      return NextResponse.rewrite(url);
    }

    // API spécifique à l'organisme
    if (pathname.startsWith('/api/org/')) {
      return response;
    }

    return response;
  }

  /**
   * Récupère un organisme par son domaine personnalisé
   */
  private static async getOrganismeParDomaine(domaine: string): Promise<OrganismeMultiTenant | null> {
    // En production, ceci ferait une requête à la base de données
    // Pour la démonstration, on simule avec des données en cache
    const organismeId = this.domaines.get(domaine);
    if (organismeId) {
      return this.organismes.get(organismeId) || null;
    }
    return null;
  }

  /**
   * Récupère un organisme par son slug
   */
  private static async getOrganismeParSlug(slug: string): Promise<OrganismeMultiTenant | null> {
    // En production, ceci ferait une requête à la base de données
    for (const organisme of this.organismes.values()) {
      if (organisme.slug === slug) {
        return organisme;
      }
    }
    return null;
  }

  /**
   * Rendu pour organisme inactif
   */
  private static renderOrganismeInactif(organisme: OrganismeMultiTenant): NextResponse {
    const html = `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Service Temporairement Indisponible</title>
        <style>
          body {
            font-family: system-ui, -apple-system, sans-serif;
            margin: 0;
            padding: 2rem;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .container {
            text-align: center;
            max-width: 500px;
          }
          .icon {
            font-size: 4rem;
            margin-bottom: 1rem;
          }
          h1 {
            margin-bottom: 1rem;
            font-size: 2rem;
          }
          p {
            opacity: 0.9;
            line-height: 1.6;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="icon">⚠️</div>
          <h1>Service Temporairement Indisponible</h1>
          <p>
            Le service de <strong>${organisme.nom}</strong> est actuellement
            ${organisme.statut === 'suspendu' ? 'suspendu' : 'désactivé'}.
          </p>
          <p>
            Veuillez contacter l'administrateur pour plus d'informations.
          </p>
        </div>
      </body>
      </html>
    `;

    return new NextResponse(html, {
      status: 503,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
  }

  /**
   * Rendu pour organisme non trouvé
   */
  private static renderOrganismeNonTrouve(): NextResponse {
    const html = `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Organisme Non Trouvé</title>
        <style>
          body {
            font-family: system-ui, -apple-system, sans-serif;
            margin: 0;
            padding: 2rem;
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            color: white;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .container {
            text-align: center;
            max-width: 500px;
          }
          .icon {
            font-size: 4rem;
            margin-bottom: 1rem;
          }
          h1 {
            margin-bottom: 1rem;
            font-size: 2rem;
          }
          p {
            opacity: 0.9;
            line-height: 1.6;
          }
          .link {
            color: white;
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="icon">🔍</div>
          <h1>Organisme Non Trouvé</h1>
          <p>
            L'organisme que vous cherchez n'existe pas ou n'est pas encore configuré.
          </p>
          <p>
            <a href="https://administration.ga" class="link">Retourner à l'accueil</a>
          </p>
        </div>
      </body>
      </html>
    `;

    return new NextResponse(html, {
      status: 404,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
  }

  /**
   * Initialise le cache des organismes (à appeler au démarrage)
   */
  static async initialiserCache(): Promise<void> {
    // En production, charger depuis la base de données
    // Pour la démonstration, on ajoute quelques exemples

    const exempleOrganisme: OrganismeMultiTenant = {
      id: 'org_demo_001',
      nom: 'Ministère de la Digitalisation',
      slug: 'min-digitalisation',
      domaine_personnalise: 'digitalisation.ga',
      date_creation: new Date().toISOString(),
      statut: 'actif',
      logo_url: '/logos/min-digitalisation.png',
      favicon_url: '/favicons/min-digitalisation.ico',
      couleur_primaire: '#1976d2',
      couleur_secondaire: '#42a5f5',
      css_personnalise: '',
      config: {
        max_utilisateurs: 100,
        fonctionnalites_actives: ['Dashboard Avancé', 'API Publique'],
        langue_defaut: 'fr'
      },
      pages_personnalisees: {
        message_bienvenue: 'Bienvenue sur la plateforme du Ministère de la Digitalisation',
        contenu_accueil: '# Services Numériques\n\nAccédez à tous vos services administratifs...',
        pied_page: '© 2024 Ministère de la Digitalisation - République Gabonaise'
      },
      integrations: {
        sso_actif: false,
        api_publique_activee: true,
        webhooks_actifs: false
      }
    };

    this.organismes.set(exempleOrganisme.id, exempleOrganisme);
    this.domaines.set('digitalisation.ga', exempleOrganisme.id);
  }

  /**
   * Utilitaire pour obtenir le contexte tenant depuis les headers
   */
  static getTenantFromHeaders(headers: Headers): TenantContext | null {
    const tenantId = headers.get('X-Tenant-ID');
    const tenantSlug = headers.get('X-Tenant-Slug');
    const tenantType = headers.get('X-Tenant-Type') as any;
    const tenantDomain = headers.get('X-Tenant-Domain');

    if (!tenantId || !tenantType) {
      return null;
    }

    const organisme = this.organismes.get(tenantId);

    return {
      organisme: organisme || null,
      type_acces: tenantType,
      slug: tenantSlug || undefined,
      domaine_detecte: tenantDomain || ''
    };
  }
}

// Fonction d'export pour le middleware Next.js
export async function middleware(request: NextRequest) {
  return TenantMiddleware.middleware(request);
}

// Configuration du middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
