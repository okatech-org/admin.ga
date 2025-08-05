// =============================================================================
// 🏛️ ADMINISTRATION.GA - Types pour Gestion des Postes et Emploi Public
// =============================================================================

import type { UserRole } from '@/types/auth';

export type StatutPoste = 'OCCUPÉ' | 'VACANT' | 'EN_TRANSITION' | 'SUPPRIMÉ' | 'CRÉÉ';
export type NiveauHierarchique = 'DIRECTION' | 'ENCADREMENT' | 'EXÉCUTION';
export type TypeContrat = 'FONCTIONNAIRE' | 'CONTRACTUEL' | 'DÉTACHEMENT' | 'STAGE';
export type StatutFonctionnaire = 'ACTIF' | 'DISPONIBLE' | 'RETRAITÉ' | 'SUSPENDU' | 'EN_RECHERCHE';
export type TypeCompte = 'PERSONNEL' | 'FONCTIONNEL' | 'TEMPORAIRE';
export type PrioriteRecrutement = 'INTERNE' | 'EXTERNE' | 'MIXTE';

// =============================================================================
// 🏢 ORGANISME
// =============================================================================
export interface Organisme {
  id: string;
  code: string;
  nom: string;
  type: string;
  groupe: string;
  niveau_hierarchique: number;
  est_organisme_principal: boolean;

  // Localisation
  province?: string;
  ville?: string;
  adresse?: string;

  // Contact
  telephone?: string;
  email?: string;
  site_web?: string;

  // Hiérarchie
  organisme_parent_id?: string;
  organismes_enfants: string[];

  // Statistiques postes
  stats_postes: {
    total_postes: number;
    postes_occupés: number;
    postes_vacants: number;
    postes_en_transition: number;
  };

  // Métadonnées
  date_creation: string;
  date_mise_a_jour: string;
  responsable_rh?: string;
}

// =============================================================================
// 💼 POSTE / FONCTION
// =============================================================================
export interface Poste {
  id: string;
  organisme_id: string;

  // Définition du poste
  intitule: string;
  code_poste?: string;
  description: string;
  niveau_hierarchique: NiveauHierarchique;
  categorie: string; // A, B, C selon la fonction publique
  echelon?: number;
  indice_salarial?: number;

  // Statut et disponibilité
  statut: StatutPoste;
  est_strategique: boolean;
  est_eligible_interne: boolean;
  est_eligible_externe: boolean;
  priorite_recrutement: PrioriteRecrutement;

  // Compétences requises
  competences_requises: string[];
  diplomes_requis: string[];
  experience_minimale: number; // en années

  // Affectation actuelle
  affectation_actuelle?: Affectation;
  historique_affectations: string[]; // IDs des affectations passées

  // Compte associé
  compte_fonctionnel_id?: string;

  // Processus de recrutement
  processus_recrutement?: {
    type: 'CONCOURS' | 'NOMINATION' | 'DÉTACHEMENT' | 'PROMOTION';
    date_ouverture?: string;
    date_fermeture?: string;
    nombre_candidats?: number;
    statut: 'OUVERT' | 'EN_COURS' | 'FERMÉ' | 'POURVU';
  };

  // Métadonnées
  date_creation: string;
  date_mise_a_jour: string;
  créé_par: string;
}

// =============================================================================
// 👤 PERSONNE / FONCTIONNAIRE
// =============================================================================
export interface Personne {
  id: string;

  // Identité
  prenom: string;
  nom: string;
  nom_jeune_fille?: string;
  date_naissance: string;
  lieu_naissance: string;
  sexe: 'M' | 'F';
  nationalite: string;

  // Contact
  telephone: string;
  email: string;
  adresse_domicile: string;
  province_residence: string;
  ville_residence: string;

  // Statut professionnel
  statut: StatutFonctionnaire;
  numero_matricule?: string;
  date_entree_fonction_publique?: string;

