'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AuthenticatedLayout } from '@/components/layouts/authenticated-layout';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { PageHeader } from '@/components/ui/page-header';
import { StatCard } from '@/components/ui/stat-card';
import ErrorBoundary from '@/components/ui/error-boundary';
import { toast } from 'sonner';
import {
  BarChart3,
  PieChart,
  TrendingUp,
  TrendingDown,
  Activity,
  Building2,
  Users,
  Zap,
  MessageSquare,
  Clock,
  Calendar,
  Download,
  RefreshCw,
  Filter,
  Eye,
  Target,
  Globe,
  Database as DatabaseIcon,
  Server,
  Monitor,
  Cpu,
  HardDrive,
  Wifi,
  CheckCircle,
  AlertCircle,
  XCircle,
  Loader2,
  Settings,
  AlertTriangle
} from 'lucide-react';

interface AnalyticsData {
  utilisationOrganismes: Array<{
    name: string;
    type: string;
    utilisateurs: number;
    services: number;
    activite: number;
    dernierAcces: string;
    statut: 'actif' | 'inactif' | 'maintenance';
  }>;
  metriquesPerformance: {
    tempsReponse: Array<{
      heure: string;
      temps: number;
    }>;
    requetesParHeure: Array<{
      heure: string;
      requetes: number;
    }>;
    erreursParJour: Array<{
      jour: string;
      erreurs: number;
    }>;
  };
  statistiquesUtilisateurs: {
    connexionsParJour: Array<{
      jour: string;
      connexions: number;
    }>;
    repartitionRoles: Array<{
      role: string;
      count: number;
      percentage: number;
    }>;
    activiteParOrganisme: Array<{
      organisme: string;
      actifs: number;
      total: number;
    }>;
  };
  systemHealth: {
    cpu: number;
    memory: number;
    disk: number;
    network: number;
    database: number;
    services: Array<{
      name: string;
      status: 'operational' | 'degraded' | 'outage';
      responseTime: number;
    }>;
  };
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [realUserData, setRealUserData] = useState<any>(null);
  const [periodeSelectionnee, setPeriodeSelectionnee] = useState('7j');
  const [typeMetrique, setTypeMetrique] = useState('all');
  const [selectedOrganisme, setSelectedOrganisme] = useState<any>(null);
  const [isOrganismeModalOpen, setIsOrganismeModalOpen] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadAnalyticsData();

    // Mise à jour automatique toutes les 30 secondes
    const interval = setInterval(() => {
      loadAnalyticsData();
    }, 30000);

