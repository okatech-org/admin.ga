/* @ts-nocheck */
'use client';

import { AuthenticatedLayout } from '@/components/layouts/authenticated-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Plus, FileText, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function NouvelOrganismePage() {
  const handleCreerOrganisme = () => {
    toast.success('Fonctionnalité en cours de développement...');
  };

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        {/* Navigation contextuelle */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold mb-1">🏢 Gestion des Organismes</h3>
                <p className="text-sm text-muted-foreground">Naviguez entre les différents volets de gestion</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" asChild>
                  <Link href="/super-admin/administrations">
                    <Building2 className="mr-2 h-4 w-4" />
                    Administrations
                  </Link>
                </Button>
                <Button variant="default" asChild>
                  <Link href="/super-admin/organisme/nouveau">
                    <Plus className="mr-2 h-4 w-4" />
                    Créer Organisme
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/super-admin/services">
                    <FileText className="mr-2 h-4 w-4" />
                    Services Publics
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* En-tête */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/super-admin/administrations">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Building2 className="h-8 w-8 text-blue-500" />
                Créer un Nouvel Organisme
              </h1>
              <p className="text-muted-foreground">
                Configuration complète et modulaire d'un organisme public
              </p>
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="col-span-full">
            <CardHeader>
              <CardTitle>🚧 Fonctionnalité en Développement</CardTitle>
              <CardDescription>
                La création d'organismes sera bientôt disponible avec toutes les fonctionnalités avancées.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center py-12">
                <Building2 className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
                <h3 className="text-xl font-semibold mb-4">Interface de Création Avancée</h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Cette page permettra de créer des organismes de manière modulaire et flexible, 
                  avec configuration complète des services, utilisateurs, et paramètres avancés.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
                  <div className="p-4 border rounded-lg">
                    <Building2 className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                    <h4 className="font-medium">Informations Générales</h4>
                    <p className="text-sm text-muted-foreground">Identité, contact, responsable</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <FileText className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <h4 className="font-medium">Services Proposés</h4>
                    <p className="text-sm text-muted-foreground">Configuration des services publics</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <Plus className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                    <h4 className="font-medium">Comptes Utilisateurs</h4>
                    <p className="text-sm text-muted-foreground">Création des comptes du personnel</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <Building2 className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                    <h4 className="font-medium">Configuration Avancée</h4>
                    <p className="text-sm text-muted-foreground">Paramètres et workflows</p>
                  </div>
                </div>

                <div className="flex gap-4 justify-center">
                  <Button onClick={handleCreerOrganisme}>
                    <Plus className="mr-2 h-4 w-4" />
                    Créer Organisme (Bientôt)
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/super-admin/administrations">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Retour aux Administrations
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthenticatedLayout>
  );
} 