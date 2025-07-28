/* @ts-nocheck */
import { PrismaClient } from '@prisma/client';

interface MetricData {
  name: string;
  value: number;
  tags?: Record<string, string>;
  timestamp?: Date;
}

interface HealthCheckResult {
  service: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  responseTime?: number;
  details?: Record<string, any>;
  checkedAt: Date;
}

interface PerformanceMetrics {
  requestCount: number;
  averageResponseTime: number;
  errorRate: number;
  throughput: number;
  activeUsers: number;
  cpuUsage?: number;
  memoryUsage?: number;
}

interface AlertConfig {
  name: string;
  metric: string;
  threshold: number;
  operator: '>' | '<' | '>=' | '<=' | '==';
  duration: number; // en secondes
  severity: 'info' | 'warning' | 'critical';
  notificationChannels: string[];
}

export class MonitoringService {
  private prisma: PrismaClient;
  private metrics: Map<string, MetricData[]>;
  private alerts: Map<string, AlertConfig>;
  private healthChecks: Map<string, HealthCheckResult>;
  
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.metrics = new Map();
    this.alerts = new Map();
    this.healthChecks = new Map();
    
    // Démarrer la collecte périodique de métriques
    this.startMetricsCollection();
  }

  /**
   * Enregistrer une métrique
   */
  async recordMetric(metric: MetricData): Promise<void> {
    const timestamp = metric.timestamp || new Date();
    
    // Stocker en mémoire pour agrégation
    const key = metric.name;
    if (!this.metrics.has(key)) {
      this.metrics.set(key, []);
    }
    
    const metrics = this.metrics.get(key)!;
    metrics.push({ ...metric, timestamp });
    
    // Garder seulement les métriques des dernières 24h
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
    this.metrics.set(key, metrics.filter(m => m.timestamp! > cutoff));
    
    // Persister dans la base
    await this.persistMetric(metric, timestamp);
    
    // Vérifier les alertes
    await this.checkAlerts(metric.name, metric.value);
  }

  /**
   * Enregistrer plusieurs métriques en batch
   */
  async recordMetrics(metrics: MetricData[]): Promise<void> {
    await Promise.all(metrics.map(m => this.recordMetric(m)));
  }

  /**
   * Obtenir les métriques de performance
   */
  async getPerformanceMetrics(
    startDate: Date,
    endDate: Date
  ): Promise<PerformanceMetrics> {
    // Requêtes
    const requestCount = await this.prisma.serviceRequest.count({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    // Temps de réponse moyen
    const avgResponseTime = await this.getAverageMetric(
      'response_time',
      startDate,
      endDate
    );

    // Taux d'erreur
    const errorCount = await this.prisma.auditLog.count({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
        severity: 'ERROR',
      },
    });

    const errorRate = requestCount > 0 ? (errorCount / requestCount) * 100 : 0;

    // Utilisateurs actifs
    const activeUsers = await this.prisma.user.count({
      where: {
        lastLoginAt: {
          gte: new Date(Date.now() - 30 * 60 * 1000), // 30 dernières minutes
        },
      },
    });

    // Débit (requêtes par minute)
    const duration = (endDate.getTime() - startDate.getTime()) / (1000 * 60);
    const throughput = duration > 0 ? requestCount / duration : 0;

    return {
      requestCount,
      averageResponseTime: avgResponseTime || 0,
      errorRate,
      throughput,
      activeUsers,
    };
  }

  /**
   * Effectuer un health check complet
   */
  async performHealthCheck(): Promise<HealthCheckResult[]> {
    const checks: HealthCheckResult[] = [];

    // Base de données
    checks.push(await this.checkDatabase());

    // Services externes
    checks.push(await this.checkExternalServices());

    // File d'attente
    checks.push(await this.checkQueues());

    // Stockage
    checks.push(await this.checkStorage());

    // Mettre à jour le cache
    checks.forEach(check => {
      this.healthChecks.set(check.service, check);
    });

    return checks;
  }

  /**
   * Configurer une alerte
   */
  async configureAlert(config: AlertConfig): Promise<void> {
    this.alerts.set(config.name, config);
    
    // Persister la configuration
    await this.prisma.systemConfig.upsert({
      where: { key: `alert_${config.name}` },
      create: {
        key: `alert_${config.name}`,
        value: config as any,
        category: 'MONITORING',
        description: `Configuration d'alerte: ${config.name}`,
      },
      update: {
        value: config as any,
      },
    });
  }

  /**
   * Obtenir les métriques système
   */
  async getSystemMetrics(): Promise<any> {
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

    return {
      cpu: await this.getLatestMetric('cpu_usage'),
      memory: await this.getLatestMetric('memory_usage'),
      disk: await this.getLatestMetric('disk_usage'),
      network: {
        inbound: await this.getLatestMetric('network_in'),
        outbound: await this.getLatestMetric('network_out'),
      },
      database: {
        connections: await this.getLatestMetric('db_connections'),
        queryTime: await this.getLatestMetric('db_query_time'),
      },
    };
  }

  /**
   * Obtenir l'historique d'une métrique
   */
  async getMetricHistory(
    metricName: string,
    startDate: Date,
    endDate: Date,
    aggregation: 'min' | 'max' | 'avg' | 'sum' = 'avg'
  ): Promise<any[]> {
    const metrics = await this.prisma.analytics.findMany({
      where: {
        metric: metricName,
        timestamp: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { timestamp: 'asc' },
    });

    // Grouper par heure
    const grouped = this.groupMetricsByHour(metrics);
    
    return Object.entries(grouped).map(([hour, values]) => ({
      timestamp: hour,
      value: this.aggregate(values.map(v => v.value), aggregation),
      count: values.length,
    }));
  }

  /**
   * Générer un rapport de monitoring
   */
  async generateReport(
    startDate: Date,
    endDate: Date
  ): Promise<any> {
    const [
      performance,
      health,
      topErrors,
      slowestEndpoints,
      userActivity,
    ] = await Promise.all([
      this.getPerformanceMetrics(startDate, endDate),
      this.performHealthCheck(),
      this.getTopErrors(startDate, endDate),
      this.getSlowestEndpoints(startDate, endDate),
      this.getUserActivityStats(startDate, endDate),
    ]);

    return {
      period: { startDate, endDate },
      performance,
      health: {
        overall: this.calculateOverallHealth(health),
        services: health,
      },
      errors: topErrors,
      slowEndpoints: slowestEndpoints,
      userActivity,
      generatedAt: new Date(),
    };
  }

  // Méthodes privées

  private async persistMetric(metric: MetricData, timestamp: Date): Promise<void> {
    await this.prisma.analytics.create({
      data: {
        metric: metric.name,
        value: metric.value,
        dimension: metric.tags ? JSON.stringify(metric.tags) : null,
        timestamp,
        period: 'HOURLY',
        metadata: metric.tags,
      },
    });
  }

  private async checkAlerts(metricName: string, value: number): Promise<void> {
    for (const [alertName, config] of this.alerts) {
      if (config.metric !== metricName) continue;

      const triggered = this.evaluateAlert(value, config.threshold, config.operator);
      
      if (triggered) {
        await this.triggerAlert(alertName, config, value);
      }
    }
  }

  private evaluateAlert(
    value: number,
    threshold: number,
    operator: string
  ): boolean {
    switch (operator) {
      case '>': return value > threshold;
      case '<': return value < threshold;
      case '>=': return value >= threshold;
      case '<=': return value <= threshold;
      case '==': return value === threshold;
      default: return false;
    }
  }

  private async triggerAlert(
    alertName: string,
    config: AlertConfig,
    value: number
  ): Promise<void> {
    // Créer une notification
    await this.prisma.notification.create({
      data: {
        type: 'SYSTEM_ALERT',
        channel: 'IN_APP',
        title: `Alerte: ${alertName}`,
        message: `La métrique ${config.metric} (${value}) a dépassé le seuil ${config.threshold}`,
        receiverId: 'system', // À remplacer par les admins
        data: {
          alertName,
          metric: config.metric,
          value,
          threshold: config.threshold,
          severity: config.severity,
        },
      },
    });

    // Log l'alerte
    await this.prisma.auditLog.create({
      data: {
        action: 'ALERT_TRIGGERED',
        resource: 'monitoring',
        resourceId: alertName,
        severity: config.severity.toUpperCase(),
        details: {
          metric: config.metric,
          value,
          threshold: config.threshold,
        },
      },
    });
  }

  private async checkDatabase(): Promise<HealthCheckResult> {
    const start = Date.now();
    
    try {
      // Test simple de connexion
      await this.prisma.$queryRaw`SELECT 1`;
      
      const responseTime = Date.now() - start;
      
      return {
        service: 'database',
        status: responseTime < 100 ? 'healthy' : 'degraded',
        responseTime,
        checkedAt: new Date(),
      };
    } catch (error) {
      return {
        service: 'database',
        status: 'unhealthy',
        responseTime: Date.now() - start,
        details: { error: error instanceof Error ? error.message : 'Unknown error' },
        checkedAt: new Date(),
      };
    }
  }

  private async checkExternalServices(): Promise<HealthCheckResult> {
    // TODO: Implémenter les checks pour les services externes
    return {
      service: 'external_services',
      status: 'healthy',
      checkedAt: new Date(),
    };
  }

  private async checkQueues(): Promise<HealthCheckResult> {
    // TODO: Implémenter les checks pour les files d'attente
    return {
      service: 'queues',
      status: 'healthy',
      checkedAt: new Date(),
    };
  }

  private async checkStorage(): Promise<HealthCheckResult> {
    // TODO: Implémenter les checks pour le stockage
    return {
      service: 'storage',
      status: 'healthy',
      checkedAt: new Date(),
    };
  }

  private async getAverageMetric(
    metricName: string,
    startDate: Date,
    endDate: Date
  ): Promise<number | null> {
    const result = await this.prisma.analytics.aggregate({
      where: {
        metric: metricName,
        timestamp: {
          gte: startDate,
          lte: endDate,
        },
      },
      _avg: {
        value: true,
      },
    });

    return result._avg.value;
  }

  private async getLatestMetric(metricName: string): Promise<number | null> {
    const metric = await this.prisma.analytics.findFirst({
      where: { metric: metricName },
      orderBy: { timestamp: 'desc' },
    });

    return metric?.value || null;
  }

  private async getTopErrors(
    startDate: Date,
    endDate: Date,
    limit: number = 10
  ): Promise<any[]> {
    const errors = await this.prisma.auditLog.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
        severity: { in: ['ERROR', 'CRITICAL'] },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return errors.map(error => ({
      timestamp: error.createdAt,
      action: error.action,
      resource: error.resource,
      details: error.details,
    }));
  }

  private async getSlowestEndpoints(
    startDate: Date,
    endDate: Date,
    limit: number = 10
  ): Promise<any[]> {
    // TODO: Implémenter l'analyse des endpoints lents
    return [];
  }

  private async getUserActivityStats(
    startDate: Date,
    endDate: Date
  ): Promise<any> {
    const [
      totalLogins,
      uniqueUsers,
      averageSessionDuration,
    ] = await Promise.all([
      this.prisma.auditLog.count({
        where: {
          action: 'LOGIN',
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      }),
      this.prisma.user.count({
        where: {
          lastLoginAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      }),
      this.getAverageMetric('session_duration', startDate, endDate),
    ]);

    return {
      totalLogins,
      uniqueUsers,
      averageSessionDuration: averageSessionDuration || 0,
    };
  }

  private groupMetricsByHour(metrics: any[]): Record<string, any[]> {
    const grouped: Record<string, any[]> = {};
    
    metrics.forEach(metric => {
      const hour = new Date(metric.timestamp);
      hour.setMinutes(0, 0, 0);
      const key = hour.toISOString();
      
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(metric);
    });

    return grouped;
  }

  private aggregate(values: number[], type: string): number {
    if (values.length === 0) return 0;
    
    switch (type) {
      case 'min': return Math.min(...values);
      case 'max': return Math.max(...values);
      case 'sum': return values.reduce((a, b) => a + b, 0);
      case 'avg': 
      default:
        return values.reduce((a, b) => a + b, 0) / values.length;
    }
  }

  private calculateOverallHealth(checks: HealthCheckResult[]): string {
    const unhealthy = checks.filter(c => c.status === 'unhealthy').length;
    const degraded = checks.filter(c => c.status === 'degraded').length;
    
    if (unhealthy > 0) return 'unhealthy';
    if (degraded > 0) return 'degraded';
    return 'healthy';
  }

  private startMetricsCollection(): void {
    // Collecter les métriques système toutes les minutes
    setInterval(async () => {
      try {
        await this.collectSystemMetrics();
      } catch (error) {
        console.error('Erreur collecte métriques:', error);
      }
    }, 60 * 1000);

    // Health check toutes les 5 minutes
    setInterval(async () => {
      try {
        await this.performHealthCheck();
      } catch (error) {
        console.error('Erreur health check:', error);
      }
    }, 5 * 60 * 1000);
  }

  private async collectSystemMetrics(): Promise<void> {
    // TODO: Implémenter la collecte réelle des métriques système
    const metrics: MetricData[] = [
      {
        name: 'active_requests',
        value: await this.getActiveRequests(),
      },
      {
        name: 'db_connections',
        value: await this.getDatabaseConnections(),
      },
    ];

    await this.recordMetrics(metrics);
  }

  private async getActiveRequests(): Promise<number> {
    // Compter les requêtes en cours
    return await this.prisma.serviceRequest.count({
      where: {
        status: { in: ['SUBMITTED', 'ASSIGNED', 'IN_PROGRESS'] },
      },
    });
  }

  private async getDatabaseConnections(): Promise<number> {
    // TODO: Obtenir le nombre réel de connexions
    return 10; // Valeur simulée
  }
} 