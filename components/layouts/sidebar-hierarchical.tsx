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
  MessageSquare,
  Activity,
  Zap,
  Bell,
  Search,
  Plus,
  Clock,
  Calendar,
  FileX,
  Globe,
  Server,
  Terminal,
  Eye,
  Layers,
  Cpu,
  PieChart,
  Monitor,
  Gauge,
  SplitSquareVertical,
  GitBranch,
  LifeBuoy,
  BookOpen,
  HelpCircle,
  User,
  LogOut
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
        icon: Eye,
        description: 'Dashboard des organismes',
        count: 307,
        countColor: 'emerald'
      },
      {
        title: 'Structure Administrative',
        href: '/super-admin/structure-administrative',
        icon: Layers,
        description: 'Hiérarchie officielle du Gabon'
      },
      {
        title: 'Relations Inter-Organismes',
        href: '/super-admin/relations',
        icon: Network,
        description: 'Gestion des relations'
      },
      {
        title: 'Communications Inter-Administration',
        href: '/super-admin/communications',
        icon: MessageSquare,
        description: 'Système de communication',
        count: 5,
        countColor: 'blue',
        isNew: true
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
        title: 'Restructuration',
        href: '/super-admin/restructuration-comptes',
        icon: Users,
        description: 'Restructuration avancée',
        isCritical: true
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
    icon: Zap,
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
        icon: Zap,
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
        icon: PieChart,
        description: 'Métriques temps réel'
      },
      {
        title: 'Statistiques Système',
        href: '/super-admin/systeme',
        icon: Monitor,
        description: 'Performance système'
      },
      {
        title: 'Base de Données',
        href: '/super-admin/base-donnees',
        icon: DatabaseIcon,
        description: 'Gestion et maintenance'
      }
    ]
  },

  // 🛠️ OUTILS SYSTÈME
  {
    title: 'Outils',
    icon: Terminal,
    description: 'Outils d\'administration',
    section: 'outils',
    sectionColor: 'gray',
    isSection: true,
    children: [

      {
        title: 'Debug & Diagnostic',
        href: '/super-admin/debug',
        icon: Bug,
        description: 'Outils de debug système',
        isNew: true
      },
      {
        title: 'Test Data',
        href: '/super-admin/test-data',
        icon: FileX,
        description: 'Données de test'
      },

    ]
  }
];

