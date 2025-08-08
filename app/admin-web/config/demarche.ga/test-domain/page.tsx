'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft,
  Globe,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Loader2,
  Eye,
  RefreshCw,
  Settings,
  Shield,
  Zap
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface DomainValidation {
  domain: {
    valid: boolean;
    message: string;
  };
  subdomain: {
    valid: boolean;
    message: string;
  };
  availability: {
    available: boolean;
    message: string;
  };
  dns: {
    valid: boolean;
    message: string;
    records: any;
  };
  ssl: {
    valid: boolean;
    message: string;
    certificate: any;
  };
}

interface TestResult {
  test: string;
  status: 'success' | 'warning' | 'error';
  message: string;
  details?: any;
}

export default function TestDomainPage() {
  const [testDomain, setTestDomain] = useState('');
  const [testSubdomain, setTestSubdomain] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [validation, setValidation] = useState<DomainValidation | null>(null);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [currentDomainConfig, setCurrentDomainConfig] = useState<any>(null);

  // Charger la configuration du domaine actuel
  useEffect(() => {
    const loadCurrentConfig = async () => {
      try {
        const response = await fetch('/api/domain-config');
        if (response.ok) {
          const config = await response.json();
          setCurrentDomainConfig(config);
        }
      } catch (error) {
        console.error('Erreur lors du chargement de la configuration:', error);
      }
    };

    loadCurrentConfig();
  }, []);

  const validateDomain = async () => {
    if (!testDomain) {
      toast.error('Veuillez saisir un domaine');
      return;
    }

    setIsValidating(true);
    try {
      const response = await fetch('/api/domains/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          domain: testDomain,
          subdomain: testSubdomain || undefined,
          checkDNS: true,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setValidation(result.validation);
        toast.success(`Score de validation: ${result.score.toFixed(0)}%`);
      } else {
        const error = await response.json();
        toast.error(error.error || 'Erreur lors de la validation');
      }
    } catch (error) {
      toast.error('Erreur de connexion');
    } finally {
      setIsValidating(false);
    }
  };

  const runSystemTests = async () => {
    setIsTesting(true);
    const results: TestResult[] = [];

    try {
      // Test 1: Vérifier l'API des domaines
      try {
        const response = await fetch('/api/domains');
        if (response.ok) {
          results.push({
            test: 'API des domaines',
            status: 'success',
            message: 'API accessible et fonctionnelle',
          });
        } else {
          results.push({
            test: 'API des domaines',
            status: 'error',
            message: `Erreur HTTP ${response.status}`,
          });
        }
      } catch (error) {
        results.push({
          test: 'API des domaines',
          status: 'error',
          message: 'Impossible de contacter l\'API',
        });
      }

      // Test 2: Vérifier la configuration du domaine actuel
      try {
        const response = await fetch('/api/domain-config');
        if (response.ok) {
          const config = await response.json();
          results.push({
            test: 'Configuration du domaine',
            status: 'success',
            message: `Configuration chargée pour ${config.domain}`,
            details: config,
          });
        } else {
          results.push({
            test: 'Configuration du domaine',
            status: 'warning',
            message: 'Configuration par défaut utilisée',
          });
        }
      } catch (error) {
        results.push({
          test: 'Configuration du domaine',
          status: 'error',
          message: 'Erreur lors du chargement de la configuration',
        });
      }

      // Test 3: Vérifier les permissions super admin
      try {
        const response = await fetch('/api/domains', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            domain: 'test-validation.ga',
            customization: {
              primaryColor: '#ff0000',
              title: 'Test de validation',
              description: 'Test automatique du système',
            },
            features: {
              enableRegistration: false,
              enableAPIAccess: true,
              multipleLanguages: false,
              enabledLanguages: ['fr'],
              maintenanceMode: false,
              enableGuestAccess: false,
            },
            isActive: false,
          }),
        });

        if (response.status === 403) {
          results.push({
            test: 'Permissions super admin',
            status: 'warning',
            message: 'Accès restreint (normal si non connecté en super admin)',
          });
        } else if (response.ok) {
          results.push({
            test: 'Permissions super admin',
            status: 'success',
            message: 'Permissions super admin confirmées',
          });

          // Nettoyer le domaine de test créé
          try {
            await fetch(`/api/domains/${encodeURIComponent('test-validation.ga')}`, {
              method: 'DELETE',
            });
          } catch (error) {
            // Ignore cleanup errors
          }
        } else {
          const error = await response.json();
          results.push({
            test: 'Permissions super admin',
            status: 'error',
            message: error.error || 'Erreur lors du test des permissions',
          });
        }
      } catch (error) {
        results.push({
          test: 'Permissions super admin',
          status: 'error',
          message: 'Erreur de connexion lors du test des permissions',
        });
      }

      // Test 4: Vérifier le middleware
      try {
        const currentHost = window.location.hostname;
        results.push({
          test: 'Détection du domaine',
          status: 'success',
          message: `Domaine détecté: ${currentHost}`,
          details: { hostname: currentHost },
        });
      } catch (error) {
        results.push({
          test: 'Détection du domaine',
          status: 'error',
          message: 'Erreur lors de la détection du domaine',
        });
      }

      setTestResults(results);

      const successCount = results.filter(r => r.status === 'success').length;
      const totalCount = results.length;
      toast.success(`Tests terminés: ${successCount}/${totalCount} réussis`);

    } catch (error) {
      toast.error('Erreur lors de l\'exécution des tests');
    } finally {
      setIsTesting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Loader2 className="w-5 h-5 animate-spin text-blue-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'error':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin-web/config/demarche.ga">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Configuration DEMARCHE.GA
                </Link>
              </Button>
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Test du Système de Domaines</h1>
                  <p className="text-sm text-gray-600">Validation et diagnostic DEMARCHE.GA</p>
                </div>
              </div>
            </div>
            <Badge variant="secondary">Version Test</Badge>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <Tabs defaultValue="validation" className="space-y-6">
          <TabsList className="grid grid-cols-3 w-fit">
            <TabsTrigger value="validation" className="flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span>Validation</span>
            </TabsTrigger>
            <TabsTrigger value="tests" className="flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>Tests système</span>
            </TabsTrigger>
            <TabsTrigger value="info" className="flex items-center space-x-2">
              <Eye className="w-4 h-4" />
              <span>Informations</span>
            </TabsTrigger>
          </TabsList>

          {/* Validation de domaine */}
          <TabsContent value="validation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Globe className="w-5 h-5" />
                  <span>Validation de Domaine</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Domaine à tester *</label>
                    <Input
                      placeholder="exemple.ga"
                      value={testDomain}
                      onChange={(e) => setTestDomain(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Sous-domaine (optionnel)</label>
                    <Input
                      placeholder="organisme"
                      value={testSubdomain}
                      onChange={(e) => setTestSubdomain(e.target.value)}
                    />
                  </div>
                </div>

                <Button onClick={validateDomain} disabled={isValidating} className="w-full">
                  {isValidating ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Shield className="w-4 h-4 mr-2" />
                  )}
                  Valider le domaine
                </Button>

                {validation && (
                  <div className="space-y-4 mt-6">
                    <h3 className="font-semibold">Résultats de validation :</h3>

                    <div className="grid gap-4">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(validation.domain.valid ? 'success' : 'error')}
                          <div>
                            <p className="font-medium">Format du domaine</p>
                            <p className="text-sm text-gray-600">{validation.domain.message}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(validation.subdomain.valid ? 'success' : 'error')}
                          <div>
                            <p className="font-medium">Sous-domaine</p>
                            <p className="text-sm text-gray-600">{validation.subdomain.message}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(validation.availability.available ? 'success' : 'warning')}
                          <div>
                            <p className="font-medium">Disponibilité</p>
                            <p className="text-sm text-gray-600">{validation.availability.message}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(validation.dns.valid ? 'success' : 'warning')}
                          <div>
                            <p className="font-medium">DNS</p>
                            <p className="text-sm text-gray-600">{validation.dns.message}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(validation.ssl.valid ? 'success' : 'warning')}
                          <div>
                            <p className="font-medium">SSL</p>
                            <p className="text-sm text-gray-600">{validation.ssl.message}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tests système */}
          <TabsContent value="tests" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="w-5 h-5" />
                  <span>Tests du Système</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={runSystemTests} disabled={isTesting} className="w-full">
                  {isTesting ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4 mr-2" />
                  )}
                  Lancer les tests système
                </Button>

                {testResults.length > 0 && (
                  <div className="space-y-4 mt-6">
                    <h3 className="font-semibold">Résultats des tests :</h3>

                    <div className="space-y-3">
                      {testResults.map((result, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            {getStatusIcon(result.status)}
                            <div>
                              <p className="font-medium">{result.test}</p>
                              <p className="text-sm text-gray-600">{result.message}</p>
                            </div>
                          </div>
                          <Badge className={`text-xs ${getStatusColor(result.status)}`}>
                            {result.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Informations système */}
          <TabsContent value="info" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Eye className="w-5 h-5" />
                  <span>Configuration Actuelle</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {currentDomainConfig ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Domaine</label>
                        <p className="text-lg font-semibold">{currentDomainConfig.domain}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Titre</label>
                        <p className="text-lg font-semibold">{currentDomainConfig.title}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Couleur principale</label>
                        <div className="flex items-center space-x-2">
                          <div
                            className="w-6 h-6 rounded border"
                            style={{ backgroundColor: currentDomainConfig.primaryColor }}
                          ></div>
                          <span className="font-mono text-sm">{currentDomainConfig.primaryColor}</span>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Statut</label>
                        <Badge className={getStatusColor(currentDomainConfig.isActive ? 'success' : 'error')}>
                          {currentDomainConfig.isActive ? 'Actif' : 'Inactif'}
                        </Badge>
                      </div>
                    </div>

                    {currentDomainConfig.organizationName && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Organisation</label>
                        <p>{currentDomainConfig.organizationName}</p>
                      </div>
                    )}

                    <div>
                      <label className="text-sm font-medium text-gray-600">Fonctionnalités activées</label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {Object.entries(currentDomainConfig.features).map(([key, value]) =>
                          value && (
                            <Badge key={key} variant="outline" className="text-xs">
                              {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                            </Badge>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600">Chargement de la configuration...</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Cette page de test permet de valider le bon fonctionnement du système de configuration des domaines.
                Utilisez-la pour diagnostiquer les problèmes et vérifier les nouvelles configurations.
              </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
