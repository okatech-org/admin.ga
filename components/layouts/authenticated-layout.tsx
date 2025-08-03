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

  // Interface ADMIN.GA uniquement pour les SUPER_ADMIN
  if (session.user.role === 'SUPER_ADMIN') {
    return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 gabon-gradient rounded-full flex items-center justify-center">
                <Flag className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-xl gabon-text-gradient">
                Admin.ga
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <Button variant="ghost" size="icon">
              <Bell className="h-4 w-4" />
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
