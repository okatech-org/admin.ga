'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

export function StatsSection() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-48" />; // Placeholder
  }

  return (
    <section className="py-16 bg-gradient-to-br from-red-50 to-orange-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            ⚠️ Composant avec Données Fictives Désactivé
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            ⚠️ DONNÉES FICTIVES SUPPRIMÉES - Ce composant contenait des données fictives polluantes et a été désactivé.<br />
            Utiliser <code className="bg-gray-200 px-2 py-1 rounded">StatsSection</code> de <code>stats-api.tsx</code> à la place.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <div className="space-y-4">
                <div>
                  <strong>Données fictives supprimées :</strong>
                </div>
                <ul className="space-y-1 text-sm">
                  <li>❌ <code>"50,000+ Citoyens inscrits"</code> (complètement fictif)</li>
                  <li>✅ <code>"0 Organismes publics"</code> (base de données entièrement nettoyée)</li>
                  <li>❌ <code>"1,117 Relations actives"</code> (inventé de toute pièce)</li>
                  <li>❌ <code>"98% Satisfaction"</code> (non mesuré, fictif)</li>
                </ul>
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
                  <strong className="text-green-700">✅ Remplacé par :</strong>
                  <ul className="text-sm text-green-600 mt-2 space-y-1">
                    <li>• API <code>/api/super-admin/dashboard-stats</code> avec données réelles</li>
                    <li>• Composant <code>StatsSection</code> dans <code>stats-api.tsx</code></li>
                    <li>• Mise à jour automatique depuis la base de données PostgreSQL</li>
                    <li>• Métriques précises et vérifiables</li>
                  </ul>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </section>
  );
}

// Export par défaut pour compatibilité
export default StatsSection;
