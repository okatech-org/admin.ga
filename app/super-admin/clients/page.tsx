'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AuthenticatedLayout } from '@/components/layouts/authenticated-layout';
import {
  Building2,
  Users,
  Plus,
  AlertCircle
} from 'lucide-react';

export default function SuperAdminClientsPage() {
  return (
    <AuthenticatedLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                <Building2 className="h-8 w-8 text-blue-600" />
                Gestion des Clients
              </h1>
              <p className="text-gray-600">
                Module de gestion des clients en développement
              </p>
            </div>
          </div>
        </div>

        {/* Message principal */}
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                <AlertCircle className="h-8 w-8 text-orange-600" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Fonctionnalité en développement
            </h2>

            <p className="text-gray-600 mb-6">
              Le module de gestion des clients n'est pas encore disponible.
              Cette fonctionnalité sera implémentée dans une prochaine version.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="outline" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Voir les organismes existants
              </Button>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Créer un nouveau client
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Fonctionnalités à venir */}
        <div className="mt-12 max-w-4xl mx-auto">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">
            Fonctionnalités prévues
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Building2 className="h-5 w-5 text-blue-600" />
                </div>
                <h4 className="font-semibold mb-2">Gestion des organismes clients</h4>
                <p className="text-sm text-gray-600">
                  Créer, modifier et gérer les informations des organismes clients
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-5 w-5 text-green-600" />
                </div>
                <h4 className="font-semibold mb-2">Gestion des contrats</h4>
                <p className="text-sm text-gray-600">
                  Suivre les contrats, renouvellements et facturation
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <AlertCircle className="h-5 w-5 text-purple-600" />
                </div>
                <h4 className="font-semibold mb-2">Suivi des activités</h4>
                <p className="text-sm text-gray-600">
                  Historique des actions et utilisation des services
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
