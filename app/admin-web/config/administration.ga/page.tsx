'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
  ArrowLeft, Settings, Shield, Users, Building2, Activity, TrendingUp, Edit, Save, X, Loader2,
  CheckCircle, AlertCircle, Palette, Globe, Monitor, Database, Lock, Key, Bell,
  FileText, Download, Upload, RefreshCw, Eye, EyeOff, Copy, Trash2, Plus,
  Server, Wifi, WifiOff, UserCheck, UserX, Clock, Calendar, BarChart3,
  Zap, Mail, Phone, MessageSquare, Webhook, Code, AlertTriangle, Info,
  HardDrive, Cloud, ShieldCheck, Search, Filter, MoreHorizontal, ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import AdministrationDomainConfig from '@/components/domain-management/administration-domain-config';

type LoadingState = 'idle' | 'loading' | 'success' | 'error';
type UserRole = 'super_admin' | 'admin' | 'manager' | 'user' | 'readonly';
type SystemStatus = 'healthy' | 'warning' | 'critical' | 'maintenance';
type BackupStatus = 'success' | 'failed' | 'in_progress' | 'scheduled';
type LogLevel = 'info' | 'warning' | 'error' | 'critical';

interface ConfigStats {
  activeUsers: number;
  organizations: number;
  dailyLogins: number;
  uptime: string;
  systemLoad: number;
  diskUsage: number;
  memoryUsage: number;
  dbConnections: number;
  apiCalls: number;
  errors: number;
}

interface UserManagement {
  totalUsers: number;
  activeUsers: number;
  pendingApprovals: number;
  blockedUsers: number;
  roles: { role: UserRole; count: number }[];
  recentActivity: Array<{
    id: string;
    user: string;
    action: string;
    timestamp: Date;
    ip: string;
  }>;
}

interface SecurityConfig {
  twoFactorAuth: boolean;
  sessionTimeout: number;
  passwordPolicy: {
    minLength: number;
    requireUppercase: boolean;
    requireNumbers: boolean;
    requireSymbols: boolean;
    expirationDays: number;
  };
  ipWhitelist: string[];
  failedLoginAttempts: number;
  accountLockoutDuration: number;
  auditLog: boolean;
  encryptionLevel: 'standard' | 'high' | 'military';
}

interface BackupConfig {
  enabled: boolean;
  frequency: 'hourly' | 'daily' | 'weekly' | 'monthly';
  retention: number;
  cloudSync: boolean;
  compression: boolean;
  encryption: boolean;
  lastBackup: Date;
  nextBackup: Date;
  backupSize: string;
  status: BackupStatus;
}

interface IntegrationConfig {
  apis: Array<{
    id: string;
    name: string;
    url: string;
    enabled: boolean;
    status: 'connected' | 'disconnected' | 'error';
    lastSync: Date;
  }>;
  webhooks: Array<{
    id: string;
    url: string;
    events: string[];
    enabled: boolean;
  }>;
}

interface NotificationConfig {
  email: {
    enabled: boolean;
    smtp: {
      host: string;
      port: number;
      secure: boolean;
      user: string;
      password: string;
    };
    templates: Record<string, string>;
  };
  sms: {
    enabled: boolean;
    provider: string;
    apiKey: string;
  };
  push: {
    enabled: boolean;
    vapidKeys: {
      public: string;
      private: string;
    };
  };
}

interface AppConfig {
  enabled: boolean;
  name: string;
  subtitle: string;
  description: string;
  domain: string;
  logoUrl: string;
  faviconUrl: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  features: {
    userManagement: boolean;
    organizationHierarchy: boolean;
    documentManagement: boolean;
    reporting: boolean;
    integration: boolean;
    apiAccess: boolean;
  };
  stats: ConfigStats;
  users: UserManagement;
  security: SecurityConfig;
  backup: BackupConfig;
  integrations: IntegrationConfig;
  notifications: NotificationConfig;
  maintenanceMode: boolean;
}

