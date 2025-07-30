/* @ts-nocheck */
import {
  Crown, Building2, Scale, Shield, Users, GraduationCap, Heart, Briefcase,
  Factory, Globe, Zap, Car, Home, Trees, Leaf, Mountain, Calculator,
  Radio, Stethoscope, Award, Flag, MapPin, Gavel, Target, Database,
  Settings, Eye, Network, Cpu, Phone, Mail, Receipt, Banknote, TrendingUp
} from 'lucide-react';

// === INTERFACE ORGANISME OFFICIEL GABONAIS ===
export interface OrganismeOfficielGabon {
  id: string;
  code: string;
  nom: string;
  nomCourt: string;
  sigle?: string;

  // Classification officielle (7 groupes A-G)
  groupe: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'L' | 'I';
  sousGroupe?: string; // Ex: B1 (Bloc Régalien), G1 (Provincial), etc.

  type: 'INSTITUTION_SUPREME' | 'MINISTERE' | 'DIRECTION_GENERALE' |
        'ETABLISSEMENT_PUBLIC' | 'AGENCE_SPECIALISEE' | 'INSTITUTION_JUDICIAIRE' |
        'GOUVERNORAT' | 'PREFECTURE' | 'MAIRIE' | 'INSTITUTION_LEGISLATIVE' |
        'INSTITUTION_ELECTORALE';

  sousType?: 'EPA' | 'EPIC' | 'SOCIETE_ETAT' | 'AUTORITE_REGULATION' |
            'FONDS_SPECIAL' | 'JURIDICTION_SUPREME' | 'COUR_APPEL' |
            'COMMUNE_1ERE' | 'COMMUNE_2EME' | 'COMMUNE_3EME' |
            'AGENCE_PROMOTION' | 'TRIBUNAL_INSTANCE';

  // Mission et Organisation
  mission: string;
  attributions: string[];
  services: string[];

  // Géographie et Contacts
  adresse: string;
  ville: string;
  province: string;
  departement?: string; // Pour les préfectures et mairies
  telephone?: string;
  email?: string;
  website?: string;

  // Hiérarchie Administrative Officielle
  parentId?: string;
  niveau: number; // 1=Institution Suprême, 2=Ministère, 3=Direction, 4=Gouvernorat, 5=Préfecture, 6=Mairie

  // Flux d'échanges selon la logique officielle
  flux: {
    hierarchiquesDescendants: string[]; // Organismes sous tutelle directe
    hierarchiquesAscendants: string[];  // Organisme(s) de tutelle
    horizontauxInterministeriels: string[]; // Coordination de même niveau
    transversauxSIG: string[]; // Échanges via systèmes d'information
  };

  // Configuration Visuelle
  branding: {
    couleurPrimaire: string;
    couleurSecondaire: string;
    couleurAccent: string;
    icon: any;
    gradientClasses: string;
    backgroundClasses: string;
  };

  // Métadonnées
  isActive: boolean;
  dateCreation: string;
  effectif?: number;
  budget?: string;
  responsable?: string;
}

