'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { SuperAdminLayout } from '@/components/layouts/super-admin-layout';
import { toast } from 'sonner';
import {
  Network, Building2, BarChart3, Activity, TrendingUp, Download, RefreshCw,
  Search, Settings, Eye, Loader2, FileText, Plus, Edit, Trash2,
  AlertTriangle, Clock, CheckCircle, Database, CheckCircle2,
  AlertCircle, X, Info, RotateCcw, Grid3X3, Calendar
} from 'lucide-react';

import {
  OrganizationRelation,
  RelationType,
  DataShareType,
  RelationStatus,
  RelationAnalytics,
  RELATION_TYPE_LABELS,
  DATA_SHARE_TYPE_LABELS,
  RELATION_STATUS_LABELS,
  isRelationActive
} from '@/lib/types/organization-relations';

import { InteractiveNetworkGraph } from '@/components/relations/interactive-network-graph';
import { OrganizationMatrixView } from '@/components/relations/organization-matrix-view';
import { RelationsExportManager } from '@/components/relations/relations-export-manager';
import { generateMockOrganizations, generateMockRelations, computeAnalyticsFromData } from './data-generators';

// === INTERFACES LOCALES ===
interface FilterState {
  type: RelationType | 'all';
  status: RelationStatus | 'all';
  direction: 'incoming' | 'outgoing' | 'all';
  searchQuery: string;
  dateRange: 'all' | '7d' | '30d' | '90d';
}

interface RelationFormData {
  fromOrgId: string;
  toOrgId: string;
  relationType: RelationType;
  dataShareType: DataShareType;
  sharedData?: {
    services?: string[];
    fields?: string[];
  };
  permissions?: {
    canView: boolean;
    canExport: boolean;
    canModify: boolean;
    canDelete: boolean;
  };
  endDate?: string;
  notes?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
}

