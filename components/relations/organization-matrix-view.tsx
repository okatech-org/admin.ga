'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Download, Filter, Search, Eye, EyeOff, RotateCcw, Grid3X3,
  ArrowRight, ArrowUpRight, ArrowDownRight, Minus, Plus
} from 'lucide-react';
import {
  OrganizationRelation,
  RelationType,
  RelationStatus,
  RELATION_TYPE_LABELS,
  RELATION_STATUS_LABELS,
  isRelationActive
} from '@/lib/types/organization-relations';

// === INTERFACES ===
interface MatrixCell {
  sourceId: string;
  targetId: string;
  relations: OrganizationRelation[];
  hasRelation: boolean;
  relationTypes: RelationType[];
  totalAccess: number;
  isActive: boolean;
  isPending: boolean;
}

interface MatrixViewSettings {
  showEmpty: boolean;
  showInactive: boolean;
  groupByType: boolean;
  colorBy: 'type' | 'status' | 'access';
  cellSize: 'small' | 'medium' | 'large';
}

// === UTILITAIRES ===
const CELL_SIZES = {
  small: 'w-8 h-8 text-xs',
  medium: 'w-12 h-12 text-sm',
  large: 'w-16 h-16 text-base'
};

const TYPE_COLORS = {
  [RelationType.HIERARCHICAL]: 'bg-blue-100 border-blue-300 text-blue-800',
  [RelationType.COLLABORATIVE]: 'bg-green-100 border-green-300 text-green-800',
  [RelationType.INFORMATIONAL]: 'bg-gray-100 border-gray-300 text-gray-800'
};

const STATUS_COLORS = {
  [RelationStatus.ACTIVE]: 'bg-green-100 border-green-300',
  [RelationStatus.PENDING]: 'bg-yellow-100 border-yellow-300',
  [RelationStatus.SUSPENDED]: 'bg-orange-100 border-orange-300',
  [RelationStatus.EXPIRED]: 'bg-red-100 border-red-300',
  [RelationStatus.REVOKED]: 'bg-gray-100 border-gray-300'
};

// === COMPOSANT PRINCIPAL ===
interface OrganizationMatrixViewProps {
  relations: OrganizationRelation[];
  organizations: any[];
  onCellClick?: (sourceId: string, targetId: string, relations: OrganizationRelation[]) => void;
  onCreateRelation?: (sourceId: string, targetId: string) => void;
}

