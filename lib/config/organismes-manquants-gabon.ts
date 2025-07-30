/* @ts-nocheck */
import {
  Crown, Building2, Scale, Shield, Users, GraduationCap, Heart, Briefcase,
  Factory, Globe, Zap, Car, Home, Trees, Leaf, Mountain, Calculator,
  Radio, Stethoscope, Award, Flag, MapPin, Gavel, Target, Database,
  Settings, Eye, Network, Cpu, Phone, Mail, Receipt, Banknote, TrendingUp,
  ScrollText, BookOpen, Landmark, Vote, ShieldCheck, FileSearch,
  Briefcase as BriefcaseIcon, UserCheck, MessageSquare, Lock
} from 'lucide-react';

import { OrganismeOfficielGabon } from './organismes-officiels-gabon';

// === ORGANISMES MANQUANTS À AJOUTER ===
export const ORGANISMES_MANQUANTS_GABON: Record<string, OrganismeOfficielGabon> = {

  // ==================== SERVICES PRÉSIDENTIELS ====================

  DIR_COM_PRESIDENTIELLE: {
    id: "a1_003",
    code: "DIR_COM_PRESIDENTIELLE",
    nom: "Direction de la Communication Présidentielle",
    nomCourt: "DCP",
    sigle: "DCP",
    groupe: "A",
    sousGroupe: "A1",
    type: "DIRECTION_GENERALE",
    mission: "Communication officielle de la Présidence de la République",
    attributions: [
      "Communication institutionnelle présidentielle",
      "Relations avec les médias",
      "Gestion de l'image présidentielle",
      "Déclarations et communiqués officiels"
    ],
    services: ["Service de presse", "Service audiovisuel", "Service digital"],
    adresse: "Palais Présidentiel",
    ville: "Libreville",
    province: "Estuaire",
    niveau: 2,
    parentId: "PRESIDENCE",
    flux: {
      hierarchiquesDescendants: [],
      hierarchiquesAscendants: ["PRESIDENCE"],
      horizontauxInterministeriels: ["MIN_COMMUNICATION"],
      transversauxSIG: ["ADMIN.GA"]
    },
    branding: {
      couleurPrimaire: "#DC2626",
      couleurSecondaire: "#B91C1C",
      couleurAccent: "#991B1B",
      icon: MessageSquare,
      gradientClasses: "from-red-500 to-red-700",
      backgroundClasses: "bg-red-50"
    },
    isActive: true,
    dateCreation: "2025-01-01"
  },

  SSP: {
    id: "a1_004",
    code: "SSP",
    nom: "Services de Sécurité Présidentielle",
    nomCourt: "SSP",
    sigle: "SSP",
    groupe: "A",
    sousGroupe: "A1",
    type: "DIRECTION_GENERALE",
    mission: "Protection et sécurité du Président de la République",
    attributions: [
      "Protection rapprochée du Chef de l'État",
      "Sécurisation des déplacements présidentiels",
      "Sécurité du Palais Présidentiel",
      "Renseignement de sécurité"
    ],
    services: ["Protection rapprochée", "Sécurité des sites", "Renseignement"],
    adresse: "Palais Présidentiel",
    ville: "Libreville",
    province: "Estuaire",
    niveau: 2,
    parentId: "PRESIDENCE",
    flux: {
      hierarchiquesDescendants: [],
      hierarchiquesAscendants: ["PRESIDENCE"],
      horizontauxInterministeriels: ["MIN_INTERIEUR", "MIN_DEFENSE"],
      transversauxSIG: []
    },
    branding: {
      couleurPrimaire: "#1F2937",
      couleurSecondaire: "#111827",
      couleurAccent: "#030712",
      icon: ShieldCheck,
      gradientClasses: "from-gray-800 to-gray-900",
      backgroundClasses: "bg-gray-50"
    },
    isActive: true,
    dateCreation: "2025-01-01"
  },

  // ==================== SERVICES PRIMATURE ====================

  SGG: {
    id: "a1_005",
    code: "SGG",
    nom: "Secrétariat Général du Gouvernement",
    nomCourt: "SGG",
    sigle: "SGG",
    groupe: "A",
    sousGroupe: "A1",
    type: "DIRECTION_GENERALE",
    mission: "Coordination administrative centrale du Gouvernement et légistique",
    attributions: [
      "Préparation des conseils des ministres",
      "Coordination interministérielle",
      "Contrôle de légalité des textes",
      "Suivi de l'action gouvernementale",
      "Publication au Journal Officiel"
    ],
    services: ["Service juridique", "Service coordination", "Service documentation", "Journal Officiel"],
    adresse: "Immeuble du Gouvernement",
    ville: "Libreville",
    province: "Estuaire",
    niveau: 2,
    parentId: "PRIMATURE",
    flux: {
      hierarchiquesDescendants: [],
      hierarchiquesAscendants: ["PRIMATURE"],
      horizontauxInterministeriels: ["MIN_JUSTICE", "MIN_INTERIEUR", "MIN_ECONOMIE"],
      transversauxSIG: ["ADMIN.GA", "SIGEFI"]
    },
    branding: {
      couleurPrimaire: "#2563EB",
      couleurSecondaire: "#1D4ED8",
      couleurAccent: "#1E40AF",
      icon: ScrollText,
      gradientClasses: "from-blue-600 to-blue-800",
      backgroundClasses: "bg-blue-50"
    },
    isActive: true,
    dateCreation: "2025-01-01"
  },

  SERV_COORD_GOUV: {
    id: "a1_006",
    code: "SERV_COORD_GOUV",
    nom: "Services de Coordination Gouvernementale",
    nomCourt: "SCG",
    sigle: "SCG",
    groupe: "A",
    sousGroupe: "A1",
    type: "DIRECTION_GENERALE",
    mission: "Suivi et évaluation des programmes gouvernementaux",
    attributions: [
      "Suivi des programmes gouvernementaux",
      "Évaluation des politiques publiques",
      "Coordination des actions ministérielles",
      "Tableaux de bord gouvernementaux"
    ],
    services: ["Service suivi", "Service évaluation", "Service reporting"],
    adresse: "Immeuble du Gouvernement",
    ville: "Libreville",
    province: "Estuaire",
    niveau: 2,
    parentId: "PRIMATURE",
    flux: {
      hierarchiquesDescendants: [],
      hierarchiquesAscendants: ["PRIMATURE"],
      horizontauxInterministeriels: ["MIN_ECONOMIE", "MIN_BUDGET", "MIN_MODERNISATION"],
      transversauxSIG: ["ADMIN.GA", "STAT_NATIONAL"]
    },
    branding: {
      couleurPrimaire: "#7C3AED",
      couleurSecondaire: "#6D28D9",
      couleurAccent: "#5B21B6",
      icon: Network,
      gradientClasses: "from-purple-600 to-purple-800",
      backgroundClasses: "bg-purple-50"
    },
    isActive: true,
    dateCreation: "2025-01-01"
  },

  // ==================== AGENCES SPÉCIALISÉES (GROUPE E) ====================

  ANPI_GABON: {
    id: "e1_001",
    code: "ANPI_GABON",
    nom: "Agence Nationale de Promotion des Investissements du Gabon",
    nomCourt: "ANPI-Gabon",
    sigle: "ANPI",
    groupe: "E",
    sousGroupe: "E1",
    type: "AGENCE_SPECIALISEE",
    sousType: "AGENCE_PROMOTION",
    mission: "Promotion et facilitation des investissements privés au Gabon",
    attributions: [
      "Promotion du Gabon comme destination d'investissement",
      "Guichet unique pour les investisseurs",
      "Facilitation des procédures administratives",
      "Accompagnement des projets d'investissement",
      "Plaidoyer pour l'amélioration du climat des affaires"
    ],
    services: ["Guichet unique", "Service promotion", "Service accompagnement", "Service études"],
    adresse: "Boulevard du Bord de Mer",
    ville: "Libreville",
    province: "Estuaire",
    niveau: 3,
    parentId: "MIN_ECONOMIE",
    flux: {
      hierarchiquesDescendants: [],
      hierarchiquesAscendants: ["MIN_ECONOMIE"],
      horizontauxInterministeriels: ["MIN_COMMERCE", "MIN_INDUSTRIE", "MIN_TOURISME"],
      transversauxSIG: ["ADMIN.GA"]
    },
    branding: {
      couleurPrimaire: "#059669",
      couleurSecondaire: "#047857",
      couleurAccent: "#065F46",
      icon: TrendingUp,
      gradientClasses: "from-emerald-600 to-emerald-800",
      backgroundClasses: "bg-emerald-50"
    },
    isActive: true,
    dateCreation: "2025-01-01"
  },

  FER: {
    id: "e1_002",
    code: "FER",
    nom: "Fonds d'Entretien Routier",
    nomCourt: "FER",
    sigle: "FER",
    groupe: "E",
    sousGroupe: "E1",
    type: "AGENCE_SPECIALISEE",
    sousType: "FONDS_SPECIAL",
    mission: "Financement de l'entretien du réseau routier national",
    attributions: [
      "Collecte des ressources dédiées à l'entretien routier",
      "Financement des travaux d'entretien",
      "Contrôle de l'utilisation des fonds",
      "Programmation des interventions"
    ],
    services: ["Service financement", "Service contrôle", "Service programmation"],
    adresse: "Quartier Batterie IV",
    ville: "Libreville",
    province: "Estuaire",
    niveau: 3,
    parentId: "MIN_TRAVAUX_PUB",
    flux: {
      hierarchiquesDescendants: [],
      hierarchiquesAscendants: ["MIN_TRAVAUX_PUB"],
      horizontauxInterministeriels: ["MIN_ECONOMIE", "MIN_BUDGET", "MIN_TRANSPORTS"],
      transversauxSIG: ["SIGEFI"]
    },
    branding: {
      couleurPrimaire: "#F59E0B",
      couleurSecondaire: "#D97706",
      couleurAccent: "#B45309",
      icon: Car,
      gradientClasses: "from-amber-600 to-amber-800",
      backgroundClasses: "bg-amber-50"
    },
    isActive: true,
    dateCreation: "2025-01-01"
  },

  ANUTTC: {
    id: "e1_003",
    code: "ANUTTC",
    nom: "Agence Nationale de l'Urbanisme, des Travaux Topographiques et du Cadastre",
    nomCourt: "ANUTTC",
    sigle: "ANUTTC",
    groupe: "E",
    sousGroupe: "E1",
    type: "AGENCE_SPECIALISEE",
    mission: "Gestion de l'urbanisme, de la topographie et du cadastre national",
    attributions: [
      "Élaboration des schémas directeurs d'urbanisme",
      "Gestion du cadastre national",
      "Travaux topographiques",
      "Délivrance des titres fonciers",
      "Contrôle de l'occupation des sols"
    ],
    services: ["Service urbanisme", "Service cadastre", "Service topographie", "Service foncier"],
    adresse: "Avenue du Colonel Parant",
    ville: "Libreville",
    province: "Estuaire",
    niveau: 3,
    parentId: "MIN_HABITAT",
    flux: {
      hierarchiquesDescendants: [],
      hierarchiquesAscendants: ["MIN_HABITAT"],
      horizontauxInterministeriels: ["MIN_INTERIEUR", "MIN_ENVIRONNEMENT", "MIN_AGRICULTURE"],
      transversauxSIG: ["ADMIN.GA", "SIG_IDENTITE"]
    },
    branding: {
      couleurPrimaire: "#8B5CF6",
      couleurSecondaire: "#7C3AED",
      couleurAccent: "#6D28D9",
      icon: MapPin,
      gradientClasses: "from-violet-600 to-violet-800",
      backgroundClasses: "bg-violet-50"
    },
    isActive: true,
    dateCreation: "2025-01-01"
  },

  ARSEE: {
    id: "e1_004",
    code: "ARSEE",
    nom: "Autorité de Régulation du Secteur de l'Eau et de l'Énergie Électrique",
    nomCourt: "ARSEE",
    sigle: "ARSEE",
    groupe: "E",
    sousGroupe: "E1",
    type: "AGENCE_SPECIALISEE",
    sousType: "AUTORITE_REGULATION",
    mission: "Régulation des secteurs de l'eau et de l'électricité",
    attributions: [
      "Régulation tarifaire eau et électricité",
      "Contrôle de la qualité de service",
      "Protection des consommateurs",
      "Arbitrage des différends",
      "Promotion de la concurrence"
    ],
    services: ["Service régulation", "Service contrôle", "Service consommateurs", "Service juridique"],
    adresse: "Boulevard de l'Indépendance",
    ville: "Libreville",
    province: "Estuaire",
    niveau: 3,
    parentId: "MIN_ENERGIE",
    flux: {
      hierarchiquesDescendants: [],
      hierarchiquesAscendants: ["MIN_ENERGIE"],
      horizontauxInterministeriels: ["MIN_ECONOMIE", "MIN_COMMERCE", "SEEG"],
      transversauxSIG: ["ADMIN.GA"]
    },
    branding: {
      couleurPrimaire: "#3B82F6",
      couleurSecondaire: "#2563EB",
      couleurAccent: "#1D4ED8",
      icon: Zap,
      gradientClasses: "from-blue-500 to-blue-700",
      backgroundClasses: "bg-blue-50"
    },
    isActive: true,
    dateCreation: "2025-01-01"
  },

  GOC: {
    id: "e1_005",
    code: "GOC",
    nom: "Gabon Oil Company",
    nomCourt: "GOC",
    sigle: "GOC",
    groupe: "E",
    sousGroupe: "E1",
    type: "ETABLISSEMENT_PUBLIC",
    sousType: "SOCIETE_ETAT",
    mission: "Société nationale pétrolière du Gabon",
    attributions: [
      "Gestion des participations de l'État dans le pétrole",
      "Commercialisation du pétrole de l'État",
      "Développement de projets pétroliers",
      "Partenariats avec compagnies internationales"
    ],
    services: ["Direction exploration", "Direction production", "Direction commerciale", "Direction finance"],
    adresse: "Boulevard du Bord de Mer",
    ville: "Port-Gentil",
    province: "Ogooué-Maritime",
    niveau: 3,
    parentId: "MIN_PETROLE",
    flux: {
      hierarchiquesDescendants: [],
      hierarchiquesAscendants: ["MIN_PETROLE"],
      horizontauxInterministeriels: ["MIN_ECONOMIE", "MIN_MINES", "MIN_ENVIRONNEMENT"],
      transversauxSIG: ["SIGEFI"]
    },
    branding: {
      couleurPrimaire: "#1F2937",
      couleurSecondaire: "#111827",
      couleurAccent: "#030712",
      icon: Factory,
      gradientClasses: "from-gray-800 to-gray-900",
      backgroundClasses: "bg-gray-50"
    },
    isActive: true,
    dateCreation: "2025-01-01"
  },

  ANPN: {
    id: "e1_006",
    code: "ANPN",
    nom: "Agence Nationale des Parcs Nationaux",
    nomCourt: "ANPN",
    sigle: "ANPN",
    groupe: "E",
    sousGroupe: "E1",
    type: "AGENCE_SPECIALISEE",
    mission: "Gestion et conservation des parcs nationaux du Gabon",
    attributions: [
      "Gestion des 13 parcs nationaux",
      "Conservation de la biodiversité",
      "Développement de l'écotourisme",
      "Recherche scientifique",
      "Sensibilisation environnementale"
    ],
    services: ["Service conservation", "Service tourisme", "Service recherche", "Service surveillance"],
    adresse: "Batterie IV",
    ville: "Libreville",
    province: "Estuaire",
    niveau: 3,
    parentId: "MIN_EAUX_FORETS",
    flux: {
      hierarchiquesDescendants: [],
      hierarchiquesAscendants: ["MIN_EAUX_FORETS"],
      horizontauxInterministeriels: ["MIN_ENVIRONNEMENT", "MIN_TOURISME", "MIN_RECHERCHE"],
      transversauxSIG: ["ADMIN.GA"]
    },
    branding: {
      couleurPrimaire: "#10B981",
      couleurSecondaire: "#059669",
      couleurAccent: "#047857",
      icon: Trees,
      gradientClasses: "from-emerald-500 to-emerald-700",
      backgroundClasses: "bg-emerald-50"
    },
    isActive: true,
    dateCreation: "2025-01-01"
  },

  ARCEP: {
    id: "e1_007",
    code: "ARCEP",
    nom: "Autorité de Régulation des Communications Électroniques et des Postes",
    nomCourt: "ARCEP",
    sigle: "ARCEP",
    groupe: "E",
    sousGroupe: "E1",
    type: "AGENCE_SPECIALISEE",
    sousType: "AUTORITE_REGULATION",
    mission: "Régulation des secteurs des télécommunications et des services postaux",
    attributions: [
      "Régulation du secteur des télécoms",
      "Attribution des fréquences",
      "Régulation du secteur postal",
      "Protection des consommateurs",
      "Promotion de la concurrence"
    ],
    services: ["Service télécoms", "Service fréquences", "Service postal", "Service juridique"],
    adresse: "Boulevard Triomphal",
    ville: "Libreville",
    province: "Estuaire",
    niveau: 3,
    parentId: "MIN_NUMERIQUE",
    flux: {
      hierarchiquesDescendants: [],
      hierarchiquesAscendants: ["MIN_NUMERIQUE"],
      horizontauxInterministeriels: ["MIN_COMMERCE", "MIN_ECONOMIE", "GABON_TELECOM"],
      transversauxSIG: ["ADMIN.GA"]
    },
    branding: {
      couleurPrimaire: "#6366F1",
      couleurSecondaire: "#4F46E5",
      couleurAccent: "#4338CA",
      icon: Radio,
      gradientClasses: "from-indigo-600 to-indigo-800",
      backgroundClasses: "bg-indigo-50"
    },
    isActive: true,
    dateCreation: "2025-01-01"
  },

  CIRMF: {
    id: "e1_008",
    code: "CIRMF",
    nom: "Centre International de Recherches Médicales de Franceville",
    nomCourt: "CIRMF",
    sigle: "CIRMF",
    groupe: "E",
    sousGroupe: "E1",
    type: "AGENCE_SPECIALISEE",
    mission: "Recherche médicale et épidémiologique en Afrique centrale",
    attributions: [
      "Recherche sur les maladies tropicales",
      "Surveillance épidémiologique",
      "Formation des chercheurs",
      "Coopération scientifique internationale",
      "Développement de vaccins et traitements"
    ],
    services: ["Laboratoires", "Service épidémiologie", "Service formation", "Service clinique"],
    adresse: "Route de l'Aéroport",
    ville: "Franceville",
    province: "Haut-Ogooué",
    niveau: 3,
    parentId: "MIN_SANTE",
    flux: {
      hierarchiquesDescendants: [],
      hierarchiquesAscendants: ["MIN_SANTE"],
      horizontauxInterministeriels: ["MIN_ENS_SUP", "CENAREST", "CNAMGS"],
      transversauxSIG: ["ADMIN.GA"]
    },
    branding: {
      couleurPrimaire: "#EF4444",
      couleurSecondaire: "#DC2626",
      couleurAccent: "#B91C1C",
      icon: Stethoscope,
      gradientClasses: "from-red-500 to-red-700",
      backgroundClasses: "bg-red-50"
    },
    isActive: true,
    dateCreation: "2025-01-01"
  },

  CENAREST: {
    id: "e1_009",
    code: "CENAREST",
    nom: "Centre National de la Recherche Scientifique et Technologique",
    nomCourt: "CENAREST",
    sigle: "CENAREST",
    groupe: "E",
    sousGroupe: "E1",
    type: "AGENCE_SPECIALISEE",
    mission: "Coordination et développement de la recherche scientifique nationale",
    attributions: [
      "Coordination de la recherche nationale",
      "Gestion des instituts de recherche",
      "Promotion de l'innovation",
      "Valorisation de la recherche",
      "Coopération scientifique"
    ],
    services: ["Institut de recherche", "Service valorisation", "Service documentation", "Service coopération"],
    adresse: "Cité de la Démocratie",
    ville: "Libreville",
    province: "Estuaire",
    niveau: 3,
    parentId: "MIN_ENS_SUP",
    flux: {
      hierarchiquesDescendants: [],
      hierarchiquesAscendants: ["MIN_ENS_SUP"],
      horizontauxInterministeriels: ["MIN_INDUSTRIE", "MIN_SANTE", "MIN_ENVIRONNEMENT", "UOB"],
      transversauxSIG: ["ADMIN.GA"]
    },
    branding: {
      couleurPrimaire: "#9333EA",
      couleurSecondaire: "#7C3AED",
      couleurAccent: "#6D28D9",
      icon: Cpu,
      gradientClasses: "from-purple-600 to-purple-800",
      backgroundClasses: "bg-purple-50"
    },
    isActive: true,
    dateCreation: "2025-01-01"
  },

  // ==================== POUVOIR LÉGISLATIF (GROUPE L - nouveau) ====================

  ASSEMBLEE_NATIONALE: {
    id: "l1_001",
    code: "ASSEMBLEE_NATIONALE",
    nom: "Assemblée Nationale du Gabon",
    nomCourt: "Assemblée Nationale",
    sigle: "AN",
    groupe: "L",
    sousGroupe: "L1",
    type: "INSTITUTION_LEGISLATIVE",
    mission: "Représentation du peuple, vote des lois et contrôle de l'action gouvernementale",
    attributions: [
      "Vote des lois",
      "Vote du budget de l'État",
      "Contrôle de l'action gouvernementale",
      "Questions au gouvernement",
      "Commissions d'enquête parlementaires"
    ],
    services: ["Secrétariat Général", "Services législatifs", "Services financiers", "Services techniques"],
    adresse: "Boulevard Triomphal",
    ville: "Libreville",
    province: "Estuaire",
    niveau: 1,
    flux: {
      hierarchiquesDescendants: [],
      hierarchiquesAscendants: [],
      horizontauxInterministeriels: ["SENAT", "PRIMATURE", "MIN_JUSTICE"],
      transversauxSIG: ["ADMIN.GA"]
    },
    branding: {
      couleurPrimaire: "#B91C1C",
      couleurSecondaire: "#991B1B",
      couleurAccent: "#7F1D1D",
      icon: Landmark,
      gradientClasses: "from-red-700 to-red-900",
      backgroundClasses: "bg-red-50"
    },
    isActive: true,
    dateCreation: "2025-01-01"
  },

  SENAT: {
    id: "l1_002",
    code: "SENAT",
    nom: "Sénat du Gabon",
    nomCourt: "Sénat",
    sigle: "SEN",
    groupe: "L",
    sousGroupe: "L1",
    type: "INSTITUTION_LEGISLATIVE",
    mission: "Représentation des collectivités territoriales et examen des lois",
    attributions: [
      "Examen des projets de lois en deuxième lecture",
      "Représentation des collectivités territoriales",
      "Avis consultatifs",
      "Contrôle parlementaire",
      "Médiation institutionnelle"
    ],
    services: ["Secrétariat Général", "Services consultatifs", "Services administratifs"],
    adresse: "Boulevard Omar Bongo",
    ville: "Libreville",
    province: "Estuaire",
    niveau: 1,
    flux: {
      hierarchiquesDescendants: [],
      hierarchiquesAscendants: [],
      horizontauxInterministeriels: ["ASSEMBLEE_NATIONALE", "PRIMATURE", "MIN_INTERIEUR"],
      transversauxSIG: ["ADMIN.GA"]
    },
    branding: {
      couleurPrimaire: "#1E40AF",
      couleurSecondaire: "#1E3A8A",
      couleurAccent: "#1E3A8A",
      icon: Landmark,
      gradientClasses: "from-blue-800 to-blue-900",
      backgroundClasses: "bg-blue-50"
    },
    isActive: true,
    dateCreation: "2025-01-01"
  },

  // ==================== INSTITUTIONS JUDICIAIRES (GROUPE F) ====================

  COUR_CONSTITUTIONNELLE: {
    id: "f1_001",
    code: "COUR_CONSTITUTIONNELLE",
    nom: "Cour Constitutionnelle du Gabon",
    nomCourt: "Cour Constitutionnelle",
    sigle: "CC",
    groupe: "F",
    sousGroupe: "F1",
    type: "INSTITUTION_JUDICIAIRE",
    sousType: "JURIDICTION_SUPREME",
    mission: "Gardienne de la Constitution et arbitre du fonctionnement des institutions",
    attributions: [
      "Contrôle de constitutionnalité des lois",
      "Contentieux électoral",
      "Validation des élections présidentielles",
      "Règlement des conflits entre institutions",
      "Interprétation de la Constitution"
    ],
    services: ["Greffe", "Service juridique", "Service documentation", "Service administratif"],
    adresse: "Boulevard Léon MBA",
    ville: "Libreville",
    province: "Estuaire",
    niveau: 1,
    flux: {
      hierarchiquesDescendants: [],
      hierarchiquesAscendants: [],
      horizontauxInterministeriels: ["COUR_CASSATION", "CONSEIL_ETAT", "PRESIDENCE"],
      transversauxSIG: ["ADMIN.GA"]
    },
    branding: {
      couleurPrimaire: "#7C2D12",
      couleurSecondaire: "#9A3412",
      couleurAccent: "#C2410C",
      icon: Scale,
      gradientClasses: "from-orange-800 to-orange-900",
      backgroundClasses: "bg-orange-50"
    },
    isActive: true,
    dateCreation: "2025-01-01"
  },

  COUR_CASSATION: {
    id: "f1_002",
    code: "COUR_CASSATION",
    nom: "Cour de Cassation du Gabon",
    nomCourt: "Cour de Cassation",
    sigle: "CC",
    groupe: "F",
    sousGroupe: "F1",
    type: "INSTITUTION_JUDICIAIRE",
    sousType: "JURIDICTION_SUPREME",
    mission: "Plus haute juridiction de l'ordre judiciaire",
    attributions: [
      "Recours en cassation",
      "Unification de la jurisprudence",
      "Chambres civile, commerciale, sociale et pénale",
      "Formation des magistrats",
      "Discipline des magistrats"
    ],
    services: ["Greffe central", "Chambres spécialisées", "Service documentation", "Service formation"],
    adresse: "Cité de la Démocratie",
    ville: "Libreville",
    province: "Estuaire",
    niveau: 2,
    parentId: "MIN_JUSTICE",
    flux: {
      hierarchiquesDescendants: ["CA_LIBREVILLE", "CA_FRANCEVILLE", "CA_PORT_GENTIL"],
      hierarchiquesAscendants: ["MIN_JUSTICE"],
      horizontauxInterministeriels: ["CONSEIL_ETAT", "COUR_COMPTES"],
      transversauxSIG: ["ADMIN.GA", "CASIER_JUDICIAIRE"]
    },
    branding: {
      couleurPrimaire: "#6B21A8",
      couleurSecondaire: "#581C87",
      couleurAccent: "#4C1D95",
      icon: Gavel,
      gradientClasses: "from-purple-700 to-purple-900",
      backgroundClasses: "bg-purple-50"
    },
    isActive: true,
    dateCreation: "2025-01-01"
  },

  CONSEIL_ETAT: {
    id: "f1_003",
    code: "CONSEIL_ETAT",
    nom: "Conseil d'État du Gabon",
    nomCourt: "Conseil d'État",
    sigle: "CE",
    groupe: "F",
    sousGroupe: "F1",
    type: "INSTITUTION_JUDICIAIRE",
    sousType: "JURIDICTION_SUPREME",
    mission: "Plus haute juridiction de l'ordre administratif",
    attributions: [
      "Contentieux administratif",
      "Recours contre les décisions administratives",
      "Avis consultatifs au Gouvernement",
      "Contrôle de légalité",
      "Règlement des conflits administratifs"
    ],
    services: ["Greffe", "Chambres administratives", "Service consultatif", "Service contentieux"],
    adresse: "Cité de la Démocratie",
    ville: "Libreville",
    province: "Estuaire",
    niveau: 2,
    parentId: "MIN_JUSTICE",
    flux: {
      hierarchiquesDescendants: [],
      hierarchiquesAscendants: ["MIN_JUSTICE"],
      horizontauxInterministeriels: ["COUR_CASSATION", "COUR_COMPTES", "PRIMATURE"],
      transversauxSIG: ["ADMIN.GA"]
    },
    branding: {
      couleurPrimaire: "#0891B2",
      couleurSecondaire: "#0E7490",
      couleurAccent: "#155E75",
      icon: Shield,
      gradientClasses: "from-cyan-600 to-cyan-800",
      backgroundClasses: "bg-cyan-50"
    },
    isActive: true,
    dateCreation: "2025-01-01"
  },

  COUR_COMPTES: {
    id: "f1_004",
    code: "COUR_COMPTES",
    nom: "Cour des Comptes du Gabon",
    nomCourt: "Cour des Comptes",
    sigle: "CC",
    groupe: "F",
    sousGroupe: "F1",
    type: "INSTITUTION_JUDICIAIRE",
    sousType: "JURIDICTION_SUPREME",
    mission: "Contrôle des finances publiques et audit des comptes publics",
    attributions: [
      "Contrôle des comptes publics",
      "Audit des entreprises publiques",
      "Jugement des comptes des comptables publics",
      "Certification des comptes de l'État",
      "Évaluation des politiques publiques"
    ],
    services: ["Chambres régionales", "Service audit", "Service contrôle", "Greffe"],
    adresse: "Boulevard de l'Indépendance",
    ville: "Libreville",
    province: "Estuaire",
    niveau: 1,
    flux: {
      hierarchiquesDescendants: [],
      hierarchiquesAscendants: [],
      horizontauxInterministeriels: ["MIN_ECONOMIE", "MIN_BUDGET", "MIN_COMPTES_PUBLICS", "ASSEMBLEE_NATIONALE"],
      transversauxSIG: ["SIGEFI", "ADMIN.GA"]
    },
    branding: {
      couleurPrimaire: "#EA580C",
      couleurSecondaire: "#DC2626",
      couleurAccent: "#B91C1C",
      icon: Calculator,
      gradientClasses: "from-orange-600 to-red-700",
      backgroundClasses: "bg-orange-50"
    },
    isActive: true,
    dateCreation: "2025-01-01"
  },

  // ==================== INSTITUTIONS INDÉPENDANTES ====================

  CGE: {
    id: "i1_001",
    code: "CGE",
    nom: "Centre Gabonais des Élections",
    nomCourt: "CGE",
    sigle: "CGE",
    groupe: "I",
    sousGroupe: "I1",
    type: "INSTITUTION_ELECTORALE",
    mission: "Organisation et supervision des élections au Gabon",
    attributions: [
      "Organisation des élections",
      "Gestion des listes électorales",
      "Délivrance des cartes d'électeur",
      "Formation des agents électoraux",
      "Supervision du processus électoral"
    ],
    services: ["Service électoral", "Service informatique", "Service logistique", "Service formation"],
    adresse: "Avenue du Colonel Parant",
    ville: "Libreville",
    province: "Estuaire",
    niveau: 1,
    flux: {
      hierarchiquesDescendants: [],
      hierarchiquesAscendants: [],
      horizontauxInterministeriels: ["MIN_INTERIEUR", "COUR_CONSTITUTIONNELLE", "DGDI"],
      transversauxSIG: ["ADMIN.GA", "SIG_IDENTITE"]
    },
    branding: {
      couleurPrimaire: "#16A34A",
      couleurSecondaire: "#15803D",
      couleurAccent: "#166534",
      icon: Vote,
      gradientClasses: "from-green-600 to-green-800",
      backgroundClasses: "bg-green-50"
    },
    isActive: true,
    dateCreation: "2025-01-01"
  },

  // ==================== COURS D'APPEL (GROUPE F) ====================

  CA_LIBREVILLE: {
    id: "f2_001",
    code: "CA_LIBREVILLE",
    nom: "Cour d'Appel de Libreville",
    nomCourt: "CA Libreville",
    sigle: "CAL",
    groupe: "F",
    sousGroupe: "F2",
    type: "INSTITUTION_JUDICIAIRE",
    sousType: "COUR_APPEL",
    mission: "Juridiction d'appel pour la province de l'Estuaire",
    attributions: [
      "Jugement en appel des décisions de première instance",
      "Chambres civile, correctionnelle et sociale",
      "Supervision des tribunaux de la province",
      "Formation continue des magistrats"
    ],
    services: ["Greffe", "Chambres", "Parquet Général", "Service administratif"],
    adresse: "Cité Judiciaire",
    ville: "Libreville",
    province: "Estuaire",
    niveau: 3,
    parentId: "COUR_CASSATION",
    flux: {
      hierarchiquesDescendants: ["TPI_LIBREVILLE"],
      hierarchiquesAscendants: ["COUR_CASSATION"],
      horizontauxInterministeriels: ["CA_PORT_GENTIL", "CA_FRANCEVILLE"],
      transversauxSIG: ["CASIER_JUDICIAIRE", "ADMIN.GA"]
    },
    branding: {
      couleurPrimaire: "#4B5563",
      couleurSecondaire: "#374151",
      couleurAccent: "#1F2937",
      icon: Scale,
      gradientClasses: "from-gray-600 to-gray-800",
      backgroundClasses: "bg-gray-50"
    },
    isActive: true,
    dateCreation: "2025-01-01"
  },

  CA_FRANCEVILLE: {
    id: "f2_002",
    code: "CA_FRANCEVILLE",
    nom: "Cour d'Appel de Franceville",
    nomCourt: "CA Franceville",
    sigle: "CAF",
    groupe: "F",
    sousGroupe: "F2",
    type: "INSTITUTION_JUDICIAIRE",
    sousType: "COUR_APPEL",
    mission: "Juridiction d'appel pour la province du Haut-Ogooué",
    attributions: [
      "Jugement en appel des décisions de première instance",
      "Chambres civile, correctionnelle et sociale",
      "Supervision des tribunaux de la province",
      "Adaptation aux spécificités locales"
    ],
    services: ["Greffe", "Chambres", "Parquet Général", "Service administratif"],
    adresse: "Centre-ville",
    ville: "Franceville",
    province: "Haut-Ogooué",
    niveau: 3,
    parentId: "COUR_CASSATION",
    flux: {
      hierarchiquesDescendants: ["TPI_FRANCEVILLE"],
      hierarchiquesAscendants: ["COUR_CASSATION"],
      horizontauxInterministeriels: ["CA_LIBREVILLE", "CA_PORT_GENTIL"],
      transversauxSIG: ["CASIER_JUDICIAIRE", "ADMIN.GA"]
    },
    branding: {
      couleurPrimaire: "#4B5563",
      couleurSecondaire: "#374151",
      couleurAccent: "#1F2937",
      icon: Scale,
      gradientClasses: "from-gray-600 to-gray-800",
      backgroundClasses: "bg-gray-50"
    },
    isActive: true,
    dateCreation: "2025-01-01"
  },

  CA_PORT_GENTIL: {
    id: "f2_003",
    code: "CA_PORT_GENTIL",
    nom: "Cour d'Appel de Port-Gentil",
    nomCourt: "CA Port-Gentil",
    sigle: "CAPG",
    groupe: "F",
    sousGroupe: "F2",
    type: "INSTITUTION_JUDICIAIRE",
    sousType: "COUR_APPEL",
    mission: "Juridiction d'appel pour la province de l'Ogooué-Maritime",
    attributions: [
      "Jugement en appel des décisions de première instance",
      "Chambres civile, correctionnelle et sociale",
      "Contentieux pétrolier et maritime",
      "Supervision des tribunaux de la province"
    ],
    services: ["Greffe", "Chambres", "Parquet Général", "Service administratif"],
    adresse: "Centre judiciaire",
    ville: "Port-Gentil",
    province: "Ogooué-Maritime",
    niveau: 3,
    parentId: "COUR_CASSATION",
    flux: {
      hierarchiquesDescendants: ["TPI_PORT_GENTIL"],
      hierarchiquesAscendants: ["COUR_CASSATION"],
      horizontauxInterministeriels: ["CA_LIBREVILLE", "CA_FRANCEVILLE"],
      transversauxSIG: ["CASIER_JUDICIAIRE", "ADMIN.GA"]
    },
    branding: {
      couleurPrimaire: "#4B5563",
      couleurSecondaire: "#374151",
      couleurAccent: "#1F2937",
      icon: Scale,
      gradientClasses: "from-gray-600 to-gray-800",
      backgroundClasses: "bg-gray-50"
    },
    isActive: true,
    dateCreation: "2025-01-01"
  }
};
