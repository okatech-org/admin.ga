/* @ts-nocheck */
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AuthenticatedLayout } from '@/components/layouts/authenticated-layout';
import { 
  Users, 
  Building2, 
  FileText, 
  BarChart3,
  Activity,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Settings,
  UserCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
  // Données mock pour éviter les problèmes tRPC
  const mockStats = {
    totalUsers: 1547,
    activeRequests: 34,
    completedToday: 12,
    pendingReview: 8,
    organizationName: 'Administration Gabonaise'
  };

  const mockDailyActivity = [
    { jour: 'Lun', demandes: 45, traitees: 38 },
    { jour: 'Mar', demandes: 52, traitees: 49 },
    { jour: 'Mer', demandes: 48, traitees: 44 },
    { jour: 'Jeu', demandes: 61, traitees: 58 },
    { jour: 'Ven', demandes: 55, traitees: 52 },
    { jour: 'Sam', demandes: 23, traitees: 20 },
    { jour: 'Dim', demandes: 18, traitees: 15 }
  ];

  const mockTopServices = [
    { name: 'Passeports', total: 234, completed: 198, pending: 36 },
    { name: 'Cartes d\'identité', total: 189, completed: 165, pending: 24 },
    { name: 'Actes de naissance', total: 156, completed: 142, pending: 14 },
    { name: 'Permis de conduire', total: 98, completed: 89, pending: 9 },
    { name: 'Visas', total: 76, completed: 68, pending: 8 }
  ];

  const mockRecentActivity = [
    {
      id: 1,
      type: 'request_completed',
      message: 'Demande de passeport complétée',
      user: 'Marie Ondo',
      time: '10:30',
      status: 'success'
    },
    {
      id: 2,
      type: 'user_registered',
      message: 'Nouvel utilisateur inscrit',
      user: 'Jean Mbou',
      time: '09:45',
      status: 'info'
    },
    {
      id: 3,
      type: 'document_uploaded',
      message: 'Document vérifié',
      user: 'Admin DGDI',
      time: '08:15',
      status: 'warning'
    }
  ];

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Tableau de bord administrateur</h1>
            <p className="text-muted-foreground">
              Vue d'ensemble de {mockStats.organizationName}
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              Configurer
            </Button>
            <Button>
              <BarChart3 className="mr-2 h-4 w-4" />
              Rapports
            </Button>
          </div>
        </div>

        {/* Métriques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Utilisateurs actifs
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.totalUsers.toLocaleString()}</div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span>+12% ce mois</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Demandes en cours
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.activeRequests}</div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3 text-orange-500" />
                <span>Temps moyen: 2.3j</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Traitées aujourd'hui
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.completedToday}</div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <Activity className="h-3 w-3 text-green-500" />
                <span>+8% vs hier</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                En attente de révision
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.pendingReview}</div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3 text-yellow-500" />
                <span>Nécessite attention</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Graphiques et analyses */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Activité quotidienne */}
          <Card>
            <CardHeader>
              <CardTitle>Activité des 7 derniers jours</CardTitle>
              <CardDescription>
                Demandes reçues vs traitées
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={mockDailyActivity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="jour" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="demandes" fill="#3b82f6" name="Demandes" />
                  <Bar dataKey="traitees" fill="#10b981" name="Traitées" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Services les plus demandés */}
          <Card>
            <CardHeader>
              <CardTitle>Services les plus demandés</CardTitle>
              <CardDescription>
                Top 5 des services ce mois
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockTopServices.map((service, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{service.name}</span>
                      <span className="text-muted-foreground">
                        {service.total} demandes
                      </span>
                    </div>
                    <Progress 
                      value={(service.completed / service.total) * 100} 
                      className="h-2" 
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{service.completed} complétées</span>
                      <span>{service.pending} en cours</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activité récente et actions rapides */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Activité récente */}
          <Card>
            <CardHeader>
              <CardTitle>Activité récente</CardTitle>
              <CardDescription>
                Dernières actions dans le système
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockRecentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.status === 'success' ? 'bg-green-500' :
                      activity.status === 'warning' ? 'bg-yellow-500' :
                      'bg-blue-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{activity.message}</p>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <span>{activity.user}</span>
                        <span>•</span>
                        <span>{activity.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Actions rapides */}
          <Card>
            <CardHeader>
              <CardTitle>Actions rapides</CardTitle>
              <CardDescription>
                Raccourcis pour les tâches courantes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-20 flex-col space-y-2">
                  <Users className="h-5 w-5" />
                  <span className="text-xs">Gérer utilisateurs</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col space-y-2">
                  <FileText className="h-5 w-5" />
                  <span className="text-xs">Nouvelle demande</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col space-y-2">
                  <BarChart3 className="h-5 w-5" />
                  <span className="text-xs">Statistiques</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col space-y-2">
                  <Settings className="h-5 w-5" />
                  <span className="text-xs">Paramètres</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col space-y-2">
                  <Building2 className="h-5 w-5" />
                  <span className="text-xs">Organisations</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col space-y-2">
                  <UserCheck className="h-5 w-5" />
                  <span className="text-xs">Approuver</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Statut du système */}
        <Card>
          <CardHeader>
            <CardTitle>Statut du système</CardTitle>
            <CardDescription>
              État des services et performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">99.8%</div>
                <p className="text-sm text-muted-foreground">Disponibilité</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">1.2s</div>
                <p className="text-sm text-muted-foreground">Temps de réponse</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">847</div>
                <p className="text-sm text-muted-foreground">Agents connectés</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}