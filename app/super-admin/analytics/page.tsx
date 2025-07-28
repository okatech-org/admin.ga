/* @ts-nocheck */
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AuthenticatedLayout } from '@/components/layouts/authenticated-layout';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
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
  MapPin
} from 'lucide-react';

// Données mock pour les analytics
const analyticsData = {
  general: {
    totalUsers: 15742,
    totalOrganizations: 127,
    totalRequests: 45678,
    completedRequests: 38945,
    averageProcessingTime: 2.3,
    userGrowth: 12.5,
    requestGrowth: 8.7
  },
  usersByMonth: [
    { month: 'Jan', nouveaux: 1200, actifs: 8500 },
    { month: 'Fév', nouveaux: 1450, actifs: 9200 },
    { month: 'Mar', nouveaux: 1800, actifs: 10800 },
    { month: 'Avr', nouveaux: 1650, actifs: 11200 },
    { month: 'Mai', nouveaux: 2100, actifs: 12500 },
    { month: 'Jun', nouveaux: 1950, actifs: 13200 }
  ],
  requestsByService: [
    { service: 'Passeports', demandes: 4500, completees: 4200, temps_moyen: 5.2 },
    { service: 'CNI', demandes: 3800, completees: 3600, temps_moyen: 3.1 },
    { service: 'Actes Naissance', demandes: 3200, completees: 3100, temps_moyen: 2.8 },
    { service: 'Permis Conduire', demandes: 2100, completees: 1950, temps_moyen: 7.5 },
    { service: 'Visas', demandes: 1800, completees: 1650, temps_moyen: 8.2 }
  ],
  organizationPerformance: [
    { organisation: 'DGDI', demandes: 8500, satisfaction: 95, efficacite: 92 },
    { organisation: 'Mairie Libreville', demandes: 5200, satisfaction: 88, efficacite: 85 },
    { organisation: 'Min. Intérieur', demandes: 4800, satisfaction: 91, efficacite: 89 },
    { organisation: 'CNSS', demandes: 3200, satisfaction: 82, efficacite: 78 },
    { organisation: 'Prefecture', demandes: 2800, satisfaction: 86, efficacite: 83 }
  ],
  userDevices: [
    { name: 'Mobile', value: 65, color: '#8884d8' },
    { name: 'Desktop', value: 28, color: '#82ca9d' },
    { name: 'Tablette', value: 7, color: '#ffc658' }
  ],
  geographicData: [
    { region: 'Libreville', utilisateurs: 5670, demandes: 12450 },
    { region: 'Port-Gentil', utilisateurs: 2890, demandes: 6780 },
    { region: 'Franceville', utilisateurs: 1850, demandes: 4320 },
    { region: 'Oyem', utilisateurs: 1420, demandes: 3210 },
    { region: 'Autres', utilisateurs: 3912, demandes: 8240 }
  ]
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function SuperAdminAnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  const [selectedMetric, setSelectedMetric] = useState('users');

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <TrendingUp className="h-8 w-8 text-blue-500" />
              Analytics & Métriques
            </h1>
            <p className="text-muted-foreground">
              Analyses approfondies et insights sur l'utilisation du système
            </p>
          </div>
          <div className="flex gap-2">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Période" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1month">Dernier mois</SelectItem>
                <SelectItem value="3months">3 derniers mois</SelectItem>
                <SelectItem value="6months">6 derniers mois</SelectItem>
                <SelectItem value="1year">Dernière année</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Exporter
            </Button>
            <Button>
              <BarChart3 className="mr-2 h-4 w-4" />
              Rapport
            </Button>
          </div>
        </div>

        {/* KPIs principaux */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Total Utilisateurs</p>
                  <p className="text-2xl font-bold">{analyticsData.general.totalUsers.toLocaleString()}</p>
                  <p className="text-xs text-green-600">+{analyticsData.general.userGrowth}% ce mois</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Building2 className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Organisations</p>
                  <p className="text-2xl font-bold">{analyticsData.general.totalOrganizations}</p>
                  <p className="text-xs text-blue-600">Tous secteurs</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-purple-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Demandes Traitées</p>
                  <p className="text-2xl font-bold">{analyticsData.general.completedRequests.toLocaleString()}</p>
                  <p className="text-xs text-green-600">+{analyticsData.general.requestGrowth}% ce mois</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-orange-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Temps Moyen</p>
                  <p className="text-2xl font-bold">{analyticsData.general.averageProcessingTime}j</p>
                  <p className="text-xs text-green-600">-15% vs mois dernier</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Onglets analytiques */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="users">Utilisateurs</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="organizations">Organisations</TabsTrigger>
            <TabsTrigger value="geographic">Géographique</TabsTrigger>
            <TabsTrigger value="devices">Appareils</TabsTrigger>
          </TabsList>

          {/* Onglet Utilisateurs */}
          <TabsContent value="users" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Évolution des utilisateurs</CardTitle>
                  <CardDescription>Nouveaux utilisateurs vs utilisateurs actifs</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analyticsData.usersByMonth}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="nouveaux" fill="#8884d8" name="Nouveaux" />
                      <Bar dataKey="actifs" fill="#82ca9d" name="Actifs" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Croissance des utilisateurs</CardTitle>
                  <CardDescription>Tendance mensuelle</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={analyticsData.usersByMonth}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="actifs" stroke="#8884d8" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Répartition par région</CardTitle>
                <CardDescription>Distribution géographique des utilisateurs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {analyticsData.geographicData.map((region, index) => (
                    <div key={index} className="text-center p-4 border rounded-lg">
                      <MapPin className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                      <div className="text-lg font-bold">{region.utilisateurs.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">{region.region}</div>
                      <div className="text-xs text-blue-600">{region.demandes} demandes</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Services */}
          <TabsContent value="services" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance par service</CardTitle>
                  <CardDescription>Demandes et taux de completion</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analyticsData.requestsByService}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="service" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="demandes" fill="#8884d8" name="Demandes" />
                      <Bar dataKey="completees" fill="#82ca9d" name="Complétées" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Temps de traitement moyen</CardTitle>
                  <CardDescription>Par type de service (en jours)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.requestsByService.map((service, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="font-medium">{service.service}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 text-right">
                            <span className="text-lg font-bold">{service.temps_moyen}j</span>
                          </div>
                          <div className="w-32 bg-muted rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full" 
                              style={{ width: `${(service.temps_moyen / 10) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Répartition des demandes</CardTitle>
                <CardDescription>Distribution par type de service</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analyticsData.requestsByService}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ service, percent }) => `${service} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="demandes"
                    >
                      {analyticsData.requestsByService.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Organisations */}
          <TabsContent value="organizations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance des organisations</CardTitle>
                <CardDescription>Volume et qualité de service</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={analyticsData.organizationPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="organisation" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="demandes" fill="#8884d8" name="Demandes traitées" />
                    <Bar dataKey="satisfaction" fill="#82ca9d" name="Satisfaction %" />
                    <Bar dataKey="efficacite" fill="#ffc658" name="Efficacité %" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {analyticsData.organizationPerformance.slice(0, 3).map((org, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{org.organisation}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Demandes traitées</span>
                        <span className="font-bold">{org.demandes.toLocaleString()}</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Satisfaction</span>
                          <span>{org.satisfaction}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${org.satisfaction}%` }}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Efficacité</span>
                          <span>{org.efficacite}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ width: `${org.efficacite}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Onglet Géographique */}
          <TabsContent value="geographic" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Répartition géographique</CardTitle>
                  <CardDescription>Utilisateurs par région</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={analyticsData.geographicData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ region, percent }) => `${region} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="utilisateurs"
                      >
                        {analyticsData.geographicData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Demandes par région</CardTitle>
                  <CardDescription>Volume d'activité régional</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analyticsData.geographicData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="region" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="demandes" fill="#8884d8" name="Demandes" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Onglet Appareils */}
          <TabsContent value="devices" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Répartition par appareil</CardTitle>
                  <CardDescription>Types d'appareils utilisés</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={analyticsData.userDevices}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {analyticsData.userDevices.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Détail par type d'appareil</CardTitle>
                  <CardDescription>Statistiques d'utilisation</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {analyticsData.userDevices.map((device, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="flex items-center gap-3 flex-1">
                          {device.name === 'Mobile' && <Smartphone className="h-6 w-6 text-blue-500" />}
                          {device.name === 'Desktop' && <Monitor className="h-6 w-6 text-green-500" />}
                          {device.name === 'Tablette' && <Globe className="h-6 w-6 text-yellow-500" />}
                          <div>
                            <div className="font-medium">{device.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {Math.round((device.value / 100) * analyticsData.general.totalUsers).toLocaleString()} utilisateurs
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">{device.value}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Insights et recommandations */}
        <Card>
          <CardHeader>
            <CardTitle>Insights et Recommandations</CardTitle>
            <CardDescription>Analyses automatiques et suggestions d'amélioration</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg bg-blue-50">
                <TrendingUp className="h-6 w-6 text-blue-500 mb-2" />
                <h4 className="font-semibold">Croissance utilisateurs</h4>
                <p className="text-sm text-muted-foreground">
                  +12.5% ce mois. Tendance positive constante depuis 3 mois.
                </p>
              </div>
              
              <div className="p-4 border rounded-lg bg-green-50">
                <CheckCircle className="h-6 w-6 text-green-500 mb-2" />
                <h4 className="font-semibold">Performance services</h4>
                <p className="text-sm text-muted-foreground">
                  85% des services respectent les délais. DGDI en tête.
                </p>
              </div>
              
              <div className="p-4 border rounded-lg bg-yellow-50">
                <Clock className="h-6 w-6 text-yellow-500 mb-2" />
                <h4 className="font-semibold">Optimisation nécessaire</h4>
                <p className="text-sm text-muted-foreground">
                  Les permis de conduire prennent 7.5j en moyenne. À optimiser.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
} 