export const OrganizationMatrixView: React.FC<OrganizationMatrixViewProps> = ({
  relations,
  organizations,
  onCellClick,
  onCreateRelation
}) => {
  // États
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [hoveredCell, setHoveredCell] = useState<{ source: string; target: string } | null>(null);

  const [settings, setSettings] = useState<MatrixViewSettings>({
    showEmpty: true,
    showInactive: false,
    groupByType: false,
    colorBy: 'type',
    cellSize: 'medium'
  });

  // Organisations filtrées
  const filteredOrganizations = useMemo(() => {
    if (!searchQuery) return organizations;

    const query = searchQuery.toLowerCase();
    return organizations.filter(org =>
      org.name.toLowerCase().includes(query) ||
      org.code.toLowerCase().includes(query) ||
      org.type.toLowerCase().includes(query)
    );
  }, [organizations, searchQuery]);

  // Groupement par type si activé
  const organizedOrgs = useMemo(() => {
    if (!settings.groupByType) return filteredOrganizations;

    const grouped = filteredOrganizations.reduce((acc, org) => {
      const type = org.type || 'AUTRE';
      if (!acc[type]) acc[type] = [];
      acc[type].push(org);
      return acc;
    }, {} as Record<string, any[]>);

    // Trier les groupes et les organisations dans chaque groupe
    const sortedTypes = Object.keys(grouped).sort();
    return sortedTypes.flatMap(type =>
      grouped[type].sort((a, b) => a.name.localeCompare(b.name))
    );
  }, [filteredOrganizations, settings.groupByType]);

  // Matrice des relations
  const matrix = useMemo(() => {
    const matrixData: MatrixCell[][] = [];

    organizedOrgs.forEach((sourceOrg, sourceIndex) => {
      matrixData[sourceIndex] = [];

      organizedOrgs.forEach((targetOrg, targetIndex) => {
        const cellRelations = relations.filter(rel =>
          (rel.fromOrgId === sourceOrg.id && rel.toOrgId === targetOrg.id) ||
          (rel.fromOrgId === targetOrg.id && rel.toOrgId === sourceOrg.id)
        );

        // Filtrage par statut
        const filteredRelations = cellRelations.filter(rel => {
          if (selectedStatus !== 'all' && rel.status !== selectedStatus) return false;
          if (selectedType !== 'all' && rel.relationType !== selectedType) return false;
          if (!settings.showInactive && !isRelationActive(rel)) return false;
          return true;
        });

        const activeRelations = filteredRelations.filter(rel => isRelationActive(rel));
        const pendingRelations = filteredRelations.filter(rel => rel.status === RelationStatus.PENDING);

        matrixData[sourceIndex][targetIndex] = {
          sourceId: sourceOrg.id,
          targetId: targetOrg.id,
          relations: filteredRelations,
          hasRelation: filteredRelations.length > 0,
          relationTypes: [...new Set(filteredRelations.map(rel => rel.relationType))],
          totalAccess: filteredRelations.reduce((sum, rel) => sum + (rel.accessCount || 0), 0),
          isActive: activeRelations.length > 0,
          isPending: pendingRelations.length > 0
        };
      });
    });

    return matrixData;
  }, [organizedOrgs, relations, selectedType, selectedStatus, settings.showInactive]);

  // Calcul des statistiques
  const statistics = useMemo(() => {
    const totalCells = matrix.length * matrix.length;
    const cellsWithRelations = matrix.flat().filter(cell => cell.hasRelation).length;
    const activeCells = matrix.flat().filter(cell => cell.isActive).length;
    const pendingCells = matrix.flat().filter(cell => cell.isPending).length;

    return {
      totalCells,
      cellsWithRelations,
      activeCells,
      pendingCells,
      density: totalCells > 0 ? (cellsWithRelations / totalCells * 100).toFixed(1) : '0'
    };
  }, [matrix]);

  // Handlers
  const handleCellClick = (cell: MatrixCell) => {
    if (cell.hasRelation) {
      onCellClick?.(cell.sourceId, cell.targetId, cell.relations);
    } else if (cell.sourceId !== cell.targetId) {
      onCreateRelation?.(cell.sourceId, cell.targetId);
    }
  };

  const getCellColor = (cell: MatrixCell) => {
    if (cell.sourceId === cell.targetId) {
      return 'bg-gray-200 border-gray-300'; // Diagonale
    }

    if (!cell.hasRelation) {
      return settings.showEmpty
        ? 'bg-white border-gray-200 hover:bg-blue-50 cursor-pointer'
        : 'bg-gray-50 border-gray-100';
    }

    switch (settings.colorBy) {
      case 'type':
        const primaryType = cell.relationTypes[0];
        return TYPE_COLORS[primaryType] || 'bg-gray-100 border-gray-300';

      case 'status':
        const primaryStatus = cell.relations[0]?.status;
        return STATUS_COLORS[primaryStatus] || 'bg-gray-100 border-gray-300';

      case 'access':
        const intensity = Math.min(cell.totalAccess / 100, 1);
        const alpha = Math.max(0.1, intensity);
        return `bg-blue-500 border-blue-600` + ` bg-opacity-${Math.round(alpha * 100)}`;

      default:
        return 'bg-blue-100 border-blue-300';
    }
  };

  const getCellContent = (cell: MatrixCell) => {
    if (cell.sourceId === cell.targetId) {
      return '—';
    }

    if (!cell.hasRelation) {
      return settings.showEmpty ? '+' : '';
    }

    switch (settings.colorBy) {
      case 'access':
        return cell.totalAccess.toString();

      case 'type':
        if (cell.relationTypes.length === 1) {
          const icons = {
            [RelationType.HIERARCHICAL]: '↕',
            [RelationType.COLLABORATIVE]: '↔',
            [RelationType.INFORMATIONAL]: '→'
          };
          return icons[cell.relationTypes[0]] || '•';
        }
        return cell.relationTypes.length.toString();

      default:
        return cell.relations.length.toString();
    }
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedType('all');
    setSelectedStatus('all');
    setSettings(prev => ({
      ...prev,
      showEmpty: true,
      showInactive: false,
      groupByType: false
    }));
  };

  const exportMatrix = () => {
    // Logique d'export en CSV ou PDF
    const csvContent = [
      ['Source', 'Target', 'Relations', 'Types', 'Access'].join(','),
      ...matrix.flat()
        .filter(cell => cell.hasRelation)
        .map(cell => [
          organizedOrgs.find(o => o.id === cell.sourceId)?.name || '',
          organizedOrgs.find(o => o.id === cell.targetId)?.name || '',
          cell.relations.length,
          cell.relationTypes.join(';'),
          cell.totalAccess
        ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'matrice-relations.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Contrôles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Grid3X3 className="w-5 h-5" />
              Matrice des Relations Inter-Organismes
            </span>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {statistics.density}% densité
              </Badge>
              <Badge variant="outline">
                {statistics.cellsWithRelations} relations
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Recherche */}
            <div>
              <Label htmlFor="search">Recherche</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Filtrer organismes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filtres */}
            <div>
              <Label htmlFor="type-filter">Type de Relation</Label>
              <Select value={selectedType} onValueChange={setSelectedType}>
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
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
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

            <div>
              <Label htmlFor="color-by">Couleur par</Label>
              <Select
                value={settings.colorBy}
                onValueChange={(value) => setSettings(prev => ({ ...prev, colorBy: value as any }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="type">Type de relation</SelectItem>
                  <SelectItem value="status">Statut</SelectItem>
                  <SelectItem value="access">Nombre d'accès</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2">
              <Button variant="outline" size="sm" onClick={exportMatrix}>
                <Download className="w-4 h-4 mr-2" />
                Exporter
              </Button>
              <Button variant="outline" size="sm" onClick={resetFilters}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>

          {/* Options d'affichage */}
          <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t">
            <div className="flex items-center space-x-2">
              <Switch
                id="show-empty"
                checked={settings.showEmpty}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, showEmpty: checked }))}
              />
              <Label htmlFor="show-empty" className="text-sm">Cellules vides</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="show-inactive"
                checked={settings.showInactive}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, showInactive: checked }))}
              />
              <Label htmlFor="show-inactive" className="text-sm">Relations inactives</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="group-by-type"
                checked={settings.groupByType}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, groupByType: checked }))}
              />
              <Label htmlFor="group-by-type" className="text-sm">Grouper par type</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Label className="text-sm">Taille:</Label>
              <Select
                value={settings.cellSize}
                onValueChange={(value) => setSettings(prev => ({ ...prev, cellSize: value as any }))}
              >
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Petite</SelectItem>
                  <SelectItem value="medium">Moyenne</SelectItem>
                  <SelectItem value="large">Grande</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{statistics.cellsWithRelations}</div>
            <div className="text-sm text-gray-600">Relations existantes</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{statistics.activeCells}</div>
            <div className="text-sm text-gray-600">Relations actives</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{statistics.pendingCells}</div>
            <div className="text-sm text-gray-600">En attente</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{statistics.density}%</div>
            <div className="text-sm text-gray-600">Densité du réseau</div>
          </CardContent>
        </Card>
      </div>

      {/* Matrice */}
      <Card>
        <CardContent className="p-4">
          <ScrollArea className="w-full h-[600px]">
            <div className="relative">
              {/* Headers horizontaux */}
              <div className="flex sticky top-0 bg-white z-10">
                <div className={`${CELL_SIZES[settings.cellSize]} border border-gray-300 bg-gray-100`} />
                {organizedOrgs.map((org, index) => (
                  <TooltipProvider key={org.id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className={`${CELL_SIZES[settings.cellSize]} border border-gray-300 bg-gray-100 flex items-center justify-center font-medium text-center overflow-hidden`}
                        >
                          <span className="transform -rotate-45 text-xs leading-none">
                            {org.code || org.name.substring(0, 3)}
                          </span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div>
                          <div className="font-medium">{org.name}</div>
                          <div className="text-xs text-gray-500">{org.type}</div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>

              {/* Lignes de la matrice */}
              {matrix.map((row, rowIndex) => (
                <div key={rowIndex} className="flex">
                  {/* Header vertical */}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className={`${CELL_SIZES[settings.cellSize]} border border-gray-300 bg-gray-100 flex items-center justify-center font-medium text-center overflow-hidden sticky left-0 z-5`}>
                          <span className="text-xs leading-tight">
                            {organizedOrgs[rowIndex]?.code || organizedOrgs[rowIndex]?.name.substring(0, 3)}
                          </span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div>
                          <div className="font-medium">{organizedOrgs[rowIndex]?.name}</div>
                          <div className="text-xs text-gray-500">{organizedOrgs[rowIndex]?.type}</div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  {/* Cellules de données */}
                  {row.map((cell, colIndex) => {
                    const isHovered = hoveredCell?.source === cell.sourceId && hoveredCell?.target === cell.targetId;

                    return (
                      <TooltipProvider key={colIndex}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div
                              className={`
                                ${CELL_SIZES[settings.cellSize]}
                                border border-gray-300
                                flex items-center justify-center
                                font-medium text-center
                                transition-all duration-200
                                ${getCellColor(cell)}
                                ${isHovered ? 'ring-2 ring-blue-400 z-10' : ''}
                                ${cell.hasRelation || (cell.sourceId !== cell.targetId && settings.showEmpty) ? 'cursor-pointer hover:scale-105' : ''}
                              `}
                              onClick={() => handleCellClick(cell)}
                              onMouseEnter={() => setHoveredCell({ source: cell.sourceId, target: cell.targetId })}
                              onMouseLeave={() => setHoveredCell(null)}
                            >
                              {getCellContent(cell)}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="text-sm max-w-xs">
                              <div className="font-medium mb-1">
                                {organizedOrgs.find(o => o.id === cell.sourceId)?.name} →{' '}
                                {organizedOrgs.find(o => o.id === cell.targetId)?.name}
                              </div>

                              {cell.hasRelation ? (
                                <div className="space-y-1">
                                  <div>{cell.relations.length} relation(s)</div>
                                  {cell.relationTypes.map(type => (
                                    <div key={type} className="text-xs">
                                      • {RELATION_TYPE_LABELS[type]}
                                    </div>
                                  ))}
                                  {cell.totalAccess > 0 && (
                                    <div className="text-xs text-gray-500">
                                      {cell.totalAccess} accès total
                                    </div>
                                  )}
                                </div>
                              ) : cell.sourceId !== cell.targetId ? (
                                <div className="text-xs text-gray-500">
                                  Cliquer pour créer une relation
                                </div>
                              ) : (
                                <div className="text-xs text-gray-500">
                                  Auto-relation
                                </div>
                              )}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    );
                  })}
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Légende */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="font-medium mb-2">Types de Relations</h4>
              <div className="space-y-1">
                {Object.entries(RELATION_TYPE_LABELS).map(([type, label]) => (
                  <div key={type} className="flex items-center gap-2 text-sm">
                    <div className={`w-4 h-4 rounded border ${TYPE_COLORS[type as RelationType]}`} />
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Symboles</h4>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-4 text-center">↕</span>
                  <span>Hiérarchique</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 text-center">↔</span>
                  <span>Collaborative</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 text-center">→</span>
                  <span>Informationnelle</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 text-center">+</span>
                  <span>Créer relation</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Instructions</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <div>• Cliquez sur une cellule avec relation pour voir les détails</div>
                <div>• Cliquez sur une cellule vide pour créer une relation</div>
                <div>• Survolez pour voir les informations rapides</div>
                <div>• Utilisez les filtres pour personnaliser la vue</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
