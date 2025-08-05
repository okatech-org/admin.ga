// =============================================================================
// 🏛️ ADMINISTRATION.GA - Types de Configuration Complète d'Organisme
// =============================================================================

export type OrganismeType =
  | 'PRESIDENCE'
  | 'VICE_PRESIDENCE_REPUBLIQUE'
  | 'VICE_PRESIDENCE_GOUVERNEMENT'
  | 'MINISTERE_ETAT'
  | 'MINISTERE'
  | 'SECRETARIAT_GENERAL'
  | 'DIRECTION_GENERALE'
  | 'DIRECTION'
  | 'SERVICE'
  | 'GOUVERNORAT'
  | 'PREFECTURE'
  | 'MAIRIE'
  | 'ORGANISME_SOCIAL'
  | 'ETABLISSEMENT_PUBLIC'
  | 'AGENCE_NATIONALE'
  | 'CONSEIL_NATIONAL'
  | 'CABINET'
  | 'INSPECTION_GENERALE'
  | 'DIRECTION_CENTRALE_RH'
  | 'DIRECTION_CENTRALE_FINANCES'
  | 'DIRECTION_CENTRALE_SI'
  | 'DIRECTION_CENTRALE_JURIDIQUE'
  | 'DIRECTION_CENTRALE_COMMUNICATION'
  | 'INSTITUTION_SUPREME'
  | 'INSTITUTION_JUDICIAIRE'
  | 'POUVOIR_LEGISLATIF'
  | 'INSTITUTION_INDEPENDANTE'
  | 'AGENCE_SPECIALISEE';

export type StatutOrganisme = 'ACTIF' | 'INACTIF' | 'EN_TRANSITION' | 'DISSOUS';
export type GroupeAdministratif = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'L';
export type PouvoirPublic = 'EXECUTIF' | 'LEGISLATIF' | 'JUDICIAIRE';
export type CategorieAgent = 'A1' | 'A2' | 'B1' | 'B2' | 'C';
export type NiveauClassification = 'SECRET' | 'CONFIDENTIEL' | 'INTERNE' | 'PUBLIC';

// =============================================================================
// 🏢 CONFIGURATION PRINCIPALE D'ORGANISME
// =============================================================================

export interface ConfigurationOrganisme {
  // 1. Informations générales
  informations_generales: InformationsGenerales;

  // 2. Structure organisationnelle
  structure: StructureOrganisationnelle;

  // 3. Comptes et postes
  comptes_postes: ComptesEtPostes;

  // 4. Paramètres de configuration
  parametres: ParametresConfiguration;

  // 5. Personnalisation et branding
  branding: BrandingConfiguration;

  // 6. Fonctionnalités et modules
  modules: ModulesConfiguration;

  // 7. Gestion des accès
  acces: GestionAcces;

  // 8. Monitoring et rapports
  monitoring: MonitoringConfiguration;

  // 9. Processus et workflows
  workflows: WorkflowsConfiguration;

  // 10. Déploiement et maintenance
  deploiement: DeploiementConfiguration;

  // 11. Conformité et gouvernance
  conformite: ConformiteConfiguration;

  // Métadonnées
  version_config: string;
  date_creation: string;
  date_mise_a_jour: string;
  cree_par: string;
  modifie_par?: string;
}

// =============================================================================
// 📋 1. INFORMATIONS GÉNÉRALES
// =============================================================================

export interface InformationsGenerales {
  identification: {
    id: string;
    code: string;
    nom: string;
    nom_court: string;
    acronyme: string;
    type: OrganismeType;
    statut: StatutOrganisme;
    date_creation: string;
    numero_decret?: string;
  };

  hierarchie: {
    parent_id?: string;
    niveau: number; // 1=Présidence, 2=Ministère, 3=Direction, 4=Service, 5=Bureau
    groupe: GroupeAdministratif;
    pouvoir: PouvoirPublic;
  };

  localisation: {
    siege_principal: AdresseComplete;
    antennes_regionales?: AntenneRegionale[];
  };
}

export interface AdresseComplete {
  adresse: string;
  ville: string;
  province: string;
  code_postal?: string;
  coordonnees_gps?: {
    latitude: string;
    longitude: string;
  };
  telephone?: string;
  email?: string;
}

