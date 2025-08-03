/* @ts-nocheck */
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useSession, signOut } from 'next-auth/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  // Dashboard - Slate
  Home,
  BarChart3,
  Activity,
  TrendingUp,

  // Organismes - Emerald
  Building,
  Building2,
  Network,
  Users,
  Target,
  UserCheck,
  Crown,

  // Administration - Purple
  Shield,
  Settings,
  FileText,
  UserPlus,
  Briefcase,
  Award,

  // Monitoring - Orange
  Database,
  Monitor,
  AlertCircle,
  Cpu,
  HardDrive,

  // Outils - Gray
  Terminal,
  Code,
  Wrench,
  TestTube,

  // Navigation
  ChevronDown,
  ChevronRight,
  LogOut,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Zap,
  Wifi,
  Server
} from 'lucide-react';

interface NavigationSection {
  title: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: any;
  badge?: number;
  children: NavigationItem[];
  isOpen?: boolean;
}

interface NavigationItem {
  title: string;
  href: string;
  icon: any;
  description: string;
  isNew?: boolean;
  badge?: number;
}

interface SystemStats {
  organismes: number;
  utilisateurs: number;
  services: number;
  fonctionnaires: number;
  uptime: number;
  cpuUsage: number;
  memoryUsage: number;
  storageUsage: number;
}

