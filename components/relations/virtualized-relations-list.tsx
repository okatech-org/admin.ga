'use client';

import React, { memo, forwardRef, useRef, useImperativeHandle } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Building2, Edit, Trash2, Eye, Clock, CheckCircle, AlertCircle,
  ArrowRight, MoreHorizontal
} from 'lucide-react';
import {
  OrganizationRelation,
  RelationType,
  RelationStatus,
  RELATION_TYPE_LABELS,
  RELATION_STATUS_LABELS,
  isRelationActive
} from '@/lib/types/organization-relations';
import { useVirtualRelations, useDebounce } from '@/hooks/use-virtual-relations';

// === INTERFACES ===
interface VirtualizedRelationsListProps {
  relations: OrganizationRelation[];
  organizations: any[];
  filters?: {
    searchQuery?: string;
    type?: RelationType | 'all';
    status?: RelationStatus | 'all';
    showInactive?: boolean;
  };
  onRelationEdit?: (relation: OrganizationRelation) => void;
  onRelationDelete?: (relationId: string) => void;
  onRelationView?: (relation: OrganizationRelation) => void;
  itemHeight?: number;
  containerHeight?: number;
  pageSize?: number;
}

interface VirtualizedListRef {
  scrollToIndex: (index: number) => void;
  scrollToTop: () => void;
  refresh: () => void;
}

