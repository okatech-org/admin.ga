/* @ts-nocheck */
import {
  Building2,
  Users,
  Shield,
  Scale,
  Heart,
  Stethoscope,
  BookOpen,
  GraduationCap,
  Wrench,
  TrendingUp,
  Receipt,
  Truck,
  Car,
  Home,
  Briefcase,
  Search,
  Leaf,
  Trees,
  Wheat,
  Radio,
  Palette,
  Anchor,
  Gavel,
  Calculator,
  Cross,
  Hammer
} from 'lucide-react';

export interface OrganismeDetaille {
  code: string;
  nom: string;
  description: string;
  icon: any;
  color: string;
  comptes: number;
  services: number;
  url: string;
  type: string;
  localisation?: string;
  comptesDisponibles?: Array<{
    titre: string;
    email: string;
    role: string;
    description: string;
  }>;
}

// Données détaillées des organismes principaux (synchronisées avec la page de connexion)
export const ORGANISMES_DETAILLES: Record<string, OrganismeDetaille> = {
  // Services Régaliens
  'DGDI': {
    code: 'DGDI',
    nom: 'Direction Générale de la Documentation et de l\'Immigration',
    description: 'CNI, Passeports, Immigration',
    icon: Shield,
    color: 'bg-blue-600',
    comptes: 2,
    services: 15,
    url: '/dgdi',
    type: 'DIRECTION_GENERALE',
    localisation: 'Libreville',
    comptesDisponibles: [
      {
        titre: 'Directeur Général',
        email: 'directeur@dgdi.ga',
        role: 'ADMIN',
        description: 'Accès complet DGDI'
      },
      {
        titre: 'Chef de Service Immigration',
        email: 'immigration@dgdi.ga',
        role: 'MANAGER',
        description: 'Gestion services immigration'
      }
    ]
  },
  'MIN_JUSTICE': {
    code: 'MIN_JUSTICE',
    nom: 'Ministère de la Justice',
    description: 'Justice, Casier judiciaire',
    icon: Scale,
    color: 'bg-purple-600',
    comptes: 4,
    services: 12,
    url: '/min-justice',
    type: 'MINISTERE',
    localisation: 'Libreville',
    comptesDisponibles: [
      {
        titre: 'Ministre de la Justice',
        email: 'ministre@justice.ga',
        role: 'ADMIN',
        description: 'Accès ministériel complet'
      },
      {
        titre: 'Directeur des Affaires Civiles',
        email: 'civil@justice.ga',
        role: 'MANAGER',
        description: 'Gestion affaires civiles'
      },
      {
        titre: 'Directeur des Affaires Pénales',
        email: 'penal@justice.ga',
        role: 'MANAGER',
        description: 'Gestion affaires pénales'
      },
      {
        titre: 'Agent Casier Judiciaire',
        email: 'casier@justice.ga',
        role: 'AGENT',
        description: 'Gestion casiers judiciaires'
      }
    ]
  },
  'MIN_INT_SEC': {
    code: 'MIN_INT_SEC',
    nom: 'Ministère de l\'Intérieur et de la Sécurité',
    description: 'Sécurité, Administration territoriale',
    icon: Building2,
    color: 'bg-gray-700',
    comptes: 3,
    services: 8,
    url: '/min-interieur',
    type: 'MINISTERE',
    localisation: 'Libreville'
  },
  'MIN_DEF_NAT': {
    code: 'MIN_DEF_NAT',
    nom: 'Ministère de la Défense Nationale',
    description: 'Service militaire, Anciens combattants',
    icon: Shield,
    color: 'bg-green-800',
    comptes: 2,
    services: 5,
    url: '/min-defense',
    type: 'MINISTERE',
    localisation: 'Libreville'
  },

  // Services Sociaux
  'CNSS': {
    code: 'CNSS',
    nom: 'Caisse Nationale de Sécurité Sociale',
    description: 'Sécurité sociale, Retraites',
    icon: Heart,
    color: 'bg-green-600',
    comptes: 3,
    services: 14,
    url: '/cnss',
    type: 'ORGANISME_SOCIAL',
    localisation: 'Libreville',
    comptesDisponibles: [
      {
        titre: 'Directeur Général CNSS',
        email: 'dg@cnss.ga',
        role: 'ADMIN',
        description: 'Direction générale CNSS'
      },
      {
        titre: 'Responsable Prestations',
        email: 'prestations@cnss.ga',
        role: 'MANAGER',
        description: 'Gestion des prestations'
      },
      {
        titre: 'Agent Sécurité Sociale',
        email: 'agent@cnss.ga',
        role: 'AGENT',
        description: 'Services aux assurés'
      }
    ]
  },
  'CNAMGS': {
    code: 'CNAMGS',
    nom: 'Caisse Nationale d\'Assurance Maladie et de Garantie Sociale',
    description: 'Assurance maladie universelle',
    icon: Stethoscope,
    color: 'bg-red-600',
    comptes: 2,
    services: 10,
    url: '/cnamgs',
    type: 'ORGANISME_SOCIAL',
    localisation: 'Libreville'
  },
  'MIN_SANTE': {
    code: 'MIN_SANTE',
    nom: 'Ministère de la Santé',
    description: 'Santé publique, Hôpitaux',
    icon: Cross,
    color: 'bg-red-500',
    comptes: 4,
    services: 11,
    url: '/min-sante',
    type: 'MINISTERE',
    localisation: 'Libreville',
    comptesDisponibles: [
      {
        titre: 'Ministre de la Santé',
        email: 'ministre@sante.ga',
        role: 'ADMIN',
        description: 'Direction ministérielle santé'
      },
      {
        titre: 'Directeur Hôpitaux',
        email: 'hopitaux@sante.ga',
        role: 'MANAGER',
        description: 'Gestion réseau hospitalier'
      },
      {
        titre: 'Directeur Santé Publique',
        email: 'public@sante.ga',
        role: 'MANAGER',
        description: 'Politiques de santé publique'
      },
      {
        titre: 'Agent Vaccination',
        email: 'vaccination@sante.ga',
        role: 'AGENT',
        description: 'Programme de vaccination'
      }
    ]
  },

  // Éducation
  'MIN_EDUC_NAT': {
    code: 'MIN_EDUC_NAT',
    nom: 'Ministère de l\'Éducation Nationale',
    description: 'Éducation, Diplômes',
    icon: BookOpen,
    color: 'bg-indigo-600',
    comptes: 2,
    services: 13,
    url: '/min-education',
    type: 'MINISTERE',
    localisation: 'Libreville'
  },
  'MIN_ENS_SUP': {
    code: 'MIN_ENS_SUP',
    nom: 'Ministère de l\'Enseignement Supérieur',
    description: 'Universités, Recherche',
    icon: GraduationCap,
    color: 'bg-blue-700',
    comptes: 2,
    services: 7,
    url: '/min-enseignement-sup',
    type: 'MINISTERE',
    localisation: 'Libreville'
  },

  // Économie
  'MIN_ECO_FIN': {
    code: 'MIN_ECO_FIN',
    nom: 'Ministère de l\'Économie et des Finances',
    description: 'Commerce, Entreprises, Budget',
    icon: TrendingUp,
    color: 'bg-emerald-600',
    comptes: 3,
    services: 15,
    url: '/min-economie',
    type: 'MINISTERE',
    localisation: 'Libreville'
  },
  'DGI': {
    code: 'DGI',
    nom: 'Direction Générale des Impôts',
    description: 'Fiscalité, Impôts',
    icon: Receipt,
    color: 'bg-amber-600',
    comptes: 4,
    services: 12,
    url: '/dgi',
    type: 'DIRECTION_GENERALE',
    localisation: 'Libreville',
    comptesDisponibles: [
      {
        titre: 'Directeur Général des Impôts',
        email: 'dg@dgi.ga',
        role: 'ADMIN',
        description: 'Direction générale fiscalité'
      },
      {
        titre: 'Inspecteur Fiscal',
        email: 'inspecteur@dgi.ga',
        role: 'MANAGER',
        description: 'Contrôle et vérification fiscale'
      },
      {
        titre: 'Agent des Impôts',
        email: 'agent@dgi.ga',
        role: 'AGENT',
        description: 'Services aux contribuables'
      },
      {
        titre: 'Percepteur',
        email: 'percepteur@dgi.ga',
        role: 'AGENT',
        description: 'Recouvrement des impôts'
      }
    ]
  },
  'DOUANES': {
    code: 'DOUANES',
    nom: 'Direction Générale des Douanes',
    description: 'Commerce international, Transit',
    icon: Truck,
    color: 'bg-blue-800',
    comptes: 3,
    services: 8,
    url: '/douanes',
    type: 'DIRECTION_GENERALE',
    localisation: 'Libreville'
  },

  // Transport
  'MIN_TRANSP': {
    code: 'MIN_TRANSP',
    nom: 'Ministère des Transports',
    description: 'Permis de conduire, Véhicules',
    icon: Car,
    color: 'bg-orange-600',
    comptes: 3,
    services: 11,
    url: '/min-transport',
    type: 'MINISTERE',
    localisation: 'Libreville'
  },

  // Habitat
  'MIN_HABIT_URB': {
    code: 'MIN_HABIT_URB',
    nom: 'Ministère de l\'Habitat et de l\'Urbanisme',
    description: 'Logement, Urbanisme',
    icon: Home,
    color: 'bg-lime-600',
    comptes: 3,
    services: 9,
    url: '/min-habitat',
    type: 'MINISTERE',
    localisation: 'Libreville'
  },

  // Travail
  'MIN_TRAV_EMPL': {
    code: 'MIN_TRAV_EMPL',
    nom: 'Ministère du Travail et de l\'Emploi',
    description: 'Emploi, Relations sociales',
    icon: Briefcase,
    color: 'bg-cyan-600',
    comptes: 3,
    services: 10,
    url: '/min-travail',
    type: 'MINISTERE',
    localisation: 'Libreville'
  },

  // Environnement
  'MIN_ENV_CLIM': {
    code: 'MIN_ENV_CLIM',
    nom: 'Ministère de l\'Environnement et du Climat',
    description: 'Protection environnementale',
    icon: Leaf,
    color: 'bg-green-700',
    comptes: 2,
    services: 6,
    url: '/min-environnement',
    type: 'MINISTERE',
    localisation: 'Libreville'
  },
  'MIN_EAUX_FOR': {
    code: 'MIN_EAUX_FOR',
    nom: 'Ministère des Eaux et Forêts',
    description: 'Ressources forestières',
    icon: Trees,
    color: 'bg-emerald-700',
    comptes: 2,
    services: 5,
    url: '/min-eaux-forets',
    type: 'MINISTERE',
    localisation: 'Libreville'
  },
  'MIN_AGR_ELEV': {
    code: 'MIN_AGR_ELEV',
    nom: 'Ministère de l\'Agriculture et de l\'Élevage',
    description: 'Agriculture, Élevage',
    icon: Wheat,
    color: 'bg-yellow-700',
    comptes: 3,
    services: 8,
    url: '/min-agriculture',
    type: 'MINISTERE',
    localisation: 'Libreville'
  },

  // Communication
  'MIN_NUM_POST': {
    code: 'MIN_NUM_POST',
    nom: 'Ministère du Numérique et des Postes',
    description: 'Télécommunications, Services postaux',
    icon: Radio,
    color: 'bg-purple-700',
    comptes: 2,
    services: 5,
    url: '/min-numerique',
    type: 'MINISTERE',
    localisation: 'Libreville'
  },

  // Culture
  'MIN_SPORT_CULT': {
    code: 'MIN_SPORT_CULT',
    nom: 'Ministère des Sports et de la Culture',
    description: 'Sports, Arts, Patrimoine culturel',
    icon: Palette,
    color: 'bg-rose-600',
    comptes: 2,
    services: 6,
    url: '/min-culture',
    type: 'MINISTERE',
    localisation: 'Libreville'
  },

  // Mairies
  'MAIRIE_LBV': {
    code: 'MAIRIE_LBV',
    nom: 'Mairie de Libreville',
    description: 'Services municipaux, État civil',
    icon: Building2,
    color: 'bg-blue-500',
    comptes: 5,
    services: 18,
    url: '/mairie-libreville',
    type: 'MAIRIE',
    localisation: 'Libreville',
    comptesDisponibles: [
      {
        titre: 'Maire de Libreville',
        email: 'maire@libreville.ga',
        role: 'ADMIN',
        description: 'Direction municipale'
      },
      {
        titre: 'Adjoint au Maire',
        email: 'adjoint@libreville.ga',
        role: 'MANAGER',
        description: 'Adjoint maire délégations'
      },
      {
        titre: 'Chef Service État Civil',
        email: 'etatcivil@libreville.ga',
        role: 'MANAGER',
        description: 'Gestion état civil'
      },
      {
        titre: 'Agent État Civil',
        email: 'agent-civil@libreville.ga',
        role: 'AGENT',
        description: 'Services état civil citoyens'
      },
      {
        titre: 'Agent Urbanisme',
        email: 'urbanisme@libreville.ga',
        role: 'AGENT',
        description: 'Permis et autorisations'
      }
    ]
  },
  'MAIRIE_PG': {
    code: 'MAIRIE_PG',
    nom: 'Mairie de Port-Gentil',
    description: 'Services municipaux, Permis',
    icon: Anchor,
    color: 'bg-blue-800',
    comptes: 4,
    services: 14,
    url: '/mairie-port-gentil',
    type: 'MAIRIE',
    localisation: 'Port-Gentil'
  },

  // Préfectures
  'PREF_EST': {
    code: 'PREF_EST',
    nom: 'Préfecture de l\'Estuaire',
    description: 'Administration territoriale',
    icon: Building2,
    color: 'bg-gray-600',
    comptes: 3,
    services: 7,
    url: '/prefecture-estuaire',
    type: 'PREFECTURE',
    localisation: 'Libreville'
  }
};

/**
 * Récupère les détails d'un organisme par son code
 */
export function getOrganismeDetails(code: string): OrganismeDetaille | null {
  return ORGANISMES_DETAILLES[code] || null;
}

/**
 * Récupère tous les organismes détaillés
 */
export function getAllOrganismesDetails(): OrganismeDetaille[] {
  return Object.values(ORGANISMES_DETAILLES);
}

/**
 * Récupère les organismes détaillés par type
 */
export function getOrganismesDetailsByType(type: string): OrganismeDetaille[] {
  return Object.values(ORGANISMES_DETAILLES).filter(org => org.type === type);
}

/**
 * Vérifie si un organisme a des détails disponibles
 */
export function hasOrganismeDetails(code: string): boolean {
  return code in ORGANISMES_DETAILLES;
}
