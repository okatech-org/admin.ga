'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  GitBranch, Network, Building2, Users, Share2, Eye, Search, Filter,
  Crown, Star, Shield, Scale, GraduationCap, Briefcase, Car, Home,
  MapPin, Globe, Flag, Award, Target, Zap, Layers, Trees, Mountain,
  Anchor, Camera, Factory, Receipt, Truck, Cross, FileText, Heart,
  Stethoscope, BookOpen, Plane, Ship, Droplets, Leaf, Wheat,
  ChevronDown, ChevronRight, ExternalLink, Info, Settings,
  BarChart3, TrendingUp, ArrowRight, ArrowDown, Maximize2, Minimize2
} from 'lucide-react';

import {
  ORGANISMES_GABONAIS_COMPLETS,
  OrganismeComplet,
  getOrganismeComplet,
  getOrganismesByType,
  getOrganismesByNiveau,
  getOrganismesByParent,
  getStatistiquesOrganismes
} from '@/lib/config/organismes-officiels-gabon';

// === INTERFACES ===
interface HierarchyNode {
  organisme: OrganismeComplet;
  children: HierarchyNode[];
  level: number;
  expanded: boolean;
  connections: {
    hierarchiques: number;
    collaboratives: number;
    informationnelles: number;
  };
}

interface ViewSettings {
  showConnections: boolean;
  showServices: boolean;
  showMetrics: boolean;
  groupByType: boolean;
  compactMode: boolean;
  showRelationLines: boolean;
}

interface SelectedNode {
  organisme: OrganismeComplet;
  relations: {
    hierarchiques: OrganismeComplet[];
    collaboratives: OrganismeComplet[];
    informationnelles: OrganismeComplet[];
  };
}

