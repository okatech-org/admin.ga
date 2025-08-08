'use client';

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import {
  OrganizationRelation,
  RelationType,
  RelationStatus,
  RelationAnalytics,
  isRelationActive
} from '@/lib/types/organization-relations';

// === INTERFACES ===
interface VirtualizationSettings {
  enabled: boolean;
  itemHeight: number;
  containerHeight: number;
  overscan: number;
}

interface FilterOptions {
  type?: RelationType | 'all';
  status?: RelationStatus | 'all';
  direction?: 'incoming' | 'outgoing' | 'all';
  searchQuery?: string;
  dateRange?: 'all' | '7d' | '30d' | '90d';
  showInactive?: boolean;
}

interface VirtualItem {
  index: number;
  start: number;
  end: number;
  size: number;
}

interface UseVirtualRelationsResult {
  // Données filtrées et paginées
  filteredRelations: OrganizationRelation[];
  paginatedRelations: OrganizationRelation[];
  totalCount: number;

  // Virtualisation
  virtualItems: VirtualItem[];
  visibleRange: { start: number; end: number };
  scrollElement: React.RefObject<HTMLDivElement>;
  measureElement: (index: number, element: HTMLElement) => void;

  // Pagination
  currentPage: number;
  totalPages: number;
  pageSize: number;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;

  // Analytics optimisées
  analytics: RelationAnalytics | null;

  // Actions de performance
  invalidateCache: () => void;
  refreshData: () => Promise<void>;

  // État de chargement
  isLoading: boolean;
  error: string | null;
}

