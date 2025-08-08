'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { AuthenticatedLayout } from '@/components/layouts/authenticated-layout';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { PageHeader } from '@/components/ui/page-header';
import { StatCard } from '@/components/ui/stat-card';
import ErrorBoundary from '@/components/ui/error-boundary';
import { toast } from 'sonner';
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Clock,
  Cpu,
  Database as DatabaseIcon,
  Download,
  Eye,
  Globe,
  HardDrive,
  LineChart,
  Monitor,
  Network,
  RefreshCw,
  Server,
  Settings,
  Shield,
  TrendingDown,
  TrendingUp,
  Zap,
  Users,
  FileText,
  Target,
  Layers,
  GitBranch,
  Code,
  Bug,
  CheckCircle,
  XCircle,
  AlertCircle,
  Timer,
  MemoryStick,
  Gauge,
  Radio,
  Cloud,
  Lock,
  Unlock,
  Wifi
} from 'lucide-react';

interface AdvancedMetrics {
  systemPerformance: {
    cpu: {
      cores: number;
      usage: number[];
      temperature: number;
      frequency: number;
      loadAverage: number[];
    };
    memory: {
      total: number;
      used: number;
      cached: number;
      buffers: number;
      swapUsed: number;
      swapTotal: number;
    };
    network: {
      interfaces: Array<{
        name: string;
        speed: number;
        packetsIn: number;
        packetsOut: number;
        bytesIn: number;
        bytesOut: number;
        errors: number;
      }>;
      latency: number;
      throughput: number;
    };
    storage: {
      disks: Array<{
        device: string;
        size: number;
        used: number;
        iops: number;
        readSpeed: number;
        writeSpeed: number;
      }>;
    };
  };
  applicationMetrics: {
    apiEndpoints: Array<{
      endpoint: string;
      method: string;
      avgResponseTime: number;
      requestCount: number;
      errorRate: number;
      p95ResponseTime: number;
      p99ResponseTime: number;
    }>;
    databaseQueries: Array<{
      query: string;
      table: string;
      avgExecutionTime: number;
      frequency: number;
      slowQueries: number;
    }>;
    cacheMetrics: {
      hitRate: number;
      missRate: number;
      evictions: number;
      memoryUsage: number;
    };
  };
  securityMetrics: {
    authenticationAttempts: {
      successful: number;
      failed: number;
      blocked: number;
    };
    threatDetection: Array<{
      type: string;
      severity: 'low' | 'medium' | 'high' | 'critical';
      count: number;
      lastOccurrence: string;
    }>;
    vulnerabilities: Array<{
      id: string;
      severity: string;
      component: string;
      status: 'open' | 'fixed' | 'mitigated';
    }>;
  };
  businessMetrics: {
    organismeActivity: Array<{
      organismeId: string;
      name: string;
      requestsToday: number;
      avgResponseTime: number;
      errorRate: number;
      peakHour: string;
      uniqueUsers: number;
    }>;
    serviceUtilization: Array<{
      serviceName: string;
      category: string;
      totalRequests: number;
      successRate: number;
      avgProcessingTime: number;
      costPerRequest: number;
    }>;
  };
  predictiveAnalytics: {
    cpuTrend: 'increasing' | 'stable' | 'decreasing';
    memoryTrend: 'increasing' | 'stable' | 'decreasing';
    diskSpacePrediction: {
      daysUntilFull: number;
      growthRate: number;
    };
    userGrowthPrediction: {
      nextMonth: number;
      nextQuarter: number;
      confidence: number;
    };
  };
}

