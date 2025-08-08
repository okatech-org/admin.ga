'use client';

import React, { useState } from 'react';
import { AuthenticatedLayout } from '@/components/layouts/authenticated-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { KPIGrid } from '@/components/ui/kpi-card';
import { StatsTable } from '@/components/ui/stats-table';
import { useUtilisateursStats } from '@/hooks/use-statistics';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  UserCheck,
  UserX,
  Activity,
  Shield,
  Clock,
  Target,
  TrendingUp,
  RefreshCw,
  Download,
  Plus,
  BarChart3,
  CheckCircle,
  AlertTriangle,
  Crown,
  Settings,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';

export default function UtilisateursPage() {
  const { data, loading, error, refresh } = useUtilisateursStats({
    autoRefresh: true,
    refreshInterval: 5 * 60 * 1000
  });

  const [activeTab, setActiveTab] = useState('overview');

  // KPIs des utilisateurs
  const kpiData = data ? [
    {
      id: 'total-utilisateurs',
      title: 'Total Utilisateurs',
      value: data.overview.total_utilisateurs_systeme,
      trend: data.overview.taux_adoption,
      subtitle: '73 fonctionnaires + 7 citoyens + 7 admins',
      icon: <Users className="h-4 w-4" />,
      status: 'info' as const
    },
    {
      id: 'comptes-actifs',
      title: 'Comptes Actifs',
      value: data.statut_comptes.comptes_actifs,
      trend: 2,
      subtitle: `${Math.round((data.statut_comptes.comptes_actifs / data.overview.total_utilisateurs_systeme) * 100)}% d'activation`,
      icon: <UserCheck className="h-4 w-4" />,
      status: 'success' as const
    },
    {
      id: 'super-admins',
      title: 'Super Admins',
      value: data.overview.par_role.super_admins,
      trend: 0,
      subtitle: 'Administration centrale',
      icon: <Crown className="h-4 w-4" />,
      status: 'warning' as const
    },
    {
      id: 'citoyens',
      title: 'Citoyens',
      value: data.overview.par_role.citoyens,
      trend: 0,
      subtitle: 'Utilisateurs publics',
      icon: <Activity className="h-4 w-4" />,
      status: 'info' as const
    }
  ] : [];

  // Colonnes pour les rôles détaillés
  const rolesColumns = [
    { key: 'role', label: 'Rôle', sortable: true },
    { key: 'total', label: 'Nombre', type: 'number' as const, sortable: true },
    { key: 'description', label: 'Description', sortable: false },
    { key: 'permissions', label: 'Permissions', sortable: false },
    { key: 'organisations_couvertes', label: 'Couverture', sortable: false }
  ];

  const rolesData = data ? Object.entries(data.roles_details).map(([key, role]) => ({
    role: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    total: role.total,
    description: role.description,
    permissions: role.permissions,
    organisations_couvertes: role.organisations_couvertes
  })) : [];

  // Colonnes pour les citoyens
  const citoyensColumns = [
    { key: 'nom', label: 'Nom Complet', sortable: true },
    {
      key: 'statut',
      label: 'Statut',
      type: 'badge' as const,
      formatter: () => <Badge variant="outline" className="text-green-600">Actif</Badge>
    },
    { key: 'type', label: 'Type', sortable: true }
  ];

  const citoyensData = data?.citoyens_enregistres?.map(nom => ({
    nom,
    statut: 'Actif',
    type: 'Citoyen Test'
  })) || [];

  // Colonnes pour l'activité
  const activiteColumns = [
    { key: 'jour', label: 'Jour', sortable: true },
    { key: 'connexions', label: 'Connexions', type: 'number' as const, sortable: true },
    { key: 'documents', label: 'Documents', type: 'number' as const, sortable: true }
  ];

  const activiteData = data?.graphiques?.activite_hebdomadaire || [];

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
            <h1 className="text-3xl font-bold text-gray-900">Utilisateurs Système</h1>
            <p className="text-gray-600">
              Gestion des 87 utilisateurs de l'administration gabonaise
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
                  Nouvel Utilisateur
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
            <TabsTrigger value="roles">Rôles</TabsTrigger>
            <TabsTrigger value="citoyens">Citoyens</TabsTrigger>
            <TabsTrigger value="activite">Activité</TabsTrigger>
            <TabsTrigger value="securite">Sécurité</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Évolution utilisateurs */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Évolution des Utilisateurs
              </CardTitle>
                  <CardDescription>
                    Croissance sur les 6 derniers mois
                  </CardDescription>
            </CardHeader>
            <CardContent>
                  <div className="space-y-3">
                    {data?.graphiques?.evolution_utilisateurs?.map((item, index) => (
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

              {/* Répartition par organisme */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Répartition par Type d'Organisme
              </CardTitle>
                  <CardDescription>
                    Distribution des utilisateurs
                  </CardDescription>
            </CardHeader>
                <CardContent className="space-y-4">
                  {data?.graphiques?.repartition_par_organisme?.map((item, index) => (
                    <div key={index}>
                      <div className="flex justify-between text-sm mb-2">
                        <span>{item.type}</span>
                        <span className="font-medium">{item.utilisateurs} ({item.pourcentage}%)</span>
                </div>
                      <Progress value={item.pourcentage} className="h-2" />
                </div>
                  ))}
            </CardContent>
          </Card>
        </div>
          </TabsContent>

          <TabsContent value="roles">
            <StatsTable
              title="Rôles et Permissions"
              description="Détail des 5 rôles utilisateurs avec leurs permissions"
              columns={rolesColumns}
              data={rolesData}
              loading={loading}
              searchable={true}
              exportable={true}
            />
          </TabsContent>

          <TabsContent value="citoyens">
            <StatsTable
              title="Citoyens Enregistrés"
              description={`${data?.citoyens_enregistres?.length || 0} citoyens utilisateurs du système`}
              columns={citoyensColumns}
              data={citoyensData}
              loading={loading}
              searchable={true}
              exportable={true}
            />
          </TabsContent>

          <TabsContent value="activite">
            <div className="space-y-6">
              {/* Métriques d'activité */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {data && (
                  <>
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-2">
                          <Activity className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium">Connexions/mois</span>
              </div>
                        <div className="text-2xl font-bold">{data.activite.connexions_mensuelles}</div>
          </CardContent>
        </Card>
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium">Sessions actives</span>
            </div>
                        <div className="text-2xl font-bold">{data.activite.sessions_actives_moyennes}</div>
                                      </CardContent>
                                    </Card>
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="h-4 w-4 text-orange-600" />
                          <span className="text-sm font-medium">Temps moyen</span>
                                </div>
                        <div className="text-2xl font-bold">{data.activite.temps_session_moyen}</div>
                      </CardContent>
                  </Card>
              <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-2">
                          <Target className="h-4 w-4 text-purple-600" />
                          <span className="text-sm font-medium">Satisfaction</span>
                        </div>
                        <div className="text-2xl font-bold">{data.activite.taux_satisfaction}%</div>
                </CardContent>
              </Card>
                  </>
            )}
          </div>

              {/* Activité hebdomadaire */}
              <StatsTable
                title="Activité Hebdomadaire"
                description="Détail des connexions et actions par jour"
                columns={activiteColumns}
                data={activiteData}
                loading={loading}
                searchable={false}
                exportable={true}
                pagination={false}
              />
            </div>
          </TabsContent>

          <TabsContent value="securite" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Indicateurs de sécurité */}
          <Card>
            <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Sécurité & Conformité
                  </CardTitle>
              <CardDescription>
                    Métriques de sécurité du système
              </CardDescription>
            </CardHeader>
                <CardContent className="space-y-4">
                  {data && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Comptes avec 2FA</span>
                        <span className="font-semibold">{data.securite.comptes_2fa_actives}</span>
                            </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Connexions suspectes</span>
                        <span className="font-semibold text-green-600">{data.securite.dernieres_connexions_suspectes}</span>
                          </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Intrusions bloquées</span>
                        <span className="font-semibold text-green-600">{data.securite.tentatives_intrusion_bloquees}</span>
                        </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Mots de passe expirés</span>
                        <span className="font-semibold text-orange-600">{data.securite.mots_de_passe_expires}</span>
                          </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Sessions actives</span>
                        <span className="font-semibold">{data.securite.sessions_actives}</span>
                            </div>
                    </>
                  )}
                      </CardContent>
                    </Card>

              {/* Performance système */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Performance Système
                  </CardTitle>
                  <CardDescription>
                    Métriques de performance utilisateur
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {data && (
                    <>
                  <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Temps de réponse</span>
                          <span className="font-medium">{data.performance.temps_reponse_moyen}</span>
                    </div>
                  </div>
                    <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Disponibilité mensuelle</span>
                          <span className="font-medium">{data.performance.disponibilite_mensuelle}</span>
                    </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Erreurs critiques</span>
                        <span className="font-semibold text-green-600">{data.performance.erreurs_critiques}</span>
                    </div>
                    <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Satisfaction performance</span>
                          <span className="font-medium">{data.performance.satisfaction_performance}%</span>
                    </div>
                        <Progress value={data.performance.satisfaction_performance} className="h-2" />
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