export function SidebarUltraModerne() {
  const pathname = usePathname();
  const { data: session } = useSession();

  // États des sections
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(['Dashboard', 'Organismes']));

  // Statistiques système en temps réel
  const [systemStats, setSystemStats] = useState<SystemStats>({
    organismes: 307,
    utilisateurs: 979,
    services: 558,
    fonctionnaires: 478,
    uptime: 99.8,
    cpuUsage: 24,
    memoryUsage: 67,
    storageUsage: 45
  });

  // Sections de navigation avec codes couleur
  const navigationSections: NavigationSection[] = [
    {
      title: 'Dashboard',
      color: 'text-slate-700',
      bgColor: 'bg-slate-50',
      borderColor: 'border-slate-200',
      icon: Home,
      badge: 5, // Notifications
      isOpen: openSections.has('Dashboard'),
      children: [
        {
          title: 'Vue d\'Ensemble',
          href: '/super-admin/dashboard-unified',
          icon: BarChart3,
          description: 'Métriques système et activité',
          badge: 2
        },
        {
          title: 'Analytics',
          href: '/super-admin/analytics',
          icon: TrendingUp,
          description: 'Analyses de performance détaillées'
        },
        {
          title: 'Communications',
          href: '/super-admin/communications',
          icon: Mail,
          description: 'Communications inter-administration',
          badge: 5
        },
        {
          title: 'Dashboard V2',
          href: '/super-admin/dashboard-v2',
          icon: Activity,
          description: 'Interface moderne expérimentale',
          isNew: true
        }
      ]
    },
    {
      title: 'Organismes',
      color: 'text-emerald-700',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      icon: Building,
      badge: systemStats.organismes,
      isOpen: openSections.has('Organismes'),
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
          description: 'Gestion et conversion des prospects',
          badge: 168
        },
        {
          title: 'Clients',
          href: '/super-admin/organismes-clients',
          icon: UserCheck,
          description: 'Suivi des clients et contrats',
          badge: 5
        },
        {
          title: 'Gestion Générale',
          href: '/super-admin/organismes',
          icon: Building2,
          description: 'Administration des organismes'
        },
        {
          title: 'Relations Inter-Org',
          href: '/super-admin/relations',
          icon: Network,
          description: 'Gestion des relations',
          badge: 522
        },
        {
          title: 'Structure Administrative',
          href: '/super-admin/structure-administrative',
          icon: Crown,
          description: 'Hiérarchie officielle gabonaise'
        }
      ]
    },
    {
      title: 'Administration',
      color: 'text-purple-700',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      icon: Shield,
      badge: systemStats.utilisateurs,
      isOpen: openSections.has('Administration'),
      children: [
        {
          title: 'Utilisateurs',
          href: '/super-admin/utilisateurs',
          icon: Users,
          description: 'Gestion des utilisateurs',
          badge: systemStats.utilisateurs
        },
        {
          title: 'Fonctionnaires en Attente',
          href: '/super-admin/fonctionnaires-attente',
          icon: Clock,
          description: 'Affectations en cours',
          badge: systemStats.fonctionnaires
        },
        {
          title: 'Postes Administratifs',
          href: '/super-admin/postes-administratifs',
          icon: Briefcase,
          description: 'Base de données des postes',
          isNew: true
        },
        {
          title: 'Gestion Comptes',
          href: '/super-admin/gestion-comptes',
          icon: UserPlus,
          description: 'Création et gestion collaborateurs',
          isNew: true
        },
        {
          title: 'Services',
          href: '/super-admin/services',
          icon: FileText,
          description: 'Services administratifs',
          badge: systemStats.services
        },
        {
          title: 'Restructuration',
          href: '/super-admin/restructuration-comptes',
          icon: Award,
          description: 'Réorganisation des comptes'
        }
      ]
    },
    {
      title: 'Monitoring',
      color: 'text-orange-700',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      icon: Monitor,
      badge: Math.round(systemStats.uptime * 10) / 10,
      isOpen: openSections.has('Monitoring'),
      children: [
        {
          title: 'Base de Données',
          href: '/super-admin/base-donnees',
          icon: Database,
          description: 'Gestion et visualisation DB',
          isNew: true
        },
        {
          title: 'Santé Système',
          href: '/super-admin/systeme',
          icon: Activity,
          description: 'Monitoring et performance'
        },
        {
          title: 'Logs & Alertes',
          href: '/super-admin/logs',
          icon: AlertCircle,
          description: 'Journaux et notifications'
        },
        {
          title: 'Métriques Avancées',
          href: '/super-admin/metrics-advanced',
          icon: BarChart3,
          description: 'Analytics détaillées'
        }
      ]
    },
    {
      title: 'Outils',
      color: 'text-gray-700',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
      icon: Wrench,
      isOpen: openSections.has('Outils'),
      children: [
        {
          title: 'Configuration',
          href: '/super-admin/configuration',
          icon: Settings,
          description: 'Paramètres système'
        },
        {
          title: 'Test Data',
          href: '/super-admin/test-data',
          icon: TestTube,
          description: 'Données de test'
        },
        {
          title: 'Connexion Demo',
          href: '/super-admin/connexion-demo',
          icon: Terminal,
          description: 'Interface de test organismes',
          isNew: true
        },
        {
          title: 'Debug',
          href: '/super-admin/debug',
          icon: Code,
          description: 'Outils de débogage'
        }
      ]
    }
  ];

  // Toggle section
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

  // Simulation mise à jour des stats en temps réel
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemStats(prev => ({
        ...prev,
        cpuUsage: Math.max(10, Math.min(80, prev.cpuUsage + (Math.random() - 0.5) * 10)),
        memoryUsage: Math.max(40, Math.min(90, prev.memoryUsage + (Math.random() - 0.5) * 5)),
        uptime: Math.min(99.9, prev.uptime + Math.random() * 0.01)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Vérifier si l'utilisateur est super admin
  if (session?.user?.role !== 'SUPER_ADMIN') {
    return null;
  }

  return (
    <div className="w-72 bg-white border-r border-gray-200 min-h-screen flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-purple-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent">
              ADMIN.GA
            </h2>
            <p className="text-xs text-gray-500">Super Administration</p>
          </div>
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto">
        <nav className="p-4 space-y-3">
          {navigationSections.map((section) => {
            const SectionIcon = section.icon;
            const hasActiveChild = section.children.some(child => pathname === child.href);

            return (
              <div key={section.title}>
                {/* Section Header */}
                <button
                  onClick={() => toggleSection(section.title)}
                  className={cn(
                    'w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 group',
                    section.bgColor,
                    section.borderColor,
                    hasActiveChild || section.isOpen
                      ? `border ${section.color} ${section.bgColor}`
                      : 'border border-transparent hover:border-gray-200 hover:bg-gray-50'
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <SectionIcon className={cn('w-5 h-5', section.color)} />
                    <span className={cn('font-medium', section.color)}>{section.title}</span>
                    {section.badge && (
                      <Badge variant="secondary" className="text-xs font-bold px-2 py-0.5">
                        {section.badge}
                      </Badge>
                    )}
                  </div>
                  {section.isOpen ? (
                    <ChevronDown className={cn('w-4 h-4', section.color)} />
                  ) : (
                    <ChevronRight className={cn('w-4 h-4', section.color)} />
                  )}
                </button>

                {/* Section Children */}
                {section.isOpen && (
                  <div className="mt-2 ml-4 space-y-1">
                    {section.children.map((item) => {
                      const isActive = pathname === item.href;
                      const ItemIcon = item.icon;

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={cn(
                            'flex items-center justify-between p-3 rounded-lg transition-all duration-200 group relative',
                            isActive
                              ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          )}
                        >
                          <div className="flex items-center space-x-3">
                            <ItemIcon className={cn(
                              'w-4 h-4',
                              isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'
                            )} />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">{item.title}</span>
                                {item.isNew && (
                                  <Badge variant="default" className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5">
                                    NEW
                                  </Badge>
                                )}
                                {item.badge && (
                                  <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                                    {item.badge}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                                {item.description}
                              </p>
                            </div>
                          </div>

                          {isActive && (
                            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-l"></div>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Statistiques Système en Temps Réel */}
      <div className="p-4 border-t border-gray-100 space-y-4">
        <div className="text-xs font-medium text-gray-700 flex items-center gap-2">
          <Activity className="w-3 h-3" />
          Système en Temps Réel
        </div>

        <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
          <CardContent className="p-3">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">CPU</span>
                  <span className="font-medium">{systemStats.cpuUsage}%</span>
                </div>
                <Progress value={systemStats.cpuUsage} className="h-1 mt-1" />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">RAM</span>
                  <span className="font-medium">{systemStats.memoryUsage}%</span>
                </div>
                <Progress value={systemStats.memoryUsage} className="h-1 mt-1" />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Stockage</span>
                  <span className="font-medium">{systemStats.storageUsage}%</span>
                </div>
                <Progress value={systemStats.storageUsage} className="h-1 mt-1" />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Uptime</span>
                  <span className="font-medium text-green-600">{systemStats.uptime}%</span>
                </div>
                <Progress value={systemStats.uptime} className="h-1 mt-1" />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-xs text-gray-500 space-y-1">
          <div className="flex items-center justify-between">
            <span>Organismes actifs</span>
            <span className="font-medium text-emerald-600">{systemStats.organismes}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Utilisateurs en ligne</span>
            <span className="font-medium text-blue-600">{systemStats.utilisateurs}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Services déployés</span>
            <span className="font-medium text-purple-600">{systemStats.services}</span>
          </div>
        </div>
      </div>

      {/* Profil Utilisateur */}
      <div className="p-4 border-t border-gray-100">
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-3 rounded-xl">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
              {session?.user?.firstName?.charAt(0) || 'S'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {session?.user?.firstName ? `${session.user.firstName} ${session.user.lastName}` : 'Super Admin'}
              </p>
              <p className="text-xs text-gray-600 truncate">
                {session?.user?.email || 'admin@admin.ga'}
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => signOut({ callbackUrl: '/auth/connexion' })}
            className="w-full mt-3 text-xs"
          >
            <LogOut className="w-3 h-3 mr-2" />
            Déconnexion
          </Button>
        </div>
      </div>
    </div>
  );
}
