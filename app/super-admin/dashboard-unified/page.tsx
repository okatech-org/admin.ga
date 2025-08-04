'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, ArrowRight, Sparkles, Crown } from 'lucide-react';

export default function DashboardUnifiedRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirection immédiate vers la nouvelle interface moderne
    const timer = setTimeout(() => {
      router.replace('/super-admin');
    }, 1500);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Card className="w-[500px] shadow-2xl border-blue-200">
        <CardHeader className="text-center pb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Crown className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <Sparkles className="h-6 w-6 text-yellow-500" />
            Mise à Jour Interface
          </CardTitle>
          <CardDescription className="text-base">
            Nouvelle interface super admin moderne
          </CardDescription>
        </CardHeader>

        <CardContent className="text-center space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">✨ Nouveautés</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Navigation simplifiée en 6 sections</li>
              <li>• Recherche intelligente avec Ctrl+K</li>
              <li>• Tour guidé pour les novices</li>
              <li>• Interface optimisée et moderne</li>
            </ul>
          </div>

          <div className="flex items-center justify-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
            <span className="text-gray-600">Chargement de la nouvelle interface...</span>
        </div>

          <div className="flex items-center justify-center gap-2 text-sm text-blue-600">
            <span>Interface classique</span>
            <ArrowRight className="h-4 w-4" />
            <Badge className="bg-green-100 text-green-800">Interface Moderne</Badge>
            </div>

          <div className="space-y-3">
            <Button
              onClick={() => router.replace('/super-admin')}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              size="lg"
            >
              <Crown className="w-4 h-4 mr-2" />
              Accéder à la nouvelle interface
            </Button>

            <p className="text-xs text-gray-500">
              💡 L'ancienne interface reste accessible si nécessaire
            </p>
              </div>
            </CardContent>
          </Card>
        </div>
  );
}
