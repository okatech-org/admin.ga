/* @ts-nocheck */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface DomainConfig {
  domain: string;
  title: string;
  primaryColor: string;
  organizationId?: string;
  features: {
    multipleLanguages: boolean;
    enabledLanguages: string[];
    maintenanceMode: boolean;
    enableRegistration: boolean;
    enableGuestAccess: boolean;
    enableAPIAccess: boolean;
  };
}

// Hook pour récupérer la configuration du domaine depuis les headers
export function useDomainConfig() {
  const [domainConfig, setDomainConfig] = useState<DomainConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Récupérer la configuration depuis les headers ou localStorage
    const loadDomainConfig = async () => {
      try {
        // D'abord essayer de récupérer depuis l'API
        const response = await fetch('/api/domain-config');
        if (response.ok) {
          const config = await response.json();
          setDomainConfig(config);
        } else {
          // Fallback : configuration par défaut pour demarche.ga
          const defaultConfig: DomainConfig = {
            domain: window.location.hostname,
            title: 'DEMARCHE.GA',
            primaryColor: '#2563eb',
            features: {
              multipleLanguages: true,
              enabledLanguages: ['fr', 'en'],
              maintenanceMode: false,
              enableRegistration: true,
              enableGuestAccess: false,
              enableAPIAccess: true,
            },
          };
          setDomainConfig(defaultConfig);
        }
      } catch (error) {
        console.error('Erreur lors du chargement de la configuration du domaine:', error);
        // Configuration par défaut en cas d'erreur
        setDomainConfig({
          domain: window.location.hostname,
          title: 'DEMARCHE.GA',
          primaryColor: '#2563eb',
          features: {
            multipleLanguages: false,
            enabledLanguages: ['fr'],
            maintenanceMode: false,
            enableRegistration: true,
            enableGuestAccess: false,
            enableAPIAccess: true,
          },
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadDomainConfig();
  }, []);

  // Fonction pour mettre à jour le thème dynamiquement
  const updateTheme = (config: DomainConfig) => {
    if (typeof document !== 'undefined') {
      // Mettre à jour les variables CSS
      document.documentElement.style.setProperty('--primary-color', config.primaryColor);

      // Mettre à jour le titre de la page
      document.title = config.title;

      // Mettre à jour la meta description si disponible
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', `Portail ${config.title} - Services administratifs en ligne`);
      }
    }
  };

  // Appliquer le thème quand la configuration change
  useEffect(() => {
    if (domainConfig) {
      updateTheme(domainConfig);
    }
  }, [domainConfig]);

  // Fonction pour vérifier si une fonctionnalité est activée
  const isFeatureEnabled = (featureName: keyof DomainConfig['features']): boolean => {
    return domainConfig?.features[featureName] || false;
  };

  // Fonction pour obtenir les langues disponibles
  const getAvailableLanguages = (): string[] => {
    return domainConfig?.features.enabledLanguages || ['fr'];
  };

  // Fonction pour vérifier si c'est un domaine d'organisation
  const isOrganizationDomain = (): boolean => {
    return !!domainConfig?.organizationId;
  };

  // Fonction pour obtenir l'URL de base de l'API
  const getApiBaseUrl = (): string => {
    if (!isFeatureEnabled('enableAPIAccess')) {
      return '';
    }
    return `/api`;
  };

  return {
    domainConfig,
    isLoading,
    isFeatureEnabled,
    getAvailableLanguages,
    isOrganizationDomain,
    getApiBaseUrl,
    updateTheme,
  };
}

// Hook pour la gestion des redirections basées sur le domaine
export function useDomainRedirection() {
  const { domainConfig, isLoading } = useDomainConfig();
  const router = useRouter();

  const redirectToOrganization = (organizationCode: string) => {
    if (domainConfig?.organizationId) {
      // Si nous sommes déjà sur un domaine d'organisation, rester ici
      return;
    }

    // Rediriger vers le sous-domaine de l'organisation
    const currentHost = window.location.hostname;
    const baseHost = currentHost.replace(/^[^.]+\./, ''); // Enlever le sous-domaine
    const newUrl = `https://${organizationCode}.${baseHost}${window.location.pathname}`;
    window.location.href = newUrl;
  };

  const redirectToMainDomain = () => {
    if (!domainConfig?.organizationId) {
      // Déjà sur le domaine principal
      return;
    }

    const currentHost = window.location.hostname;
    const baseHost = currentHost.replace(/^[^.]+\./, ''); // Enlever le sous-domaine
    const newUrl = `https://${baseHost}${window.location.pathname}`;
    window.location.href = newUrl;
  };

  return {
    redirectToOrganization,
    redirectToMainDomain,
    isLoading,
  };
}

// Hook pour la personnalisation de l'interface
export function useDomainCustomization() {
  const { domainConfig } = useDomainConfig();

  const getThemeColors = () => {
    if (!domainConfig) {
      return {
        primary: '#2563eb',
        primaryLight: '#3b82f6',
        primaryDark: '#1d4ed8',
      };
    }

    const primary = domainConfig.primaryColor;
    // Générer des variations de couleur
    const primaryLight = lightenColor(primary, 20);
    const primaryDark = darkenColor(primary, 20);

    return {
      primary,
      primaryLight,
      primaryDark,
    };
  };

  const getCustomCSS = () => {
    const colors = getThemeColors();
    return `
      :root {
        --color-primary: ${colors.primary};
        --color-primary-light: ${colors.primaryLight};
        --color-primary-dark: ${colors.primaryDark};
      }

      .btn-primary {
        background-color: var(--color-primary);
        border-color: var(--color-primary);
      }

      .btn-primary:hover {
        background-color: var(--color-primary-dark);
        border-color: var(--color-primary-dark);
      }

      .text-primary {
        color: var(--color-primary) !important;
      }

      .bg-primary {
        background-color: var(--color-primary) !important;
      }
    `;
  };

  return {
    domainConfig,
    getThemeColors,
    getCustomCSS,
  };
}

// Utilitaires pour manipuler les couleurs
function lightenColor(color: string, percent: number): string {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255))
    .toString(16).slice(1);
}

function darkenColor(color: string, percent: number): string {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) - amt;
  const G = (num >> 8 & 0x00FF) - amt;
  const B = (num & 0x0000FF) - amt;
  return '#' + (0x1000000 + (R > 255 ? 255 : R < 0 ? 0 : R) * 0x10000 +
    (G > 255 ? 255 : G < 0 ? 0 : G) * 0x100 +
    (B > 255 ? 255 : B < 0 ? 0 : B))
    .toString(16).slice(1);
}
