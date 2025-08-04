'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ArrowRight, Zap } from 'lucide-react';

export default function DashboardModernRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirection immédiate vers la nouvelle interface moderne avec données réelles
    router.replace('/super-admin');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-96">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            Redirection vers l'interface moderne...
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-lg font-medium text-blue-600">
            <Zap className="h-5 w-5" />
            <span>Données Réelles en Temps Réel</span>
          </div>
          <p className="text-gray-600">
            Redirection vers la nouvelle interface<br />
            <strong>Super Admin Moderne</strong><br />
            avec données authentiques
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-green-600">
            <span>❌ Anciennes données fictives supprimées</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-blue-600">
            <span>✅ Nouvelles données réelles</span>
            <ArrowRight className="h-4 w-4" />
          </div>
          <button
            onClick={() => router.replace('/super-admin')}
            className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Accéder à l'interface moderne
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
