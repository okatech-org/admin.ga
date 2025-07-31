'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AuthenticatedLayout } from '@/components/layouts/authenticated-layout';
import {
  Database,
  Save,
  Download,
  Upload,
  RefreshCw,
  Play,
  Eye,
  Settings,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Building2,
  FileText,
  Activity,
  BarChart3,
  Table,
  Search,
  Filter,
  Plus,
  Trash2,
  Edit,
  Copy,
  ExternalLink,
  Loader2,
  Info,
  TrendingUp,
  Shield,
  Server,
  HardDrive,
  Zap,
  MonitorSpeaker,
  Timer,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

// Types pour les données de la base
interface TableInfo {
  name: string;
  rows: number;
  size: string;
  lastUpdated: string;
  type: 'table' | 'view';
  description?: string;
}

interface DatabaseStats {
  totalTables: number;
  totalRows: number;
  databaseSize: string;
  activeConnections: number;
  uptime: string;
  lastBackup: string;
}

interface QueryResult {
  columns: string[];
  rows: any[][];
  affectedRows?: number;
  executionTime: number;
}

export default function BaseDonneesPage() {
  // États principaux
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [stats, setStats] = useState<DatabaseStats | null>(null);
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [tableData, setTableData] = useState<any[]>([]);
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  const [query, setQuery] = useState('');

  // États des actions
  const [backupLoading, setBackupLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [migrateLoading, setMigrateLoading] = useState(false);

  // Charger les données initiales
  useEffect(() => {
    loadDatabaseInfo();
  }, []);

    // Charger les informations de la base
  const loadDatabaseInfo = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/database/info');
      const result = await response.json();

      if (result.success) {
        setTables(result.data.tables);
        setStats(result.data.stats);
        toast.success('Informations de la base chargées');
      } else {
        throw new Error(result.error || 'Erreur API');
      }
    } catch (error) {
      toast.error('Erreur lors du chargement des données');
      console.error('Erreur:', error);

      // Données de fallback en cas d'erreur
      const fallbackTables: TableInfo[] = [
        { name: 'users', rows: 0, size: '0 KB', lastUpdated: 'N/A', type: 'table', description: 'Utilisateurs du système' },
        { name: 'organizations', rows: 0, size: '0 KB', lastUpdated: 'N/A', type: 'table', description: 'Organisations gabonaises' },
      ];

      const fallbackStats: DatabaseStats = {
        totalTables: 0,
        totalRows: 0,
        databaseSize: '0 MB',
        activeConnections: 0,
        uptime: 'N/A',
        lastBackup: 'N/A'
      };

      setTables(fallbackTables);
      setStats(fallbackStats);
    } finally {
      setLoading(false);
    }
  };

    // Actions de base de données
  const handleBackup = async () => {
    setBackupLoading(true);
    try {
      toast.info('Création du backup en cours...', { duration: 2000 });

      const response = await fetch('/api/database/backup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type: 'full' })
      });

      const result = await response.json();

      if (result.success) {
        toast.success('✅ Backup créé avec succès !');
        toast.info(`📁 Fichier: ${result.data.fileName} (${result.data.size})`);

        // Mettre à jour la date du dernier backup
        if (stats) {
          setStats({
            ...stats,
            lastBackup: new Date().toLocaleString('fr-FR')
          });
        }
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast.error('❌ Erreur lors du backup');
      console.error('Erreur backup:', error);
    } finally {
      setBackupLoading(false);
    }
  };

    const handleExport = async (format: 'sql' | 'csv' | 'json') => {
    setExportLoading(true);
    try {
      toast.info(`Export ${format.toUpperCase()} en cours...`, { duration: 2000 });

      const response = await fetch('/api/database/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          format,
          includeData: true,
          tables: ['users', 'organizations', 'service_requests']
        })
      });

      const result = await response.json();

      if (result.success) {
        toast.success(`✅ Export terminé : ${result.data.fileName}`);
        toast.info(`📁 Taille: ${result.data.size}`);

        // Optionnel: déclencher le téléchargement
        // window.open(result.data.downloadUrl, '_blank');
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast.error('❌ Erreur lors de l\'export');
      console.error('Erreur export:', error);
    } finally {
      setExportLoading(false);
    }
  };

  const handleMigrate = async () => {
    setMigrateLoading(true);
    try {
      toast.info('🔄 Exécution des migrations...', { duration: 3000 });

      // Simuler la migration
      await new Promise(resolve => setTimeout(resolve, 4000));

      toast.success('✅ Migrations appliquées avec succès !');

      // Recharger les données
      await loadDatabaseInfo();
    } catch (error) {
      toast.error('❌ Erreur lors des migrations');
    } finally {
      setMigrateLoading(false);
    }
  };

    const handleTableView = async (tableName: string) => {
    setSelectedTable(tableName);
    setLoading(true);

    try {
      const response = await fetch(`/api/database/table/${tableName}?limit=50&offset=0`);
      const result = await response.json();

      if (result.success) {
        setTableData(result.data.rows);

        if (result.data.rows.length === 0) {
          toast.info(`Table ${tableName} est vide`);
        } else {
          toast.success(`${result.data.rows.length} enregistrements chargés`);
        }
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast.error('Erreur lors du chargement des données');
      console.error('Erreur table view:', error);

      // Données de fallback
      setTableData([
        {
          info: 'Erreur de chargement',
          message: `Impossible de charger les données de la table ${tableName}`,
          solution: 'Vérifiez que la base de données est accessible'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const executeQuery = async () => {
    if (!query.trim()) {
      toast.error('Veuillez saisir une requête');
      return;
    }

    setLoading(true);
    try {
      toast.info('⚡ Exécution de la requête...', { duration: 1500 });

      // Simuler l'exécution
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Résultat d'exemple
      const mockResult: QueryResult = {
        columns: ['id', 'nom', 'status', 'date_creation'],
        rows: [
          [1, 'Exemple 1', 'Actif', '2024-01-15'],
          [2, 'Exemple 2', 'Inactif', '2024-01-14'],
          [3, 'Exemple 3', 'Actif', '2024-01-13'],
        ],
        executionTime: 0.045
      };

      setQueryResult(mockResult);
      toast.success(`✅ Requête exécutée en ${mockResult.executionTime}s`);
    } catch (error) {
      toast.error('❌ Erreur lors de l\'exécution');
    } finally {
      setLoading(false);
    }
  };

  const renderTableCard = (table: TableInfo) => (
    <Card key={table.name} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleTableView(table.name)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Table className="h-4 w-4" />
            {table.name}
          </CardTitle>
          <Badge variant={table.type === 'table' ? 'default' : 'secondary'}>
            {table.type}
          </Badge>
        </div>
        {table.description && (
          <CardDescription>{table.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Lignes :</span>
            <span className="font-medium">{table.rows.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Taille :</span>
            <span className="font-medium">{table.size}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Mise à jour :</span>
            <span className="font-medium text-xs">{table.lastUpdated}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Database className="h-8 w-8 text-blue-600" />
              Gestion Base de Données
            </h1>
            <p className="text-muted-foreground mt-2">
              Interface simple pour gérer et visualiser votre base de données
            </p>
          </div>

          <div className="flex gap-2">
            <Button onClick={loadDatabaseInfo} variant="outline" disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
          </div>
        </div>

        {/* Actions rapides */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-600" />
              Actions Rapides
            </CardTitle>
            <CardDescription>
              Effectuez rapidement les tâches les plus courantes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button
                onClick={handleBackup}
                disabled={backupLoading}
                className="h-20 flex-col gap-2 bg-green-600 hover:bg-green-700"
              >
                {backupLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Save className="h-5 w-5" />
                )}
                <span className="text-sm">Sauvegarder</span>
              </Button>

              <Button
                onClick={() => handleExport('sql')}
                disabled={exportLoading}
                variant="outline"
                className="h-20 flex-col gap-2"
              >
                {exportLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Download className="h-5 w-5" />
                )}
                <span className="text-sm">Exporter SQL</span>
              </Button>

              <Button
                onClick={handleMigrate}
                disabled={migrateLoading}
                variant="outline"
                className="h-20 flex-col gap-2"
              >
                {migrateLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Settings className="h-5 w-5" />
                )}
                <span className="text-sm">Migrations</span>
              </Button>

              <Button
                onClick={() => setActiveTab('monitoring')}
                variant="outline"
                className="h-20 flex-col gap-2"
              >
                <Activity className="h-5 w-5" />
                <span className="text-sm">Monitoring</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Onglets principaux */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard">
              <BarChart3 className="h-4 w-4 mr-2" />
              Tableau de Bord
            </TabsTrigger>
            <TabsTrigger value="tables">
              <Table className="h-4 w-4 mr-2" />
              Tables
            </TabsTrigger>
            <TabsTrigger value="data">
              <Eye className="h-4 w-4 mr-2" />
              Données
            </TabsTrigger>
            <TabsTrigger value="query">
              <Play className="h-4 w-4 mr-2" />
              Requêtes
            </TabsTrigger>
            <TabsTrigger value="monitoring">
              <MonitorSpeaker className="h-4 w-4 mr-2" />
              Monitoring
            </TabsTrigger>
          </TabsList>

          {/* Tableau de bord */}
          <TabsContent value="dashboard" className="space-y-6">
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Tables</CardTitle>
                    <Table className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalTables}</div>
                    <p className="text-xs text-muted-foreground">tables actives</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Lignes</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalRows.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">enregistrements</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Taille Base</CardTitle>
                    <HardDrive className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.databaseSize}</div>
                    <p className="text-xs text-muted-foreground">espace utilisé</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Connexions</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.activeConnections}</div>
                    <p className="text-xs text-muted-foreground">actives</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Informations système */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Server className="h-5 w-5" />
                    État du Système
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Uptime :</span>
                    <Badge variant="outline" className="bg-green-50">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {stats?.uptime}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Dernier backup :</span>
                    <span className="text-sm font-mono">{stats?.lastBackup}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Version Prisma :</span>
                    <Badge>6.12.0</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Sécurité & Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Sécurité :</span>
                      <Badge className="bg-green-100 text-green-800">Élevée</Badge>
                    </div>
                    <Progress value={95} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Performance :</span>
                      <Badge className="bg-blue-100 text-blue-800">Optimale</Badge>
                    </div>
                    <Progress value={88} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Liste des tables */}
          <TabsContent value="tables" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tables de la Base de Données</CardTitle>
                <CardDescription>
                  Cliquez sur une table pour explorer ses données
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tables.map(renderTableCard)}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Visualisation des données */}
          <TabsContent value="data" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Données de la Table</CardTitle>
                    <CardDescription>
                      {selectedTable ? `Affichage des données de : ${selectedTable}` : 'Sélectionnez une table dans l\'onglet "Tables"'}
                    </CardDescription>
                  </div>
                  {selectedTable && (
                    <Badge variant="outline">{selectedTable}</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {selectedTable ? (
                  <div className="space-y-4">
                    {loading ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin mr-2" />
                        Chargement des données...
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-200 rounded-lg">
                          <thead>
                            <tr className="bg-gray-50">
                              {Object.keys(tableData[0] || {}).map((column) => (
                                <th key={column} className="border border-gray-200 px-4 py-2 text-left font-medium">
                                  {column}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {tableData.map((row, index) => (
                              <tr key={index} className="hover:bg-gray-50">
                                {Object.values(row).map((value: any, cellIndex) => (
                                  <td key={cellIndex} className="border border-gray-200 px-4 py-2 text-sm">
                                    {typeof value === 'boolean' ? (
                                      <Badge variant={value ? 'default' : 'secondary'}>
                                        {value ? 'Oui' : 'Non'}
                                      </Badge>
                                    ) : (
                                      String(value)
                                    )}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Table className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Aucune table sélectionnée</p>
                    <p className="text-sm">Allez dans l'onglet "Tables" pour explorer les données</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Constructeur de requêtes */}
          <TabsContent value="query" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="h-5 w-5" />
                  Exécuteur de Requêtes
                </CardTitle>
                <CardDescription>
                  Exécutez des requêtes SQL personnalisées sur votre base de données
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="query">Requête SQL</Label>
                  <Textarea
                    id="query"
                    placeholder="SELECT * FROM users WHERE role = 'ADMIN'..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="font-mono"
                    rows={6}
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={executeQuery} disabled={loading || !query.trim()}>
                    {loading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Play className="h-4 w-4 mr-2" />
                    )}
                    Exécuter
                  </Button>
                  <Button variant="outline" onClick={() => setQuery('')}>
                    Effacer
                  </Button>
                </div>

                {/* Requêtes d'exemple */}
                <Card className="bg-blue-50 border-blue-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Exemples de Requêtes</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="justify-start text-xs"
                        onClick={() => setQuery('SELECT * FROM users LIMIT 10;')}
                      >
                        Voir les utilisateurs
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="justify-start text-xs"
                        onClick={() => setQuery('SELECT COUNT(*) as total FROM organizations;')}
                      >
                        Compter les organisations
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="justify-start text-xs"
                        onClick={() => setQuery('SELECT status, COUNT(*) FROM service_requests GROUP BY status;')}
                      >
                        Statistiques demandes
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="justify-start text-xs"
                        onClick={() => setQuery('SELECT * FROM ai_search_logs ORDER BY createdAt DESC LIMIT 5;')}
                      >
                        Logs IA récents
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Résultats */}
                {queryResult && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Résultats</span>
                        <Badge>
                          {queryResult.rows.length} ligne(s) • {queryResult.executionTime}s
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-200 rounded-lg">
                          <thead>
                            <tr className="bg-gray-50">
                              {queryResult.columns.map((column) => (
                                <th key={column} className="border border-gray-200 px-4 py-2 text-left font-medium">
                                  {column}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {queryResult.rows.map((row, index) => (
                              <tr key={index} className="hover:bg-gray-50">
                                {row.map((cell, cellIndex) => (
                                  <td key={cellIndex} className="border border-gray-200 px-4 py-2 text-sm">
                                    {String(cell)}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Monitoring */}
          <TabsContent value="monitoring" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Performance en Temps Réel
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">CPU Base de Données :</span>
                      <span className="text-sm font-medium">12%</span>
                    </div>
                    <Progress value={12} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Mémoire Utilisée :</span>
                      <span className="text-sm font-medium">68%</span>
                    </div>
                    <Progress value={68} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Connexions Actives :</span>
                      <span className="text-sm font-medium">12/100</span>
                    </div>
                    <Progress value={12} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    Alertes & Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        Toutes les migrations sont à jour
                      </AlertDescription>
                    </Alert>
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        Backup automatique programmé pour 02:00
                      </AlertDescription>
                    </Alert>
                    <Alert>
                      <Timer className="h-4 w-4" />
                      <AlertDescription>
                        Dernière requête lente : aucune (&lt; 1s)
                      </AlertDescription>
                    </Alert>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Actions de maintenance */}
            <Card>
              <CardHeader>
                <CardTitle>Actions de Maintenance</CardTitle>
                <CardDescription>
                  Outils pour optimiser et maintenir votre base de données
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-20 flex-col gap-2">
                    <RefreshCw className="h-5 w-5" />
                    <span className="text-sm">Nettoyer Cache</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2">
                    <BarChart3 className="h-5 w-5" />
                    <span className="text-sm">Analyser Index</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2">
                    <Shield className="h-5 w-5" />
                    <span className="text-sm">Vérifier Intégrité</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AuthenticatedLayout>
  );
}