// === COMPOSANT D'ITEM MÉMORISÉ ===
const RelationItem = memo(({
  relation,
  organizations,
  onEdit,
  onDelete,
  onView,
  style,
  measureRef
}: {
  relation: OrganizationRelation;
  organizations: any[];
  onEdit?: (relation: OrganizationRelation) => void;
  onDelete?: (relationId: string) => void;
  onView?: (relation: OrganizationRelation) => void;
  style?: React.CSSProperties;
  measureRef?: (element: HTMLElement | null) => void;
}) => {
  const fromOrg = organizations.find(org => org.id === relation.fromOrgId);
  const toOrg = organizations.find(org => org.id === relation.toOrgId);
  const isActive = isRelationActive(relation);

  const getStatusColor = (status: RelationStatus) => {
    switch (status) {
      case RelationStatus.ACTIVE:
        return 'bg-green-100 text-green-800 border-green-200';
      case RelationStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case RelationStatus.SUSPENDED:
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case RelationStatus.EXPIRED:
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeColor = (type: RelationType) => {
    switch (type) {
      case RelationType.HIERARCHICAL:
        return 'bg-blue-100 text-blue-800';
      case RelationType.COLLABORATIVE:
        return 'bg-green-100 text-green-800';
      case RelationType.INFORMATIONAL:
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div style={style} ref={measureRef}>
      <Card className={`mb-2 transition-all duration-200 hover:shadow-md ${
        !isActive ? 'opacity-75' : ''
      }`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            {/* Informations principales */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-gray-500" />
                  <span className="font-medium text-sm truncate">
                    {fromOrg?.name || 'Organisme inconnu'}
                  </span>
                </div>

                <ArrowRight className="w-4 h-4 text-gray-400" />

                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-gray-500" />
                  <span className="font-medium text-sm truncate">
                    {toOrg?.name || 'Organisme inconnu'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <Badge className={getTypeColor(relation.relationType)} variant="outline">
                  {RELATION_TYPE_LABELS[relation.relationType]}
                </Badge>

                <Badge className={getStatusColor(relation.status)} variant="outline">
                  {RELATION_STATUS_LABELS[relation.status]}
                </Badge>

                {relation.priority === 'HIGH' && (
                  <Badge variant="destructive" className="text-xs">
                    Priorité élevée
                  </Badge>
                )}
              </div>

              {relation.notes && (
                <p className="text-xs text-gray-600 truncate">
                  {relation.notes}
                </p>
              )}
            </div>

            {/* Métriques */}
            <div className="flex items-center gap-4 mx-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">
                        {relation.accessCount || 0}
                      </div>
                      <div className="text-xs text-gray-500">Accès</div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Nombre total d'accès aux données partagées</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1">
                  {relation.approvedByFromOrg && relation.approvedByToOrg ? (
                    <CheckCircle className="w-4 h-4 text-green-500 mx-auto" />
                  ) : (
                    <Clock className="w-4 h-4 text-yellow-500 mx-auto" />
                  )}
                </div>
                <div className="text-xs text-gray-500">
                  {relation.approvedByFromOrg && relation.approvedByToOrg ? 'Approuvée' : 'En attente'}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onView?.(relation)}
                      className="h-8 w-8 p-0"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Voir les détails</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit?.(relation)}
                      className="h-8 w-8 p-0"
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
                      onClick={() => onDelete?.(relation.id)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Supprimer</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {/* Informations supplémentaires */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span>
                Créée le {new Date(relation.createdAt).toLocaleDateString('fr-FR')}
              </span>
              {relation.endDate && (
                <span>
                  Expire le {new Date(relation.endDate).toLocaleDateString('fr-FR')}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {relation.permissions?.canView && (
                <Badge variant="outline" className="text-xs">Lecture</Badge>
              )}
              {relation.permissions?.canExport && (
                <Badge variant="outline" className="text-xs">Export</Badge>
              )}
              {relation.permissions?.canModify && (
                <Badge variant="outline" className="text-xs">Modification</Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

RelationItem.displayName = 'RelationItem';

// === COMPOSANT SKELETON ===
const RelationItemSkeleton = memo(() => (
  <Card className="mb-2">
    <CardContent className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <Skeleton className="w-4 h-4" />
            <Skeleton className="w-32 h-4" />
            <Skeleton className="w-4 h-4" />
            <Skeleton className="w-32 h-4" />
          </div>
          <div className="flex items-center gap-2 mb-2">
            <Skeleton className="w-20 h-5" />
            <Skeleton className="w-16 h-5" />
          </div>
          <Skeleton className="w-64 h-3" />
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="w-8 h-8" />
          <Skeleton className="w-8 h-8" />
          <Skeleton className="w-8 h-8" />
        </div>
      </div>
    </CardContent>
  </Card>
));

RelationItemSkeleton.displayName = 'RelationItemSkeleton';

// === COMPOSANT PRINCIPAL ===
export const VirtualizedRelationsList = forwardRef<VirtualizedListRef, VirtualizedRelationsListProps>(({
  relations,
  organizations,
  filters = {},
  onRelationEdit,
  onRelationDelete,
  onRelationView,
  itemHeight = 160,
  containerHeight = 600,
  pageSize = 50
}, ref) => {

  const containerRef = useRef<HTMLDivElement>(null);

  // Debounce des filtres pour éviter trop de recalculs
  const debouncedFilters = useDebounce(filters, 300);

  // Hook de virtualisation
  const {
    filteredRelations,
    paginatedRelations,
    totalCount,
    virtualItems,
    visibleRange,
    scrollElement,
    measureElement,
    currentPage,
    totalPages,
    setCurrentPage,
    analytics,
    refreshData,
    isLoading
  } = useVirtualRelations(
    relations,
    organizations,
    debouncedFilters,
    {
      enabled: true,
      itemHeight,
      containerHeight,
      overscan: 3
    }
  );

  // Méthodes exposées via ref
  useImperativeHandle(ref, () => ({
    scrollToIndex: (index: number) => {
      if (containerRef.current && virtualItems[index]) {
        containerRef.current.scrollTop = virtualItems[index].start;
      }
    },
    scrollToTop: () => {
      if (containerRef.current) {
        containerRef.current.scrollTop = 0;
      }
    },
    refresh: () => {
      refreshData();
    }
  }), [virtualItems, refreshData]);

  // Calcul de la hauteur totale pour le scroll virtuel
  const totalHeight = virtualItems.length > 0
    ? virtualItems[virtualItems.length - 1].end
    : 0;

  // Éléments visibles dans la plage courante
  const visibleItems = virtualItems.slice(visibleRange.start, visibleRange.end);

  return (
    <div className="space-y-4">
      {/* Informations de pagination */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <div>
          Affichage de {((currentPage - 1) * pageSize) + 1} à {Math.min(currentPage * pageSize, totalCount)} sur {totalCount} relations
        </div>
        <div className="flex items-center gap-2">
          {totalPages > 1 && (
            <>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Précédent
              </Button>
              <span className="px-2">
                {currentPage} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Suivant
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Container virtualisé */}
      <div
        ref={(el) => {
          containerRef.current = el;
          (scrollElement as any).current = el;
        }}
        className="overflow-auto border rounded-lg bg-gray-50"
        style={{ height: containerHeight }}
      >
        {isLoading ? (
          // Affichage de chargement
          <div className="p-4 space-y-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <RelationItemSkeleton key={index} />
            ))}
          </div>
        ) : paginatedRelations.length === 0 ? (
          // Aucune relation trouvée
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <Building2 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">Aucune relation trouvée</p>
              <p className="text-sm">Essayez de modifier vos filtres ou créez une nouvelle relation</p>
            </div>
          </div>
        ) : (
          // Liste virtualisée
          <div style={{ height: totalHeight, position: 'relative' }}>
            <div className="p-4">
              {visibleItems.map((virtualItem) => {
                const relation = paginatedRelations[virtualItem.index];
                if (!relation) return null;

                return (
                  <RelationItem
                    key={relation.id}
                    relation={relation}
                    organizations={organizations}
                    onEdit={onRelationEdit}
                    onDelete={onRelationDelete}
                    onView={onRelationView}
                    style={{
                      position: 'absolute',
                      top: virtualItem.start,
                      height: virtualItem.size,
                      width: '100%'
                    }}
                    measureRef={(element) => {
                      if (element) {
                        measureElement(virtualItem.index, element);
                      }
                    }}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Résumé des métriques */}
      {analytics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {analytics.relationsByStatus[RelationStatus.ACTIVE] || 0}
            </div>
            <div className="text-sm text-blue-700">Relations actives</div>
          </div>

          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">
              {analytics.relationsByStatus[RelationStatus.PENDING] || 0}
            </div>
            <div className="text-sm text-yellow-700">En attente</div>
          </div>

          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {analytics.totalDataAccesses.toLocaleString()}
            </div>
            <div className="text-sm text-green-700">Accès total</div>
          </div>

          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {((analytics.relationsByStatus[RelationStatus.ACTIVE] || 0) / analytics.totalRelations * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-purple-700">Taux d'activation</div>
          </div>
        </div>
      )}
    </div>
  );
});

VirtualizedRelationsList.displayName = 'VirtualizedRelationsList';