export interface AntenneRegionale {
  province: string;
  ville: string;
  responsable: string;
  adresse?: string;
  telephone?: string;
  email?: string;
}

// =============================================================================
// 🏗️ 2. STRUCTURE ORGANISATIONNELLE
// =============================================================================

export interface StructureOrganisationnelle {
  organigramme: {
    direction_generale: DirectionGenerale;
    directions_centrales: DirectionCentrale[];
  };

  effectifs: {
    total: number;
    repartition: {
      direction: number;
      encadrement: number;
      execution: number;
    };
    par_categorie: Record<CategorieAgent, number>;
  };
}

export interface DirectionGenerale {
  directeur_general: PosteDirection;
  cabinet_dg?: {
    chef_cabinet?: PosteDirection;
    conseillers_techniques?: PosteDirection[];
    secretariat_particulier?: PosteDirection;
  };
}

export interface DirectionCentrale {
  nom: string;
  sigle: string;
  services: string[];
  responsable?: PosteDirection;
}

export interface PosteDirection {
  titre: string;
  niveau: number;
  attributions?: string[];
  titulaire_actuel?: {
    nom: string;
    prenom: string;
    date_prise_fonction: string;
  };
}

// =============================================================================
// 👥 3. COMPTES ET POSTES
// =============================================================================

export interface ComptesEtPostes {
  postes_direction: PosteSensible[];
  postes_encadrement: PosteSensible[];
  comptes_techniques: CompteTechnique[];
}

export interface PosteSensible {
  code: string;
  titre: string;
  niveau_hierarchique: number;
  role_systeme: 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER' | 'AGENT' | 'USER';
  permissions_speciales: string[];
  compte: {
    username: string;
    type_authentification: string[];
    restrictions_acces?: {
      ip_whitelist?: string[];
      horaires_acces?: {
        debut: string;
        fin: string;
      };
      jours_autorises?: string[];
    };
  };
}

export interface CompteTechnique {
  code: string;
  titre: string;
  type: 'SERVICE_ACCOUNT' | 'SYSTEM_ACCOUNT' | 'API_ACCOUNT';
  permissions: string[];
  restrictions?: {
    ip_whitelist?: string[];
    rate_limit?: string;
    validite?: string;
  };
}

// =============================================================================
// ⚙️ 4. PARAMÈTRES DE CONFIGURATION
// =============================================================================

export interface ParametresConfiguration {
  generaux: ParametresGeneraux;
  securite: ParametresSecurite;
  notifications: ParametresNotifications;
}

export interface ParametresGeneraux {
  langue_principale: string;
  langues_secondaires: string[];
  fuseau_horaire: string;
  format_date: string;
  format_heure: string;
  devise: string;
  horaires_travail: {
    lundi_vendredi: {
      ouverture: string;
      fermeture: string;
    };
    samedi?: {
      ouverture: string;
      fermeture: string;
    };
    dimanche: 'FERME' | { ouverture: string; fermeture: string };
  };
}

export interface ParametresSecurite {
  authentification: {
    methodes_disponibles: string[];
    politique_mot_de_passe: {
      longueur_minimale: number;
      complexite: 'FAIBLE' | 'MOYENNE' | 'FORTE';
      expiration_jours: number;
      historique: number;
      tentatives_max: number;
      verrouillage_minutes: number;
    };
  };

  sessions: {
    duree_max_minutes: number;
    timeout_inactivite_minutes: number;
    sessions_simultanees_max: number;
  };

  audit: {
    actif: boolean;
    retention_jours: number;
    evenements_traces: string[];
  };
}

export interface ParametresNotifications {
  email: {
    actif: boolean;
    serveur_smtp: string;
    port: number;
    expediteur: string;
    templates: NotificationTemplate[];
  };

  sms?: {
    actif: boolean;
    provider: string;
    numero_expediteur: string;
  };

  push?: {
    actif: boolean;
    service: string;
  };
}

export interface NotificationTemplate {
  type: string;
  objet: string;
  template_path?: string;
  variables?: string[];
}

// =============================================================================
// 🎨 5. BRANDING ET PERSONNALISATION
// =============================================================================

export interface BrandingConfiguration {
  couleurs: {
    primaire: string;
    secondaire: string;
    accent: string;
    danger: string;
    succes: string;
    avertissement: string;
  };

