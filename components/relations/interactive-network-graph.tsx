'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  ZoomIn, ZoomOut, RotateCcw, Settings, Eye, EyeOff, Maximize2,
  Building2, GitBranch, Search, Filter, Download, Play, Pause
} from 'lucide-react';
import {
  OrganizationRelation,
  RelationType,
  RelationStatus,
  RELATION_TYPE_LABELS,
  isRelationActive
} from '@/lib/types/organization-relations';

// === INTERFACES ===
interface NetworkNode {
  id: string;
  name: string;
  type: string;
  level: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  fx?: number;
  fy?: number;
  relationCount: number;
  isActive: boolean;
  color: string;
}

interface NetworkEdge {
  source: string;
  target: string;
  relation: OrganizationRelation;
  strength: number;
  color: string;
  strokeWidth: number;
}

interface GraphSettings {
  showLabels: boolean;
  showInactive: boolean;
  nodeSize: number;
  linkStrength: number;
  repulsionForce: number;
  centerForce: number;
  animationSpeed: number;
}

// === UTILITAIRES ===
const NODE_COLORS = {
  MINISTERE: '#3B82F6',    // Bleu
  DIRECTION: '#10B981',    // Vert
  MAIRIE: '#F59E0B',       // Jaune
  ORGANISME_SOCIAL: '#8B5CF6', // Violet
  AUTRE: '#6B7280'         // Gris
};

const RELATION_COLORS = {
  [RelationType.HIERARCHICAL]: '#DC2626',     // Rouge
  [RelationType.COLLABORATIVE]: '#059669',   // Vert foncé
  [RelationType.INFORMATIONAL]: '#6B7280'    // Gris
};

const distance = (a: NetworkNode, b: NetworkNode) =>
  Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);

// === COMPOSANT PRINCIPAL ===
interface InteractiveNetworkGraphProps {
  relations: OrganizationRelation[];
  organizations: any[];
  onNodeClick?: (nodeId: string) => void;
  onEdgeClick?: (relation: OrganizationRelation) => void;
}