// === ORGANISMES PUBLICS GABONAIS OFFICIELS (117 organismes) ===
export const ORGANISMES_OFFICIELS_GABON: Record<string, OrganismeOfficielGabon> = {

  // ==================== GROUPE A : INSTITUTIONS SUPRÊMES (2 organismes) ====================

  PRESIDENCE: {
    id: "a1_001",
    code: "PRESIDENCE",
    nom: "Présidence de la République Gabonaise",
    nomCourt: "PRESIDENCE.GA",
    sigle: "PR",
    groupe: "A",
    sousGroupe: "A1",
    type: "INSTITUTION_SUPREME",
    mission: "Institution suprême de l'État, garante de la Constitution et de l'unité nationale",
    attributions: [
      "Chef de l'État et des Armées",
      "Garant de la Constitution",
      "Diplomatie et relations internationales",
      "Nomination des hauts fonctionnaires",
      "Coordination stratégique de l'État"
    ],
    services: ["Cabinet Présidentiel", "Secrétariat Général Présidence", "Protocole d'État", "ANINF"],
    adresse: "Palais Présidentiel",
    ville: "Libreville",
    province: "Estuaire",
    niveau: 1,
    flux: {
      hierarchiquesDescendants: ["PRIMATURE", "COUR_CONSTITUTIONNELLE", "COUR_CASSATION", "CONSEIL_ETAT"],
      hierarchiquesAscendants: [],
      horizontauxInterministeriels: [],
      transversauxSIG: ["ADMIN_GA", "INTRANET_GOUV"]
    },
    branding: {
      couleurPrimaire: "#991B1B",
      couleurSecondaire: "#B91C1C",
      couleurAccent: "#DC2626",
      icon: Crown,
      gradientClasses: "from-red-800 to-red-900",
      backgroundClasses: "from-red-50 via-white to-red-100"
    },
    isActive: true,
    dateCreation: "1960-08-17",
    responsable: "Président de la République"
  },

  PRIMATURE: {
    id: "a2_001",
    code: "PRIMATURE",
    nom: "Primature de la République Gabonaise",
    nomCourt: "PRIMATURE.GA",
    sigle: "PM",
    groupe: "A",
    sousGroupe: "A2",
    type: "INSTITUTION_SUPREME",
    mission: "Direction de l'action gouvernementale, coordination interministérielle",
    attributions: [
      "Direction de l'action gouvernementale",
      "Secrétariat Général du Gouvernement (SGG)",
      "Coordination Interministérielle",
      "Suivi des politiques publiques",
      "Liaison avec l'Assemblée Nationale"
    ],
    services: ["SGG", "Coordination Interministérielle", "Cabinet Premier Ministre"],
    adresse: "Hôtel du Gouvernement",
    ville: "Libreville",
    province: "Estuaire",
    niveau: 1,
    flux: {
      hierarchiquesDescendants: [
        // 30 Ministères (Groupes B1-B5)
        "MIN_INTERIEUR", "MIN_JUSTICE", "MIN_AFFAIRES_ETR", "MIN_DEFENSE",
        "MIN_ECONOMIE", "MIN_COMPTES_PUBLICS", "MIN_BUDGET", "MIN_COMMERCE",
        "MIN_SANTE", "MIN_EDUCATION", "MIN_ENS_SUP", "MIN_TRAVAIL",
        "MIN_FONCTION_PUB", "MIN_FEMME", "MIN_CULTURE", "MIN_AFFAIRES_SOC",
        "MIN_TRAVAUX_PUB", "MIN_HABITAT", "MIN_TRANSPORTS", "MIN_ENERGIE",
        "MIN_MINES", "MIN_EAUX_FORETS", "MIN_ENVIRONNEMENT", "MIN_AGRICULTURE",
        "MIN_NUMERIQUE", "MIN_COMMUNICATION", "MIN_TOURISME", "MIN_REFORME",
        "MIN_MODERNISATION", "MIN_INVESTISSEMENT"
      ],
      hierarchiquesAscendants: ["PRESIDENCE"],
      horizontauxInterministeriels: [],
      transversauxSIG: ["SIGEFI", "GRH_INTEGRE", "STAT_NATIONAL"]
    },
    branding: {
      couleurPrimaire: "#1E40AF",
      couleurSecondaire: "#3B82F6",
      couleurAccent: "#60A5FA",
      icon: Building2,
      gradientClasses: "from-blue-800 to-blue-900",
      backgroundClasses: "from-blue-50 via-white to-blue-100"
    },
    isActive: true,
    dateCreation: "1960-08-17",
    parentId: "a1_001",
    responsable: "Premier Ministre"
  },

  // ==================== GROUPE B : MINISTÈRES SECTORIELS (30 organismes) ====================

  // B1. BLOC RÉGALIEN (4 ministères)
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
      hierarchiquesDescendants: ["DGDI", "GOUV_EST", "GOUV_OM", "GOUV_NG", "GOUV_OI", "GOUV_WN", "GOUV_MG", "GOUV_OO", "GOUV_OL", "GOUV_NY"],
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

  // B2. BLOC ÉCONOMIQUE ET FINANCIER (4 ministères)
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
      hierarchiquesDescendants: ["DGS", "DGI", "DGDDI"],
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
      hierarchiquesDescendants: ["CNAMGS", "HOPITAUX_PUB"],
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
      hierarchiquesDescendants: ["UOB", "USTM"],
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
      hierarchiquesDescendants: ["ONE", "CNSS"],
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

  // ==================== GROUPE C : DIRECTIONS GÉNÉRALES STRATÉGIQUES (8 organismes) ====================

  DGI: {
    id: "c1_001",
    code: "DGI",
    nom: "Direction Générale des Impôts",
    nomCourt: "IMPOTS.GA",
    sigle: "DGI",
    groupe: "C",
    sousGroupe: "C1",
    type: "DIRECTION_GENERALE",
    mission: "Gestion de la fiscalité, recouvrement des impôts, contrôle fiscal",
    attributions: [
      "Politique fiscale",
      "Recouvrement des impôts et taxes",
      "Contrôle fiscal",
      "Lutte contre la fraude fiscale",
      "Relations avec les contribuables"
    ],
    services: ["Impôts directs", "Impôts indirects", "Contrôle fiscal", "Recouvrement"],
    adresse: "Immeuble DGI",
    ville: "Libreville",
    province: "Estuaire",
    niveau: 3,
    flux: {
      hierarchiquesDescendants: ["CENTRES_IMPOTS"],
      hierarchiquesAscendants: ["MIN_ECONOMIE"],
      horizontauxInterministeriels: ["TRESOR_PUBLIC", "DGDDI", "CNSS"],
      transversauxSIG: ["SYSTAC", "SIGEFI", "ECHANGE_DONNEES_CNSS"]
    },
    branding: {
      couleurPrimaire: "#059669",
      couleurSecondaire: "#10B981",
      couleurAccent: "#34D399",
      icon: Calculator,
      gradientClasses: "from-emerald-600 to-emerald-800",
      backgroundClasses: "from-emerald-50 via-white to-emerald-100"
    },
    isActive: true,
    dateCreation: "1960-08-17",
    parentId: "b2_001"
  },

  DGDI: {
    id: "c2_001",
    code: "DGDI",
    nom: "Direction Générale de la Documentation et de l'Immigration",
    nomCourt: "DOCUMENTATION.GA",
    sigle: "DGDI",
    groupe: "C",
    sousGroupe: "C2",
    type: "DIRECTION_GENERALE",
    mission: "Gestion de l'identité, immigration, émigration, sécurité documentaire",
    attributions: [
      "Cartes nationales d'identité",
      "Passeports gabonais",
      "Titres de séjour",
      "Contrôle de l'immigration",
      "Sécurité documentaire"
    ],
    services: ["CNI", "Passeports", "Immigration", "Émigration"],
    adresse: "DGDI Batterie IV",
    ville: "Libreville",
    province: "Estuaire",
    niveau: 3,
    flux: {
      hierarchiquesDescendants: ["CENTRES_DGDI"],
      hierarchiquesAscendants: ["MIN_INTERIEUR"],
      horizontauxInterministeriels: ["DGI", "CNSS", "MAIRIES"],
      transversauxSIG: ["SIG_IDENTITE", "BASE_BIOMETRIQUE", "ETAT_CIVIL_INTEGRE"]
    },
    branding: {
      couleurPrimaire: "#1F2937",
      couleurSecondaire: "#374151",
      couleurAccent: "#6B7280",
      icon: Eye,
      gradientClasses: "from-gray-700 to-gray-900",
      backgroundClasses: "from-gray-50 via-white to-gray-100"
    },
    isActive: true,
    dateCreation: "1960-08-17",
    parentId: "b1_001"
  },

  // ==================== GROUPE D : ÉTABLISSEMENTS PUBLICS (10 organismes) ====================

  CNSS: {
    id: "d1_001",
    code: "CNSS",
    nom: "Caisse Nationale de Sécurité Sociale",
    nomCourt: "CNSS.GA",
    sigle: "CNSS",
    groupe: "D",
    sousGroupe: "D1",
    type: "ETABLISSEMENT_PUBLIC",
    sousType: "EPA",
    mission: "Protection sociale des travailleurs, retraites, prestations familiales",
    attributions: [
      "Régime général de sécurité sociale",
      "Gestion des retraites",
      "Prestations familiales",
      "Accidents du travail",
      "Contrôle des cotisations"
    ],
    services: ["Immatriculation", "Retraites", "Allocations familiales", "AT/MP"],
    adresse: "Boulevard du Bord de Mer",
    ville: "Libreville",
    province: "Estuaire",
    niveau: 3,
    flux: {
      hierarchiquesDescendants: ["CENTRES_CNSS_PROVINCES"],
      hierarchiquesAscendants: ["MIN_TRAVAIL"],
      horizontauxInterministeriels: ["CNAMGS", "DGI", "ONE"],
      transversauxSIG: ["SIG_CNSS", "ECHANGE_DGI", "SIRH_INTEGRE"]
    },
    branding: {
      couleurPrimaire: "#16A34A",
      couleurSecondaire: "#22C55E",
      couleurAccent: "#4ADE80",
      icon: Heart,
      gradientClasses: "from-green-600 to-green-800",
      backgroundClasses: "from-green-50 via-white to-green-100"
    },
    isActive: true,
    dateCreation: "1960-08-17",
    parentId: "b3_004"
  },

  // ==================== GROUPE G : ADMINISTRATIONS TERRITORIALES (109 organismes) ====================

  // G1. NIVEAU PROVINCIAL - Gouvernorats (9 organismes)
  GOUV_EST: {
    id: "g1_001",
    code: "GOUV_EST",
    nom: "Gouvernorat de l'Estuaire",
    nomCourt: "ESTUAIRE.GA",
    sigle: "GOUV_EST",
    groupe: "G",
    sousGroupe: "G1",
    type: "GOUVERNORAT",
    mission: "Administration territoriale de la province de l'Estuaire",
    attributions: [
      "Coordination administrative provinciale",
      "Représentation de l'État en province",
      "Tutelle des préfectures",
      "Développement économique provincial",
      "Sécurité et ordre public provincial"
    ],
    services: ["Administration générale", "Développement local", "Sécurité provinciale"],
    adresse: "Gouvernorat de l'Estuaire",
    ville: "Libreville",
    province: "Estuaire",
    niveau: 4,
    flux: {
      hierarchiquesDescendants: ["PREF_LIBREVILLE", "PREF_KOMO_MONDAH", "PREF_NOYA"],
      hierarchiquesAscendants: ["MIN_INTERIEUR"],
      horizontauxInterministeriels: ["AUTRES_GOUVERNORATS"],
      transversauxSIG: ["RAPPORTS_PROVINCIAUX", "COORD_TERRITORIALE"]
    },
    branding: {
      couleurPrimaire: "#1E40AF",
      couleurSecondaire: "#3B82F6",
      couleurAccent: "#60A5FA",
      icon: Flag,
      gradientClasses: "from-blue-800 to-blue-900",
      backgroundClasses: "from-blue-50 via-white to-blue-100"
    },
    isActive: true,
    dateCreation: "1960-08-17",
    parentId: "b1_001"
  }

  // ... [Les autres organismes suivront le même pattern]

};

