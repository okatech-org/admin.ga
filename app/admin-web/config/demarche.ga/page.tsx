'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  ArrowLeft,
  Settings,
  FileText,
  Users,
  Shield,
  Loader2,
  Globe,
  Monitor,
  RefreshCw,
  Bell,
  BarChart3,
  Activity,
  Database,
  Key,
  UserCheck,
  Award,
  Server,
  FileSearch,
  CheckCircle,
  AlertTriangle,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

// Types pour l'administration super admin
type LoadingState = 'idle' | 'loading' | 'success' | 'error';
type UserRole = 'super_admin' | 'admin' | 'moderator' | 'agent' | 'citizen';

interface SuperAdmin {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  role: UserRole;
  permissions: string[];
  last_login: Date;
  created_at: Date;
  is_active: boolean;
}

interface SystemUser {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  role: UserRole;
  status: 'active' | 'inactive' | 'suspended';
  last_login: Date;
  demandes_count: number;
  created_at: Date;
}

interface SystemStats {
  total_users: number;
  active_users: number;
  total_services: number;
  active_services: number;
  total_demandes: number;
  demandes_en_cours: number;
  demandes_completees: number;
  satisfaction_moyenne: number;
  uptime: number;
  avg_processing_time: number;
  server_load: number;
  storage_used: number;
  bandwidth_used: number;
}

interface DemarcheConfig {
  enabled: boolean;
  name: string;
  subtitle: string;
  domain: string;
  maintenanceMode: boolean;
  primaryColor: string;
}

