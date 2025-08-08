'use client';

import React, { useState } from 'react';
import { AuthenticatedLayout } from '@/components/layouts/authenticated-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { KPIGrid } from '@/components/ui/kpi-card';
import { StatsTable } from '@/components/ui/stats-table';
import { useOrganismesStats } from '@/hooks/use-statistics';
import { Progress } from '@/components/ui/progress';
import {
  Building2,
  Users,
  MapPin,
  Activity,
  TrendingUp,
  Target,
  Globe,
  RefreshCw,
  Download,
  Filter,
  Plus,
  BarChart3,
  CheckCircle,
  Flag,
  Crown
} from 'lucide-react';

export default function OrganismesPage() {
  const { data, loading, error, refresh } = useOrganismesStats({
    autoRefresh: true,
    refreshInterval: 5 * 60 * 1000
  });

  const [activeTab, setActiveTab] = useState('overview');

  // KPIs des organismes
  const kpiData = data ? [
    {
      id: 'total-organismes',
      title: 'Total Organismes',
      value: data.overview.total_organismes,
      trend: 0,
      subtitle: '141 organismes gabonais',
      icon: <Building2 className="h-4 w-4" />,
      status: 'info' as const
    },
    {
      id: 'organismes-actifs',
      title: 'Organismes Actifs',
      value: data.overview.organismes_actifs,
      trend: 0,
      subtitle: `${data.overview.taux_activite}% opérationnels`,
      icon: <CheckCircle className="h-4 w-4" />,
      status: 'success' as const
    },
    {
      id: 'organismes-principaux',
      title: 'Organismes Principaux',
      value: data.overview.organismes_principaux,
      trend: 0,
      subtitle: 'Ministères, DG, Institutions',
      icon: <Crown className="h-4 w-4" />,
      status: 'info' as const
    },
    {
      id: 'secteurs-representes',
      title: 'Secteurs Représentés',
      value: data.secteurs.total_secteurs,
      trend: 0,
      subtitle: 'Domaines administratifs',
      icon: <Target className="h-4 w-4" />,
      status: 'info' as const
    }
  ] : [];

  // Colonnes pour la répartition par type
  const repartitionColumns = [
    { key: 'type', label: 'Type d\'Organisme', sortable: true },
    { key: 'count', label: 'Nombre', type: 'number' as const, sortable: true },
    {
      key: 'pourcentage',
      label: 'Pourcentage',
      type: 'percentage' as const,
      formatter: (value: number) => `${value.toFixed(1)}%`
    }
  ];

  const repartitionData = data ? Object.entries(data.repartition_par_type).map(([type, count]) => ({
    type: type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    count: count as number,
    pourcentage: ((count as number) / data.overview.total_organismes) * 100
  })) : [];

  // Colonnes pour la répartition géographique
  const geographieColumns = [
    { key: 'province', label: 'Province', sortable: true },
    { key: 'organismes', label: 'Organismes', type: 'number' as const, sortable: true },
    { key: 'pourcentage', label: 'Répartition', type: 'percentage' as const, sortable: true }
  ];

  const geographieData = data?.graphiques?.repartition_geographique || [];

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
            <h1 className="text-3xl font-bold text-gray-900">Organismes & Administrations</h1>
            <p className="text-gray-600">
              Vue d'ensemble des 141 organismes de l'administration gabonaise
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
              Nouvel Organisme
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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="types">Par Type</TabsTrigger>
            <TabsTrigger value="geographie">Géographie</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Évolution mensuelle */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Évolution Mensuelle
                  </CardTitle>
                  <CardDescription>
                    Suivi des organismes actifs sur 6 mois
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {data?.graphiques?.evolution_mensuelle?.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{item.mois}</span>
                        <div className="flex items-center gap-4">
                          <span className="text-sm">Total: {item.total}</span>
                          <span className="text-sm text-green-600">Actifs: {item.actifs}</span>
                          <span className="text-xs text-blue-600">Nouveaux: {item.nouveaux}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Secteurs représentés */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Secteurs Administratifs
                  </CardTitle>
                  <CardDescription>
                    {data?.secteurs.total_secteurs} domaines couverts
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {data && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-900">
                            {data.secteurs.principaux_secteurs.administration_generale}
                          </div>
                          <div className="text-xs text-blue-700">Admin. Générale</div>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-900">
                            {data.secteurs.principaux_secteurs.education_formation}
                          </div>
                          <div className="text-xs text-green-700">Éducation</div>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                          <div className="text-2xl font-bold text-purple-900">
                            {data.secteurs.principaux_secteurs.sante_affaires_sociales}
                          </div>
                          <div className="text-xs text-purple-700">Santé/Social</div>
                        </div>
                        <div className="text-center p-3 bg-orange-50 rounded-lg">
                          <div className="text-2xl font-bold text-orange-900">
                            {data.secteurs.principaux_secteurs.securite_defense}
                          </div>
                          <div className="text-xs text-orange-700">Sécurité</div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 text-center">
                        Distribution équilibrée sur {data.secteurs.total_secteurs} secteurs
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="types">
            <StatsTable
              title="Répartition par Type d'Organisme"
              description="Classification détaillée des 141 organismes gabonais"
              columns={repartitionColumns}
              data={repartitionData}
              loading={loading}
              searchable={true}
              exportable={true}
            />
          </TabsContent>

          <TabsContent value="geographie">
            <StatsTable
              title="Répartition Géographique"
              description="Distribution territoriale des organismes par province"
              columns={geographieColumns}
              data={geographieData}
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
                    <BarChart3 className="h-5 w-5" />
                    Indicateurs de Performance
                  </CardTitle>
                  <CardDescription>
                    Métriques opérationnelles clés
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {data && (
                    <>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Organismes avec titulaire</span>
                          <span className="font-medium">{data.performance.organismes_avec_titulaire}%</span>
                        </div>
                        <Progress value={data.performance.organismes_avec_titulaire} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Couverture territoriale</span>
                          <span className="font-medium">{data.performance.couverture_territoriale}%</span>
                        </div>
                        <Progress value={data.performance.couverture_territoriale} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Taux opérationnel</span>
                          <span className="font-medium">{data.performance.taux_operationnel}%</span>
                        </div>
                        <Progress value={data.performance.taux_operationnel} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Organismes numérisés</span>
                          <span className="font-medium">{data.performance.organismes_numerises}%</span>
                        </div>
                        <Progress value={data.performance.organismes_numerises} className="h-2" />
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Couverture géographique */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Couverture Géographique
                  </CardTitle>
                  <CardDescription>
                    Présence sur le territoire national
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Flag className="h-4 w-4 text-emerald-600" />
                        <span className="font-medium">Provinces couvertes</span>
                      </div>
                      <span className="text-lg font-bold text-emerald-800">9/9</span>
                    </div>
                    <div className="text-sm text-gray-600 text-center">
                      Couverture complète du territoire gabonais
                    </div>
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