export const InteractiveNetworkGraph: React.FC<InteractiveNetworkGraphProps> = ({
  relations,
  organizations,
  onNodeClick,
  onEdgeClick
}) => {
  // États
  const svgRef = useRef<SVGSVGElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  const [settings, setSettings] = useState<GraphSettings>({
    showLabels: true,
    showInactive: false,
    nodeSize: 50,
    linkStrength: 0.3,
    repulsionForce: 200,
    centerForce: 0.1,
    animationSpeed: 60
  });

  // Dimensions
  const width = 800;
  const height = 600;
  const centerX = width / 2;
  const centerY = height / 2;

  // Calcul des nœuds et arêtes
  const { nodes, edges } = useMemo(() => {
    const nodeMap = new Map<string, NetworkNode>();
    const edgeList: NetworkEdge[] = [];

    // Créer les nœuds à partir des organisations
    organizations.forEach(org => {
      const orgRelations = relations.filter(rel =>
        rel.fromOrgId === org.id || rel.toOrgId === org.id
      );

      const activeRelations = orgRelations.filter(rel => isRelationActive(rel));

      nodeMap.set(org.id, {
        id: org.id,
        name: org.name,
        type: org.type,
        level: org.level || 0,
        x: centerX + (Math.random() - 0.5) * 400,
        y: centerY + (Math.random() - 0.5) * 400,
        vx: 0,
        vy: 0,
        relationCount: activeRelations.length,
        isActive: org.isActive !== false,
        color: NODE_COLORS[org.type as keyof typeof NODE_COLORS] || NODE_COLORS.AUTRE
      });
    });

    // Créer les arêtes à partir des relations
    relations.forEach(relation => {
      if ((!settings.showInactive && !isRelationActive(relation)) ||
          !nodeMap.has(relation.fromOrgId) ||
          !nodeMap.has(relation.toOrgId)) {
        return;
      }

      const strength = relation.accessCount || 1;
      const maxStrength = Math.max(...relations.map(r => r.accessCount || 1));

      edgeList.push({
        source: relation.fromOrgId,
        target: relation.toOrgId,
        relation,
        strength: strength / maxStrength,
        color: RELATION_COLORS[relation.relationType],
        strokeWidth: Math.max(1, (strength / maxStrength) * 4)
      });
    });

    return {
      nodes: Array.from(nodeMap.values()),
      edges: edgeList
    };
  }, [organizations, relations, settings.showInactive]);

  // Filtrage par recherche
  const filteredNodes = useMemo(() => {
    if (!searchQuery) return nodes;

    const query = searchQuery.toLowerCase();
    return nodes.filter(node =>
      node.name.toLowerCase().includes(query) ||
      node.type.toLowerCase().includes(query)
    );
  }, [nodes, searchQuery]);

  // Simulation de force simplifiée
  const simulateForces = useCallback(() => {
    if (!isAnimating) return;

    const alpha = 0.1;
    const k = settings.repulsionForce;

    // Force de répulsion entre nœuds
    nodes.forEach(node => {
      node.vx *= 0.8; // Friction
      node.vy *= 0.8;

      nodes.forEach(other => {
        if (node.id === other.id) return;

        const dx = node.x - other.x;
        const dy = node.y - other.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;

        if (dist < k) {
          const force = (k - dist) / dist * alpha;
          node.vx += dx * force;
          node.vy += dy * force;
        }
      });

      // Force vers le centre
      const dx = centerX - node.x;
      const dy = centerY - node.y;
      node.vx += dx * settings.centerForce * alpha;
      node.vy += dy * settings.centerForce * alpha;
    });

    // Force d'attraction des liens
    edges.forEach(edge => {
      const source = nodes.find(n => n.id === edge.source);
      const target = nodes.find(n => n.id === edge.target);

      if (!source || !target) return;

      const dx = target.x - source.x;
      const dy = target.y - source.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const targetDist = 100;
      const force = (dist - targetDist) / dist * settings.linkStrength * alpha;

      source.vx += dx * force;
      source.vy += dy * force;
      target.vx -= dx * force;
      target.vy -= dy * force;
    });

    // Mise à jour des positions
    nodes.forEach(node => {
      if (node.id === draggedNode) return; // Ne pas bouger le nœud en cours de drag

      node.x += node.vx;
      node.y += node.vy;

      // Limites
      node.x = Math.max(50, Math.min(width - 50, node.x));
      node.y = Math.max(50, Math.min(height - 50, node.y));
    });
  }, [nodes, edges, isAnimating, settings, draggedNode, centerX, centerY, width, height]);

  // Animation
  useEffect(() => {
    if (!isAnimating) return;

    const interval = setInterval(simulateForces, 1000 / settings.animationSpeed);
    return () => clearInterval(interval);
  }, [simulateForces, isAnimating, settings.animationSpeed]);

  // Handlers
  const handleNodeMouseDown = (nodeId: string, event: React.MouseEvent) => {
    setDraggedNode(nodeId);
    setIsDragging(true);

    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      const rect = svgRef.current?.getBoundingClientRect();
      if (rect) {
        node.fx = (event.clientX - rect.left - pan.x) / zoom;
        node.fy = (event.clientY - rect.top - pan.y) / zoom;
      }
    }
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!isDragging || !draggedNode) return;

    const node = nodes.find(n => n.id === draggedNode);
    if (node) {
      const rect = svgRef.current?.getBoundingClientRect();
      if (rect) {
        node.x = (event.clientX - rect.left - pan.x) / zoom;
        node.y = (event.clientY - rect.top - pan.y) / zoom;
        node.vx = 0;
        node.vy = 0;
      }
    }
  };

  const handleMouseUp = () => {
    if (draggedNode) {
      const node = nodes.find(n => n.id === draggedNode);
      if (node) {
        delete node.fx;
        delete node.fy;
      }
    }
    setIsDragging(false);
    setDraggedNode(null);
  };

  const handleZoom = (factor: number) => {
    setZoom(prev => Math.max(0.1, Math.min(3, prev * factor)));
  };

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setSelectedNode(null);
  };

  const toggleAnimation = () => {
    setIsAnimating(prev => !prev);
  };

  const getNodeRadius = (node: NetworkNode) => {
    const baseSize = settings.nodeSize;
    const sizeMultiplier = Math.max(0.5, Math.min(2, node.relationCount / 5));
    return baseSize * sizeMultiplier * 0.5;
  };

  return (
    <div className="space-y-4">
      {/* Contrôles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <GitBranch className="w-5 h-5" />
              Visualisation Réseau Interactive
            </span>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {filteredNodes.length} nœuds, {edges.length} liens
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleAnimation}
              >
                {isAnimating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Recherche */}
            <div>
              <Label htmlFor="search">Recherche</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Rechercher un organisme..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Contrôles de zoom */}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => handleZoom(1.2)}>
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleZoom(0.8)}>
                <ZoomOut className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={resetView}>
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>

            {/* Options d'affichage */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id="show-labels"
                  checked={settings.showLabels}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, showLabels: checked }))}
                />
                <Label htmlFor="show-labels" className="text-sm">Afficher les labels</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="show-inactive"
                  checked={settings.showInactive}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, showInactive: checked }))}
                />
                <Label htmlFor="show-inactive" className="text-sm">Relations inactives</Label>
              </div>
            </div>

            {/* Paramètres de simulation */}
            <div className="space-y-2">
              <div>
                <Label className="text-xs">Taille des nœuds</Label>
                <Slider
                  value={[settings.nodeSize]}
                  onValueChange={([value]) => setSettings(prev => ({ ...prev, nodeSize: value }))}
                  min={20}
                  max={100}
                  step={10}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs">Force des liens</Label>
                <Slider
                  value={[settings.linkStrength * 100]}
                  onValueChange={([value]) => setSettings(prev => ({ ...prev, linkStrength: value / 100 }))}
                  min={10}
                  max={100}
                  step={10}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Graphe */}
      <Card>
        <CardContent className="p-0">
          <div className="relative overflow-hidden bg-gray-50 rounded-lg">
            <svg
              ref={svgRef}
              width={width}
              height={height}
              viewBox={`${-pan.x} ${-pan.y} ${width / zoom} ${height / zoom}`}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              className="cursor-move"
            >
              {/* Définitions */}
              <defs>
                <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="2" dy="2" stdDeviation="2" floodColor="rgba(0,0,0,0.3)" />
                </filter>

                {/* Marqueurs pour les flèches */}
                {Object.entries(RELATION_COLORS).map(([type, color]) => (
                  <marker
                    key={type}
                    id={`arrow-${type}`}
                    markerWidth="10"
                    markerHeight="10"
                    refX="8"
                    refY="3"
                    orient="auto"
                    markerUnits="strokeWidth"
                  >
                    <path d="M0,0 L0,6 L9,3 z" fill={color} />
                  </marker>
                ))}
              </defs>

              {/* Grille de fond */}
              <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#e5e7eb" strokeWidth="1" opacity="0.5" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Arêtes */}
              <g className="edges">
                {edges.map((edge, index) => {
                  const source = nodes.find(n => n.id === edge.source);
                  const target = nodes.find(n => n.id === edge.target);

                  if (!source || !target) return null;

                  const isHighlighted = selectedNode &&
                    (selectedNode === edge.source || selectedNode === edge.target);

                  return (
                    <TooltipProvider key={index}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <line
                            x1={source.x}
                            y1={source.y}
                            x2={target.x}
                            y2={target.y}
                            stroke={edge.color}
                            strokeWidth={edge.strokeWidth}
                            opacity={isHighlighted ? 1 : 0.6}
                            markerEnd={`url(#arrow-${edge.relation.relationType})`}
                            className="cursor-pointer hover:opacity-100 transition-opacity"
                            onClick={() => onEdgeClick?.(edge.relation)}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="text-sm">
                            <div className="font-medium">
                              {source.name} → {target.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {RELATION_TYPE_LABELS[edge.relation.relationType]}
                            </div>
                            <div className="text-xs text-gray-500">
                              {edge.relation.accessCount || 0} accès
                            </div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  );
                })}
              </g>

              {/* Nœuds */}
              <g className="nodes">
                {filteredNodes.map(node => {
                  const radius = getNodeRadius(node);
                  const isSelected = selectedNode === node.id;
                  const isHovered = hoveredNode === node.id;
                  const isHighlighted = searchQuery &&
                    node.name.toLowerCase().includes(searchQuery.toLowerCase());

                  return (
                    <TooltipProvider key={node.id}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <g
                            className="cursor-pointer"
                            onMouseDown={(e) => handleNodeMouseDown(node.id, e)}
                            onMouseEnter={() => setHoveredNode(node.id)}
                            onMouseLeave={() => setHoveredNode(null)}
                            onClick={() => {
                              setSelectedNode(selectedNode === node.id ? null : node.id);
                              onNodeClick?.(node.id);
                            }}
                          >
                            {/* Cercle de surbrillance */}
                            {(isSelected || isHovered || isHighlighted) && (
                              <circle
                                cx={node.x}
                                cy={node.y}
                                r={radius + 5}
                                fill="none"
                                stroke={isSelected ? "#3B82F6" : "#10B981"}
                                strokeWidth="2"
                                opacity="0.8"
                                className="animate-pulse"
                              />
                            )}

                            {/* Nœud principal */}
                            <circle
                              cx={node.x}
                              cy={node.y}
                              r={radius}
                              fill={node.color}
                              stroke="#fff"
                              strokeWidth="2"
                              filter="url(#shadow)"
                              opacity={node.isActive ? 1 : 0.5}
                              className="transition-all duration-200 hover:scale-110"
                            />

                            {/* Icône */}
                            <text
                              x={node.x}
                              y={node.y + 2}
                              textAnchor="middle"
                              fontSize="12"
                              fill="white"
                              className="pointer-events-none"
                            >
                              🏢
                            </text>

                            {/* Badge du nombre de relations */}
                            {node.relationCount > 0 && (
                              <g>
                                <circle
                                  cx={node.x + radius * 0.7}
                                  cy={node.y - radius * 0.7}
                                  r="8"
                                  fill="#EF4444"
                                  stroke="#fff"
                                  strokeWidth="1"
                                />
                                <text
                                  x={node.x + radius * 0.7}
                                  y={node.y - radius * 0.7 + 3}
                                  textAnchor="middle"
                                  fontSize="8"
                                  fill="white"
                                  className="pointer-events-none"
                                >
                                  {node.relationCount}
                                </text>
                              </g>
                            )}
                          </g>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="text-sm">
                            <div className="font-medium">{node.name}</div>
                            <div className="text-xs text-gray-500">{node.type}</div>
                            <div className="text-xs text-gray-500">
                              {node.relationCount} relation(s)
                            </div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  );
                })}
              </g>

              {/* Labels */}
              {settings.showLabels && (
                <g className="labels">
                  {filteredNodes.map(node => {
                    const radius = getNodeRadius(node);
                    const shouldShow = zoom > 0.5 || selectedNode === node.id || hoveredNode === node.id;

                    if (!shouldShow) return null;

                    return (
                      <text
                        key={`label-${node.id}`}
                        x={node.x}
                        y={node.y + radius + 15}
                        textAnchor="middle"
                        fontSize={Math.max(8, 10 * zoom)}
                        fill="#374151"
                        className="pointer-events-none select-none"
                        style={{ textShadow: '1px 1px 2px rgba(255,255,255,0.8)' }}
                      >
                        {node.name.length > 15 ? node.name.substring(0, 15) + '...' : node.name}
                      </text>
                    );
                  })}
                </g>
              )}
            </svg>

            {/* Légende */}
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg">
              <div className="text-xs font-medium mb-2">Types d'organismes</div>
              <div className="space-y-1">
                {Object.entries(NODE_COLORS).map(([type, color]) => (
                  <div key={type} className="flex items-center gap-2 text-xs">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    <span>{type.replace('_', ' ')}</span>
                  </div>
                ))}
              </div>

              <div className="text-xs font-medium mt-3 mb-2">Types de relations</div>
              <div className="space-y-1">
                {Object.entries(RELATION_COLORS).map(([type, color]) => (
                  <div key={type} className="flex items-center gap-2 text-xs">
                    <div
                      className="w-3 h-1"
                      style={{ backgroundColor: color }}
                    />
                    <span>{RELATION_TYPE_LABELS[type as RelationType]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Info nœud sélectionné */}
            {selectedNode && (
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg max-w-sm">
                {(() => {
                  const node = nodes.find(n => n.id === selectedNode);
                  if (!node) return null;

                  const nodeRelations = edges.filter(e =>
                    e.source === selectedNode || e.target === selectedNode
                  );

                  return (
                    <div>
                      <div className="font-medium text-sm">{node.name}</div>
                      <div className="text-xs text-gray-500 mb-2">{node.type}</div>

                      <div className="space-y-1">
                        <div className="text-xs">
                          <span className="font-medium">{node.relationCount}</span> relation(s) active(s)
                        </div>

                        {nodeRelations.slice(0, 3).map((edge, index) => {
                          const partnerNode = nodes.find(n =>
                            n.id === (edge.source === selectedNode ? edge.target : edge.source)
                          );
                          return (
                            <div key={index} className="text-xs text-gray-600">
                              → {partnerNode?.name} ({RELATION_TYPE_LABELS[edge.relation.relationType]})
                            </div>
                          );
                        })}

                        {nodeRelations.length > 3 && (
                          <div className="text-xs text-gray-500">
                            +{nodeRelations.length - 3} autres...
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
