/* @ts-nocheck */
'use client';

import { getAllAdministrations, getAllServices } from '@/lib/data/gabon-administrations';
import { AuthenticatedLayout } from '@/components/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, FileText, MapPin, Users } from 'lucide-react';

export default function DiagnosticAdministrationsPage() {
  const allAdministrations = getAllAdministrations();
  const allServices = getAllServices();
  
  // Analyse par type
  const analyseParType = {};
  allAdministrations.forEach(admin => {
    const type = admin.type || 'AUTRE';
    if (!analyseParType[type]) {
      analyseParType[type] = {
        count: 0,
        administrations: [],
        totalServices: 0
      };
    }
    analyseParType[type].count++;
    analyseParType[type].administrations.push(admin);
    analyseParType[type].totalServices += admin.services?.length || 0;
  });

  // Analyse par localisation
  const analyseParLocalisation = {};
  allAdministrations.forEach(admin => {
    const loc = admin.localisation || 'Non spécifié';
    analyseParLocalisation[loc] = (analyseParLocalisation[loc] || 0) + 1;
  });

  return (
    <AuthenticatedLayout>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center gap-3">
          <Building2 className="h-8 w-8 text-blue-500" />
          <div>
            <h1 className="text-3xl font-bold">Diagnostic Complet des Administrations</h1>
            <p className="text-muted-foreground">
              Analyse exhaustive de toutes les administrations gabonaises chargées
            </p>
          </div>
        </div>

        {/* Statistiques globales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Building2 className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Total Administrations</p>
                  <p className="text-3xl font-bold text-blue-600">{allAdministrations.length}</p>
                  <p className="text-xs text-green-600">Toutes catégories</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Total Services</p>
                  <p className="text-3xl font-bold text-green-600">{allServices.length}</p>
                  <p className="text-xs text-green-600">Services uniques</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-purple-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Types d'Org.</p>
                  <p className="text-3xl font-bold text-purple-600">{Object.keys(analyseParType).length}</p>
                  <p className="text-xs text-green-600">Catégories</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <MapPin className="h-8 w-8 text-orange-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Localisations</p>
                  <p className="text-3xl font-bold text-orange-600">{Object.keys(analyseParLocalisation).length}</p>
                  <p className="text-xs text-green-600">Villes/Régions</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="types" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="types">Par Type</TabsTrigger>
            <TabsTrigger value="localisation">Par Localisation</TabsTrigger>
            <TabsTrigger value="liste">Liste Complète</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
          </TabsList>

          {/* Analyse par type */}
          <TabsContent value="types" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Répartition par Type d'Administration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(analyseParType).map(([type, data]: [string, any]) => (
                    <Card key={type} className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <Badge variant="outline">{type}</Badge>
                        <span className="font-bold text-xl">{data.count}</span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Services:</span>
                          <span className="font-medium">{data.totalServices}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {data.administrations.slice(0, 3).map((admin: any) => admin.nom).join(', ')}
                          {data.administrations.length > 3 && ` +${data.administrations.length - 3} autres...`}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analyse par localisation */}
          <TabsContent value="localisation" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Répartition par Localisation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(analyseParLocalisation)
                    .sort(([,a], [,b]) => (b as number) - (a as number))
                    .map(([localisation, count]: [string, any]) => (
                    <div key={localisation} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-orange-500" />
                        <span className="font-medium">{localisation}</span>
                      </div>
                      <Badge>{count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Liste complète */}
          <TabsContent value="liste" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Liste Complète des Administrations ({allAdministrations.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {allAdministrations.map((admin, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded hover:bg-muted/50">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">{admin.type}</Badge>
                          <div>
                            <h4 className="font-semibold">{admin.nom}</h4>
                            <p className="text-sm text-muted-foreground">
                              {admin.code} • {admin.localisation} • {admin.services?.length || 0} services
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        #{index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Services */}
          <TabsContent value="services" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Tous les Services ({allServices.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-96 overflow-y-auto">
                  {allServices.map((service, index) => (
                    <div key={index} className="p-2 border rounded text-sm">
                      {service}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AuthenticatedLayout>
  );
} 