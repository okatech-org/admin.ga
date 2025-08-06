// Types pour la structure administrative gabonaise

export enum NiveauHierarchique {
  NIVEAU_1 = 1, // Présidence, Primature
  NIVEAU_2 = 2, // Ministères
  NIVEAU_3 = 3, // Directions Générales
  NIVEAU_4 = 4, // Directions
  NIVEAU_5 = 5  // Services
}

export enum TypeOrganisme {
  PRESIDENCE = 'PRESIDENCE',
  PRIMATURE = 'PRIMATURE',
  MINISTERE = 'MINISTERE',
  DIRECTION_GENERALE = 'DIRECTION_GENERALE',
  DIRECTION = 'DIRECTION',
  SERVICE = 'SERVICE',
  AGENCE = 'AGENCE',
  MAIRIE = 'MAIRIE',
  PREFECTURE = 'PREFECTURE',
  PROVINCE = 'PROVINCE',
  AUTRE = 'AUTRE'
}

export enum StatutOrganisme {
  ACTIF = 'ACTIF',
  INACTIF = 'INACTIF',
  EN_CREATION = 'EN_CREATION',
  EN_RESTRUCTURATION = 'EN_RESTRUCTURATION'
}

export interface ResponsableOrganisme {
  nom: string;
  titre: string;
  email: string;
  telephone?: string;
  dateNomination?: string;
}

export interface EffectifsOrganisme {
  total: number;
  cadres: number;
  agentsExecution: number;
  contractuels?: number;
  stagiaires?: number;
}

export interface BudgetOrganisme {
  annuel: number;
  fonctionnement: number;
  investissement: number;
  devise: string;
}

export interface CoordonneesOrganisme {
  adresse: string;
  ville: string;
  province?: string;
  codePostal?: string;
  telephone?: string;
  email?: string;
  siteWeb?: string;
  latitude?: number;
  longitude?: number;
}

export interface OrganismeAdministratif {
  id: string;
  code: string;
  nom: string;
  sigle?: string;
  type: TypeOrganisme;
  niveau: NiveauHierarchique;
  parentId?: string;
  parent?: OrganismeAdministratif;
  enfants?: OrganismeAdministratif[];
  statut: StatutOrganisme;
  mission: string;
  attributions: string[];
  responsable?: ResponsableOrganisme;
  effectifs?: EffectifsOrganisme;
  budget?: BudgetOrganisme;
  coordonnees?: CoordonneesOrganisme;
  province?: string;
  dateCreation?: string;
  dateModification?: string;
  metadata?: Record<string, any>;
}

export interface StatistiquesStructure {
  total_organismes: number;
  organismes_actifs: number;
  organismes_inactifs: number;
  niveau_1: number;
  niveau_2: number;
  niveau_3: number;
  niveau_4: number;
  niveau_5: number;
  total_effectifs: number;
  total_cadres: number;
  total_agents: number;
  postes_vacants: number;
  taux_occupation: number;
  budget_total?: number;
  croissance_mensuelle: number;
}

export interface FiltresStructure {
  niveaux: NiveauHierarchique[];
  types: TypeOrganisme[];
  statuts: StatutOrganisme[];
  provinces: string[];
  searchTerm: string;
  parentId?: string;
}

export interface ResultatRecherche {
  organismes: OrganismeAdministratif[];
  total: number;
  page: number;
  limit: number;
}

export interface AuditStructure {
  date: string;
  anomalies: Array<{
    type: string;
    organisme: string;
    description: string;
    severite: 'FAIBLE' | 'MOYENNE' | 'ELEVEE';
  }>;
  recommandations: string[];
  statistiques: StatistiquesStructure;
}

export interface CreationOrganismeData {
  code: string;
  nom: string;
  sigle?: string;
  type: TypeOrganisme;
  niveau: NiveauHierarchique;
  parentId?: string;
  mission: string;
  attributions: string[];
  responsable?: ResponsableOrganisme;
  effectifs?: EffectifsOrganisme;
  budget?: BudgetOrganisme;
  coordonnees?: CoordonneesOrganisme;
}

export interface ModificationOrganismeData extends Partial<CreationOrganismeData> {
  id: string;
  statut?: StatutOrganisme;
}
