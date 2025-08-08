import { useState, useEffect, useCallback } from 'react';
import { DomainConfig, DomainStatus, ServerHealth } from '@/lib/types/domain-management';

interface UseDomainManagementOptions {
  autoRefresh?: boolean;
  refreshInterval?: number;
}

interface DomainManagementState {
  domains: DomainConfig[];
  loading: boolean;
  error: string | null;
  serverHealth: Record<string, ServerHealth>;
}

export function useDomainManagement(options: UseDomainManagementOptions = {}) {
  const { autoRefresh = false, refreshInterval = 30000 } = options;

  const [state, setState] = useState<DomainManagementState>({
    domains: [],
    loading: false,
    error: null,
    serverHealth: {}
  });

  // Charger la liste des domaines
  const loadDomains = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch('/api/domain-management?action=list');
      const data = await response.json();

      if (data.success) {
        setState(prev => ({
          ...prev,
          domains: data.data || [],
          loading: false
        }));
      } else {
        setState(prev => ({
          ...prev,
          error: data.error || 'Erreur lors du chargement des domaines',
          loading: false
        }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Erreur réseau lors du chargement des domaines',
        loading: false
      }));
    }
  }, []);

  // Configurer un nouveau domaine
  const setupDomain = useCallback(async (domainConfig: any) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch('/api/domain-management', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'setup_domain',
          domainConfig
        })
      });

      const data = await response.json();

      if (data.success) {
        await loadDomains(); // Recharger la liste
        return { success: true, domainId: data.data.domainId };
      } else {
        setState(prev => ({ ...prev, error: data.error, loading: false }));
        return { success: false, error: data.error };
      }
    } catch (error) {
      const errorMessage = 'Erreur lors de la configuration du domaine';
      setState(prev => ({ ...prev, error: errorMessage, loading: false }));
      return { success: false, error: errorMessage };
    }
  }, [loadDomains]);

  // Vérifier le DNS d'un domaine
  const verifyDNS = useCallback(async (domain: string, expectedIP: string) => {
    try {
      const response = await fetch('/api/domain-management', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'verify_dns',
          domain,
          expectedIP
        })
      });

      const data = await response.json();

      if (data.success) {
        if (data.data.verified) {
          await loadDomains(); // Recharger pour mettre à jour le statut
        }
        return { success: true, verified: data.data.verified };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      return { success: false, error: 'Erreur lors de la vérification DNS' };
    }
  }, [loadDomains]);

  // Provisionner SSL
  const provisionSSL = useCallback(async (domain: string, deploymentConfig: any) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch('/api/domain-management/ssl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          domain,
          deploymentConfig
        })
      });

      const data = await response.json();

      if (data.success) {
        await loadDomains(); // Recharger pour voir le certificat
        setState(prev => ({ ...prev, loading: false }));
        return { success: true, certificate: data.data.certificate };
      } else {
        setState(prev => ({ ...prev, error: data.error, loading: false }));
        return { success: false, error: data.error };
      }
    } catch (error) {
      const errorMessage = 'Erreur lors du provisioning SSL';
      setState(prev => ({ ...prev, error: errorMessage, loading: false }));
      return { success: false, error: errorMessage };
    }
  }, [loadDomains]);

  // Supprimer un domaine
  const deleteDomain = useCallback(async (domainId: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch(`/api/domain-management?domainId=${domainId}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        await loadDomains(); // Recharger la liste
        setState(prev => ({ ...prev, loading: false }));
        return { success: true };
      } else {
        setState(prev => ({ ...prev, error: data.error, loading: false }));
        return { success: false, error: data.error };
      }
    } catch (error) {
      const errorMessage = 'Erreur lors de la suppression du domaine';
      setState(prev => ({ ...prev, error: errorMessage, loading: false }));
      return { success: false, error: errorMessage };
    }
  }, [loadDomains]);

  // Obtenir la santé d'un serveur
  const getServerHealth = useCallback(async (serverId: string) => {
    try {
      const response = await fetch(`/api/domain-management?action=health&serverId=${serverId}`);
      const data = await response.json();

      if (data.success) {
        setState(prev => ({
          ...prev,
          serverHealth: {
            ...prev.serverHealth,
            [serverId]: data.data
          }
        }));
        return { success: true, health: data.data };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      return { success: false, error: 'Erreur lors de la récupération de la santé du serveur' };
    }
  }, []);

  // Déployer une application
  const deployApplication = useCallback(async (domainId: string, deploymentConfig: any) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch('/api/domain-management/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'deploy',
          domainId,
          deploymentConfig
        })
      });

      const data = await response.json();

      if (data.success) {
        await loadDomains(); // Recharger pour voir les changements
        setState(prev => ({ ...prev, loading: false }));
        return { success: true, deploymentId: data.data.deploymentId };
      } else {
        setState(prev => ({ ...prev, error: data.error, loading: false }));
        return { success: false, error: data.error };
      }
    } catch (error) {
      const errorMessage = 'Erreur lors du déploiement';
      setState(prev => ({ ...prev, error: errorMessage, loading: false }));
      return { success: false, error: errorMessage };
    }
  }, [loadDomains]);

  // Utilitaires
  const getDomainsByStatus = useCallback((status: DomainStatus) => {
    return state.domains.filter(domain => domain.status === status);
  }, [state.domains]);

  const getDomainsByApplication = useCallback((applicationId: string) => {
    return state.domains.filter(domain => domain.applicationId === applicationId);
  }, [state.domains]);

  const getActiveDomains = useCallback(() => {
    return getDomainsByStatus('active');
  }, [getDomainsByStatus]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Effet pour le chargement initial
  useEffect(() => {
    loadDomains();
  }, [loadDomains]);

  // Effet pour l'actualisation automatique
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      loadDomains();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, loadDomains]);

  return {
    // État
    domains: state.domains,
    loading: state.loading,
    error: state.error,
    serverHealth: state.serverHealth,

    // Actions
    loadDomains,
    setupDomain,
    verifyDNS,
    provisionSSL,
    deleteDomain,
    getServerHealth,
    deployApplication,
    clearError,

    // Utilitaires
    getDomainsByStatus,
    getDomainsByApplication,
    getActiveDomains,

    // Statistiques calculées
    stats: {
      total: state.domains.length,
      active: getDomainsByStatus('active').length,
      pending: getDomainsByStatus('pending').length,
      error: getDomainsByStatus('error').length,
      withSSL: state.domains.filter(d => d.sslCertificate?.status === 'active').length
    }
  };
}
