// Types pour l'architecture Multi-Tenant

export interface OrganismeMultiTenant {
  id: string;
  nom: string;
  slug: string; // unique, pour l'URL
  domaine_personnalise?: string; // optionnel
  date_creation: string;
  statut: 'actif' | 'suspendu' | 'desactive';

  // Personnalisation
  logo_url?: string;
  favicon_url?: string;
  couleur_primaire: string;
  couleur_secondaire: string;
  css_personnalise?: string;

  // Configuration
  config: {
    max_utilisateurs: number;
    fonctionnalites_actives: string[];
    langue_defaut: string;
  };

  // Pages personnalisées
  pages_personnalisees: {
    message_bienvenue: string;
    contenu_accueil: string;
    pied_page: string;
  };

  // Intégrations
  integrations: {
    sso_actif: boolean;
    api_publique_activee: boolean;
    webhooks_actifs: boolean;
    cles_api?: {
      cle_publique: string;
      cle_secrete: string;
    };
  };
}

export interface UtilisateurMultiTenant {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  organisme_id: string;
  role: 'admin_organisme' | 'membre' | 'invite';
  date_inscription: string;
  dernier_connexion?: string;
  actif: boolean;
  preferences: {
    langue: string;
    notifications: boolean;
    theme: 'light' | 'dark' | 'auto';
  };
}

export interface DomaineOrganisme {
  id: string;
  domaine: string; // unique
  organisme_id: string;
  verifie: boolean;
  ssl_actif: boolean;
  date_ajout: string;
  verification_txt?: string;
}

// Types pour la gestion des sessions multi-tenant
export interface SessionMultiTenant {
  utilisateur_id: string;
  organisme_id: string;
  organisme_slug: string;
  role: string;
  domaine_acces: string; // domaine utilisé pour l'accès
  ip_connexion: string;
  user_agent: string;
  date_connexion: string;
  expire_a: string;
}

// Types pour la configuration des routes
export interface ConfigurationRoute {
  organisme_id: string;
  type_acces: 'domaine_personnalise' | 'sous_domaine' | 'chemin_url';
  valeur: string; // exemple.com | exemple.administration.ga | /org/exemple
  actif: boolean;
  priorite: number;
}

// Types pour les templates personnalisables
export interface TemplatePersonnalise {
  id: string;
  organisme_id: string;
  type: 'page_accueil' | 'page_connexion' | 'dashboard' | 'email';
  nom: string;
  contenu_html: string;
  variables_disponibles: string[];
  actif: boolean;
  date_creation: string;
  date_modification: string;
}

// Types pour les webhooks
export interface WebhookConfiguration {
  id: string;
  organisme_id: string;
  url: string;
  evenements: string[]; // ['user.created', 'user.login', 'data.export']
  secret: string;
  actif: boolean;
  dernier_envoi?: string;
  statut_dernier_envoi?: 'success' | 'error';
  nombre_tentatives_max: number;
}

// Types pour les limites et quotas
export interface LimitesOrganisme {
  organisme_id: string;
  max_utilisateurs: number;
  max_stockage_mo: number;
  max_requetes_api_par_heure: number;
  fonctionnalites_actives: string[];
  plan: 'gratuit' | 'starter' | 'business' | 'enterprise';
  date_expiration_plan?: string;
}

// Types pour les analytics par organisme
export interface AnalyticsOrganisme {
  organisme_id: string;
  periode: string; // 'jour' | 'semaine' | 'mois'
  date: string;
  metriques: {
    utilisateurs_actifs: number;
    connexions_total: number;
    requetes_api: number;
    stockage_utilise_mo: number;
    temps_reponse_moyen_ms: number;
  };
}

// Types pour l'export de données (RGPD)
export interface ExportDonnees {
  id: string;
  organisme_id: string;
  utilisateur_demandeur_id: string;
  type_export: 'complet' | 'utilisateurs' | 'logs' | 'analytics';
  statut: 'en_cours' | 'termine' | 'erreur';
  date_demande: string;
  date_completion?: string;
  url_telechargement?: string;
  taille_fichier_mo?: number;
  expire_a: string;
}

// Types pour la facturation multi-tenant
export interface FacturationOrganisme {
  id: string;
  organisme_id: string;
  plan: string;
  prix_mensuel: number;
  date_debut: string;
  date_fin?: string;
  statut: 'actif' | 'impaye' | 'suspendu' | 'annule';
  methode_paiement: {
    type: 'carte' | 'virement' | 'cheque';
    reference: string;
  };
  factures: {
    id: string;
    numero: string;
    date_emission: string;
    montant: number;
    statut: 'payee' | 'en_attente' | 'en_retard';
    url_pdf?: string;
  }[];
}

// Types pour la sauvegarde par organisme
export interface SauvegardeOrganisme {
  id: string;
  organisme_id: string;
  type: 'automatique' | 'manuelle';
  statut: 'en_cours' | 'termine' | 'erreur';
  date_creation: string;
  taille_mo: number;
  url_stockage: string;
  retention_jours: number;
  checksum: string;
}

// Types pour les notifications système
export interface NotificationSysteme {
  id: string;
  organisme_id?: string; // null = notification globale
  type: 'maintenance' | 'mise_a_jour' | 'facturation' | 'securite';
  titre: string;
  message: string;
  priorite: 'basse' | 'normale' | 'haute' | 'critique';
  date_creation: string;
  date_expiration?: string;
  lue: boolean;
  actions_disponibles?: {
    label: string;
    url: string;
    type: 'primary' | 'secondary';
  }[];
}
