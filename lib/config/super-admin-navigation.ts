import {
  Home,
  Building2,
  Users,
  Settings,
  BarChart3,
  Cog,
  Shield,
  Database,
  FileText,
  Activity,
  Search,
  HelpCircle,
  Zap,
  UserCheck,
  Building,
  Network,
  Stethoscope,
  UserCog,
  Key,
  Workflow,
  TestTube,
  TrendingUp,
  Monitor,
  FileSearch,
  Lock,
  Wrench,
  AlertTriangle,
  Users2,
  Briefcase,
  Globe,
  CheckCircle2
} from 'lucide-react';

import { NavigationSection, QuickAction, TourStep } from '@/lib/types/navigation';

export const SUPER_ADMIN_SECTIONS: NavigationSection[] = [
  {
    id: 'overview',
    title: 'Vue d\'Ensemble',
    icon: Home,
    description: 'Tableau de bord principal avec métriques clés et raccourcis',
    gradient: 'from-blue-500 to-blue-600',
    items: [
      {
        title: 'Dashboard Unifié',
        href: '/super-admin',
        icon: BarChart3,
        description: 'Vue complète de tous les indicateurs système',
        isFrequent: true,
        helpTip: 'Point central pour surveiller l\'activité de la plateforme'
      },
      {
        title: 'Actions Rapides',
        href: '/super-admin/quick-actions',
        icon: Zap,
        description: 'Raccourcis vers les tâches les plus fréquentes',
        isFrequent: true,
        helpTip: 'Accès direct aux actions courantes'
      },
      {
        title: 'Notifications Centre',
        href: '/super-admin/notifications',
        icon: AlertTriangle,
        description: 'Alertes système et notifications importantes',
        badge: { text: '12', variant: 'destructive' },
        helpTip: 'Surveillez les alertes critiques et les mises à jour'
      }
    ]
  },
  {
    id: 'organisms',
    title: 'Organismes & Structure',
    icon: Building2,
    description: 'Gestion complète des organismes et de la structure administrative',
    gradient: 'from-green-500 to-green-600',
    items: [
      {
        title: 'Gestion Organismes',
        href: '/super-admin/organismes-vue-ensemble',
        icon: Building,
        description: 'Vue consolidée : clients, prospects et organismes actifs',
        isFrequent: true,
        badge: { text: '160', variant: 'outline' },
        helpTip: 'Interface unifiée pour gérer tous les types d\'organismes'
      },
      {
        title: 'Structure Administrative',
        href: '/super-admin/structure-administrative',
        icon: Network,
        description: 'Hiérarchie officielle des 160 organismes gabonais',
        helpTip: 'Visualisation et gestion de la structure gouvernementale'
      },
      {
        title: 'Relations Inter-Organismes',
        href: '/super-admin/relations',
        icon: Globe,
        description: 'Cartographie des relations et collaborations',
        helpTip: 'Analysez les interactions entre organismes'
      },
      {
        title: 'Diagnostic & Santé',
        href: '/super-admin/diagnostic-administrations',
        icon: Stethoscope,
        description: 'Monitoring et évaluation de la santé organisationnelle',
        badge: { text: 'NOUVEAU', variant: 'default' },
        helpTip: 'Tableau de bord consolidé pour diagnostiquer les problèmes'
      }
    ]
  },
  {
    id: 'human_resources',
    title: 'Ressources Humaines',
    icon: Users,
    description: 'Gestion des utilisateurs, postes et permissions',
    gradient: 'from-purple-500 to-purple-600',
    items: [
      {
        title: 'Utilisateurs & Comptes',
        href: '/super-admin/utilisateurs',
        icon: Users2,
        description: 'Interface unifiée pour la gestion des comptes utilisateurs',
        isFrequent: true,
        badge: { text: '2.3k', variant: 'outline' },
        helpTip: 'Gestion centralisée de tous les comptes utilisateurs'
      },
      {
        title: 'Postes & Fonctions',
        href: '/super-admin/postes-administratifs',
        icon: Briefcase,
        description: 'Administration des postes et fonctions administratives',
        helpTip: 'Définissez et gérez la structure des postes'
      },
      {
        title: 'Permissions & Accès',
        href: '/super-admin/gestion-comptes',
        icon: Key,
        description: 'Contrôle des droits et niveaux d\'accès',
        helpTip: 'Sécurisez l\'accès selon les rôles et responsabilités'
      },
      {
        title: 'Fonctionnaires en Attente',
        href: '/super-admin/fonctionnaires-attente',
        icon: UserCheck,
        description: 'Validation des demandes d\'accès des fonctionnaires',
        badge: { text: '25', variant: 'secondary' },
        helpTip: 'Traitez les demandes d\'inscription en attente'
      }
    ]
  },
  {
    id: 'services',
    title: 'Services & Opérations',
    icon: Cog,
    description: 'Administration des services et processus opérationnels',
    gradient: 'from-orange-500 to-orange-600',
    items: [
      {
        title: 'Services Administratifs',
        href: '/super-admin/services',
        icon: FileText,
        description: 'Configuration et gestion des services offerts',
        badge: { text: '558', variant: 'outline' },
        helpTip: 'Administrez le catalogue complet des services'
      },
      {
        title: 'Workflows & Processus',
        href: '/super-admin/workflows',
        icon: Workflow,
        description: 'Optimisation des processus administratifs',
        helpTip: 'Configurez et optimisez les flux de travail'
      },
      {
        title: 'Interface de Test',
        href: '/super-admin/test-interface',
        icon: TestTube,
        description: 'Environnement de test pour les connexions DEMO',
        badge: { text: 'BETA', variant: 'secondary' },
        helpTip: 'Testez les fonctionnalités en mode sécurisé'
      }
    ]
  },
  {
    id: 'analytics',
    title: 'Analyse & Contrôle',
    icon: BarChart3,
    description: 'Statistiques, monitoring et contrôle qualité',
    gradient: 'from-indigo-500 to-indigo-600',
    items: [
      {
        title: 'Analytics Avancés',
        href: '/super-admin/analytics',
        icon: TrendingUp,
        description: 'Tableaux de bord détaillés et métriques avancées',
        isFrequent: true,
        helpTip: 'Analyses poussées de l\'utilisation et des performances'
      },
      {
        title: 'Monitoring Système',
        href: '/super-admin/metrics-advanced',
        icon: Monitor,
        description: 'Surveillance en temps réel des performances',
        helpTip: 'Supervisez la santé technique de la plateforme'
      },
      {
        title: 'Logs & Audit',
        href: '/super-admin/logs',
        icon: FileSearch,
        description: 'Journaux détaillés et traçabilité des actions',
        helpTip: 'Consultez l\'historique complet des opérations'
      },
      {
        title: 'Base de Connaissances',
        href: '/super-admin/knowledge-base',
        icon: HelpCircle,
        description: 'Gestion de la base de connaissances organisationnelle',
        badge: { text: 'IA', variant: 'outline' },
        helpTip: 'Exploitez l\'intelligence artificielle pour la documentation'
      }
    ]
  },
  {
    id: 'configuration',
    title: 'Configuration',
    icon: Settings,
    description: 'Paramètres système et maintenance',
    gradient: 'from-gray-500 to-gray-600',
    items: [
      {
        title: 'Paramètres Généraux',
        href: '/super-admin/configuration',
        icon: Cog,
        description: 'Configuration globale de la plateforme',
        helpTip: 'Ajustez les paramètres généraux du système'
      },
      {
        title: 'Sécurité & Accès',
        href: '/super-admin/security',
        icon: Shield,
        description: 'Politique de sécurité et contrôles d\'accès',
        helpTip: 'Renforcez la sécurité de la plateforme'
      },
      {
        title: 'Base de Données',
        href: '/super-admin/base-donnees',
        icon: Database,
        description: 'Administration et maintenance de la base de données',
        helpTip: 'Outils avancés pour la gestion des données'
      },
      {
        title: 'Maintenance Système',
        href: '/super-admin/systeme',
        icon: Wrench,
        description: 'Outils de maintenance et optimisation',
        helpTip: 'Maintenez les performances optimales du système'
      }
    ]
  }
];