  typographie: {
    police_principale: string;
    police_secondaire: string;
    taille_base: string;
  };

  logos: {
    principal: string;
    favicon: string;
    logo_email: string;
    logo_footer?: string;
  };

  theme: {
    mode: 'CLAIR' | 'SOMBRE' | 'AUTO';
    animations: boolean;
    effets_sonores: boolean;
  };

  interface: {
    layout: {
      type: 'SIDEBAR' | 'TOP_NAV' | 'COMBO';
      position_logo: 'TOP_LEFT' | 'TOP_CENTER' | 'TOP_RIGHT';
      largeur_sidebar: string;
      sidebar_repliable: boolean;
    };

    tableau_de_bord: {
      widgets_disponibles: string[];
      disposition_par_defaut: Record<string, string[]>;
    };
  };
}

// =============================================================================
// 📋 6. MODULES ET FONCTIONNALITÉS
// =============================================================================

export interface ModulesConfiguration {
  modules_base: {
    gestion_documentaire: ModuleDocumentaire;
    gestion_courrier: ModuleCourrier;
  };

  modules_avances: {
    e_services?: ModuleEServices;
    tableau_bord_citoyen?: ModuleTableauBordCitoyen;
    analytics?: ModuleAnalytics;
  };

  integrations: {
    api_gouvernementales?: ApiGouvernementale[];
    passerelles_paiement?: PasserellePaiement[];
  };
}

export interface ModuleDocumentaire {
  actif: boolean;
  stockage_max_gb: number;
  types_fichiers_autorises: string[];
  fonctionnalites: string[];
}

export interface ModuleCourrier {
  actif: boolean;
  numerotation_automatique: boolean;
  format_numero: string;
  types_courrier: string[];
  circuit_validation: Record<string, string>;
}

export interface ModuleEServices {
  actif: boolean;
  services_disponibles: ServiceDisponible[];
}

export interface ServiceDisponible {
  code: string;
  nom: string;
  delai_traitement_jours: number;
  frais: number;
  paiement_en_ligne: boolean;
  documents_requis?: string[];
}

export interface ModuleTableauBordCitoyen {
  actif: boolean;
  fonctionnalites: string[];
}

export interface ModuleAnalytics {
  actif: boolean;
  metriques: string[];
}

export interface ApiGouvernementale {
  nom: string;
  endpoint: string;
  authentification: 'API_KEY' | 'OAUTH2' | 'BASIC';
  permissions: string[];
  rate_limit?: string;
}

export interface PasserellePaiement {
  nom: string;
  actif: boolean;
  merchant_id: string;
  commission_pourcent: number;
  devise_supportees?: string[];
}

// =============================================================================
// 🔒 7. GESTION DES ACCÈS
// =============================================================================

export interface GestionAcces {
  roles: Record<string, RoleDefinition>;
  acces_donnees: Record<string, AccesDonnees>;
}

export interface RoleDefinition {
  description: string;
  permissions: string[];
  restrictions?: {
    horaires?: { debut: string; fin: string };
    jours?: string[];
    ip_whitelist?: string[];
  };
}

export interface AccesDonnees {
  niveau: NiveauClassification;
  roles_autorises: string[];
  authentification_requise: string[];
  audit: 'MINIMAL' | 'STANDARD' | 'COMPLET';
  duree_retention?: string;
}

// =============================================================================
// 📊 8. MONITORING ET RAPPORTS
// =============================================================================

export interface MonitoringConfiguration {
  kpi: {
    operationnels: IndicateurPerformance[];
    financiers: IndicateurPerformance[];
    techniques?: IndicateurPerformance[];
  };

  rapports: {
    quotidiens?: RapportAutomatique[];
    hebdomadaires?: RapportAutomatique[];
    mensuels?: RapportAutomatique[];
    trimestriels?: RapportAutomatique[];
  };

  alertes: {
    seuils_critiques: Record<string, any>;
    destinataires_alertes: string[];
    canaux_notification: string[];
  };
}

export interface IndicateurPerformance {
  nom: string;
  cible: string;
  calcul: string;
  frequence_calcul: 'TEMPS_REEL' | 'HORAIRE' | 'QUOTIDIEN' | 'HEBDOMADAIRE' | 'MENSUEL';
  unite?: string;
  seuil_alerte?: number;
}

