/* @ts-nocheck */
"use client";

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  LayoutDashboard,
  Building2,
  Users,
  Settings,
  Shield,
  FileText,
  Network,
  Activity,
  Search,
  ChevronRight,
  ChevronDown,
  Bell,
  AlertCircle,
  TrendingUp,
  Database as DatabaseIcon,
  UserCheck,
  Briefcase,
  TestTube,
  Star,
  Zap,
  Command,
  Home,
  Filter,
  Layers,
  Workflow,
  BookOpen,
  HelpCircle,
  LogOut,
  Plus
} from 'lucide-react';

// Structure de navigation optimisée avec sous-menus
const navigationStructure = [
  {
    id: 'dashboard',
    title: 'Vue d\'ensemble',
    icon: LayoutDashboard,
    href: '/super-admin/dashboard-unified',
    badge: { type: 'live', text: 'Live' },
    description: 'Tableau de bord temps réel'
  },
  {
    id: 'organismes',
    title: 'Gestion des Organismes',
    icon: Building2,
    badge: { type: 'count', text: '0' },
    subItems: [
      {
        title: 'Vue Globale',
        href: '/super-admin/organismes',
        icon: Layers,
        description: 'Tous les organismes'
      },
      {
        title: 'Relations & Hiérarchie',
        href: '/super-admin/relations',
        icon: Network,
        description: 'Relations inter-organismes'
      },
      {
        title: 'Clients ADMIN.GA',
        href: '/super-admin/clients',
        icon: Star,
        badge: { type: 'new', text: 'PRO' },
        description: 'Organismes premium'
      },
      {
        title: 'Structure Officielle',
        href: '/super-admin/structure-administrative',
        icon: Shield,
        description: 'Hiérarchie gabonaise'
      }
    ]
  },
  {
    id: 'ressources-humaines',
    title: 'Ressources Humaines',
    icon: Users,
    badge: { type: 'alert', text: '!' },
    subItems: [
      {
        title: 'Tous les Utilisateurs',
        href: '/super-admin/utilisateurs',
        icon: Users,
        description: 'Base utilisateurs complète'
      },
      {
        title: 'Création de Comptes',
        href: '/super-admin/gestion-comptes',
        icon: UserCheck,
        badge: { type: 'new', text: 'Nouveau' },
        description: 'Nouveaux collaborateurs'
      },
      {
        title: 'Postes & Fonctions',
        href: '/super-admin/postes-administratifs',
        icon: Briefcase,
        description: 'Référentiel des postes'
      }
    ]
  },
  {
    id: 'services',
    title: 'Services & Opérations',
    icon: FileText,
    href: '/super-admin/services',
    description: 'Gestion des services'
  },
  {
    id: 'monitoring',
    title: 'Monitoring & Analyse',
    icon: Activity,
    subItems: [
      {
        title: 'Diagnostic Système',
        href: '/super-admin/diagnostic-administrations',
        icon: DatabaseIcon,
        description: 'Santé du système'
      },
      {
        title: 'Statistiques',
        href: '/super-admin/analytics',
        icon: TrendingUp,
        description: 'Analyses avancées'
      }
    ]
  },
  {
    id: 'parametres',
    title: 'Paramètres',
    icon: Settings,
    subItems: [
      {
        title: 'Configuration',
        href: '/super-admin/configuration',
        icon: Settings,
        description: 'Paramètres généraux'
      },
      {
        title: 'Système',
        href: '/super-admin/systeme',
        icon: Shield,
        description: 'Administration avancée'
      }
    ]
  },

];

// Composant pour les indicateurs de statut
const StatusIndicator = ({ status }: { status: 'online' | 'warning' | 'error' }) => {
  const colors = {
    online: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500'
  };

  return (
    <div className="relative">
      <div className={cn(
        'w-2 h-2 rounded-full',
        colors[status]
      )} />
      <div className={cn(
        'absolute inset-0 w-2 h-2 rounded-full animate-ping',
        colors[status]
      )} />
    </div>
  );
};

// Composant Badge amélioré
const SmartBadge = ({ badge }: { badge: any }) => {
  if (!badge) return null;

  const styles = {
    live: 'bg-green-100 text-green-700 animate-pulse',
    count: 'bg-blue-100 text-blue-700',
    new: 'bg-purple-100 text-purple-700',
    alert: 'bg-red-100 text-red-700',
    beta: 'bg-yellow-100 text-yellow-700'
  };

  return (
    <Badge className={cn(
      'ml-auto text-xs px-2 py-0.5',
      styles[badge.type] || 'bg-gray-100 text-gray-700'
    )}>
      {badge.text}
    </Badge>
  );
};