export const QUICK_ACTIONS: QuickAction[] = [
  {
    title: 'Nouvel Organisme',
    href: '/super-admin/organisme/nouveau',
    icon: Building2,
    color: 'bg-green-500',
    description: 'Ajouter rapidement un nouvel organisme',
    priority: 'high'
  },
  {
    title: 'Utilisateur Urgent',
    href: '/super-admin/utilisateurs?mode=create',
    icon: UserCheck,
    color: 'bg-blue-500',
    description: 'Créer un compte utilisateur prioritaire',
    priority: 'high'
  },
  {
    title: 'Backup Manuel',
    href: '/super-admin/base-donnees?action=backup',
    icon: Database,
    color: 'bg-orange-500',
    description: 'Lancer une sauvegarde immédiate',
    priority: 'medium'
  },
  {
    title: 'Support Technique',
    href: '/super-admin/support',
    icon: HelpCircle,
    color: 'bg-purple-500',
    description: 'Accès direct au support technique',
    priority: 'medium'
  },
  {
    title: 'Rapport Express',
    href: '/super-admin/analytics?preset=weekly',
    icon: TrendingUp,
    color: 'bg-indigo-500',
    description: 'Générer un rapport hebdomadaire',
    priority: 'low'
  },
  {
    title: 'Mode Maintenance',
    href: '/super-admin/systeme?mode=maintenance',
    icon: Wrench,
    color: 'bg-red-500',
    description: 'Basculer en mode maintenance',
    priority: 'low'
  }
];

