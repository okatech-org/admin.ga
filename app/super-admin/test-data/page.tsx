/* @ts-nocheck */
'use client';

import { getAllAdministrations, getAllServices } from '@/lib/data/gabon-administrations';
import { AuthenticatedLayout } from '@/components/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TestDataPage() {
  const allAdministrations = getAllAdministrations();
  const allServicesFromJSON = getAllServices();
  
  console.log('🔍 Page Test - Organismes:', allAdministrations.length);
  console.log('🔍 Page Test - Services:', allServicesFromJSON.length);

  return (
    <AuthenticatedLayout>
      <div className="container mx-auto p-6 space-y-6">
        <h1 className="text-3xl font-bold">Test de Chargement des Données</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Organismes Chargés</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-blue-600">
                {allAdministrations.length}
              </div>
              <p className="text-sm text-muted-foreground">
                Total organismes du fichier JSON
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Services Chargés</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-green-600">
                {allServicesFromJSON.length}
              </div>
              <p className="text-sm text-muted-foreground">
                Total services extraits
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Premiers Organismes (pour vérification)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {allAdministrations.slice(0, 10).map((org, index) => (
                <div key={index} className="p-3 border rounded">
                  <div className="font-medium">{org.nom}</div>
                  <div className="text-sm text-muted-foreground">
                    Type: {org.type} | Code: {org.code} | Services: {org.services?.length || 0}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
} 