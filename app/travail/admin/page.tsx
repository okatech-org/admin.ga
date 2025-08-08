'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, Users, Briefcase, Building2, BarChart3, Settings, Shield,
  Bell, HelpCircle, Home, Crown, TrendingUp, CheckCircle, AlertTriangle,
  Clock, FileText, Star, MessageSquare, Search, Filter, Download
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';

export default function TravailAdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Données simulées pour l'admin standard
  const adminStats = {
    pendingJobs: 15,
    activeJobs: 234,
    newApplications: 67,
    activeUsers: 1256,
    pendingCompanies: 8,
    todayStats: {
      newJobs: 12,
      newApplications: 45,
      newUsers: 23
    }
  };

  const recentJobs = [
    { id: '1', title: 'Développeur Web', company: 'TechGabon', status: 'pending', date: '2024-01-15' },
    { id: '2', title: 'Comptable', company: 'Finance Pro', status: 'approved', date: '2024-01-14' },
    { id: '3', title: 'Secrétaire', company: 'Bureau Service', status: 'pending', date: '2024-01-14' }
  ];

  const recentApplications = [
    { id: '1', candidate: 'Jean Mbongo', job: 'Développeur Web', status: 'new', date: '2024-01-15' },
    { id: '2', candidate: 'Marie Obame', job: 'Comptable', status: 'reviewed', date: '2024-01-15' },
    { id: '3', candidate: 'Paul Ndong', job: 'Secrétaire', status: 'new', date: '2024-01-14' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Admin Standard */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" asChild className="border-blue-200 text-white hover:bg-blue-50 hover:text-blue-600">
                <Link href="/travail">
                  <Home className="w-4 h-4 mr-2" />
                  TRAVAIL.GA
                </Link>
              </Button>
              <div className="h-6 w-px bg-blue-300"></div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                  <Settings className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Administration TRAVAIL.GA</h1>
                  <p className="text-sm text-blue-100">Gestion quotidienne de la plateforme</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" asChild className="border-blue-200 text-white hover:bg-blue-50 hover:text-blue-600">
                <Link href="/travail/super-admin">
                  <Crown className="w-4 h-4 mr-2" />
                  Super Admin
                </Link>
              </Button>
              <div className="flex items-center space-x-2 px-3 py-1 bg-white/20 text-white rounded-full text-sm">
                <Settings className="w-3 h-3" />
                <span>Administrateur</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Alertes */}
        {adminStats.pendingJobs > 0 && (
          <Alert className="mb-6 bg-orange-50 border-orange-200">
            <AlertTriangle className="w-4 h-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <strong>{adminStats.pendingJobs} emplois</strong> en attente de modération nécessitent votre attention.
            </AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6 h-auto">
            <TabsTrigger value="dashboard" className="flex flex-col items-center space-y-1 h-16">
              <BarChart3 className="w-5 h-5" />
              <span className="text-xs">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="emplois" className="flex flex-col items-center space-y-1 h-16">
              <Briefcase className="w-5 h-5" />
              <span className="text-xs">Emplois</span>
            </TabsTrigger>
            <TabsTrigger value="utilisateurs" className="flex flex-col items-center space-y-1 h-16">
              <Users className="w-5 h-5" />
              <span className="text-xs">Utilisateurs</span>
            </TabsTrigger>
            <TabsTrigger value="entreprises" className="flex flex-col items-center space-y-1 h-16">
              <Building2 className="w-5 h-5" />
              <span className="text-xs">Entreprises</span>
            </TabsTrigger>
            <TabsTrigger value="rapports" className="flex flex-col items-center space-y-1 h-16">
              <FileText className="w-5 h-5" />
              <span className="text-xs">Rapports</span>
            </TabsTrigger>
            <TabsTrigger value="support" className="flex flex-col items-center space-y-1 h-16">
              <HelpCircle className="w-5 h-5" />
              <span className="text-xs">Support</span>
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Admin */}
          <TabsContent value="dashboard" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  <span>Tableau de bord Administration</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Métriques principales */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Clock className="w-8 h-8 text-orange-600" />
                      <div>
                        <div className="text-2xl font-bold text-orange-900">{adminStats.pendingJobs}</div>
                        <div className="text-sm text-orange-600">Emplois en attente</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                      <div>
                        <div className="text-2xl font-bold text-green-900">{adminStats.activeJobs}</div>
                        <div className="text-sm text-green-600">Emplois actifs</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-8 h-8 text-blue-600" />
                      <div>
                        <div className="text-2xl font-bold text-blue-900">{adminStats.newApplications}</div>
                        <div className="text-sm text-blue-600">Nouvelles candidatures</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Users className="w-8 h-8 text-purple-600" />
                      <div>
                        <div className="text-2xl font-bold text-purple-900">{adminStats.activeUsers}</div>
                        <div className="text-sm text-purple-600">Utilisateurs actifs</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Activité du jour */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Activité d'aujourd'hui</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span>Nouveaux emplois</span>
                        <Badge variant="secondary">+{adminStats.todayStats.newJobs}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Nouvelles candidatures</span>
                        <Badge variant="secondary">+{adminStats.todayStats.newApplications}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Nouveaux utilisateurs</span>
                        <Badge variant="secondary">+{adminStats.todayStats.newUsers}</Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Actions rapides</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button className="w-full justify-start" variant="outline">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Modérer emplois ({adminStats.pendingJobs})
                      </Button>
                      <Button className="w-full justify-start" variant="outline">
                        <Users className="w-4 h-4 mr-2" />
                        Valider entreprises ({adminStats.pendingCompanies})
                      </Button>
                      <Button className="w-full justify-start" variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Exporter rapport mensuel
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Gestion des Emplois */}
          <TabsContent value="emplois" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Modération des emplois</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Titre</TableHead>
                      <TableHead>Entreprise</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentJobs.map((job) => (
                      <TableRow key={job.id}>
                        <TableCell className="font-medium">{job.title}</TableCell>
                        <TableCell>{job.company}</TableCell>
                        <TableCell>
                          <Badge variant={job.status === 'pending' ? 'outline' : 'default'}>
                            {job.status === 'pending' ? 'En attente' : 'Approuvé'}
                          </Badge>
                        </TableCell>
                        <TableCell>{job.date}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            {job.status === 'pending' && (
                              <>
                                <Button variant="outline" size="sm">
                                  <CheckCircle className="w-4 h-4" />
                                </Button>
                                <Button variant="outline" size="sm">
                                  <AlertTriangle className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Autres onglets avec contenu basique */}
          <TabsContent value="utilisateurs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des utilisateurs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Fonctionnalité de gestion des utilisateurs</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Pour des fonctions avancées, utilisez le
                    <Link href="/travail/super-admin" className="text-blue-600 hover:underline ml-1">
                      Super Admin
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="entreprises" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Validation des entreprises</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Validation et gestion des entreprises</p>
                  <Badge variant="outline" className="mt-2">
                    {adminStats.pendingCompanies} en attente
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rapports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Rapports et statistiques</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Génération de rapports mensuels</p>
                  <Button variant="outline" className="mt-4">
                    <Download className="w-4 h-4 mr-2" />
                    Télécharger rapport
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="support" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Centre de support</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Support et assistance utilisateurs</p>
                  <Button variant="outline" className="mt-4">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Messages support
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Navigation de retour */}
        <div className="flex items-center justify-between pt-6 border-t bg-white p-6 rounded-lg">
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={() => router.push('/travail')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour à TRAVAIL.GA
            </Button>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" asChild>
              <Link href="/travail/super-admin">
                <Crown className="w-4 h-4 mr-2" />
                Accéder au Super Admin
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