  // Formation et compétences
  formations: Formation[];
  competences: string[];
  langues: Langue[];

  // Carrière
  affectation_actuelle?: Affectation;
  historique_affectations: string[];
  evaluations: Evaluation[];

  // Disponibilité
  est_disponible_mutation: boolean;
  est_disponible_promotion: boolean;
  preferences_affectation: PreferenceAffectation;

  // Compte utilisateur
  compte_personnel_id?: string;

  // Métadonnées
  date_creation: string;
  date_mise_a_jour: string;
}

// =============================================================================
// 🔄 AFFECTATION (Relation Personne-Poste)
// =============================================================================
export interface Affectation {
  id: string;
  personne_id: string;
  poste_id: string;
  organisme_id: string;

  // Détails de l'affectation
  type_contrat: TypeContrat;
  date_debut: string;
  date_fin_prevue?: string;
  date_fin_effective?: string;

  // Modalités
  modalite_affectation: 'NOMINATION' | 'MUTATION' | 'DÉTACHEMENT' | 'PROMOTION' | 'NOUVEAU_RECRUTEMENT';
  decision_affectation: string; // Référence de l'acte administratif

  // Conditions
  salaire_base?: number;
  primes?: Prime[];
  avantages?: string[];

  // Statut
  statut: 'ACTIVE' | 'SUSPENDUE' | 'TERMINÉE' | 'EN_COURS_VALIDATION';
  est_principale: boolean; // Pour gérer les cumuls d'emploi

  // Performance
  evaluations: string[]; // IDs des évaluations
  objectifs?: Objectif[];

  // Métadonnées
  date_creation: string;
  validé_par?: string;
  commentaires?: string;
}

// =============================================================================
// 🔐 COMPTE UTILISATEUR
// =============================================================================
export interface CompteUtilisateur {
  id: string;

  // Type de compte
  type: TypeCompte;

  // Association
  personne_id?: string; // Pour compte personnel
  poste_id?: string;    // Pour compte fonctionnel
  organisme_id: string;

  // Credentials
  identifiant: string;
  email: string;
  mot_de_passe_hash: string;

  // Profil et permissions
  role: UserRole;
  permissions: string[];
  services_accessibles: string[];

  // État du compte
  est_actif: boolean;
  est_verrouille: boolean;
  derniere_connexion?: string;
  tentatives_connexion_echouees: number;

  // Sécurité
  doit_changer_mot_de_passe: boolean;
  date_expiration_mot_de_passe?: string;
  cle_activation?: string;

  // Métadonnées
  date_creation: string;
  date_mise_a_jour: string;
  créé_par: string;
}

// =============================================================================
// 💼 MARCHÉ DE L'EMPLOI PUBLIC
// =============================================================================
export interface OpportuniteEmploi {
  id: string;
  poste_id: string;
  organisme_id: string;

  // Détails de l'opportunité
  titre: string;
  description_détaillée: string;
  type_opportunite: 'NOUVEAU_POSTE' | 'REMPLACEMENT' | 'MUTATION' | 'PROMOTION';

  // Processus de sélection
  type_processus: 'CONCOURS_EXTERNE' | 'CONCOURS_INTERNE' | 'NOMINATION_DIRECTE' | 'LISTE_APTITUDE';
  date_ouverture: string;
  date_fermeture: string;
  nombre_postes_ouverts: number;

  // Candidatures
  candidatures: Candidature[];
  candidats_présélectionnés: string[];
  candidat_retenu?: string;

  // Statut
  statut: 'OUVERT' | 'EN_ÉVALUATION' | 'FERMÉ' | 'POURVU' | 'ANNULÉ';

  // Statistiques
  nombre_candidatures: number;
  nombre_candidatures_internes: number;
  nombre_candidatures_externes: number;
}

export interface Candidature {
  id: string;
  opportunite_id: string;
  personne_id: string;

