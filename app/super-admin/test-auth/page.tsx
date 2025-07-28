/* @ts-nocheck */
'use client';

import { useSession } from 'next-auth/react';
import { AuthenticatedLayout } from '@/components/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Shield, CheckCircle, AlertCircle } from 'lucide-react';

export default function TestAuthPage() {
  const { data: session, status } = useSession();

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Shield className="h-8 w-8 text-red-500" />
          <h1 className="text-3xl font-bold">Test d'Authentification Super Admin</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>État de la Session</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-medium">Status:</span>
              <Badge variant={status === 'authenticated' ? 'default' : 'secondary'}>
                {status}
              </Badge>
            </div>

            {session && (
              <>
                <div className="space-y-2">
                  <div><strong>Email:</strong> {session.user?.email}</div>
                  <div><strong>Nom:</strong> {`${session.user?.firstName || ''} ${session.user?.lastName || ''}`}</div>
                  <div><strong>Rôle:</strong> {session.user?.role}</div>
                  <div><strong>Organisation:</strong> {typeof session.user?.organization === 'object' ? session.user?.organization?.name : (session.user?.organization || 'Aucune')}</div>
                </div>

                <div className="flex items-center gap-2 mt-4">
                  {session.user?.role === 'SUPER_ADMIN' ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-green-600 font-medium">
                        ✅ Vous êtes bien connecté en tant que Super Admin
                      </span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-5 w-5 text-red-500" />
                      <span className="text-red-600 font-medium">
                        ❌ Vous n'êtes pas connecté en tant que Super Admin
                      </span>
                    </>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test des Routes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Cliquez sur ces boutons pour tester l'accès aux différentes pages :
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <Button asChild>
                <Link href="/super-admin/dashboard">
                  Dashboard Super Admin
                </Link>
              </Button>
              
              <Button asChild variant="outline">
                <Link href="/super-admin/administrations">
                  Administrations
                </Link>
              </Button>
              
              <Button asChild variant="outline">
                <Link href="/super-admin/services">
                  Services Publics
                </Link>
              </Button>
              
              <Button asChild variant="outline">
                <Link href="/super-admin/organisme/nouveau">
                  Créer Organisme
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informations de Connexion</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Pour vous connecter en tant que Super Admin, utilisez :
            </p>
            <div className="bg-muted p-4 rounded-lg space-y-2 font-mono text-sm">
              <div><strong>Email:</strong> superadmin@admin.ga</div>
              <div><strong>Mot de passe:</strong> SuperAdmin2024!</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
} 