export interface RapportAutomatique {
  nom: string;
  destinataires: string[];
  heure_envoi?: string;
  jour_envoi?: number;
  format: 'PDF' | 'EXCEL' | 'CSV' | 'JSON';
  contenu: string[];
  template_path?: string;
}

// =============================================================================
// 🔄 9. WORKFLOWS ET PROCESSUS
// =============================================================================

export interface WorkflowsConfiguration {
  workflows: Record<string, WorkflowDefinition>;
  regles_metier: Record<string, RegleMetier>;
}

export interface WorkflowDefinition {
  nom: string;
  description: string;
  etapes: EtapeWorkflow[];
  notifications: string[];
  escalade?: {
    delai_depassement_heures: number;
    destinataire_escalade: string;
    action_escalade: string;
  };
}

export interface EtapeWorkflow {
  nom: string;
  acteur: string;
  actions: string[];
  delai_max_jours?: number;
  conditions_passage?: string[];
  documents_requis?: string[];
}

export interface RegleMetier {
  nom: string;
  description: string;
  conditions: any;
  actions: any;
  exceptions?: any;
}

// =============================================================================
// 🚀 10. DÉPLOIEMENT ET MAINTENANCE
// =============================================================================

export interface DeploiementConfiguration {
  infrastructure: {
    serveurs: {
      production: ServeurConfiguration;
      backup?: ServeurConfiguration;
      test?: ServeurConfiguration;
    };
    reseau: {
      bande_passante_mbps: number;
      redondance: boolean;
      vpn_site_to_site: boolean;
      firewall: string;
    };
  };

  continuite_activite: {
    rto: string; // Recovery Time Objective
    rpo: string; // Recovery Point Objective
    procedures_urgence: Record<string, string[]>;
  };

  maintenance: {
    fenetre_maintenance: {
      jour: string;
      heure_debut: string;
      heure_fin: string;
    };
    frequence_mise_a_jour: 'HEBDOMADAIRE' | 'MENSUELLE' | 'TRIMESTRIELLE';
  };
}

export interface ServeurConfiguration {
  type: 'CLOUD' | 'ON_PREMISE' | 'HYBRID';
  provider?: string;
  region?: string;
  specifications: {
    cpu: string;
    ram: string;
    stockage: string;
  };
  localisation?: string;
  frequence_backup?: string;
  retention_jours?: number;
}

// =============================================================================
// 📝 11. CONFORMITÉ ET GOUVERNANCE
// =============================================================================

export interface ConformiteConfiguration {
  lois_applicables: string[];
  certifications: Certification[];
  gouvernance_donnees: {
    classification: ClassificationDonnees[];
    responsables: Record<string, string>;
  };
  audit_conformite: {
    frequence: 'MENSUELLE' | 'TRIMESTRIELLE' | 'SEMESTRIELLE' | 'ANNUELLE';
    auditeur_externe: boolean;
    rapport_conformite: boolean;
  };
}

export interface Certification {
  nom: string;
  date_obtention: string;
  validite_jusqu: string;
  organisme_certificateur: string;
  numero_certificat?: string;
}

export interface ClassificationDonnees {
  niveau: NiveauClassification;
  exemples: string[];
  duree_retention: string;
  acces: string;
  chiffrement_requis: boolean;
  backup_requis: boolean;
}

// =============================================================================
// ✅ 12. CHECKLIST ET VALIDATION
// =============================================================================

export interface ChecklistDeploiement {
  avant_deploiement: {
    [key: string]: boolean;
  };
  pendant_deploiement: {
    [key: string]: boolean;
  };
  apres_deploiement: {
    [key: string]: boolean;
  };
}

// =============================================================================
// 🛠️ UTILITAIRES ET HELPERS
// =============================================================================

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ValidationWarning {
  field: string;
  message: string;
  suggestion?: string;
}

// Fonctions utilitaires
export interface ConfigurationUtils {
  validateConfiguration(config: ConfigurationOrganisme): ValidationResult;
  generateDefaultConfiguration(organisme: any): ConfigurationOrganisme;
  exportConfiguration(config: ConfigurationOrganisme): string;
  importConfiguration(yamlContent: string): ConfigurationOrganisme;
}