const getSectionColor = (sectionColor: string) => {
  const colors = {
    slate: {
      bg: 'bg-slate-50',
      text: 'text-slate-700',
      icon: 'text-slate-500',
      border: 'border-slate-200',
      hover: 'hover:bg-slate-100'
    },
    emerald: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      icon: 'text-emerald-500',
      border: 'border-emerald-200',
      hover: 'hover:bg-emerald-100'
    },
    purple: {
      bg: 'bg-purple-50',
      text: 'text-purple-700',
      icon: 'text-purple-500',
      border: 'border-purple-200',
      hover: 'hover:bg-purple-100'
    },
    orange: {
      bg: 'bg-orange-50',
      text: 'text-orange-700',
      icon: 'text-orange-500',
      border: 'border-orange-200',
      hover: 'hover:bg-orange-100'
    },
    gray: {
      bg: 'bg-gray-50',
      text: 'text-gray-700',
      icon: 'text-gray-500',
      border: 'border-gray-200',
      hover: 'hover:bg-gray-100'
    }
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

export default function SidebarHierarchical() {
  const pathname = usePathname();
  const { data: session } = useSession();
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

  const isActive = (href: string) => pathname === href;

  if (!session || session.user.role !== 'SUPER_ADMIN') {
    return null;
  }

  return (
    <div className="flex h-screen bg-white border-r border-gray-200">
      <div className="flex flex-col w-80">
        {/* Header */}
        <div className="flex items-center justify-center h-16 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <Crown className="h-8 w-8 mr-3" />
          <div className="text-center">
            <h1 className="text-lg font-bold">Super Admin</h1>
            <p className="text-xs text-blue-100">Administration.GA</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6">
          <div className="px-4 space-y-2">
            {navigationItems.map((item, index) => {
              if (item.isSection && item.children) {
                const sectionColors = getSectionColor(item.sectionColor);
                const isOpen = openSections[item.section];

                return (
                  <div key={index} className="space-y-1">
                    {/* Section Header */}
                    <button
                      onClick={() => toggleSection(item.section)}
                      className={cn(
                        "w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200",
                        sectionColors.bg,
                        sectionColors.hover,
                        sectionColors.border,
                        "border"
                      )}
                    >
                      <div className="flex items-center space-x-3">
                        <item.icon className={cn("h-5 w-5", sectionColors.icon)} />
                        <div className="flex-1 text-left">
                          <div className="flex items-center space-x-2">
                            <span className={cn("font-semibold text-sm", sectionColors.text)}>
                              {item.title}
                            </span>
                            {item.count && (
                              <span className={cn(
                                "px-2 py-0.5 text-xs font-semibold rounded-full border",
                                getCountColor(item.countColor)
                              )}>
                                {item.count}
                              </span>
                            )}
                          </div>
                          <p className={cn("text-xs", sectionColors.text, "opacity-70")}>
                            {item.description}
                          </p>
                        </div>
                      </div>
                      {isOpen ? (
                        <ChevronDown className={cn("h-4 w-4 transition-transform", sectionColors.icon)} />
                      ) : (
                        <ChevronRight className={cn("h-4 w-4 transition-transform", sectionColors.icon)} />
                      )}
                    </button>

                    {/* Section Children */}
                    {isOpen && (
                      <div className="ml-4 space-y-1">
                        {item.children.map((child, childIndex) => (
                          <Link
                            key={childIndex}
                            href={child.href}
                            className={cn(
                              "flex items-center justify-between px-4 py-2.5 rounded-lg transition-all duration-200",
                              isActive(child.href)
                                ? "bg-blue-50 text-blue-700 border-l-4 border-blue-500"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            )}
                          >
                            <div className="flex items-center space-x-3">
                              <child.icon className={cn(
                                "h-4 w-4",
                                isActive(child.href) ? "text-blue-600" : "text-gray-400"
                              )} />
                              <div>
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm font-medium">
                                    {child.title}
                                  </span>
                                  {child.count && (
                                    <span className={cn(
                                      "px-1.5 py-0.5 text-xs font-semibold rounded border",
                                      getCountColor(child.countColor)
                                    )}>
                                      {child.count}
                                    </span>
                                  )}
                                  {child.isNew && (
                                    <span className="px-1.5 py-0.5 text-xs font-semibold rounded bg-green-100 text-green-800 border border-green-300">
                                      Nouveau
                                    </span>
                                  )}
                                  {child.isCritical && (
                                    <span className="px-1.5 py-0.5 text-xs font-semibold rounded bg-red-100 text-red-800 border border-red-300">
                                      Critique
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-gray-500">
                                  {child.description}
                                </p>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              } else {
                const sectionColors = getSectionColor(item.sectionColor);

                return (
                  <Link
                    key={index}
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200",
                      isActive(item.href)
                        ? "bg-blue-50 text-blue-700 border-l-4 border-blue-500"
                        : cn(sectionColors.bg, sectionColors.hover, "border", sectionColors.border)
                    )}
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className={cn(
                        "h-5 w-5",
                        isActive(item.href) ? "text-blue-600" : sectionColors.icon
                      )} />
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className={cn(
                            "font-semibold text-sm",
                            isActive(item.href) ? "text-blue-700" : sectionColors.text
                          )}>
                            {item.title}
                          </span>
                          {item.count && (
                            <span className={cn(
                              "px-2 py-0.5 text-xs font-semibold rounded-full border",
                              getCountColor(item.countColor)
                            )}>
                              {item.count}
                            </span>
                          )}
                        </div>
                        <p className={cn(
                          "text-xs opacity-70",
                          isActive(item.href) ? "text-blue-600" : sectionColors.text
                        )}>
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              }
            })}
          </div>
        </nav>

        {/* Statistiques Système */}
        <div className="px-4 py-4 border-t border-gray-200">
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-3 space-y-2">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center">
              <Gauge className="h-4 w-4 mr-2" />
              Statistiques Système
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="text-center">
                <div className="font-semibold text-emerald-600">307</div>
                <div className="text-gray-500">Organismes</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-emerald-600">979</div>
                <div className="text-gray-500">Utilisateurs</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-blue-600">558</div>
                <div className="text-gray-500">Services</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-orange-600">478</div>
                <div className="text-gray-500">En attente</div>
              </div>
            </div>
          </div>
        </div>

        {/* Profil Utilisateur */}
        <div className="px-4 py-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50">
            <div className="flex-shrink-0">
              <User className="h-8 w-8 text-purple-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900">
                {session?.user?.firstName} {session?.user?.lastName}
              </p>
              <p className="text-xs text-purple-600 font-medium">Super Administrateur</p>
            </div>
            <button className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