// === COMPOSANTS DASHBOARD ===
const StatCard = ({ title, value, icon: Icon, color, trend, description }: {
  title: string;
  value: string | number;
  icon: any;
  color: string;
  trend?: number;
  description?: string;
}) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          {description && (
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      {trend !== undefined && (
        <div className="flex items-center mt-4">
          <TrendingUp className={`w-4 h-4 mr-1 ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`} />
          <span className={`text-sm ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend >= 0 ? '+' : ''}{trend}%
          </span>
          <span className="text-xs text-gray-500 ml-1">vs mois dernier</span>
        </div>
      )}
    </CardContent>
  </Card>
);

const AlertCard = ({ type, message, count }: {
  type: 'warning' | 'error' | 'info';
  message: string;
  count?: number;
}) => {
  const colors = {
    warning: 'border-yellow-200 bg-yellow-50 text-yellow-800',
    error: 'border-red-200 bg-red-50 text-red-800',
    info: 'border-blue-200 bg-blue-50 text-blue-800'
  };

  const icons = {
    warning: AlertTriangle,
    error: X,
    info: Info
  };

  const Icon = icons[type];

  return (
    <Alert className={colors[type]}>
      <Icon className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <span>{message}</span>
        {count && (
          <Badge variant="outline" className="ml-2">
            {count}
          </Badge>
        )}
      </AlertDescription>
    </Alert>
  );
};

// === COMPOSANT TABLEAU SIMPLE ===
const SimpleDataTable = ({ data, columns }: {
  data: any[];
  columns: any[];
}) => (
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead>
        <tr className="border-b">
          {columns.map((column, index) => (
            <th key={index} className="text-left p-3 font-medium text-gray-600">
              {column.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex} className="border-b hover:bg-gray-50">
            {columns.map((column, colIndex) => (
              <td key={colIndex} className="p-3">
                {column.cell ? column.cell({ row: { original: row } }) : row[column.accessorKey]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// === COMPOSANT PRINCIPAL ===
export default function RelationsInterOrganismesPage() {
  // État principal
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relations, setRelations] = useState<OrganizationRelation[]>([]);
  const [analytics, setAnalytics] = useState<RelationAnalytics | null>(null);
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('dashboard');

  // États des filtres
  const [filters, setFilters] = useState<FilterState>({
    type: 'all',
    status: 'all',
    direction: 'all',
    searchQuery: '',
    dateRange: 'all'
  });

  // États des modals
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [relationDetailsOpen, setRelationDetailsOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [editingRelation, setEditingRelation] = useState<OrganizationRelation | null>(null);
  const [selectedRelations, setSelectedRelations] = useState<OrganizationRelation[]>([]);
  const [formData, setFormData] = useState<RelationFormData>({
    fromOrgId: '',
    toOrgId: '',
    relationType: RelationType.COLLABORATIVE,
    dataShareType: DataShareType.READ_ONLY,
    priority: 'MEDIUM',
    permissions: {
      canView: true,
      canExport: false,
      canModify: false,
      canDelete: false
    }
  });

  // Fonction de chargement des données - doit être déclarée avant les useEffect
  const loadInitialData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Générer les 141 organismes de démonstration
      const mockOrgs = generateMockOrganizations();
      console.log(`✅ Chargé ${mockOrgs.length} organismes`);

      // Générer des relations réalistes entre organismes
      const mockRelations = generateMockRelations(mockOrgs);
      console.log(`✅ Généré ${mockRelations.length} relations`);

      // Calculer les analytics à partir des données générées
      const computedAnalytics = computeAnalyticsFromData(mockRelations, mockOrgs);

      // Mettre à jour les états en une seule fois pour éviter les re-renders multiples
      setOrganizations(mockOrgs);
      setRelations(mockRelations);
      setAnalytics(computedAnalytics);

    } catch (error) {
      console.error('Erreur lors de la génération des données:', error);
      setError('Erreur lors du chargement des données');

      // Fallback avec des données minimales
      setOrganizations([]);
      setRelations([]);
      setAnalytics(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Chargement des données au montage du composant
  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Chargement automatique périodique pour maintenir les données à jour
  useEffect(() => {
    const interval = setInterval(() => {
      if (!loading) {
        loadInitialData();
      }
    }, 300000); // Refresh toutes les 5 minutes

    return () => clearInterval(interval);
  }, [loading, loadInitialData]);

  // Filtrage des relations
  const filteredRelations = useMemo(() => {
    if (!relations) return [];

    return relations.filter(relation => {
      if (filters.type !== 'all' && relation.relationType !== filters.type) {
        return false;
      }

      if (filters.status !== 'all' && relation.status !== filters.status) {
        return false;
      }

      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const fromOrgName = relation.fromOrg?.name?.toLowerCase() || '';
        const toOrgName = relation.toOrg?.name?.toLowerCase() || '';
        const notes = relation.notes?.toLowerCase() || '';

        if (!fromOrgName.includes(query) &&
            !toOrgName.includes(query) &&
            !notes.includes(query)) {
          return false;
        }
      }

      return true;
    });
  }, [relations, filters]);

  // Handlers
  const handleCreateRelation = async () => {
    try {
      const response = await fetch('/api/organizations/relations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success('Relation créée avec succès');
        setCreateDialogOpen(false);
        loadInitialData();
        resetForm();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Erreur lors de la création');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur de communication avec le serveur');
    }
  };

  const handleEditRelation = (relation: OrganizationRelation) => {
    setEditingRelation(relation);
    setFormData({
      fromOrgId: relation.fromOrgId,
      toOrgId: relation.toOrgId,
      relationType: relation.relationType,
      dataShareType: relation.dataShareType,
      priority: relation.priority,
      notes: relation.notes,
      endDate: relation.endDate,
      permissions: relation.permissions || {
        canView: true,
        canExport: false,
        canModify: false,
        canDelete: false
      }
    });
    setEditDialogOpen(true);
  };

  const handleUpdateRelation = async () => {
    if (!editingRelation) return;

    try {
      const response = await fetch('/api/organizations/relations', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          relationId: editingRelation.id,
          ...formData
        })
      });

      if (response.ok) {
        toast.success('Relation mise à jour avec succès');
        setEditDialogOpen(false);
        setEditingRelation(null);
        loadInitialData();
        resetForm();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Erreur lors de la mise à jour');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur de communication avec le serveur');
    }
  };

  const handleDeleteRelation = async (relationId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette relation ?')) return;

    try {
      const response = await fetch(`/api/organizations/relations?relationId=${relationId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast.success('Relation supprimée avec succès');
        loadInitialData();
      } else {
        toast.error('Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur de communication avec le serveur');
    }
  };

  const handleBulkAction = async (action: 'activate' | 'suspend' | 'delete', relationIds: string[]) => {
    if (action === 'delete' && !confirm(`Êtes-vous sûr de vouloir supprimer ${relationIds.length} relation(s) ?`)) {
      return;
    }

    try {
      const promises = relationIds.map(id => {
        if (action === 'delete') {
          return fetch(`/api/organizations/relations?relationId=${id}`, { method: 'DELETE' });
        } else {
          return fetch('/api/organizations/relations', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              relationId: id,
              status: action === 'activate' ? RelationStatus.ACTIVE : RelationStatus.SUSPENDED
            })
          });
        }
      });

      await Promise.all(promises);
      toast.success(`${relationIds.length} relation(s) ${action === 'delete' ? 'supprimée(s)' : 'mise(s) à jour'}`);
      loadInitialData();
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de l\'action groupée');
    }
  };

  // Handlers pour les nouveaux composants
  const handleNodeClick = (nodeId: string) => {
    const nodeRelations = relations.filter(rel =>
      rel.fromOrgId === nodeId || rel.toOrgId === nodeId
    );
    setSelectedRelations(nodeRelations);
    setRelationDetailsOpen(true);
  };

  const handleEdgeClick = (relation: OrganizationRelation) => {
    setSelectedRelations([relation]);
    setRelationDetailsOpen(true);
  };

  const handleMatrixCellClick = (sourceId: string, targetId: string, cellRelations: OrganizationRelation[]) => {
    if (cellRelations.length > 0) {
      setSelectedRelations(cellRelations);
      setRelationDetailsOpen(true);
    }
  };

  const handleCreateRelationFromMatrix = (sourceId: string, targetId: string) => {
    setFormData(prev => ({
      ...prev,
      fromOrgId: sourceId,
      toOrgId: targetId
    }));
    setCreateDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      fromOrgId: '',
      toOrgId: '',
      relationType: RelationType.COLLABORATIVE,
      dataShareType: DataShareType.READ_ONLY,
      priority: 'MEDIUM',
      permissions: {
        canView: true,
        canExport: false,
        canModify: false,
        canDelete: false
      }
    });
  };



  // Colonnes pour le tableau
  const columns = [
    {
      accessorKey: 'fromOrg.name',
      header: 'Organisation Source',
      cell: ({ row }: any) => (
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-gray-500" />
          <span className="font-medium">{row.original.fromOrg?.name || 'N/A'}</span>
        </div>
      )
    },
    {
      accessorKey: 'relationType',
      header: 'Type',
      cell: ({ row }: any) => {
        const type = row.original.relationType;
        const colors = {
          [RelationType.HIERARCHICAL]: 'bg-blue-100 text-blue-800',
          [RelationType.COLLABORATIVE]: 'bg-green-100 text-green-800',
          [RelationType.INFORMATIONAL]: 'bg-gray-100 text-gray-800'
        };

        return (
          <Badge className={colors[type]}>
            {RELATION_TYPE_LABELS[type]}
          </Badge>
        );
      }
    },
    {
      accessorKey: 'toOrg.name',
      header: 'Organisation Cible',
      cell: ({ row }: any) => (
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-gray-500" />
          <span className="font-medium">{row.original.toOrg?.name || 'N/A'}</span>
        </div>
      )
    },
    {
      accessorKey: 'status',
      header: 'Statut',
      cell: ({ row }: any) => {
        const status = row.original.status;
        const colors = {
          [RelationStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
          [RelationStatus.ACTIVE]: 'bg-green-100 text-green-800',
          [RelationStatus.SUSPENDED]: 'bg-orange-100 text-orange-800',
          [RelationStatus.EXPIRED]: 'bg-red-100 text-red-800',
          [RelationStatus.REVOKED]: 'bg-gray-100 text-gray-800'
        };

        return (
          <Badge className={colors[status]}>
            {RELATION_STATUS_LABELS[status]}
          </Badge>
        );
      }
    },
    {
      accessorKey: 'accessCount',
      header: 'Accès',
      cell: ({ row }: any) => (
        <div className="text-center">
          <span className="font-mono">{row.original.accessCount || 0}</span>
        </div>
      )
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }: any) => (
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditRelation(row.original)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
              </TooltipTrigger>
              <TooltipContent>Modifier</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteRelation(row.original.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Supprimer</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )
    }
  ];

  if (loading) {
    return (
      <SuperAdminLayout
        title="Gestion des Relations Inter-Organismes"
        description="Chargement des 141 organismes gabonais..."
      >
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="ml-3 text-lg">Génération des données en cours...</span>
        </div>
      </SuperAdminLayout>
    );
  }

  if (error) {
    return (
      <SuperAdminLayout
        title="Gestion des Relations Inter-Organismes"
        description="Erreur de chargement"
      >
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Erreur de chargement</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={loadInitialData}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Réessayer
            </Button>
          </div>
        </div>
      </SuperAdminLayout>
    );
  }

  return (
    <SuperAdminLayout
      title="Gestion des Relations Inter-Organismes"
      description="Visualisez, gérez et analysez toutes les relations entre organismes administratifs"
    >
      <div className="space-y-6">
        {/* Header avec actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => setCreateDialogOpen(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle Relation
            </Button>
            <Button variant="outline" onClick={loadInitialData}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualiser
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setExportDialogOpen(true)}
            >
              <Download className="w-4 h-4 mr-2" />
              Exporter
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Tabs principales */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="table" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Tableau
            </TabsTrigger>
            <TabsTrigger value="graph" className="flex items-center gap-2">
              <Network className="w-4 h-4" />
              Graphe
            </TabsTrigger>
            <TabsTrigger value="matrix" className="flex items-center gap-2">
              <Grid3X3 className="w-4 h-4" />
              Matrice
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Analyse
            </TabsTrigger>
          </TabsList>

          {/* Contenu Dashboard */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Statistiques principales */}
            {analytics && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  title="Total Relations"
                  value={analytics.totalRelations}
                  icon={Network}
                  color="bg-blue-500"
                  trend={12}
                  description="Relations actives et en attente"
                />
                <StatCard
                  title="Accès Données"
                  value={analytics.totalDataAccesses}
                  icon={Database}
                  color="bg-green-500"
                  trend={8}
                  description="Accès ce mois"
                />
                <StatCard
                  title="Taux de Succès"
                  value={`${analytics.performanceMetrics.successRate.toFixed(1)}%`}
                  icon={CheckCircle}
                  color="bg-purple-500"
                  trend={2}
                  description="Performance système"
                />
                <StatCard
                  title="Temps Réponse"
                  value={`${Math.round(analytics.performanceMetrics.avgResponseTime)}ms`}
                  icon={Clock}
                  color="bg-orange-500"
                  trend={-5}
                  description="Temps moyen"
                />
              </div>
            )}

            {/* Alertes système */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Alertes Système
              </h3>

              <div className="grid gap-4">
                <AlertCard
                  type="warning"
                  message="2 relations en attente d'approbation nécessitent votre attention"
                  count={2}
                />
                <AlertCard
                  type="info"
                  message="Maintenance programmée ce week-end - Impact minimal sur les relations"
                />
              </div>
            </div>

            {/* Graphiques de répartition */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Répartition par Type</CardTitle>
                </CardHeader>
                <CardContent>
                  {analytics && (
                    <div className="space-y-4">
                      {Object.entries(analytics.relationsByType).map(([type, count]) => (
                        <div key={type} className="flex items-center justify-between">
                          <span className="text-sm">{RELATION_TYPE_LABELS[type as RelationType]}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-500 h-2 rounded-full"
                                style={{ width: `${(count / analytics.totalRelations) * 100}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium">{count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Organismes les Plus Actifs</CardTitle>
                </CardHeader>
                <CardContent>
                  {analytics?.topAccessedOrganizations && (
                    <div className="space-y-4">
                      {analytics.topAccessedOrganizations.map((org, index) => (
                        <div key={org.orgId} className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-medium text-blue-600">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{org.orgName}</p>
                            <p className="text-xs text-gray-500">{org.accessCount} accès</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Contenu Tableau */}
          <TabsContent value="table" className="space-y-6">
            {/* Filtres */}
            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="search">Recherche</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="search"
                        placeholder="Rechercher..."
                        value={filters.searchQuery}
                        onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="type-filter">Type de Relation</Label>
                    <Select
                      value={filters.type}
                      onValueChange={(value) => setFilters(prev => ({ ...prev, type: value as any }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les types</SelectItem>
                        {Object.entries(RELATION_TYPE_LABELS).map(([key, label]) => (
                          <SelectItem key={key} value={key}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="status-filter">Statut</Label>
                    <Select
                      value={filters.status}
                      onValueChange={(value) => setFilters(prev => ({ ...prev, status: value as any }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les statuts</SelectItem>
                        {Object.entries(RELATION_STATUS_LABELS).map(([key, label]) => (
                          <SelectItem key={key} value={key}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-end">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setFilters({
                        type: 'all',
                        status: 'all',
                        direction: 'all',
                        searchQuery: '',
                        dateRange: 'all'
                      })}
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Réinitialiser
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tableau des relations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Relations ({filteredRelations.length})</span>
                  <Badge variant="outline">
                    {filteredRelations.filter(r => isRelationActive(r)).length} actives
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SimpleDataTable
                  columns={columns}
                  data={filteredRelations}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contenu Graphe */}
          <TabsContent value="graph" className="space-y-6">
            <InteractiveNetworkGraph
              relations={filteredRelations}
              organizations={organizations}
              onNodeClick={handleNodeClick}
              onEdgeClick={handleEdgeClick}
            />
          </TabsContent>

          {/* Contenu Matrice */}
          <TabsContent value="matrix" className="space-y-6">
            <OrganizationMatrixView
              relations={filteredRelations}
              organizations={organizations}
              onCellClick={handleMatrixCellClick}
              onCreateRelation={handleCreateRelationFromMatrix}
            />
          </TabsContent>

          {/* Contenu Analyse */}
          <TabsContent value="analysis" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Analyse de Cohérence</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      <span className="text-sm">Aucune relation circulaire détectée</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-yellow-600" />
                      <span className="text-sm">2 relations en attente d'approbation</span>
                    </div>
                    <Button size="sm" variant="outline">
                      Voir détails
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recommandations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-sm mb-2">Relations manquantes suggérées</h4>
                    <p className="text-xs text-gray-600">
                      DGDI ↔ CNAMGS : Partage de données sanitaires recommandé
                    </p>
                  </div>

                  <div className="p-3 border border-orange-200 rounded-lg">
                    <h4 className="font-medium text-sm mb-2">Optimisation des permissions</h4>
                    <p className="text-xs text-gray-600">
                      3 relations pourraient bénéficier de permissions étendues
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Modal de création */}
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Créer une Nouvelle Relation</DialogTitle>
              <DialogDescription>
                Établir une relation de partage de données entre deux organismes
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fromOrg">Organisation Source</Label>
                  <Select
                    value={formData.fromOrgId}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, fromOrgId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner..." />
                    </SelectTrigger>
                    <SelectContent>
                      {organizations.map(org => (
                        <SelectItem key={org.id} value={org.id}>
                          {org.name} ({org.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="toOrg">Organisation Cible</Label>
                  <Select
                    value={formData.toOrgId}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, toOrgId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner..." />
                    </SelectTrigger>
                    <SelectContent>
                      {organizations.filter(org => org.id !== formData.fromOrgId).map(org => (
                        <SelectItem key={org.id} value={org.id}>
                          {org.name} ({org.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="relationType">Type de Relation</Label>
                  <Select
                    value={formData.relationType}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, relationType: value as RelationType }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(RELATION_TYPE_LABELS).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="dataShareType">Type de Partage</Label>
                  <Select
                    value={formData.dataShareType}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, dataShareType: value as DataShareType }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(DATA_SHARE_TYPE_LABELS).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Notes (optionnel)</Label>
                <Textarea
                  id="notes"
                  placeholder="Description de la relation, objectifs, contraintes..."
                  value={formData.notes || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                />
              </div>

              <div>
                <Label className="text-sm font-medium">Permissions</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="canView"
                      checked={formData.permissions?.canView || false}
                      onCheckedChange={(checked) =>
                        setFormData(prev => ({
                          ...prev,
                          permissions: { ...prev.permissions!, canView: checked }
                        }))
                      }
                    />
                    <Label htmlFor="canView" className="text-sm">Consultation</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="canExport"
                      checked={formData.permissions?.canExport || false}
                      onCheckedChange={(checked) =>
                        setFormData(prev => ({
                          ...prev,
                          permissions: { ...prev.permissions!, canExport: checked }
                        }))
                      }
                    />
                    <Label htmlFor="canExport" className="text-sm">Export</Label>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                Annuler
              </Button>
              <Button
                onClick={handleCreateRelation}
                disabled={!formData.fromOrgId || !formData.toOrgId}
              >
                Créer la Relation
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal d'édition */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Modifier la Relation</DialogTitle>
              <DialogDescription>
                Modifier les paramètres de la relation existante
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Organisation Source</Label>
                  <div className="p-2 bg-gray-50 rounded text-sm">
                    {organizations.find(org => org.id === formData.fromOrgId)?.name || 'N/A'}
                  </div>
                </div>

                <div>
                  <Label>Organisation Cible</Label>
                  <div className="p-2 bg-gray-50 rounded text-sm">
                    {organizations.find(org => org.id === formData.toOrgId)?.name || 'N/A'}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-relationType">Type de Relation</Label>
                  <Select
                    value={formData.relationType}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, relationType: value as RelationType }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(RELATION_TYPE_LABELS).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="edit-dataShareType">Type de Partage</Label>
                  <Select
                    value={formData.dataShareType}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, dataShareType: value as DataShareType }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(DATA_SHARE_TYPE_LABELS).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="edit-endDate">Date de Fin (optionnel)</Label>
                <Input
                  id="edit-endDate"
                  type="date"
                  value={formData.endDate?.split('T')[0] || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value ? e.target.value + 'T23:59:59Z' : undefined }))}
                />
              </div>

              <div>
                <Label htmlFor="edit-notes">Notes</Label>
                <Textarea
                  id="edit-notes"
                  placeholder="Description, modifications, historique..."
                  value={formData.notes || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                />
              </div>

              <div>
                <Label className="text-sm font-medium">Permissions</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="edit-canView"
                      checked={formData.permissions?.canView || false}
                      onCheckedChange={(checked) =>
                        setFormData(prev => ({
                          ...prev,
                          permissions: { ...prev.permissions!, canView: checked }
                        }))
                      }
                    />
                    <Label htmlFor="edit-canView" className="text-sm">Consultation</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="edit-canExport"
                      checked={formData.permissions?.canExport || false}
                      onCheckedChange={(checked) =>
                        setFormData(prev => ({
                          ...prev,
                          permissions: { ...prev.permissions!, canExport: checked }
                        }))
                      }
                    />
                    <Label htmlFor="edit-canExport" className="text-sm">Export</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="edit-canModify"
                      checked={formData.permissions?.canModify || false}
                      onCheckedChange={(checked) =>
                        setFormData(prev => ({
                          ...prev,
                          permissions: { ...prev.permissions!, canModify: checked }
                        }))
                      }
                    />
                    <Label htmlFor="edit-canModify" className="text-sm">Modification</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="edit-canDelete"
                      checked={formData.permissions?.canDelete || false}
                      onCheckedChange={(checked) =>
                        setFormData(prev => ({
                          ...prev,
                          permissions: { ...prev.permissions!, canDelete: checked }
                        }))
                      }
                    />
                    <Label htmlFor="edit-canDelete" className="text-sm">Suppression</Label>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleUpdateRelation}>
                Mettre à jour
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal des détails des relations */}
        <Dialog open={relationDetailsOpen} onOpenChange={setRelationDetailsOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Détails des Relations</DialogTitle>
              <DialogDescription>
                {selectedRelations.length === 1
                  ? 'Informations détaillées sur la relation sélectionnée'
                  : `${selectedRelations.length} relations trouvées`
                }
              </DialogDescription>
            </DialogHeader>

            <div className="max-h-96 overflow-y-auto">
              <div className="space-y-4">
                {selectedRelations.map((relation, index) => (
                  <Card key={relation.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">
                          {relation.fromOrg?.name} → {relation.toOrg?.name}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge className={
                            relation.status === RelationStatus.ACTIVE ? 'bg-green-100 text-green-800' :
                            relation.status === RelationStatus.PENDING ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }>
                            {RELATION_STATUS_LABELS[relation.status]}
                          </Badge>
                          <Badge variant="outline">
                            {RELATION_TYPE_LABELS[relation.relationType]}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <Label className="font-medium">Type de Partage</Label>
                          <p>{DATA_SHARE_TYPE_LABELS[relation.dataShareType]}</p>
                        </div>
                        <div>
                          <Label className="font-medium">Priorité</Label>
                          <p>{relation.priority}</p>
                        </div>
                        <div>
                          <Label className="font-medium">Accès Total</Label>
                          <p>{relation.accessCount || 0}</p>
                        </div>
                        <div>
                          <Label className="font-medium">Dernière Mise à Jour</Label>
                          <p>{new Date(relation.updatedAt).toLocaleDateString('fr-FR')}</p>
                        </div>
                        {relation.notes && (
                          <div className="col-span-2">
                            <Label className="font-medium">Notes</Label>
                            <p className="text-gray-600">{relation.notes}</p>
                          </div>
                        )}
                      </div>

                      {relation.permissions && (
                        <div className="mt-4">
                          <Label className="font-medium">Permissions</Label>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {relation.permissions.canView && <Badge variant="outline">Consultation</Badge>}
                            {relation.permissions.canExport && <Badge variant="outline">Export</Badge>}
                            {relation.permissions.canModify && <Badge variant="outline">Modification</Badge>}
                            {relation.permissions.canDelete && <Badge variant="outline">Suppression</Badge>}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-2 mt-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            handleEditRelation(relation);
                            setRelationDetailsOpen(false);
                          }}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Modifier
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            handleDeleteRelation(relation.id);
                            setRelationDetailsOpen(false);
                          }}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Supprimer
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setRelationDetailsOpen(false)}>
                Fermer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Gestionnaire d'export */}
        <RelationsExportManager
          relations={filteredRelations}
          organizations={organizations}
          isOpen={exportDialogOpen}
          onClose={() => setExportDialogOpen(false)}
        />
      </div>
    </SuperAdminLayout>
  );
}
