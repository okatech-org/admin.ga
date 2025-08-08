'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';

interface DynamicBadgeProps {
  type: 'prospects' | 'clients' | 'relations';
  fallback?: number;
}

interface OrganismesStatsData {
  overview: {
    totalOrganismes: number;
    activeOrganismes: number;
    prospectsCount: number;
    clientsCount: number;
    relationsCount: number;
    recentOrganismes: number;
  };
}

// Cache des données pour éviter les requêtes multiples
let cachedData: OrganismesStatsData | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function DynamicBadge({ type, fallback }: DynamicBadgeProps) {
  const [value, setValue] = useState<number | null>(fallback || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadBadgeData();
  }, [type]);

  const loadBadgeData = async () => {
    try {
      // Vérifier le cache
      const now = Date.now();
      if (cachedData && (now - cacheTimestamp) < CACHE_DURATION) {
        updateValue(cachedData);
        return;
      }

      setLoading(true);
      const response = await fetch('/api/super-admin/organismes-stats');

      if (!response.ok) {
        console.warn(`Erreur HTTP ${response.status}: ${response.statusText}`);
        setValue(fallback || 0);
        return;
      }

      const result = await response.json();

      if (result.success) {
        cachedData = result.data;
        cacheTimestamp = now;
        updateValue(result.data);
      } else {
        console.warn('Erreur API badge:', result.error || 'Erreur inconnue');
        setValue(fallback || 0);
      }
    } catch (error) {
      console.error('Erreur chargement badge:', error);
      setValue(fallback || 0);
    } finally {
      setLoading(false);
    }
  };

  const updateValue = (data: OrganismesStatsData) => {
    switch (type) {
      case 'prospects':
        setValue(data.overview.prospectsCount);
        break;
      case 'clients':
        setValue(data.overview.clientsCount);
        break;
      case 'relations':
        setValue(data.overview.relationsCount);
        break;
      default:
        setValue(fallback || 0);
    }
  };

  if (loading && value === null) {
    return (
      <Badge variant="outline" className="animate-pulse">
        <div className="w-4 h-3 bg-gray-300 rounded"></div>
      </Badge>
    );
  }

  if (value === null) {
    return null; // Pas de badge si pas de données
  }

  // Formatage du nombre
  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  return (
    <Badge
      variant="secondary"
      className="ml-2 bg-blue-100 text-blue-700 hover:bg-blue-200"
      title={`${value} ${type} (données temps réel)`}
    >
      {formatNumber(value)}
    </Badge>
  );
}

// Hook pour pré-charger les données de badges
export function useDynamicBadges() {
  useEffect(() => {
    // Pré-charger les données dès le montage du sidebar
    const preloadData = async () => {
      try {
        const response = await fetch('/api/super-admin/organismes-stats');

        if (!response.ok) {
          console.warn(`Échec pré-chargement badges - HTTP ${response.status}: ${response.statusText}`);
          return;
        }

        const result = await response.json();
        if (result.success) {
          cachedData = result.data;
          cacheTimestamp = Date.now();
        } else {
          console.warn('Échec pré-chargement badges:', result.error || 'Erreur inconnue');
        }
      } catch (error) {
        console.warn('Échec pré-chargement badges:', error);
      }
    };

    preloadData();
  }, []);
}
