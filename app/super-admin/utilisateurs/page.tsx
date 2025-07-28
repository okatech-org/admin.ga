/* @ts-nocheck */
'use client';

import { AuthenticatedLayout } from '@/components/layouts/authenticated-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Building2, Plus, FileText } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function SuperAdminUtilisateursPage() {
  const handleGererUtilisateurs = () => {
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
                <Button variant="outline" asChild>
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
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Users className="h-8 w-8 text-purple-500" />
              Gestion des Utilisateurs
            </h1>
            <p className="text-muted-foreground">
              Administration des comptes utilisateurs de tous les organismes
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleGererUtilisateurs}>
              <Plus className="mr-2 h-4 w-4" />
              Nouvel Utilisateur
            </Button>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="col-span-full">
            <CardHeader>
              <CardTitle>🚧 Fonctionnalité en Développement</CardTitle>
              <CardDescription>
                La gestion des utilisateurs sera bientôt disponible avec toutes les fonctionnalités avancées.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center py-12">
                <Users className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
                <h3 className="text-xl font-semibold mb-4">Interface de Gestion Avancée</h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Cette page permettra de gérer tous les utilisateurs du système, 
                  avec filtres avancés, attribution de rôles, et gestion des permissions.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
                  <div className="p-4 border rounded-lg">
                    <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                    <h4 className="font-medium">Gestion des Comptes</h4>
                    <p className="text-sm text-muted-foreground">Création, modification, suppression</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <Building2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <h4 className="font-medium">Attribution Organismes</h4>
                    <p className="text-sm text-muted-foreground">Assignation aux organismes</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <Plus className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                    <h4 className="font-medium">Rôles & Permissions</h4>
                    <p className="text-sm text-muted-foreground">Configuration des accès</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <FileText className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                    <h4 className="font-medium">Audit & Logs</h4>
                    <p className="text-sm text-muted-foreground">Traçabilité des actions</p>
                  </div>
                </div>

                <div className="flex gap-4 justify-center">
                  <Button onClick={handleGererUtilisateurs}>
                    <Plus className="mr-2 h-4 w-4" />
                    Gérer Utilisateurs (Bientôt)
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/super-admin/administrations">
                      <Building2 className="mr-2 h-4 w-4" />
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