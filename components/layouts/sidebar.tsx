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
  Bug,
  Database as DatabaseIcon,
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
    count: 0,
    countColor: 'gray',
    section: 'dashboard',
    sectionColor: 'slate'
  },

  // 🏛️ GESTION ORGANISMES
  {
    title: 'Organismes',
    icon: Building2,
    description: 'Gestion complète des organismes publics (Base vide)',
    count: 0,
    countColor: 'gray',
    section: 'gestion',
    sectionColor: 'gray',
    isSection: true,
    children: [
      {
        title: 'Vue d\'Ensemble',
        href: '/super-admin/organismes',
        icon: BarChart3,
        description: 'Dashboard des organismes (0)',
        count: 0,
        countColor: 'gray'
      },
      {
        title: 'Structure Administrative',
        href: '/super-admin/structure-administrative',
        icon: Crown,
        description: 'Hiérarchie vide'
      },
      {
        title: 'Relations Inter-Organismes',
        href: '/super-admin/relations',
        icon: Network,
        description: 'Aucune relation'
      }
    ]
  },

  // 👥 ADMINISTRATION UTILISATEURS
  {
    title: 'Utilisateurs',
    icon: Users,
    description: 'Administration des comptes utilisateurs (Base vide)',
    count: 0,
    countColor: 'gray',
    section: 'administration',
    sectionColor: 'gray',
    isSection: true,
    children: [
      {
        title: 'Vue d\'Ensemble',
        href: '/super-admin/utilisateurs',
        icon: Users,
        description: 'Gestion des utilisateurs (0)',
        count: 0,
        countColor: 'gray'
      },
      {
        title: 'Création Comptes',
        href: '/super-admin/gestion-comptes',
        icon: UserPlus,
        description: 'Base vide'
      },
      {
        title: 'Fonctionnaires en Attente',
        href: '/super-admin/fonctionnaires-attente',
        icon: Clock,
        description: 'Aucun en attente',
        count: 0,
        countColor: 'gray'
      },
      {
        title: 'Postes & Fonctions',
        href: '/super-admin/postes-administratifs',
        icon: Briefcase,
        description: 'Base des postes vide'
      }
    ]
  },

  // 🔧 SERVICES
  {
    title: 'Services',
    icon: FileText,
    description: 'Gestion des services administratifs (Base vide)',
    count: 0,
    countColor: 'gray',
    section: 'administration',
    sectionColor: 'gray',
    isSection: true,
    children: [
      {
        title: 'Vue d\'Ensemble',
        href: '/super-admin/services',
        icon: FileText,
        description: 'Gestion des services (0)',
        count: 0,
        countColor: 'gray'
      },
      {
        title: 'Configuration',
        href: '/super-admin/configuration',
        icon: Settings,
        description: 'Configuration système'
      }
    ]
  },

  // 💼 POSTES D'EMPLOI
  {
    title: 'Postes d\'emploi',
    href: '/super-admin/postes-emploi',
    icon: Briefcase,
    description: 'Gestion des offres d\'emploi public',
    count: 0,
    countColor: 'gray',
    section: 'emploi',
    sectionColor: 'blue'
  },

  // 📈 ANALYTICS & MONITORING
  {
    title: 'Analytics',
    icon: BarChart3,
    description: 'Analyses et métriques (Données vides)',
    count: 0,
    countColor: 'gray',
    section: 'analytics',
    sectionColor: 'gray',
    isSection: true,
    children: [
      {
        title: 'Dashboard Analytics',
        href: '/super-admin/analytics',
        icon: BarChart3,
        description: 'Métriques générales (0)',
        count: 0,
        countColor: 'gray'
      },
      {
        title: 'Métriques Avancées',
        href: '/super-admin/metrics-advanced',
        icon: Target,
        description: 'Analyses détaillées (0)'
      }
    ]
  },

  // 🗄️ BASE DE DONNÉES
  {
    title: 'Base de Données',
    icon: DatabaseIcon,
    description: 'Gestion et monitoring BDD (Vide)',
    count: 0,
    countColor: 'gray',
    section: 'system',
    sectionColor: 'gray',
    isSection: true,
    children: [
      {
        title: 'Vue d\'Ensemble',
        href: '/super-admin/base-donnees',
        icon: DatabaseIcon,
        description: 'État de la base (Vide)'
      },
      {
        title: 'Logs Système',
        href: '/super-admin/logs',
        icon: FileText,
        description: 'Journaux d\'activité'
      },
      {
        title: 'Diagnostic',
        href: '/super-admin/debug',
        icon: Bug,
        description: 'Outils de débogage'
      }
    ]
  }
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [expandedSections, setExpandedSections] = React.useState<Set<string>>(new Set(['dashboard', 'gestion']));

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const isActive = (href: string) => {
    if (href === '/super-admin' && pathname === '/super-admin') return true;
    if (href !== '/super-admin' && pathname.startsWith(href)) return true;
    return false;
  };

  const getCountBadge = (count: number | null, color: string) => {
    if (count === null || count === 0) return null;

    const colorClasses = {
      blue: 'bg-blue-100 text-blue-800 border-blue-200',
      emerald: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      orange: 'bg-orange-100 text-orange-800 border-orange-200',
      red: 'bg-red-100 text-red-800 border-red-200',
      purple: 'bg-purple-100 text-purple-800 border-purple-200',
      gray: 'bg-gray-100 text-gray-500 border-gray-200'
    };

    return (
      <span className={cn(
        'ml-auto px-2 py-1 text-xs font-medium rounded-full border text-center min-w-[2rem]',
        colorClasses[color as keyof typeof colorClasses] || colorClasses.gray
      )}>
        {count === 0 ? '0' : count.toLocaleString()}
      </span>
    );
  };

  if (session?.user?.role !== 'SUPER_ADMIN') {
    return null;
  }

  return (
    <div className={cn(
      "flex h-full w-64 flex-col overflow-y-auto border-r bg-white px-3 py-4",
      className
    )}>
      <div className="space-y-1">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight text-gray-900">
            🧹 Admin Nettoyé
          </h2>
          <p className="px-4 text-sm text-gray-500">
            Base de données entièrement vide
          </p>
        </div>

        <div className="space-y-1">
          {navigationItems.map((item, index) => {
            if (item.isSection) {
              const isExpanded = expandedSections.has(item.section || '');
              return (
                <div key={index} className="space-y-1">
                  <button
                    onClick={() => toggleSection(item.section || '')}
                    className="flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    <span className="flex-1 text-left">{item.title}</span>
                    {getCountBadge(item.count, item.countColor)}
                    {isExpanded ? (
                      <ChevronDown className="ml-2 h-4 w-4" />
                    ) : (
                      <ChevronRight className="ml-2 h-4 w-4" />
                    )}
                  </button>

                  {isExpanded && item.children && (
                    <div className="ml-4 space-y-1 border-l border-gray-200 pl-4">
                      {item.children.map((child, childIndex) => (
                        <Link
                          key={childIndex}
                          href={child.href || '#'}
                          className={cn(
                            "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                            isActive(child.href || '')
                              ? "bg-gray-100 text-gray-900"
                              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                          )}
                        >
                          <child.icon className="mr-2 h-4 w-4" />
                          <span className="flex-1">{child.title}</span>
                          {getCountBadge(child.count, child.countColor)}
                          {'isNew' in child && child.isNew && (
                            <span className="ml-2 rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                              Nouveau
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            } else {
              return (
                <Link
                  key={index}
                  href={item.href || '#'}
                  className={cn(
                    "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive(item.href || '')
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  )}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  <span className="flex-1">{item.title}</span>
                  {getCountBadge(item.count, item.countColor)}
                </Link>
              );
            }
          })}
        </div>
      </div>

      <div className="mt-auto">
        <div className="rounded-lg bg-gray-50 p-4">
          <div className="flex items-center text-sm">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200">
              <Shield className="h-4 w-4 text-gray-600" />
            </div>
            <div className="ml-3">
              <p className="font-medium text-gray-900">🧹 Base Nettoyée</p>
              <p className="text-gray-500">0 éléments</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
