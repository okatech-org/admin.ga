/**
 * Structure complète du Gouvernement de la République Gabonaise
 * Cinquième République - Formation du 2025-05-05
 * Chef de l'État: Brice Clotaire OLIGUI NGUEMA
 */

export const GOUVERNEMENT_GABON_2025 = {
  metadata: {
    pays: "République Gabonaise",
    gouvernement: "Gouvernement de la Cinquième République",
    date_formation: "2025-05-05",
    chef_etat: "Brice Clotaire OLIGUI NGUEMA",
    vice_president_republique: "Séraphin MOUNDOUNGA",
    vice_president_gouvernement: "Hugues Alexandre BARRO CHAMBRIER",
    total_ministres: 30,
    constitution: "Constitution du 19 décembre 2024",
    date_mise_a_jour: "2025-08-04"
  }
};

// Types d'organisations gouvernementales étendus
export const TYPES_ORGANISATIONS_GABON = {
  // Niveau 1 - Présidence
  PRESIDENCE: 'Présidence de la République',
  VICE_PRESIDENCE_REPUBLIQUE: 'Vice-Présidence de la République',
  VICE_PRESIDENCE_GOUVERNEMENT: 'Vice-Présidence du Gouvernement',

  // Niveau 2 - Ministères
  MINISTERE_ETAT: 'Ministère d\'État',
  MINISTERE: 'Ministère',

  // Niveau 3 - Structures ministérielles
  SECRETARIAT_GENERAL: 'Secrétariat Général',
  DIRECTION_GENERALE: 'Direction Générale',
  DIRECTION: 'Direction',
  SERVICE: 'Service',

  // Niveau 4 - Structures territoriales
  GOUVERNORAT: 'Gouvernorat',
  PREFECTURE: 'Préfecture',
  MAIRIE: 'Mairie',

  // Niveau 5 - Organismes spécialisés
  ORGANISME_SOCIAL: 'Organisme Social',
  ETABLISSEMENT_PUBLIC: 'Établissement Public',
  AGENCE_NATIONALE: 'Agence Nationale',
  CONSEIL_NATIONAL: 'Conseil National',

  // Autres
  CABINET: 'Cabinet',
  INSPECTION_GENERALE: 'Inspection Générale',
  AUTRE: 'Autre'
} as const;

// Types de postes par niveau hiérarchique
export const TYPES_POSTES_HIERARCHIQUES = {
  // Niveau politique
  MINISTRE_ETAT: { niveau: 'politique', titre: 'Ministre d\'État', rang: 1 },
  MINISTRE: { niveau: 'politique', titre: 'Ministre', rang: 2 },

  // Niveau haute administration
  SECRETAIRE_GENERAL: { niveau: 'haut_cadre', titre: 'Secrétaire Général', rang: 3 },
  SECRETAIRE_GENERAL_ADJOINT: { niveau: 'haut_cadre', titre: 'Secrétaire Général Adjoint', rang: 4 },
  DIRECTEUR_GENERAL: { niveau: 'haut_cadre', titre: 'Directeur Général', rang: 5 },
  DIRECTEUR_GENERAL_ADJOINT: { niveau: 'haut_cadre', titre: 'Directeur Général Adjoint', rang: 6 },

  // Niveau direction
  DIRECTEUR_CABINET: { niveau: 'cadre_superieur', titre: 'Directeur de Cabinet', rang: 7 },
  CHEF_CABINET: { niveau: 'cadre_superieur', titre: 'Chef de Cabinet', rang: 8 },
  DIRECTEUR: { niveau: 'cadre_superieur', titre: 'Directeur', rang: 9 },
  CONSEILLER: { niveau: 'cadre_superieur', titre: 'Conseiller', rang: 10 },
  INSPECTEUR_GENERAL: { niveau: 'cadre_superieur', titre: 'Inspecteur Général', rang: 11 },

  // Niveau encadrement
  CHEF_SERVICE: { niveau: 'cadre_moyen', titre: 'Chef de Service', rang: 12 },
  CHEF_BUREAU: { niveau: 'cadre_moyen', titre: 'Chef de Bureau', rang: 13 },
  CHARGE_ETUDES: { niveau: 'cadre_moyen', titre: 'Chargé d\'Études', rang: 14 },
  CHARGE_MISSION: { niveau: 'cadre_moyen', titre: 'Chargé de Mission', rang: 15 },
  ATTACHE: { niveau: 'cadre_moyen', titre: 'Attaché', rang: 16 },

  // Niveau exécution
  SECRETAIRE_PARTICULIER: { niveau: 'agent_execution', titre: 'Secrétaire Particulier', rang: 17 },
  AGENT_ADMINISTRATIF: { niveau: 'agent_execution', titre: 'Agent Administratif', rang: 18 },
  CHAUFFEUR: { niveau: 'agent_execution', titre: 'Chauffeur', rang: 19 },
  AGENT_SECURITE: { niveau: 'agent_execution', titre: 'Agent de Sécurité', rang: 20 }
} as const;

