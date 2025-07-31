'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AuthenticatedLayout } from '@/components/layouts/authenticated-layout';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  TrendingUp,
  Users,
  FileText,
  Building2,
  Clock,
  CheckCircle,
  Download,
  Filter,
  Calendar,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Globe,
  Smartphone,
  Monitor,
  MapPin,
  Shield,
  AlertTriangle,
  Target,
  Zap
} from 'lucide-react';

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('30-days');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedMetric, setSelectedMetric] = useState('users');

  // Données simulées pour les statistiques
  const stats = {
    totalUsers: 8547,
    activeUsers: 6234,
    totalOrganizations: 160,
    activeOrganizations: 144,
    totalRequests: 12845,
    completedRequests: 10567,
    efficiency: 82.3,
    satisfaction: 4.6
  };

  const topOrganizations = [
    { name: 'Ministère de l\'Intérieur', users: 234, requests: 1234, efficiency: 94 },
    { name: 'Ministère de la Santé', users: 189, requests: 987, efficiency: 91 },
    { name: 'Ministère de l\'Éducation', users: 156, requests: 765, efficiency: 88 },
    { name: 'Préfecture du Haut-Ogooué', users: 123, requests: 543, efficiency: 85 },
    { name: 'Mairie de Libreville', users: 98, requests: 432, efficiency: 83 }
  ];

  return (
    <AuthenticatedLayout>
      <div className="p-6 space-y-6">
        {/* En-tête */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
            <p className="text-muted-foreground">
              Tableau de bord analytique complet du système Administration.GA
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7-days">7 jours</SelectItem>
                <SelectItem value="30-days">30 jours</SelectItem>
                <SelectItem value="90-days">90 jours</SelectItem>
                <SelectItem value="1-year">1 an</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
          </div>
        </div>

        {/* Métriques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Utilisateurs Total</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-green-600">
                +12% par rapport au mois dernier
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Organismes Actifs</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeOrganizations}/{stats.totalOrganizations}</div>
              <p className="text-xs text-green-600">
                90% taux d'activation
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Demandes Traitées</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedRequests.toLocaleString()}</div>
              <p className="text-xs text-green-600">
                {stats.efficiency}% taux de réussite
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Satisfaction</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.satisfaction}/5</div>
              <p className="text-xs text-green-600">
                +0.3 par rapport au mois dernier
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Graphiques et analyses */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="organizations">Organismes</TabsTrigger>
            <TabsTrigger value="users">Utilisateurs</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Graphique d'activité */}
              <Card>
                <CardHeader>
                  <CardTitle>Activité des Utilisateurs</CardTitle>
                  <CardDescription>
                    Connexions et activité au cours des 30 derniers jours
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center h-[300px] bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <BarChart3 className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600">Graphique d'activité</p>
                      <p className="text-sm text-gray-500 mt-2">Données en cours de chargement</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Distribution des organismes */}
              <Card>
                <CardHeader>
                  <CardTitle>Distribution des Organismes</CardTitle>
                  <CardDescription>
                    Répartition par type d'organisme
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center h-[300px] bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <PieChartIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600">Graphique de répartition</p>
                      <p className="text-sm text-gray-500 mt-2">Analyse des types d'organismes</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="organizations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Top Organismes</CardTitle>
                <CardDescription>
                  Organismes les plus actifs par nombre d'utilisateurs et de demandes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topOrganizations.map((org, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold text-blue-600">{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium">{org.name}</p>
                          <p className="text-sm text-gray-500">{org.users} utilisateurs • {org.requests} demandes</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary">{org.efficiency}%</Badge>
                        <p className="text-sm text-gray-500 mt-1">Efficacité</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Analyse des Utilisateurs</CardTitle>
                <CardDescription>
                  Statistiques d'utilisation et d'engagement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Activity className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">Utilisateurs Actifs</span>
                      </div>
                      <div className="text-2xl font-bold">{stats.activeUsers.toLocaleString()}</div>
                      <Progress value={75} className="mt-2" />
                    </div>

                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium">Temps Moyen</span>
                      </div>
                      <div className="text-2xl font-bold">14min</div>
                      <p className="text-sm text-gray-500 mt-1">Par session</p>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="h-4 w-4 text-orange-600" />
                        <span className="text-sm font-medium">Taux de Retour</span>
                      </div>
                      <div className="text-2xl font-bold">68%</div>
                      <p className="text-sm text-gray-500 mt-1">Utilisateurs récurrents</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Performance du Système</CardTitle>
                <CardDescription>
                  Métriques de performance et disponibilité
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Temps de Réponse</span>
                      <Badge variant="outline">127ms</Badge>
                    </div>
                    <Progress value={85} />

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Disponibilité</span>
                      <Badge variant="outline">99.8%</Badge>
                    </div>
                    <Progress value={99.8} />

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Charge Serveur</span>
                      <Badge variant="outline">23%</Badge>
                    </div>
                    <Progress value={23} />
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800">Système Opérationnel</span>
                      </div>
                      <p className="text-sm text-green-700 mt-1">
                        Tous les services fonctionnent normalement
                      </p>
                    </div>

                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-800">Sécurité Active</span>
                      </div>
                      <p className="text-sm text-blue-700 mt-1">
                        Protection et monitoring actifs
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AuthenticatedLayout>
  );
}
