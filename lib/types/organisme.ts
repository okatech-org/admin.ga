// Types pour la gestion commerciale des organismes

export type OrganismeStatus = 'PROSPECT' | 'CLIENT';

export type TypeContrat = 'STANDARD' | 'PREMIUM' | 'ENTERPRISE' | 'GOUVERNEMENTAL';

export interface ContratInfo {
  id: string;
  type: TypeContrat;
  dateSignature: string;
  dateExpiration: string;
  montantAnnuel: number;
  servicesInclus: string[];
  responsableCommercial: string;
  conditions: string;
  statut: 'ACTIF' | 'EXPIRE' | 'SUSPENDU';
}

export interface OrganismeCommercial {
  id: string;
  code: string;
  nom: string;
  type: string;
  localisation: string;

  // Statut commercial
  status: OrganismeStatus;
  dateAjout: string;

  // Informations prospect
  prospectInfo?: {
    source: 'REFERENCEMENT' | 'DEMANDE_DIRECTE' | 'RECOMMANDATION';
    priorite: 'HAUTE' | 'MOYENNE' | 'BASSE';
    notes: string;
    dernierContact: string;
    responsableProspection: string;
  };

  // Informations client
  clientInfo?: ContratInfo;

  // Métriques
  stats: {
    totalUsers: number;
    totalServices: number;
    totalPostes: number;
    activeUsers: number;
    chiffreAffaires?: number; // Pour les clients
  };

  // Relations
  services: string[];
  users: any[];
  postes: any[];
  contact: {
    telephone?: string;
    email?: string;
    adresse?: string;
    responsable?: string;
  };
}

// Types pour les actions commerciales
export interface ConversionProspectData {
  organismeId: string;
  typeContrat: TypeContrat;
  montantAnnuel: number;
  dureeContrat: number; // en mois
  servicesSelectionnes: string[];
  responsableCommercial: string;
  dateSignature: string;
  conditions: string;
}

// Types pour les statistiques commerciales
export interface StatistiquesCommerciales {
  prospects: {
    total: number;
    parPriorite: { haute: number; moyenne: number; basse: number };
    parSource: { referencement: number; demande: number; recommandation: number };
    conversionRate: number; // %
  };
  clients: {
    total: number;
    parType: { standard: number; premium: number; enterprise: number; gouvernemental: number };
    chiffreAffairesTotal: number;
    chiffreAffairesMoyen: number;
    tauxRenouvellement: number; // %
  };
  conversions: {
    totalMois: number;
    objectifMois: number;
    pipeline: number; // prospects qualifiés
  };
}
