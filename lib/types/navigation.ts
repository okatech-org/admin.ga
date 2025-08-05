import { LucideIcon } from 'lucide-react';

export interface BadgeInfo {
  text: string;
  variant: 'default' | 'secondary' | 'destructive' | 'outline';
  count?: number;
}

export interface NavigationItem {
  title: string;
  href: string;
  icon: LucideIcon;
  description: string;
  isFrequent?: boolean;
  badge?: BadgeInfo;
  helpTip?: string;
  requiresPermission?: string[];
}

export interface NavigationSection {
  id: string;
  title: string;
  icon: LucideIcon;
  description: string;
  items: NavigationItem[];
  badge?: BadgeInfo;
  requiresPermission?: string[];
  gradient: string;
}

export interface QuickAction {
  title: string;
  href: string;
  icon: LucideIcon;
  color: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

export interface UserContextInfo {
  name: string;
  role: string;
  avatar?: string;
  lastLogin: string;
  pendingTasks: number;
  notifications: number;
}

export interface NavigationStructure {
  sections: NavigationSection[];
  quickActions: QuickAction[];
  userContext: UserContextInfo;
}

// Configuration de navigation pour super admin
export interface SuperAdminNavConfig {
  mainSections: NavigationSection[];
  frequentActions: QuickAction[];
  helpResources: {
    tourSteps: TourStep[];
    contextualHelp: Record<string, string>;
    shortcuts: Record<string, string>;
  };
}

export interface TourStep {
  id: string;
  title: string;
  content: string;
  target: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

// Analytics et feedback
export interface NavigationAnalytics {
  pageViews: Record<string, number>;
  frequentPaths: string[];
  userJourney: NavigationEvent[];
  completionRates: Record<string, number>;
}

export interface NavigationEvent {
  timestamp: Date;
  page: string;
  action: string;
  duration?: number;
  success?: boolean;
}
