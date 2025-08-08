'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Activity,
  Database as DatabaseIcon,
  Server,
  Users,
  Zap,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  AlertTriangle,
  Clock
} from 'lucide-react';

interface MetricData {
  value: number;
  label: string;
  trend?: {
    direction: 'up' | 'down';
    value: number;
    period: string;
  };
  status: 'excellent' | 'good' | 'warning' | 'critical';
}

interface RealTimeMetricsProps {
  updateInterval?: number;
  className?: string;
}

export function RealTimeMetrics({ updateInterval = 5000, className }: RealTimeMetricsProps) {
  const [metrics, setMetrics] = useState<Record<string, MetricData>>({
    cpu: {
      value: 45,
      label: 'CPU',
      trend: { direction: 'down', value: 2.3, period: 'depuis 1h' },
      status: 'good'
    },
    memory: {
      value: 68,
      label: 'Mémoire',
      trend: { direction: 'up', value: 1.2, period: 'depuis 1h' },
      status: 'warning'
    },
    database: {
      value: 92,
      label: 'Performance DB',
      trend: { direction: 'up', value: 5.1, period: 'depuis 1h' },
      status: 'excellent'
    },
    network: {
      value: 78,
      label: 'Réseau I/O',
      trend: { direction: 'down', value: 0.8, period: 'depuis 1h' },
      status: 'good'
    }
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsLoading(true);

      // Simulation de mise à jour des métriques en temps réel
      setTimeout(() => {
        setMetrics(prev => ({
          ...prev,
          cpu: {
            ...prev.cpu,
            value: Math.max(0, Math.min(100, prev.cpu.value + (Math.random() - 0.5) * 10)),
            trend: {
              direction: Math.random() > 0.5 ? 'up' : 'down',
              value: Math.random() * 5,
              period: 'depuis 1h'
            }
          },
          memory: {
            ...prev.memory,
            value: Math.max(0, Math.min(100, prev.memory.value + (Math.random() - 0.5) * 8)),
            trend: {
              direction: Math.random() > 0.5 ? 'up' : 'down',
              value: Math.random() * 3,
              period: 'depuis 1h'
            }
          },
          database: {
            ...prev.database,
            value: Math.max(0, Math.min(100, prev.database.value + (Math.random() - 0.5) * 5)),
            trend: {
              direction: Math.random() > 0.5 ? 'up' : 'down',
              value: Math.random() * 4,
              period: 'depuis 1h'
            }
          },
          network: {
            ...prev.network,
            value: Math.max(0, Math.min(100, prev.network.value + (Math.random() - 0.5) * 12)),
            trend: {
              direction: Math.random() > 0.5 ? 'up' : 'down',
              value: Math.random() * 6,
              period: 'depuis 1h'
            }
          }
        }));
        setIsLoading(false);
      }, 500);
    }, updateInterval);

    return () => clearInterval(interval);
  }, [updateInterval]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'good': return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getProgressColor = (value: number) => {
    if (value >= 90) return 'bg-red-500';
    if (value >= 75) return 'bg-yellow-500';
    if (value >= 50) return 'bg-blue-500';
    return 'bg-green-500';
  };

  return (
    <div className={className}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(metrics).map(([key, metric]) => {
          const TrendIcon = metric.trend?.direction === 'up' ? TrendingUp : TrendingDown;
          const trendColor = metric.trend?.direction === 'up' ? 'text-green-600' : 'text-red-600';

          return (
            <Card key={key} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {key === 'cpu' && <Server className="h-5 w-5 text-blue-500" />}
                    {key === 'memory' && <DatabaseIcon className="h-5 w-5 text-green-500" />}
                    {key === 'database' && <DatabaseIcon className="h-5 w-5 text-purple-500" />}
                    {key === 'network' && <Activity className="h-5 w-5 text-orange-500" />}
                    <span className="text-sm font-medium text-muted-foreground">{metric.label}</span>
                  </div>
                  {getStatusIcon(metric.status)}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`text-2xl font-bold ${getStatusColor(metric.status)}`}>
                      {Math.round(metric.value)}%
                    </span>
                    {isLoading && (
                      <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse" />
                    )}
                  </div>

                  <Progress
                    value={metric.value}
                    className="h-2"
                    style={{
                      '--progress-background': getProgressColor(metric.value)
                    } as React.CSSProperties}
                  />

                  {metric.trend && (
                    <div className={`flex items-center text-xs ${trendColor}`}>
                      <TrendIcon className="h-3 w-3 mr-1" />
                      <span>{metric.trend.value.toFixed(1)}% {metric.trend.period}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Indicateurs de Santé Globale */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Santé Système Globale
          </CardTitle>
          <CardDescription>Indicateurs de santé consolidés</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600">
                {Math.round((metrics.cpu.value + metrics.memory.value + metrics.database.value + metrics.network.value) / 4)}%
              </div>
              <div className="text-sm text-muted-foreground">Performance Globale</div>
            </div>

            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">99.8%</div>
              <div className="text-sm text-muted-foreground">Disponibilité (7j)</div>
            </div>

            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600">145ms</div>
              <div className="text-sm text-muted-foreground">Temps Réponse Moy.</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
