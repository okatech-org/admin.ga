/* @ts-nocheck */
'use client';

import { getAllAdministrations, getAllServices } from '@/lib/data/gabon-administrations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function DebugOrgsPage() {
  const allAdministrations = getAllAdministrations();
  const allServices = getAllServices();
  
  // Comptage par type
  const typeCount = {};
  allAdministrations.forEach(org => {
    const type = org.type || 'Autre';
    typeCount[type] = (typeCount[type] || 0) + 1;
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Debug - Organismes Gabonais</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Statistiques</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div><strong>Total organismes:</strong> {allAdministrations.length}</div>
              <div><strong>Total services:</strong> {allServices.length}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Répartition par Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(typeCount).map(([type, count]) => (
                <div key={type} className="flex justify-between">
                  <Badge variant="outline">{type}</Badge>
                  <span className="font-bold">{String(count)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des Organismes (premiers 20)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {allAdministrations.slice(0, 20).map((org, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded">
                <div>
                  <div className="font-medium">{org.nom}</div>
                  <div className="text-sm text-muted-foreground">
                    {org.type} • {org.localisation} • {org.services?.length || 0} services
                  </div>
                </div>
                <Badge>{org.code || 'NO_CODE'}</Badge>
              </div>
            ))}
            {allAdministrations.length > 20 && (
              <div className="text-center p-4 text-muted-foreground">
                ... et {allAdministrations.length - 20} autres organismes
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 