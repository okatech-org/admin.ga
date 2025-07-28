/* @ts-nocheck */
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AuthenticatedLayout } from '@/components/layouts/authenticated-layout';
import { 
  Server, 
  Database, 
  Cpu, 
  HardDrive,
  MemoryStick,
  Wifi,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw,
  Download,
  Upload,
  Monitor,
  Shield,
  Lock,
  Unlock,
  Settings,
  BarChart3,
  Zap,
  Globe,
  Users
} from 'lucide-react';

// Données mock du système
const systemMetrics = {
  servers: [
    {
      id: 1,
      name: "Web Server 1",
      status: "ONLINE",
      cpu: 45,
      memory: 68,
      disk: 34,
      uptime: "15j 8h 23m",
      load: "1.2",
      location: "Libreville DC1"
    },
    {
      id: 2,
      name: "Database Server",
      status: "ONLINE",
      cpu: 23,
      memory: 78,
      disk: 56,
      uptime: "15j 8h 23m",
      load: "0.8",
      location: "Libreville DC1"
    },
    {
      id: 3,
      name: "Backup Server",
      status: "MAINTENANCE",
      cpu: 12,
      memory: 34,
      disk: 89,
      uptime: "2h 15m",
      load: "0.3",
      location: "Port-Gentil DC2"
    }
  ],
  databases: [
    {
      name: "PostgreSQL Principal",
      status: "ONLINE",
      size: "245 GB",
      connections: 47,
      maxConnections: 100,
      queries: "2,345/min",
      backup: "2024-03-15 02:00"
    },
    {
      name: "Redis Cache",
      status: "ONLINE",
      size: "8.5 GB",
      memory: "85%",
      hits: "98.5%",
      operations: "15,234/sec",
      backup: "N/A"
    }
  ],
  services: [
    { name: "API Gateway", status: "ONLINE", responseTime: "45ms", requests: "1,234/min" },
    { name: "Authentication", status: "ONLINE", responseTime: "23ms", requests: "567/min" },
    { name: "Notification Service", status: "DEGRADED", responseTime: "156ms", requests: "89/min" },
    { name: "File Storage", status: "ONLINE", responseTime: "67ms", requests: "234/min" },
    { name: "Email Service", status: "OFFLINE", responseTime: "N/A", requests: "0/min" }
  ],
  security: {
    threats: 3,
    blockedIPs: 127,
    failedLogins: 45,
    activeFirewallRules: 234,
    lastSecurityScan: "2024-03-15 06:00"
  }
};

const alertsData = [
  {
    id: 1,
    type: "ERROR",
    message: "Service Email hors ligne depuis 2h",
    timestamp: "2024-03-15 14:30",
    severity: "HIGH"
  },
  {
    id: 2,
    type: "WARNING",
    message: "Utilisation mémoire élevée sur DB Server (78%)",
    timestamp: "2024-03-15 14:15",
    severity: "MEDIUM"
  },
  {
    id: 3,
    type: "INFO",
    message: "Sauvegarde automatique complétée",
    timestamp: "2024-03-15 02:00",
    severity: "LOW"
  }
];

