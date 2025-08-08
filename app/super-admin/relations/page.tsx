'use client';

import React, { useState } from 'react';
import { AuthenticatedLayout } from '@/components/layouts/authenticated-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { KPIGrid } from '@/components/ui/kpi-card';
import { StatsTable } from '@/components/ui/stats-table';
import { useRelationsStats } from '@/hooks/use-statistics';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Network,
  Building2,
  Users,
  BarChart3,
  TrendingUp,
  Target,
  RefreshCw,
  Download,
  Plus,
  Settings,
  CheckCircle,
  Clock,
  AlertTriangle,
  Globe,
  Calendar,
  Activity,
  Award,
  Layers
} from 'lucide-react';

export default function RelationsPage() {
  const { data, loading, error, refresh } = useRelationsStats({
    autoRefresh: true,
    refreshInterval: 5 * 60 * 1000
  });

  const [activeTab, setActiveTab] = useState('overview');

  // KPIs des relations
  const kpiData = data ? [
    {
      id: 'total-relations',
      title: 'Total Relations',
      value: data.overview.total_relations,
      trend: 0,
      subtitle: 'Entre 141 organismes',
      icon: <Network className="h-4 w-4" />,
      status: 'info' as const
    },
    {
      id: 'groupes-admin',
      title: 'Groupes Admin',
      value: data.overview.groupes_admin,
      trend: 2,
      subtitle: 'Groupes de travail actifs',
      icon: <Users className="h-4 w-4" />,
      status: 'success' as const
    },
    {
      id: 'densite-reseau',
      title: 'Densité Réseau',
      value: `${data.overview.densite_reseau}%`,
      trend: 1,
      subtitle: 'Interconnexion organismes',
      icon: <Globe className="h-4 w-4" />,
      status: 'info' as const
    },
    {
      id: 'types-relations',
      title: 'Types Relations',
      value: Object.keys(data.overview.types_relations).length,
      trend: 0,
      subtitle: 'Catégories de relations',
      icon: <Layers className="h-4 w-4" />,
      status: 'info' as const
    }
  ] : [];

  // Colonnes pour les organismes centraux
  const organismesCentrauxColumns = [
    { key: 'organisme', label: 'Organisme', sortable: true },
    { key: 'connexions', label: 'Connexions', type: 'number' as const, sortable: true },
    { key: 'centralite', label: 'Centralité', type: 'percentage' as const, sortable: true }
  ];

  const organismesCentrauxData = data?.reseau?.organismes_centraux || [];

  // Colonnes pour les clusters fonctionnels
  const clustersColumns = [
    { key: 'nom', label: 'Cluster', sortable: true },
    { key: 'relations_internes', label: 'Relations Internes', type: 'number' as const, sortable: true },
    { key: 'relations_externes', label: 'Relations Externes', type: 'number' as const, sortable: true },
    {
      key: 'organismes_count',
      label: 'Organismes',
      type: 'number' as const,
      formatter: (value: number, row: any) => row.organismes.length
    }
  ];

  const clustersData = data?.reseau?.clusters_fonctionnels?.map(cluster => ({
    ...cluster,
    organismes_count: cluster.organismes.length
  })) || [];

  // Colonnes pour les groupes administratifs
  const groupesColumns = [
    { key: 'domaine', label: 'Domaine', sortable: true },
    { key: 'groupes', label: 'Groupes', type: 'number' as const, sortable: true },
    { key: 'membres', label: 'Membres', type: 'number' as const, sortable: true },
    {
      key: 'activite',
      label: 'Activité',
      type: 'badge' as const,
      formatter: (value: string) => (
        <Badge variant={value === 'Haute' ? 'default' : value === 'Moyenne' ? 'outline' : 'secondary'}>
          {value}
        </Badge>
      )
    }
  ];

  const groupesData = data?.groupes_administratifs?.par_domaine || [];

  // Colonnes pour l'efficacité de collaboration
  const efficaciteColumns = [
    { key: 'organisme', label: 'Organisme', sortable: true },
    { key: 'partenaires', label: 'Partenaires', type: 'number' as const, sortable: true },
    { key: 'projets_reussis', label: 'Projets Réussis', type: 'number' as const, sortable: true },
    { key: 'taux_succes', label: 'Taux Succès', type: 'percentage' as const, sortable: true }
  ];

  const efficaciteData = data?.graphiques?.efficacite_collaboration || [];

  if (error) {
    return (
      <AuthenticatedLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="w-96">
            <CardHeader>
              <CardTitle className="text-red-600">Erreur de chargement</CardTitle>
              <CardDescription>{error}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={refresh} className="w-full">
                <RefreshCw className="h-4 w-4 mr-2" />
                Réessayer
              </Button>
            </CardContent>
          </Card>
        </div>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Relations Inter-Organismes</h1>
            <p className="text-gray-600">
              Analyse du réseau de 248 relations entre organismes gabonais
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={refresh} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle Relation
            </Button>
          </div>
        </div>

        {/* KPIs */}
        <KPIGrid
          kpis={kpiData}
          columns={4}
          loading={loading}
        />

        {/* Analyse détaillée */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="reseau">Réseau</TabsTrigger>
            <TabsTrigger value="groupes">Groupes</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="projets">Projets</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Évolution de la coopération */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Évolution Coopération
                  </CardTitle>
                  <CardDescription>
                    Nouveaux accords et projets sur 6 mois
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {data?.graphiques?.evolution_cooperation?.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{item.mois}</span>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-green-600">Accords: {item.nouveaux_accords}</span>
                          <span className="text-sm text-blue-600">Projets: {item.projets_launches}</span>
                          <span className="text-sm text-gray-600">Réunions: {item.reunions}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Types de relations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Types de Relations
                  </CardTitle>
                  <CardDescription>
                    Répartition par catégorie de relation
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {data?.relations_detaillees && Object.entries(data.relations_detaillees).map(([type, details]) => (
                    <div key={type}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm capitalize">{type.replace(/_/g, ' ')}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{details.total}</span>
                          <Badge variant="outline">{details.efficacite}%</Badge>
                        </div>
                      </div>
                      <Progress value={details.efficacite} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reseau" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Organismes centraux */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Organismes Centraux
                  </CardTitle>
                  <CardDescription>
                    Organismes les plus connectés du réseau
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <StatsTable
                    title=""
                    columns={organismesCentrauxColumns}
                    data={organismesCentrauxData}
                    loading={loading}
                    searchable={false}
                    exportable={false}
                    pagination={false}
                  />
                </CardContent>
              </Card>

              {/* Clusters fonctionnels */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Layers className="h-5 w-5" />
                    Clusters Fonctionnels
                  </CardTitle>
                  <CardDescription>
                    Groupements thématiques d'organismes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <StatsTable
                    title=""
                    columns={clustersColumns}
                    data={clustersData}
                    loading={loading}
                    searchable={false}
                    exportable={false}
                    pagination={false}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="groupes">
            <StatsTable
              title="Groupes Administratifs par Domaine"
              description={`${data?.groupes_administratifs?.total || 0} groupes de travail actifs`}
              columns={groupesColumns}
              data={groupesData}
              loading={loading}
              searchable={true}
              exportable={true}
            />
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Indicateurs de performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Indicateurs Performance
                  </CardTitle>
                  <CardDescription>
                    Métriques de collaboration inter-organismes
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {data && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Temps réponse inter-organismes</span>
                        <span className="font-semibold">{data.performance.temps_reponse_inter_organismes}</span>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Taux résolution conflits</span>
                          <span className="font-medium">{data.performance.taux_resolution_conflits}%</span>
                        </div>
                        <Progress value={data.performance.taux_resolution_conflits} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Satisfaction collaboration</span>
                          <span className="font-medium">{data.performance.satisfaction_collaboration}%</span>
                        </div>
                        <Progress value={data.performance.satisfaction_collaboration} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Projets inter-organismes réussis</span>
                          <span className="font-medium">{data.performance.projets_inter_organismes_reussis}%</span>
                        </div>
                        <Progress value={data.performance.projets_inter_organismes_reussis} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Réduction doublons administratifs</span>
                          <span className="font-medium">{data.performance.reduction_doublons_administratifs}%</span>
                        </div>
                        <Progress value={data.performance.reduction_doublons_administratifs} className="h-2" />
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Efficacité de collaboration */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Efficacité Collaboration
                  </CardTitle>
                  <CardDescription>
                    Performance par organisme
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <StatsTable
                    title=""
                    columns={efficaciteColumns}
                    data={efficaciteData}
                    loading={loading}
                    searchable={false}
                    exportable={false}
                    pagination={false}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="projets" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Projets d'optimisation */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Projets d'Optimisation
                  </CardTitle>
                  <CardDescription>
                    Initiatives d'amélioration des relations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {data?.projets_optimisation?.map((projet, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-gray-900">{projet.nom}</h4>
                            <p className="text-sm text-gray-600">{projet.impact_estime}</p>
                          </div>
                          <Badge variant="outline">
                            {projet.avancement}%
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Avancement</span>
                            <span>{projet.organismes_concernes} organismes concernés</span>
                          </div>
                          <Progress value={projet.avancement} className="h-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Analyse qualitative */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Analyse Qualitative
                  </CardTitle>
                  <CardDescription>
                    Points forts, défis et opportunités
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {data?.analyse_qualitative && (
                    <>
                      <div>
                        <h4 className="font-medium text-green-800 mb-2 flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" />
                          Points Forts
                        </h4>
                        <ul className="space-y-1">
                          {data.analyse_qualitative.points_forts.map((point, index) => (
                            <li key={index} className="text-sm text-gray-600">• {point}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-medium text-orange-800 mb-2 flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4" />
                          Défis Identifiés
                        </h4>
                        <ul className="space-y-1">
                          {data.analyse_qualitative.defis_identifies.map((defi, index) => (
                            <li key={index} className="text-sm text-gray-600">• {defi}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                          <Target className="h-4 w-4" />
                          Opportunités
                        </h4>
                        <ul className="space-y-1">
                          {data.analyse_qualitative.opportunites.map((opportunite, index) => (
                            <li key={index} className="text-sm text-gray-600">• {opportunite}</li>
                          ))}
                        </ul>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AuthenticatedLayout>
  );
}
