/* @ts-nocheck */
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthenticatedLayout } from '@/components/layouts/authenticated-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Building2 } from 'lucide-react';

export default function SuperAdminOrganismesPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirection automatique vers la page principale administrations
    const timer = setTimeout(() => {
      router.push('/super-admin/administrations');
    }, 1000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <AuthenticatedLayout>
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <Building2 className="h-12 w-12 text-blue-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Redirection en cours...</h2>
            <p className="text-muted-foreground">
              Vous êtes redirigé vers la page de gestion des administrations.
            </p>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
} 