    setRefreshInterval(interval);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [periodeSelectionnee, typeMetrique]);

  useEffect(() => {
    return () => {
      if (refreshInterval) clearInterval(refreshInterval);
    };
  }, [refreshInterval]);

  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      // Simuler des données d'analytics
      const analyticsSimulees: AnalyticsData = {
        utilisationOrganismes: [
          {
            name: 'Ministère de l\'Économie',
            type: 'Ministère',
            utilisateurs: 45,
            services: 12,
            activite: 95,
            dernierAcces: '2025-01-15T14:30:00Z',
            statut: 'actif'
          },
          {
            name: 'Direction Générale des Impôts',
            type: 'Direction',
            utilisateurs: 38,
            services: 8,
            activite: 87,
            dernierAcces: '2025-01-15T13:45:00Z',
            statut: 'actif'
          },
          {
            name: 'Présidence de la République',
            type: 'Institution',
            utilisateurs: 15,
            services: 5,
            activite: 92,
            dernierAcces: '2025-01-15T12:20:00Z',
            statut: 'actif'
          },
          {
            name: 'Ministère de la Justice',
            type: 'Ministère',
            utilisateurs: 32,
            services: 10,
            activite: 78,
            dernierAcces: '2025-01-15T11:15:00Z',
            statut: 'actif'
          },
          {
            name: 'Agence Spécialisée 15',
            type: 'Agence',
            utilisateurs: 8,
            services: 3,
            activite: 23,
            dernierAcces: '2025-01-14T16:30:00Z',
            statut: 'inactif'
          }
        ],
        metriquesPerformance: {
          tempsReponse: Array.from({ length: 24 }, (_, i) => ({
            heure: `${i.toString().padStart(2, '0')}:00`,
            temps: Math.floor(Math.random() * 500) + 100
          })),
          requetesParHeure: Array.from({ length: 24 }, (_, i) => ({
            heure: `${i.toString().padStart(2, '0')}:00`,
            requetes: Math.floor(Math.random() * 1000) + 200
          })),
          erreursParJour: Array.from({ length: 7 }, (_, i) => ({
            jour: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'][i],
            erreurs: Math.floor(Math.random() * 50) + 5
          }))
        },
        statistiquesUtilisateurs: {
          connexionsParJour: Array.from({ length: 7 }, (_, i) => ({
            jour: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'][i],
            connexions: Math.floor(Math.random() * 300) + 100
          })),
          repartitionRoles: [
            { role: 'ADMIN', count: 333, percentage: 34.0 },
            { role: 'AGENT', count: 331, percentage: 33.8 },
            { role: 'COLLABORATEUR', count: 307, percentage: 31.4 },
            { role: 'USER', count: 8, percentage: 0.8 }
          ],
          activiteParOrganisme: [
            { organisme: 'MIN_ECONOMIE', actifs: 42, total: 45 },
            { organisme: 'DGI', actifs: 35, total: 38 },
            { organisme: 'PRESIDENCE', actifs: 14, total: 15 },
            { organisme: 'MIN_JUSTICE', actifs: 28, total: 32 },
            { organisme: 'MIN_INTERIEUR', actifs: 25, total: 30 }
          ]
        },
        systemHealth: {
          cpu: 68.5,
          memory: 72.3,
          disk: 45.8,
          network: 89.2,
          database: 91.7,
          services: [
            { name: 'API Gateway', status: 'operational', responseTime: 145 },
            { name: 'Authentication', status: 'operational', responseTime: 98 },
            { name: 'Database', status: 'operational', responseTime: 234 },
            { name: 'File Storage', status: 'degraded', responseTime: 456 },
            { name: 'Communication Hub', status: 'operational', responseTime: 178 }
          ]
        }
      };

      setData(analyticsSimulees);
    } catch (error) {
      console.error('Erreur lors du chargement des analytics:', error);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const getStatutColor = (statut: string) => {
    const colors = {
      actif: 'bg-green-100 text-green-800',
      inactif: 'bg-gray-100 text-gray-800',
      maintenance: 'bg-orange-100 text-orange-800'
    };
    return colors[statut] || colors.inactif;
  };

  const getServiceStatusIcon = (status: string) => {
    const icons = {
      operational: CheckCircle,
      degraded: AlertCircle,
      outage: XCircle
    };
    return icons[status] || CheckCircle;
  };

  const getServiceStatusColor = (status: string) => {
    const colors = {
      operational: 'text-green-600',
      degraded: 'text-orange-600',
      outage: 'text-red-600'
    };
    return colors[status] || colors.operational;
  };

  const formatPercentage = (value: number) => {
    const percentage = Math.round(value);
    let color = 'text-green-600';
    if (percentage > 80) color = 'text-red-600';
    else if (percentage > 60) color = 'text-orange-600';

    return <span className={color}>{percentage}%</span>;
  };

  const exportData = () => {
    const exportData = {
      periode: periodeSelectionnee,
      timestamp: new Date().toISOString(),
      ...data
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast.success('📊 Données analytics exportées avec succès');
  };

  const handleViewOrganismeDetails = (organisme: any) => {
    setSelectedOrganisme(organisme);
    setIsOrganismeModalOpen(true);
    toast.info(`📋 Affichage des détails de ${organisme.name}`);
  };

  const handleServiceAction = (serviceName: string, action: string) => {
    toast.info(`⚙️ Action "${action}" sur le service ${serviceName}`);
    // Ici on pourrait implémenter des actions réelles sur les services
  };

  if (loading) {
    return (
      <AuthenticatedLayout>
        <LoadingSpinner
          size="lg"
          message="Chargement des analytics en temps réel..."
          className="min-h-[400px]"
        />
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout>
      <ErrorBoundary>
        <div className="space-y-6 p-6">
          {/* Header */}
          <PageHeader
            title="Analytics & Métriques"
            description="Analyses détaillées et métriques de performance du système"
            icon={BarChart3}
            badge={{
              text: `Période: ${periodeSelectionnee}`,
              variant: 'outline'
            }}
            actions={[
              {
                label: 'Actualiser',
                onClick: loadAnalyticsData,
                icon: RefreshCw,
                variant: 'outline'
              },
              {
                label: 'Exporter',
                onClick: exportData,
                icon: Download
              }
            ]}
          />

          {/* Sélecteur de période */}
          <div className="flex justify-end">
            <Select value={periodeSelectionnee} onValueChange={setPeriodeSelectionnee}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">24 heures</SelectItem>
                <SelectItem value="7j">7 jours</SelectItem>
                <SelectItem value="30j">30 jours</SelectItem>
                <SelectItem value="3m">3 mois</SelectItem>
              </SelectContent>
            </Select>
          </div>

        {data && (
          <>
            {/* Santé du système */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              <StatCard
                title="CPU"
                value={`${Math.round(data.systemHealth.cpu)}%`}
                icon={Cpu}
                iconColor="text-blue-500"
                trend={{ value: -2.3, label: 'depuis hier' }}
              />

              <StatCard
                title="Mémoire"
                value={`${Math.round(data.systemHealth.memory)}%`}
                icon={Server}
                iconColor="text-green-500"
                trend={{ value: 1.2, label: 'depuis hier' }}
              />

              <StatCard
                title="Stockage"
                value={`${Math.round(data.systemHealth.disk)}%`}
                icon={HardDrive}
                iconColor="text-purple-500"
                trend={{ value: 0.8, label: 'depuis hier' }}
              />

              <StatCard
                title="Réseau"
                value={`${Math.round(data.systemHealth.network)}%`}
                icon={Wifi}
                iconColor="text-orange-500"
                trend={{ value: 5.1, label: 'depuis hier' }}
              />

              <StatCard
                title="Base de données"
                value={`${Math.round(data.systemHealth.database)}%`}
                icon={DatabaseIcon}
                iconColor="text-red-500"
                trend={{ value: -0.5, label: 'depuis hier' }}
              />
            </div>

            {/* Services et leur statut */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="h-5 w-5" />
                  Statut des Services
                </CardTitle>
                <CardDescription>
                  État de santé des services principaux
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {data.systemHealth.services.map((service, index) => {
                    const StatusIcon = getServiceStatusIcon(service.status);
                    return (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <StatusIcon className={`h-5 w-5 ${getServiceStatusColor(service.status)}`} />
                          <div>
                            <p className="font-medium">{service.name}</p>
                            <p className="text-sm text-gray-600">{service.responseTime}ms</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={
                            service.status === 'operational' ? 'bg-green-100 text-green-800' :
                            service.status === 'degraded' ? 'bg-orange-100 text-orange-800' :
                            'bg-red-100 text-red-800'
                          }>
                            {service.status}
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleServiceAction(service.name, 'restart')}
                          >
                            <RefreshCw className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleServiceAction(service.name, 'details')}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Utilisation des organismes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Utilisation par Organisme
                </CardTitle>
                <CardDescription>
                  Activité et utilisation des organismes les plus actifs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.utilisationOrganismes.map((organisme, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">{organisme.name}</h3>
                          <Badge variant="outline">{organisme.type}</Badge>
                          <Badge variant="outline" className={getStatutColor(organisme.statut)}>
                            {organisme.statut}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-4 gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>{organisme.utilisateurs} utilisateurs</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Zap className="h-4 w-4" />
                            <span>{organisme.services} services</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Activity className="h-4 w-4" />
                            <span>{organisme.activite}% activité</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>Dernier accès: {new Date(organisme.dernierAcces).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewOrganismeDetails(organisme)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Répartition des rôles */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Répartition des Rôles
                  </CardTitle>
                  <CardDescription>
                    Distribution des utilisateurs par rôle
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {data.statistiquesUtilisateurs.repartitionRoles.map((role, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-4 h-4 rounded ${
                            index === 0 ? 'bg-blue-500' :
                            index === 1 ? 'bg-green-500' :
                            index === 2 ? 'bg-orange-500' : 'bg-purple-500'
                          }`}></div>
                          <span className="font-medium">{role.role}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-semibold">{role.count}</span>
                          <span className="text-sm text-gray-500 ml-2">({role.percentage}%)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Activité par Organisme
                  </CardTitle>
                  <CardDescription>
                    Utilisateurs actifs vs total par organisme
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {data.statistiquesUtilisateurs.activiteParOrganisme.map((org, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{org.organisme}</span>
                          <span className="text-sm text-gray-600">{org.actifs}/{org.total}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${(org.actifs / org.total) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Métriques de performance avancées */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Métriques de Performance Avancées
                </CardTitle>
                <CardDescription>
                  Temps de réponse et volume de requêtes sur les dernières 24h
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">234ms</p>
                    <p className="text-sm text-gray-600">Temps de réponse moyen</p>
                    <div className="flex items-center justify-center text-xs text-green-600 mt-1">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      -12ms depuis hier
                    </div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">15,420</p>
                    <p className="text-sm text-gray-600">Requêtes/heure</p>
                    <div className="flex items-center justify-center text-xs text-green-600 mt-1">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +8% depuis hier
                    </div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <p className="text-2xl font-bold text-orange-600">99.8%</p>
                    <p className="text-sm text-gray-600">Disponibilité</p>
                    <div className="flex items-center justify-center text-xs text-green-600 mt-1">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      SLA respecté
                    </div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">0.02%</p>
                    <p className="text-sm text-gray-600">Taux d'erreur</p>
                    <div className="flex items-center justify-center text-xs text-green-600 mt-1">
                      <TrendingDown className="h-3 w-3 mr-1" />
                      -0.01% depuis hier
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Logs & Alertes Système */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    Logs & Alertes en Temps Réel
                  </CardTitle>
                  <CardDescription>
                    Surveillance continue et alertes système
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {[
                      {
                        time: '14:30:45',
                        type: 'SUCCESS',
                        message: 'Synchronisation organismes terminée avec succès',
                        source: 'Sync Service',
                        severity: 'LOW',
                        icon: CheckCircle,
                        color: 'text-green-500'
                      },
                      {
                        time: '14:29:12',
                        type: 'WARNING',
                        message: 'Utilisation mémoire élevée sur API Gateway (78%)',
                        source: 'Monitoring',
                        severity: 'MEDIUM',
                        icon: AlertTriangle,
                        color: 'text-yellow-500'
                      },
                      {
                        time: '14:27:38',
                        type: 'INFO',
                        message: 'Nouvelle connexion utilisateur depuis Libreville',
                        source: 'Auth Service',
                        severity: 'LOW',
                        icon: Users,
                        color: 'text-blue-500'
                      },
                      {
                        time: '14:26:55',
                        type: 'ERROR',
                        message: 'Échec connexion base de données secondaire',
                        source: 'Database',
                        severity: 'HIGH',
                        icon: XCircle,
                        color: 'text-red-500'
                      },
                      {
                        time: '14:25:20',
                        type: 'INFO',
                        message: 'Backup automatique programmé initié',
                        source: 'Backup Service',
                        severity: 'LOW',
                        icon: DatabaseIcon,
                        color: 'text-blue-500'
                      },
                      {
                        time: '14:24:03',
                        type: 'SUCCESS',
                        message: 'Optimisation index completed (15% amélioration)',
                        source: 'DB Optimizer',
                        severity: 'LOW',
                        icon: Zap,
                        color: 'text-green-500'
                      }
                    ].map((log, index) => {
                      const IconComponent = log.icon;
                      return (
                        <div key={index} className="flex items-center gap-3 p-2 text-sm hover:bg-gray-50 rounded transition-colors">
                          <span className="text-xs text-muted-foreground font-mono w-16">{log.time}</span>
                          <IconComponent className={`h-4 w-4 ${log.color}`} />
                          <div className="flex-1">
                            <span className="block">{log.message}</span>
                            <span className="text-xs text-muted-foreground">{log.source}</span>
                          </div>
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
                  <CardTitle className="flex items-center gap-2">
                    <Monitor className="h-5 w-5" />
                    Métriques Avancées
                  </CardTitle>
                  <CardDescription>
                    Indicateurs de performance détaillés
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Charge CPU Globale</span>
                        <span className="text-sm text-muted-foreground">{Math.round(data.systemHealth.cpu)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${data.systemHealth.cpu}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Utilisation Mémoire</span>
                        <span className="text-sm text-muted-foreground">{Math.round(data.systemHealth.memory)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${data.systemHealth.memory}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Réseau I/O</span>
                        <span className="text-sm text-muted-foreground">{Math.round(data.systemHealth.network)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-purple-500 h-2 rounded-full"
                          style={{ width: `${data.systemHealth.network}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Performance DB</span>
                        <span className="text-sm text-muted-foreground">{Math.round(data.systemHealth.database)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-orange-500 h-2 rounded-full"
                          style={{ width: `${data.systemHealth.database}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="pt-3 border-t">
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="p-2 bg-green-50 rounded">
                          <div className="text-lg font-bold text-green-600">17.2s</div>
                          <div className="text-xs text-muted-foreground">Uptime</div>
                        </div>
                        <div className="p-2 bg-blue-50 rounded">
                          <div className="text-lg font-bold text-blue-600">245K</div>
                          <div className="text-xs text-muted-foreground">Requêtes/jour</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {/* Modal détails organisme */}
        <Dialog open={isOrganismeModalOpen} onOpenChange={setIsOrganismeModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Détails de l'Organisme: {selectedOrganisme?.name}
              </DialogTitle>
              <DialogDescription>
                Informations détaillées et métriques d'utilisation
              </DialogDescription>
            </DialogHeader>

            {selectedOrganisme && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Informations générales</h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>Nom:</strong> {selectedOrganisme.name}</div>
                      <div><strong>Type:</strong> {selectedOrganisme.type}</div>
                      <div><strong>Statut:</strong>
                        <Badge className={`ml-2 ${
                          selectedOrganisme.statut === 'actif' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {selectedOrganisme.statut}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Métriques d'activité</h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>Utilisateurs:</strong> {selectedOrganisme.utilisateurs}</div>
                      <div><strong>Services:</strong> {selectedOrganisme.services}</div>
                      <div><strong>Activité:</strong> {selectedOrganisme.activite}%</div>
                      <div><strong>Dernier accès:</strong> {new Date(selectedOrganisme.dernierAcces).toLocaleString('fr-FR')}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Actions disponibles</h4>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => toast.info('🔧 Configuration de l\'organisme')}>
                      <Settings className="h-4 w-4 mr-1" />
                      Configurer
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => toast.info('📊 Export des données')}>
                      <Download className="h-4 w-4 mr-1" />
                      Exporter
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => toast.info('👥 Gestion des utilisateurs')}>
                      <Users className="h-4 w-4 mr-1" />
                      Utilisateurs
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
        </div>
      </ErrorBoundary>
    </AuthenticatedLayout>
  );
}
