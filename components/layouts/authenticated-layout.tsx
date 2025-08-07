/* @ts-nocheck */
"use client";

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Flag, Bell } from 'lucide-react';
import { Sidebar } from './sidebar';
import { SidebarModern } from './sidebar-modern';
import { SidebarUltraModerne } from './sidebar-ultra-moderne';
import { UserMenu } from '../layout/user-menu';
import { DemarcheLayout } from './demarche-layout';
import { OrganismeLayout } from './organisme-layout';
import { LogoAdministrationGA } from '@/components/ui/logo-administration-ga';

interface AuthenticatedLayoutProps {
  children: ReactNode;
}

export function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/connexion');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 gabon-gradient rounded-full flex items-center justify-center mx-auto mb-4">
            <Flag className="w-4 h-4 text-white" />
          </div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  // Interface DEMARCHE.GA pour les citoyens
  if (session.user.role === 'USER') {
    return <DemarcheLayout>{children}</DemarcheLayout>;
  }

  // Interface spécifique à l'organisme pour ADMIN/MANAGER/AGENT
  if (['ADMIN', 'MANAGER', 'AGENT'].includes(session.user.role) && session.user.organizationId) {
    return <OrganismeLayout>{children}</OrganismeLayout>;
  }

  // Interface ADMINISTRATION.GA uniquement pour les SUPER_ADMIN
  if (session.user.role === 'SUPER_ADMIN') {
    return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          {/* Logo et titre ADMINISTRATION.GA */}
          <div className="flex items-center space-x-3">
            <LogoAdministrationGA width={32} height={32} />
            <div className="flex flex-col">
              <span className="font-bold text-base bg-gradient-to-r from-green-600 via-yellow-500 to-blue-600 bg-clip-text text-transparent">
                ADMINISTRATION.GA
              </span>
              <span className="text-xs text-muted-foreground">République Gabonaise</span>
            </div>
          </div>

          {/* Actions à droite */}
          <div className="flex items-center space-x-3">
            {/* Notifications */}
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Bell className="h-3 w-3" />
            </Button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Menu */}
            <UserMenu />
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar - Ultra-moderne pour Super Admin */}
        {session?.user?.role === 'SUPER_ADMIN' ? (
          <SidebarUltraModerne />
        ) : (
          <SidebarModern />
        )}

        {/* Main Content - Ajusté pour le sidebar ultra-moderne */}
        <main className="flex-1 p-6 transition-all duration-200">
          {children}
        </main>
      </div>
    </div>
  );
  }

  // Par défaut, rediriger vers l'authentification si aucun layout approprié
  router.push('/auth/connexion');
  return null;
}
