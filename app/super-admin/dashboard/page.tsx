'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ArrowRight } from 'lucide-react';

export default function DashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirection immédiate vers la nouvelle interface moderne
    router.replace('/super-admin');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-96">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            Redirection en cours...
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            Chargement de la nouvelle<br />
            <strong>Interface Super Admin Moderne</strong>
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-blue-600">
            <span>Interface simplifiée</span>
            <ArrowRight className="h-4 w-4" />
            <span>Pour novices</span>
          </div>
          <button
            onClick={() => router.replace('/super-admin')}
            className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Accéder maintenant
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
