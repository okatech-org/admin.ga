'use client';

import React, { useState } from 'react';
import { AuthenticatedLayout } from '@/components/layouts/authenticated-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { KPIGrid } from '@/components/ui/kpi-card';
import { StatsTable } from '@/components/ui/stats-table';
import { useServicesStats } from '@/hooks/use-statistics';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  CheckCircle,
  Clock,
  Smartphone,
  BarChart3,
  TrendingUp,
  Target,
  RefreshCw,
  Download,
  Plus,
  Settings,
  Users,
  Building2,
  Globe,
  Timer,
  Award,
  AlertTriangle
} from 'lucide-react';

export default function ServicesPage() {
  const { data, loading, error, refresh } = useServicesStats({
    autoRefresh: true,
    refreshInterval: 5 * 60 * 1000
  });

  const [activeTab, setActiveTab] = useState('overview');

  // KPIs des services
  const kpiData = data ? [
    {
      id: 'total-services',
      title: 'Total Services',
      value: (data as any).overview?.total_services || 0,
      trend: 0,
      subtitle: 'Services documentés',
      icon: <FileText className="h-4 w-4" />,
      status: 'info' as const
    },
    {
      id: 'services-actifs',
      title: 'Services Actifs',
      value: (data as any).overview?.services_actifs || 0,
      trend: 5,
      subtitle: `${(data as any).overview?.taux_disponibilite || 0}% disponibles`,
      icon: <CheckCircle className="h-4 w-4" />,
      status: 'success' as const
    },
    {
      id: 'demarches-numeriques',
      title: 'Démarches Numériques',
      value: (data as any).numerisation?.demarches_numeriques_totales || 0,
      trend: 12,
      subtitle: `${(data as any).numerisation?.taux_numerisation || 0}% numérisées`,
      icon: <Smartphone className="h-4 w-4" />,
      status: 'info' as const
    },
    {
      id: 'services-developpement',
      title: 'En Développement',
      value: (data as any).overview?.services_en_developpement || 0,
      trend: 8,
      subtitle: 'Nouveaux services',
      icon: <Clock className="h-4 w-4" />,
      status: 'warning' as const
    }
  ] : [];

  // Colonnes pour les services par catégorie
  const categoriesColumns = [
    { key: 'nom', label: 'Service', sortable: true },
    { key: 'organisme', label: 'Organisme', sortable: true },
    { key: 'delai', label: 'Délai', sortable: true },
    {
      key: 'numerique',
      label: 'Numérique',
      type: 'badge' as const,
      formatter: (value: boolean) => (
        <Badge variant={value ? 'default' : 'outline'} className={value ? 'text-green-600' : 'text-gray-600'}>
          {value ? 'Oui' : 'Non'}
        </Badge>
      )
    }
  ];

  // Colonnes pour les demandes par service
  const demandesColumns = [
    { key: 'service', label: 'Service', sortable: true },
    { key: 'demandes', label: 'Demandes', type: 'number' as const, sortable: true },
    { key: 'completees', label: 'Complétées', type: 'number' as const, sortable: true },
    { key: 'en_cours', label: 'En Cours', type: 'number' as const, sortable: true },
    {
      key: 'taux_completion',
      label: 'Taux',
      type: 'percentage' as const,
      formatter: (value: number) => `${Math.round(value)}%`
    }
  ];

  const demandesData = (data as any)?.graphiques?.demandes_par_service?.map((item: any) => ({
    ...item,
    taux_completion: (item.completees / item.demandes) * 100
  })) || [];

  // Colonnes pour satisfaction par organisme
  const satisfactionColumns = [
    { key: 'organisme', label: 'Organisme', sortable: true },
    { key: 'satisfaction', label: 'Satisfaction', type: 'percentage' as const, sortable: true },
    { key: 'services', label: 'Services', type: 'number' as const, sortable: true }
  ];

  const satisfactionData = (data as any)?.graphiques?.satisfaction_par_organisme || [];

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
            <h1 className="text-3xl font-bold text-gray-900">Services & Démarches</h1>
            <p className="text-gray-600">
              Gestion des 85 services administratifs gabonais
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
              Nouveau Service
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
            <TabsTrigger value="categories">Par Catégorie</TabsTrigger>
            <TabsTrigger value="demandes">Demandes</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="projets">Projets</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Évolution de la numérisation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Évolution Numérisation
            </CardTitle>
                  <CardDescription>
                    Progression sur les 6 derniers mois
                  </CardDescription>
          </CardHeader>
          <CardContent>
                                    <div className="space-y-3">
                    {(data as any)?.graphiques?.evolution_numerisation?.map((item: any, index: number) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{item.mois}</span>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-green-600">Numériques: {item.numeriques}</span>
                          <span className="text-sm text-blue-600">Hybrides: {item.hybrides}</span>
                          <span className="text-sm text-gray-600">Papier: {item.papier}</span>
                        </div>
              </div>
                    ))}
            </div>
          </CardContent>
        </Card>

              {/* Performance globale */}
        <Card>
          <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Performance Globale
            </CardTitle>
            <CardDescription>
                    Indicateurs de qualité de service
            </CardDescription>
          </CardHeader>
                <CardContent className="space-y-4">
                                    {data && (
                    <>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Temps traitement moyen</span>
                          <span className="font-medium">{(data as any).performance?.temps_traitement_moyen || 'N/A'}</span>
                            </div>
                          </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Satisfaction globale</span>
                          <span className="font-medium">{(data as any).performance?.taux_satisfaction_global || 0}%</span>
                        </div>
                        <Progress value={(data as any).performance?.taux_satisfaction_global || 0} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Délais respectés</span>
                          <span className="font-medium">{(data as any).performance?.delais_respectes || 0}%</span>
                        </div>
                        <Progress value={(data as any).performance?.delais_respectes || 0} className="h-2" />
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Réclamations/mois</span>
                        <span className="font-semibold">{(data as any).performance?.reclamations_mensuelles || 0}</span>
                            </div>
                    </>
                  )}
                </CardContent>
              </Card>
                                      </div>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            {/* Services par catégorie */}
            {(data as any)?.services_par_categorie && Object.entries((data as any).services_par_categorie).map(([categorie, services]: [string, any]) => (
              <Card key={categorie}>
                <CardHeader>
                  <CardTitle className="capitalize">
                    {categorie.replace(/_/g, ' ')} ({services.total} services)
                  </CardTitle>
                  <CardDescription>
                    {services.actifs} services actifs sur {services.total}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <StatsTable
                    title=""
                    columns={categoriesColumns}
                    data={services.services}
                    loading={loading}
                    searchable={true}
                    exportable={false}
                    pagination={false}
                  />
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="demandes">
            <StatsTable
              title="Demandes par Service"
              description="Volume et traitement des demandes administratives"
              columns={demandesColumns}
              data={demandesData}
              loading={loading}
              searchable={true}
              exportable={true}
            />
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Indicateurs qualité */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Indicateurs Qualité
                  </CardTitle>
                  <CardDescription>
                    Métriques de qualité et certification
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                                    {data && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Services certifiés ISO</span>
                        <span className="font-semibold">{(data as any).qualite?.services_certifies_iso || 0}</span>
                                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Audits qualité passés</span>
                        <span className="font-semibold">{(data as any).qualite?.audits_qualite_passes || 0}</span>
                                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Taux d'erreur moyen</span>
                        <span className="font-semibold">{(data as any).qualite?.taux_erreur_moyen || 0}%</span>
                                  </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Temps résolution incident</span>
                        <span className="font-semibold">{(data as any).qualite?.temps_resolution_incident || 'N/A'}</span>
                                </div>
                              <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Formation agents complétée</span>
                          <span className="font-medium">{(data as any).qualite?.formation_agents_completee || 0}%</span>
                                  </div>
                        <Progress value={(data as any).qualite?.formation_agents_completee || 0} className="h-2" />
                                  </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Satisfaction par organisme */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Satisfaction par Organisme
                  </CardTitle>
                  <CardDescription>
                    Évaluation de la satisfaction citoyens
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <StatsTable
                    title=""
                    columns={satisfactionColumns}
                    data={satisfactionData}
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
            {/* Projets d'amélioration */}
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Projets d'Amélioration
                  </CardTitle>
                  <CardDescription>
                    Initiatives en cours pour moderniser les services
                  </CardDescription>
                </CardHeader>
                <CardContent>
                                    <div className="space-y-6">
                    {(data as any)?.projets_amelioration?.map((projet: any, index: number) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-gray-900">{projet.nom}</h4>
                            <p className="text-sm text-gray-600">{projet.impact_estime}</p>
                                  </div>
                          <Badge variant="outline">
                            {projet.avancement}% complété
                          </Badge>
                                </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Avancement</span>
                            <span>Échéance: {new Date(projet.echeance).toLocaleDateString('fr-FR')}</span>
                          </div>
                          <Progress value={projet.avancement} className="h-2" />
                        </div>
                    </div>
                    ))}
              </div>
          </CardContent>
        </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AuthenticatedLayout>
  );
}