// === HOOK PRINCIPAL ===
export const useVirtualRelations = (
  relations: OrganizationRelation[],
  organizations: any[],
  filters: FilterOptions = {},
  virtualizationSettings: Partial<VirtualizationSettings> = {}
): UseVirtualRelationsResult => {

  // Configuration par défaut
  const settings: VirtualizationSettings = {
    enabled: true,
    itemHeight: 60,
    containerHeight: 600,
    overscan: 5,
    ...virtualizationSettings
  };

  // États
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [cacheKey, setCacheKey] = useState(0);

  // Références
  const scrollElement = useRef<HTMLDivElement>(null);
  const heightsRef = useRef<number[]>([]);
  const cacheRef = useRef<Map<string, any>>(new Map());

  // Invalidation du cache
  const invalidateCache = useCallback(() => {
    cacheRef.current.clear();
    setCacheKey(prev => prev + 1);
  }, []);

  // Mémorisation des relations filtrées
  const filteredRelations = useMemo(() => {
    const cacheKeyStr = `filtered_${JSON.stringify(filters)}_${cacheKey}`;

    if (cacheRef.current.has(cacheKeyStr)) {
      return cacheRef.current.get(cacheKeyStr);
    }

    let filtered = [...relations];

    // Filtre par type
    if (filters.type && filters.type !== 'all') {
      filtered = filtered.filter(rel => rel.relationType === filters.type);
    }

    // Filtre par statut
    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(rel => rel.status === filters.status);
    }

    // Filtre par direction (nécessite orgId - simulé ici)
    if (filters.direction && filters.direction !== 'all') {
      // Cette logique nécessiterait l'ID de l'organisation courante
      // Pour l'instant, on garde toutes les relations
    }

    // Filtre par recherche textuelle
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(rel => {
        const fromOrgName = rel.fromOrg?.name?.toLowerCase() || '';
        const toOrgName = rel.toOrg?.name?.toLowerCase() || '';
        const notes = rel.notes?.toLowerCase() || '';

        return fromOrgName.includes(query) ||
               toOrgName.includes(query) ||
               notes.includes(query);
      });
    }

    // Filtre par date
    if (filters.dateRange && filters.dateRange !== 'all') {
      const now = new Date();
      const daysAgo = {
        '7d': 7,
        '30d': 30,
        '90d': 90
      }[filters.dateRange] || 0;

      const cutoffDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

      filtered = filtered.filter(rel =>
        new Date(rel.updatedAt) >= cutoffDate
      );
    }

    // Filtre par statut actif/inactif
    if (!filters.showInactive) {
      filtered = filtered.filter(rel => isRelationActive(rel));
    }

    // Tri par défaut (dernière mise à jour)
    filtered.sort((a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

    cacheRef.current.set(cacheKeyStr, filtered);
    return filtered;
  }, [relations, filters, cacheKey]);

  // Calcul des analytics optimisé
  const analytics = useMemo(() => {
    const cacheKeyStr = `analytics_${filteredRelations.length}_${cacheKey}`;

    if (cacheRef.current.has(cacheKeyStr)) {
      return cacheRef.current.get(cacheKeyStr);
    }

    const totalRelations = filteredRelations.length;

    if (totalRelations === 0) {
      return null;
    }

    const relationsByType = filteredRelations.reduce((acc, rel) => {
      acc[rel.relationType] = (acc[rel.relationType] || 0) + 1;
      return acc;
    }, {} as Record<RelationType, number>);

    const relationsByStatus = filteredRelations.reduce((acc, rel) => {
      acc[rel.status] = (acc[rel.status] || 0) + 1;
      return acc;
    }, {} as Record<RelationStatus, number>);

    const totalDataAccesses = filteredRelations.reduce((sum, rel) =>
      sum + (rel.accessCount || 0), 0
    );

    const accessesByDataType = filteredRelations.reduce((acc, rel) => {
      // Simulation des types de données accédées
      acc['statistics'] = (acc['statistics'] || 0) + Math.floor((rel.accessCount || 0) * 0.4);
      acc['reports'] = (acc['reports'] || 0) + Math.floor((rel.accessCount || 0) * 0.3);
      acc['user_data'] = (acc['user_data'] || 0) + Math.floor((rel.accessCount || 0) * 0.2);
      acc['services'] = (acc['services'] || 0) + Math.floor((rel.accessCount || 0) * 0.1);
      return acc;
    }, {} as Record<string, number>);

    // Top organismes par accès
    const orgAccessCounts = new Map<string, number>();
    filteredRelations.forEach(rel => {
      const fromOrgId = rel.fromOrgId;
      const toOrgId = rel.toOrgId;
      const accessCount = rel.accessCount || 0;

      orgAccessCounts.set(fromOrgId, (orgAccessCounts.get(fromOrgId) || 0) + accessCount);
      orgAccessCounts.set(toOrgId, (orgAccessCounts.get(toOrgId) || 0) + accessCount);
    });

    const topAccessedOrganizations = Array.from(orgAccessCounts.entries())
      .map(([orgId, accessCount]) => ({
        orgId,
        orgName: organizations.find(org => org.id === orgId)?.name || 'Inconnu',
        accessCount
      }))
      .sort((a, b) => b.accessCount - a.accessCount)
      .slice(0, 5);

    const result: RelationAnalytics = {
      totalRelations,
      relationsByType,
      relationsByStatus,
      totalDataAccesses,
      accessesByDataType,
      topAccessedOrganizations,
      securityAlerts: [
        { type: 'SUSPICIOUS_ACCESS', count: 0, lastOccurrence: new Date().toISOString() },
        { type: 'FAILED_AUTH', count: 0, lastOccurrence: new Date().toISOString() },
        { type: 'UNUSUAL_ACTIVITY', count: 0, lastOccurrence: new Date().toISOString() }
      ],
      performanceMetrics: {
        avgResponseTime: 245,
        successRate: 98.5,
        errorRate: 1.5
      }
    };

    cacheRef.current.set(cacheKeyStr, result);
    return result;
  }, [filteredRelations, organizations, cacheKey]);

  // Pagination
  const totalCount = filteredRelations.length;
  const totalPages = Math.ceil(totalCount / pageSize);

  const paginatedRelations = useMemo(() => {
    if (!settings.enabled) {
      return filteredRelations;
    }

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredRelations.slice(startIndex, endIndex);
  }, [filteredRelations, currentPage, pageSize, settings.enabled]);

  // Virtualisation
  const getItemHeight = useCallback((index: number) => {
    return heightsRef.current[index] || settings.itemHeight;
  }, [settings.itemHeight]);

  const measureElement = useCallback((index: number, element: HTMLElement) => {
    const height = element.getBoundingClientRect().height;
    if (heightsRef.current[index] !== height) {
      heightsRef.current[index] = height;
      // Force recalcul si nécessaire
    }
  }, []);

  // Calcul des éléments virtuels visibles
  const virtualItems = useMemo(() => {
    if (!settings.enabled) {
      return [];
    }

    const items: VirtualItem[] = [];
    const itemCount = paginatedRelations.length;
    let start = 0;

    for (let i = 0; i < itemCount; i++) {
      const size = getItemHeight(i);
      items.push({
        index: i,
        start,
        end: start + size,
        size
      });
      start += size;
    }

    return items;
  }, [paginatedRelations.length, getItemHeight, settings.enabled]);

  // Calcul de la plage visible
  const visibleRange = useMemo(() => {
    if (!settings.enabled || virtualItems.length === 0) {
      return { start: 0, end: paginatedRelations.length };
    }

    const containerHeight = settings.containerHeight;
    const scrollStart = scrollTop;
    const scrollEnd = scrollStart + containerHeight;

    let start = 0;
    let end = virtualItems.length;

    // Trouve le premier élément visible
    for (let i = 0; i < virtualItems.length; i++) {
      if (virtualItems[i].end > scrollStart) {
        start = Math.max(0, i - settings.overscan);
        break;
      }
    }

    // Trouve le dernier élément visible
    for (let i = start; i < virtualItems.length; i++) {
      if (virtualItems[i].start > scrollEnd) {
        end = Math.min(virtualItems.length, i + settings.overscan);
        break;
      }
    }

    return { start, end };
  }, [scrollTop, virtualItems, settings, paginatedRelations.length]);

  // Gestionnaire de scroll
  useEffect(() => {
    const element = scrollElement.current;
    if (!element || !settings.enabled) return;

    const handleScroll = () => {
      setScrollTop(element.scrollTop);
    };

    element.addEventListener('scroll', handleScroll, { passive: true });
    return () => element.removeEventListener('scroll', handleScroll);
  }, [settings.enabled]);

  // Refresh des données
  const refreshData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      invalidateCache();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du refresh');
    } finally {
      setIsLoading(false);
    }
  }, [invalidateCache]);

  // Nettoyage du cache en cas de changement majeur
  useEffect(() => {
    invalidateCache();
  }, [relations.length, organizations.length, invalidateCache]);

  return {
    filteredRelations,
    paginatedRelations,
    totalCount,
    virtualItems,
    visibleRange,
    scrollElement,
    measureElement,
    currentPage,
    totalPages,
    pageSize,
    setCurrentPage,
    setPageSize,
    analytics,
    invalidateCache,
    refreshData,
    isLoading,
    error
  };
};

// === HOOK POUR OPTIMIZATION DES RENDERS ===
export const useRelationMemo = () => {
  return {
    // Mémorisation des callbacks pour éviter les re-renders
    memoizeCallback: useCallback,

    // Mémorisation des objets complexes
    memoizeObject: useMemo,

    // Helper pour comparer les relations
    compareRelations: useCallback((a: OrganizationRelation, b: OrganizationRelation) => {
      return a.id === b.id &&
             a.updatedAt === b.updatedAt &&
             a.status === b.status;
    }, []),

    // Helper pour les clés de cache
    generateCacheKey: useCallback((prefix: string, data: any) => {
      return `${prefix}_${JSON.stringify(data)}_${Date.now()}`;
    }, [])
  };
};

// === HOOK POUR DEBOUNCING ===
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
