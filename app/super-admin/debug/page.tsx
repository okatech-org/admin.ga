'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { AuthenticatedLayout } from '@/components/layouts/authenticated-layout';
import {
  Bug,
  Server,
  Database as DatabaseIcon,
  Users,
  Building2,
  Settings,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  Activity,
  BarChart3,
  Code,
  FileText,
  Eye,
  Download,
  Play,
  Zap,
  Monitor,
  HardDrive,
  Clock,
  Shield,
  Network
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

interface SystemHealthCheck {
  component: string;
  status: 'healthy' | 'warning' | 'error';
  message: string;
  details?: string;
  lastCheck?: string;
}

interface DebugToolResult {
  tool: string;
  status: 'success' | 'warning' | 'error';
  message: string;
  data?: any;
  duration?: number;
}

export default function SuperAdminDebugPage() {
  const [isRunningHealthCheck, setIsRunningHealthCheck] = useState(false);
  const [healthChecks, setHealthChecks] = useState<SystemHealthCheck[]>([]);
  const [debugResults, setDebugResults] = useState<DebugToolResult[]>([]);
  const [selectedTab, setSelectedTab] = useState('health');
  const [systemInfo, setSystemInfo] = useState<any>(null);

  // Simulation des vérifications de santé système
  const runSystemHealthCheck = async () => {
    setIsRunningHealthCheck(true);
    toast.info('🔍 Démarrage de la vérification système...');

    // Simulation des checks avec délais
    const checks = [
      { component: 'Base de données', delay: 1000 },
      { component: 'API Gateway', delay: 800 },
      { component: 'Service d\'authentification', delay: 600 },
      { component: 'Stockage fichiers', delay: 700 },
      { component: 'Cache Redis', delay: 500 },
      { component: 'Service de sauvegarde', delay: 900 }
    ];

    const results: SystemHealthCheck[] = [];

    for (const check of checks) {
      await new Promise(resolve => setTimeout(resolve, check.delay));
      
      const statusOptions = ['healthy', 'warning', 'error'] as const;
      const randomStatus = statusOptions[Math.floor(Math.random() * statusOptions.length)];
      
      results.push({
        component: check.component,
        status: randomStatus,
        message: getStatusMessage(randomStatus),
        details: getStatusDetails(check.component, randomStatus),
        lastCheck: new Date().toLocaleTimeString()
      });
      
      setHealthChecks([...results]);
    }

    setIsRunningHealthCheck(false);
    toast.success('✅ Vérification système terminée !');
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'healthy': return 'Fonctionnel';
      case 'warning': return 'Attention requise';
      case 'error': return 'Problème détecté';
      default: return 'Inconnu';
    }
  };

  const getStatusDetails = (component: string, status: string) => {
    if (status === 'healthy') return 'Tous les systèmes fonctionnent normalement';
    if (status === 'warning') return 'Performance légèrement dégradée';
    return 'Service temporairement indisponible';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  // Simulation d'informations système
  const loadSystemInfo = async () => {
    toast.info('📊 Collecte des informations système...');
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setSystemInfo({
      environment: 'Production',
      version: '2.1.4',
      uptime: '15 jours, 3 heures',
      nodeVersion: 'v18.17.0',
      memoryUsage: '1.2 GB / 4 GB',
      cpuUsage: '23%',
      diskSpace: '45 GB / 100 GB',
      activeUsers: 342,
      totalRequests: '1,247,893',
      lastBackup: '02/01/2025 03:00:00'
    });
    
    toast.success('✅ Informations système collectées !');
  };

  // Outils de debug spécialisés
  const runDebugTool = async (toolName: string) => {
    toast.info(`🔧 Exécution de l'outil: ${toolName}...`);
    
    const startTime = Date.now();
    await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1000));
    const duration = Date.now() - startTime;
    
    const statuses = ['success', 'warning', 'error'] as const;
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    
    const result: DebugToolResult = {
      tool: toolName,
      status: randomStatus,
      message: getToolMessage(toolName, randomStatus),
      duration,
      data: getToolData(toolName)
    };
    
    setDebugResults(prev => [result, ...prev.slice(0, 9)]);
    toast.success(`✅ ${toolName} terminé en ${duration}ms`);
  };

  const getToolMessage = (tool: string, status: string) => {
    if (status === 'success') return `${tool} exécuté avec succès`;
    if (status === 'warning') return `${tool} terminé avec avertissements`;
    return `${tool} a rencontré des erreurs`;
  };

  const getToolData = (tool: string) => {
    const dataMap: Record<string, any> = {
      'Test Connexion DB': { connections: 45, slowQueries: 3 },
      'Vérif. Cache': { hitRate: '94.2%', size: '2.1 GB' },
      'Audit Sécurité': { vulnerabilities: 0, lastScan: new Date().toISOString() },
      'Test Performance': { avgResponse: '234ms', p95: '456ms' }
    };
    return dataMap[tool] || {};
  };

  useEffect(() => {
    loadSystemInfo();
  }, []);

  return (
    <AuthenticatedLayout>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Bug className="h-8 w-8 text-orange-600" />
              Debug & Diagnostic Système
            </h1>
            <p className="text-muted-foreground mt-2">
              Outils avancés de debug et diagnostic pour ADMIN.GA
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={runSystemHealthCheck} 
              disabled={isRunningHealthCheck}
              variant="outline"
            >
              {isRunningHealthCheck ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              Vérification Système
            </Button>
            <Button onClick={loadSystemInfo} variant="outline">
              <Activity className="mr-2 h-4 w-4" />
              Rafraîchir Info
            </Button>
          </div>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="health">Santé Système</TabsTrigger>
            <TabsTrigger value="tools">Outils Debug</TabsTrigger>
            <TabsTrigger value="logs">Logs & Traces</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="advanced">Avancé</TabsTrigger>
          </TabsList>

          {/* Santé Système */}
          <TabsContent value="health" className="space-y-6">
            {/* Statistiques rapides */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Server className="h-8 w-8 text-blue-500" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Uptime</p>
                      <p className="text-2xl font-bold">{systemInfo?.uptime || '---'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Users className="h-8 w-8 text-green-500" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Utilisateurs Actifs</p>
                      <p className="text-2xl font-bold">{systemInfo?.activeUsers || '---'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <HardDrive className="h-8 w-8 text-purple-500" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Mémoire</p>
                      <p className="text-2xl font-bold">{systemInfo?.memoryUsage || '---'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Activity className="h-8 w-8 text-orange-500" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">CPU Usage</p>
                      <p className="text-2xl font-bold">{systemInfo?.cpuUsage || '---'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Vérifications de santé */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Vérifications de Santé Système
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isRunningHealthCheck && (
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Vérification en cours...</span>
                    </div>
                    <Progress value={(healthChecks.length / 6) * 100} className="w-full" />
                  </div>
                )}

                <div className="space-y-3">
                  {healthChecks.length === 0 && !isRunningHealthCheck && (
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        Cliquez sur "Vérification Système" pour lancer un diagnostic complet.
                      </AlertDescription>
                    </Alert>
                  )}

                  {healthChecks.map((check, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(check.status)}
                        <div>
                          <p className="font-medium">{check.component}</p>
                          <p className="text-sm text-muted-foreground">{check.details}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(check.status)}>
                          {check.message}
                        </Badge>
                        {check.lastCheck && (
                          <span className="text-xs text-muted-foreground">
                            {check.lastCheck}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Outils Debug */}
          <TabsContent value="tools" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: 'Test Connexion DB', icon: DatabaseIcon, description: 'Teste la connectivité base de données' },
                { name: 'Vérif. Cache', icon: Zap, description: 'Vérifie l\'état du cache système' },
                { name: 'Audit Sécurité', icon: Shield, description: 'Lance un audit de sécurité' },
                { name: 'Test Performance', icon: BarChart3, description: 'Analyse les performances' },
                { name: 'Vérif. Réseau', icon: Network, description: 'Teste la connectivité réseau' },
                { name: 'Debug Organismes', icon: Building2, description: 'Debug spécialisé organismes' }
              ].map((tool) => (
                <Card key={tool.name} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <tool.icon className="h-6 w-6 text-blue-500" />
                      <h3 className="font-medium">{tool.name}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{tool.description}</p>
                    <Button 
                      onClick={() => tool.name === 'Debug Organismes' ? 
                        window.open('/debug-orgs', '_blank') : 
                        runDebugTool(tool.name)
                      } 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                    >
                      <Play className="mr-2 h-4 w-4" />
                      {tool.name === 'Debug Organismes' ? 'Ouvrir' : 'Exécuter'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Résultats récents */}
            {debugResults.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    Résultats Récents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {debugResults.map((result, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded">
                        <div className="flex items-center gap-3">
                          {result.status === 'success' && <CheckCircle className="h-4 w-4 text-green-500" />}
                          {result.status === 'warning' && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
                          {result.status === 'error' && <XCircle className="h-4 w-4 text-red-500" />}
                          <div>
                            <p className="font-medium">{result.tool}</p>
                            <p className="text-sm text-muted-foreground">{result.message}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline">{result.duration}ms</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Logs & Traces */}
          <TabsContent value="logs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Accès Rapide aux Logs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link href="/super-admin/base-donnees">
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <DatabaseIcon className="h-5 w-5 text-blue-500" />
                          <div>
                            <p className="font-medium">Logs Base de Données</p>
                            <p className="text-sm text-muted-foreground">Monitoring complet DB</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>

                  <Link href="/super-admin/systeme">
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <Server className="h-5 w-5 text-green-500" />
                          <div>
                            <p className="font-medium">Logs Système</p>
                            <p className="text-sm text-muted-foreground">Monitoring sécurité</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>

                  <Link href="/super-admin/analytics">
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <BarChart3 className="h-5 w-5 text-purple-500" />
                          <div>
                            <p className="font-medium">Analytics & Métriques</p>
                            <p className="text-sm text-muted-foreground">Logs performance</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>

                  <Link href="/debug-orgs">
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <Building2 className="h-5 w-5 text-orange-500" />
                          <div>
                            <p className="font-medium">Debug Organismes</p>
                            <p className="text-sm text-muted-foreground">Diagnostic organismes</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance */}
          <TabsContent value="performance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="h-5 w-5" />
                  Métriques de Performance en Temps Réel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Temps de réponse API</span>
                        <span className="text-sm font-medium">234ms</span>
                      </div>
                      <Progress value={76} className="w-full" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Utilisation mémoire</span>
                        <span className="text-sm font-medium">68%</span>
                      </div>
                      <Progress value={68} className="w-full" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Charge CPU</span>
                        <span className="text-sm font-medium">23%</span>
                      </div>
                      <Progress value={23} className="w-full" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Débit réseau</span>
                        <span className="text-sm font-medium">145 Mb/s</span>
                      </div>
                      <Progress value={85} className="w-full" />
                    </div>
                  </div>
                  
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      Pour des métriques avancées détaillées, consultez la page <Link href="/super-admin/analytics" className="underline">Analytics</Link>.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Avancé */}
          <TabsContent value="advanced" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Informations Système Détaillées
                </CardTitle>
              </CardHeader>
              <CardContent>
                {systemInfo && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h3 className="font-medium">Environnement</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Version:</span>
                          <span className="font-mono">{systemInfo.version}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Node.js:</span>
                          <span className="font-mono">{systemInfo.nodeVersion}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Environnement:</span>
                          <Badge variant="outline">{systemInfo.environment}</Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h3 className="font-medium">Statistiques</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Requêtes totales:</span>
                          <span className="font-mono">{systemInfo.totalRequests}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Dernière sauvegarde:</span>
                          <span className="font-mono text-xs">{systemInfo.lastBackup}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Espace disque:</span>
                          <span className="font-mono">{systemInfo.diskSpace}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="mt-6 pt-6 border-t">
                  <h3 className="font-medium mb-3">Actions Avancées</h3>
                  <div className="flex gap-2 flex-wrap">
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Export Debug
                    </Button>
                    <Button variant="outline" size="sm">
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Clear Cache
                    </Button>
                    <Button variant="outline" size="sm">
                      <Clock className="mr-2 h-4 w-4" />
                      Planifier Maintenance
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AuthenticatedLayout>
  );
}