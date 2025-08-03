'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AuthenticatedLayout } from '@/components/layouts/authenticated-layout';
import { toast } from 'sonner';
import {
  Building2,
  Users,
  Zap,
  Clock,
  TrendingUp,
  TrendingDown,
  Activity,
  Globe,
  Shield,
  Database as DatabaseIcon,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  BarChart3,
  PieChart,
  RefreshCw,
  Calendar,
  Target,
  Award,
  Cpu,
  Monitor,
  Server,
  Eye,
  Settings,
  Download,
  Upload,
  ArrowUpRight,
  ArrowDownRight,
  Loader2
} from 'lucide-react';

interface DashboardStats {
  organismes: {
    total: number;
    actifs: number;
    nouveaux: number;
    tendance: number;
  };
  utilisateurs: {
    total: number;
    actifs: number;
    enAttente: number;
    tendance: number;
  };
  services: {
    total: number;
    actifs: number;
    utilises: number;
    tendance: number;
  };
  communications: {
    total: number;
    enCours: number;
    appliquees: number;
    tauxReussite: number;
  };
  systeme: {
    uptime: number;
    performance: number;
    stockage: number;
    requetes: number;
  };
}

interface ActiviteRecente {
  id: string;
  type: 'creation' | 'modification' | 'communication' | 'affectation';
  titre: string;
  description: string;
  timestamp: string;
  organisme?: string;
  utilisateur?: string;
  statut: 'success' | 'warning' | 'error' | 'info';
}

