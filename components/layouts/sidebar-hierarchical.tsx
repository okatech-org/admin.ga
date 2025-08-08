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
    description: 'Vue d\'ensemble du système (Vide)',
    count: 0,
    countColor: 'gray',
    section: 'dashboard',
    sectionColor: 'slate'
  },

  // 🏛️ GESTION ORGANISMES
  {
    title: 'Organismes',
    icon: Building2,
    description: 'Gestion complète des organismes publics',
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
        title: 'Nouvel Organisme',
        href: '/super-admin/organisme/nouveau',
        icon: Building,
        description: 'Création d\'organismes (Désactivé)',
        count: 0,
        countColor: 'gray'
      },
      {
        title: 'Structure Administrative',
        href: '/super-admin/structure-administrative',
        icon: Crown,
        description: 'Hiérarchie officielle (Vide)'
      }
    ]
  },

  // 👥 ADMINISTRATION UTILISATEURS
  {
    title: 'Utilisateurs',
    icon: Users,
    description: 'Administration des comptes utilisateurs',
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
        description: 'Gestion des collaborateurs (Vide)'
      },
      {
        title: 'Fonctionnaires en Attente',
        href: '/super-admin/fonctionnaires-attente',
        icon: Clock,
        description: 'Gestion des affectations (0)',
        count: 0,
        countColor: 'gray'
      }
    ]
  },

  // 🔧 SERVICES
  {
    title: 'Services',
    icon: FileText,
    description: 'Gestion des services administratifs',
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
  }
];

interface SidebarHierarchicalProps {
  className?: string;
}

export function SidebarHierarchical({ className }: SidebarHierarchicalProps) {
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

    return (
      <span className="ml-auto px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-500 border border-gray-200 text-center min-w-[2rem]">
        0
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
            🧹 Navigation Vide
          </h2>
          <p className="px-4 text-sm text-gray-500">
            Système entièrement nettoyé
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
              <p className="font-medium text-gray-900">🧹 Système Vide</p>
              <p className="text-gray-500">0 données</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