  // Détails candidature
  type_candidature: 'INTERNE' | 'EXTERNE';
  motivation: string;
  documents_fournis: Document[];

  // Évaluation
  score_évaluation?: number;
  commentaires_jury?: string;
  rang_classement?: number;

  // Statut
  statut: 'SOUMISE' | 'EN_ÉVALUATION' | 'PRÉSÉLECTIONNÉE' | 'RETENUE' | 'REJETÉE';

  // Métadonnées
  date_soumission: string;
  évaluée_par?: string[];
}

// =============================================================================
// 📊 TYPES AUXILIAIRES
// =============================================================================
export interface Formation {
  id: string;
  intitule: string;
  etablissement: string;
  niveau: string;
  domaine: string;
  date_obtention: string;
  est_certifiante: boolean;
}

export interface Langue {
  langue: string;
  niveau_oral: 'DÉBUTANT' | 'INTERMÉDIAIRE' | 'AVANCÉ' | 'NATIF';
  niveau_écrit: 'DÉBUTANT' | 'INTERMÉDIAIRE' | 'AVANCÉ' | 'NATIF';
  est_officielle: boolean;
}

export interface Evaluation {
  id: string;
  periode: string;
  note_globale: number;
  commentaires: string;
  objectifs_atteints: number;
  axes_amélioration: string[];
  évaluateur_id: string;
  date_evaluation: string;
}

export interface PreferenceAffectation {
  provinces_souhaitées: string[];
  types_postes_souhaités: string[];
  niveau_hierarchique_souhaité: NiveauHierarchique[];
  accepte_mutation_contrainte: boolean;
  disponibilité_déplacement: boolean;
}

export interface Prime {
  type: string;
  montant: number;
  periodicite: 'MENSUELLE' | 'TRIMESTRIELLE' | 'ANNUELLE' | 'PONCTUELLE';
  conditions: string;
}

export interface Objectif {
  description: string;
  echeance: string;
  statut: 'EN_COURS' | 'ATTEINT' | 'NON_ATTEINT' | 'REPLANIFIÉ';
  indicateurs: string[];
}

export interface Document {
  id: string;
  nom: string;
  type: string;
  url: string;
  date_upload: string;
}

// =============================================================================
// 📈 STATISTIQUES ET TABLEAUX DE BORD
// =============================================================================
export interface StatistiquesEmploi {
  global: {
    total_organismes: number;
    total_postes: number;
    total_fonctionnaires: number;
    taux_occupation: number;
    postes_vacants: number;
    fonctionnaires_disponibles: number;
  };

  par_organisme: Record<string, {
    nom: string;
    postes_total: number;
    postes_occupés: number;
    postes_vacants: number;
    taux_occupation: number;
  }>;

  par_niveau: Record<NiveauHierarchique, {
    postes_total: number;
    postes_occupés: number;
    postes_vacants: number;
    candidatures_en_cours: number;
  }>;

  marché_emploi: {
    opportunités_ouvertes: number;
    candidatures_en_cours: number;
    postes_pourvus_mois: number;
    délai_moyen_pourvoi: number; // en jours
    taux_succès_interne: number;
    taux_succès_externe: number;
  };
}

// =============================================================================
// 🔍 RECHERCHE ET FILTRES
// =============================================================================
export interface FiltresPoste {
  organisme_ids?: string[];
  statuts?: StatutPoste[];
  niveaux_hierarchiques?: NiveauHierarchique[];
  est_strategique?: boolean;
  competences_requises?: string[];
  salaire_min?: number;
  salaire_max?: number;
}

export interface FiltresFonctionnaire {
  statuts?: StatutFonctionnaire[];
  organismes_ids?: string[];
  competences?: string[];
  formations?: string[];
  experience_min?: number;
  est_disponible?: boolean;
  provinces?: string[];
}

export interface ResultatRecherche<T> {
  items: T[];
  total: number;
  page: number;
  pages_total: number;
  filtres_appliqués: any;
}