export default function DashboardUnifiedPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activites, setActivites] = useState<ActiviteRecente[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Simuler des données de dashboard
      const statsSimulees: DashboardStats = {
        organismes: {
          total: 307,
          actifs: 298,
          nouveaux: 5,
          tendance: 2.3
        },
        utilisateurs: {
          total: 979,
          actifs: 856,
          enAttente: 478,
          tendance: 12.5
        },
        services: {
          total: 558,
          actifs: 547,
          utilises: 423,
          tendance: -1.2
        },
        communications: {
          total: 5,
          enCours: 3,
          appliquees: 2,
          tauxReussite: 85
        },
        systeme: {
          uptime: 99.8,
          performance: 94.2,
          stockage: 68.4,
          requetes: 15420
        }
      };

      const activitesSimulees: ActiviteRecente[] = [
        {
          id: '1',
          type: 'communication',
          titre: 'Nouvelle directive présidentielle',
          description: 'Directive sur la digitalisation des services publics envoyée',
          timestamp: '2025-01-15T10:30:00Z',
          organisme: 'Présidence de la République',
          statut: 'success'
        },
        {
          id: '2',
          type: 'affectation',
          titre: 'Affectation fonctionnaire',
          description: '15 fonctionnaires affectés à leurs nouveaux postes',
          timestamp: '2025-01-15T09:15:00Z',
          statut: 'success'
        },
        {
          id: '3',
          type: 'creation',
          titre: 'Nouvel organisme créé',
          description: 'Agence Nationale de Promotion Touristique',
          timestamp: '2025-01-15T08:45:00Z',
          organisme: 'ANPT',
          statut: 'info'
        },
        {
          id: '4',
          type: 'modification',
          titre: 'Mise à jour services',
          description: 'Configuration des services DGI mise à jour',
          timestamp: '2025-01-15T08:00:00Z',
          organisme: 'Direction Générale des Impôts',
          statut: 'warning'
        },
        {
          id: '5',
          type: 'communication',
          titre: 'Accusé de réception',
          description: 'Ministère de l\'Économie a accusé réception de la procédure budgétaire',
          timestamp: '2025-01-14T16:20:00Z',
          organisme: 'Ministère de l\'Économie',
          statut: 'success'
        }
      ];

      setStats(statsSimulees);
      setActivites(activitesSimulees);

    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      toast.error('Erreur lors du chargement du dashboard');
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
    toast.success('Données actualisées');
  };

  const getActiviteIcon = (type: string) => {
    const icons = {
      creation: Building2,
      modification: Settings,
      communication: MessageSquare,
      affectation: Users
    };
    return icons[type] || Activity;
  };

  const getActiviteColor = (statut: string) => {
    const colors = {
      success: 'text-green-600 bg-green-100',
      warning: 'text-orange-600 bg-orange-100',
      error: 'text-red-600 bg-red-100',
      info: 'text-blue-600 bg-blue-100'
    };
    return colors[statut] || colors.info;
  };

  const formatRelativeTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
    if (hours > 0) return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`;
    if (minutes > 0) return `Il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
    return 'À l\'instant';
  };

  if (loading) {
    return (
      <AuthenticatedLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Unifié</h1>
            <p className="text-gray-600 mt-1">
              Vue d'ensemble complète du système Administration.GA • 307 organismes • 979 utilisateurs
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={refreshData} disabled={refreshing}>
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Exporter Rapport
            </Button>
          </div>
        </div>

        {/* Statistiques principales */}
        {stats && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Organismes */}
              <Card className="border-l-4 border-emerald-500">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Organismes</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.organismes.total}</p>
                      <div className="flex items-center mt-1">
                        <span className="text-xs text-emerald-600 font-medium">{stats.organismes.actifs} actifs</span>
                        <span className="mx-1 text-gray-400">•</span>
                        <span className="text-xs text-blue-600">{stats.organismes.nouveaux} nouveaux</span>
                      </div>
                    </div>
                    <Building2 className="h-8 w-8 text-emerald-500" />
                  </div>
                  <div className="flex items-center mt-3">
                    {stats.organismes.tendance > 0 ? (
                      <ArrowUpRight className="h-4 w-4 text-green-600" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-red-600" />
                    )}
                    <span className={`text-sm font-medium ml-1 ${
                      stats.organismes.tendance > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {Math.abs(stats.organismes.tendance)}%
                    </span>
                    <span className="text-xs text-gray-500 ml-1">ce mois</span>
                  </div>
                </CardContent>
              </Card>

              {/* Utilisateurs */}
              <Card className="border-l-4 border-blue-500">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Utilisateurs</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.utilisateurs.total}</p>
                      <div className="flex items-center mt-1">
                        <span className="text-xs text-green-600 font-medium">{stats.utilisateurs.actifs} actifs</span>
                        <span className="mx-1 text-gray-400">•</span>
                        <span className="text-xs text-orange-600">{stats.utilisateurs.enAttente} en attente</span>
                      </div>
                    </div>
                    <Users className="h-8 w-8 text-blue-500" />
                  </div>
                  <div className="flex items-center mt-3">
                    <ArrowUpRight className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium ml-1 text-green-600">
                      {stats.utilisateurs.tendance}%
                    </span>
                    <span className="text-xs text-gray-500 ml-1">ce mois</span>
                  </div>
                </CardContent>
              </Card>

              {/* Services */}
              <Card className="border-l-4 border-purple-500">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Services</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.services.total}</p>
                      <div className="flex items-center mt-1">
                        <span className="text-xs text-green-600 font-medium">{stats.services.actifs} actifs</span>
                        <span className="mx-1 text-gray-400">•</span>
                        <span className="text-xs text-purple-600">{stats.services.utilises} utilisés</span>
                      </div>
                    </div>
                    <Zap className="h-8 w-8 text-purple-500" />
                  </div>
                  <div className="flex items-center mt-3">
                    <ArrowDownRight className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-medium ml-1 text-red-600">
                      {Math.abs(stats.services.tendance)}%
                    </span>
                    <span className="text-xs text-gray-500 ml-1">ce mois</span>
                  </div>
                </CardContent>
              </Card>

              {/* Communications */}
              <Card className="border-l-4 border-orange-500">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Communications</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.communications.total}</p>
                      <div className="flex items-center mt-1">
                        <span className="text-xs text-orange-600 font-medium">{stats.communications.enCours} en cours</span>
                        <span className="mx-1 text-gray-400">•</span>
                        <span className="text-xs text-green-600">{stats.communications.appliquees} appliquées</span>
                      </div>
                    </div>
                    <MessageSquare className="h-8 w-8 text-orange-500" />
                  </div>
                  <div className="flex items-center mt-3">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium ml-1 text-green-600">
                      {stats.communications.tauxReussite}%
                    </span>
                    <span className="text-xs text-gray-500 ml-1">taux succès</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Métriques système */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Disponibilité</p>
                      <p className="text-2xl font-bold text-green-600">{stats.systeme.uptime}%</p>
                    </div>
                    <Monitor className="h-6 w-6 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Performance</p>
                      <p className="text-2xl font-bold text-blue-600">{stats.systeme.performance}%</p>
                    </div>
                    <Cpu className="h-6 w-6 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Stockage</p>
                      <p className="text-2xl font-bold text-orange-600">{stats.systeme.stockage}%</p>
                    </div>
                    <DatabaseIcon className="h-6 w-6 text-orange-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Requêtes/h</p>
                      <p className="text-2xl font-bold text-purple-600">{stats.systeme.requetes.toLocaleString()}</p>
                    </div>
                    <Server className="h-6 w-6 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {/* Grille principale */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Activité récente */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Activité Récente
              </CardTitle>
              <CardDescription>
                Dernières actions effectuées dans le système
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activites.map((activite) => {
                  const IconComponent = getActiviteIcon(activite.type);
                  return (
                    <div key={activite.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50">
                      <div className={`p-2 rounded-full ${getActiviteColor(activite.statut)}`}>
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {activite.titre}
                        </p>
                        <p className="text-sm text-gray-600">
                          {activite.description}
                        </p>
                        <div className="flex items-center mt-1 text-xs text-gray-500">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatRelativeTime(activite.timestamp)}
                          {activite.organisme && (
                            <>
                              <span className="mx-1">•</span>
                              <span>{activite.organisme}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Actions rapides */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Actions Rapides
              </CardTitle>
              <CardDescription>
                Raccourcis vers les tâches courantes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Building2 className="h-4 w-4 mr-2" />
                  Créer un organisme
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  Ajouter des utilisateurs
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Nouvelle communication
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Clock className="h-4 w-4 mr-2" />
                  Gérer les affectations
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Voir les analytics
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Configuration système
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center py-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Administration.GA • 307 organismes publics gabonais • Système unifié de gestion administrative
          </p>
          <div className="flex items-center justify-center mt-2 space-x-6 text-xs text-gray-400">
            <span>Dernière mise à jour: {new Date().toLocaleString()}</span>
            <span>Version 2.0.0</span>
            <span>Uptime: {stats?.systeme.uptime}%</span>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