export const TOUR_STEPS: TourStep[] = [
  {
    id: 'welcome',
    title: 'Bienvenue dans ADMIN.GA',
    content: 'Cette interface a été conçue pour simplifier votre travail d\'administration. Laissez-vous guider pour découvrir les fonctionnalités principales.',
    target: 'body',
    position: 'top'
  },
  {
    id: 'navigation',
    title: 'Navigation Simplifiée',
    content: 'Les 6 sections principales organisent toutes les fonctionnalités de manière logique. Chaque carte indique clairement son rôle.',
    target: '[data-tour="navigation-grid"]',
    position: 'top'
  },
  {
    id: 'quick-actions',
    title: 'Actions Rapides',
    content: 'Accédez instantanément aux tâches les plus fréquentes depuis ce panneau. Les couleurs indiquent le niveau de priorité.',
    target: '[data-tour="quick-actions"]',
    position: 'left'
  },
  {
    id: 'search',
    title: 'Recherche Intelligente',
    content: 'Tapez Ctrl+K pour ouvrir la recherche. Elle comprend le contexte et vous guide vers la bonne fonctionnalité.',
    target: '[data-tour="search-bar"]',
    position: 'bottom'
  },
  {
    id: 'help',
    title: 'Aide Contextuelle',
    content: 'Chaque section dispose d\'aide intégrée. Survolez les éléments pour obtenir des conseils personnalisés.',
    target: '[data-tour="help-button"]',
    position: 'left'
  },
  {
    id: 'dashboard',
    title: 'Votre Tableau de Bord',
    content: 'Le dashboard unifié centralise toutes les informations importantes. C\'est votre point de départ recommandé.',
    target: '[data-tour="dashboard-link"]',
    position: 'right'
  }
];

export const HELP_SHORTCUTS = {
  'Ctrl+K': 'Recherche rapide globale',
  'Ctrl+H': 'Aide contextuelle',
  'Ctrl+D': 'Retour au dashboard',
  'Ctrl+N': 'Nouvel élément (selon le contexte)',
  'Ctrl+S': 'Sauvegarder les modifications',
  'Ctrl+/': 'Afficher tous les raccourcis',
  'Esc': 'Fermer les modales/popups'
};

export const CONTEXTUAL_HELP = {
  '/super-admin': 'Le dashboard moderne vous donne une vue d\'ensemble complète avec une interface simplifiée. Utilisez les cartes de navigation pour accéder rapidement aux sections.',
  '/super-admin/organismes-vue-ensemble': 'Cette page consolide tous vos organismes. Utilisez les filtres pour segmenter entre clients actifs, prospects et organismes gouvernementaux.',
  '/super-admin/utilisateurs': 'Gérez tous les comptes depuis cette interface unifiée. Les badges colorés indiquent le statut et les actions requises.',
  '/super-admin/analytics': 'Les analytics avancés vous aident à prendre des décisions éclairées. Chaque graphique est interactif et exportable.',
  '/super-admin/base-donnees': 'Interface simplifiée pour la gestion des données. Les actions critiques sont protégées par des confirmations.',
  '/super-admin/configuration': 'Centralisez tous vos paramètres système. Les modifications importantes sont automatiquement sauvegardées.'
};
