/* @ts-nocheck */
"use client";

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { 
  FileText, 
  Home, 
  User, 
  Calendar, 
  Clock, 
  Search, 
  Bell, 
  MessageCircle, 
  HelpCircle,
  Shield,
  Award,
  Star
} from 'lucide-react';
import { UserMenu } from '../layout/user-menu';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

interface DemarcheLayoutProps {
  children: ReactNode;
}

export function DemarcheLayout({ children }: DemarcheLayoutProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/demarche');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <p className="text-muted-foreground">Chargement de DEMARCHE.GA...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const isDemoAccount = session?.user?.email === 'demo.citoyen@demarche.ga';

  const navigationItems = [
    { name: 'Accueil', href: '/citoyen/dashboard', icon: Home },
    { name: 'Mes Démarches', href: '/citoyen/demandes', icon: FileText },
    { name: 'Mes Rendez-vous', href: '/citoyen/rendez-vous', icon: Calendar },
    { name: 'Services', href: '/demarche/services', icon: Search },
    { name: 'Mon Profil', href: '/citoyen/profil', icon: User },
    { name: 'Support', href: '/demarche/aide', icon: HelpCircle },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header DEMARCHE.GA */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo DEMARCHE.GA */}
            <div className="flex items-center">
              <Link href="/citoyen/dashboard" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">DEMARCHE.GA</h1>
                  <p className="text-xs text-gray-500">Services administratifs du Gabon</p>
                </div>
              </Link>
              
              {isDemoAccount && (
                <Badge variant="outline" className="ml-4 text-green-600 border-green-600">
                  <Star className="w-3 h-3 mr-1" />
                  Mode Démo
                </Badge>
              )}
            </div>

            {/* Navigation principale */}
            <nav className="hidden md:flex space-x-8">
              <Link href="/citoyen/dashboard" className="text-blue-600 font-semibold border-b-2 border-blue-600 px-3 py-2 text-sm">
                Mon Espace
              </Link>
              <Link href="/demarche/services" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                Tous les Services
              </Link>
              <Link href="/demarche/organismes" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                Organismes
              </Link>
              <Link href="/demarche/aide" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                Aide & Support
              </Link>
            </nav>

            {/* Actions utilisateur */}
            <div className="flex items-center space-x-3">
              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                {isDemoAccount && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs"></span>
                )}
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
        {/* Sidebar DEMARCHE.GA */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <div className="p-6">
            {/* Profil utilisateur */}
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {session?.user?.firstName} {session?.user?.lastName}
                  </p>
                  <p className="text-xs text-gray-600">Citoyen Gabonais</p>
                  {isDemoAccount && (
                    <Badge variant="outline" className="text-xs mt-1">
                      <Award className="w-3 h-3 mr-1" />
                      Compte Démo
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors group"
                >
                  <item.icon className="w-5 h-5 group-hover:text-blue-600" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              ))}
            </nav>

            {/* Actions rapides */}
            <div className="mt-8 space-y-3">
              <Button asChild className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
                <Link href="/citoyen/demandes/nouvelle">
                  <FileText className="w-4 h-4 mr-2" />
                  Nouvelle Démarche
                </Link>
              </Button>
              
              <Button variant="outline" asChild className="w-full">
                <Link href="/citoyen/rendez-vous/nouveau">
                  <Calendar className="w-4 h-4 mr-2" />
                  Prendre RDV
                </Link>
              </Button>
            </div>

            {/* Statut des services */}
            <div className="mt-8 p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-green-800">Services opérationnels</span>
              </div>
              <p className="text-xs text-green-700">
                85+ services disponibles • Temps de réponse optimal
              </p>
            </div>
          </div>
        </aside>
        
        {/* Contenu principal */}
        <main className="flex-1 p-6 max-w-none">
          {children}
        </main>
      </div>

      {/* Footer DEMARCHE.GA */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="font-bold text-gray-900">DEMARCHE.GA</span>
                <p className="text-xs text-gray-500">République Gabonaise</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <Link href="/demarche/confidentialite" className="hover:text-blue-600">
                Confidentialité
              </Link>
              <Link href="/demarche/mentions-legales" className="hover:text-blue-600">
                Mentions légales
              </Link>
              <Link href="/demarche/contact" className="hover:text-blue-600">
                Contact
              </Link>
              <span className="text-gray-400">© 2024 République Gabonaise</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 