export default function AdministrationGAConfigPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [isEditMode, setIsEditMode] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Formatage de nombre cohérent
  const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  // Configuration initiale ADMINISTRATION.GA
  const [originalConfig, setOriginalConfig] = useState<AppConfig>({
    enabled: true,
    name: 'ADMINISTRATION.GA',
    subtitle: 'Système d\'Administration Gabonais',
    description: 'Plateforme centralisée de gestion administrative pour les institutions publiques du Gabon',
    domain: 'administration.ga',
    logoUrl: '/logos/administration-ga.png',
    faviconUrl: '/favicons/administration-ga.ico',
    primaryColor: '#059669',
    secondaryColor: '#10b981',
    accentColor: '#34d399',
    features: {
      userManagement: true,
      organizationHierarchy: true,
      documentManagement: true,
      reporting: true,
      integration: true,
      apiAccess: true
    },
    stats: {
      activeUsers: 15247,
      organizations: 456,
      dailyLogins: 3256,
      uptime: '99.9%',
      systemLoad: 45,
      diskUsage: 67,
      memoryUsage: 52,
      dbConnections: 142,
      apiCalls: 25789,
      errors: 3
    },
    users: {
      totalUsers: 15247,
      activeUsers: 12834,
      pendingApprovals: 45,
      blockedUsers: 12,
      roles: [
        { role: 'super_admin', count: 5 },
        { role: 'admin', count: 48 },
        { role: 'manager', count: 234 },
        { role: 'user', count: 14890 },
        { role: 'readonly', count: 70 }
      ],
      recentActivity: [
        { id: '1', user: 'Jean Mbongo', action: 'Connexion', timestamp: new Date(), ip: '192.168.1.10' },
        { id: '2', user: 'Marie Obame', action: 'Modification organisation', timestamp: new Date(), ip: '192.168.1.15' },
        { id: '3', user: 'Paul Ndong', action: 'Export données', timestamp: new Date(), ip: '192.168.1.20' }
      ]
    },
    security: {
      twoFactorAuth: true,
      sessionTimeout: 3600,
      passwordPolicy: {
        minLength: 12,
        requireUppercase: true,
        requireNumbers: true,
        requireSymbols: true,
        expirationDays: 90
      },
      ipWhitelist: ['192.168.1.0/24', '10.0.0.0/8'],
      failedLoginAttempts: 5,
      accountLockoutDuration: 300,
      auditLog: true,
      encryptionLevel: 'high'
    },
    backup: {
      enabled: true,
      frequency: 'daily',
      retention: 30,
      cloudSync: true,
      compression: true,
      encryption: true,
      lastBackup: new Date(Date.now() - 86400000),
      nextBackup: new Date(Date.now() + 86400000),
      backupSize: '2.4 GB',
      status: 'success'
    },
    integrations: {
      apis: [
        { id: '1', name: 'DGDI API', url: 'https://api.dgdi.ga', enabled: true, status: 'connected', lastSync: new Date() },
        { id: '2', name: 'MinFin API', url: 'https://api.minfin.ga', enabled: true, status: 'connected', lastSync: new Date() },
        { id: '3', name: 'CNSS API', url: 'https://api.cnss.ga', enabled: false, status: 'disconnected', lastSync: new Date() }
      ],
      webhooks: [
        { id: '1', url: 'https://hook.demarche.ga/events', events: ['user.created', 'org.updated'], enabled: true },
        { id: '2', url: 'https://hook.travail.ga/notifications', events: ['user.login'], enabled: true }
      ]
    },
    notifications: {
      email: {
        enabled: true,
        smtp: {
          host: 'smtp.administration.ga',
          port: 587,
          secure: true,
          user: 'noreply@administration.ga',
          password: '••••••••'
        },
        templates: {
          welcome: 'Bienvenue sur ADMINISTRATION.GA',
          reset: 'Réinitialisation de mot de passe'
        }
      },
      sms: {
        enabled: true,
        provider: 'Gabon Telecom',
        apiKey: '••••••••'
      },
      push: {
        enabled: false,
        vapidKeys: {
          public: 'BPK1234567890...',
          private: '••••••••'
        }
      }
    },
    maintenanceMode: false
  });

  const [config, setConfig] = useState<AppConfig>(originalConfig);

  useEffect(() => {
    loadConfiguration();
  }, []);

  const loadConfiguration = async () => {
    setLoadingState('loading');
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setLoadingState('success');
      toast.success('Configuration chargée');
    } catch (error) {
      setLoadingState('error');
      toast.error('Erreur lors du chargement');
    }
  };

  const refreshStats = async () => {
    setStatsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulation de nouvelles données
      const newStats = {
        ...config.stats,
        dailyLogins: config.stats.dailyLogins + Math.floor(Math.random() * 100),
        apiCalls: config.stats.apiCalls + Math.floor(Math.random() * 1000),
        systemLoad: Math.max(0, Math.min(100, config.stats.systemLoad + (Math.random() - 0.5) * 20))
      };

      setConfig(prev => ({ ...prev, stats: newStats }));
      setStatsLoading(false);
      toast.success('Statistiques mises à jour');
    } catch (error) {
      setStatsLoading(false);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const updateConfig = (updates: Partial<AppConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
    setHasUnsavedChanges(true);
  };

  const updateConfigNested = (section: keyof AppConfig, updates: any) => {
    setConfig(prev => {
      const currentValue = prev[section];
      if (typeof currentValue === 'object' && currentValue !== null) {
        return {
          ...prev,
          [section]: { ...currentValue, ...updates }
        };
      }
      return {
        ...prev,
        [section]: updates
      };
    });
    setHasUnsavedChanges(true);
  };

  // Validation
  const validateField = (name: string, value: any): string => {
    switch (name) {
      case 'name':
        return !value || value.trim().length < 2 ? 'Le nom doit contenir au moins 2 caractères' : '';
      case 'domain':
        const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
        return !value || !domainRegex.test(value) ? 'Format de domaine invalide' : '';
      default:
        return '';
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    newErrors.name = validateField('name', config.name);
    newErrors.domain = validateField('domain', config.domain);

    const filteredErrors = Object.fromEntries(
      Object.entries(newErrors).filter(([_, value]) => value !== '')
    );

    setErrors(filteredErrors);
    return Object.keys(filteredErrors).length === 0;
  };

  const handleSaveConfiguration = async () => {
    if (!validateForm()) {
      toast.error('Veuillez corriger les erreurs avant de sauvegarder.');
      return;
    }

    setLoadingState('loading');
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setOriginalConfig(config);
      setHasUnsavedChanges(false);
      setIsEditMode(false);
      setErrors({});
      setLoadingState('success');
      toast.success('Configuration sauvegardée avec succès!');
    } catch (error) {
      setLoadingState('error');
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const handleCancelEdit = () => {
    setConfig(originalConfig);
    setHasUnsavedChanges(false);
    setIsEditMode(false);
    setErrors({});
    toast.info('Modifications annulées');
  };

  const handleMaintenanceMode = async () => {
    setLoadingState('loading');
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      updateConfig({ maintenanceMode: !config.maintenanceMode });
      setIsMaintenanceModalOpen(false);
      setLoadingState('success');
      toast.success(`Mode maintenance ${!config.maintenanceMode ? 'activé' : 'désactivé'}`);
    } catch (error) {
      setLoadingState('error');
      toast.error('Erreur lors de la modification');
    }
  };

  const handleBackupNow = async () => {
    setLoadingState('loading');
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));

      const newBackupConfig = {
        ...config.backup,
          lastBackup: new Date(),
        nextBackup: new Date(Date.now() + 86400000),
        status: 'success' as BackupStatus
      };

      updateConfigNested('backup', newBackupConfig);
      setIsBackupModalOpen(false);
      setLoadingState('success');
      toast.success('Sauvegarde effectuée avec succès');
    } catch (error) {
      setLoadingState('error');
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const handleExportData = async (type: 'users' | 'logs' | 'config' | 'analytics' | 'security') => {
    try {
    setLoadingState('loading');
      await new Promise(resolve => setTimeout(resolve, 1500));

      const data = {
        type,
        timestamp: new Date().toISOString(),
        data: type === 'config' ? config : { message: `Données ${type} exportées` }
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `administration-ga-${type}-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setLoadingState('success');
      toast.success(`Données ${type} exportées avec succès`);
    } catch (error) {
      setLoadingState('error');
      toast.error('Erreur lors de l\'export');
    }
  };

  const handleToggleAPI = async (apiId: string) => {
    setLoadingState('loading');
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const updatedAPIs = config.integrations.apis.map(api =>
        api.id === apiId ? { ...api, enabled: !api.enabled } : api
      );

      updateConfigNested('integrations', { ...config.integrations, apis: updatedAPIs });
      setLoadingState('success');
      toast.success('API mise à jour');
    } catch (error) {
      setLoadingState('error');
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const handleSyncAPI = async (apiId: string) => {
    setLoadingState('loading');
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const updatedAPIs = config.integrations.apis.map(api =>
        api.id === apiId ? { ...api, lastSync: new Date(), status: 'connected' as const } : api
      );

      updateConfigNested('integrations', { ...config.integrations, apis: updatedAPIs });
      setLoadingState('success');
      toast.success('Synchronisation réussie');
    } catch (error) {
      setLoadingState('error');
      toast.error('Erreur de synchronisation');
    }
  };

  const handleToggleSecurity = async (setting: keyof SecurityConfig) => {
    setLoadingState('loading');
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const updatedSecurity = {
        ...config.security,
        [setting]: typeof config.security[setting] === 'boolean'
          ? !config.security[setting]
          : config.security[setting]
      };

      updateConfigNested('security', updatedSecurity);
      setLoadingState('success');
      toast.success('Paramètre de sécurité mis à jour');
    } catch (error) {
      setLoadingState('error');
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const handleUserAction = async (action: string, userId?: string) => {
    setLoadingState('loading');
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      switch (action) {
        case 'approve_pending':
          const newPending = Math.max(0, config.users.pendingApprovals - 1);
          const newActive = config.users.activeUsers + 1;
          updateConfigNested('users', {
            ...config.users,
            pendingApprovals: newPending,
            activeUsers: newActive
          });
          toast.success('Utilisateur approuvé');
          break;
        case 'block_user':
          const newBlocked = config.users.blockedUsers + 1;
          const newActiveBlocked = config.users.activeUsers - 1;
          updateConfigNested('users', {
            ...config.users,
            blockedUsers: newBlocked,
            activeUsers: newActiveBlocked
          });
          toast.success('Utilisateur bloqué');
          break;
        case 'send_notification':
          toast.success('Notification envoyée aux utilisateurs');
          break;
        default:
          toast.info(`Action ${action} effectuée`);
      }

      setLoadingState('success');
    } catch (error) {
      setLoadingState('error');
      toast.error('Erreur lors de l\'action');
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copié dans le presse-papier');
    } catch (error) {
      toast.error('Erreur lors de la copie');
    }
  };

  const handleGenerateAPIKey = async () => {
    setLoadingState('loading');
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newKey = 'aga_' + Math.random().toString(36).substring(2, 15);
      toast.success(`Nouvelle clé API générée: ${newKey}`);
      setLoadingState('success');
    } catch (error) {
      setLoadingState('error');
      toast.error('Erreur lors de la génération');
    }
  };

  const handleTestNotification = async (type: 'email' | 'sms' | 'push') => {
    setLoadingState('loading');
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success(`Test de notification ${type} envoyé`);
      setLoadingState('success');
    } catch (error) {
      setLoadingState('error');
      toast.error(`Erreur lors du test ${type}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" asChild className="border-green-600 text-green-600 hover:bg-green-50">
                <Link href="/super-admin">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Super Admin
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild className="border-gray-300">
                <Link href="/admin-web">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Admin Web
                </Link>
              </Button>
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="flex items-center space-x-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: config.primaryColor }}
                >
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Configuration ADMINISTRATION.GA</h1>
                  <p className="text-sm text-gray-600">{config.subtitle}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {hasUnsavedChanges && (
                <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200">
                  Modifications non sauvées
                </Badge>
              )}
              {config.maintenanceMode && (
                <Badge variant="destructive">Mode Maintenance</Badge>
              )}
              <div className="flex items-center space-x-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                <div className={`w-2 h-2 rounded-full ${config.enabled ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span>{config.enabled ? 'Actif' : 'Inactif'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Alertes */}
        {config.maintenanceMode && (
          <Alert className="mb-6 bg-red-50 border-red-200">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Mode maintenance activé :</strong> L'application ADMINISTRATION.GA est temporairement indisponible.
            </AlertDescription>
          </Alert>
        )}

        {Object.keys(errors).length > 0 && isEditMode && (
          <Alert className="mb-6 bg-red-50 border-red-200">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>{Object.keys(errors).length} erreur(s) détectée(s) :</strong>
              <ul className="mt-2 ml-4 list-disc">
                {Object.entries(errors).map(([field, error]) => (
                  <li key={field} className="text-sm">{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-9 h-auto">
            <TabsTrigger value="overview" className="flex flex-col items-center space-y-1 h-16">
              <Monitor className="w-5 h-5" />
              <span className="text-xs">Vue d'ensemble</span>
            </TabsTrigger>
            <TabsTrigger value="domains" className="flex flex-col items-center space-y-1 h-16">
              <Globe className="w-5 h-5" />
              <span className="text-xs">Domaines</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex flex-col items-center space-y-1 h-16">
              <Users className="w-5 h-5" />
              <span className="text-xs">Utilisateurs</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex flex-col items-center space-y-1 h-16">
              <Shield className="w-5 h-5" />
              <span className="text-xs">Sécurité</span>
            </TabsTrigger>
            <TabsTrigger value="backup" className="flex flex-col items-center space-y-1 h-16">
              <Database className="w-5 h-5" />
              <span className="text-xs">Sauvegardes</span>
            </TabsTrigger>
            <TabsTrigger value="integrations" className="flex flex-col items-center space-y-1 h-16">
              <Webhook className="w-5 h-5" />
              <span className="text-xs">Intégrations</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex flex-col items-center space-y-1 h-16">
              <Bell className="w-5 h-5" />
              <span className="text-xs">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex flex-col items-center space-y-1 h-16">
              <FileText className="w-5 h-5" />
              <span className="text-xs">Logs</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex flex-col items-center space-y-1 h-16">
              <BarChart3 className="w-5 h-5" />
              <span className="text-xs">Analytics</span>
            </TabsTrigger>
          </TabsList>

                    {/* Vue d'ensemble */}
          <TabsContent value="overview" className="space-y-6">
            <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                    <Activity className="w-5 h-5 text-green-600" />
                    <span>Tableau de bord système</span>
                    </div>
                      <Button variant="outline" size="sm" onClick={refreshStats} disabled={statsLoading}>
                        {statsLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <RefreshCw className="w-4 h-4" />
                    )}
                    Actualiser
                  </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Users className="w-8 h-8 text-blue-600" />
                      <div>
                        <div className="text-2xl font-bold text-blue-900">{formatNumber(config.stats.activeUsers)}</div>
                        <div className="text-sm text-blue-600">Utilisateurs Actifs</div>
                        </div>
                        </div>
                      </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                        <div className="flex items-center space-x-3">
                      <Building2 className="w-8 h-8 text-green-600" />
                          <div>
                        <div className="text-2xl font-bold text-green-900">{config.stats.organizations}</div>
                        <div className="text-sm text-green-600">Organisations</div>
                          </div>
                        </div>
            </div>

                  <div className="bg-purple-50 p-4 rounded-lg">
                        <div className="flex items-center space-x-3">
                      <Activity className="w-8 h-8 text-purple-600" />
                      <div>
                        <div className="text-2xl font-bold text-purple-900">{formatNumber(config.stats.dailyLogins)}</div>
                        <div className="text-sm text-purple-600">Connexions/Jour</div>
                        </div>
                      </div>
                  </div>

                  <div className="bg-orange-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Server className="w-8 h-8 text-orange-600" />
                    <div>
                        <div className="text-2xl font-bold text-orange-900">{config.stats.uptime}</div>
                        <div className="text-sm text-orange-600">Uptime</div>
                    </div>
                  </div>
                  </div>

                  <div className="bg-red-50 p-4 rounded-lg">
                        <div className="flex items-center space-x-3">
                      <AlertTriangle className="w-8 h-8 text-red-600" />
                          <div>
                        <div className="text-2xl font-bold text-red-900">{config.stats.errors}</div>
                        <div className="text-sm text-red-600">Erreurs</div>
                          </div>
                        </div>
                        </div>
                      </div>

                {/* Métriques système */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Charge système</span>
                      <span>{config.stats.systemLoad}%</span>
                  </div>
                    <Progress value={config.stats.systemLoad} className="h-2" />
                          </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Utilisation disque</span>
                      <span>{config.stats.diskUsage}%</span>
                          </div>
                    <Progress value={config.stats.diskUsage} className="h-2" />
                        </div>
                        <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Mémoire</span>
                      <span>{config.stats.memoryUsage}%</span>
                          </div>
                    <Progress value={config.stats.memoryUsage} className="h-2" />
                        </div>
                    <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Connexions DB</span>
                      <span>{config.stats.dbConnections}</span>
                    </div>
                    <Progress value={config.stats.dbConnections} max={200} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions rapides */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Actions système</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <Button
                      className="w-full"
                    onClick={() => setIsMaintenanceModalOpen(true)}
                    variant={config.maintenanceMode ? "destructive" : "default"}
                  >
                    {config.maintenanceMode ? 'Désactiver' : 'Activer'} la maintenance
                    </Button>
                  <Button variant="outline" className="w-full" onClick={() => setIsBackupModalOpen(true)}>
                    <Database className="w-4 h-4 mr-2" />
                    Lancer une sauvegarde
                        </Button>
                  <Button variant="outline" className="w-full" onClick={() => handleExportData('config')}>
                    <Download className="w-4 h-4 mr-2" />
                    Exporter configuration
                    </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">État du système</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Base de données</span>
                      <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-600">Opérationnelle</span>
                      </div>
                    </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Services externes</span>
                      <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-600">Connectés</span>
                      </div>
                    </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Dernière sauvegarde</span>
                    <span className="text-sm text-gray-600">
                      {config.backup.lastBackup.toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </CardContent>
              </Card>

            <Card>
              <CardHeader>
                  <CardTitle className="text-lg">Activité récente</CardTitle>
              </CardHeader>
                <CardContent className="space-y-3">
                  {config.users.recentActivity.slice(0, 3).map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-3 text-sm">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <span className="font-medium">{activity.user}</span>
                        <span className="text-gray-600"> - {activity.action}</span>
                        </div>
                      </div>
                    ))}
              </CardContent>
            </Card>
            </div>
          </TabsContent>

          {/* Onglet Gestion des Domaines */}
          <TabsContent value="domains" className="space-y-6">
            <AdministrationDomainConfig
              currentDomain={config.domain}
              onDomainConfigured={(domain) => {
                updateConfig({ domain });
                toast.success(`Domaine ${domain} configuré avec succès`);
              }}
            />
          </TabsContent>

          {/* Onglets complètement fonctionnels */}
          <TabsContent value="users" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader><CardTitle>Statistiques</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between"><span>Total</span><span>{formatNumber(config.users.totalUsers)}</span></div>
                  <div className="flex justify-between"><span>Actifs</span><span className="text-green-600">{formatNumber(config.users.activeUsers)}</span></div>
                  <div className="flex justify-between"><span>En attente</span><span className="text-orange-600">{config.users.pendingApprovals}</span></div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle>Actions</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full" onClick={() => handleUserAction('approve_pending')} disabled={config.users.pendingApprovals === 0}>
                    <UserCheck className="w-4 h-4 mr-2" />Approuver ({config.users.pendingApprovals})
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => handleExportData('users')}>
                    <Download className="w-4 h-4 mr-2" />Exporter
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle>Rôles</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  {config.users.roles.map((role) => (
                    <div key={role.role} className="flex justify-between">
                      <span className="capitalize">{role.role.replace('_', ' ')}</span>
                      <Badge variant="secondary">{role.count}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader><CardTitle>Sécurité</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div><h4>2FA</h4><p className="text-sm text-gray-600">Authentification renforcée</p></div>
                  <Switch checked={config.security.twoFactorAuth} onCheckedChange={() => handleToggleSecurity('twoFactorAuth')} />
                </div>
                <div className="flex items-center justify-between">
                  <div><h4>Audit Log</h4><p className="text-sm text-gray-600">Journal des actions</p></div>
                  <Switch checked={config.security.auditLog} onCheckedChange={() => handleToggleSecurity('auditLog')} />
                </div>
                <div>
                  <Label>Chiffrement</Label>
                  <Select value={config.security.encryptionLevel} disabled={!isEditMode}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="high">Élevé</SelectItem>
                      <SelectItem value="military">Militaire</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="backup" className="space-y-6">
            <Card>
              <CardHeader><CardTitle>Sauvegardes</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between"><span>Statut</span><Badge className="bg-green-500">Réussie</Badge></div>
                <div className="flex justify-between"><span>Dernière</span><span>{config.backup.lastBackup.toLocaleDateString('fr-FR')}</span></div>
                <Button className="w-full" onClick={() => setIsBackupModalOpen(true)}>
                  <Database className="w-4 h-4 mr-2" />Lancer sauvegarde
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-6">
            <Card>
              <CardHeader><CardTitle>APIs</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {config.integrations.apis.map((api) => (
                  <div key={api.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div><h4>{api.name}</h4><p className="text-sm text-gray-600">{api.url}</p></div>
                    <div className="flex space-x-2">
                      <Badge variant={api.enabled ? "default" : "secondary"}>{api.enabled ? 'Activé' : 'Désactivé'}</Badge>
                      <Button variant="outline" size="sm" onClick={() => handleToggleAPI(api.id)}>{api.enabled ? 'Désactiver' : 'Activer'}</Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader><CardTitle>Notifications</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <Card><CardHeader><CardTitle>Email</CardTitle></CardHeader><CardContent><Switch checked={config.notifications.email.enabled} /><Button variant="outline" onClick={() => handleTestNotification('email')}>Test</Button></CardContent></Card>
                  <Card><CardHeader><CardTitle>SMS</CardTitle></CardHeader><CardContent><Switch checked={config.notifications.sms.enabled} /><Button variant="outline" onClick={() => handleTestNotification('sms')}>Test</Button></CardContent></Card>
                  <Card><CardHeader><CardTitle>Push</CardTitle></CardHeader><CardContent><Switch checked={config.notifications.push.enabled} /><Button variant="outline" onClick={() => handleTestNotification('push')}>Test</Button></CardContent></Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between">
                  <span>Logs</span>
                  <Button variant="outline" size="sm" onClick={() => handleExportData('logs')}>
                    <Download className="w-4 h-4 mr-2" />Export
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { level: 'info', message: 'Connexion: jean.mbongo@admin.ga', time: '14:32' },
                    { level: 'warning', message: 'Tentative connexion échouée', time: '14:28' },
                    { level: 'error', message: 'Erreur sync API DGDI', time: '14:15' }
                  ].map((log, i) => (
                    <div key={i} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <Badge variant={log.level === 'error' ? 'destructive' : 'default'}>{log.level}</Badge>
                      <span className="flex-1 text-sm">{log.message}</span>
                      <span className="text-xs text-gray-500">{log.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between">
                  <span>Analytics</span>
                  <Button variant="outline" size="sm" onClick={() => handleExportData('analytics')}>
                    <Download className="w-4 h-4 mr-2" />Export
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Utilisation</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between"><span>Connexions</span><span>{formatNumber(config.stats.dailyLogins * 30)}</span></div>
                      <div className="flex justify-between"><span>API calls</span><span>{formatNumber(config.stats.apiCalls)}</span></div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Performance</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between"><span>Uptime</span><span className="text-green-600">{config.stats.uptime}</span></div>
                      <div className="flex justify-between"><span>Erreurs</span><span className="text-red-600">{config.stats.errors}</span></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Actions finales */}
          <div className="flex items-center justify-between pt-6 border-t bg-white p-6 rounded-lg mt-6">
                    <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={() => router.push('/admin-web')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour à l'Admin Web
                      </Button>
                  </div>

                        <div className="flex items-center space-x-3">
              {hasUnsavedChanges && (
                <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200">
                  Modifications en attente
                        </Badge>
              )}

              {isEditMode && (
                <>
                  <Button variant="outline" onClick={handleCancelEdit} disabled={loadingState === 'loading'}>
                          <X className="w-4 h-4 mr-2" />
                          Annuler
                        </Button>
                        <Button
                          onClick={handleSaveConfiguration}
                    disabled={loadingState === 'loading' || !hasUnsavedChanges || Object.keys(errors).length > 0}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          {loadingState === 'loading' ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <Save className="w-4 h-4 mr-2" />
                          )}
                          Sauvegarder
                        </Button>
                </>
              )}

              {!isEditMode && (
                <Button onClick={() => setIsEditMode(true)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Modifier la configuration
                  </Button>
              )}
                </div>
                        </div>
        </Tabs>

        {/* Modals */}
        <Dialog open={isMaintenanceModalOpen} onOpenChange={setIsMaintenanceModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Mode Maintenance</DialogTitle>
              <DialogDescription>
                {config.maintenanceMode
                  ? 'Désactiver le mode maintenance permettra aux utilisateurs d\'accéder à l\'application.'
                  : 'Activer le mode maintenance rendra l\'application temporairement indisponible pour maintenance.'
                }
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsMaintenanceModalOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleMaintenanceMode} disabled={loadingState === 'loading'}>
                {loadingState === 'loading' ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : null}
                {config.maintenanceMode ? 'Désactiver' : 'Activer'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isBackupModalOpen} onOpenChange={setIsBackupModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Sauvegarde manuelle</DialogTitle>
              <DialogDescription>
                Cette action va créer une sauvegarde complète de la base de données.
                L'opération peut prendre plusieurs minutes.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsBackupModalOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleBackupNow} disabled={loadingState === 'loading'}>
                {loadingState === 'loading' ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Database className="w-4 h-4 mr-2" />
                )}
                Lancer la sauvegarde
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