export default function SuperAdminSystemePage() {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [refreshing, setRefreshing] = useState(false);

  const refreshData = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ONLINE': return 'bg-green-500';
      case 'OFFLINE': return 'bg-red-500';
      case 'MAINTENANCE': return 'bg-yellow-500';
      case 'DEGRADED': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ONLINE': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'OFFLINE': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'MAINTENANCE': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'DEGRADED': return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Server className="h-8 w-8 text-blue-500" />
              Système & Monitoring
            </h1>
            <p className="text-muted-foreground">
              Surveillance en temps réel de l'infrastructure et des services
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={refreshData} disabled={refreshing}>
              <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Rapport
            </Button>
            <Button>
              <Settings className="mr-2 h-4 w-4" />
              Configuration
            </Button>
          </div>
        </div>

        {/* Métriques globales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Server className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Serveurs Actifs</p>
                  <p className="text-2xl font-bold">
                    {systemMetrics.servers.filter(s => s.status === 'ONLINE').length}/{systemMetrics.servers.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Database className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Bases de Données</p>
                  <p className="text-2xl font-bold">{systemMetrics.databases.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Activity className="h-8 w-8 text-purple-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Services Actifs</p>
                  <p className="text-2xl font-bold">
                    {systemMetrics.services.filter(s => s.status === 'ONLINE').length}/{systemMetrics.services.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Shield className="h-8 w-8 text-red-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Menaces Détectées</p>
                  <p className="text-2xl font-bold">{systemMetrics.security.threats}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alertes système */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Alertes Système Récentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alertsData.map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      alert.severity === 'HIGH' ? 'bg-red-500' :
                      alert.severity === 'MEDIUM' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`} />
                    <div>
                      <p className="font-medium">{alert.message}</p>
                      <p className="text-sm text-muted-foreground">{alert.timestamp}</p>
                    </div>
                  </div>
                  <Badge variant={alert.severity === 'HIGH' ? 'destructive' : 'outline'}>
                    {alert.severity}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Onglets détaillés */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="servers">Serveurs</TabsTrigger>
            <TabsTrigger value="databases">Bases de Données</TabsTrigger>
            <TabsTrigger value="security">Sécurité</TabsTrigger>
          </TabsList>

          {/* Vue d'ensemble */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Services et APIs</CardTitle>
                  <CardDescription>État des microservices et APIs</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {systemMetrics.services.map((service, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(service.status)}
                          <div>
                            <p className="font-medium">{service.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {service.responseTime} • {service.requests}
                            </p>
                          </div>
                        </div>
                        <Badge className={`text-white ${getStatusColor(service.status)}`}>
                          {service.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Métriques de Performance</CardTitle>
                  <CardDescription>Indicateurs clés de performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">CPU Global</span>
                        <span className="text-sm text-muted-foreground">
                          {Math.round(systemMetrics.servers.reduce((sum, s) => sum + s.cpu, 0) / systemMetrics.servers.length)}%
                        </span>
                      </div>
                      <Progress value={Math.round(systemMetrics.servers.reduce((sum, s) => sum + s.cpu, 0) / systemMetrics.servers.length)} />
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Mémoire Globale</span>
                        <span className="text-sm text-muted-foreground">
                          {Math.round(systemMetrics.servers.reduce((sum, s) => sum + s.memory, 0) / systemMetrics.servers.length)}%
                        </span>
                      </div>
                      <Progress value={Math.round(systemMetrics.servers.reduce((sum, s) => sum + s.memory, 0) / systemMetrics.servers.length)} />
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Stockage Global</span>
                        <span className="text-sm text-muted-foreground">
                          {Math.round(systemMetrics.servers.reduce((sum, s) => sum + s.disk, 0) / systemMetrics.servers.length)}%
                        </span>
                      </div>
                      <Progress value={Math.round(systemMetrics.servers.reduce((sum, s) => sum + s.disk, 0) / systemMetrics.servers.length)} />
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <div className="text-center p-3 bg-blue-50 rounded">
                        <div className="text-2xl font-bold text-blue-600">99.8%</div>
                        <div className="text-xs text-muted-foreground">Disponibilité</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded">
                        <div className="text-2xl font-bold text-green-600">1.2s</div>
                        <div className="text-xs text-muted-foreground">Temps réponse</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Serveurs */}
          <TabsContent value="servers" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {systemMetrics.servers.map((server) => (
                <Card key={server.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{server.name}</CardTitle>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(server.status)}
                        <Badge className={`text-white ${getStatusColor(server.status)}`}>
                          {server.status}
                        </Badge>
                      </div>
                    </div>
                    <CardDescription>{server.location}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">CPU</span>
                          <span className="text-sm">{server.cpu}%</span>
                        </div>
                        <Progress value={server.cpu} />
                      </div>

                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Mémoire</span>
                          <span className="text-sm">{server.memory}%</span>
                        </div>
                        <Progress value={server.memory} />
                      </div>

                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Disque</span>
                          <span className="text-sm">{server.disk}%</span>
                        </div>
                        <Progress value={server.disk} />
                      </div>

                      <div className="pt-3 border-t">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">Uptime:</span>
                            <div className="font-medium">{server.uptime}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Load:</span>
                            <div className="font-medium">{server.load}</div>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Monitor className="h-3 w-3 mr-1" />
                          Détails
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Settings className="h-3 w-3 mr-1" />
                          Config
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Bases de données */}
          <TabsContent value="databases" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {systemMetrics.databases.map((db, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Database className="h-5 w-5" />
                        {db.name}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(db.status)}
                        <Badge className={`text-white ${getStatusColor(db.status)}`}>
                          {db.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm text-muted-foreground">Taille</span>
                          <div className="font-medium">{db.size}</div>
                        </div>
                        {db.connections && (
                          <div>
                            <span className="text-sm text-muted-foreground">Connexions</span>
                            <div className="font-medium">{db.connections}/{db.maxConnections}</div>
                          </div>
                        )}
                      </div>

                      {db.connections && (
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Utilisation connexions</span>
                            <span className="text-sm">{Math.round((db.connections / db.maxConnections) * 100)}%</span>
                          </div>
                          <Progress value={(db.connections / db.maxConnections) * 100} />
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        {db.queries && (
                          <div>
                            <span className="text-muted-foreground">Requêtes/min:</span>
                            <div className="font-medium">{db.queries}</div>
                          </div>
                        )}
                        {db.hits && (
                          <div>
                            <span className="text-muted-foreground">Hit Rate:</span>
                            <div className="font-medium">{db.hits}</div>
                          </div>
                        )}
                      </div>

                      <div className="pt-3 border-t">
                        <div className="text-sm">
                          <span className="text-muted-foreground">Dernière sauvegarde:</span>
                          <div className="font-medium">{db.backup}</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Sécurité */}
          <TabsContent value="security" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <AlertTriangle className="h-8 w-8 text-red-500" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Menaces Actives</p>
                      <p className="text-2xl font-bold">{systemMetrics.security.threats}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Lock className="h-8 w-8 text-orange-500" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">IPs Bloquées</p>
                      <p className="text-2xl font-bold">{systemMetrics.security.blockedIPs}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Users className="h-8 w-8 text-yellow-500" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Tentatives Échouées</p>
                      <p className="text-2xl font-bold">{systemMetrics.security.failedLogins}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Shield className="h-8 w-8 text-green-500" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Règles Firewall</p>
                      <p className="text-2xl font-bold">{systemMetrics.security.activeFirewallRules}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Statut de Sécurité</CardTitle>
                <CardDescription>
                  Dernière analyse: {systemMetrics.security.lastSecurityScan}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="font-medium">Firewall</p>
                        <p className="text-sm text-muted-foreground">Tous les ports sécurisés</p>
                      </div>
                    </div>
                    <Badge className="bg-green-500 text-white">SÉCURISÉ</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="font-medium">Chiffrement SSL</p>
                        <p className="text-sm text-muted-foreground">Certificats valides</p>
                      </div>
                    </div>
                    <Badge className="bg-green-500 text-white">ACTIF</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                      <div>
                        <p className="font-medium">Mises à jour système</p>
                        <p className="text-sm text-muted-foreground">3 mises à jour disponibles</p>
                      </div>
                    </div>
                    <Badge className="bg-yellow-500 text-white">ATTENTION</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="font-medium">Sauvegarde</p>
                        <p className="text-sm text-muted-foreground">Dernière sauvegarde réussie</p>
                      </div>
                    </div>
                    <Badge className="bg-green-500 text-white">OK</Badge>
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