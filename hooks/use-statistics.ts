'use client';

import { useState, useEffect, useCallback } from 'react';

interface UseStatisticsOptions {
  refreshInterval?: number; // en millisecondes
  autoRefresh?: boolean;
}

interface StatisticsState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

// Hook générique pour charger les statistiques
export function useStatistics<T>(
  endpoint: string,
  options: UseStatisticsOptions = {}
) {
  const { refreshInterval = 5 * 60 * 1000, autoRefresh = false } = options;

  const [state, setState] = useState<StatisticsState<T>>({
    data: null,
    loading: true,
    error: null,
    lastUpdated: null
  });

  const fetchData = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const response = await fetch(endpoint);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erreur lors du chargement des données');
      }

      if (result.success) {
        setState({
          data: result.data,
          loading: false,
          error: null,
          lastUpdated: new Date()
        });
      } else {
        throw new Error(result.error || 'Réponse invalide du serveur');
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      }));
    }
  }, [endpoint]);

  // Chargement initial
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(fetchData, refreshInterval);
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, fetchData]);

  return {
    ...state,
    refresh: fetchData
  };
}

// Hooks spécialisés pour chaque type de statistiques
export function useOrganismesStats(options?: UseStatisticsOptions) {
  return useStatistics('/api/super-admin/stats/organismes', options);
}

export function usePostesStats(options?: UseStatisticsOptions) {
  return useStatistics('/api/super-admin/stats/postes', options);
}

export function useUtilisateursStats(options?: UseStatisticsOptions) {
  return useStatistics('/api/super-admin/stats/utilisateurs', options);
}

export function useServicesStats(options?: UseStatisticsOptions) {
  return useStatistics('/api/super-admin/stats/services', options);
}

export function useRelationsStats(options?: UseStatisticsOptions) {
  return useStatistics('/api/super-admin/stats/relations', options);
}

export function useSyntheseStats(options?: UseStatisticsOptions) {
  return useStatistics('/api/super-admin/stats/synthese', options);
}

// Hook pour charger plusieurs statistiques en parallèle
export function useMultipleStats(endpoints: string[], options?: UseStatisticsOptions) {
  const [states, setStates] = useState<Record<string, StatisticsState<any>>>({});

  const fetchAllData = useCallback(async () => {
    const updates: Record<string, StatisticsState<any>> = {};

    // Initialiser l'état loading pour tous les endpoints
    endpoints.forEach(endpoint => {
      updates[endpoint] = {
        data: states[endpoint]?.data || null,
        loading: true,
        error: null,
        lastUpdated: states[endpoint]?.lastUpdated || null
      };
    });
    setStates(prev => ({ ...prev, ...updates }));

    // Charger toutes les données en parallèle
    const promises = endpoints.map(async (endpoint) => {
      try {
        const response = await fetch(endpoint);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Erreur lors du chargement');
        }

        return {
          endpoint,
          data: result.success ? result.data : null,
          error: result.success ? null : (result.error || 'Réponse invalide')
        };
      } catch (error) {
        return {
          endpoint,
          data: null,
          error: error instanceof Error ? error.message : 'Erreur inconnue'
        };
      }
    });

    const results = await Promise.all(promises);

    // Mettre à jour les états
    const finalUpdates: Record<string, StatisticsState<any>> = {};
    results.forEach(({ endpoint, data, error }) => {
      finalUpdates[endpoint] = {
        data,
        loading: false,
        error,
        lastUpdated: error ? states[endpoint]?.lastUpdated || null : new Date()
      };
    });

    setStates(prev => ({ ...prev, ...finalUpdates }));
  }, [endpoints, states]);

  useEffect(() => {
    fetchAllData();
  }, []);

  // Auto-refresh
  useEffect(() => {
    if (!options?.autoRefresh) return;

    const interval = setInterval(fetchAllData, options.refreshInterval || 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [options?.autoRefresh, options?.refreshInterval, fetchAllData]);

  return {
    states,
    loading: Object.values(states).some(state => state.loading),
    error: Object.values(states).find(state => state.error)?.error || null,
    refresh: fetchAllData
  };
}

// Hook pour les statistiques du dashboard principal
export function useDashboardStats(options?: UseStatisticsOptions) {
  return useMultipleStats([
    '/api/super-admin/stats/synthese',
    '/api/super-admin/stats/organismes',
    '/api/super-admin/stats/utilisateurs'
  ], { autoRefresh: true, refreshInterval: 2 * 60 * 1000, ...options });
}
