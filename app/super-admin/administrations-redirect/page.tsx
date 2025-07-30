'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ArrowRight, Building2 } from 'lucide-react';

export default function AdministrationsRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirection automatique après 2 secondes
    const timer = setTimeout(() => {
      router.replace('/super-admin/organismes');
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-96">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Building2 className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle className="flex items-center justify-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            Redirection en cours...
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            La page <strong>Administrations</strong> a été fusionnée avec<br />
            <strong>Gestion des Organismes</strong> pour une meilleure expérience
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-blue-600">
            <span>Redirection automatique</span>
            <ArrowRight className="h-4 w-4" />
            <span>Gestion des Organismes</span>
          </div>
          <button
            onClick={() => router.replace('/super-admin/organismes')}
            className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Accéder maintenant
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
