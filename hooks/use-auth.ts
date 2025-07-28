import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function useAuth(requiredRole?: string) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return; // Still loading

    if (!session) {
      router.push('/auth/connexion');
      return;
    }

    // Vérifier si l'utilisateur a le rôle requis
    if (requiredRole && session.user.role !== requiredRole) {
      // Rediriger vers le dashboard approprié
      const dashboardRoutes = {
        SUPER_ADMIN: '/admin/dashboard',
        ADMIN: '/admin/dashboard',
        MANAGER: '/manager/dashboard',
        AGENT: '/agent/dashboard',
        USER: '/citoyen/dashboard'
      };

      const redirectPath = dashboardRoutes[session.user.role] || '/';
      router.push(redirectPath);
      return;
    }
  }, [session, status, router, requiredRole]);

  return {
    user: session?.user,
    isLoading: status === 'loading',
    isAuthenticated: !!session,
    hasRole: (role: string) => session?.user.role === role,
    hasAnyRole: (roles: string[]) => roles.includes(session?.user.role || ''),
    isAdmin: ['SUPER_ADMIN', 'ADMIN'].includes(session?.user.role || ''),
    isSuperAdmin: session?.user.role === 'SUPER_ADMIN',
  };
}

// Hook pour protéger les pages
export function useRequireAuth(requiredRole?: string) {
  const auth = useAuth(requiredRole);
  
  if (auth.isLoading) {
    return { ...auth, isLoading: true };
  }

  if (!auth.isAuthenticated) {
    return { ...auth, isLoading: false };
  }

  return { ...auth, isLoading: false };
}

// Hook pour les redirections après connexion
export function useAuthRedirect() {
  const { data: session } = useSession();
  const router = useRouter();

  const redirectToAppropriateScreen = () => {
    if (!session?.user) return;

    const dashboardRoutes = {
      SUPER_ADMIN: '/admin/dashboard',
      ADMIN: '/admin/dashboard', 
      MANAGER: '/manager/dashboard',
      AGENT: '/agent/dashboard',
      USER: '/citoyen/dashboard'
    };

    const redirectPath = dashboardRoutes[session.user.role] || '/citoyen/dashboard';
    router.push(redirectPath);
  };

  return { redirectToAppropriateScreen };
}