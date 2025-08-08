/* @ts-nocheck */
// @ts-ignore
export const DGBFIP_USERS = {
  "organisme": "Direction Générale du Budget et des Finances Publiques",
  "code_organisme": "DGBFIP",
  "date_mise_a_jour": "2025-01-19",
  "total_utilisateurs": 0,
  "utilisateurs": [],
  "statistiques": {
    "total_comptes": 52,
    "repartition_par_role": {
      "ADMIN": 5,
      "MANAGER": 12,
      "AGENT": 35
    },
    "par_role": {
      "DIRECTEUR": 5,
      "CHEF_SERVICE": 12,
      "CHEF_BUREAU": 15,
      "AGENT": 20
    },
    "par_statut": {
      "ACTIF": 45,
      "INACTIF": 7
    },
    "repartition_par_statut": {
      "ACTIF": 45,
      "INACTIF": 7
    }
  }
};

export interface DGBFIPUser {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  role: string;
  statut: string;
  service?: string;
  bureau?: string;
}

export const getDGBFIPUsers = () => {
  return DGBFIP_USERS.utilisateurs;
};

export const getDGBFIPDirection = () => {
  return {
    directeur_general: null,
    directeurs_adjoints: [],
    chefs_service: [],
    organisation: DGBFIP_USERS.organisme
  };
};

export const getDGBFIPStatistics = () => {
  return DGBFIP_USERS.statistiques;
};

export const getDGBFIPOrganigramme = () => {
  return {
    niveau_1_direction: {
      total: 5,
      postes: [
        "Directeur Général",
        "Directeur Général Adjoint - Budget",
        "Directeur Général Adjoint - Finances Publiques",
        "Secrétaire Général",
        "Conseiller Technique"
      ]
    },
    niveau_2_encadrement: {
      total: 12,
      postes: [
        "Directeur du Budget",
        "Directeur des Finances Publiques",
        "Directeur des Ressources Humaines",
        "Directeur de l'Administration Générale",
        "Chef de Service Comptabilité",
        "Chef de Service Contrôle",
        "Chef de Service Études Économiques",
        "Chef de Service Informatique",
        "Chef de Service Juridique",
        "Chef de Service Communication",
        "Chef de Service Audit Interne",
        "Chef de Service Formation"
      ]
    },
    niveau_3_execution: {
      total: 35,
      postes: [
        "Chef de Bureau Préparation Budgétaire",
        "Chef de Bureau Exécution Budgétaire",
        "Chef de Bureau Contrôle Budgétaire",
        "Chef de Bureau Recettes",
        "Chef de Bureau Dépenses",
        "Chef de Bureau Trésorerie",
        "Chef de Bureau Comptabilité Générale",
        "Chef de Bureau Comptabilité Analytique",
        "Chef de Bureau Paie",
        "Chef de Bureau Carrière",
        "Chef de Bureau Formation Continue",
        "Chef de Bureau Logistique",
        "Chef de Bureau Patrimoine",
        "Chef de Bureau Marchés Publics",
        "Chef de Bureau Contentieux",
        "Chef de Bureau Études Fiscales",
        "Chef de Bureau Analyses Économiques",
        "Chef de Bureau Statistiques",
        "Chef de Bureau Systèmes d'Information",
        "Chef de Bureau Support Technique",
        "Agent Principal Budget",
        "Agent Principal Finances",
        "Agent Principal Comptabilité",
        "Agent Principal RH",
        "Agent Principal Logistique",
        "Secrétaire de Direction",
        "Secrétaire Administrative",
        "Assistant de Gestion",
        "Technicien Informatique",
        "Agent d'Accueil",
        "Chauffeur",
        "Agent de Sécurité",
        "Agent d'Entretien",
        "Standardiste",
        "Archiviste"
      ]
    },
    total_postes: 52,
    postes_pourvus: 0,
    structure: "DGBFIP"
  };
};
