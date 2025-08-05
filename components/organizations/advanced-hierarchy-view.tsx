'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import {
  Building2,
  Crown,
  Shield,
  Users,
  MapPin,
  Search,
  Filter,
  ChevronDown,
  ChevronRight,
  Eye,
  Settings,
  BarChart3,
  Loader2,
  RefreshCw
} from 'lucide-react';

// Import des données compatibles
import {
  ORGANISMES_GABONAIS_COMPLETS,
  getOrganismesByType,
  getOrganismesByNiveau,
  getOrganismesByParent,
  getStatistiquesOrganismes,
  type OrganismeComplet
} from '@/lib/config/organismes-complets';

interface HierarchyNode {
  organisme: OrganismeComplet;
  children: HierarchyNode[];
  expanded: boolean;
  level: number;
}

interface FilterState {
  search: string;
  type: string;
  groupe: string;
  niveau: string;
  province: string;
}

export function AdvancedHierarchyView() {
  // États du composant
  const [filterState, setFilterState] = useState<FilterState>({
    search: '',
    type: 'tous',
    groupe: 'tous',
    niveau: 'tous',
    province: 'toutes'
  });

  const [selectedOrganisme, setSelectedOrganisme] = useState<OrganismeComplet | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'hierarchy' | 'list' | 'grid'>('hierarchy');

  // Construction de la hiérarchie
  const hierarchyData = useMemo(() => {
    const buildHierarchy = (parentId?: string, level = 0): HierarchyNode[] => {
      const children = getOrganismesByParent(parentId || '');
      return children.map(organisme => ({
        organisme,
        children: buildHierarchy(organisme.id, level + 1),
        expanded: level < 2, // Expand les 2 premiers niveaux par défaut
        level
      }));
    };

    // Commencer par les organismes racines (sans parentId)
    const rootOrganismes = ORGANISMES_GABONAIS_COMPLETS.filter(org => !org.parentId);
    return rootOrganismes.map(organisme => ({
      organisme,
      children: buildHierarchy(organisme.id, 1),
      expanded: true,
      level: 0
    }));
  }, []);

  // Filtrage des organismes
  const filteredOrganismes = useMemo(() => {
    let organismes = ORGANISMES_GABONAIS_COMPLETS;

    if (filterState.search) {
      const searchLower = filterState.search.toLowerCase();
      organismes = organismes.filter(org =>
        org.name.toLowerCase().includes(searchLower) ||
        org.code.toLowerCase().includes(searchLower) ||
        (org.description && org.description.toLowerCase().includes(searchLower))
      );
    }

    if (filterState.type !== 'tous') {
      organismes = organismes.filter(org => org.type === filterState.type);
    }

    if (filterState.groupe !== 'tous') {
      organismes = organismes.filter(org => org.groupe === filterState.groupe);
    }

    if (filterState.niveau !== 'tous') {
      const niveau = parseInt(filterState.niveau);
      organismes = organismes.filter(org => org.niveau_hierarchique === niveau);
    }

    if (filterState.province !== 'toutes') {
      organismes = organismes.filter(org => org.province === filterState.province);
    }

    return organismes;
  }, [filterState]);

  // Gestionnaires d'événements
  const handleOrganismeClick = useCallback((organisme: OrganismeComplet) => {
    setSelectedOrganisme(organisme);
    toast.success(`Organisme sélectionné: ${organisme.name}`);
  }, []);

  const handleRefresh = useCallback(async () => {
    setIsLoading(true);
    try {
      // Simulation du rechargement des données
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Données actualisées avec succès');
    } catch (error) {
      toast.error('Erreur lors de l\'actualisation');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearFilters = useCallback(() => {
    setFilterState({
      search: '',
      type: 'tous',
      groupe: 'tous',
      niveau: 'tous',
      province: 'toutes'
    });
  }, []);

  // Fonctions utilitaires
  const getGroupeColor = (groupe: string) => {
    const colors: Record<string, string> = {
      'A': 'bg-purple-100 text-purple-800',
      'B': 'bg-blue-100 text-blue-800',
      'C': 'bg-green-100 text-green-800',
      'D': 'bg-yellow-100 text-yellow-800',
      'E': 'bg-red-100 text-red-800',
      'F': 'bg-indigo-100 text-indigo-800',
      'G': 'bg-pink-100 text-pink-800',
      'L': 'bg-gray-100 text-gray-800',
      'I': 'bg-orange-100 text-orange-800'
    };
    return colors[groupe] || 'bg-gray-100 text-gray-800';
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'PRESIDENCE':
      case 'PRIMATURE':
        return Crown;
      case 'MINISTERE':
        return Building2;
      case 'DIRECTION_GENERALE':
        return Shield;
      default:
        return Building2;
    }
  };

  // Composant HierarchyNode
  const HierarchyNodeComponent: React.FC<{
    node: HierarchyNode;
    onToggle: (node: HierarchyNode) => void;
    onSelect: (organisme: OrganismeComplet) => void;
  }> = ({ node, onToggle, onSelect }) => {
    const { organisme, children, expanded, level } = node;
    const hasChildren = children.length > 0;
    const Icon = getTypeIcon(organisme.type);

    return (
      <div className="ml-4" style={{ marginLeft: `${level * 20}px` }}>
        <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
          {hasChildren && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggle(node)}
              className="p-1 h-6 w-6"
            >
              {expanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            </Button>
          )}

          <Icon className="h-4 w-4 text-blue-600" />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span
                className="font-medium text-sm cursor-pointer hover:text-blue-600"
                onClick={() => onSelect(organisme)}
              >
                {organisme.name}
              </span>
              <Badge className={getGroupeColor(organisme.groupe)} variant="outline">
                {organisme.groupe}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {organisme.type}
              </Badge>
            </div>
            <p className="text-xs text-gray-600 truncate">
              {organisme.description || `${organisme.code} - ${organisme.city}`}
            </p>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSelect(organisme)}
              className="h-6 w-6 p-1"
            >
              <Eye className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleOrganismeClick(organisme)}
              className="h-6 w-6 p-1"
            >
              <Settings className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Enfants */}
        {expanded && hasChildren && (
          <div className="ml-2">
            {children.map((child, index) => (
              <HierarchyNodeComponent
                key={child.organisme.id}
                node={child}
                onToggle={onToggle}
                onSelect={onSelect}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  // États pour la gestion de l'expansion
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  const toggleNode = useCallback((node: HierarchyNode) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(node.organisme.id)) {
        newSet.delete(node.organisme.id);
      } else {
        newSet.add(node.organisme.id);
      }
      return newSet;
    });
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-blue-600" />
            Vue Hiérarchique Avancée
          </h2>
          <p className="text-gray-600 mt-1">
            Exploration des {ORGANISMES_GABONAIS_COMPLETS.length} organismes gabonais
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Actualiser
          </Button>
        </div>
      </div>

      {/* Filtres */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtres et Recherche
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Recherche</label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Nom, code..."
                  value={filterState.search}
                  onChange={(e) => setFilterState(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-8"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Type</label>
              <Select
                value={filterState.type}
                onValueChange={(value) => setFilterState(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tous">Tous</SelectItem>
                  <SelectItem value="PRESIDENCE">Présidence</SelectItem>
                  <SelectItem value="MINISTERE">Ministère</SelectItem>
                  <SelectItem value="DIRECTION_GENERALE">Direction Générale</SelectItem>
                  <SelectItem value="MAIRIE">Mairie</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Groupe</label>
              <Select
                value={filterState.groupe}
                onValueChange={(value) => setFilterState(prev => ({ ...prev, groupe: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tous">Tous</SelectItem>
                  <SelectItem value="A">A - Institutions Suprêmes</SelectItem>
                  <SelectItem value="B">B - Ministères</SelectItem>
                  <SelectItem value="C">C - Directions Générales</SelectItem>
                  <SelectItem value="D">D - Administrations</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Niveau</label>
              <Select
                value={filterState.niveau}
                onValueChange={(value) => setFilterState(prev => ({ ...prev, niveau: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tous">Tous</SelectItem>
                  <SelectItem value="1">Niveau 1</SelectItem>
                  <SelectItem value="2">Niveau 2</SelectItem>
                  <SelectItem value="3">Niveau 3</SelectItem>
                  <SelectItem value="4">Niveau 4</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Vue</label>
              <Select
                value={viewMode}
                onValueChange={(value: any) => setViewMode(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hierarchy">Hiérarchie</SelectItem>
                  <SelectItem value="list">Liste</SelectItem>
                  <SelectItem value="grid">Grille</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button variant="outline" onClick={clearFilters} className="w-full">
                Effacer
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contenu principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Vue principale */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>
                {viewMode === 'hierarchy' ? 'Vue Hiérarchique' :
                 viewMode === 'list' ? 'Vue Liste' : 'Vue Grille'}
              </CardTitle>
              <CardDescription>
                {filteredOrganismes.length} organismes affichés
              </CardDescription>
            </CardHeader>
            <CardContent className="max-h-[600px] overflow-y-auto">
              {viewMode === 'hierarchy' ? (
                <div className="space-y-1">
                  {hierarchyData.map((node) => (
                    <HierarchyNodeComponent
                      key={node.organisme.id}
                      node={{
                        ...node,
                        expanded: expandedNodes.has(node.organisme.id) || node.expanded
                      }}
                      onToggle={toggleNode}
                      onSelect={setSelectedOrganisme}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredOrganismes.map((organisme) => (
                    <div
                      key={organisme.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => setSelectedOrganisme(organisme)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <Building2 className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">{organisme.name}</h4>
                          <p className="text-sm text-gray-500">{organisme.code} • {organisme.city}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getGroupeColor(organisme.groupe)}>
                          {organisme.groupe}
                        </Badge>
                        <Badge variant="outline">
                          Niveau {organisme.niveau_hierarchique}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Panneau de détails */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Détails</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedOrganisme ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">{selectedOrganisme.name}</h3>
                    <p className="text-sm text-gray-600">{selectedOrganisme.code}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Type:</span>
                      <p>{selectedOrganisme.type}</p>
                    </div>
                    <div>
                      <span className="font-medium">Groupe:</span>
                      <p>{selectedOrganisme.groupe}</p>
                    </div>
                    <div>
                      <span className="font-medium">Niveau:</span>
                      <p>{selectedOrganisme.niveau_hierarchique}</p>
                    </div>
                    <div>
                      <span className="font-medium">Ville:</span>
                      <p>{selectedOrganisme.city}</p>
                    </div>
                  </div>

                  {selectedOrganisme.description && (
                    <div>
                      <span className="font-medium text-sm">Description:</span>
                      <p className="text-sm text-gray-600 mt-1">{selectedOrganisme.description}</p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3 mr-1" />
                      Voir détails
                    </Button>
                    <Button size="sm" variant="outline">
                      <Settings className="h-3 w-3 mr-1" />
                      Configurer
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Building2 className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Sélectionnez un organisme pour voir ses détails</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
