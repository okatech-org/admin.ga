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
  ChevronRight,
  Clock
} from 'lucide-react';

const navigationItems = [
  // 📊 DASHBOARD
  {
    title: 'Dashboard',
    href: '/super-admin/dashboard-unified',
    icon: Home,
    description: 'Vue d\'ensemble du système',
    count: null,
    countColor: 'blue',
    section: 'dashboard',
    sectionColor: 'slate'
  },

  // 🏛️ GESTION ORGANISMES
  {
    title: 'Organismes',
    icon: Building2,
    description: 'Gestion complète des organismes publics',
    count: 307,
    countColor: 'emerald',
    section: 'gestion',
    sectionColor: 'emerald',
    isSection: true,
    children: [
      {
        title: 'Vue d\'Ensemble',
        href: '/super-admin/organismes',
        icon: BarChart3,
        description: 'Dashboard des organismes',
        count: 307,
        countColor: 'emerald'
      },
      {
        title: 'Structure Administrative',
        href: '/super-admin/structure-administrative',
        icon: Crown,
        description: 'Hiérarchie officielle du Gabon'
      },
      {
        title: 'Relations Inter-Organismes',
        href: '/super-admin/relations',
        icon: Network,
        description: 'Gestion des relations'
      }
    ]
  },

  // 👥 ADMINISTRATION UTILISATEURS
  {
    title: 'Utilisateurs',
    icon: Users,
    description: 'Administration des comptes utilisateurs',
    count: 979,
    countColor: 'emerald',
    section: 'administration',
    sectionColor: 'purple',
    isSection: true,
    children: [
      {
        title: 'Vue d\'Ensemble',
        href: '/super-admin/utilisateurs',
        icon: Users,
        description: 'Gestion des utilisateurs',
        count: 979,
        countColor: 'emerald'
      },
      {
        title: 'Création Comptes',
        href: '/super-admin/gestion-comptes',
        icon: UserPlus,
        description: 'Gestion des collaborateurs'
      },
      {
        title: 'Fonctionnaires en Attente',
        href: '/super-admin/fonctionnaires-attente',
        icon: Clock,
        description: 'Gestion des affectations',
        count: 478,
        countColor: 'orange',
        isNew: true
      },
      {
        title: 'Postes & Fonctions',
        href: '/super-admin/postes-administratifs',
        icon: Briefcase,
        description: 'Base des postes'
      }
    ]
  },

  // 🔧 SERVICES
  {
    title: 'Services',
    icon: FileText,
    description: 'Gestion des services administratifs',
    count: 558,
    countColor: 'emerald',
    section: 'administration',
    sectionColor: 'purple',
    isSection: true,
    children: [
      {
        title: 'Vue d\'Ensemble',
        href: '/super-admin/services',
        icon: FileText,
        description: 'Gestion des services',
        count: 558,
        countColor: 'emerald'
      },
      {
        title: 'Configuration',
        href: '/super-admin/configuration',
        icon: Settings,
        description: 'Configuration système'
      }
    ]
  },

  // 📊 MONITORING & ANALYTICS
  {
    title: 'Analytics',
    icon: BarChart3,
    description: 'Analyses et métriques système',
    section: 'monitoring',
    sectionColor: 'orange',
    isSection: true,
    children: [
      {
        title: 'Tableau de Bord',
        href: '/super-admin/analytics',
        icon: BarChart3,
        description: 'Métriques temps réel'
      },
      {
        title: 'Statistiques Système',
        href: '/super-admin/systeme',
        icon: TrendingUp,
        description: 'Performance système'
      },
      {
        title: 'Base de Données',
        href: '/super-admin/base-donnees',
        icon: Database,
        description: 'Gestion et maintenance'
      }
    ]
  },

  // 🛠️ OUTILS SYSTÈME
  {
    title: 'Outils',
    icon: Award,
    description: 'Outils d\'administration',
    section: 'outils',
    sectionColor: 'gray',
    isSection: true,
    children: [
      {
        title: 'Connexion Demo',
        href: '/super-admin/connexion-demo',
        icon: Award,
        description: 'Interface demo'
      }
    ]
  }
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  // État pour gérer l'ouverture des sections
  const [openSections, setOpenSections] = React.useState<Record<string, boolean>>({
    gestion: true,
    administration: true,
    monitoring: false,
    outils: false
  });

  const toggleSection = (sectionKey: string) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
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
          {navigationItems.map((item, index) => {
            // Si c'est une section avec des enfants
            if (item.isSection && item.children) {
              const getSectionColors = (sectionColor: string) => {
                const colors = {
                  slate: { bg: 'bg-slate-50', text: 'text-slate-700', icon: 'text-slate-500', border: 'border-slate-200', hover: 'hover:bg-slate-100' },
                  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700', icon: 'text-emerald-500', border: 'border-emerald-200', hover: 'hover:bg-emerald-100' },
                  purple: { bg: 'bg-purple-50', text: 'text-purple-700', icon: 'text-purple-500', border: 'border-purple-200', hover: 'hover:bg-purple-100' },
                  orange: { bg: 'bg-orange-50', text: 'text-orange-700', icon: 'text-orange-500', border: 'border-orange-200', hover: 'hover:bg-orange-100' },
                  gray: { bg: 'bg-gray-50', text: 'text-gray-700', icon: 'text-gray-500', border: 'border-gray-200', hover: 'hover:bg-gray-100' }
                };
                return colors[sectionColor] || colors.gray;
              };

              const getCountColor = (color: string) => {
                const colors = {
                  blue: 'bg-blue-100 text-blue-800 border-blue-300',
                  emerald: 'bg-emerald-100 text-emerald-800 border-emerald-300',
                  orange: 'bg-orange-100 text-orange-800 border-orange-300',
                  purple: 'bg-purple-100 text-purple-800 border-purple-300',
                  red: 'bg-red-100 text-red-800 border-red-300'
                };
                return colors[color] || colors.blue;
              };

              const sectionColors = getSectionColors(item.sectionColor);
              const isOpen = openSections[item.section];
              const Icon = item.icon;

              return (
                <div key={index}>
                  {/* Header de la section */}
                  <button
                    onClick={() => toggleSection(item.section)}
                    className={cn(
                      'w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 border',
                      sectionColors.bg,
                      sectionColors.hover,
                      sectionColors.border
                    )}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className={cn('w-5 h-5', sectionColors.icon)} />
                      <div className="flex-1 text-left">
                        <div className="flex items-center space-x-2">
                          <span className={cn('font-semibold', sectionColors.text)}>{item.title}</span>
                          {item.count && (
                            <span className={cn('px-2 py-0.5 text-xs font-semibold rounded-full border', getCountColor(item.countColor))}>
                              {item.count}
                            </span>
                          )}
                        </div>
                        <p className={cn('text-xs mt-0.5', sectionColors.text, 'opacity-70')}>{item.description}</p>
                      </div>
                    </div>
                    {isOpen ? (
                      <ChevronDown className={cn('w-4 h-4', sectionColors.icon)} />
                    ) : (
                      <ChevronRight className={cn('w-4 h-4', sectionColors.icon)} />
                    )}
                  </button>

                  {/* Sous-éléments */}
                  {isOpen && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.children.map((child, childIndex) => {
                        const isActive = pathname === child.href;
                        const ChildIcon = child.icon;

                        return (
                          <Link
                            key={childIndex}
                            href={child.href}
                            className={cn(
                              'flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                              isActive
                                ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                            )}
                          >
                            <div className="flex items-center space-x-3">
                              <ChildIcon className={cn('w-4 h-4', isActive ? 'text-blue-600' : 'text-gray-400')} />
                              <div>
                                <div className="flex items-center space-x-2">
                                  <span>{child.title}</span>
                                  {child.count && (
                                    <span className={cn('px-1.5 py-0.5 text-xs font-semibold rounded border', getCountColor(child.countColor))}>
                                      {child.count}
                                    </span>
                                  )}
                                  {child.isNew && (
                                    <span className="px-1.5 py-0.5 text-xs font-semibold rounded bg-green-100 text-green-800 border border-green-300">
                                      Nouveau
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-gray-500 mt-0.5">{child.description}</p>
                              </div>
                            </div>
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
            const getSectionColors = (sectionColor: string) => {
              const colors = {
                slate: { bg: 'bg-slate-50', text: 'text-slate-700', icon: 'text-slate-500', border: 'border-slate-200', hover: 'hover:bg-slate-100' },
                emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700', icon: 'text-emerald-500', border: 'border-emerald-200', hover: 'hover:bg-emerald-100' },
                purple: { bg: 'bg-purple-50', text: 'text-purple-700', icon: 'text-purple-500', border: 'border-purple-200', hover: 'hover:bg-purple-100' },
                orange: { bg: 'bg-orange-50', text: 'text-orange-700', icon: 'text-orange-500', border: 'border-orange-200', hover: 'hover:bg-orange-100' },
                gray: { bg: 'bg-gray-50', text: 'text-gray-700', icon: 'text-gray-500', border: 'border-gray-200', hover: 'hover:bg-gray-100' }
              };
              return colors[sectionColor] || colors.gray;
            };

            const getCountColor = (color: string) => {
              const colors = {
                blue: 'bg-blue-100 text-blue-800 border-blue-300',
                emerald: 'bg-emerald-100 text-emerald-800 border-emerald-300',
                orange: 'bg-orange-100 text-orange-800 border-orange-300',
                purple: 'bg-purple-100 text-purple-800 border-purple-300',
                red: 'bg-red-100 text-red-800 border-red-300'
              };
              return colors[color] || colors.blue;
            };

            const sectionColors = getSectionColors(item.sectionColor);

            return (
              <Link
                key={index}
                href={item.href}
                className={cn(
                  'flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 border',
                  isActive
                    ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                    : cn(sectionColors.bg, sectionColors.hover, sectionColors.border)
                )}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={cn('w-5 h-5', isActive ? 'text-blue-600' : sectionColors.icon)} />
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className={cn('font-semibold', isActive ? 'text-blue-700' : sectionColors.text)}>{item.title}</span>
                      {item.count && (
                        <span className={cn('px-2 py-0.5 text-xs font-semibold rounded-full border', getCountColor(item.countColor))}>
                          {item.count}
                        </span>
                      )}
                    </div>
                    <p className={cn('text-xs opacity-70 mt-0.5', isActive ? 'text-blue-600' : sectionColors.text)}>{item.description}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Section Information */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="bg-gradient-to-r from-emerald-50 to-blue-50 p-4 rounded-xl border border-emerald-200">
            <div className="flex items-center space-x-2 mb-2">
              <Shield className="w-5 h-5 text-emerald-600" />
              <h3 className="font-semibold text-gray-900">Menu Moderne</h3>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Interface unifiée avec 6 sections, compteurs dynamiques et design moderne cohérent entre les deux sidebars.
            </p>
            <div className="flex items-center justify-between mt-3 text-xs">
              <span className="text-emerald-600 font-medium">🎯 Système Unifié</span>
              <span className="text-gray-500">307 • 979 • 558</span>
            </div>
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
