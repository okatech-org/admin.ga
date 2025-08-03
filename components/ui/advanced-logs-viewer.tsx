'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Search,
  Filter,
  Download,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Info,
  X,
  Clock,
  Database,
  Users,
  Shield,
  Activity,
  Server,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS' | 'DEBUG';
  source: string;
  message: string;
  category: 'system' | 'security' | 'database' | 'api' | 'user';
  details?: Record<string, any>;
}

interface AdvancedLogsViewerProps {
  maxEntries?: number;
  refreshInterval?: number;
  allowExport?: boolean;
  categories?: string[];
  className?: string;
}

export function AdvancedLogsViewer({
  maxEntries = 100,
  refreshInterval = 3000,
  allowExport = true,
  categories = ['system', 'security', 'database', 'api', 'user'],
  className
}: AdvancedLogsViewerProps) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Simulation de génération de logs en temps réel
  const generateNewLog = (): LogEntry => {
    const levels: LogEntry['level'][] = ['INFO', 'WARNING', 'ERROR', 'SUCCESS', 'DEBUG'];
    const sources = ['API Gateway', 'Database', 'Auth Service', 'File Storage', 'Backup Service', 'Security Scanner'];
    const cats: LogEntry['category'][] = ['system', 'security', 'database', 'api', 'user'];

    const messages = [
      'Connexion utilisateur réussie',
      'Sauvegarde automatique complétée',
      'Échec de connexion base de données',
      'Mise à jour de sécurité appliquée',
      'Requête API exécutée avec succès',
      'Tentative d\'accès non autorisé détectée',
      'Optimisation des index terminée',
      'Service redémarré automatiquement',
      'Nouveau certificat SSL installé',
      'Synchronisation des données complétée'
    ];

    const level = levels[Math.floor(Math.random() * levels.length)];
    const source = sources[Math.floor(Math.random() * sources.length)];
    const category = cats[Math.floor(Math.random() * cats.length)];
    const message = messages[Math.floor(Math.random() * messages.length)];

    return {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      level,
      source,
      message,
      category,
      details: {
        userAgent: 'ADMIN.GA/1.0',
        ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        duration: Math.floor(Math.random() * 1000) + 'ms'
      }
    };
  };

  // Initialisation avec des logs existants
  useEffect(() => {
    const initialLogs: LogEntry[] = [
      {
        id: 'log-1',
        timestamp: new Date(Date.now() - 300000).toISOString(),
        level: 'SUCCESS',
        source: 'Database',
        message: 'Sauvegarde automatique terminée avec succès (245 MB)',
        category: 'database'
      },
      {
        id: 'log-2',
        timestamp: new Date(Date.now() - 240000).toISOString(),
        level: 'INFO',
        source: 'Auth Service',
        message: 'Connexion administrateur depuis Libreville',
        category: 'user'
      },
      {
        id: 'log-3',
        timestamp: new Date(Date.now() - 180000).toISOString(),
        level: 'WARNING',
        source: 'API Gateway',
        message: 'Utilisation mémoire élevée détectée (78%)',
        category: 'system'
      },
      {
        id: 'log-4',
        timestamp: new Date(Date.now() - 120000).toISOString(),
        level: 'ERROR',
        source: 'Security Scanner',
        message: 'Tentative d\'intrusion bloquée (IP: 45.123.67.89)',
        category: 'security'
      },
      {
        id: 'log-5',
        timestamp: new Date(Date.now() - 60000).toISOString(),
        level: 'INFO',
        source: 'File Storage',
        message: 'Nettoyage automatique des fichiers temporaires',
        category: 'system'
      }
    ];

    setLogs(initialLogs);
  }, []);

  // Mise à jour automatique des logs
  useEffect(() => {
    if (!isAutoRefresh) return;

    const interval = setInterval(() => {
      const newLog = generateNewLog();
      setLogs(prev => {
        const updated = [newLog, ...prev];
        return updated.slice(0, maxEntries); // Garder seulement les N derniers logs
      });
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [isAutoRefresh, refreshInterval, maxEntries]);

  // Filtrage des logs
  useEffect(() => {
    let filtered = logs;

    // Filtre par terme de recherche
    if (searchTerm) {
      filtered = filtered.filter(log =>
        log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.source.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par niveau
    if (levelFilter !== 'all') {
      filtered = filtered.filter(log => log.level === levelFilter);
    }

    // Filtre par catégorie
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(log => log.category === categoryFilter);
    }

    setFilteredLogs(filtered);
  }, [logs, searchTerm, levelFilter, categoryFilter]);

  const getLevelIcon = (level: LogEntry['level']) => {
    switch (level) {
      case 'SUCCESS': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'ERROR': return <X className="h-4 w-4 text-red-500" />;
      case 'WARNING': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'INFO': return <Info className="h-4 w-4 text-blue-500" />;
      case 'DEBUG': return <Activity className="h-4 w-4 text-gray-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getLevelColor = (level: LogEntry['level']) => {
    switch (level) {
      case 'SUCCESS': return 'bg-green-100 text-green-800';
      case 'ERROR': return 'bg-red-100 text-red-800';
      case 'WARNING': return 'bg-yellow-100 text-yellow-800';
      case 'INFO': return 'bg-blue-100 text-blue-800';
      case 'DEBUG': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: LogEntry['category']) => {
    switch (category) {
      case 'system': return <Server className="h-4 w-4" />;
      case 'security': return <Shield className="h-4 w-4" />;
      case 'database': return <Database className="h-4 w-4" />;
      case 'api': return <Zap className="h-4 w-4" />;
      case 'user': return <Users className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const exportLogs = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      totalLogs: filteredLogs.length,
      filters: { searchTerm, levelFilter, categoryFilter },
      logs: filteredLogs
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `logs-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast.success('📥 Logs exportés avec succès');
  };

  const manualRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      const newLog = generateNewLog();
      setLogs(prev => [newLog, ...prev.slice(0, maxEntries - 1)]);
      setIsLoading(false);
      toast.success('🔄 Logs actualisés');
    }, 500);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Logs Système Avancés
            </CardTitle>
            <CardDescription>
              Surveillance en temps réel des événements système • {filteredLogs.length} entrées
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAutoRefresh(!isAutoRefresh)}
            >
              {isAutoRefresh ? 'Pause' : 'Auto'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={manualRefresh}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
            {allowExport && (
              <Button
                variant="outline"
                size="sm"
                onClick={exportLogs}
              >
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filtres */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="🔍 Rechercher dans les logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={levelFilter} onValueChange={setLevelFilter}>
            <SelectTrigger className="sm:w-48">
              <SelectValue placeholder="Niveau" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les niveaux</SelectItem>
              <SelectItem value="ERROR">Erreurs</SelectItem>
              <SelectItem value="WARNING">Avertissements</SelectItem>
              <SelectItem value="SUCCESS">Succès</SelectItem>
              <SelectItem value="INFO">Informations</SelectItem>
              <SelectItem value="DEBUG">Debug</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="sm:w-48">
              <SelectValue placeholder="Catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes catégories</SelectItem>
              <SelectItem value="system">Système</SelectItem>
              <SelectItem value="security">Sécurité</SelectItem>
              <SelectItem value="database">Base de données</SelectItem>
              <SelectItem value="api">API</SelectItem>
              <SelectItem value="user">Utilisateur</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Liste des logs */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredLogs.map((log) => (
            <div key={log.id} className="flex items-center gap-3 p-3 text-sm hover:bg-gray-50 rounded-lg border transition-colors">
              <span className="text-xs text-muted-foreground font-mono w-20">
                {new Date(log.timestamp).toLocaleTimeString('fr-FR')}
              </span>

              {getLevelIcon(log.level)}

              <div className="flex items-center gap-2">
                {getCategoryIcon(log.category)}
                <span className="text-xs text-muted-foreground">{log.source}</span>
              </div>

              <span className="flex-1">{log.message}</span>

              <Badge variant="outline" className={`text-xs ${getLevelColor(log.level)}`}>
                {log.level}
              </Badge>
            </div>
          ))}

          {filteredLogs.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Aucun log trouvé avec les filtres actuels</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
