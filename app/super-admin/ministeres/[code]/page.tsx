'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Building2, FileText, Users, Workflow } from 'lucide-react';
import Link from 'next/link';
import { TableauBordMinistere } from '@/components/dashboards/tableau-bord-ministere';
// import { ValidationHierarchique } from '@/components/workflows/validation-hierarchique';

export default function PageMinistere() {
  const params = useParams();
  const ministereCode = params.code as string;
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Navigation */}
        <div className="flex items-center space-x-4">
          <Link href="/super-admin/organismes">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux Organismes
            </Button>
          </Link>
          <div className="flex items-center space-x-2">
            <Building2 className="h-6 w-6 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">
              Ministère {ministereCode.toUpperCase()}
            </h1>
          </div>
        </div>

        {/* Onglets principaux */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <Building2 className="h-4 w-4" />
              <span>Tableau de Bord</span>
            </TabsTrigger>
            <TabsTrigger value="personnel" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Personnel</span>
            </TabsTrigger>
            <TabsTrigger value="workflows" className="flex items-center space-x-2">
              <Workflow className="h-4 w-4" />
              <span>Workflows</span>
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Documents</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-6">
            <TableauBordMinistere ministereCode={ministereCode} />
          </TabsContent>

          <TabsContent value="personnel" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Gestion du Personnel</CardTitle>
                <CardDescription>
                  Gestion des ressources humaines du ministère {ministereCode.toUpperCase()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Effectif Total</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-blue-600">247</div>
                      <p className="text-xs text-gray-600">agents en poste</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Postes Vacants</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-orange-600">12</div>
                      <p className="text-xs text-gray-600">à pourvoir</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Formations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">8</div>
                      <p className="text-xs text-gray-600">en cours</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Actions Rapides</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    <Button variant="outline" className="justify-start">
                      <Users className="h-4 w-4 mr-2" />
                      Annuaire du Personnel
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <FileText className="h-4 w-4 mr-2" />
                      Demandes de Congé
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <Building2 className="h-4 w-4 mr-2" />
                      Organigramme
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <FileText className="h-4 w-4 mr-2" />
                      Évaluations
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="workflows" className="mt-6">
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold mb-2">Workflows de Validation</h3>
              <p className="text-muted-foreground">
                Composant temporairement désactivé pour correction
              </p>
            </div>
            {/* <ValidationHierarchique
              organisationId={ministereCode}
              utilisateurRole="DIRECTEUR_ADJOINT"
            /> */}
          </TabsContent>

          <TabsContent value="documents" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Gestion Documentaire</CardTitle>
                <CardDescription>
                  Système de gestion des documents du ministère {ministereCode.toUpperCase()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Documents Actifs</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-blue-600">1,247</div>
                      <p className="text-xs text-gray-600">en circulation</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">En Attente</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-orange-600">23</div>
                      <p className="text-xs text-gray-600">validation</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Archivés</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-gray-600">5,842</div>
                      <p className="text-xs text-gray-600">documents</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Dernière Semaine</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">67</div>
                      <p className="text-xs text-gray-600">nouveaux</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Types de Documents</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 border rounded">
                        <span className="text-sm font-medium">Correspondances</span>
                        <span className="text-sm text-gray-600">847 docs</span>
                      </div>
                      <div className="flex justify-between items-center p-3 border rounded">
                        <span className="text-sm font-medium">Rapports</span>
                        <span className="text-sm text-gray-600">156 docs</span>
                      </div>
                      <div className="flex justify-between items-center p-3 border rounded">
                        <span className="text-sm font-medium">Décisions</span>
                        <span className="text-sm text-gray-600">89 docs</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 border rounded">
                        <span className="text-sm font-medium">Projets</span>
                        <span className="text-sm text-gray-600">45 docs</span>
                      </div>
                      <div className="flex justify-between items-center p-3 border rounded">
                        <span className="text-sm font-medium">Budgets</span>
                        <span className="text-sm text-gray-600">23 docs</span>
                      </div>
                      <div className="flex justify-between items-center p-3 border rounded">
                        <span className="text-sm font-medium">Autres</span>
                        <span className="text-sm text-gray-600">87 docs</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Actions Rapides</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    <Button variant="outline" className="justify-start">
                      <FileText className="h-4 w-4 mr-2" />
                      Nouveau Document
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <FileText className="h-4 w-4 mr-2" />
                      Recherche Avancée
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <FileText className="h-4 w-4 mr-2" />
                      Templates
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <FileText className="h-4 w-4 mr-2" />
                      Archives
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
