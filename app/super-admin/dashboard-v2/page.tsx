'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ArrowRight, BarChart3 } from 'lucide-react';

export default function DashboardV2Redirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirection automatique après 2 secondes
    const timer = setTimeout(() => {
      router.replace('/super-admin/dashboard-unified');
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-96">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            Analytics Intégrées
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
          <p className="text-gray-600">
            Les <strong>Analytics Avancées</strong> sont maintenant<br />
            intégrées dans le <strong>Dashboard Unifié</strong>
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-blue-600">
            <span>Analytics V2</span>
            <ArrowRight className="h-4 w-4" />
            <span>Dashboard Unifié</span>
          </div>
          <button
            onClick={() => router.replace('/super-admin/dashboard-unified')}
            className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Accéder aux Analytics
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