export default function DemarcheGAConfigPage() {
  const router = useRouter();

  // États principaux
  const [activeTab, setActiveTab] = useState('overview');
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [statsLoading, setStatsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // États des modaux
  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);

  // Configuration DEMARCHE.GA
  const [config, setConfig] = useState<DemarcheConfig>({
    enabled: true,
    name: 'DEMARCHE.GA',
    subtitle: 'Portail des démarches administratives du Gabon',
    domain: 'demarche.ga',
    maintenanceMode: false,
    primaryColor: '#2563eb'
  });

  // États pour la gestion des domaines
  const [domains, setDomains] = useState<any[]>([]);
  const [domainsLoading, setDomainsLoading] = useState(false);
  const [isDomainModalOpen, setIsDomainModalOpen] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<any>(null);
  const [domainFormData, setDomainFormData] = useState({
    domain: '',
    subdomain: '',
    organizationId: '',
    primaryColor: '#2563eb',
    title: '',
    description: '',
    enableRegistration: true,
    enableAPIAccess: true,
  });

  // Données système simulées avec super admin
  const [systemStats] = useState<SystemStats>({
    total_users: 45280,
    active_users: 3240,
    total_services: 127,
    active_services: 125,
    total_demandes: 156840,
    demandes_en_cours: 2847,
    demandes_completees: 148956,
    satisfaction_moyenne: 4.7,
    uptime: 99.8,
    avg_processing_time: 8.5,
    server_load: 42,
    storage_used: 68,
    bandwidth_used: 34
  });

  const [superAdmin] = useState<SuperAdmin>({
    id: '1',
    nom: 'ADMINISTRATION',
    prenom: 'Super',
    email: 'superadmin@demarche.ga',
    telephone: '+241 01 23 45 67',
    role: 'super_admin',
    permissions: ['all'],
    last_login: new Date(),
    created_at: new Date('2024-01-01'),
    is_active: true
  });

  const [recentUsers] = useState<SystemUser[]>([
    {
      id: '1',
      nom: 'MVENG',
      prenom: 'Jean Pierre',
      email: 'jean.mveng@example.com',
      telephone: '+241 06 12 34 56',
      role: 'citizen',
      status: 'active',
      last_login: new Date(Date.now() - 3600000),
      demandes_count: 3,
      created_at: new Date(Date.now() - 86400000 * 30)
    },
    {
      id: '2',
      nom: 'NZAMBA',
      prenom: 'Marie Claire',
      email: 'marie.nzamba@example.com',
      telephone: '+241 07 23 45 67',
      role: 'citizen',
      status: 'active',
      last_login: new Date(Date.now() - 7200000),
      demandes_count: 1,
      created_at: new Date(Date.now() - 86400000 * 15)
    },
    {
      id: '3',
      nom: 'OBAME',
      prenom: 'Paul',
      email: 'paul.obame@dgdi.ga',
      telephone: '+241 05 34 56 78',
      role: 'agent',
      status: 'active',
      last_login: new Date(Date.now() - 1800000),
      demandes_count: 0,
      created_at: new Date(Date.now() - 86400000 * 90)
    }
  ]);

  // Utilitaires
  const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': case 'completed': case 'success':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'pending': case 'in_progress': case 'warning':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'inactive': case 'error': case 'rejected':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'maintenance': case 'info':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  // Gestionnaires d'événements pour super admin
  const refreshStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLastUpdate(new Date());
      toast.success('Statistiques actualisées');
    } catch (error) {
      toast.error('Erreur lors de l\'actualisation');
    } finally {
      setStatsLoading(false);
    }
  }, []);

  const handleToggleMaintenanceMode = async () => {
    setLoadingState('loading');
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Mode maintenance modifié');
      setIsMaintenanceModalOpen(false);
    } catch (error) {
      toast.error('Erreur lors du changement de mode');
    } finally {
      setLoadingState('idle');
    }
  };

  const handleBackupSystem = async () => {
    setLoadingState('loading');
    try {
      await new Promise(resolve => setTimeout(resolve, 5000));
      toast.success('Sauvegarde système complétée avec succès');
      setIsBackupModalOpen(false);
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setLoadingState('idle');
    }
  };

  // Gestionnaires pour la gestion des domaines
  const loadDomains = async () => {
    setDomainsLoading(true);
    try {
      const response = await fetch('/api/domains');
      if (response.ok) {
        const data = await response.json();
        setDomains(data.domains || []);
      } else {
        toast.error('Erreur lors du chargement des domaines');
      }
    } catch (error) {
      toast.error('Erreur de connexion');
    } finally {
      setDomainsLoading(false);
    }
  };

  const handleCreateDomain = async () => {
    if (!domainFormData.domain || !domainFormData.title || !domainFormData.description) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setLoadingState('loading');
    try {
      const response = await fetch('/api/domains', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          domain: domainFormData.domain,
          subdomain: domainFormData.subdomain || undefined,
          organizationId: domainFormData.organizationId || undefined,
          customization: {
            primaryColor: domainFormData.primaryColor,
            title: domainFormData.title,
            description: domainFormData.description,
          },
          features: {
            enableRegistration: domainFormData.enableRegistration,
            enableAPIAccess: domainFormData.enableAPIAccess,
            multipleLanguages: false,
            enabledLanguages: ['fr'],
            maintenanceMode: false,
            enableGuestAccess: false,
          },
          isActive: true,
          isMainDomain: false,
        }),
      });

      if (response.ok) {
        toast.success('Domaine créé avec succès');
        setIsDomainModalOpen(false);
        setDomainFormData({
          domain: '',
          subdomain: '',
          organizationId: '',
          primaryColor: '#2563eb',
          title: '',
          description: '',
          enableRegistration: true,
          enableAPIAccess: true,
        });
        loadDomains();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Erreur lors de la création');
      }
    } catch (error) {
      toast.error('Erreur de connexion');
    } finally {
      setLoadingState('idle');
    }
  };

  const handleDeleteDomain = async (domain: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce domaine ?')) {
      return;
    }

    try {
      const response = await fetch(`/api/domains/${encodeURIComponent(domain)}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Domaine supprimé avec succès');
        loadDomains();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Erreur lors de la suppression');
      }
    } catch (error) {
      toast.error('Erreur de connexion');
    }
  };

  const handleToggleDomainStatus = async (domain: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/domains/${encodeURIComponent(domain)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive }),
      });

      if (response.ok) {
        toast.success(`Domaine ${!isActive ? 'activé' : 'désactivé'} avec succès`);
        loadDomains();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Erreur lors de la modification');
      }
    } catch (error) {
      toast.error('Erreur de connexion');
    }
  };

  // Simulation de mise à jour des stats en temps réel
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Charger les domaines au montage du composant
  useEffect(() => {
    loadDomains();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Super Admin */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                asChild
                className="border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                <Link href="/super-admin">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Super Admin
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                asChild
                className="border-gray-300"
              >
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
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Administration DEMARCHE.GA</h1>
                  <p className="text-sm text-gray-600">Super Admin - {superAdmin.prenom} {superAdmin.nom}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={`${getStatusColor(config.enabled ? 'active' : 'inactive')} border`}>
                {config.enabled ? 'Actif' : 'Inactif'}
              </Badge>
              {config.maintenanceMode && (
                <Badge variant="destructive">
                  Mode Maintenance
                </Badge>
              )}
              <Button variant="outline" size="sm" onClick={refreshStats} disabled={statsLoading}>
                {statsLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal avec onglets Super Admin */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Navigation des onglets */}
          <TabsList className="grid grid-cols-4 lg:grid-cols-9 gap-2 h-auto p-2 bg-transparent">
            <TabsTrigger value="overview" className="flex flex-col items-center space-y-1 h-16">
              <Monitor className="w-5 h-5" />
              <span className="text-xs">Vue d'ensemble</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex flex-col items-center space-y-1 h-16">
              <Users className="w-5 h-5" />
              <span className="text-xs">Utilisateurs</span>
            </TabsTrigger>
            <TabsTrigger value="services" className="flex flex-col items-center space-y-1 h-16">
              <FileText className="w-5 h-5" />
              <span className="text-xs">Services</span>
            </TabsTrigger>
            <TabsTrigger value="demandes" className="flex flex-col items-center space-y-1 h-16">
              <Activity className="w-5 h-5" />
              <span className="text-xs">Demandes</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex flex-col items-center space-y-1 h-16">
              <Shield className="w-5 h-5" />
              <span className="text-xs">Sécurité</span>
            </TabsTrigger>
            <TabsTrigger value="configuration" className="flex flex-col items-center space-y-1 h-16">
              <Settings className="w-5 h-5" />
              <span className="text-xs">Configuration</span>
            </TabsTrigger>
            <TabsTrigger value="domains" className="flex flex-col items-center space-y-1 h-16">
              <Globe className="w-5 h-5" />
              <span className="text-xs">Domaines</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex flex-col items-center space-y-1 h-16">
              <BarChart3 className="w-5 h-5" />
              <span className="text-xs">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="system" className="flex flex-col items-center space-y-1 h-16">
              <Server className="w-5 h-5" />
              <span className="text-xs">Système</span>
            </TabsTrigger>
          </TabsList>

          {/* Vue d'ensemble Super Admin */}
          <TabsContent value="overview" className="space-y-6">
            {/* Header avec informations super admin */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Shield className="w-5 h-5 text-blue-600" />
                      <span>Tableau de bord Super Admin</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      Dernière mise à jour: {lastUpdate.toLocaleTimeString('fr-FR')}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Uptime système</span>
                        <span className="text-sm font-medium">{systemStats.uptime}%</span>
                      </div>
                      <Progress value={systemStats.uptime} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Charge serveur</span>
                        <span className="text-sm font-medium">{systemStats.server_load}%</span>
                      </div>
                      <Progress value={systemStats.server_load} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Stockage utilisé</span>
                        <span className="text-sm font-medium">{systemStats.storage_used}%</span>
                      </div>
                      <Progress value={systemStats.storage_used} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Bande passante</span>
                        <span className="text-sm font-medium">{systemStats.bandwidth_used}%</span>
                      </div>
                      <Progress value={systemStats.bandwidth_used} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Key className="w-5 h-5" />
                    <span>Actions Super Admin</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => setIsMaintenanceModalOpen(true)}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Mode maintenance
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => setIsBackupModalOpen(true)}
                  >
                    <Database className="w-4 h-4 mr-2" />
                    Sauvegarde système
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => router.push('/admin-web/config/demarche.ga/logs')}
                  >
                    <FileSearch className="w-4 h-4 mr-2" />
                    Journaux système
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => router.push('/admin-web/config/demarche.ga/configuration')}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Configuration globale
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Métriques principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600 mb-1">Utilisateurs Actifs</p>
                      <p className="text-3xl font-bold text-blue-900">
                        {formatNumber(systemStats.active_users)}
                      </p>
                      <p className="text-xs text-blue-600 mt-1">
                        sur {formatNumber(systemStats.total_users)} inscrits
                      </p>
                    </div>
                    <Users className="w-12 h-12 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-600 mb-1">Services Actifs</p>
                      <p className="text-3xl font-bold text-green-900">
                        {systemStats.active_services}
                      </p>
                      <p className="text-xs text-green-600 mt-1">
                        sur {systemStats.total_services} total
                      </p>
                    </div>
                    <FileText className="w-12 h-12 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-600 mb-1">Demandes en Cours</p>
                      <p className="text-3xl font-bold text-purple-900">
                        {formatNumber(systemStats.demandes_en_cours)}
                      </p>
                      <p className="text-xs text-purple-600 mt-1">
                        {Math.floor(Math.random() * 50)} nouvelles aujourd'hui
                      </p>
                    </div>
                    <Activity className="w-12 h-12 text-purple-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-orange-600 mb-1">Satisfaction</p>
                      <p className="text-3xl font-bold text-orange-900">
                        {systemStats.satisfaction_moyenne}/5
                      </p>
                      <p className="text-xs text-orange-600 mt-1">
                        +{(Math.random() * 0.2).toFixed(1)} ce mois
                      </p>
                    </div>
                    <Award className="w-12 h-12 text-orange-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Activité récente */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <UserCheck className="w-5 h-5" />
                    <span>Utilisateurs Récents</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentUsers.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <Users className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {user.prenom} {user.nom}
                            </p>
                            <p className="text-xs text-gray-600">{user.email}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {user.role === 'citizen' ? 'Citoyen' :
                                 user.role === 'agent' ? 'Agent' : 'Admin'}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {user.demandes_count} demandes
                              </span>
                            </div>
                          </div>
                        </div>
                        <Badge className={`text-xs ${getStatusColor(user.status)}`}>
                          {user.status === 'active' ? 'Actif' : 'Inactif'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bell className="w-5 h-5" />
                    <span>Alertes Système</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3 p-3 border rounded-lg">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Système opérationnel</p>
                        <p className="text-xs text-gray-600">Tous les services fonctionnent normalement</p>
                        <p className="text-xs text-gray-500">Il y a 2 minutes</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 border rounded-lg">
                      <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Sauvegarde programmée</p>
                        <p className="text-xs text-gray-600">Sauvegarde automatique dans 2h</p>
                        <p className="text-xs text-gray-500">Il y a 15 minutes</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 border rounded-lg">
                      <Activity className="w-4 h-4 text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Mise à jour disponible</p>
                        <p className="text-xs text-gray-600">Version 2.1.1 disponible</p>
                        <p className="text-xs text-gray-500">Il y a 1 heure</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Gestion des utilisateurs */}
          <TabsContent value="users" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Gestion des Utilisateurs</h2>
                <p className="text-gray-600">Gérez tous les utilisateurs de la plateforme DEMARCHE.GA</p>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline">
                  <FileText className="w-4 h-4 mr-2" />
                  Exporter
                </Button>
                <Button>
                  <Users className="w-4 h-4 mr-2" />
                  Nouvel utilisateur
                </Button>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Liste des Utilisateurs</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Utilisateur</TableHead>
                      <TableHead>Rôle</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Demandes</TableHead>
                      <TableHead>Dernière connexion</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{user.prenom} {user.nom}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {user.role === 'citizen' ? 'Citoyen' :
                             user.role === 'agent' ? 'Agent' : 'Admin'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(user.status)}>
                            {user.status === 'active' ? 'Actif' : 'Inactif'}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.demandes_count}</TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {user.last_login.toLocaleDateString('fr-FR')}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-600">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Autres onglets peuvent être développés selon les besoins */}
          <TabsContent value="services" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des Services</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Interface de gestion des services DEMARCHE.GA</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sécurité du Système</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Configuration de sécurité avancée</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Gestion des domaines */}
          <TabsContent value="domains" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Gestion des Domaines</h2>
                <p className="text-gray-600">Configurez et gérez les domaines pour DEMARCHE.GA</p>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={loadDomains} disabled={domainsLoading}>
                  {domainsLoading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4 mr-2" />
                  )}
                  Actualiser
                </Button>
                <Button onClick={() => setIsDomainModalOpen(true)}>
                  <Globe className="w-4 h-4 mr-2" />
                  Nouveau domaine
                </Button>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Domaines Configurés</CardTitle>
              </CardHeader>
              <CardContent>
                {domainsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                  </div>
                ) : domains.length === 0 ? (
                  <div className="text-center py-8">
                    <Globe className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Aucun domaine configuré</p>
                    <Button
                      className="mt-4"
                      onClick={() => setIsDomainModalOpen(true)}
                    >
                      Créer le premier domaine
                    </Button>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Domaine</TableHead>
                        <TableHead>Organisation</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>SSL</TableHead>
                        <TableHead>Dernière modification</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {domains.map((domain) => (
                        <TableRow key={domain.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{domain.domain}</div>
                              <div className="text-sm text-gray-500">{domain.customization?.title}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {domain.organizationName ? (
                              <Badge variant="outline">{domain.organizationName}</Badge>
                            ) : (
                              <span className="text-gray-400">Système</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(domain.isActive ? 'active' : 'inactive')}>
                              {domain.isActive ? 'Actif' : 'Inactif'}
                            </Badge>
                            {domain.isMainDomain && (
                              <Badge variant="secondary" className="ml-2">Principal</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(domain.ssl?.enabled ? 'success' : 'warning')}>
                              {domain.ssl?.enabled ? 'Activé' : 'Désactivé'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-gray-500">
                            {new Date(domain.updatedAt).toLocaleDateString('fr-FR')}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-1">
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleToggleDomainStatus(domain.domain, domain.isActive)}
                              >
                                {domain.isActive ? (
                                  <AlertTriangle className="w-4 h-4 text-orange-600" />
                                ) : (
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                )}
                              </Button>
                              {!domain.isMainDomain && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-600"
                                  onClick={() => handleDeleteDomain(domain.domain)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modaux Super Admin */}
      {/* Modal de maintenance */}
      <Dialog open={isMaintenanceModalOpen} onOpenChange={setIsMaintenanceModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mode Maintenance</DialogTitle>
            <DialogDescription>
              {config.maintenanceMode
                ? 'Désactiver le mode maintenance permettra aux utilisateurs d\'accéder à nouveau à la plateforme.'
                : 'Activer le mode maintenance rendra la plateforme inaccessible aux utilisateurs.'
              }
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsMaintenanceModalOpen(false)}>
              Annuler
            </Button>
            <Button
              onClick={handleToggleMaintenanceMode}
              disabled={loadingState === 'loading'}
              variant={config.maintenanceMode ? 'default' : 'destructive'}
            >
              {loadingState === 'loading' ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              {config.maintenanceMode ? 'Désactiver' : 'Activer'} la maintenance
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de sauvegarde */}
      <Dialog open={isBackupModalOpen} onOpenChange={setIsBackupModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sauvegarde Système</DialogTitle>
            <DialogDescription>
              Créer une sauvegarde complète du système incluant la base de données, les fichiers et la configuration.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBackupModalOpen(false)}>
              Annuler
            </Button>
            <Button
              onClick={handleBackupSystem}
              disabled={loadingState === 'loading'}
            >
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

      {/* Modal de création/modification de domaine */}
      <Dialog open={isDomainModalOpen} onOpenChange={setIsDomainModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedDomain ? 'Modifier le domaine' : 'Nouveau domaine'}
            </DialogTitle>
            <DialogDescription>
              Configurez les paramètres du domaine pour DEMARCHE.GA
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Domaine principal *</label>
                <Input
                  placeholder="exemple.ga"
                  value={domainFormData.domain}
                  onChange={(e) => setDomainFormData(prev => ({ ...prev, domain: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Sous-domaine</label>
                <Input
                  placeholder="organisme"
                  value={domainFormData.subdomain}
                  onChange={(e) => setDomainFormData(prev => ({ ...prev, subdomain: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Titre du site *</label>
              <Input
                placeholder="Nom du portail"
                value={domainFormData.title}
                onChange={(e) => setDomainFormData(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description *</label>
              <Input
                placeholder="Description du portail"
                value={domainFormData.description}
                onChange={(e) => setDomainFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Couleur principale</label>
                <Input
                  type="color"
                  value={domainFormData.primaryColor}
                  onChange={(e) => setDomainFormData(prev => ({ ...prev, primaryColor: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">ID Organisation</label>
                <Input
                  placeholder="Optionnel"
                  value={domainFormData.organizationId}
                  onChange={(e) => setDomainFormData(prev => ({ ...prev, organizationId: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium">Options</label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="enableRegistration"
                    checked={domainFormData.enableRegistration}
                    onChange={(e) => setDomainFormData(prev => ({ ...prev, enableRegistration: e.target.checked }))}
                    className="rounded"
                  />
                  <label htmlFor="enableRegistration" className="text-sm">
                    Autoriser l'inscription
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="enableAPIAccess"
                    checked={domainFormData.enableAPIAccess}
                    onChange={(e) => setDomainFormData(prev => ({ ...prev, enableAPIAccess: e.target.checked }))}
                    className="rounded"
                  />
                  <label htmlFor="enableAPIAccess" className="text-sm">
                    Accès API activé
                  </label>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDomainModalOpen(false)}>
              Annuler
            </Button>
            <Button
              onClick={handleCreateDomain}
              disabled={loadingState === 'loading'}
            >
              {loadingState === 'loading' ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              {selectedDomain ? 'Modifier' : 'Créer'} le domaine
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
