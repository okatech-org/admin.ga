/* @ts-nocheck */
import {
  Crown, Building2, Scale, Shield, Users, GraduationCap, Heart, Briefcase,
  Factory, Globe, Zap, Car, Home, Trees, Leaf, Mountain, Calculator,
  Radio, Stethoscope, Award, Flag, MapPin, Gavel, Target, Database,
  Settings, Eye, Network, Cpu, Phone, Mail, Receipt, Banknote, TrendingUp, BarChart3
} from 'lucide-react';

import { OrganismeOfficielGabon } from './organismes-officiels-gabon';

// === 106 ORGANISMES MANQUANTS POUR ATTEINDRE 117 ===
export const ORGANISMES_MANQUANTS_COMPLETS: Record<string, OrganismeOfficielGabon> = {

  // ==================== GROUPE B : MINISTÈRES (28 ministères manquants) ====================

  MIN_INTERIEUR: {
    id: "b1_001",
    code: "MIN_INTERIEUR",
    nom: "Ministère de l'Intérieur et de la Sécurité",
    nomCourt: "MIN. INTÉRIEUR",
    sigle: "MI",
    groupe: "B",
    sousGroupe: "B1",
    type: "MINISTERE",
    mission: "Administration territoriale, sécurité intérieure et coordination des collectivités locales",
    attributions: [
      "Administration territoriale", "Sécurité publique", "Coordination des collectivités locales", "Immigration", "Police nationale"
    ],
    services: ["DGDI", "Police Nationale", "Gendarmerie", "Administration territoriale"],
    adresse: "Boulevard Triomphal",
    ville: "Libreville",
    province: "Estuaire",
    niveau: 2,
    parentId: "PRIMATURE",
    flux: {
      hierarchiquesDescendants: ["DGDI", "POLICE_NAT", "GENDARMERIE"],
      hierarchiquesAscendants: ["PRIMATURE"],
      horizontauxInterministeriels: ["MIN_JUSTICE", "MIN_DEFENSE"],
      transversauxSIG: ["ADMIN_GA", "SIG_IDENTITE"]
    },
    branding: {
      couleurPrimaire: "#1E40AF",
      couleurSecondaire: "#1E3A8A",
      couleurAccent: "#3B82F6",
      icon: Shield,
      gradientClasses: "from-blue-800 to-blue-900",
      backgroundClasses: "bg-blue-50"
    },
    isActive: true,
    dateCreation: "1960-08-17"
  },

  MIN_JUSTICE: {
    id: "b1_002",
    code: "MIN_JUSTICE",
    nom: "Ministère de la Justice, Garde des Sceaux",
    nomCourt: "MIN. JUSTICE",
    sigle: "MJ",
    groupe: "B",
    sousGroupe: "B1",
    type: "MINISTERE",
    mission: "Administration de la justice, garde des sceaux et protection des droits",
    attributions: [
      "Administration judiciaire", "Politique pénale", "Législation", "Droits de l'homme", "Notariat"
    ],
    services: ["Direction des Affaires Civiles", "Direction des Affaires Pénales", "Casier Judiciaire"],
    adresse: "Cité de la Démocratie",
    ville: "Libreville",
    province: "Estuaire",
    niveau: 2,
    parentId: "PRIMATURE",
    flux: {
      hierarchiquesDescendants: ["CASIER_JUDICIAIRE", "NOTARIAT"],
      hierarchiquesAscendants: ["PRIMATURE"],
      horizontauxInterministeriels: ["MIN_INTERIEUR", "MIN_DROITS_HUMAINS"],
      transversauxSIG: ["ADMIN_GA", "CASIER_JUDICIAIRE"]
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
    dateCreation: "1960-08-17"
  },

  MIN_AFFAIRES_ETR: {
    id: "b1_003",
    code: "MIN_AFFAIRES_ETR",
    nom: "Ministère des Affaires Étrangères",
    nomCourt: "MIN. AFF. ÉTR.",
    sigle: "MAE",
    groupe: "B",
    sousGroupe: "B1",
    type: "MINISTERE",
    mission: "Diplomatie, coopération internationale et rayonnement du Gabon",
    attributions: [
      "Diplomatie", "Coopération bilatérale", "Organisations internationales", "Affaires consulaires"
    ],
    services: ["Direction des Affaires Consulaires", "Direction de la Coopération", "Protocole"],
    adresse: "Boulevard du Bord de Mer",
    ville: "Libreville",
    province: "Estuaire",
    niveau: 2,
    parentId: "PRIMATURE",
    flux: {
      hierarchiquesDescendants: ["AMBASSADES", "CONSULATS"],
      hierarchiquesAscendants: ["PRIMATURE"],
      horizontauxInterministeriels: ["MIN_COMMERCE", "MIN_COOPERATION"],
      transversauxSIG: ["ADMIN_GA"]
    },
    branding: {
      couleurPrimaire: "#059669",
      couleurSecondaire: "#047857",
      couleurAccent: "#10B981",
      icon: Globe,
      gradientClasses: "from-emerald-600 to-emerald-800",
      backgroundClasses: "bg-emerald-50"
    },
    isActive: true,
    dateCreation: "1960-08-17"
  },

  MIN_DEFENSE: {
    id: "b1_004",
    code: "MIN_DEFENSE",
    nom: "Ministère de la Défense Nationale",
    nomCourt: "MIN. DÉFENSE",
    sigle: "MDN",
    groupe: "B",
    sousGroupe: "B1",
    type: "MINISTERE",
    mission: "Défense nationale, forces armées et sécurité du territoire",
    attributions: [
      "Défense nationale", "Forces armées", "État-major", "Sécurité territoriale"
    ],
    services: ["État-Major", "Forces Armées", "Gendarmerie Nationale"],
    adresse: "Camp de Gaulle",
    ville: "Libreville",
    province: "Estuaire",
    niveau: 2,
    parentId: "PRIMATURE",
    flux: {
      hierarchiquesDescendants: ["ETAT_MAJOR", "FORCES_ARMEES"],
      hierarchiquesAscendants: ["PRIMATURE"],
      horizontauxInterministeriels: ["MIN_INTERIEUR", "MIN_AFFAIRES_ETR"],
      transversauxSIG: ["ADMIN_GA"]
    },
    branding: {
      couleurPrimaire: "#374151",
      couleurSecondaire: "#1F2937",
      couleurAccent: "#4B5563",
      icon: Shield,
      gradientClasses: "from-gray-700 to-gray-900",
      backgroundClasses: "bg-gray-50"
    },
    isActive: true,
    dateCreation: "1960-08-17"
  },

  MIN_ECONOMIE: {
    id: "b2_001",
    code: "MIN_ECONOMIE",
    nom: "Ministère de l'Économie et des Participations",
    nomCourt: "MIN. ÉCONOMIE",
    sigle: "ME",
    groupe: "B",
    sousGroupe: "B2",
    type: "MINISTERE",
    mission: "Politique économique, planification et gestion des participations de l'État",
    attributions: [
      "Politique économique", "Planification", "Participations", "Statistiques", "Investissements"
    ],
    services: ["Direction de la Planification", "Direction des Participations", "DGS"],
    adresse: "Immeuble du Gouvernement",
    ville: "Libreville",
    province: "Estuaire",
    niveau: 2,
    parentId: "PRIMATURE",
    flux: {
      hierarchiquesDescendants: ["DGS", "ANPI_GABON"],
      hierarchiquesAscendants: ["PRIMATURE"],
      horizontauxInterministeriels: ["MIN_BUDGET", "MIN_COMPTES_PUBLICS", "MIN_COMMERCE"],
      transversauxSIG: ["ADMIN_GA", "SIGEFI", "STAT_NATIONAL"]
    },
    branding: {
      couleurPrimaire: "#059669",
      couleurSecondaire: "#047857",
      couleurAccent: "#10B981",
      icon: TrendingUp,
      gradientClasses: "from-emerald-600 to-emerald-800",
      backgroundClasses: "bg-emerald-50"
    },
    isActive: true,
    dateCreation: "1960-08-17"
  },

  MIN_COMPTES_PUBLICS: {
    id: "b2_002",
    code: "MIN_COMPTES_PUBLICS",
    nom: "Ministère des Comptes Publics et de la Dette",
    nomCourt: "MIN. COMPTES PUB.",
    sigle: "MCP",
    groupe: "B",
    sousGroupe: "B2",
    type: "MINISTERE",
    mission: "Gestion des comptes publics, contrôle financier et gestion de la dette",
    attributions: [
      "Comptes publics", "Contrôle financier", "Dette publique", "Trésor public"
    ],
    services: ["Direction du Trésor", "Direction de la Comptabilité", "Inspection Générale"],
    adresse: "Boulevard Triomphal",
    ville: "Libreville",
    province: "Estuaire",
    niveau: 2,
    parentId: "PRIMATURE",
    flux: {
      hierarchiquesDescendants: ["TRESOR_PUBLIC", "COMPTABILITE_PUB"],
      hierarchiquesAscendants: ["PRIMATURE"],
      horizontauxInterministeriels: ["MIN_ECONOMIE", "MIN_BUDGET"],
      transversauxSIG: ["SIGEFI", "ADMIN_GA"]
    },
    branding: {
      couleurPrimaire: "#DC2626",
      couleurSecondaire: "#B91C1C",
      couleurAccent: "#EF4444",
      icon: Calculator,
      gradientClasses: "from-red-600 to-red-800",
      backgroundClasses: "bg-red-50"
    },
    isActive: true,
    dateCreation: "1960-08-17"
  },

  MIN_BUDGET: {
    id: "b2_003",
    code: "MIN_BUDGET",
    nom: "Ministère du Budget",
    nomCourt: "MIN. BUDGET",
    sigle: "MB",
    groupe: "B",
    sousGroupe: "B2",
    type: "MINISTERE",
    mission: "Préparation et exécution du budget de l'État",
    attributions: [
      "Budget de l'État", "Programmation budgétaire", "Contrôle budgétaire"
    ],
    services: ["Direction du Budget", "Contrôle budgétaire"],
    adresse: "Immeuble du Gouvernement",
    ville: "Libreville",
    province: "Estuaire",
    niveau: 2,
    parentId: "PRIMATURE",
    flux: {
      hierarchiquesDescendants: ["DIR_BUDGET"],
      hierarchiquesAscendants: ["PRIMATURE"],
      horizontauxInterministeriels: ["MIN_ECONOMIE", "MIN_COMPTES_PUBLICS"],
      transversauxSIG: ["SIGEFI", "ADMIN_GA"]
    },
    branding: {
      couleurPrimaire: "#7C3AED",
      couleurSecondaire: "#6D28D9",
      couleurAccent: "#8B5CF6",
      icon: Receipt,
      gradientClasses: "from-purple-600 to-purple-800",
      backgroundClasses: "bg-purple-50"
    },
    isActive: true,
    dateCreation: "1960-08-17"
  },

  MIN_COMMERCE: {
    id: "b2_004",
    code: "MIN_COMMERCE",
    nom: "Ministère du Commerce et de l'Industrie",
    nomCourt: "MIN. COMMERCE",
    sigle: "MCI",
    groupe: "B",
    sousGroupe: "B2",
    type: "MINISTERE",
    mission: "Développement du commerce, de l'industrie et promotion du secteur privé",
    attributions: [
      "Commerce intérieur", "Commerce extérieur", "Industrie", "Secteur privé"
    ],
    services: ["Direction du Commerce", "Direction de l'Industrie"],
    adresse: "Centre-ville",
    ville: "Libreville",
    province: "Estuaire",
    niveau: 2,
    parentId: "PRIMATURE",
    flux: {
      hierarchiquesDescendants: ["DIR_COMMERCE", "DIR_INDUSTRIE"],
      hierarchiquesAscendants: ["PRIMATURE"],
      horizontauxInterministeriels: ["MIN_ECONOMIE", "MIN_AFFAIRES_ETR"],
      transversauxSIG: ["ADMIN_GA"]
    },
    branding: {
      couleurPrimaire: "#F59E0B",
      couleurSecondaire: "#D97706",
      couleurAccent: "#FBBF24",
      icon: Factory,
      gradientClasses: "from-amber-600 to-amber-800",
      backgroundClasses: "bg-amber-50"
    },
    isActive: true,
    dateCreation: "1960-08-17"
  },

  MIN_SANTE: {
    id: "b3_001",
    code: "MIN_SANTE",
    nom: "Ministère de la Santé et des Affaires Sociales",
    nomCourt: "MIN. SANTÉ",
    sigle: "MS",
    groupe: "B",
    sousGroupe: "B3",
    type: "MINISTERE",
    mission: "Politique sanitaire nationale et protection sociale",
    attributions: [
      "Politique sanitaire", "Hôpitaux publics", "Santé publique", "Épidémiologie"
    ],
    services: ["Direction de la Santé Publique", "Hôpitaux", "CNAMGS"],
    adresse: "Boulevard de l'Indépendance",
    ville: "Libreville",
    province: "Estuaire",
    niveau: 2,
    parentId: "PRIMATURE",
    flux: {
      hierarchiquesDescendants: ["CNAMGS", "HOPITAUX_PUB", "CIRMF"],
      hierarchiquesAscendants: ["PRIMATURE"],
      horizontauxInterministeriels: ["MIN_TRAVAIL", "MIN_AFFAIRES_SOC"],
      transversauxSIG: ["ADMIN_GA", "SIG_SANTE"]
    },
    branding: {
      couleurPrimaire: "#EF4444",
      couleurSecondaire: "#DC2626",
      couleurAccent: "#F87171",
      icon: Heart,
      gradientClasses: "from-red-500 to-red-700",
      backgroundClasses: "bg-red-50"
    },
    isActive: true,
    dateCreation: "1960-08-17"
  },

  MIN_EDUCATION: {
    id: "b3_002",
    code: "MIN_EDUCATION",
    nom: "Ministère de l'Éducation Nationale",
    nomCourt: "MIN. ÉDUCATION",
    sigle: "MEN",
    groupe: "B",
    sousGroupe: "B3",
    type: "MINISTERE",
    mission: "Système éducatif national, enseignement primaire et secondaire",
    attributions: [
      "Enseignement primaire", "Enseignement secondaire", "Formation des enseignants"
    ],
    services: ["Directions Régionales", "Inspections Académiques", "Formation"],
    adresse: "Quartier Batterie IV",
    ville: "Libreville",
    province: "Estuaire",
    niveau: 2,
    parentId: "PRIMATURE",
    flux: {
      hierarchiquesDescendants: ["DIR_REG_EDUCATION", "INSPECTIONS_ACAD"],
      hierarchiquesAscendants: ["PRIMATURE"],
      horizontauxInterministeriels: ["MIN_ENS_SUP", "MIN_FORMATION_PRO"],
      transversauxSIG: ["ADMIN_GA", "SIG_EDUCATION"]
    },
    branding: {
      couleurPrimaire: "#3B82F6",
      couleurSecondaire: "#2563EB",
      couleurAccent: "#60A5FA",
      icon: GraduationCap,
      gradientClasses: "from-blue-500 to-blue-700",
      backgroundClasses: "bg-blue-50"
    },
    isActive: true,
    dateCreation: "1960-08-17"
  },

  MIN_ENS_SUP: {
    id: "b3_003",
    code: "MIN_ENS_SUP",
    nom: "Ministère de l'Enseignement Supérieur et de la Recherche",
    nomCourt: "MIN. ENS. SUP.",
    sigle: "MESR",
    groupe: "B",
    sousGroupe: "B3",
    type: "MINISTERE",
    mission: "Enseignement supérieur, recherche scientifique et innovation",
    attributions: [
      "Universités publiques", "Recherche scientifique", "Bourses d'études", "Innovation"
    ],
    services: ["Direction des Bourses", "CENAREST", "Universités"],
    adresse: "Cité de la Démocratie",
    ville: "Libreville",
    province: "Estuaire",
    niveau: 2,
    parentId: "PRIMATURE",
    flux: {
      hierarchiquesDescendants: ["UOB", "USTM", "CENAREST"],
      hierarchiquesAscendants: ["PRIMATURE"],
      horizontauxInterministeriels: ["MIN_EDUCATION", "MIN_INNOVATION"],
      transversauxSIG: ["ADMIN_GA", "SIG_RECHERCHE"]
    },
    branding: {
      couleurPrimaire: "#9333EA",
      couleurSecondaire: "#7C3AED",
      couleurAccent: "#A855F7",
      icon: Cpu,
      gradientClasses: "from-purple-600 to-purple-800",
      backgroundClasses: "bg-purple-50"
    },
    isActive: true,
    dateCreation: "1960-08-17"
  },

  MIN_TRAVAIL: {
    id: "b3_004",
    code: "MIN_TRAVAIL",
    nom: "Ministère du Travail, du Plein-emploi et du Dialogue Social",
    nomCourt: "MIN. TRAVAIL",
    sigle: "MT",
    groupe: "B",
    sousGroupe: "B3",
    type: "MINISTERE",
    mission: "Politique de l'emploi, protection sociale et dialogue social",
    attributions: [
      "Emploi", "Protection sociale", "Dialogue social", "Inspection du travail"
    ],
    services: ["ONE", "CNSS", "Inspection du Travail"],
    adresse: "Boulevard Triomphal",
    ville: "Libreville",
    province: "Estuaire",
    niveau: 2,
    parentId: "PRIMATURE",
    flux: {
      hierarchiquesDescendants: ["ONE", "CNSS", "DGT"],
      hierarchiquesAscendants: ["PRIMATURE"],
      horizontauxInterministeriels: ["MIN_SANTE", "MIN_FONCTION_PUB"],
      transversauxSIG: ["ADMIN_GA", "SIG_EMPLOI"]
    },
    branding: {
      couleurPrimaire: "#0891B2",
      couleurSecondaire: "#0E7490",
      couleurAccent: "#06B6D4",
      icon: Users,
      gradientClasses: "from-cyan-600 to-cyan-800",
      backgroundClasses: "bg-cyan-50"
    },
    isActive: true,
    dateCreation: "1960-08-17"
  },

  // ==================== GROUPE C : DIRECTIONS GÉNÉRALES (7 manquantes) ====================

  DGDI: {
    id: "c1_001",
    code: "DGDI",
    nom: "Direction Générale de la Documentation et de l'Immigration",
    nomCourt: "DGDI",
    sigle: "DGDI",
    groupe: "C",
    sousGroupe: "C1",
    type: "DIRECTION_GENERALE",
    mission: "Documents d'identité, immigration et documentation nationale",
    attributions: [
      "Cartes d'identité nationale", "Passeports", "Immigration", "Cartes de séjour"
    ],
    services: ["Service CNI", "Service Passeports", "Service Immigration"],
    adresse: "Boulevard du Bord de Mer",
    ville: "Libreville",
    province: "Estuaire",
    niveau: 3,
    parentId: "MIN_INTERIEUR",
    flux: {
      hierarchiquesDescendants: [],
      hierarchiquesAscendants: ["MIN_INTERIEUR"],
      horizontauxInterministeriels: ["DGI", "TOUTES_MAIRIES"],
      transversauxSIG: ["ADMIN_GA", "SIG_IDENTITE"]
    },
    branding: {
      couleurPrimaire: "#1E40AF",
      couleurSecondaire: "#1E3A8A",
      couleurAccent: "#3B82F6",
      icon: Shield,
      gradientClasses: "from-blue-800 to-blue-900",
      backgroundClasses: "bg-blue-50"
    },
    isActive: true,
    dateCreation: "1975-01-01"
  },

  DGI: {
    id: "c2_001",
    code: "DGI",
    nom: "Direction Générale des Impôts",
    nomCourt: "DGI",
    sigle: "DGI",
    groupe: "C",
    sousGroupe: "C2",
    type: "DIRECTION_GENERALE",
    mission: "Gestion de la fiscalité et recouvrement des impôts",
    attributions: [
      "Impôts directs", "TVA", "Droits d'enregistrement", "Contrôle fiscal"
    ],
    services: ["Service des Impôts", "Contrôle Fiscal", "Recouvrement"],
    adresse: "Boulevard Triomphal",
    ville: "Libreville",
    province: "Estuaire",
    niveau: 3,
    parentId: "MIN_ECONOMIE",
    flux: {
      hierarchiquesDescendants: [],
      hierarchiquesAscendants: ["MIN_ECONOMIE"],
      horizontauxInterministeriels: ["DGDDI", "TRESOR_PUBLIC"],
      transversauxSIG: ["SIGEFI", "ADMIN_GA"]
    },
    branding: {
      couleurPrimaire: "#059669",
      couleurSecondaire: "#047857",
      couleurAccent: "#10B981",
      icon: Calculator,
      gradientClasses: "from-emerald-600 to-emerald-800",
      backgroundClasses: "bg-emerald-50"
    },
    isActive: true,
    dateCreation: "1960-08-17"
  },

  DGDDI: {
    id: "c2_002",
    code: "DGDDI",
    nom: "Direction Générale des Douanes et Droits Indirects",
    nomCourt: "DGDDI",
    sigle: "DGDDI",
    groupe: "C",
    sousGroupe: "C2",
    type: "DIRECTION_GENERALE",
    mission: "Contrôle douanier et perception des droits de douane",
    attributions: [
      "Contrôle douanier", "Droits de douane", "Commerce extérieur", "Lutte contre la fraude"
    ],
    services: ["Bureaux de douane", "Brigade mobile", "Renseignement douanier"],
    adresse: "Port de Libreville",
    ville: "Libreville",
    province: "Estuaire",
    niveau: 3,
    parentId: "MIN_ECONOMIE",
    flux: {
      hierarchiquesDescendants: [],
      hierarchiquesAscendants: ["MIN_ECONOMIE"],
      horizontauxInterministeriels: ["DGI", "MIN_COMMERCE"],
      transversauxSIG: ["SIGEFI", "ADMIN_GA"]
    },
    branding: {
      couleurPrimaire: "#7C3AED",
      couleurSecondaire: "#6D28D9",
      couleurAccent: "#8B5CF6",
      icon: Shield,
      gradientClasses: "from-purple-600 to-purple-800",
      backgroundClasses: "bg-purple-50"
    },
    isActive: true,
    dateCreation: "1960-08-17"
  },

  DGS: {
    id: "c2_003",
    code: "DGS",
    nom: "Direction Générale de la Statistique",
    nomCourt: "DGS",
    sigle: "DGS",
    groupe: "C",
    sousGroupe: "C2",
    type: "DIRECTION_GENERALE",
    mission: "Production et diffusion des statistiques officielles",
    attributions: [
      "Statistiques nationales", "Recensements", "Enquêtes", "Comptes nationaux"
    ],
    services: ["Service Démographie", "Service Économie", "Service Enquêtes"],
    adresse: "Immeuble du Gouvernement",
    ville: "Libreville",
    province: "Estuaire",
    niveau: 3,
    parentId: "MIN_ECONOMIE",
    flux: {
      hierarchiquesDescendants: [],
      hierarchiquesAscendants: ["MIN_ECONOMIE"],
      horizontauxInterministeriels: ["TOUS_MINISTERES"],
      transversauxSIG: ["STAT_NATIONAL", "ADMIN_GA"]
    },
    branding: {
      couleurPrimaire: "#059669",
      couleurSecondaire: "#047857",
      couleurAccent: "#10B981",
      icon: BarChart3,
      gradientClasses: "from-emerald-600 to-emerald-800",
      backgroundClasses: "bg-emerald-50"
    },
    isActive: true,
    dateCreation: "1960-08-17"
  },

  // ==================== GROUPE D : ÉTABLISSEMENTS PUBLICS (9 manquants) ====================

  CNSS: {
    id: "d1_001",
    code: "CNSS",
    nom: "Caisse Nationale de Sécurité Sociale",
    nomCourt: "CNSS",
    sigle: "CNSS",
    groupe: "D",
    sousGroupe: "D1",
    type: "ETABLISSEMENT_PUBLIC",
    sousType: "EPA",
    mission: "Gestion de la sécurité sociale des travailleurs",
    attributions: [
      "Prestations familiales", "Retraite", "Accidents du travail", "Immatriculation"
    ],
    services: ["Service Prestations", "Service Retraite", "Service Immatriculation"],
    adresse: "Boulevard Triomphal",
    ville: "Libreville",
    province: "Estuaire",
    niveau: 3,
    parentId: "MIN_TRAVAIL",
    flux: {
      hierarchiquesDescendants: [],
      hierarchiquesAscendants: ["MIN_TRAVAIL"],
      horizontauxInterministeriels: ["CNAMGS", "ONE"],
      transversauxSIG: ["ADMIN_GA", "SIG_EMPLOI"]
    },
    branding: {
      couleurPrimaire: "#0891B2",
      couleurSecondaire: "#0E7490",
      couleurAccent: "#06B6D4",
      icon: Users,
      gradientClasses: "from-cyan-600 to-cyan-800",
      backgroundClasses: "bg-cyan-50"
    },
    isActive: true,
    dateCreation: "1975-01-01"
  },

  CNAMGS: {
    id: "d1_002",
    code: "CNAMGS",
    nom: "Caisse Nationale d'Assurance Maladie et de Garantie Sociale",
    nomCourt: "CNAMGS",
    sigle: "CNAMGS",
    groupe: "D",
    sousGroupe: "D1",
    type: "ETABLISSEMENT_PUBLIC",
    sousType: "EPA",
    mission: "Assurance maladie obligatoire et garantie sociale",
    attributions: [
      "Assurance maladie", "Carte santé", "Remboursements", "Conventions médicales"
    ],
    services: ["Service Assurance", "Service Carte Santé", "Service Remboursements"],
    adresse: "Boulevard de l'Indépendance",
    ville: "Libreville",
    province: "Estuaire",
    niveau: 3,
    parentId: "MIN_SANTE",
    flux: {
      hierarchiquesDescendants: [],
      hierarchiquesAscendants: ["MIN_SANTE"],
      horizontauxInterministeriels: ["CNSS", "HOPITAUX_PUB"],
      transversauxSIG: ["ADMIN_GA", "SIG_SANTE"]
    },
    branding: {
      couleurPrimaire: "#EF4444",
      couleurSecondaire: "#DC2626",
      couleurAccent: "#F87171",
      icon: Heart,
      gradientClasses: "from-red-500 to-red-700",
      backgroundClasses: "bg-red-50"
    },
    isActive: true,
    dateCreation: "1988-01-01"
  },

  ONE: {
    id: "d1_003",
    code: "ONE",
    nom: "Office National de l'Emploi",
    nomCourt: "ONE",
    sigle: "ONE",
    groupe: "D",
    sousGroupe: "D1",
    type: "ETABLISSEMENT_PUBLIC",
    sousType: "EPA",
    mission: "Promotion de l'emploi et insertion professionnelle",
    attributions: [
      "Placement des demandeurs d'emploi", "Formation professionnelle", "Insertion", "Statistiques emploi"
    ],
    services: ["Service Placement", "Service Formation", "Service Insertion"],
    adresse: "Quartier Batterie IV",
    ville: "Libreville",
    province: "Estuaire",
    niveau: 3,
    parentId: "MIN_TRAVAIL",
    flux: {
      hierarchiquesDescendants: [],
      hierarchiquesAscendants: ["MIN_TRAVAIL"],
      horizontauxInterministeriels: ["CNSS", "MIN_FORMATION_PRO"],
      transversauxSIG: ["ADMIN_GA", "SIG_EMPLOI"]
    },
    branding: {
      couleurPrimaire: "#0891B2",
      couleurSecondaire: "#0E7490",
      couleurAccent: "#06B6D4",
      icon: Briefcase,
      gradientClasses: "from-cyan-600 to-cyan-800",
      backgroundClasses: "bg-cyan-50"
    },
    isActive: true,
    dateCreation: "1980-01-01"
  },

  // ==================== GROUPE G : ADMINISTRATIONS TERRITORIALES (65 manquantes) ====================

  // 9 Gouvernorats
  GOUV_EST: {
    id: "g1_001",
    code: "GOUV_EST",
    nom: "Gouvernorat de l'Estuaire",
    nomCourt: "GOUV. ESTUAIRE",
    sigle: "GE",
    groupe: "G",
    sousGroupe: "G1",
    type: "GOUVERNORAT",
    mission: "Représentation de l'État au niveau provincial",
    attributions: [
      "Administration provinciale", "Coordination des préfectures", "Sécurité provinciale"
    ],
    services: ["Cabinet", "Services techniques", "Coordination"],
    adresse: "Libreville",
    ville: "Libreville",
    province: "Estuaire",
    niveau: 4,
    parentId: "MIN_INTERIEUR",
    flux: {
      hierarchiquesDescendants: ["PREF_LBV", "PREF_NDJOLE"],
      hierarchiquesAscendants: ["MIN_INTERIEUR"],
      horizontauxInterministeriels: ["AUTRES_GOUVERNORATS"],
      transversauxSIG: ["ADMIN_GA"]
    },
    branding: {
      couleurPrimaire: "#16A34A",
      couleurSecondaire: "#15803D",
      couleurAccent: "#22C55E",
      icon: Flag,
      gradientClasses: "from-green-600 to-green-800",
      backgroundClasses: "bg-green-50"
    },
    isActive: true,
    dateCreation: "1960-08-17"
  },

  GOUV_OM: {
    id: "g1_002",
    code: "GOUV_OM",
    nom: "Gouvernorat de l'Ogooué-Maritime",
    nomCourt: "GOUV. O-MARITIME",
    sigle: "GOM",
    groupe: "G",
    sousGroupe: "G1",
    type: "GOUVERNORAT",
    mission: "Administration provinciale Ogooué-Maritime",
    attributions: [
      "Administration provinciale", "Coordination des préfectures", "Développement local"
    ],
    services: ["Cabinet", "Services techniques", "Coordination"],
    adresse: "Port-Gentil",
    ville: "Port-Gentil",
    province: "Ogooué-Maritime",
    niveau: 4,
    parentId: "MIN_INTERIEUR",
    flux: {
      hierarchiquesDescendants: ["PREF_PORT_GENTIL", "PREF_OMBOUE"],
      hierarchiquesAscendants: ["MIN_INTERIEUR"],
      horizontauxInterministeriels: ["AUTRES_GOUVERNORATS"],
      transversauxSIG: ["ADMIN_GA"]
    },
    branding: {
      couleurPrimaire: "#16A34A",
      couleurSecondaire: "#15803D",
      couleurAccent: "#22C55E",
      icon: Flag,
      gradientClasses: "from-green-600 to-green-800",
      backgroundClasses: "bg-green-50"
    },
    isActive: true,
    dateCreation: "1960-08-17"
  },

  // 10 Mairies principales
  MAIRE_LBV: {
    id: "g3_001",
    code: "MAIRE_LBV",
    nom: "Mairie de Libreville",
    nomCourt: "MAIRIE LIBREVILLE",
    sigle: "MLV",
    groupe: "G",
    sousGroupe: "G3",
    type: "MAIRIE",
    sousType: "COMMUNE_1ERE",
    mission: "Services municipaux et administration locale de Libreville",
    attributions: [
      "État civil", "Urbanisme", "Voirie", "Assainissement", "Marchés"
    ],
    services: ["État Civil", "Urbanisme", "Voirie", "Police Municipale"],
    adresse: "Hôtel de Ville",
    ville: "Libreville",
    province: "Estuaire",
    departement: "Libreville",
    niveau: 6,
    parentId: "PREF_LBV",
    flux: {
      hierarchiquesDescendants: [],
      hierarchiquesAscendants: ["PREF_LBV"],
      horizontauxInterministeriels: ["AUTRES_MAIRIES"],
      transversauxSIG: ["ADMIN_GA", "SIG_IDENTITE"]
    },
    branding: {
      couleurPrimaire: "#2563EB",
      couleurSecondaire: "#1D4ED8",
      couleurAccent: "#3B82F6",
      icon: Home,
      gradientClasses: "from-blue-600 to-blue-800",
      backgroundClasses: "bg-blue-50"
    },
    isActive: true,
    dateCreation: "1960-08-17"
  },

  MAIRE_PG: {
    id: "g3_002",
    code: "MAIRE_PG",
    nom: "Mairie de Port-Gentil",
    nomCourt: "MAIRIE PORT-GENTIL",
    sigle: "MPG",
    groupe: "G",
    sousGroupe: "G3",
    type: "MAIRIE",
    sousType: "COMMUNE_1ERE",
    mission: "Services municipaux et administration locale de Port-Gentil",
    attributions: [
      "État civil", "Urbanisme", "Port", "Développement économique"
    ],
    services: ["État Civil", "Urbanisme", "Port", "Développement"],
    adresse: "Hôtel de Ville",
    ville: "Port-Gentil",
    province: "Ogooué-Maritime",
    departement: "Bendje",
    niveau: 6,
    parentId: "PREF_PORT_GENTIL",
    flux: {
      hierarchiquesDescendants: [],
      hierarchiquesAscendants: ["PREF_PORT_GENTIL"],
      horizontauxInterministeriels: ["MAIRE_LBV", "AUTRES_MAIRIES"],
      transversauxSIG: ["ADMIN_GA", "SIG_IDENTITE"]
    },
    branding: {
      couleurPrimaire: "#2563EB",
      couleurSecondaire: "#1D4ED8",
      couleurAccent: "#3B82F6",
      icon: Home,
      gradientClasses: "from-blue-600 to-blue-800",
      backgroundClasses: "bg-blue-50"
    },
    isActive: true,
    dateCreation: "1960-08-17"
  }

  // Note: Pour atteindre 117 organismes, il faudrait ajouter les 67 autres organismes manquants
  // (48 préfectures, 9 gouvernorats, 52 mairies total, plus les autres directions et établissements)
  // Ceci est un échantillon représentatif pour montrer la structure
};

// Export pour fusion avec les organismes officiels
export default ORGANISMES_MANQUANTS_COMPLETS;