export function SidebarModern() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [notifications, setNotifications] = useState(3);
  const [systemStatus, setSystemStatus] = useState<'online' | 'warning' | 'error'>('online');

  // Vérifier si l'utilisateur est super admin
  if (session?.user?.role !== 'SUPER_ADMIN') {
    return null;
  }

  // Gérer l'expansion automatique basée sur la route active
  useEffect(() => {
    navigationStructure.forEach((item) => {
      if (item.subItems) {
        const isActive = item.subItems.some(sub => pathname === sub.href);
        if (isActive && !expandedItems.includes(item.id)) {
          setExpandedItems(prev => [...prev, item.id]);
        }
      }
    });
  }, [pathname]);

  // Filtrer les éléments de navigation basé sur la recherche
  const filteredNavigation = useMemo(() => {
    if (!searchQuery) return navigationStructure;

    const query = searchQuery.toLowerCase();
    return navigationStructure.filter(item => {
      const matchTitle = item.title.toLowerCase().includes(query);
      const matchDescription = item.description?.toLowerCase().includes(query);
      const matchSubItems = item.subItems?.some(sub =>
        sub.title.toLowerCase().includes(query) ||
        sub.description?.toLowerCase().includes(query)
      );

      return matchTitle || matchDescription || matchSubItems;
    });
  }, [searchQuery]);

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const renderNavItem = (item: any, isSubItem = false) => {
    const isActive = pathname === item.href;
    const Icon = item.icon;
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const isExpanded = expandedItems.includes(item.id);

    if (hasSubItems && !isSubItem) {
      return (
        <div key={item.id} className="mb-1">
          {item.separator && <Separator className="my-2" />}
          <button
            onClick={() => toggleExpanded(item.id)}
            className={cn(
              'w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group',
              'hover:bg-gray-100 dark:hover:bg-gray-800'
            )}
          >
            <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <span className="flex-1 text-left">{item.title}</span>
            <SmartBadge badge={item.badge} />
            <ChevronRight className={cn(
              'w-4 h-4 text-gray-400 transition-transform',
              isExpanded && 'rotate-90'
            )} />
          </button>

          {isExpanded && (
            <div className="mt-1 ml-4 space-y-1">
              {item.subItems.map((subItem: any) => renderNavItem(subItem, true))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={item.href}
        href={item.href}
        className={cn(
          'flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group relative',
          isActive
            ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
            : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800',
          isSubItem && 'py-2'
        )}
      >
        <Icon className={cn(
          'w-5 h-5',
          isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'
        )} />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span>{item.title}</span>
            <SmartBadge badge={item.badge} />
          </div>
          {item.description && !isSubItem && (
            <p className="text-xs text-gray-500 mt-0.5">
              {item.description}
            </p>
          )}
        </div>

        {isActive && (
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-l" />
        )}
      </Link>
    );
  };

  return (
    <div className="w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 min-h-screen flex flex-col">
      {/* Header avec statut système */}
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">ADMIN.GA</h2>
              <div className="flex items-center gap-2">
                <p className="text-xs text-gray-600 dark:text-gray-400">Super Admin</p>
                <StatusIndicator status={systemStatus} />
              </div>
            </div>
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="relative"
            onClick={() => setNotifications(0)}
          >
            <Bell className="w-5 h-5" />
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {notifications}
              </span>
            )}
          </Button>
        </div>

        {/* Barre de recherche avec raccourci clavier */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Recherche rapide..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10 h-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
          />
          <kbd className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Navigation principale avec scroll */}
      <ScrollArea className="flex-1 px-3">
        <nav className="space-y-1 pb-4">
          {/* Actions rapides */}
          <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Actions rapides</span>
              <Zap className="w-3 h-3 text-yellow-500" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <Button size="sm" variant="ghost" className="h-8 px-2 text-xs">
                <Plus className="w-3 h-3 mr-1" />
                Organisme
              </Button>
              <Button size="sm" variant="ghost" className="h-8 px-2 text-xs">
                <UserCheck className="w-3 h-3 mr-1" />
                Compte
              </Button>
              <Button size="sm" variant="ghost" className="h-8 px-2 text-xs">
                <FileText className="w-3 h-3 mr-1" />
                Service
              </Button>
            </div>
          </div>

          {/* Éléments de navigation filtrés */}
          {filteredNavigation.map((item) => renderNavItem(item))}
        </nav>
      </ScrollArea>

      {/* Footer avec informations utilisateur et aide */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800 space-y-3">
        {/* Statistiques rapides */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded">
            <p className="text-gray-500">Organismes actifs</p>
            <p className="font-semibold">156/160</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded">
            <p className="text-gray-500">Utilisateurs</p>
            <p className="font-semibold">1,247</p>
          </div>
        </div>

        {/* Aide et documentation */}
        <div className="flex items-center justify-between pt-2">
          <Button size="sm" variant="ghost" className="text-xs">
            <HelpCircle className="w-4 h-4 mr-1" />
            Aide
          </Button>
          <Button size="sm" variant="ghost" className="text-xs">
            <BookOpen className="w-4 h-4 mr-1" />
            Docs
          </Button>
        </div>

        {/* Informations utilisateur */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
              {session?.user?.firstName?.charAt(0) || 'S'}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {session?.user?.firstName || 'Super Admin'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {session?.user?.email || 'admin@admin.ga'}
              </p>
            </div>
          </div>
          <Button size="sm" variant="ghost" className="text-gray-500">
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
