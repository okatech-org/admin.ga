/* @ts-nocheck */
/* eslint-disable react/no-unknown-property */
/* webhint-disable no-inline-styles */
"use client";

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  MessageCircle, 
  User, 
  Home, 
  FileText, 
  Users, 
  Settings, 
  LogOut,
  Calendar,
  HelpCircle,
  BarChart3,
  ClipboardList,
  Shield,
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';
import { UserMenu } from '../layout/user-menu';
import { getOrganismeBranding, DEFAULT_ORGANISME_BRANDING, OrganismeBranding } from '@/lib/config/organismes-branding';
import { cn } from '@/lib/utils';

interface OrganismeLayoutProps {
  children: ReactNode;
}

export function OrganismeLayout({ children }: OrganismeLayoutProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [branding, setBranding] = useState<OrganismeBranding>(DEFAULT_ORGANISME_BRANDING);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/connexion');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.organizationId) {
      const organismeCode = session.user.organizationId;
      const organismeBranding = getOrganismeBranding(organismeCode);
      if (organismeBranding) {
        setBranding(organismeBranding);
      } else {
        setBranding(DEFAULT_ORGANISME_BRANDING);
      }
    }
  }, [session]);

  if (status === 'loading') {
    return (
      <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br ${branding.backgroundClasses}`}>
        <div className="text-center">
          <div className={`w-12 h-12 bg-gradient-to-r ${branding.gradientClasses} rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse`}>
            <branding.icon className="w-6 h-6 text-white" />
          </div>
          <p className="text-muted-foreground">Chargement de {branding.nomCourt}...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  // Navigation selon le rôle utilisateur
  const getNavigationItems = () => {
    const role = session.user.role;
    
    const commonItems = [
      { name: 'Accueil', href: `/${branding.code.toLowerCase()}/dashboard`, icon: Home },
    ];

    switch (role) {
      case 'ADMIN':
        return [
          ...commonItems,
          { name: 'Utilisateurs', href: `/${branding.code.toLowerCase()}/utilisateurs`, icon: Users },
          { name: 'Services', href: `/${branding.code.toLowerCase()}/services`, icon: FileText },
          { name: 'Demandes', href: `/${branding.code.toLowerCase()}/demandes`, icon: ClipboardList },
          { name: 'Rapports', href: `/${branding.code.toLowerCase()}/rapports`, icon: BarChart3 },
          { name: 'Configuration', href: `/${branding.code.toLowerCase()}/config`, icon: Settings },
        ];
      case 'MANAGER':
        return [
          ...commonItems,
          { name: 'Mon Équipe', href: `/${branding.code.toLowerCase()}/equipe`, icon: Users },
          { name: 'Demandes', href: `/${branding.code.toLowerCase()}/demandes`, icon: ClipboardList },
          { name: 'Planning', href: `/${branding.code.toLowerCase()}/planning`, icon: Calendar },
          { name: 'Statistiques', href: `/${branding.code.toLowerCase()}/stats`, icon: BarChart3 },
        ];
      case 'AGENT':
        return [
          ...commonItems,
          { name: 'File d\'attente', href: `/${branding.code.toLowerCase()}/queue`, icon: ClipboardList },
          { name: 'Mes Dossiers', href: `/${branding.code.toLowerCase()}/dossiers`, icon: FileText },
          { name: 'Rendez-vous', href: `/${branding.code.toLowerCase()}/rdv`, icon: Calendar },
          { name: 'Traités', href: `/${branding.code.toLowerCase()}/traites`, icon: CheckCircle },
        ];
      default:
        return commonItems;
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <div className={`min-h-screen bg-gradient-to-br ${branding.backgroundClasses}`}>
      {/* Header de l'organisme */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo et nom de l'organisme */}
            <div className="flex items-center">
              <Link href={`/${branding.code.toLowerCase()}/dashboard`} className="flex items-center space-x-3">
                <div className={`w-10 h-10 bg-gradient-to-r ${branding.gradientClasses} rounded-lg flex items-center justify-center`}>
                  <branding.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{branding.nomCourt}</h1>
                  <p className="text-xs text-gray-500">{branding.slogan}</p>
                </div>
              </Link>
            </div>

            {/* Navigation principale */}
            <nav className="hidden md:flex space-x-8">
              <Link 
                href={`/${branding.code.toLowerCase()}/dashboard`} 
                className={cn(
                  "px-3 py-2 text-sm font-medium border-b-2 transition-colors",
                  "text-gray-900 border-transparent hover:border-gray-300"
                )}
                style={{ 
                  color: branding.couleurPrimaire,
                  borderBottomColor: branding.couleurPrimaire 
                }}
              >
                Mon Espace
              </Link>
              <Link 
                href={`/${branding.code.toLowerCase()}/services`} 
                className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                Nos Services
              </Link>
              <Link 
                href={`/${branding.code.toLowerCase()}/aide`} 
                className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                Aide & Support
              </Link>
            </nav>

            {/* Actions utilisateur */}
            <div className="flex items-center space-x-3">
              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs"></span>
              </Button>

              {/* Messages */}
              <Button variant="ghost" size="icon">
                <MessageCircle className="h-4 w-4" />
              </Button>

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* User Menu */}
              <UserMenu />
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar de l'organisme */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <div className="p-6">
            {/* Informations de l'organisme */}
            <div 
              className="mb-6 p-4 rounded-lg border"
              style={{ 
                background: `linear-gradient(135deg, ${branding.couleurPrimaire}10, ${branding.couleurSecondaire}10)`,
                borderColor: `${branding.couleurPrimaire}30`
              }}
            >
              <div className="flex items-center space-x-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: branding.couleurPrimaire }}
                >
                  <branding.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {session?.user?.firstName} {session?.user?.lastName}
                  </p>
                  <p className="text-xs text-gray-600">{session?.user?.role}</p>
                  <Badge 
                    variant="outline" 
                    className="text-xs mt-1"
                    style={{ 
                      color: branding.couleurPrimaire,
                      borderColor: branding.couleurPrimaire 
                    }}
                  >
                    {branding.type}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors group"
                                   style={{
                   '--hover-bg': `${branding.couleurPrimaire}10`,
                   '--hover-color': branding.couleurPrimaire
                 } as React.CSSProperties}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = `${branding.couleurPrimaire}10`;
                    e.currentTarget.style.color = branding.couleurPrimaire;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '';
                    e.currentTarget.style.color = '';
                  }}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              ))}
            </nav>

            {/* Informations de contact */}
            <div className="mt-8 space-y-3">
              <div 
                className="p-3 rounded-lg border"
                style={{ 
                  backgroundColor: `${branding.couleurPrimaire}05`,
                  borderColor: `${branding.couleurPrimaire}20`
                }}
              >
                <div className="flex items-center space-x-2 mb-2">
                                     <div 
                     className="w-2 h-2 rounded-full" 
                     style={{ backgroundColor: branding.couleurSecondaire }}
                   ></div>
                   <span 
                     className="text-sm font-medium" 
                     style={{ color: branding.couleurPrimaire }}
                   >
                    Informations
                  </span>
                </div>
                <div className="text-xs text-gray-600 space-y-1">
                  <p>{branding.adresse}</p>
                  <p>{branding.telephone}</p>
                  <p>{branding.email}</p>
                </div>
              </div>
            </div>

            {/* Statut des services */}
            <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-green-800">Services opérationnels</span>
              </div>
              <p className="text-xs text-green-700">
                {branding.services.length} services disponibles
              </p>
            </div>
          </div>
        </aside>
        
        {/* Contenu principal */}
        <main className="flex-1 p-6 max-w-none">
          {children}
        </main>
      </div>

      {/* Footer de l'organisme */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`w-8 h-8 bg-gradient-to-r ${branding.gradientClasses} rounded-lg flex items-center justify-center`}>
                <branding.icon className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="font-bold text-gray-900">{branding.nomCourt}</span>
                <p className="text-xs text-gray-500">{branding.description}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <Link href={`/${branding.code.toLowerCase()}/confidentialite`} className="hover:text-gray-900">
                Confidentialité
              </Link>
              <Link href={`/${branding.code.toLowerCase()}/mentions-legales`} className="hover:text-gray-900">
                Mentions légales
              </Link>
              <Link href={`/${branding.code.toLowerCase()}/contact`} className="hover:text-gray-900">
                Contact
              </Link>
              <span className="text-gray-400">© 2024 {branding.nom}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 