'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AuthenticatedLayout } from '@/components/layouts/authenticated-layout';
import { toast } from 'sonner';
import {
  Server,
  Database as DatabaseIcon,
  Cpu,
  HardDrive,
  MemoryStick,
  Wifi,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw,
  Download,
  Upload,
  Monitor,
  Shield,
  Lock,
  Unlock,
  Settings,
  BarChart3,
  Zap,
  Globe,
  Users,
  Search,
  Filter,
  Play,
  Pause,
  Square,
  Trash2,
  Edit,
  Eye,
  Bell,
  BellOff,
  X,
  Save,
  Loader2,
  AlertCircle,
  Info,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

// === INTERFACES TYPESCRIPT ===
interface SystemServer {
  id: number;
  name: string;
  status: 'ONLINE' | 'OFFLINE' | 'MAINTENANCE' | 'DEGRADED';
  cpu: number;
  memory: number;
  disk: number;
  uptime: string;
  load: string;
  location: string;
  ip?: string;
  lastUpdate?: string;
}

interface SystemDatabase {
  id: number;
  name: string;
  status: 'ONLINE' | 'OFFLINE' | 'MAINTENANCE';
  size: string;
  connections?: number;
  maxConnections?: number;
  queries?: string;
  hits?: string;
  operations?: string;
  memory?: string;
  backup: string;
  type: 'postgresql' | 'redis' | 'mongodb';
}

interface SystemService {
  id: number;
  name: string;
  status: 'ONLINE' | 'OFFLINE' | 'DEGRADED';
  responseTime: string;
  requests: string;
  port?: number;
  version?: string;
  lastHealthCheck?: string;
}

interface SystemAlert {
  id: number;
  type: 'ERROR' | 'WARNING' | 'INFO';
  message: string;
  timestamp: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  resolved: boolean;
  source?: string;
}

interface LoadingStates {
  refreshing: boolean;
  exporting: boolean;
  configurating: boolean;
  serverAction: string | null;
  databaseAction: string | null;
  serviceAction: string | null;
  alertAction: string | null;
  initialLoad: boolean;
}

interface ErrorStates {
  refresh: string | null;
  export: string | null;
  config: string | null;
  server: string | null;
  database: string | null;
  service: string | null;
  alert: string | null;
  general: string | null;
}

// === DONNÉES INITIALES (SIMULÉES) ===
const generateInitialSystemData = () => ({
  servers: [
    {
      id: 1,
      name: "Web Server 1",
      status: "ONLINE" as const,
      cpu: 45,
      memory: 68,
      disk: 34,
      uptime: "15j 8h 23m",
      load: "1.2",
      location: "Libreville DC1",
      ip: "192.168.1.100",
      lastUpdate: new Date().toISOString()
    },
    {
      id: 2,
      name: "Database Server",
      status: "ONLINE" as const,
      cpu: 23,
      memory: 78,
      disk: 56,
      uptime: "15j 8h 23m",
      load: "0.8",
      location: "Libreville DC1",
      ip: "192.168.1.101",
      lastUpdate: new Date().toISOString()
    },
    {
      id: 3,
      name: "Backup Server",
      status: "MAINTENANCE" as const,
      cpu: 12,
      memory: 34,
      disk: 89,
      uptime: "2h 15m",
      load: "0.3",
      location: "Port-Gentil DC2",
      ip: "192.168.2.100",
      lastUpdate: new Date().toISOString()
    }
  ] as SystemServer[],
  databases: [
    {
      id: 1,
      name: "PostgreSQL Principal",
      status: "ONLINE" as const,
      size: "245 GB",
      connections: 47,
      maxConnections: 100,
      queries: "2,345/min",
      backup: "2024-03-15 02:00",
      type: "postgresql" as const
    },
    {
      id: 2,
      name: "Redis Cache",
      status: "ONLINE" as const,
      size: "8.5 GB",
      memory: "85%",
      hits: "98.5%",
      operations: "15,234/sec",
      backup: "N/A",
      type: "redis" as const
    }
  ] as SystemDatabase[],
  services: [
    { id: 1, name: "API Gateway", status: "ONLINE" as const, responseTime: "45ms", requests: "1,234/min", port: 3000, version: "1.2.3" },
    { id: 2, name: "Authentication", status: "ONLINE" as const, responseTime: "23ms", requests: "567/min", port: 3001, version: "2.1.0" },
    { id: 3, name: "Notification Service", status: "DEGRADED" as const, responseTime: "156ms", requests: "89/min", port: 3002, version: "1.0.5" },
    { id: 4, name: "File Storage", status: "ONLINE" as const, responseTime: "67ms", requests: "234/min", port: 3003, version: "1.1.2" },
    { id: 5, name: "Email Service", status: "OFFLINE" as const, responseTime: "N/A", requests: "0/min", port: 3004, version: "1.0.1" }
  ] as SystemService[],
  alerts: [
    {
      id: 1,
      type: "ERROR" as const,
      message: "Service Email hors ligne depuis 2h",
      timestamp: "2024-03-15 14:30",
      severity: "HIGH" as const,
      resolved: false,
      source: "Email Service"
    },
    {
      id: 2,
      type: "WARNING" as const,
      message: "Utilisation mémoire élevée sur DB Server (78%)",
      timestamp: "2024-03-15 14:15",
      severity: "MEDIUM" as const,
      resolved: false,
      source: "Database Server"
    },
    {
      id: 3,
      type: "INFO" as const,
      message: "Sauvegarde automatique complétée",
      timestamp: "2024-03-15 02:00",
      severity: "LOW" as const,
      resolved: true,
      source: "Backup System"
    }
  ] as SystemAlert[],
  security: {
    threats: 3,
    blockedIPs: 127,
    failedLogins: 45,
    activeFirewallRules: 234,
    lastSecurityScan: "2024-03-15 06:00"
  }
});

export default function SuperAdminSystemePage() {
  // === ÉTATS DE BASE ===
  const [selectedTab, setSelectedTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [systemData, setSystemData] = useState(generateInitialSystemData());

  // === ÉTATS DES MODALES ===
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false);
  const [isServerDialogOpen, setIsServerDialogOpen] = useState(false);
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false);
  const [isDatabaseDialogOpen, setIsDatabaseDialogOpen] = useState(false);
  const [selectedServer, setSelectedServer] = useState<SystemServer | null>(null);
  const [selectedService, setSelectedService] = useState<SystemService | null>(null);
  const [selectedDatabase, setSelectedDatabase] = useState<SystemDatabase | null>(null);

  // === ÉTATS DE CHARGEMENT ET ERREURS ===
  const [loadingStates, setLoadingStates] = useState<LoadingStates>({
    refreshing: false,
    exporting: false,
    configurating: false,
    serverAction: null,
    databaseAction: null,
    serviceAction: null,
    alertAction: null,
    initialLoad: true
  });

  const [errorStates, setErrorStates] = useState<ErrorStates>({
    refresh: null,
    export: null,
    config: null,
    server: null,
    database: null,
    service: null,
    alert: null,
    general: null
  });

  // === CHARGEMENT INITIAL ===
  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoadingStates(prev => ({ ...prev, initialLoad: true }));
        // Simulation d'un appel API initial
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Mise à jour des métriques en temps réel
        const interval = setInterval(() => {
          setSystemData(prev => ({
            ...prev,
            servers: prev.servers.map(server => ({
              ...server,
              cpu: Math.max(0, Math.min(100, server.cpu + (Math.random() - 0.5) * 10)),
              memory: Math.max(0, Math.min(100, server.memory + (Math.random() - 0.5) * 5)),
              lastUpdate: new Date().toISOString()
            })),
            alerts: prev.alerts.map(alert => ({
              ...alert,
              timestamp: new Date().toISOString()
            }))
          }));
        }, 5000);

        setLoadingStates(prev => ({ ...prev, initialLoad: false }));
        toast.success('🚀 Système initialisé avec succès');

        return () => clearInterval(interval);
      } catch (error) {
        setErrorStates(prev => ({ ...prev, general: 'Erreur d\'initialisation du système' }));
        setLoadingStates(prev => ({ ...prev, initialLoad: false }));
        toast.error('❌ Erreur lors de l\'initialisation');
      }
    };

    initializeData();
  }, []);

  // === FONCTIONS UTILITAIRES ===
  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case 'ONLINE': return 'bg-green-500';
      case 'OFFLINE': return 'bg-red-500';
      case 'MAINTENANCE': return 'bg-yellow-500';
      case 'DEGRADED': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  }, []);

  const getStatusIcon = useCallback((status: string) => {
    switch (status) {
      case 'ONLINE': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'OFFLINE': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'MAINTENANCE': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'DEGRADED': return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  }, []);

  const getSeverityColor = useCallback((severity: string) => {
    switch (severity) {
      case 'HIGH': return 'bg-red-500';
      case 'MEDIUM': return 'bg-yellow-500';
      case 'LOW': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  }, []);

  // === CALCULS DE STATISTIQUES ===
  const systemStats = useMemo(() => {
    const onlineServers = systemData.servers.filter(s => s.status === 'ONLINE').length;
    const onlineServices = systemData.services.filter(s => s.status === 'ONLINE').length;
    const onlineDatabases = systemData.databases.filter(d => d.status === 'ONLINE').length;
    const activeAlerts = systemData.alerts.filter(a => !a.resolved).length;

    const avgCpu = Math.round(systemData.servers.reduce((sum, s) => sum + s.cpu, 0) / systemData.servers.length);
    const avgMemory = Math.round(systemData.servers.reduce((sum, s) => sum + s.memory, 0) / systemData.servers.length);
    const avgDisk = Math.round(systemData.servers.reduce((sum, s) => sum + s.disk, 0) / systemData.servers.length);

    return {
      onlineServers,
      onlineServices,
      onlineDatabases,
      activeAlerts,
      totalServers: systemData.servers.length,
      totalServices: systemData.services.length,
      totalDatabases: systemData.databases.length,
      avgCpu,
      avgMemory,
      avgDisk,
      systemHealth: onlineServers === systemData.servers.length && onlineServices === systemData.services.length ? 'Excellent' : 'Attention requise'
    };
  }, [systemData]);

  // === GESTIONNAIRES D'ÉVÉNEMENTS PRINCIPAUX ===

  // Actualisation complète du système
  const handleRefreshData = useCallback(async () => {
    setLoadingStates(prev => ({ ...prev, refreshing: true }));
    setErrorStates(prev => ({ ...prev, refresh: null }));

    try {
      // Simulation d'un appel API de rafraîchissement
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mise à jour avec de nouvelles données simulées
      setSystemData(prev => ({
        ...prev,
        servers: prev.servers.map(server => ({
          ...server,
          cpu: Math.max(0, Math.min(100, Math.random() * 100)),
          memory: Math.max(0, Math.min(100, Math.random() * 100)),
          disk: Math.max(0, Math.min(100, Math.random() * 100)),
          lastUpdate: new Date().toISOString()
        })),
        alerts: prev.alerts.map(alert => ({
          ...alert,
          timestamp: new Date().toISOString()
        }))
      }));

      toast.success('✅ Données système actualisées');
    } catch (error) {
      const errorMsg = 'Erreur lors de l\'actualisation';
      setErrorStates(prev => ({ ...prev, refresh: errorMsg }));
      toast.error(`❌ ${errorMsg}`);
    } finally {
      setLoadingStates(prev => ({ ...prev, refreshing: false }));
    }
  }, []);

  // Export des données système
  const handleExportReport = useCallback(async () => {
    setLoadingStates(prev => ({ ...prev, exporting: true }));
    setErrorStates(prev => ({ ...prev, export: null }));

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const reportData = {
        timestamp: new Date().toISOString(),
        summary: systemStats,
        servers: systemData.servers,
        databases: systemData.databases,
        services: systemData.services,
        alerts: systemData.alerts,
        security: systemData.security
      };

      const dataStr = JSON.stringify(reportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `system-report-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);

      toast.success('📊 Rapport système exporté avec succès');
    } catch (error) {
      const errorMsg = 'Erreur lors de l\'export';
      setErrorStates(prev => ({ ...prev, export: errorMsg }));
      toast.error(`❌ ${errorMsg}`);
    } finally {
      setLoadingStates(prev => ({ ...prev, exporting: false }));
    }
  }, [systemStats, systemData]);

  // Configuration système
  const handleSystemConfiguration = useCallback(async () => {
    setIsConfigDialogOpen(true);
    toast.info('🔧 Ouverture de la configuration système');
  }, []);

  // === GESTIONNAIRES SERVEURS ===

  const handleServerAction = useCallback(async (serverId: number, action: 'start' | 'stop' | 'restart' | 'maintain') => {
    setLoadingStates(prev => ({ ...prev, serverAction: serverId.toString() }));

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      setSystemData(prev => ({
        ...prev,
        servers: prev.servers.map(server =>
          server.id === serverId
            ? {
                ...server,
                status: action === 'stop' ? 'OFFLINE' :
                        action === 'maintain' ? 'MAINTENANCE' : 'ONLINE',
                lastUpdate: new Date().toISOString()
              }
            : server
        )
      }));

      const actionLabels = {
        start: 'démarré',
        stop: 'arrêté',
        restart: 'redémarré',
        maintain: 'mis en maintenance'
      };

      toast.success(`🖥️ Serveur ${actionLabels[action]} avec succès`);
    } catch (error) {
      toast.error('❌ Erreur lors de l\'action sur le serveur');
    } finally {
      setLoadingStates(prev => ({ ...prev, serverAction: null }));
    }
  }, []);

  const handleServerDetails = useCallback((server: SystemServer) => {
    setSelectedServer(server);
    setIsServerDialogOpen(true);
    toast.info(`📋 Affichage des détails de ${server.name}`);
  }, []);

  // === GESTIONNAIRES SERVICES ===

  const handleServiceAction = useCallback(async (serviceId: number, action: 'start' | 'stop' | 'restart') => {
    setLoadingStates(prev => ({ ...prev, serviceAction: serviceId.toString() }));

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      setSystemData(prev => ({
        ...prev,
        services: prev.services.map(service =>
          service.id === serviceId
            ? {
                ...service,
                status: action === 'stop' ? 'OFFLINE' : 'ONLINE',
                lastHealthCheck: new Date().toISOString()
              }
            : service
        )
      }));

      toast.success(`⚙️ Service ${action === 'stop' ? 'arrêté' : action === 'restart' ? 'redémarré' : 'démarré'}`);
    } catch (error) {
      toast.error('❌ Erreur lors de l\'action sur le service');
    } finally {
      setLoadingStates(prev => ({ ...prev, serviceAction: null }));
    }
  }, []);

  const handleServiceDetails = useCallback((service: SystemService) => {
    setSelectedService(service);
    setIsServiceDialogOpen(true);
    toast.info(`📋 Affichage des détails de ${service.name}`);
  }, []);

  // === GESTIONNAIRES BASES DE DONNÉES ===

  const handleDatabaseAction = useCallback(async (databaseId: number, action: 'backup' | 'optimize' | 'restart') => {
    setLoadingStates(prev => ({ ...prev, databaseAction: databaseId.toString() }));

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      setSystemData(prev => ({
        ...prev,
        databases: prev.databases.map(db =>
          db.id === databaseId
            ? {
                ...db,
                backup: action === 'backup' ? new Date().toISOString().replace('T', ' ').slice(0, 16) : db.backup
              }
            : db
        )
      }));

      const actionLabels = {
        backup: 'sauvegardée',
        optimize: 'optimisée',
        restart: 'redémarrée'
      };

      toast.success(`🗄️ Base de données ${actionLabels[action]} avec succès`);
    } catch (error) {
      toast.error('❌ Erreur lors de l\'action sur la base de données');
    } finally {
      setLoadingStates(prev => ({ ...prev, databaseAction: null }));
    }
  }, []);

  const handleDatabaseDetails = useCallback((database: SystemDatabase) => {
    setSelectedDatabase(database);
    setIsDatabaseDialogOpen(true);
    toast.info(`📋 Affichage des détails de ${database.name}`);
  }, []);

  // === GESTIONNAIRES ALERTES ===

  const handleAlertAction = useCallback(async (alertId: number, action: 'resolve' | 'dismiss') => {
    setLoadingStates(prev => ({ ...prev, alertAction: alertId.toString() }));

    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      if (action === 'resolve') {
        setSystemData(prev => ({
          ...prev,
          alerts: prev.alerts.map(alert =>
            alert.id === alertId ? { ...alert, resolved: true } : alert
          )
        }));
        toast.success('✅ Alerte résolue');
      } else {
        setSystemData(prev => ({
          ...prev,
          alerts: prev.alerts.filter(alert => alert.id !== alertId)
        }));
        toast.success('🗑️ Alerte supprimée');
      }
    } catch (error) {
      toast.error('❌ Erreur lors du traitement de l\'alerte');
    } finally {
      setLoadingStates(prev => ({ ...prev, alertAction: null }));
    }
  }, []);

  // === DONNÉES FILTRÉES ===
  const filteredData = useMemo(() => {
    const searchLower = searchTerm.toLowerCase();

    return {
      servers: systemData.servers.filter(server =>
        (statusFilter === 'all' || server.status === statusFilter) &&
        (server.name.toLowerCase().includes(searchLower) ||
         server.location.toLowerCase().includes(searchLower))
      ),
      services: systemData.services.filter(service =>
        (statusFilter === 'all' || service.status === statusFilter) &&
        service.name.toLowerCase().includes(searchLower)
      ),
      databases: systemData.databases.filter(database =>
        (statusFilter === 'all' || database.status === statusFilter) &&
        database.name.toLowerCase().includes(searchLower)
      ),
      alerts: systemData.alerts.filter(alert =>
        alert.message.toLowerCase().includes(searchLower) ||
        (alert.source && alert.source.toLowerCase().includes(searchLower))
      )
    };
  }, [systemData, searchTerm, statusFilter]);

  // === AFFICHAGE DE CHARGEMENT INITIAL ===
  if (loadingStates.initialLoad) {
    return (
      <AuthenticatedLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-500" />
            <div>
              <h3 className="text-lg font-semibold">Initialisation du système</h3>
              <p className="text-muted-foreground">Chargement des métriques et services...</p>
            </div>
          </div>
        </div>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        {/* En-tête avec actions fonctionnelles */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Server className="h-8 w-8 text-blue-500" />
              Système & Monitoring
              {loadingStates.refreshing && <Loader2 className="h-6 w-6 animate-spin text-blue-500" />}
            </h1>
            <p className="text-muted-foreground">
              Surveillance en temps réel • {systemStats.totalServers} serveurs • {systemStats.totalServices} services • {systemStats.activeAlerts} alertes actives
            </p>
            {errorStates.general && (
              <div className="flex items-center gap-2 text-red-600 text-sm mt-1">
                <AlertCircle className="h-4 w-4" />
                {errorStates.general}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleRefreshData}
              disabled={loadingStates.refreshing}
            >
              {loadingStates.refreshing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              Actualiser
            </Button>

            <Button
              variant="outline"
              onClick={handleExportReport}
              disabled={loadingStates.exporting}
            >
              {loadingStates.exporting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              Rapport
            </Button>

            <Button
              onClick={handleSystemConfiguration}
              disabled={loadingStates.configurating}
            >
              {loadingStates.configurating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Settings className="mr-2 h-4 w-4" />
              )}
              Configuration
            </Button>
          </div>
        </div>

        {/* Métriques globales en temps réel */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Server className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Serveurs Actifs</p>
                  <p className="text-2xl font-bold">{systemStats.onlineServers}/{systemStats.totalServers}</p>
                  <p className="text-xs text-muted-foreground">
                    {systemStats.onlineServers === systemStats.totalServers ? (
                      <><TrendingUp className="h-3 w-3 mr-1 text-green-500" /> Tous opérationnels</>
                    ) : (
                      <><TrendingDown className="h-3 w-3 mr-1 text-red-500" /> Attention requise</>
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center">
                <DatabaseIcon className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Bases de Données</p>
                  <p className="text-2xl font-bold">{systemStats.onlineDatabases}/{systemStats.totalDatabases}</p>
                  <p className="text-xs text-muted-foreground">
                    Performance optimale
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Activity className="h-8 w-8 text-purple-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Services Actifs</p>
                  <p className="text-2xl font-bold">{systemStats.onlineServices}/{systemStats.totalServices}</p>
                  <p className="text-xs text-muted-foreground">
                    Réponse moyenne: 45ms
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Shield className="h-8 w-8 text-red-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Alertes Actives</p>
                  <p className="text-2xl font-bold">{systemStats.activeAlerts}</p>
                  <p className="text-xs text-muted-foreground">
                    {systemData.security.threats} menaces détectées
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtres et recherche */}
        <Card>
          <CardHeader>
            <CardTitle>Recherche et Filtres</CardTitle>
            <CardDescription>Filtrer les éléments système par nom et statut</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="🔍 Rechercher serveurs, services, bases de données..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="sm:w-48">
                  <SelectValue placeholder="Filtrer par statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="ONLINE">En ligne</SelectItem>
                  <SelectItem value="OFFLINE">Hors ligne</SelectItem>
                  <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                  <SelectItem value="DEGRADED">Dégradé</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={() => {setSearchTerm(''); setStatusFilter('all');}}>
                <Filter className="mr-2 h-4 w-4" />
                Réinitialiser
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Alertes système avec actions */}
        {filteredData.alerts.filter(a => !a.resolved).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                Alertes Système Actives ({filteredData.alerts.filter(a => !a.resolved).length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredData.alerts.filter(a => !a.resolved).map((alert) => (
                  <div key={alert.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${getSeverityColor(alert.severity)}`} />
                      <div>
                        <p className="font-medium">{alert.message}</p>
                        <p className="text-sm text-muted-foreground">
                          {alert.source} • {alert.timestamp}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={alert.severity === 'HIGH' ? 'destructive' : 'outline'}>
                        {alert.severity}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAlertAction(alert.id, 'resolve')}
                        disabled={loadingStates.alertAction === alert.id.toString()}
                      >
                        {loadingStates.alertAction === alert.id.toString() ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <CheckCircle className="h-3 w-3" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAlertAction(alert.id, 'dismiss')}
                        disabled={loadingStates.alertAction === alert.id.toString()}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Onglets détaillés avec fonctionnalités complètes */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="servers">Serveurs ({filteredData.servers.length})</TabsTrigger>
            <TabsTrigger value="databases">Bases de Données ({filteredData.databases.length})</TabsTrigger>
            <TabsTrigger value="security">Sécurité</TabsTrigger>
          </TabsList>

          {/* Vue d'ensemble améliorée */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Services et APIs</CardTitle>
                  <CardDescription>État des microservices avec actions de contrôle</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredData.services.map((service) => (
                      <div key={service.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(service.status)}
                          <div>
                            <p className="font-medium">{service.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {service.responseTime} • {service.requests} • Port {service.port}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={`text-white ${getStatusColor(service.status)}`}>
                            {service.status}
                          </Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleServiceDetails(service)}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          {service.status === 'OFFLINE' ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleServiceAction(service.id, 'start')}
                              disabled={loadingStates.serviceAction === service.id.toString()}
                            >
                              {loadingStates.serviceAction === service.id.toString() ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <Play className="h-3 w-3" />
                              )}
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleServiceAction(service.id, 'restart')}
                              disabled={loadingStates.serviceAction === service.id.toString()}
                            >
                              {loadingStates.serviceAction === service.id.toString() ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <RefreshCw className="h-3 w-3" />
                              )}
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Métriques de Performance</CardTitle>
                  <CardDescription>Indicateurs temps réel du système</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">CPU Global</span>
                        <span className="text-sm text-muted-foreground">{systemStats.avgCpu}%</span>
                      </div>
                      <Progress value={systemStats.avgCpu} />
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Mémoire Globale</span>
                        <span className="text-sm text-muted-foreground">{systemStats.avgMemory}%</span>
                      </div>
                      <Progress value={systemStats.avgMemory} />
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Stockage Global</span>
                        <span className="text-sm text-muted-foreground">{systemStats.avgDisk}%</span>
                      </div>
                      <Progress value={systemStats.avgDisk} />
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <div className="text-center p-3 bg-blue-50 rounded">
                        <div className="text-2xl font-bold text-blue-600">
                          {systemStats.onlineServers === systemStats.totalServers ? '99.8%' : '95.2%'}
                        </div>
                        <div className="text-xs text-muted-foreground">Disponibilité</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded">
                        <div className="text-2xl font-bold text-green-600">
                          {systemStats.systemHealth === 'Excellent' ? '1.2s' : '2.1s'}
                        </div>
                        <div className="text-xs text-muted-foreground">Temps réponse</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Serveurs avec contrôles complets */}
          <TabsContent value="servers" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredData.servers.map((server) => (
                <Card key={server.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{server.name}</CardTitle>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(server.status)}
                        <Badge className={`text-white ${getStatusColor(server.status)}`}>
                          {server.status}
                        </Badge>
                      </div>
                    </div>
                    <CardDescription>{server.location} • {server.ip}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">CPU</span>
                          <span className="text-sm">{server.cpu}%</span>
                        </div>
                        <Progress value={server.cpu} />
                      </div>

                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Mémoire</span>
                          <span className="text-sm">{server.memory}%</span>
                        </div>
                        <Progress value={server.memory} />
                      </div>

                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Disque</span>
                          <span className="text-sm">{server.disk}%</span>
                        </div>
                        <Progress value={server.disk} />
                      </div>

                      <div className="pt-3 border-t">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">Uptime:</span>
                            <div className="font-medium">{server.uptime}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Load:</span>
                            <div className="font-medium">{server.load}</div>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() => handleServerDetails(server)}
                        >
                          <Monitor className="h-3 w-3 mr-1" />
                          Détails
                        </Button>

                        {server.status === 'OFFLINE' ? (
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            onClick={() => handleServerAction(server.id, 'start')}
                            disabled={loadingStates.serverAction === server.id.toString()}
                          >
                            {loadingStates.serverAction === server.id.toString() ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Play className="h-3 w-3 mr-1" />
                            )}
                            Start
                          </Button>
                        ) : server.status === 'MAINTENANCE' ? (
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            onClick={() => handleServerAction(server.id, 'start')}
                            disabled={loadingStates.serverAction === server.id.toString()}
                          >
                            {loadingStates.serverAction === server.id.toString() ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Play className="h-3 w-3 mr-1" />
                            )}
                            Activer
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            onClick={() => handleServerAction(server.id, 'restart')}
                            disabled={loadingStates.serverAction === server.id.toString()}
                          >
                            {loadingStates.serverAction === server.id.toString() ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <RefreshCw className="h-3 w-3 mr-1" />
                            )}
                            Restart
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Bases de données avec actions */}
          <TabsContent value="databases" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredData.databases.map((db) => (
                <Card key={db.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <DatabaseIcon className="h-5 w-5" />
                        {db.name}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(db.status)}
                        <Badge className={`text-white ${getStatusColor(db.status)}`}>
                          {db.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm text-muted-foreground">Taille</span>
                          <div className="font-medium">{db.size}</div>
                        </div>
                        {db.connections && (
                          <div>
                            <span className="text-sm text-muted-foreground">Connexions</span>
                            <div className="font-medium">{db.connections}/{db.maxConnections}</div>
                          </div>
                        )}
                      </div>

                      {db.connections && db.maxConnections && (
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Utilisation connexions</span>
                            <span className="text-sm">{Math.round((db.connections / db.maxConnections) * 100)}%</span>
                          </div>
                          <Progress value={(db.connections / db.maxConnections) * 100} />
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        {db.queries && (
                          <div>
                            <span className="text-muted-foreground">Requêtes/min:</span>
                            <div className="font-medium">{db.queries}</div>
                          </div>
                        )}
                        {db.hits && (
                          <div>
                            <span className="text-muted-foreground">Hit Rate:</span>
                            <div className="font-medium">{db.hits}</div>
                          </div>
                        )}
                      </div>

                      <div className="pt-3 border-t">
                        <div className="text-sm">
                          <span className="text-muted-foreground">Dernière sauvegarde:</span>
                          <div className="font-medium">{db.backup}</div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() => handleDatabaseDetails(db)}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Détails
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() => handleDatabaseAction(db.id, 'backup')}
                          disabled={loadingStates.databaseAction === db.id.toString()}
                        >
                          {loadingStates.databaseAction === db.id.toString() ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Download className="h-3 w-3 mr-1" />
                          )}
                          Backup
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDatabaseAction(db.id, 'optimize')}
                          disabled={loadingStates.databaseAction === db.id.toString()}
                        >
                          {loadingStates.databaseAction === db.id.toString() ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Zap className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Sécurité avec monitoring avancé */}
          <TabsContent value="security" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <AlertTriangle className="h-8 w-8 text-red-500" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Menaces Actives</p>
                      <p className="text-2xl font-bold">{systemData.security.threats}</p>
                      <div className="flex items-center text-xs text-red-600 mt-1">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +1 depuis hier
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Lock className="h-8 w-8 text-orange-500" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">IPs Bloquées</p>
                      <p className="text-2xl font-bold">{systemData.security.blockedIPs}</p>
                      <div className="flex items-center text-xs text-green-600 mt-1">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +15 dernière heure
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Users className="h-8 w-8 text-yellow-500" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Tentatives Échouées</p>
                      <p className="text-2xl font-bold">{systemData.security.failedLogins}</p>
                      <div className="flex items-center text-xs text-yellow-600 mt-1">
                        <Clock className="h-3 w-3 mr-1" />
                        3 dernières minutes
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Shield className="h-8 w-8 text-green-500" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Règles Firewall</p>
                      <p className="text-2xl font-bold">{systemData.security.activeFirewallRules}</p>
                      <div className="flex items-center text-xs text-green-600 mt-1">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Toutes actives
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Logs de Sécurité en Temps Réel */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Logs de Sécurité en Temps Réel
                </CardTitle>
                <CardDescription>
                  Surveillance continue des événements de sécurité
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {[
                    { time: '14:32:15', type: 'BLOCK', message: 'IP 192.168.45.123 bloquée (tentatives brute force)', severity: 'HIGH', icon: Lock, color: 'text-red-500' },
                    { time: '14:31:45', type: 'AUTH', message: 'Connexion admin réussie depuis Libreville', severity: 'LOW', icon: CheckCircle, color: 'text-green-500' },
                    { time: '14:30:22', type: 'WARN', message: 'Échec authentification utilisateur test@gabon.ga', severity: 'MEDIUM', icon: AlertTriangle, color: 'text-yellow-500' },
                    { time: '14:29:38', type: 'FIREWALL', message: 'Règle firewall 234 activée (port 22 ssh)', severity: 'LOW', icon: Shield, color: 'text-blue-500' },
                    { time: '14:28:55', type: 'SCAN', message: 'Analyse de sécurité automatique terminée', severity: 'LOW', icon: Activity, color: 'text-purple-500' },
                    { time: '14:27:12', type: 'BLOCK', message: 'Tentative accès non autorisé API /admin', severity: 'HIGH', icon: Lock, color: 'text-red-500' },
                    { time: '14:26:33', type: 'UPDATE', message: 'Mise à jour certificat SSL effectuée', severity: 'LOW', icon: CheckCircle, color: 'text-green-500' },
                    { time: '14:25:47', type: 'ALERT', message: 'Détection potentielle intrusion sur serveur 2', severity: 'HIGH', icon: AlertTriangle, color: 'text-red-500' }
                  ].map((log, index) => {
                    const IconComponent = log.icon;
                    return (
                      <div key={index} className="flex items-center gap-3 p-2 text-sm hover:bg-gray-50 rounded">
                        <span className="text-xs text-muted-foreground font-mono w-16">{log.time}</span>
                        <IconComponent className={`h-4 w-4 ${log.color}`} />
                        <span className="flex-1">{log.message}</span>
                        <Badge variant="outline" className={`text-xs ${
                          log.severity === 'HIGH' ? 'bg-red-100 text-red-800' :
                          log.severity === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {log.type}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Statut de Sécurité</CardTitle>
                <CardDescription>
                  Dernière analyse: {systemData.security.lastSecurityScan}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="font-medium">Firewall</p>
                        <p className="text-sm text-muted-foreground">Tous les ports sécurisés</p>
                      </div>
                    </div>
                    <Badge className="bg-green-500 text-white">SÉCURISÉ</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="font-medium">Chiffrement SSL</p>
                        <p className="text-sm text-muted-foreground">Certificats valides</p>
                      </div>
                    </div>
                    <Badge className="bg-green-500 text-white">ACTIF</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                      <div>
                        <p className="font-medium">Mises à jour système</p>
                        <p className="text-sm text-muted-foreground">3 mises à jour disponibles</p>
                      </div>
                    </div>
                    <Badge className="bg-yellow-500 text-white">ATTENTION</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="font-medium">Sauvegarde</p>
                        <p className="text-sm text-muted-foreground">Dernière sauvegarde réussie</p>
                      </div>
                    </div>
                    <Badge className="bg-green-500 text-white">OK</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* === MODALES FONCTIONNELLES === */}

        {/* Modal de configuration système */}
        <Dialog open={isConfigDialogOpen} onOpenChange={setIsConfigDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configuration Système
              </DialogTitle>
              <DialogDescription>
                Paramètres généraux et préférences du système de monitoring
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="refresh-interval">Intervalle d'actualisation</Label>
                  <Select defaultValue="5">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 seconde</SelectItem>
                      <SelectItem value="5">5 secondes</SelectItem>
                      <SelectItem value="10">10 secondes</SelectItem>
                      <SelectItem value="30">30 secondes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="alert-threshold">Seuil d'alerte CPU</Label>
                  <Select defaultValue="80">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="70">70%</SelectItem>
                      <SelectItem value="80">80%</SelectItem>
                      <SelectItem value="90">90%</SelectItem>
                      <SelectItem value="95">95%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="notifications">Notifications</Label>
                <div className="flex items-center space-x-2 mt-2">
                  <input type="checkbox" id="email-alerts" defaultChecked />
                  <Label htmlFor="email-alerts">Alertes par email</Label>
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <input type="checkbox" id="slack-alerts" />
                  <Label htmlFor="slack-alerts">Notifications Slack</Label>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsConfigDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={() => {
                setIsConfigDialogOpen(false);
                toast.success('⚙️ Configuration sauvegardée');
              }}>
                <Save className="mr-2 h-4 w-4" />
                Sauvegarder
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal détails serveur */}
        <Dialog open={isServerDialogOpen} onOpenChange={setIsServerDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                Détails du Serveur: {selectedServer?.name}
              </DialogTitle>
              <DialogDescription>
                Informations complètes et métriques détaillées
              </DialogDescription>
            </DialogHeader>

            {selectedServer && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Informations générales</h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>Nom:</strong> {selectedServer.name}</div>
                      <div><strong>Statut:</strong> {selectedServer.status}</div>
                      <div><strong>Localisation:</strong> {selectedServer.location}</div>
                      <div><strong>Adresse IP:</strong> {selectedServer.ip}</div>
                      <div><strong>Uptime:</strong> {selectedServer.uptime}</div>
                      <div><strong>Load Average:</strong> {selectedServer.load}</div>
                      <div><strong>Dernière MAJ:</strong> {new Date(selectedServer.lastUpdate || '').toLocaleString()}</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Métriques en temps réel</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">CPU</span>
                          <span className="text-sm">{selectedServer.cpu}%</span>
                        </div>
                        <Progress value={selectedServer.cpu} />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Mémoire</span>
                          <span className="text-sm">{selectedServer.memory}%</span>
                        </div>
                        <Progress value={selectedServer.memory} />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Disque</span>
                          <span className="text-sm">{selectedServer.disk}%</span>
                        </div>
                        <Progress value={selectedServer.disk} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsServerDialogOpen(false)}>
                Fermer
              </Button>
              <Button onClick={() => {
                if (selectedServer) {
                  handleServerAction(selectedServer.id, 'restart');
                  setIsServerDialogOpen(false);
                }
              }}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Redémarrer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal détails service */}
        <Dialog open={isServiceDialogOpen} onOpenChange={setIsServiceDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Détails du Service: {selectedService?.name}
              </DialogTitle>
            </DialogHeader>

            {selectedService && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><strong>Statut:</strong> {selectedService.status}</div>
                  <div><strong>Port:</strong> {selectedService.port}</div>
                  <div><strong>Version:</strong> {selectedService.version}</div>
                  <div><strong>Temps de réponse:</strong> {selectedService.responseTime}</div>
                  <div><strong>Requêtes/min:</strong> {selectedService.requests}</div>
                  <div><strong>Dernier check:</strong> {selectedService.lastHealthCheck ? new Date(selectedService.lastHealthCheck).toLocaleString() : 'N/A'}</div>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsServiceDialogOpen(false)}>
                Fermer
              </Button>
              {selectedService && (
                <Button onClick={() => {
                  handleServiceAction(selectedService.id, 'restart');
                  setIsServiceDialogOpen(false);
                }}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Redémarrer Service
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal détails base de données */}
        <Dialog open={isDatabaseDialogOpen} onOpenChange={setIsDatabaseDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <DatabaseIcon className="h-5 w-5" />
                Détails de la Base: {selectedDatabase?.name}
              </DialogTitle>
            </DialogHeader>

            {selectedDatabase && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><strong>Type:</strong> {selectedDatabase.type}</div>
                  <div><strong>Statut:</strong> {selectedDatabase.status}</div>
                  <div><strong>Taille:</strong> {selectedDatabase.size}</div>
                  <div><strong>Dernière sauvegarde:</strong> {selectedDatabase.backup}</div>
                  {selectedDatabase.connections && (
                    <>
                      <div><strong>Connexions:</strong> {selectedDatabase.connections}/{selectedDatabase.maxConnections}</div>
                      <div><strong>Requêtes/min:</strong> {selectedDatabase.queries}</div>
                    </>
                  )}
                  {selectedDatabase.hits && (
                    <div><strong>Hit Rate:</strong> {selectedDatabase.hits}</div>
                  )}
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDatabaseDialogOpen(false)}>
                Fermer
              </Button>
              {selectedDatabase && (
                <Button onClick={() => {
                  handleDatabaseAction(selectedDatabase.id, 'backup');
                  setIsDatabaseDialogOpen(false);
                }}>
                  <Download className="mr-2 h-4 w-4" />
                  Sauvegarder Maintenant
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AuthenticatedLayout>
  );
}