// Structure type d'un ministère
export const STRUCTURE_TYPE_MINISTERE = {
  cabinet_ministre: {
    directeur_cabinet: {
      fonction: "Coordination du cabinet et liaison ministre-services",
      niveau: "cadre_superieur",
      autorite_sur: ["chef_cabinet", "conseillers", "secretariat_particulier"]
    },
    chef_cabinet: {
      fonction: "Gestion agenda ministre et organisation activités",
      niveau: "cadre_superieur",
      autorite_sur: ["secretariat_particulier", "protocole"]
    },
    conseillers: {
      fonction: "Expertise technique et conseil politique",
      niveau: "cadre_superieur",
      nombre_ministre_etat: 10,
      nombre_ministre: 9,
      specialites: ["juridique", "technique", "communication", "diplomatique", "économique"]
    },
    secretariat_particulier: {
      fonction: "Secrétariat personnel du ministre",
      niveau: "cadre_moyen",
      nombre: "1-3"
    },
    charges_etudes: {
      fonction: "Études techniques et dossiers spécialisés",
      niveau: "cadre_moyen"
    },
    charges_mission: {
      fonction: "Missions spécifiques du ministre",
      niveau: "cadre_moyen"
    },
    chef_protocole: {
      fonction: "Organisation protocole et cérémonies",
      niveau: "cadre_moyen"
    },
    aide_camp: {
      fonction: "Accompagnement et sécurité du ministre",
      niveau: "agent_execution"
    }
  },

  secretariat_general: {
    secretaire_general: {
      fonction: "Coordination générale de l'ensemble des services du ministère",
      niveau: "haut_cadre",
      autorite_sur: ["secretaire_general_adjoint", "directions_generales", "directions"]
    },
    secretaire_general_adjoint: {
      fonction: "Assistance du SG et intérim, coordination directions",
      niveau: "cadre_superieur",
      autorite_sur: ["directions"]
    }
  },

  directions_generales: {
    directeur_general: {
      fonction: "Direction opérationnelle d'un secteur d'activité",
      niveau: "cadre_superieur",
      autorite_sur: ["directeur_general_adjoint", "directions_sectorielles"]
    },
    directeur_general_adjoint: {
      fonction: "Assistance du DG et coordination des directions",
      niveau: "cadre_superieur"
    }
  },

  directions: {
    directeur: {
      fonction: "Mise en œuvre opérationnelle des politiques sectorielles",
      niveau: "cadre_superieur",
      autorite_sur: ["chef_service", "personnel_direction"]
    },
    chef_service: {
      fonction: "Gestion d'un service spécialisé",
      niveau: "cadre_moyen",
      autorite_sur: ["agents_execution"]
    }
  },

  services_transversaux: {
    direction_personnel_archives: {
      fonction: "Gestion personnel ministère, formation, archives",
      chef_service: "Chef de Service du Personnel"
    },
    direction_budget_finances: {
      fonction: "Gestion budgétaire et comptable du ministère",
      chef_service: "Directeur Financier"
    },
    direction_communication: {
      fonction: "Communication interne et externe",
      chef_service: "Directeur de la Communication"
    },
    direction_juridique: {
      fonction: "Conseil juridique et contentieux",
      chef_service: "Conseiller Juridique"
    },
    direction_informatique: {
      fonction: "Systèmes d'information et digitalisation",
      chef_service: "Directeur des Systèmes d'Information"
    }
  }
};

