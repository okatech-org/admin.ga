import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

// Liste des codes d'organismes valides (vous pouvez l'étendre)
const VALID_ORGANISMES = [
  'dgdi', 'cnss', 'cnamgs', 'min-jus', 'min-int', 'min-eco',
  'min-sante', 'min-transport', 'min-educ', 'mairie-libreville',
  'min-femme', 'min-travail', 'anuttc', 'anac', 'dgi'
];

function isOrganismeRoute(pathname: string): { isOrganisme: boolean; organisme?: string } {
  // Vérifier si c'est une route d'organisme: /[organisme]/...
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length === 0) return { isOrganisme: false };

  const firstSegment = segments[0].toLowerCase();

  // Vérifier si le premier segment correspond à un organisme
  const isValidOrganisme = VALID_ORGANISMES.includes(firstSegment) ||
    !!firstSegment.match(/^(min|dir|age|mai)-[a-z-]+$/) ||
    !!firstSegment.match(/^[a-z]{3,6}$/); // codes courts comme dgdi, cnss, etc.

  return {
    isOrganisme: isValidOrganisme,
    organisme: isValidOrganisme ? firstSegment : undefined
  };
}

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    // Redirections pour le menu optimisé du super admin
    const superAdminRedirects: Record<string, string> = {
      '/super-admin/administrations': '/super-admin/organismes',
      '/super-admin/dashboard': '/super-admin',
      '/super-admin/dashboard-unified': '/super-admin',
    };

    if (superAdminRedirects[pathname]) {
      return NextResponse.redirect(new URL(superAdminRedirects[pathname], req.url));
    }

    // Routes publiques et d'authentification
    const isAuthPage = pathname.startsWith('/auth');
    const isApiAuthRoute = pathname.startsWith('/api/auth');
    const isDemarcheRoute = pathname.startsWith('/demarche');
    const isPublicRoute = ['/', '/services', '/aide', '/contact'].includes(pathname);
    const isApiRoute = pathname.startsWith('/api/');

    // Autoriser les routes publiques
    if (isPublicRoute || isAuthPage || isApiAuthRoute || isApiRoute) {
      return NextResponse.next();
    }

    // Interface DEMARCHE.GA (accessible sans connexion)
    if (isDemarcheRoute) {
      return NextResponse.next();
    }

    // Gestion des routes d'organismes
    const { isOrganisme, organisme } = isOrganismeRoute(pathname);

    if (isOrganisme) {
      // Routes publiques d'organisme (accueil, services publics)
      const organismePublicRoutes = [
        `/${organisme}`,
        `/${organisme}/services`,
        `/${organisme}/contact`,
        `/${organisme}/recherche`
      ];

      if (organismePublicRoutes.some(route => pathname === route || pathname.startsWith(route))) {
        return NextResponse.next();
      }

      // Routes privées d'organisme (nécessitent une connexion)
      if (!token) {
        const callbackUrl = encodeURIComponent(pathname);
        return NextResponse.redirect(
          new URL(`/${organisme}/auth/connexion?callbackUrl=${callbackUrl}`, req.url)
        );
      }

      // Vérifier que l'utilisateur appartient à cet organisme ou est super admin
      const userRole = token.role as string;
      const userOrganisme = token.organization?.code?.toLowerCase() || '';

      if (userRole === 'SUPER_ADMIN') {
        // Super admin peut accéder à tous les organismes
        return NextResponse.next();
      }

      // Vérifier l'appartenance à l'organisme
      if (userRole === 'USER') {
        // Les citoyens peuvent accéder à tous les organismes pour faire des demandes
        return NextResponse.next();
      }

      // Admin, Manager, Agent doivent appartenir à l'organisme
      if (['ADMIN', 'MANAGER', 'AGENT'].includes(userRole)) {
        if (userOrganisme !== organisme) {
          // Rediriger vers l'organisme de l'utilisateur
          if (userOrganisme) {
            return NextResponse.redirect(new URL(`/${userOrganisme}/dashboard`, req.url));
          } else {
            // Pas d'organisme assigné, rediriger vers DEMARCHE.GA
            return NextResponse.redirect(new URL('/demarche', req.url));
          }
        }
      }

      return NextResponse.next();
    }

    // Rediriger vers la connexion si pas connecté (routes non publiques)
    if (!token) {
      const callbackUrl = encodeURIComponent(pathname);
      return NextResponse.redirect(
        new URL(`/auth/connexion?callbackUrl=${callbackUrl}`, req.url)
      );
    }

    const userRole = token.role as string;
    const userOrganisme = token.organization?.code?.toLowerCase();

    // Protection des routes par rôle (routes classiques)
    const roleRoutes = {
      SUPER_ADMIN: ['/super-admin', '/admin'],
      ADMIN: ['/admin'],
      MANAGER: ['/manager', '/admin'],
      AGENT: ['/agent'],
      USER: ['/citoyen']
    };

    // Vérifier si l'utilisateur a accès à cette route
    const allowedRoutes = roleRoutes[userRole as keyof typeof roleRoutes] || [];
    const hasAccess = allowedRoutes.some(route => pathname.startsWith(route));

    if (!hasAccess) {
      // Redirection intelligente selon le rôle et l'organisme
      if (userRole === 'SUPER_ADMIN') {
        return NextResponse.redirect(new URL('/super-admin', req.url));
      }

      // Pour les autres rôles, rediriger vers leur organisme s'ils en ont un
      if (userOrganisme && ['ADMIN', 'MANAGER', 'AGENT'].includes(userRole)) {
        return NextResponse.redirect(new URL(`/${userOrganisme}/dashboard`, req.url));
      }

      // Redirection par défaut selon le rôle
      const defaultRedirects = {
        ADMIN: '/admin/dashboard',
        MANAGER: '/manager/dashboard',
        AGENT: '/agent/dashboard',
        USER: '/demarche' // Les citoyens vont sur DEMARCHE.GA
      };

      const redirectPath = defaultRedirects[userRole as keyof typeof defaultRedirects] || '/demarche';
      return NextResponse.redirect(new URL(redirectPath, req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: () => true, // On gère l'autorisation dans le middleware
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
