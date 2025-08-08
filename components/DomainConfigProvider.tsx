/* @ts-nocheck */
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface DomainConfig {
  domain: string;
  title: string;
  description: string;
  primaryColor: string;
  logo?: string;
  favicon?: string;
  organizationId?: string;
  organizationName?: string;
  features: {
    multipleLanguages: boolean;
    enabledLanguages: string[];
    maintenanceMode: boolean;
    enableRegistration: boolean;
    enableGuestAccess: boolean;
    enableAPIAccess: boolean;
  };
  isActive: boolean;
  isMainDomain: boolean;
  ssl: {
    enabled: boolean;
  };
}

interface DomainConfigContextType {
  config: DomainConfig | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const DomainConfigContext = createContext<DomainConfigContextType>({
  config: null,
  isLoading: true,
  error: null,
  refetch: async () => {},
});

export function useDomainConfig() {
  const context = useContext(DomainConfigContext);
  if (!context) {
    throw new Error('useDomainConfig must be used within a DomainConfigProvider');
  }
  return context;
}

interface DomainConfigProviderProps {
  children: React.ReactNode;
}

export function DomainConfigProvider({ children }: DomainConfigProviderProps) {
  const [config, setConfig] = useState<DomainConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConfig = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/domain-config');
      if (!response.ok) {
        throw new Error('Erreur lors du chargement de la configuration');
      }

      const configData = await response.json();
      setConfig(configData);

      // Appliquer la configuration au DOM
      applyDomainConfig(configData);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      console.error('Erreur lors du chargement de la configuration du domaine:', err);

      // Configuration par défaut en cas d'erreur
      const defaultConfig: DomainConfig = {
        domain: window.location.hostname,
        title: 'DEMARCHE.GA',
        description: 'Portail des démarches administratives du Gabon',
        primaryColor: '#2563eb',
        features: {
          multipleLanguages: false,
          enabledLanguages: ['fr'],
          maintenanceMode: false,
          enableRegistration: true,
          enableGuestAccess: false,
          enableAPIAccess: true,
        },
        isActive: true,
        isMainDomain: true,
        ssl: { enabled: false },
      };
      setConfig(defaultConfig);
      applyDomainConfig(defaultConfig);
    } finally {
      setIsLoading(false);
    }
  };

  const applyDomainConfig = (configData: DomainConfig) => {
    if (typeof document === 'undefined') return;

    // Mettre à jour le titre de la page
    document.title = configData.title;

    // Mettre à jour les meta tags
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', configData.description);
    }

    // Mettre à jour le favicon si spécifié
    if (configData.favicon) {
      const faviconLink = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
      if (faviconLink) {
        faviconLink.href = configData.favicon;
      }
    }

    // Appliquer le thème de couleur
    const root = document.documentElement;
    root.style.setProperty('--domain-primary-color', configData.primaryColor);

    // Calculer les variations de couleur
    const primaryRgb = hexToRgb(configData.primaryColor);
    if (primaryRgb) {
      root.style.setProperty('--domain-primary-rgb', `${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}`);

      // Couleurs dérivées
      const lightColor = lightenColor(configData.primaryColor, 10);
      const darkColor = darkenColor(configData.primaryColor, 10);

      root.style.setProperty('--domain-primary-light', lightColor);
      root.style.setProperty('--domain-primary-dark', darkColor);
    }

    // Ajouter les styles personnalisés
    addCustomStyles(configData);
  };

  const addCustomStyles = (configData: DomainConfig) => {
    const existingStyle = document.getElementById('domain-custom-styles');
    if (existingStyle) {
      existingStyle.remove();
    }

    const style = document.createElement('style');
    style.id = 'domain-custom-styles';
    style.textContent = `
      .btn-primary {
        background-color: var(--domain-primary-color);
        border-color: var(--domain-primary-color);
      }

      .btn-primary:hover {
        background-color: var(--domain-primary-dark);
        border-color: var(--domain-primary-dark);
      }

      .text-primary {
        color: var(--domain-primary-color) !important;
      }

      .bg-primary {
        background-color: var(--domain-primary-color) !important;
      }

      .border-primary {
        border-color: var(--domain-primary-color) !important;
      }

      .domain-brand {
        color: var(--domain-primary-color);
      }

      .domain-logo {
        max-height: 40px;
        width: auto;
      }
    `;

    document.head.appendChild(style);
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const value: DomainConfigContextType = {
    config,
    isLoading,
    error,
    refetch: fetchConfig,
  };

  return (
    <DomainConfigContext.Provider value={value}>
      {children}
    </DomainConfigContext.Provider>
  );
}

// Utilitaires pour manipuler les couleurs
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

function lightenColor(color: string, percent: number): string {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = ((num >> 8) & 0x00ff) + amt;
  const B = (num & 0x0000ff) + amt;

  return (
    '#' +
    (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    )
      .toString(16)
      .slice(1)
  );
}

function darkenColor(color: string, percent: number): string {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) - amt;
  const G = ((num >> 8) & 0x00ff) - amt;
  const B = (num & 0x0000ff) - amt;

  return (
    '#' +
    (
      0x1000000 +
      (R > 255 ? 255 : R < 0 ? 0 : R) * 0x10000 +
      (G > 255 ? 255 : G < 0 ? 0 : G) * 0x100 +
      (B > 255 ? 255 : B < 0 ? 0 : B) * 0x255)
    )
      .toString(16)
      .slice(1)
  );
}
