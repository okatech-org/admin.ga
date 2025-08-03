'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { AuthenticatedLayout } from '@/components/layouts/authenticated-layout';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { toast } from 'sonner';
import {
  Bot,
  Send,
  RefreshCw,
  MessageSquare,
  Cpu,
  Zap,
  CheckCircle,
  XCircle,
  Clock,
  Activity,
  Settings,
  Code,
  FileText,
  Database
} from 'lucide-react';

interface TestResult {
  id: string;
  query: string;
  response: string;
  timestamp: string;
  duration: number;
  status: 'success' | 'error';
}

export default function TestClaudePage() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([
    {
      id: '1',
      query: 'Comment créer un nouvel organisme dans le système ?',
      response: 'Pour créer un nouvel organisme, accédez au menu "Organismes" > "Vue d\'Ensemble" et cliquez sur "Nouvel Organisme". Remplissez les informations requises : nom, code, type, description, et coordonnées de contact.',
      timestamp: '2025-01-15T14:30:00Z',
      duration: 1.2,
      status: 'success'
    },
    {
      id: '2',
      query: 'Expliquer le système de double rattachement',
      response: 'Le système de double rattachement permet à chaque fonctionnaire d\'avoir un organisme d\'origine (tutelle) permanent et un organisme d\'affectation actuelle qui peut changer. Cela respecte la logique administrative gabonaise.',
      timestamp: '2025-01-15T14:25:00Z',
      duration: 0.8,
      status: 'success'
    }
  ]);

  const handleSubmit = async () => {
    if (!query.trim()) {
      toast.error('Veuillez saisir une question');
      return;
    }

    setLoading(true);
    const startTime = Date.now();

    try {
      // Simuler un appel à Claude
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newResult: TestResult = {
        id: Date.now().toString(),
        query: query,
        response: `Réponse simulée de Claude pour: "${query}". Cette interface de test permet de vérifier la connectivité et les performances du système IA.`,
        timestamp: new Date().toISOString(),
        duration: (Date.now() - startTime) / 1000,
        status: 'success'
      };

      setTestResults(prev => [newResult, ...prev]);
      setQuery('');
      toast.success('Test Claude exécuté avec succès');
    } catch (error) {
      const errorResult: TestResult = {
        id: Date.now().toString(),
        query: query,
        response: 'Erreur lors de la communication avec Claude',
        timestamp: new Date().toISOString(),
        duration: (Date.now() - startTime) / 1000,
        status: 'error'
      };

      setTestResults(prev => [errorResult, ...prev]);
      toast.error('Erreur lors du test Claude');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return CheckCircle;
      case 'error': return XCircle;
      default: return Clock;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <AuthenticatedLayout>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Test Interface Claude</h1>
            <p className="text-gray-600 mt-1">
              Interface de test et de diagnostic pour le système IA Claude
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualiser
            </Button>
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Configuration
            </Button>
          </div>
        </div>

        {/* Statistiques de test */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tests Exécutés</p>
                  <p className="text-3xl font-bold text-gray-900">{testResults.length}</p>
                </div>
                <Bot className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Taux de Succès</p>
                  <p className="text-3xl font-bold text-green-600">
                    {Math.round((testResults.filter(r => r.status === 'success').length / testResults.length) * 100)}%
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Temps Moyen</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {testResults.length > 0
                      ? (testResults.reduce((sum, r) => sum + r.duration, 0) / testResults.length).toFixed(1)
                      : '0.0'
                    }s
                  </p>
                </div>
                <Zap className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Statut Service</p>
                  <p className="text-3xl font-bold text-green-600">En ligne</p>
                </div>
                <Activity className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Interface de test */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Interface de Test Claude
            </CardTitle>
            <CardDescription>
              Testez les requêtes vers le système IA Claude
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Question ou requête pour Claude
                </label>
                <Textarea
                  placeholder="Posez une question à Claude sur le système Administration.GA..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  rows={3}
                  className="w-full"
                />
              </div>

              <div className="flex gap-3">
                <Button onClick={handleSubmit} disabled={loading} className="flex-1">
                  {loading ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Test en cours...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Envoyer le test
                    </>
                  )}
                </Button>

                <Button variant="outline">
                  <Code className="h-4 w-4 mr-2" />
                  Exemples
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tests prédéfinis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cpu className="h-5 w-5" />
              Tests Prédéfinis
            </CardTitle>
            <CardDescription>
              Batteries de tests pour valider les fonctionnalités
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="outline" className="justify-start h-auto p-4">
                <div className="text-left">
                  <div className="font-medium">Test Organismes</div>
                  <div className="text-sm text-gray-500">
                    Questions sur la gestion des organismes
                  </div>
                </div>
              </Button>

              <Button variant="outline" className="justify-start h-auto p-4">
                <div className="text-left">
                  <div className="font-medium">Test Utilisateurs</div>
                  <div className="text-sm text-gray-500">
                    Questions sur la gestion des comptes
                  </div>
                </div>
              </Button>

              <Button variant="outline" className="justify-start h-auto p-4">
                <div className="text-left">
                  <div className="font-medium">Test Services</div>
                  <div className="text-sm text-gray-500">
                    Questions sur les services administratifs
                  </div>
                </div>
              </Button>

              <Button variant="outline" className="justify-start h-auto p-4">
                <div className="text-left">
                  <div className="font-medium">Test Performance</div>
                  <div className="text-sm text-gray-500">
                    Tests de charge et de performance
                  </div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Historique des tests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Historique des Tests
            </CardTitle>
            <CardDescription>
              Résultats des derniers tests exécutés
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {testResults.map((result) => {
                const StatusIcon = getStatusIcon(result.status);
                return (
                  <div key={result.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <StatusIcon className={`h-4 w-4 ${getStatusColor(result.status)}`} />
                          <Badge variant="outline" className={
                            result.status === 'success'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }>
                            {result.status.toUpperCase()}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {result.duration.toFixed(2)}s
                          </span>
                        </div>
                        <h4 className="font-medium text-gray-900 mb-2">
                          {result.query}
                        </h4>
                        <p className="text-gray-700 text-sm">
                          {result.response}
                        </p>
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        {new Date(result.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}
