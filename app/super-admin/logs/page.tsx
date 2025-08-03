'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AuthenticatedLayout } from '@/components/layouts/authenticated-layout';
import { AdvancedLogsViewer } from '@/components/ui/advanced-logs-viewer';
import { toast } from 'sonner';
import {
  Activity,
  Shield,
  AlertTriangle,
  Database as DatabaseIcon,
  Users,
  Search,
  Filter,
  Download,
  RefreshCw,
  Trash2,
  Settings,
  Clock,
  TrendingUp,
  Server,
  Eye,
  FileText,
  Archive
} from 'lucide-react';

interface LogStats {
  total: number;
  errors: number;
  warnings: number;
  info: number;
  security: number;
  audit: number;
}

interface SecurityAlert {
  id: string;
  type: 'failed_login' | 'unauthorized_access' | 'suspicious_activity';
  timestamp: string;
  details: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  resolved: boolean;
}

export default function LogsPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [logStats, setLogStats] = useState<LogStats>({
    total: 0,
    errors: 0,
    warnings: 0,
    info: 0,
    security: 0,
    audit: 0
  });
  const [securityAlerts, setSecurityAlerts] = useState<SecurityAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);

  // Simulation de données pour les logs
  useEffect(() => {
    const loadLogData = async () => {
      setIsLoading(true);

      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));

      setLogStats({
        total: 15420,
        errors: 23,
        warnings: 156,
        info: 14987,
        security: 89,
        audit: 165
      });

      setSecurityAlerts([
        {
          id: '1',
          type: 'failed_login',
          timestamp: new Date().toISOString(),
          details: 'Tentatives de connexion échouées multiples depuis 192.168.1.100',
          severity: 'high',
          resolved: false
        },
        {
          id: '2',
          type: 'unauthorized_access',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          details: 'Tentative d\'accès non autorisé à /admin/users',
          severity: 'medium',
          resolved: true
        },
        {
          id: '3',
          type: 'suspicious_activity',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          details: 'Activité suspecte détectée - requêtes anormalement élevées',
          severity: 'critical',
          resolved: false
        }
      ]);

      setIsLoading(false);
    };

    loadLogData();
  }, [selectedTimeRange]);

  const filteredAlerts = useMemo(() => {
    return securityAlerts.filter(alert =>
      alert.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [securityAlerts, searchTerm]);

  const handleExportLogs = (category: string) => {
    toast.success(`Export des logs ${category} initié`);
  };

  const handleArchiveLogs = () => {
    toast.success('Archivage des anciens logs initié');
    setShowArchiveDialog(false);
  };

  const handleResolveAlert = (alertId: string) => {
    setSecurityAlerts(prev =>
      prev.map(alert =>
        alert.id === alertId ? { ...alert, resolved: true } : alert
      )
    );
    toast.success('Alerte marquée comme résolue');
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'warning';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'failed_login': return Shield;
      case 'unauthorized_access': return AlertTriangle;
      case 'suspicious_activity': return Eye;
      default: return AlertTriangle;
    }
  };

  if (isLoading) {
    return (
      <AuthenticatedLayout>
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="h-8 w-8 animate-spin" />
          </div>
        </div>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout>
      <div className="container mx-auto p-6 space-y-6">
        {/* En-tête */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Logs Système</h1>
            <p className="text-muted-foreground mt-2">
              Surveillance et analyse des logs d'application, sécurité et audit
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">Dernière heure</SelectItem>
                <SelectItem value="24h">Dernières 24h</SelectItem>
                <SelectItem value="7d">7 derniers jours</SelectItem>
                <SelectItem value="30d">30 derniers jours</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => setShowArchiveDialog(true)}>
              <Archive className="h-4 w-4 mr-2" />
              Archiver
            </Button>
          </div>
        </div>

        {/* Statistiques globales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">{logStats.total.toLocaleString()}</p>
                </div>
                <Activity className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Erreurs</p>
                  <p className="text-2xl font-bold text-red-600">{logStats.errors}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Alertes</p>
                  <p className="text-2xl font-bold text-orange-600">{logStats.warnings}</p>
                </div>
                <Shield className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Info</p>
                  <p className="text-2xl font-bold text-green-600">{logStats.info.toLocaleString()}</p>
                </div>
                <FileText className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Sécurité</p>
                  <p className="text-2xl font-bold text-purple-600">{logStats.security}</p>
                </div>
                <Shield className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Audit</p>
                  <p className="text-2xl font-bold text-indigo-600">{logStats.audit}</p>
                </div>
                <Users className="h-8 w-8 text-indigo-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Onglets principaux */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="application">Application</TabsTrigger>
            <TabsTrigger value="security">Sécurité</TabsTrigger>
            <TabsTrigger value="audit">Audit</TabsTrigger>
            <TabsTrigger value="errors">Erreurs</TabsTrigger>
          </TabsList>

          {/* Vue d'ensemble */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Alertes de sécurité récentes */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Alertes de Sécurité Récentes
                  </CardTitle>
                  <CardDescription>
                    Incidents de sécurité nécessitant une attention
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {securityAlerts.slice(0, 5).map((alert) => {
                      const Icon = getAlertIcon(alert.type);
                      return (
                        <div key={alert.id} className="flex items-start gap-3 p-3 border rounded-lg">
                          <Icon className="h-4 w-4 mt-1 text-red-500" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant={getSeverityColor(alert.severity) as any}>
                                {alert.severity}
                              </Badge>
                              {alert.resolved && (
                                <Badge variant="outline" className="text-green-600">
                                  Résolu
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-900 mb-1">{alert.details}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(alert.timestamp).toLocaleString('fr-FR')}
                            </p>
                          </div>
                          {!alert.resolved && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleResolveAlert(alert.id)}
                            >
                              Résoudre
                            </Button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Activité récente */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Tendances des Logs
                  </CardTitle>
                  <CardDescription>
                    Analyse des patterns des dernières 24h
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Erreurs système</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-red-600">+12%</span>
                        <TrendingUp className="h-4 w-4 text-red-500" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Tentatives de connexion</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-green-600">-8%</span>
                        <TrendingUp className="h-4 w-4 text-green-500 rotate-180" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Requêtes API</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-blue-600">+23%</span>
                        <TrendingUp className="h-4 w-4 text-blue-500" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Logs d'application */}
          <TabsContent value="application" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  Logs d'Application
                </CardTitle>
                <CardDescription>
                  Logs système, performances et debug de l'application
                </CardDescription>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExportLogs('application')}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Exporter
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <AdvancedLogsViewer
                  categories={['system', 'api', 'database']}
                  maxEntries={200}
                  refreshInterval={5000}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Logs de sécurité */}
          <TabsContent value="security" className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher dans les alertes de sécurité..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExportLogs('security')}
              >
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Logs de Sécurité
                </CardTitle>
                <CardDescription>
                  Tentatives de connexion, accès non autorisés et activités suspectes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredAlerts.map((alert) => {
                    const Icon = getAlertIcon(alert.type);
                    return (
                      <div key={alert.id} className="flex items-start gap-3 p-4 border rounded-lg hover:bg-gray-50">
                        <Icon className="h-5 w-5 mt-1 text-red-500" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant={getSeverityColor(alert.severity) as any}>
                              {alert.severity}
                            </Badge>
                            <Badge variant="outline">
                              {alert.type.replace('_', ' ')}
                            </Badge>
                            {alert.resolved && (
                              <Badge variant="outline" className="text-green-600">
                                Résolu
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-900 mb-2">{alert.details}</p>
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(alert.timestamp).toLocaleString('fr-FR')}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {!alert.resolved && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleResolveAlert(alert.id)}
                            >
                              Résoudre
                            </Button>
                          )}
                          <Button size="sm" variant="ghost">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Logs d'audit */}
          <TabsContent value="audit" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Logs d'Audit
                </CardTitle>
                <CardDescription>
                  Historique des actions des utilisateurs et modifications système
                </CardDescription>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExportLogs('audit')}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Exporter
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <AdvancedLogsViewer
                  categories={['user']}
                  maxEntries={150}
                  refreshInterval={10000}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Logs d'erreurs */}
          <TabsContent value="errors" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Logs d'Erreurs
                </CardTitle>
                <CardDescription>
                  Erreurs système, exceptions et problèmes de debug
                </CardDescription>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExportLogs('errors')}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Exporter
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <AdvancedLogsViewer
                  categories={['system']}
                  maxEntries={100}
                  refreshInterval={3000}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Dialog d'archivage */}
        <Dialog open={showArchiveDialog} onOpenChange={setShowArchiveDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Archiver les Logs</DialogTitle>
              <DialogDescription>
                Archiver les logs anciens pour libérer de l'espace. Les logs archivés seront déplacés vers le stockage à long terme.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Archiver les logs plus anciens que :</label>
                <Select defaultValue="30d">
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">7 jours</SelectItem>
                    <SelectItem value="30d">30 jours</SelectItem>
                    <SelectItem value="90d">90 jours</SelectItem>
                    <SelectItem value="180d">180 jours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowArchiveDialog(false)}>
                Annuler
              </Button>
              <Button onClick={handleArchiveLogs}>
                Archiver
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AuthenticatedLayout>
  );
}