export default function MetricsAdvancedPage() {
  const [data, setData] = useState<AdvancedMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(10);
  const [selectedTab, setSelectedTab] = useState('system');
  const [timeRange, setTimeRange] = useState('1h');

  useEffect(() => {
    loadAdvancedMetrics();

    const interval = setInterval(() => {
      loadAdvancedMetrics();
    }, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [refreshInterval, timeRange]);

  const loadAdvancedMetrics = async () => {
    setLoading(true);
    try {
      // Simulation de données métriques avancées
      const advancedMetrics: AdvancedMetrics = {
        systemPerformance: {
          cpu: {
            cores: 8,
            usage: [65, 72, 58, 81, 69, 74, 67, 79],
            temperature: 68.5,
            frequency: 3.2,
            loadAverage: [2.1, 1.8, 1.5]
          },
          memory: {
            total: 32768,
            used: 23456,
            cached: 4832,
            buffers: 1024,
            swapUsed: 512,
            swapTotal: 8192
          },
          network: {
            interfaces: [
              {
                name: 'eth0',
                speed: 1000,
                packetsIn: 15234567,
                packetsOut: 12456789,
                bytesIn: 987654321098,
                bytesOut: 876543210987,
                errors: 12
              },
              {
                name: 'eth1',
                speed: 1000,
                packetsIn: 8765432,
                packetsOut: 7654321,
                bytesIn: 654321098765,
                bytesOut: 543210987654,
                errors: 3
              }
            ],
            latency: 1.2,
            throughput: 850.3
          },
          storage: {
            disks: [
              {
                device: '/dev/sda1',
                size: 1000,
                used: 450,
                iops: 1200,
                readSpeed: 150.5,
                writeSpeed: 125.3
              },
              {
                device: '/dev/sdb1',
                size: 2000,
                used: 890,
                iops: 800,
                readSpeed: 140.2,
                writeSpeed: 110.8
              }
            ]
          }
        },
        applicationMetrics: {
          apiEndpoints: [
            {
              endpoint: '/api/auth/login',
              method: 'POST',
              avgResponseTime: 145,
              requestCount: 0,
              errorRate: 0.8,
              p95ResponseTime: 250,
              p99ResponseTime: 450
            },
            {
              endpoint: '/api/organismes',
              method: 'GET',
              avgResponseTime: 89,
              requestCount: 0,
              errorRate: 0.3,
              p95ResponseTime: 180,
              p99ResponseTime: 320
            },
            {
              endpoint: '/api/users/profile',
              method: 'GET',
              avgResponseTime: 67,
              requestCount: 0,
              errorRate: 0.1,
              p95ResponseTime: 120,
              p99ResponseTime: 200
            }
          ],
          databaseQueries: [
            {
              query: 'SELECT * FROM users WHERE...',
              table: 'users',
              avgExecutionTime: 23.4,
              frequency: 1500,
              slowQueries: 12
            },
            {
              query: 'SELECT * FROM organismes JOIN...',
              table: 'organismes',
              avgExecutionTime: 45.7,
              frequency: 800,
              slowQueries: 8
            }
          ],
          cacheMetrics: {
            hitRate: 94.5,
            missRate: 5.5,
            evictions: 234,
            memoryUsage: 78.2
          }
        },
        securityMetrics: {
          authenticationAttempts: {
            successful: 15420,
            failed: 234,
            blocked: 45
          },
          threatDetection: [
            {
              type: 'Brute Force Attack',
              severity: 'high',
              count: 0,
              lastOccurrence: '2025-01-15T14:30:00Z'
            },
            {
              type: 'SQL Injection Attempt',
              severity: 'critical',
              count: 0,
              lastOccurrence: '2025-01-15T13:45:00Z'
            },
            {
              type: 'Suspicious API Usage',
              severity: 'medium',
              count: 0,
              lastOccurrence: '2025-01-15T14:25:00Z'
            }
          ],
          vulnerabilities: [
            {
              id: 'CVE-2024-1234',
              severity: 'High',
              component: 'Authentication Module',
              status: 'fixed'
            },
            {
              id: 'CVE-2024-5678',
              severity: 'Medium',
              component: 'API Gateway',
              status: 'mitigated'
            }
          ]
        },
        businessMetrics: {
          organismeActivity: [
            {
              organismeId: 'min-economie',
              name: 'Ministère de l\'Économie',
              requestsToday: 5678,
              avgResponseTime: 234,
              errorRate: 0.2,
              peakHour: '14:00',
              uniqueUsers: 145
            },
            {
              organismeId: 'dgi',
              name: 'Direction Générale des Impôts',
              requestsToday: 8901,
              avgResponseTime: 189,
              errorRate: 0.1,
              peakHour: '10:00',
              uniqueUsers: 278
            }
          ],
          serviceUtilization: [
            {
              serviceName: 'Authentification',
              category: 'Security',
              totalRequests: 45678,
              successRate: 99.2,
              avgProcessingTime: 145,
              costPerRequest: 0.001
            },
            {
              serviceName: 'Gestion Organismes',
              category: 'Core',
              totalRequests: 23456,
              successRate: 98.9,
              avgProcessingTime: 289,
              costPerRequest: 0.003
            }
          ]
        },
        predictiveAnalytics: {
          cpuTrend: 'increasing',
          memoryTrend: 'stable',
          diskSpacePrediction: {
            daysUntilFull: 45,
            growthRate: 2.3
          },
          userGrowthPrediction: {
            nextMonth: 1250,
            nextQuarter: 4200,
            confidence: 87.5
          }
        }
      };

      setData(advancedMetrics);
    } catch (error) {
      console.error('Erreur lors du chargement des métriques avancées:', error);
      toast.error('Erreur lors du chargement des métriques');
    } finally {
      setLoading(false);
    }
  };

  const formatBytes = (bytes: number) => {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let i = 0;
    while (bytes >= 1024 && i < units.length - 1) {
      bytes /= 1024;
      i++;
    }
    return `${bytes.toFixed(1)} ${units[i]}`;
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return <TrendingUp className="h-4 w-4 text-red-500" />;
      case 'decreasing': return <TrendingDown className="h-4 w-4 text-green-500" />;
      default: return <Activity className="h-4 w-4 text-blue-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    const colors = {
      low: 'bg-blue-100 text-blue-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800'
    };
    return colors[severity] || colors.low;
  };

  const exportMetrics = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      timeRange,
      ...data
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `advanced-metrics-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast.success('📊 Métriques avancées exportées avec succès');
  };

  if (loading) {
    return (
      <AuthenticatedLayout>
        <LoadingSpinner
          size="lg"
          message="Chargement des métriques avancées..."
          className="min-h-[400px]"
        />
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout>
      <ErrorBoundary>
        <div className="space-y-6 p-6">
          <PageHeader
            title="Métriques Avancées"
            description="Surveillance approfondie et métriques de performance détaillées"
            icon={Gauge}
            badge={{
              text: `Actualisation: ${refreshInterval}s`,
              variant: 'outline'
            }}
            actions={[
              {
                label: 'Actualiser',
                onClick: loadAdvancedMetrics,
                icon: RefreshCw,
                variant: 'outline'
              },
              {
                label: 'Exporter',
                onClick: exportMetrics,
                icon: Download
              }
            ]}
          />

          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5m">5 minutes</SelectItem>
                  <SelectItem value="1h">1 heure</SelectItem>
                  <SelectItem value="6h">6 heures</SelectItem>
                  <SelectItem value="24h">24 heures</SelectItem>
                  <SelectItem value="7d">7 jours</SelectItem>
                </SelectContent>
              </Select>

              <Select value={refreshInterval.toString()} onValueChange={(value) => setRefreshInterval(parseInt(value))}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 secondes</SelectItem>
                  <SelectItem value="10">10 secondes</SelectItem>
                  <SelectItem value="30">30 secondes</SelectItem>
                  <SelectItem value="60">1 minute</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {data && (
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="system">Système</TabsTrigger>
                <TabsTrigger value="application">Application</TabsTrigger>
                <TabsTrigger value="security">Sécurité</TabsTrigger>
                <TabsTrigger value="business">Métier</TabsTrigger>
                <TabsTrigger value="predictive">Prédictif</TabsTrigger>
              </TabsList>

              <TabsContent value="system" className="space-y-6">
                {/* Performance CPU détaillée */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Cpu className="h-5 w-5" />
                      Performance CPU Détaillée
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3">Utilisation par cœur</h4>
                        <div className="space-y-2">
                          {data.systemPerformance.cpu.usage.map((usage, index) => (
                            <div key={index} className="flex items-center gap-3">
                              <span className="text-sm w-12">Core {index}</span>
                              <Progress value={usage} className="flex-1" />
                              <span className="text-sm w-12">{usage}%</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">{data.systemPerformance.cpu.temperature}°C</div>
                          <div className="text-sm text-gray-600">Température</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">{data.systemPerformance.cpu.frequency} GHz</div>
                          <div className="text-sm text-gray-600">Fréquence</div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3">Charge système</h4>
                        <div className="space-y-2">
                          {data.systemPerformance.cpu.loadAverage.map((load, index) => (
                            <div key={index} className="flex justify-between">
                              <span className="text-sm">{['1 min', '5 min', '15 min'][index]}</span>
                              <span className="font-mono">{load}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Mémoire détaillée */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MemoryStick className="h-5 w-5" />
                      Utilisation Mémoire Détaillée
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span>Utilisée</span>
                          <span className="font-mono">{formatBytes(data.systemPerformance.memory.used * 1024 * 1024)}</span>
                        </div>
                        <Progress value={(data.systemPerformance.memory.used / data.systemPerformance.memory.total) * 100} />

                        <div className="flex justify-between items-center">
                          <span>Cache</span>
                          <span className="font-mono">{formatBytes(data.systemPerformance.memory.cached * 1024 * 1024)}</span>
                        </div>
                        <Progress value={(data.systemPerformance.memory.cached / data.systemPerformance.memory.total) * 100} className="bg-blue-100" />

                        <div className="flex justify-between items-center">
                          <span>Buffers</span>
                          <span className="font-mono">{formatBytes(data.systemPerformance.memory.buffers * 1024 * 1024)}</span>
                        </div>
                        <Progress value={(data.systemPerformance.memory.buffers / data.systemPerformance.memory.total) * 100} className="bg-green-100" />
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-semibold">Swap</h4>
                        <div className="flex justify-between items-center">
                          <span>Utilisé</span>
                          <span className="font-mono">{formatBytes(data.systemPerformance.memory.swapUsed * 1024 * 1024)}</span>
                        </div>
                        <Progress value={(data.systemPerformance.memory.swapUsed / data.systemPerformance.memory.swapTotal) * 100} className="bg-orange-100" />

                        <div className="text-sm text-gray-600 space-y-1">
                          <div>Total RAM: {formatBytes(data.systemPerformance.memory.total * 1024 * 1024)}</div>
                          <div>Total Swap: {formatBytes(data.systemPerformance.memory.swapTotal * 1024 * 1024)}</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Réseau détaillé */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Network className="h-5 w-5" />
                      Performance Réseau
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {data.systemPerformance.network.interfaces.map((iface, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex justify-between items-center mb-3">
                            <h4 className="font-semibold">{iface.name}</h4>
                            <Badge variant="outline">{iface.speed} Mbps</Badge>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <div className="text-gray-600">Paquets entrants</div>
                              <div className="font-mono">{iface.packetsIn.toLocaleString()}</div>
                            </div>
                            <div>
                              <div className="text-gray-600">Paquets sortants</div>
                              <div className="font-mono">{iface.packetsOut.toLocaleString()}</div>
                            </div>
                            <div>
                              <div className="text-gray-600">Données entrantes</div>
                              <div className="font-mono">{formatBytes(iface.bytesIn)}</div>
                            </div>
                            <div>
                              <div className="text-gray-600">Données sortantes</div>
                              <div className="font-mono">{formatBytes(iface.bytesOut)}</div>
                            </div>
                          </div>

                          {iface.errors > 0 && (
                            <div className="mt-2 text-sm text-red-600">
                              ⚠️ {iface.errors} erreurs détectées
                            </div>
                          )}
                        </div>
                      ))}

                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">{data.systemPerformance.network.latency}ms</div>
                          <div className="text-sm text-gray-600">Latence moyenne</div>
                        </div>
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">{data.systemPerformance.network.throughput} Mbps</div>
                          <div className="text-sm text-gray-600">Débit actuel</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Stockage détaillé */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <HardDrive className="h-5 w-5" />
                      Performance Stockage
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {data.systemPerformance.storage.disks.map((disk, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex justify-between items-center mb-3">
                            <h4 className="font-semibold">{disk.device}</h4>
                            <Badge variant="outline">{formatBytes(disk.size * 1024 * 1024 * 1024)}</Badge>
                          </div>

                          <div className="mb-3">
                            <div className="flex justify-between text-sm mb-1">
                              <span>Utilisation</span>
                              <span>{Math.round((disk.used / disk.size) * 100)}%</span>
                            </div>
                            <Progress value={(disk.used / disk.size) * 100} />
                          </div>

                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div className="text-center p-2 bg-blue-50 rounded">
                              <div className="font-bold text-blue-600">{disk.iops}</div>
                              <div className="text-gray-600">IOPS</div>
                            </div>
                            <div className="text-center p-2 bg-green-50 rounded">
                              <div className="font-bold text-green-600">{disk.readSpeed} MB/s</div>
                              <div className="text-gray-600">Lecture</div>
                            </div>
                            <div className="text-center p-2 bg-orange-50 rounded">
                              <div className="font-bold text-orange-600">{disk.writeSpeed} MB/s</div>
                              <div className="text-gray-600">Écriture</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="application" className="space-y-6">
                {/* API Endpoints Performance */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Code className="h-5 w-5" />
                      Performance des API Endpoints
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {data.applicationMetrics.apiEndpoints.map((endpoint, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex justify-between items-center mb-3">
                            <div>
                              <h4 className="font-semibold">{endpoint.endpoint}</h4>
                              <Badge variant="outline">{endpoint.method}</Badge>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-gray-600">{endpoint.requestCount.toLocaleString()} requêtes</div>
                              <div className={`text-sm ${endpoint.errorRate > 1 ? 'text-red-600' : 'text-green-600'}`}>
                                {endpoint.errorRate}% erreurs
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div className="text-center p-3 bg-blue-50 rounded">
                              <div className="font-bold text-blue-600">{endpoint.avgResponseTime}ms</div>
                              <div className="text-gray-600">Temps moyen</div>
                            </div>
                            <div className="text-center p-3 bg-orange-50 rounded">
                              <div className="font-bold text-orange-600">{endpoint.p95ResponseTime}ms</div>
                              <div className="text-gray-600">P95</div>
                            </div>
                            <div className="text-center p-3 bg-red-50 rounded">
                              <div className="font-bold text-red-600">{endpoint.p99ResponseTime}ms</div>
                              <div className="text-gray-600">P99</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Database Performance */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DatabaseIcon className="h-5 w-5" />
                      Performance Base de Données
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {data.applicationMetrics.databaseQueries.map((query, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex justify-between items-center mb-3">
                            <div>
                              <h4 className="font-semibold text-sm font-mono">{query.query.substring(0, 50)}...</h4>
                              <Badge variant="outline">Table: {query.table}</Badge>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-gray-600">{query.frequency} exécutions</div>
                              {query.slowQueries > 0 && (
                                <div className="text-sm text-red-600">{query.slowQueries} requêtes lentes</div>
                              )}
                            </div>
                          </div>

                          <div className="text-center p-3 bg-purple-50 rounded">
                            <div className="font-bold text-purple-600">{query.avgExecutionTime}ms</div>
                            <div className="text-gray-600">Temps d'exécution moyen</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Cache Metrics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5" />
                      Métriques de Cache
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{data.applicationMetrics.cacheMetrics.hitRate}%</div>
                        <div className="text-sm text-gray-600">Taux de succès</div>
                      </div>
                      <div className="text-center p-4 bg-red-50 rounded-lg">
                        <div className="text-2xl font-bold text-red-600">{data.applicationMetrics.cacheMetrics.missRate}%</div>
                        <div className="text-sm text-gray-600">Taux d'échec</div>
                      </div>
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">{data.applicationMetrics.cacheMetrics.evictions}</div>
                        <div className="text-sm text-gray-600">Évictions</div>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{data.applicationMetrics.cacheMetrics.memoryUsage}%</div>
                        <div className="text-sm text-gray-600">Mémoire utilisée</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="space-y-6">
                {/* Authentication Metrics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Métriques d'Authentification
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{data.securityMetrics.authenticationAttempts.successful.toLocaleString()}</div>
                        <div className="text-sm text-gray-600">Connexions réussies</div>
                        <CheckCircle className="h-6 w-6 text-green-500 mx-auto mt-2" />
                      </div>
                      <div className="text-center p-4 bg-red-50 rounded-lg">
                        <div className="text-2xl font-bold text-red-600">{data.securityMetrics.authenticationAttempts.failed.toLocaleString()}</div>
                        <div className="text-sm text-gray-600">Tentatives échouées</div>
                        <XCircle className="h-6 w-6 text-red-500 mx-auto mt-2" />
                      </div>
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">{data.securityMetrics.authenticationAttempts.blocked.toLocaleString()}</div>
                        <div className="text-sm text-gray-600">Tentatives bloquées</div>
                        <Lock className="h-6 w-6 text-orange-500 mx-auto mt-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Threat Detection */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Détection de Menaces
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {data.securityMetrics.threatDetection.map((threat, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <AlertTriangle className={`h-5 w-5 ${
                              threat.severity === 'critical' ? 'text-red-500' :
                              threat.severity === 'high' ? 'text-orange-500' :
                              threat.severity === 'medium' ? 'text-yellow-500' : 'text-blue-500'
                            }`} />
                            <div>
                              <h4 className="font-semibold">{threat.type}</h4>
                              <p className="text-sm text-gray-600">Dernière occurrence: {new Date(threat.lastOccurrence).toLocaleString('fr-FR')}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge className={getSeverityColor(threat.severity)}>
                              {threat.severity}
                            </Badge>
                            <div className="text-right">
                              <div className="font-semibold">{threat.count}</div>
                              <div className="text-sm text-gray-600">occurrences</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Vulnerabilities */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bug className="h-5 w-5" />
                      Vulnérabilités
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {data.securityMetrics.vulnerabilities.map((vuln, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h4 className="font-semibold">{vuln.id}</h4>
                            <p className="text-sm text-gray-600">{vuln.component}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge variant="outline">{vuln.severity}</Badge>
                            <Badge className={
                              vuln.status === 'fixed' ? 'bg-green-100 text-green-800' :
                              vuln.status === 'mitigated' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }>
                              {vuln.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="business" className="space-y-6">
                {/* Organisme Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Activité des Organismes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {data.businessMetrics.organismeActivity.map((org, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex justify-between items-center mb-3">
                            <h4 className="font-semibold">{org.name}</h4>
                            <Badge variant="outline">Pic: {org.peakHour}</Badge>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div className="text-center p-3 bg-blue-50 rounded">
                              <div className="font-bold text-blue-600">{org.requestsToday.toLocaleString()}</div>
                              <div className="text-gray-600">Requêtes aujourd'hui</div>
                            </div>
                            <div className="text-center p-3 bg-green-50 rounded">
                              <div className="font-bold text-green-600">{org.avgResponseTime}ms</div>
                              <div className="text-gray-600">Temps de réponse</div>
                            </div>
                            <div className="text-center p-3 bg-orange-50 rounded">
                              <div className="font-bold text-orange-600">{org.errorRate}%</div>
                              <div className="text-gray-600">Taux d'erreur</div>
                            </div>
                            <div className="text-center p-3 bg-purple-50 rounded">
                              <div className="font-bold text-purple-600">{org.uniqueUsers}</div>
                              <div className="text-gray-600">Utilisateurs uniques</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Service Utilization */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Layers className="h-5 w-5" />
                      Utilisation des Services
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {data.businessMetrics.serviceUtilization.map((service, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex justify-between items-center mb-3">
                            <div>
                              <h4 className="font-semibold">{service.serviceName}</h4>
                              <Badge variant="outline">{service.category}</Badge>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-gray-600">{service.totalRequests.toLocaleString()} requêtes</div>
                              <div className="text-sm text-green-600">{service.successRate}% succès</div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="text-center p-3 bg-blue-50 rounded">
                              <div className="font-bold text-blue-600">{service.avgProcessingTime}ms</div>
                              <div className="text-gray-600">Temps de traitement</div>
                            </div>
                            <div className="text-center p-3 bg-green-50 rounded">
                              <div className="font-bold text-green-600">${service.costPerRequest.toFixed(3)}</div>
                              <div className="text-gray-600">Coût par requête</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="predictive" className="space-y-6">
                {/* System Trends */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Tendances Système
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Cpu className="h-5 w-5 text-blue-500" />
                            <span className="font-medium">CPU</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {getTrendIcon(data.predictiveAnalytics.cpuTrend)}
                            <span className="capitalize">{data.predictiveAnalytics.cpuTrend}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <MemoryStick className="h-5 w-5 text-green-500" />
                            <span className="font-medium">Mémoire</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {getTrendIcon(data.predictiveAnalytics.memoryTrend)}
                            <span className="capitalize">{data.predictiveAnalytics.memoryTrend}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="text-center p-4 bg-orange-50 rounded-lg">
                          <div className="text-2xl font-bold text-orange-600">{data.predictiveAnalytics.diskSpacePrediction.daysUntilFull}</div>
                          <div className="text-sm text-gray-600">Jours avant saturation disque</div>
                          <div className="text-xs text-gray-500 mt-1">Croissance: {data.predictiveAnalytics.diskSpacePrediction.growthRate}% par jour</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* User Growth Prediction */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Prédiction de Croissance Utilisateurs
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{data.predictiveAnalytics.userGrowthPrediction.nextMonth.toLocaleString()}</div>
                        <div className="text-sm text-gray-600">Prévision mois prochain</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{data.predictiveAnalytics.userGrowthPrediction.nextQuarter.toLocaleString()}</div>
                        <div className="text-sm text-gray-600">Prévision trimestre</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">{data.predictiveAnalytics.userGrowthPrediction.confidence}%</div>
                        <div className="text-sm text-gray-600">Niveau de confiance</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recommendations */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5" />
                      Recommandations Automatiques
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="h-5 w-5 text-yellow-600" />
                          <h4 className="font-semibold text-yellow-800">Attention - Stockage</h4>
                        </div>
                        <p className="text-sm text-yellow-700">
                          Le disque /dev/sdb1 sera plein dans {data.predictiveAnalytics.diskSpacePrediction.daysUntilFull} jours.
                          Considérez l'ajout d'espace de stockage ou la mise en place d'une politique de nettoyage.
                        </p>
                      </div>

                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="h-5 w-5 text-blue-600" />
                          <h4 className="font-semibold text-blue-800">Optimisation - CPU</h4>
                        </div>
                        <p className="text-sm text-blue-700">
                          L'utilisation CPU est en augmentation. Envisagez une montée en charge ou l'optimisation des processus les plus consommateurs.
                        </p>
                      </div>

                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <h4 className="font-semibold text-green-800">Excellent - Cache</h4>
                        </div>
                        <p className="text-sm text-green-700">
                          Le taux de succès du cache de {data.applicationMetrics.cacheMetrics.hitRate}% est optimal. Continuez cette configuration.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </ErrorBoundary>
    </AuthenticatedLayout>
  );
}