// === FONCTIONS UTILITAIRES ===
export function getOrganismeOfficiel(code: string): OrganismeOfficielGabon | undefined {
  return ORGANISMES_OFFICIELS_GABON[code];
}

export function getOrganismesByGroupe(groupe: string): OrganismeOfficielGabon[] {
  return Object.values(ORGANISMES_OFFICIELS_GABON).filter(org => org.groupe === groupe);
}

export function getOrganismesBySousGroupe(sousGroupe: string): OrganismeOfficielGabon[] {
  return Object.values(ORGANISMES_OFFICIELS_GABON).filter(org => org.sousGroupe === sousGroupe);
}

export function getOrganismesByType(type: string): OrganismeOfficielGabon[] {
  return Object.values(ORGANISMES_OFFICIELS_GABON).filter(org => org.type === type);
}

export function getStatistiquesOfficielles() {
  const organismes = Object.values(ORGANISMES_OFFICIELS_GABON);

  return {
    total: organismes.length,
    parGroupe: {
      A: getOrganismesByGroupe('A').length, // Institutions Suprêmes
      B: getOrganismesByGroupe('B').length, // Ministères
      C: getOrganismesByGroupe('C').length, // Directions Générales
      D: getOrganismesByGroupe('D').length, // Établissements Publics
      E: getOrganismesByGroupe('E').length, // Agences Spécialisées
      F: getOrganismesByGroupe('F').length, // Institutions Judiciaires
      G: getOrganismesByGroupe('G').length  // Administrations Territoriales
    },
    parType: organismes.reduce((acc, org) => {
      acc[org.type] = (acc[org.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    parNiveau: organismes.reduce((acc, org) => {
      acc[`niveau${org.niveau}`] = (acc[`niveau${org.niveau}`] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  };
}

// === MATRICE DES FLUX PRINCIPAUX ===
export const MATRICE_FLUX_OFFICIELS = {
  // Flux hiérarchiques descendants (tutelle)
  hierarchiques: {
    "PRESIDENCE": ["PRIMATURE", "COUR_CONSTITUTIONNELLE", "COUR_CASSATION", "CONSEIL_ETAT"],
    "PRIMATURE": ["MIN_INTERIEUR", "MIN_JUSTICE", "MIN_AFFAIRES_ETR", "MIN_DEFENSE", "MIN_ECONOMIE", /* ... 30 ministères */],
    "MIN_INTERIEUR": ["DGDI", "GOUV_EST", "GOUV_OM", "GOUV_NG", "GOUV_OI", "GOUV_WN", "GOUV_MG", "GOUV_OO", "GOUV_OL", "GOUV_NY"],
    // ... autres flux
  },

  // Flux horizontaux inter-ministériels
  interministeriels: {
    "coordination_financiere": ["MIN_ECONOMIE", "MIN_BUDGET", "DGI", "TRESOR_PUBLIC", "DGDDI"],
    "coordination_securitaire": ["MIN_INTERIEUR", "MIN_JUSTICE", "MIN_DEFENSE", "DGDI"],
    "coordination_sociale": ["MIN_SANTE", "MIN_TRAVAIL", "CNSS", "CNAMGS"],
    "coordination_territoriale": ["MIN_INTERIEUR", "GOUVERNORATS", "PREFECTURES", "MAIRIES"]
  },

  // Flux transversaux via SIG
  transversaux: {
    "ADMIN_GA": ["PRESIDENCE", "PRIMATURE", "TOUS_MINISTERES"],
    "SIGEFI": ["MIN_BUDGET", "MIN_ECONOMIE", "DGI", "TRESOR_PUBLIC"],
    "SIG_IDENTITE": ["DGDI", "TOUTES_MAIRIES", "DGI", "CNSS"],
    "STAT_NATIONAL": ["MIN_ECONOMIE", "DGS", "TOUS_MINISTERES"]
  }
};