// Mapping des rôles système vers les postes gabonais
export const MAPPING_ROLES_POSTES = {
  SUPER_ADMIN: ['MINISTRE_ETAT', 'MINISTRE', 'SECRETAIRE_GENERAL_PRESIDENCE'],
  ADMIN: ['SECRETAIRE_GENERAL', 'DIRECTEUR_GENERAL', 'DIRECTEUR_CABINET'],
  MANAGER: ['DIRECTEUR', 'CHEF_SERVICE', 'CONSEILLER'],
  AGENT: ['CHEF_BUREAU', 'CHARGE_ETUDES', 'ATTACHE'],
  USER: ['AGENT_ADMINISTRATIF', 'SECRETAIRE_PARTICULIER']
} as const;

// Générer un email professionnel gabonais
export function genererEmailGouvernemental(
  prenom: string,
  nom: string,
  organisationCode: string,
  domaine: string = 'gouv.ga'
): string {
  const prenomClean = prenom.toLowerCase().replace(/[^a-z]/g, '');
  const nomClean = nom.toLowerCase().replace(/[^a-z]/g, '');
  const orgClean = organisationCode.toLowerCase().replace(/_/g, '-');

  return `${prenomClean}.${nomClean}@${orgClean}.${domaine}`;
}

// Générer un titre de poste contextuel
export function genererTitrePoste(
  typePoste: keyof typeof TYPES_POSTES_HIERARCHIQUES,
  organisationName: string,
  specialite?: string
): string {
  const poste = TYPES_POSTES_HIERARCHIQUES[typePoste];
  let titre: string = poste.titre;

  if (specialite && typePoste === 'CONSEILLER') {
    titre = `${titre} ${specialite}`;
  }

  if (typePoste.includes('DIRECTEUR') && !typePoste.includes('CABINET')) {
    titre = `${titre} - ${organisationName}`;
  }

  return titre;
}

// Déterminer le rôle système basé sur le poste
export function determinerRoleSysteme(typePoste: keyof typeof TYPES_POSTES_HIERARCHIQUES): string {
  const poste = TYPES_POSTES_HIERARCHIQUES[typePoste];

  switch (poste.niveau) {
    case 'politique':
    case 'haut_cadre':
      return poste.rang <= 5 ? 'SUPER_ADMIN' : 'ADMIN';
    case 'cadre_superieur':
      return poste.rang <= 10 ? 'ADMIN' : 'MANAGER';
    case 'cadre_moyen':
      return 'AGENT';
    case 'agent_execution':
      return 'USER';
    default:
      return 'USER';
  }
}

// Vérifier si un poste peut accéder à certaines fonctionnalités
export function peutAccederFonctionnalite(
  typePoste: keyof typeof TYPES_POSTES_HIERARCHIQUES,
  fonctionnalite: 'gestion_users' | 'validation_documents' | 'statistiques' | 'configuration'
): boolean {
  const poste = TYPES_POSTES_HIERARCHIQUES[typePoste];

  switch (fonctionnalite) {
    case 'gestion_users':
      return ['politique', 'haut_cadre'].includes(poste.niveau) ||
             ['DIRECTEUR_CABINET', 'CHEF_CABINET'].includes(typePoste);

    case 'validation_documents':
      return poste.rang <= 15; // Jusqu'aux chargés de mission

    case 'statistiques':
      return poste.rang <= 13; // Jusqu'aux chefs de bureau

    case 'configuration':
      return poste.rang <= 9; // Jusqu'aux directeurs

    default:
      return false;
  }
}
