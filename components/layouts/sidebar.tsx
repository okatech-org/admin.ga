/* @ts-nocheck */
"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import {
  Building,
  Users,
  Settings,
  BarChart3,
  Shield,
  FileText,
  UserPlus,
  Briefcase,
  Award,
  Database,
  TrendingUp,
  UserCheck,
  Network,
  Crown,
  Home,
  Target,
  Building2,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

const navigationItems = [
  {
    title: 'Tableau de Bord',
    href: '/super-admin/dashboard-unified',
    icon: Home,
    description: 'Vue d\'ensemble complète du système'
  },
  {
    title: 'Organismes',
    icon: Building,
    description: 'Gestion commerciale des organismes publics',
    isSection: true,
    children: [
      {
        title: 'Vue d\'Ensemble',
        href: '/super-admin/organismes-vue-ensemble',
        icon: BarChart3,
        description: 'Tableau de bord commercial complet'
      },
      {
        title: 'Prospects',
        href: '/super-admin/organismes-prospects',
        icon: Target,
        description: 'Gestion et conversion des prospects'
      },
      {
        title: 'Clients',
        href: '/super-admin/organismes-clients',
        icon: UserCheck,
        description: 'Suivi des clients et contrats'
      }
    ]
  },
  {
    title: 'Gestion Organismes',
    href: '/super-admin/organismes',
    icon: Shield,
    description: 'Administration générale des organismes'
  },
  {
    title: 'Clients (Legacy)',
    href: '/super-admin/clients',
    icon: Building2,
    description: 'Interface clients historique'
  },
  {
    title: 'Relations Inter-Organismes',
    href: '/super-admin/relations',
    icon: Network,
    description: 'Gestion des relations et partage de données'
  },
  {
    title: 'Structure Administrative',
    href: '/super-admin/structure-administrative',
    icon: Crown,
                  description: 'Structure officielle gabonaise complète (160 organismes)'
  },
  {
    title: 'Administrations',
    href: '/super-admin/administrations',
    icon: Shield,
    description: 'Liste des administrations'
  },
  {
    title: 'Diagnostic Admins',
    href: '/super-admin/diagnostic-administrations',
    icon: TrendingUp,
    description: 'Diagnostic et analyse'
  },
  // Nouvelle section RH et Postes
  {
    title: 'Postes Administratifs',
    href: '/super-admin/postes-administratifs',
    icon: Briefcase,
    description: 'Base de données des postes et fonctions',
    isNew: true
  },
  {
    title: 'Gestion Comptes',
    href: '/super-admin/gestion-comptes',
    icon: UserPlus,
    description: 'Création et gestion des collaborateurs',
    isNew: true
  },
  {
    title: 'Connexion DEMO',
    href: '/super-admin/connexion-demo',
    icon: Award,
    description: 'Interface de test organismes',
    isNew: true
  },
  {
    title: 'Utilisateurs',
    href: '/super-admin/utilisateurs',
    icon: Users,
    description: 'Gestion des utilisateurs'
  },
  {
    title: 'Services',
    href: '/super-admin/services',
    icon: FileText,
    description: 'Services administratifs'
  },
  {
    title: 'Base de Données',
    href: '/super-admin/base-donnees',
    icon: Database,
    description: 'Gestion et visualisation de la base de données',
    isNew: true
  },
  {
    title: 'Configuration',
    href: '/super-admin/configuration',
    icon: Settings,
    description: 'Paramètres système'
  },
  {
    title: 'Système',
    href: '/super-admin/systeme',
    icon: Shield,
    description: 'Administration système'
  }
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  // État pour gérer l'ouverture des sections
  const [openSections, setOpenSections] = React.useState<Set<string>>(new Set(['Organismes']));

  const toggleSection = (sectionTitle: string) => {
    setOpenSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionTitle)) {
        newSet.delete(sectionTitle);
      } else {
        newSet.add(sectionTitle);
      }
      return newSet;
    });
  };

  // Vérifier si l'utilisateur est super admin
  if (session?.user?.role !== 'SUPER_ADMIN') {
    return null;
  }

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-8">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">ADMIN.GA</h2>
            <p className="text-xs text-gray-600">Super Admin</p>
          </div>
        </div>

        <nav className="space-y-2">
          {navigationItems.map((item) => {
            // Si c'est une section avec des enfants
            if (item.isSection && item.children) {
              const isOpen = openSections.has(item.title);
              const Icon = item.icon;
              const hasActiveChild = item.children.some(child => pathname === child.href);

              return (
                <div key={item.title}>
                  {/* Header de la section */}
                  <button
                    onClick={() => toggleSection(item.title)}
                    className={cn(
                      'w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors group',
                      hasActiveChild || isOpen
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    )}
                  >
                    <Icon className={cn(
                      'w-5 h-5',
                      hasActiveChild || isOpen ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'
                    )} />
                    <div className="flex-1 text-left">
                      <span>{item.title}</span>
                      <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                    </div>
                    {isOpen ? (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    )}
                  </button>

                  {/* Sous-éléments */}
                  {isOpen && (
                    <div className="ml-6 mt-1 space-y-1">
                      {item.children.map((child) => {
                        const isActive = pathname === child.href;
                        const ChildIcon = child.icon;

                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={cn(
                              'flex items-center space-x-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors group relative',
                              isActive
                                ? 'bg-blue-100 text-blue-800 border border-blue-300'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                            )}
                          >
                            <ChildIcon className={cn(
                              'w-4 h-4',
                              isActive ? 'text-blue-700' : 'text-gray-400 group-hover:text-gray-600'
                            )} />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span>{child.title}</span>
                                {child.isNew && (
                                  <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium">
                                    Nouveau
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-500 mt-0.5">{child.description}</p>
                            </div>
                            {isActive && (
                              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-blue-600 rounded-l"></div>
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            // Élément normal (sans enfants)
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors group relative',
                  isActive
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <Icon className={cn(
                  'w-5 h-5',
                  isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'
                )} />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span>{item.title}</span>
                    {item.isNew && (
                      <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium">
                        Nouveau
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {item.description}
                  </p>
                </div>

                {isActive && (
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-l"></div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Section Information */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Award className="w-5 h-5 text-blue-600" />
              <h3 className="font-medium text-gray-900">Système RH</h3>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Nouvelle fonctionnalité de gestion des postes administratifs et création de comptes collaborateurs intégrée.
            </p>
          </div>
        </div>

        {/* Session info */}
                 <div className="mt-6 pt-6 border-t border-gray-200">
           <div className="flex items-center space-x-3">
             <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
               {session?.user?.firstName?.charAt(0) || 'S'}
             </div>
             <div>
               <p className="text-sm font-medium text-gray-900">
                 {session?.user?.firstName ? `${session.user.firstName} ${session.user.lastName}` : 'Super Admin'}
               </p>
               <p className="text-xs text-gray-600">
                 {session?.user?.email || 'admin@admin.ga'}
               </p>
             </div>
           </div>
         </div>
      </div>
    </div>
  );
}
