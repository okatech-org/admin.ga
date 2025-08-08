/* @ts-nocheck */
import { z } from 'zod';

// Configuration des domaines pour DEMARCHE.GA
export interface DomainConfig {
  id: string;
  domain: string;
  subdomain?: string;
  organizationId?: string;
  organizationName?: string;
  isActive: boolean;
  isMainDomain: boolean;
  ssl: {
    enabled: boolean;
    certificate?: string;
    validUntil?: Date;
  };
  redirects: Array<{
    from: string;
    to: string;
    permanent: boolean;
  }>;
  customization: {
    primaryColor: string;
    logo?: string;
    favicon?: string;
    title: string;
    description: string;
  };
  features: {
    multipleLanguages: boolean;
    enabledLanguages: string[];
    maintenanceMode: boolean;
    enableRegistration: boolean;
    enableGuestAccess: boolean;
    enableAPIAccess: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Schema de validation pour les domaines
const domainSchema = z.object({
  domain: z.string().min(3, 'Le domaine doit contenir au moins 3 caractères').regex(
    /^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/,
    'Format de domaine invalide'
  ),
  subdomain: z.string().regex(/^[a-zA-Z0-9-]+$/, 'Format de sous-domaine invalide').optional(),
  organizationId: z.string().optional(),
  isActive: z.boolean().default(true),
  isMainDomain: z.boolean().default(false),
  customization: z.object({
    primaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Couleur hexadécimale invalide'),
    title: z.string().min(1, 'Titre requis'),
    description: z.string().min(1, 'Description requise'),
    logo: z.string().url().optional(),
    favicon: z.string().url().optional(),
  }),
  features: z.object({
    multipleLanguages: z.boolean().default(false),
    enabledLanguages: z.array(z.string()).default(['fr']),
    maintenanceMode: z.boolean().default(false),
    enableRegistration: z.boolean().default(true),
    enableGuestAccess: z.boolean().default(false),
    enableAPIAccess: z.boolean().default(true),
  }),
  ssl: z.object({
    enabled: z.boolean().default(true),
    certificate: z.string().optional(),
    validUntil: z.date().optional(),
  }).optional(),
  redirects: z.array(z.object({
    from: z.string().url(),
    to: z.string().url(),
    permanent: z.boolean().default(false),
  })).default([]),
});

export type DomainInput = z.infer<typeof domainSchema>;

// Configuration des domaines prédéfinis pour DEMARCHE.GA
export const DEFAULT_DOMAINS: DomainConfig[] = [
  {
    id: 'main-demarche-ga',
    domain: 'demarche.ga',
    isActive: true,
    isMainDomain: true,
    ssl: {
      enabled: true,
    },
    redirects: [
      {
        from: 'www.demarche.ga',
        to: 'demarche.ga',
        permanent: true,
      },
    ],
    customization: {
      primaryColor: '#2563eb',
      title: 'DEMARCHE.GA',
      description: 'Portail officiel des démarches administratives du Gabon',
      logo: '/images/logos/demarche-ga.png',
      favicon: '/images/favicons/demarche-ga.ico',
    },
    features: {
      multipleLanguages: true,
      enabledLanguages: ['fr', 'en'],
      maintenanceMode: false,
      enableRegistration: true,
      enableGuestAccess: false,
      enableAPIAccess: true,
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
  },
  {
    id: 'admin-demarche-ga',
    domain: 'admin.demarche.ga',
    isActive: true,
    isMainDomain: false,
    ssl: {
      enabled: true,
    },
    redirects: [],
    customization: {
      primaryColor: '#dc2626',
      title: 'Administration DEMARCHE.GA',
      description: 'Interface d\'administration pour DEMARCHE.GA',
      logo: '/images/logos/admin-demarche-ga.png',
      favicon: '/images/favicons/admin-demarche-ga.ico',
    },
    features: {
      multipleLanguages: false,
      enabledLanguages: ['fr'],
      maintenanceMode: false,
      enableRegistration: false,
      enableGuestAccess: false,
      enableAPIAccess: true,
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
  },
];

// Utilitaires pour la gestion des domaines
export class DomainConfigManager {
  private domains: Map<string, DomainConfig> = new Map();

  constructor() {
    // Charger les domaines par défaut
    DEFAULT_DOMAINS.forEach(domain => {
      this.domains.set(domain.domain, domain);
    });
  }

  // Obtenir la configuration d'un domaine
  getDomainConfig(domain: string): DomainConfig | null {
    return this.domains.get(domain) || null;
  }

  // Obtenir la configuration d'un sous-domaine
  getSubdomainConfig(subdomain: string, baseDomain: string): DomainConfig | null {
    const fullDomain = `${subdomain}.${baseDomain}`;
    return this.domains.get(fullDomain) || null;
  }

  // Ajouter ou mettre à jour une configuration de domaine
  setDomainConfig(domain: string, config: DomainConfig): void {
    this.domains.set(domain, {
      ...config,
      updatedAt: new Date(),
    });
  }

  // Supprimer une configuration de domaine
  removeDomainConfig(domain: string): boolean {
    return this.domains.delete(domain);
  }

  // Obtenir tous les domaines
  getAllDomains(): DomainConfig[] {
    return Array.from(this.domains.values());
  }

  // Obtenir les domaines actifs
  getActiveDomains(): DomainConfig[] {
    return this.getAllDomains().filter(domain => domain.isActive);
  }

  // Valider une configuration de domaine
  validateDomainConfig(data: any): { valid: boolean; errors?: string[] } {
    try {
      domainSchema.parse(data);
      return { valid: true };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          valid: false,
          errors: error.errors.map(err => `${err.path.join('.')}: ${err.message}`),
        };
      }
      return { valid: false, errors: ['Erreur de validation inconnue'] };
    }
  }

  // Vérifier si un domaine est déjà utilisé
  isDomainTaken(domain: string): boolean {
    return this.domains.has(domain);
  }

  // Obtenir le domaine principal
  getMainDomain(): DomainConfig | null {
    return this.getAllDomains().find(domain => domain.isMainDomain) || null;
  }

  // Générer un sous-domaine pour une organisation
  generateOrganizationSubdomain(organizationName: string, baseDomain: string = 'demarche.ga'): string {
    const cleanName = organizationName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    let subdomain = cleanName;
    let counter = 1;

    while (this.isDomainTaken(`${subdomain}.${baseDomain}`)) {
      subdomain = `${cleanName}-${counter}`;
      counter++;
    }

    return subdomain;
  }

  // Mettre à jour le statut SSL
  updateSSLStatus(domain: string, sslConfig: DomainConfig['ssl']): boolean {
    const config = this.getDomainConfig(domain);
    if (!config) return false;

    config.ssl = sslConfig;
    config.updatedAt = new Date();
    this.setDomainConfig(domain, config);
    return true;
  }

  // Activer/désactiver le mode maintenance
  toggleMaintenanceMode(domain: string, enabled: boolean): boolean {
    const config = this.getDomainConfig(domain);
    if (!config) return false;

    config.features.maintenanceMode = enabled;
    config.updatedAt = new Date();
    this.setDomainConfig(domain, config);
    return true;
  }
}

// Instance globale du gestionnaire de domaines
export const domainManager = new DomainConfigManager();

// Utilitaires de validation
export const validateDomain = (domain: string): boolean => {
  const domainRegex = /^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;
  return domainRegex.test(domain);
};

export const validateSubdomain = (subdomain: string): boolean => {
  const subdomainRegex = /^[a-zA-Z0-9-]+$/;
  return subdomainRegex.test(subdomain) && subdomain.length >= 3 && subdomain.length <= 63;
};

// Constantes pour la configuration
export const DOMAIN_CONSTANTS = {
  BASE_DOMAIN: 'demarche.ga',
  ADMIN_SUBDOMAIN: 'admin',
  API_SUBDOMAIN: 'api',
  CDN_SUBDOMAIN: 'cdn',
  DOCS_SUBDOMAIN: 'docs',
  MAX_SUBDOMAINS_PER_ORGANIZATION: 5,
  SSL_RENEWAL_DAYS: 30,
  MAINTENANCE_PAGE_PATH: '/maintenance',
  DEFAULT_COLORS: {
    PRIMARY: '#2563eb',
    SECONDARY: '#64748b',
    SUCCESS: '#10b981',
    WARNING: '#f59e0b',
    ERROR: '#ef4444',
  },
};