// === COMPOSANT PRINCIPAL ===
export function AdvancedHierarchyView() {
  // États principaux
  const [organismes] = useState(ORGANISMES_GABONAIS_COMPLETS);
  const [selectedNode, setSelectedNode] = useState<SelectedNode | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedNiveau, setSelectedNiveau] = useState<number | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['PRESIDENCE', 'PRIMATURE']));
  const [viewSettings, setViewSettings] = useState<ViewSettings>({
    showConnections: true,
    showServices: false,
    showMetrics: true,
    groupByType: false,
    compactMode: false,
    showRelationLines: true
  });

  // Statistiques calculées
  const stats = useMemo(() => getStatistiquesOrganismes(), []);

  // Organismes filtrés
  const filteredOrganismes = useMemo(() => {
    let filtered = Object.values(organismes);

    if (searchTerm) {
      filtered = filtered.filter(org =>
        org.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.mission.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedType !== 'ALL') {
      filtered = filtered.filter(org => org.type === selectedType);
    }

    if (selectedNiveau) {
      filtered = filtered.filter(org => org.niveau === selectedNiveau);
    }

    return filtered;
  }, [organismes, searchTerm, selectedType, selectedNiveau]);

  // Générer l'arbre hiérarchique complet
  const hierarchyTree = useMemo(() => {
    const buildTree = (parentId: string | undefined, level: number = 0): HierarchyNode[] => {
      return filteredOrganismes
        .filter(org => org.parentId === parentId)
        .map(org => {
          const connections = {
            hierarchiques: org.relations.hierarchiques.length,
            collaboratives: org.relations.collaboratives.length,
            informationnelles: org.relations.informationnelles.length
          };

          return {
            organisme: org,
            level,
            expanded: expandedNodes.has(org.code),
            connections,
            children: buildTree(org.id, level + 1)
          };
        })
        .sort((a, b) => a.organisme.niveau - b.organisme.niveau || a.organisme.nom.localeCompare(b.organisme.nom));
    };

    return buildTree(undefined);
  }, [filteredOrganismes, expandedNodes]);

  // Handlers
  const toggleNode = useCallback((nodeCode: string) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeCode)) {
        newSet.delete(nodeCode);
      } else {
        newSet.add(nodeCode);
      }
      return newSet;
    });
  }, []);

  const selectNode = useCallback((organisme: OrganismeComplet) => {
    // Calculer les relations réelles
    const relations = {
      hierarchiques: organisme.relations.hierarchiques
        .map(code => getOrganismeComplet(code))
        .filter(Boolean) as OrganismeComplet[],
      collaboratives: organisme.relations.collaboratives
        .map(code => getOrganismeComplet(code))
        .filter(Boolean) as OrganismeComplet[],
      informationnelles: organisme.relations.informationnelles
        .map(code => getOrganismeComplet(code))
        .filter(Boolean) as OrganismeComplet[]
    };

    setSelectedNode({ organisme, relations });
  }, []);

  const expandAll = useCallback(() => {
    setExpandedNodes(new Set(Object.keys(organismes)));
  }, [organismes]);

  const collapseAll = useCallback(() => {
    setExpandedNodes(new Set(['PRESIDENCE', 'PRIMATURE']));
  }, []);

  // Composant pour afficher un nœud de la hiérarchie
  const HierarchyNodeComponent = ({
    node,
    isLast = false,
    parentConnectors = []
  }: {
    node: HierarchyNode;
    isLast?: boolean;
    parentConnectors?: boolean[];
  }) => {
    const IconComponent = node.organisme.branding.icon;
    const hasChildren = node.children.length > 0;
    const isSelected = selectedNode?.organisme.code === node.organisme.code;

    // Calculer les couleurs selon le niveau
    const getLevelColor = (niveau: number) => {
      switch (niveau) {
        case 1: return 'from-red-500 to-red-700'; // Présidence
        case 2: return 'from-blue-500 to-blue-700'; // Primature
        case 3: return 'from-green-500 to-green-700'; // Ministères
        case 4: return 'from-purple-500 to-purple-700'; // Directions
        case 5: return 'from-orange-500 to-orange-700'; // Territoriaux
        default: return 'from-gray-500 to-gray-700';
      }
    };

    return (
      <div className="relative">
        {/* Lignes de connexion */}
        {viewSettings.showRelationLines && node.level > 0 && (
          <div className="absolute left-0 top-0 h-full">
            {parentConnectors.map((isConnected, index) => (
              <div
                key={index}
                className={`absolute w-px h-full ${isConnected ? 'bg-gray-300' : ''}`}
                style={{ left: `${index * 24 + 12}px` }}
              />
            ))}
            <div
              className="absolute w-6 h-px bg-gray-300 top-6"
              style={{ left: `${(node.level - 1) * 24 + 12}px` }}
            />
            {!isLast && (
              <div
                className="absolute w-px bg-gray-300"
                style={{
                  left: `${(node.level - 1) * 24 + 12}px`,
                  top: '24px',
                  height: 'calc(100% - 24px)'
                }}
              />
            )}
          </div>
        )}

        {/* Contenu du nœud */}
        <div
          className={`ml-${node.level * 6} relative`}
          style={{ marginLeft: `${node.level * 24}px` }}
        >
          <div
            className={`group flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-200 cursor-pointer hover:shadow-lg ${
              isSelected
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-gray-200 bg-white hover:border-gray-300'
            } ${viewSettings.compactMode ? 'p-2' : 'p-3'}`}
            onClick={() => selectNode(node.organisme)}
          >
            {/* Bouton d'expansion */}
            {hasChildren && (
              <Button
                variant="ghost"
                size="sm"
                className="p-1 h-6 w-6 flex-shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleNode(node.organisme.code);
                }}
              >
                {node.expanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
              </Button>
            )}

            {/* Icône de l'organisme */}
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${getLevelColor(node.organisme.niveau)} shadow-sm`}
            >
              <IconComponent className="h-6 w-6 text-white" />
            </div>

            {/* Informations principales */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-gray-900 truncate">
                  {node.organisme.nomCourt}
                </h3>
                <Badge variant="outline" className={`text-xs ${
                  viewSettings.compactMode ? 'hidden' : ''
                }`}>
                  Niveau {node.organisme.niveau}
                </Badge>
                <Badge
                  variant="secondary"
                  className={`text-xs ${viewSettings.compactMode ? 'hidden' : ''}`}
                >
                  {node.organisme.type}
                </Badge>
              </div>

              {!viewSettings.compactMode && (
                <p className="text-sm text-gray-600 line-clamp-1">
                  {node.organisme.mission}
                </p>
              )}

              {/* Services */}
              {viewSettings.showServices && !viewSettings.compactMode && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {node.organisme.services.slice(0, 3).map((service, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {service}
                    </Badge>
                  ))}
                  {node.organisme.services.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{node.organisme.services.length - 3}
                    </Badge>
                  )}
                </div>
              )}
            </div>

            {/* Métriques de connexions */}
            {viewSettings.showConnections && (
              <div className="flex flex-col gap-1 text-right">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs bg-blue-50">
                    H: {node.connections.hierarchiques}
                  </Badge>
                  <Badge variant="outline" className="text-xs bg-green-50">
                    C: {node.connections.collaboratives}
                  </Badge>
                  <Badge variant="outline" className="text-xs bg-purple-50">
                    I: {node.connections.informationnelles}
                  </Badge>
                </div>
                {viewSettings.showMetrics && (
                  <div className="text-xs text-gray-500">
                    Total: {node.connections.hierarchiques + node.connections.collaboratives + node.connections.informationnelles}
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <ExternalLink className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <Info className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Enfants */}
          {hasChildren && node.expanded && (
            <div className="mt-2">
              {node.children.map((child, index) => (
                <HierarchyNodeComponent
                  key={child.organisme.id}
                  node={child}
                  isLast={index === node.children.length - 1}
                  parentConnectors={[...parentConnectors, !isLast]}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Vue statistiques
  const StatsView = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          <p className="text-xs text-muted-foreground">Total Organismes</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold text-green-600">
            {Object.values(stats.parNiveau).reduce((a, b) => a + (b > 0 ? 1 : 0), 0)}
          </div>
          <p className="text-xs text-muted-foreground">Niveaux Actifs</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold text-purple-600">
            {Object.keys(stats.parType).length}
          </div>
          <p className="text-xs text-muted-foreground">Types d'Organismes</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold text-orange-600">
            {filteredOrganismes.length}
          </div>
          <p className="text-xs text-muted-foreground">Affichés</p>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <GitBranch className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Hiérarchie Administrative Gabonaise</h1>
              <p className="text-sm text-gray-600">
                Structure complète des {Object.keys(organismes).length} organismes avec relations
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={expandAll}>
              <Maximize2 className="mr-2 h-4 w-4" />
              Tout Étendre
            </Button>
            <Button variant="outline" size="sm" onClick={collapseAll}>
              <Minimize2 className="mr-2 h-4 w-4" />
              Tout Réduire
            </Button>
          </div>
        </div>

        {/* Filtres */}
        <div className="flex items-center gap-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher un organisme..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Type d'organisme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tous les types</SelectItem>
              <SelectItem value="PRESIDENCE">Présidence</SelectItem>
              <SelectItem value="PRIMATURE">Primature</SelectItem>
              <SelectItem value="MINISTERE">Ministères</SelectItem>
              <SelectItem value="DIRECTION_GENERALE">Directions Générales</SelectItem>
              <SelectItem value="PROVINCE">Provinces</SelectItem>
              <SelectItem value="MAIRIE">Mairies</SelectItem>
              <SelectItem value="ORGANISME_SOCIAL">Organismes Sociaux</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedNiveau?.toString() || ''} onValueChange={(value) => setSelectedNiveau(value ? parseInt(value) : null)}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Niveau" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Niveau 1</SelectItem>
              <SelectItem value="2">Niveau 2</SelectItem>
              <SelectItem value="3">Niveau 3</SelectItem>
              <SelectItem value="4">Niveau 4</SelectItem>
              <SelectItem value="5">Niveau 5</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="flex-1 flex">
        {/* Panel hiérarchie */}
        <div className="flex-1 p-6">
          <Tabs defaultValue="hierarchy" className="h-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="hierarchy">Hiérarchie</TabsTrigger>
              <TabsTrigger value="statistics">Statistiques</TabsTrigger>
              <TabsTrigger value="settings">Paramètres</TabsTrigger>
            </TabsList>

            <TabsContent value="hierarchy" className="space-y-4 h-full">
              <StatsView />

              <Card className="flex-1">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Structure Administrative ({filteredOrganismes.length} organismes)
                  </CardTitle>
                  <CardDescription>
                    Hiérarchie complète avec relations inter-organismes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[600px] pr-4">
                    <div className="space-y-2">
                      {hierarchyTree.map((node, index) => (
                        <HierarchyNodeComponent
                          key={node.organisme.id}
                          node={node}
                          isLast={index === hierarchyTree.length - 1}
                        />
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="statistics" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Répartition par Type</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(stats.parType).map(([type, count]) => (
                        <div key={type} className="flex items-center justify-between">
                          <span className="text-sm font-medium">{type.replace('_', ' ')}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-500 h-2 rounded-full"
                                style={{ width: `${(count / stats.total) * 100}%` }}
                              />
                            </div>
                            <span className="text-sm font-bold text-blue-600">{count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Répartition par Niveau</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(stats.parNiveau).map(([niveau, count]) => (
                        <div key={niveau} className="flex items-center justify-between">
                          <span className="text-sm font-medium">Niveau {niveau.replace('niveau', '')}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-green-500 h-2 rounded-full"
                                style={{ width: `${(count / stats.total) * 100}%` }}
                              />
                            </div>
                            <span className="text-sm font-bold text-green-600">{count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Options d'Affichage</CardTitle>
                  <CardDescription>
                    Personnalisez la vue hiérarchique selon vos besoins
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between">
                      <Label>Afficher les connexions</Label>
                      <input
                        type="checkbox"
                        checked={viewSettings.showConnections}
                        onChange={(e) => setViewSettings(prev => ({ ...prev, showConnections: e.target.checked }))}
                        className="rounded"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label>Afficher les services</Label>
                      <input
                        type="checkbox"
                        checked={viewSettings.showServices}
                        onChange={(e) => setViewSettings(prev => ({ ...prev, showServices: e.target.checked }))}
                        className="rounded"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label>Afficher les métriques</Label>
                      <input
                        type="checkbox"
                        checked={viewSettings.showMetrics}
                        onChange={(e) => setViewSettings(prev => ({ ...prev, showMetrics: e.target.checked }))}
                        className="rounded"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label>Mode compact</Label>
                      <input
                        type="checkbox"
                        checked={viewSettings.compactMode}
                        onChange={(e) => setViewSettings(prev => ({ ...prev, compactMode: e.target.checked }))}
                        className="rounded"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label>Lignes de relation</Label>
                      <input
                        type="checkbox"
                        checked={viewSettings.showRelationLines}
                        onChange={(e) => setViewSettings(prev => ({ ...prev, showRelationLines: e.target.checked }))}
                        className="rounded"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Panel latéral - Détails du nœud sélectionné */}
        {selectedNode && (
          <div className="w-96 border-l border-gray-200 bg-white p-6">
            <div className="sticky top-0">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Détails de l'Organisme</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedNode(null)}
                >
                  ×
                </Button>
              </div>

              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${selectedNode.organisme.branding.couleurPrimaire}20` }}
                    >
                      <selectedNode.organisme.branding.icon
                        className="h-6 w-6"
                        style={{ color: selectedNode.organisme.branding.couleurPrimaire }}
                      />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{selectedNode.organisme.nomCourt}</CardTitle>
                      <CardDescription className="text-sm">
                        {selectedNode.organisme.type} • Niveau {selectedNode.organisme.niveau}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Mission</Label>
                    <p className="text-sm text-gray-600 mt-1">{selectedNode.organisme.mission}</p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Attributions</Label>
                    <ul className="text-sm text-gray-600 mt-1 space-y-1">
                      {selectedNode.organisme.attributions.map((attr, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <div className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                          {attr}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Relations</Label>
                    <div className="mt-2 space-y-3">
                      <div>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span>Hiérarchiques</span>
                          <Badge variant="outline">{selectedNode.relations.hierarchiques.length}</Badge>
                        </div>
                        {selectedNode.relations.hierarchiques.slice(0, 3).map(rel => (
                          <div key={rel.code} className="text-xs text-gray-600 ml-2">
                            • {rel.nomCourt}
                          </div>
                        ))}
                      </div>

                      <div>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span>Collaboratives</span>
                          <Badge variant="outline">{selectedNode.relations.collaboratives.length}</Badge>
                        </div>
                        {selectedNode.relations.collaboratives.slice(0, 3).map(rel => (
                          <div key={rel.code} className="text-xs text-gray-600 ml-2">
                            • {rel.nomCourt}
                          </div>
                        ))}
                      </div>

                      <div>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span>Informationnelles</span>
                          <Badge variant="outline">{selectedNode.relations.informationnelles.length}</Badge>
                        </div>
                        {selectedNode.relations.informationnelles.slice(0, 3).map(rel => (
                          <div key={rel.code} className="text-xs text-gray-600 ml-2">
                            • {rel.nomCourt}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
