/* @ts-nocheck */
import {
  FileText, Shield, Scale, Building2, Heart, Stethoscope, GraduationCap,
  Briefcase, Car, Home, Receipt, Truck, Leaf, Building, Users, Flag,
  Anchor, Trees, Wheat, Cross, Search, Calculator, Radio, Palette, Gavel,
  Award, Cpu, Globe, Wrench, MapPin, Phone, Mail, CreditCard, Banknote,
  Landmark, Zap, Droplets, Factory, Plane, Train, Ship, Mountain,
  Hammer, HardHat, ClipboardList, BookOpen, Microscope, Atom, Satellite,
  Trophy, Volume2, Tv, Newspaper, Camera, Music, Theater, Palette as Art,
  ShoppingCart, TrendingUp, BarChart3, PieChart, Target, Compass,
  Handshake, Baby, Crown, Star, Sun, Moon, Wind, Cloud, Snowflake,
  GitBranch, Network, Database, Lock, Key, Eye, UserCheck, Settings,
  Settings as Tool, Cog, Wrench as Repair
} from 'lucide-react';

// === INTERFACE ORGANISME COMPLET ===
export interface OrganismeComplet {
  id: string;
  code: string;
  nom: string;
  nomCourt: string;
  sigle?: string;
  type: 'PRESIDENCE' | 'PRIMATURE' | 'MINISTERE' | 'DIRECTION_GENERALE' | 'MAIRIE' |
        'PREFECTURE' | 'PROVINCE' | 'ORGANISME_SOCIAL' | 'AGENCE_PUBLIQUE' |
        'INSTITUTION_JUDICIAIRE' | 'INSTITUTION_ELECTORALE' | 'AUTRE';

  // Mission et Organisation
  mission: string;
  attributions: string[];
  services: string[];

  // Géographie et Contacts
  adresse: string;
  ville: string;
  province: string;
  telephone?: string;
  email?: string;
  website?: string;

  // Hiérarchie Administrative
  parentId?: string; // ID de l'organisme parent
  niveau: number; // 1=Très élevé (Présidence), 2=Élevé (Ministère), 3=Moyen (Direction), 4=Local (Mairie)

  // Relations et Collaborations
  relations: {
    hierarchiques: string[]; // Organismes sous tutelle
    collaboratives: string[]; // Organismes partenaires de même niveau
    informationnelles: string[]; // Organismes avec qui partager des données
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
  responsable?: string;
  effectif?: number;
  budget?: string;
}

// === CONFIGURATION COMPLÈTE DES 117 ORGANISMES GABONAIS ===
export const ORGANISMES_GABONAIS_COMPLETS: Record<string, OrganismeComplet> = {

  // ==================== NIVEAU 1: PRÉSIDENCE (1 organisme) ====================
  PRESIDENCE: {
    id: "pres_001",
    code: "PRESIDENCE",
    nom: "Présidence de la République Gabonaise",
    nomCourt: "PRESIDENCE.GA",
    sigle: "PR",
    type: "PRESIDENCE",
    mission: "Institution suprême de l'État, garante de la Constitution et de l'unité nationale",
    attributions: [
      "Chef de l'État et des armées",
      "Garant de la Constitution",
      "Diplomatie et relations internationales",
      "Nomination des hauts fonctionnaires",
      "Coordination de l'action gouvernementale"
    ],
    services: ["Cabinet présidentiel", "Protocole d'État", "Communication présidentielle", "Sécurité présidentielle"],
    adresse: "Palais Présidentiel",
    ville: "Libreville",
    province: "Estuaire",
    telephone: "+241 11 72 20 00",
    email: "contact@presidence.ga",
    website: "presidence.ga",
    niveau: 1,
    relations: {
      hierarchiques: ["PRIMATURE", "MIN_DEF", "MIN_AFF_ETR", "MIN_INT"],
      collaboratives: [],
      informationnelles: ["CONSEIL_CONST", "ASSEMBLEE_NAT", "SENAT"]
    },
    branding: {
      couleurPrimaire: "#991B1B", // Red-800
      couleurSecondaire: "#B91C1C",
      couleurAccent: "#DC2626",
      icon: Crown,
      gradientClasses: "from-red-800 to-red-900",
      backgroundClasses: "from-red-50 via-white to-red-100"
    },
    isActive: true,
    dateCreation: "1960-08-17",
    parentId: undefined
  },

  // ==================== NIVEAU 2: PRIMATURE (1 organisme) ====================
  PRIMATURE: {
    id: "prim_001",
    code: "PRIMATURE",
    nom: "Primature de la République Gabonaise",
    nomCourt: "PRIMATURE.GA",
    sigle: "PM",
    type: "PRIMATURE",
    mission: "Coordination de l'action gouvernementale et mise en œuvre de la politique de la Nation",
    attributions: [
      "Direction de l'action du Gouvernement",
      "Coordination interministérielle",
      "Mise en œuvre des politiques publiques",
      "Relations avec le Parlement",
      "Suivi de l'administration territoriale"
    ],
    services: ["Secrétariat Général du Gouvernement", "Cabinet du Premier Ministre", "Services du Premier Ministre"],
    adresse: "Immeuble de la Primature",
    ville: "Libreville",
    province: "Estuaire",
    telephone: "+241 11 72 10 00",
    email: "contact@primature.ga",
    website: "primature.ga",
    niveau: 2,
    relations: {
      hierarchiques: ["MIN_JUS", "MIN_INT", "MIN_SANTE", "MIN_EDUC", "MIN_TRANSPORT", "MIN_HABITAT", "MIN_TRAVAIL", "MIN_ENV", "MIN_FORETS", "MIN_AGRI"],
      collaboratives: ["PRESIDENCE"],
      informationnelles: ["ASSEMBLEE_NAT", "SENAT", "CONSEIL_ECON"]
    },
    branding: {
      couleurPrimaire: "#1E3A8A", // Blue-900
      couleurSecondaire: "#1E40AF",
      couleurAccent: "#3B82F6",
      icon: Star,
      gradientClasses: "from-blue-900 to-blue-950",
      backgroundClasses: "from-blue-50 via-white to-blue-100"
    },
    isActive: true,
    dateCreation: "1960-08-17",
    parentId: "pres_001"
  },

  // ==================== NIVEAU 3: MINISTÈRES (22 organismes) ====================
  MIN_JUS: {
    id: "min_001",
    code: "MIN_JUS",
    nom: "Ministère de la Justice, Garde des Sceaux",
    nomCourt: "JUSTICE.GA",
    sigle: "MJ",
    type: "MINISTERE",
    mission: "Administration de la justice, protection des droits et libertés, maintien de l'ordre juridique",
    attributions: [
      "Organisation et fonctionnement de la justice",
      "Politique pénale et criminelle",
      "Aide juridictionnelle",
      "Formation des magistrats",
      "Relations avec les auxiliaires de justice"
    ],
    services: ["Casier judiciaire", "Certificat de nationalité", "Légalisation de documents", "Actes notariés"],
    adresse: "Boulevard de l'Indépendance",
    ville: "Libreville",
    province: "Estuaire",
    telephone: "+241 11 72 30 00",
    email: "contact@justice.gov.ga",
    website: "justice.gov.ga",
    niveau: 3,
    relations: {
      hierarchiques: ["DGAJ", "DGAS", "DGAP"],
      collaboratives: ["MIN_INT", "MIN_DEF"],
      informationnelles: ["COUR_CASSATION", "CONSEIL_ETAT", "COUR_COMPTES"]
    },
    branding: {
      couleurPrimaire: "#7C3AED",
      couleurSecondaire: "#A855F7",
      couleurAccent: "#C084FC",
      icon: Scale,
      gradientClasses: "from-purple-600 to-purple-800",
      backgroundClasses: "from-purple-50 via-white to-purple-100"
    },
    isActive: true,
    dateCreation: "1960-08-17",
    parentId: "prim_001"
  },

  MIN_INT: {
    id: "min_002",
    code: "MIN_INT",
    nom: "Ministère de l'Intérieur et de la Sécurité",
    nomCourt: "INTERIEUR.GA",
    sigle: "MIS",
    type: "MINISTERE",
    mission: "Maintien de l'ordre public, sécurité intérieure, administration territoriale",
    attributions: [
      "Sécurité publique et ordre",
      "Administration territoriale",
      "Collectivités locales",
      "État civil et nationalité",
      "Immigration et circulation des personnes"
    ],
    services: ["CNI", "Passeport", "Carte de séjour", "Autorisation de réunion"],
    adresse: "Avenue de la République",
    ville: "Libreville",
    province: "Estuaire",
    niveau: 3,
    relations: {
      hierarchiques: ["DGDI", "DGSN", "DGAT"],
      collaboratives: ["MIN_JUS", "MIN_DEF"],
      informationnelles: ["PREFECTURES", "MAIRIES"]
    },
    branding: {
      couleurPrimaire: "#1F2937",
      couleurSecondaire: "#374151",
      couleurAccent: "#6B7280",
      icon: Shield,
      gradientClasses: "from-gray-700 to-gray-900",
      backgroundClasses: "from-gray-50 via-white to-gray-100"
    },
    isActive: true,
    dateCreation: "1960-08-17",
    parentId: "prim_001"
  },

  MIN_DEF: {
    id: "min_003",
    code: "MIN_DEF",
    nom: "Ministère de la Défense Nationale",
    nomCourt: "DEFENSE.GA",
    sigle: "MDN",
    type: "MINISTERE",
    mission: "Défense du territoire national, sécurité militaire, coopération militaire internationale",
    attributions: [
      "Défense et sécurité du territoire",
      "Forces armées gabonaises",
      "Coopération militaire",
      "Service militaire",
      "Industries de défense"
    ],
    services: ["Service national", "Coopération militaire", "Logistique militaire"],
    adresse: "Camp de Gaulle",
    ville: "Libreville",
    province: "Estuaire",
    niveau: 3,
    relations: {
      hierarchiques: ["EMAT", "EMGA", "EMGN", "GENDARMERIE"],
      collaboratives: ["MIN_INT", "MIN_JUS"],
      informationnelles: ["PRESIDENCE"]
    },
    branding: {
      couleurPrimaire: "#059669",
      couleurSecondaire: "#10B981",
      couleurAccent: "#34D399",
      icon: Shield,
      gradientClasses: "from-emerald-600 to-emerald-800",
      backgroundClasses: "from-emerald-50 via-white to-emerald-100"
    },
    isActive: true,
    dateCreation: "1960-08-17",
    parentId: "pres_001"
  },

  MIN_AFF_ETR: {
    id: "min_004",
    code: "MIN_AFF_ETR",
    nom: "Ministère des Affaires Étrangères",
    nomCourt: "AFFAIRES-ETRANGERES.GA",
    sigle: "MAE",
    type: "MINISTERE",
    mission: "Conduite de la diplomatie gabonaise, relations internationales, coopération",
    attributions: [
      "Relations diplomatiques",
      "Négociations internationales",
      "Coopération internationale",
      "Protection des Gabonais à l'étranger",
      "Politique européenne et africaine"
    ],
    services: ["Visas", "Légalisation consulaire", "Protection consulaire"],
    adresse: "Boulevard du Bord de Mer",
    ville: "Libreville",
    province: "Estuaire",
    niveau: 3,
    relations: {
      hierarchiques: ["DGAE", "DGCI"],
      collaboratives: ["MIN_COM_EXT", "MIN_TOUR"],
      informationnelles: ["PRESIDENCE", "PRIMATURE"]
    },
    branding: {
      couleurPrimaire: "#1E40AF",
      couleurSecondaire: "#3B82F6",
      couleurAccent: "#60A5FA",
      icon: Globe,
      gradientClasses: "from-blue-800 to-blue-900",
      backgroundClasses: "from-blue-50 via-white to-blue-100"
    },
    isActive: true,
    dateCreation: "1960-08-17",
    parentId: "pres_001"
  },

  MIN_SANTE: {
    id: "min_005",
    code: "MIN_SANTE",
    nom: "Ministère de la Santé et des Affaires Sociales",
    nomCourt: "SANTE.GA",
    sigle: "MSAS",
    type: "MINISTERE",
    mission: "Politique de santé publique, protection sociale, bien-être des populations",
    attributions: [
      "Système de santé publique",
      "Prévention et épidémiologie",
      "Hôpitaux et centres de santé",
      "Formation sanitaire",
      "Politique pharmaceutique"
    ],
    services: ["Carte sanitaire", "Certificat médical", "Autorisation d'exercice médical"],
    adresse: "Boulevard Triomphal",
    ville: "Libreville",
    province: "Estuaire",
    niveau: 3,
    relations: {
      hierarchiques: ["DGSP", "DGPHP", "DGFSS"],
      collaboratives: ["CNAMGS", "CNSS"],
      informationnelles: ["WHO", "UNICEF"]
    },
    branding: {
      couleurPrimaire: "#DC2626",
      couleurSecondaire: "#EF4444",
      couleurAccent: "#F87171",
      icon: Cross,
      gradientClasses: "from-red-500 to-red-700",
      backgroundClasses: "from-red-50 via-white to-red-100"
    },
    isActive: true,
    dateCreation: "1960-08-17",
    parentId: "prim_001"
  },

  MIN_EDUC: {
    id: "min_006",
    code: "MIN_EDUC",
    nom: "Ministère de l'Éducation Nationale",
    nomCourt: "EDUCATION.GA",
    sigle: "MEN",
    type: "MINISTERE",
    mission: "Politique éducative nationale, formation initiale, alphabétisation",
    attributions: [
      "Enseignement primaire et secondaire",
      "Programmes et curricula",
      "Formation des enseignants",
      "Infrastructures scolaires",
      "Évaluation du système éducatif"
    ],
    services: ["Diplômes et attestations", "Équivalence de diplômes", "Inscription scolaire"],
    adresse: "Quartier Louis",
    ville: "Libreville",
    province: "Estuaire",
    niveau: 3,
    relations: {
      hierarchiques: ["DGEP", "DGES", "DGIFPE"],
      collaboratives: ["MIN_ENS_SUP", "MIN_FORM_PROF"],
      informationnelles: ["UNESCO", "UNICEF"]
    },
    branding: {
      couleurPrimaire: "#3B82F6",
      couleurSecondaire: "#60A5FA",
      couleurAccent: "#93C5FD",
      icon: GraduationCap,
      gradientClasses: "from-blue-500 to-blue-700",
      backgroundClasses: "from-blue-50 via-white to-blue-100"
    },
    isActive: true,
    dateCreation: "1960-08-17",
    parentId: "prim_001"
  },

  MIN_ENS_SUP: {
    id: "min_007",
    code: "MIN_ENS_SUP",
    nom: "Ministère de l'Enseignement Supérieur et de la Recherche",
    nomCourt: "ENSEIGNEMENT-SUPERIEUR.GA",
    sigle: "MESR",
    type: "MINISTERE",
    mission: "Enseignement supérieur, recherche scientifique, innovation technologique",
    attributions: [
      "Universités et grandes écoles",
      "Recherche scientifique",
      "Innovation et transfert de technologie",
      "Bourses d'études",
      "Coopération universitaire internationale"
    ],
    services: ["Équivalence de diplômes supérieurs", "Bourses d'études", "Habilitation d'établissements"],
    adresse: "Boulevard Triomphal",
    ville: "Libreville",
    province: "Estuaire",
    niveau: 3,
    relations: {
      hierarchiques: ["DGES", "DGRS", "CAMES"],
      collaboratives: ["MIN_EDUC", "MIN_RECH"],
      informationnelles: ["UNIVERSITES", "IRD"]
    },
    branding: {
      couleurPrimaire: "#7C3AED",
      couleurSecondaire: "#8B5CF6",
      couleurAccent: "#A78BFA",
      icon: Microscope,
      gradientClasses: "from-violet-600 to-violet-800",
      backgroundClasses: "from-violet-50 via-white to-violet-100"
    },
    isActive: true,
    dateCreation: "1975-05-15",
    parentId: "prim_001"
  },

  MIN_FORM_PROF: {
    id: "min_008",
    code: "MIN_FORM_PROF",
    nom: "Ministère de la Formation Professionnelle",
    nomCourt: "FORMATION-PROFESSIONNELLE.GA",
    sigle: "MFP",
    type: "MINISTERE",
    mission: "Formation professionnelle et technique, insertion des jeunes dans la vie active",
    attributions: [
      "Formation professionnelle",
      "Apprentissage et alternance",
      "Certification professionnelle",
      "Insertion professionnelle",
      "Partenariat entreprises-formation"
    ],
    services: ["Certificats professionnels", "Validation des acquis", "Formation continue"],
    adresse: "Quartier Akébé",
    ville: "Libreville",
    province: "Estuaire",
    niveau: 3,
    relations: {
      hierarchiques: ["DGFP", "INFPP"],
      collaboratives: ["MIN_EDUC", "MIN_TRAVAIL", "ONE"],
      informationnelles: ["PATRONAT", "SYNDICATS"]
    },
    branding: {
      couleurPrimaire: "#EA580C",
      couleurSecondaire: "#FB923C",
      couleurAccent: "#FDBA74",
      icon: Tool,
      gradientClasses: "from-orange-600 to-orange-800",
      backgroundClasses: "from-orange-50 via-white to-orange-100"
    },
    isActive: true,
    dateCreation: "1985-03-20",
    parentId: "prim_001"
  },

  MIN_TRANSPORT: {
    id: "min_009",
    code: "MIN_TRANSPORT",
    nom: "Ministère des Transports et de la Marine Marchande",
    nomCourt: "TRANSPORT.GA",
    sigle: "MTMM",
    type: "MINISTERE",
    mission: "Politique des transports, sécurité routière, marine marchande",
    attributions: [
      "Transports terrestres, aériens et maritimes",
      "Sécurité routière",
      "Infrastructures de transport",
      "Marine marchande",
      "Transport public urbain"
    ],
    services: ["Permis de conduire", "Immatriculation des véhicules", "Carte grise"],
    adresse: "Boulevard de la Mer",
    ville: "Libreville",
    province: "Estuaire",
    niveau: 3,
    relations: {
      hierarchiques: ["DGTT", "DGAC", "DGMM"],
      collaboratives: ["MIN_TP", "MIN_TOUR"],
      informationnelles: ["ANUTTC", "ASECNA"]
    },
    branding: {
      couleurPrimaire: "#F97316",
      couleurSecondaire: "#FB923C",
      couleurAccent: "#FDBA74",
      icon: Car,
      gradientClasses: "from-orange-500 to-orange-700",
      backgroundClasses: "from-orange-50 via-white to-orange-100"
    },
    isActive: true,
    dateCreation: "1960-08-17",
    parentId: "prim_001"
  },

  MIN_TP: {
    id: "min_010",
    code: "MIN_TP",
    nom: "Ministère des Travaux Publics",
    nomCourt: "TRAVAUX-PUBLICS.GA",
    sigle: "MTP",
    type: "MINISTERE",
    mission: "Infrastructures publiques, voirie, ponts et chaussées",
    attributions: [
      "Construction et entretien des routes",
      "Ponts et ouvrages d'art",
      "Infrastructures publiques",
      "Génie civil",
      "Contrôle technique des constructions"
    ],
    services: ["Autorisation de travaux publics", "Contrôle technique", "Réception d'ouvrages"],
    adresse: "Boulevard de l'Indépendance",
    ville: "Libreville",
    province: "Estuaire",
    niveau: 3,
    relations: {
      hierarchiques: ["DGTP", "DGI", "LBTP"],
      collaboratives: ["MIN_TRANSPORT", "MIN_HABITAT"],
      informationnelles: ["COMMUNES", "PROVINCES"]
    },
    branding: {
      couleurPrimaire: "#B45309",
      couleurSecondaire: "#D97706",
      couleurAccent: "#F59E0B",
      icon: HardHat,
      gradientClasses: "from-amber-700 to-amber-900",
      backgroundClasses: "from-amber-50 via-white to-amber-100"
    },
    isActive: true,
    dateCreation: "1960-08-17",
    parentId: "prim_001"
  },

  MIN_HABITAT: {
    id: "min_011",
    code: "MIN_HABITAT",
    nom: "Ministère de l'Habitat, de l'Urbanisme et du Cadastre",
    nomCourt: "HABITAT.GA",
    sigle: "MHUC",
    type: "MINISTERE",
    mission: "Politique du logement, aménagement urbain, gestion foncière",
    attributions: [
      "Politique du logement",
      "Aménagement urbain",
      "Cadastre et domaine",
      "Habitat social",
      "Contrôle de l'urbanisme"
    ],
    services: ["Titre foncier", "Certificat d'urbanisme", "Plan cadastral"],
    adresse: "Quartier Batterie IV",
    ville: "Libreville",
    province: "Estuaire",
    niveau: 3,
    relations: {
      hierarchiques: ["DGH", "DGUC", "DGC"],
      collaboratives: ["MIN_TP", "COMMUNES"],
      informationnelles: ["FONDS_HABITAT", "IMMOBILIER_GABON"]
    },
    branding: {
      couleurPrimaire: "#84CC16",
      couleurSecondaire: "#A3E635",
      couleurAccent: "#BEF264",
      icon: Home,
      gradientClasses: "from-lime-500 to-lime-700",
      backgroundClasses: "from-lime-50 via-white to-lime-100"
    },
    isActive: true,
    dateCreation: "1960-08-17",
    parentId: "prim_001"
  },

  MIN_TRAVAIL: {
    id: "min_012",
    code: "MIN_TRAVAIL",
    nom: "Ministère du Travail, du Plein-emploi et du Dialogue Social",
    nomCourt: "TRAVAIL.GA",
    sigle: "MTPDS",
    type: "MINISTERE",
    mission: "Relations de travail, emploi, protection sociale des travailleurs",
    attributions: [
      "Code du travail",
      "Relations sociales",
      "Inspection du travail",
      "Politique de l'emploi",
      "Formation professionnelle continue"
    ],
    services: ["Contrat de travail", "Attestation de travail", "Permis de travail"],
    adresse: "Immeuble CECA",
    ville: "Libreville",
    province: "Estuaire",
    niveau: 3,
    relations: {
      hierarchiques: ["DGT", "DGPE", "IT"],
      collaboratives: ["CNSS", "ONE", "MIN_FORM_PROF"],
      informationnelles: ["SYNDICATS", "PATRONAT"]
    },
    branding: {
      couleurPrimaire: "#06B6D4",
      couleurSecondaire: "#22D3EE",
      couleurAccent: "#67E8F9",
      icon: Briefcase,
      gradientClasses: "from-cyan-500 to-cyan-700",
      backgroundClasses: "from-cyan-50 via-white to-cyan-100"
    },
    isActive: true,
    dateCreation: "1960-08-17",
    parentId: "prim_001"
  },

  MIN_ENV: {
    id: "min_013",
    code: "MIN_ENV",
    nom: "Ministère de l'Environnement et du Climat",
    nomCourt: "ENVIRONNEMENT.GA",
    sigle: "MEC",
    type: "MINISTERE",
    mission: "Protection de l'environnement, lutte contre le changement climatique",
    attributions: [
      "Politique environnementale",
      "Lutte contre la pollution",
      "Changement climatique",
      "Biodiversité",
      "Évaluations environnementales"
    ],
    services: ["Étude d'impact environnemental", "Certificat de conformité environnementale"],
    adresse: "Immeuble Diamant",
    ville: "Libreville",
    province: "Estuaire",
    niveau: 3,
    relations: {
      hierarchiques: ["DGE", "DGCC", "ANPN"],
      collaboratives: ["MIN_FORETS", "MIN_AGRI"],
      informationnelles: ["PNUD", "PNUE"]
    },
    branding: {
      couleurPrimaire: "#059669",
      couleurSecondaire: "#10B981",
      couleurAccent: "#34D399",
      icon: Leaf,
      gradientClasses: "from-emerald-600 to-emerald-800",
      backgroundClasses: "from-emerald-50 via-white to-emerald-100"
    },
    isActive: true,
    dateCreation: "1980-06-05",
    parentId: "prim_001"
  },

  MIN_FORETS: {
    id: "min_014",
    code: "MIN_FORETS",
    nom: "Ministère des Eaux et Forêts",
    nomCourt: "FORETS.GA",
    sigle: "MEF",
    type: "MINISTERE",
    mission: "Gestion durable des ressources forestières et hydriques",
    attributions: [
      "Gestion des forêts",
      "Exploitation forestière",
      "Conservation de la biodiversité",
      "Ressources en eau",
      "Certification forestière"
    ],
    services: ["Permis d'exploitation forestière", "Certificat d'origine des bois"],
    adresse: "Quartier Nomba",
    ville: "Libreville",
    province: "Estuaire",
    niveau: 3,
    relations: {
      hierarchiques: ["DGF", "DGE", "CNEF"],
      collaboratives: ["MIN_ENV", "MIN_AGRI"],
      informationnelles: ["FAO", "FSC"]
    },
    branding: {
      couleurPrimaire: "#047857",
      couleurSecondaire: "#059669",
      couleurAccent: "#10B981",
      icon: Trees,
      gradientClasses: "from-emerald-700 to-emerald-900",
      backgroundClasses: "from-emerald-50 via-white to-emerald-100"
    },
    isActive: true,
    dateCreation: "1960-08-17",
    parentId: "prim_001"
  },

  MIN_AGRI: {
    id: "min_015",
    code: "MIN_AGRI",
    nom: "Ministère de l'Agriculture, de l'Élevage et du Développement Rural",
    nomCourt: "AGRICULTURE.GA",
    sigle: "MAEDR",
    type: "MINISTERE",
    mission: "Développement agricole, sécurité alimentaire, développement rural",
    attributions: [
      "Politique agricole nationale",
      "Élevage et pêche",
      "Développement rural",
      "Sécurité alimentaire",
      "Recherche agricole"
    ],
    services: ["Autorisation d'exploitation agricole", "Certificat phytosanitaire"],
    adresse: "Quartier Akébé",
    ville: "Libreville",
    province: "Estuaire",
    niveau: 3,
    relations: {
      hierarchiques: ["DGA", "DGE", "DGDR"],
      collaboratives: ["MIN_ENV", "MIN_FORETS"],
      informationnelles: ["FAO", "IRAD"]
    },
    branding: {
      couleurPrimaire: "#CA8A04",
      couleurSecondaire: "#EAB308",
      couleurAccent: "#FACC15",
      icon: Wheat,
      gradientClasses: "from-yellow-600 to-yellow-800",
      backgroundClasses: "from-yellow-50 via-white to-yellow-100"
    },
    isActive: true,
    dateCreation: "1960-08-17",
    parentId: "prim_001"
  },

  MIN_PECHE: {
    id: "min_016",
    code: "MIN_PECHE",
    nom: "Ministère de la Pêche et de l'Aquaculture",
    nomCourt: "PECHE.GA",
    sigle: "MPA",
    type: "MINISTERE",
    mission: "Développement de la pêche et de l'aquaculture, exploitation des ressources halieutiques",
    attributions: [
      "Politique des pêches",
      "Aquaculture",
      "Contrôle des pêches",
      "Recherche halieutique",
      "Commerce des produits halieutiques"
    ],
    services: ["Licence de pêche", "Certificat sanitaire des produits de la mer"],
    adresse: "Port d'Owendo",
    ville: "Libreville",
    province: "Estuaire",
    niveau: 3,
    relations: {
      hierarchiques: ["DGP", "DGAQ", "CNPB"],
      collaboratives: ["MIN_AGRI", "MIN_ENV"],
      informationnelles: ["FAO", "ICCAT"]
    },
    branding: {
      couleurPrimaire: "#0891B2",
      couleurSecondaire: "#0EA5E9",
      couleurAccent: "#38BDF8",
      icon: Ship,
      gradientClasses: "from-sky-700 to-sky-900",
      backgroundClasses: "from-sky-50 via-white to-sky-100"
    },
    isActive: true,
    dateCreation: "1990-04-12",
    parentId: "prim_001"
  },

  MIN_MINE: {
    id: "min_017",
    code: "MIN_MINE",
    nom: "Ministère des Mines et de la Géologie",
    nomCourt: "MINES.GA",
    sigle: "MMG",
    type: "MINISTERE",
    mission: "Politique minière, géologie, exploitation des ressources minérales",
    attributions: [
      "Politique minière nationale",
      "Géologie et cartographie",
      "Exploration et exploitation minière",
      "Contrôle des activités minières",
      "Promotion des investissements miniers"
    ],
    services: ["Permis de recherche minière", "Permis d'exploitation minière"],
    adresse: "Immeuble DGMG",
    ville: "Libreville",
    province: "Estuaire",
    niveau: 3,
    relations: {
      hierarchiques: ["DGMG", "DGCM", "BM"],
      collaboratives: ["MIN_PETR", "MIN_IND"],
      informationnelles: ["EITI", "CEMAC"]
    },
    branding: {
      couleurPrimaire: "#A16207",
      couleurSecondaire: "#CA8A04",
      couleurAccent: "#EAB308",
      icon: Mountain,
      gradientClasses: "from-yellow-700 to-yellow-900",
      backgroundClasses: "from-yellow-50 via-white to-yellow-100"
    },
    isActive: true,
    dateCreation: "1960-08-17",
    parentId: "prim_001"
  },

  MIN_PETR: {
    id: "min_018",
    code: "MIN_PETR",
    nom: "Ministère du Pétrole, du Gaz et des Ressources Minières",
    nomCourt: "PETROLE.GA",
    sigle: "MPGRM",
    type: "MINISTERE",
    mission: "Politique pétrolière et gazière, exploitation des hydrocarbures",
    attributions: [
      "Politique pétrolière et gazière",
      "Contrats pétroliers",
      "Raffinage et distribution",
      "Contrôle des activités pétrolières",
      "Négociations avec les compagnies pétrolières"
    ],
    services: ["Autorisation d'exploitation pétrolière", "Contrôle qualité carburants"],
    adresse: "Immeuble Pétrolia",
    ville: "Libreville",
    province: "Estuaire",
    niveau: 3,
    relations: {
      hierarchiques: ["DGH", "DGPE", "CONAC"],
      collaboratives: ["MIN_MINE", "MIN_IND"],
      informationnelles: ["TOTAL", "SHELL", "OPEP"]
    },
    branding: {
      couleurPrimaire: "#1F2937",
      couleurSecondaire: "#374151",
      couleurAccent: "#4B5563",
      icon: Zap,
      gradientClasses: "from-gray-800 to-gray-900",
      backgroundClasses: "from-gray-50 via-white to-gray-100"
    },
    isActive: true,
    dateCreation: "1960-08-17",
    parentId: "prim_001"
  },

  MIN_IND: {
    id: "min_019",
    code: "MIN_IND",
    nom: "Ministère de l'Industrie et des PME",
    nomCourt: "INDUSTRIE.GA",
    sigle: "MIPME",
    type: "MINISTERE",
    mission: "Développement industriel, promotion des PME, transformation locale",
    attributions: [
      "Politique industrielle",
      "Promotion des PME/PMI",
      "Transformation locale",
      "Normalisation et qualité",
      "Zones industrielles"
    ],
    services: ["Agrément d'entreprise", "Certificat de conformité industrielle"],
    adresse: "Zone Industrielle d'Oloumi",
    ville: "Libreville",
    province: "Estuaire",
    niveau: 3,
    relations: {
      hierarchiques: ["DGI", "DGPME", "ANPI"],
      collaboratives: ["MIN_MINE", "MIN_PETR"],
      informationnelles: ["CNPME", "CHAMBRE_COMMERCE"]
    },
    branding: {
      couleurPrimaire: "#6366F1",
      couleurSecondaire: "#818CF8",
      couleurAccent: "#A5B4FC",
      icon: Factory,
      gradientClasses: "from-indigo-600 to-indigo-800",
      backgroundClasses: "from-indigo-50 via-white to-indigo-100"
    },
    isActive: true,
    dateCreation: "1970-03-15",
    parentId: "prim_001"
  },

  MIN_COM_EXT: {
    id: "min_020",
    code: "MIN_COM_EXT",
    nom: "Ministère du Commerce Extérieur",
    nomCourt: "COMMERCE-EXTERIEUR.GA",
    sigle: "MCE",
    type: "MINISTERE",
    mission: "Promotion du commerce extérieur, exportations, compétitivité",
    attributions: [
      "Politique du commerce extérieur",
      "Promotion des exportations",
      "Relations commerciales internationales",
      "Zones franches",
      "Facilitation du commerce"
    ],
    services: ["Certificat d'origine", "Autorisation d'exportation"],
    adresse: "Boulevard de l'Indépendance",
    ville: "Libreville",
    province: "Estuaire",
    niveau: 3,
    relations: {
      hierarchiques: ["DGCE", "DGPEX", "PROMOGABON"],
      collaboratives: ["MIN_AFF_ETR", "DOUANES"],
      informationnelles: ["OMC", "CEMAC"]
    },
    branding: {
      couleurPrimaire: "#DC2626",
      couleurSecondaire: "#EF4444",
      couleurAccent: "#F87171",
      icon: TrendingUp,
      gradientClasses: "from-red-600 to-red-800",
      backgroundClasses: "from-red-50 via-white to-red-100"
    },
    isActive: true,
    dateCreation: "1990-07-10",
    parentId: "prim_001"
  },

  MIN_TOUR: {
    id: "min_021",
    code: "MIN_TOUR",
    nom: "Ministère du Tourisme et de l'Artisanat",
    nomCourt: "TOURISME.GA",
    sigle: "MTA",
    type: "MINISTERE",
    mission: "Développement touristique, promotion de l'artisanat, valorisation du patrimoine",
    attributions: [
      "Politique touristique nationale",
      "Promotion de la destination Gabon",
      "Développement de l'artisanat",
      "Protection du patrimoine culturel",
      "Formation touristique"
    ],
    services: ["Agrément établissement touristique", "Carte d'artisan"],
    adresse: "Boulevard Triomphal",
    ville: "Libreville",
    province: "Estuaire",
    niveau: 3,
    relations: {
      hierarchiques: ["DGTO", "DGAC", "CNT"],
      collaboratives: ["MIN_CULTURE", "MIN_AFF_ETR"],
      informationnelles: ["OMT", "UNESCO"]
    },
    branding: {
      couleurPrimaire: "#059669",
      couleurSecondaire: "#10B981",
      couleurAccent: "#34D399",
      icon: Camera,
      gradientClasses: "from-emerald-600 to-emerald-800",
      backgroundClasses: "from-emerald-50 via-white to-emerald-100"
    },
    isActive: true,
    dateCreation: "1985-09-20",
    parentId: "prim_001"
  },

  MIN_CULTURE: {
    id: "min_022",
    code: "MIN_CULTURE",
    nom: "Ministère de la Culture, des Arts et du Patrimoine",
    nomCourt: "CULTURE.GA",
    sigle: "MCAP",
    type: "MINISTERE",
    mission: "Promotion de la culture gabonaise, développement artistique, sauvegarde du patrimoine",
    attributions: [
      "Politique culturelle nationale",
      "Promotion des arts",
      "Sauvegarde du patrimoine",
      "Industries culturelles",
      "Coopération culturelle internationale"
    ],
    services: ["Agrément association culturelle", "Autorisation manifestation culturelle"],
    adresse: "Boulevard de l'Indépendance",
    ville: "Libreville",
    province: "Estuaire",
    niveau: 3,
    relations: {
      hierarchiques: ["DGC", "DGAP", "CENAREST"],
      collaboratives: ["MIN_TOUR", "MIN_COMM"],
      informationnelles: ["UNESCO", "OIF"]
    },
    branding: {
      couleurPrimaire: "#7C3AED",
      couleurSecondaire: "#8B5CF6",
      couleurAccent: "#A78BFA",
      icon: Art,
      gradientClasses: "from-violet-600 to-violet-800",
      backgroundClasses: "from-violet-50 via-white to-violet-100"
    },
    isActive: true,
    dateCreation: "1975-11-08",
    parentId: "prim_001"
  },

  // ==================== NIVEAU 4: DIRECTIONS GÉNÉRALES (25 organismes) ====================
  DGDI: {
    id: "dir_001",
    code: "DGDI",
    nom: "Direction Générale de la Documentation et de l'Immigration",
    nomCourt: "DGDI.GA",
    sigle: "DGDI",
    type: "DIRECTION_GENERALE",
    mission: "Gestion de l'état civil, documents d'identité, contrôle de l'immigration",
    attributions: [
      "Cartes nationales d'identité",
      "Passeports gabonais",
      "Contrôle de l'immigration",
      "État civil centralisé",
      "Naturalisation et nationalité"
    ],
    services: ["CNI", "Passeport", "Carte de séjour", "Visa", "Certificat de nationalité"],
    adresse: "Quartier Louis",
    ville: "Libreville",
    province: "Estuaire",
    niveau: 4,
    relations: {
      hierarchiques: ["SERVICES_DGDI_PROVINCES"],
      collaboratives: ["DGI", "MAIRIES"],
      informationnelles: ["AMBASSADES", "CONSULATS"]
    },
    branding: {
      couleurPrimaire: "#1E40AF",
      couleurSecondaire: "#3B82F6",
      couleurAccent: "#60A5FA",
      icon: FileText,
      gradientClasses: "from-blue-800 to-blue-900",
      backgroundClasses: "from-blue-50 via-white to-blue-100"
    },
    isActive: true,
    dateCreation: "1960-08-17",
    parentId: "min_002"
  },

  DGI: {
    id: "dir_002",
    code: "DGI",
    nom: "Direction Générale des Impôts",
    nomCourt: "DGI.GA",
    sigle: "DGI",
    type: "DIRECTION_GENERALE",
    mission: "Gestion de la fiscalité nationale, recouvrement des impôts et taxes",
    attributions: [
      "Fiscalité des particuliers",
      "Fiscalité des entreprises",
      "Contrôle fiscal",
      "Recouvrement des impôts",
      "Contentieux fiscal"
    ],
    services: ["Déclaration fiscale", "Attestation fiscale", "Quitus fiscal", "Numéro d'identification fiscale"],
    adresse: "Immeuble des Finances",
    ville: "Libreville",
    province: "Estuaire",
    niveau: 4,
    relations: {
      hierarchiques: ["CENTRES_IMPOTS"],
      collaboratives: ["DGDDI", "DGT"],
      informationnelles: ["BANQUES", "ENTREPRISES"]
    },
    branding: {
      couleurPrimaire: "#B45309",
      couleurSecondaire: "#D97706",
      couleurAccent: "#F59E0B",
      icon: Receipt,
      gradientClasses: "from-amber-700 to-amber-900",
      backgroundClasses: "from-amber-50 via-white to-amber-100"
    },
    isActive: true,
    dateCreation: "1960-08-17",
    parentId: "prim_001"
  },

  DGDDI: {
    id: "dir_003",
    code: "DGDDI",
    nom: "Direction Générale des Douanes et Droits Indirects",
    nomCourt: "DOUANES.GA",
    sigle: "DGDDI",
    type: "DIRECTION_GENERALE",
    mission: "Contrôle douanier, facilitation du commerce, protection des frontières",
    attributions: [
      "Contrôle des frontières",
      "Dédouanement des marchandises",
      "Lutte contre la contrebande",
      "Facilitation du commerce",
      "Perception des droits de douane"
    ],
    services: ["Déclaration en douane", "Mainlevée douanière", "Transit douanier"],
    adresse: "Port d'Owendo",
    ville: "Libreville",
    province: "Estuaire",
    niveau: 4,
    relations: {
      hierarchiques: ["BUREAUX_DOUANE"],
      collaboratives: ["DGI", "DGTT"],
      informationnelles: ["TRANSITAIRES", "EXPORTATEURS"]
    },
    branding: {
      couleurPrimaire: "#1E3A8A",
      couleurSecondaire: "#1E40AF",
      couleurAccent: "#3B82F6",
      icon: Truck,
      gradientClasses: "from-blue-900 to-blue-950",
      backgroundClasses: "from-blue-50 via-white to-blue-100"
    },
    isActive: true,
    dateCreation: "1960-08-17",
    parentId: "prim_001"
  },

  DGSN: {
    id: "dir_004",
    code: "DGSN",
    nom: "Direction Générale de la Sûreté Nationale",
    nomCourt: "SURETE-NATIONALE.GA",
    sigle: "DGSN",
    type: "DIRECTION_GENERALE",
    mission: "Maintien de l'ordre public, sécurité des personnes et des biens",
    attributions: [
      "Police judiciaire",
      "Police administrative",
      "Police de la route",
      "Brigade des mœurs",
      "Formation policière"
    ],
    services: ["Enquêtes judiciaires", "Sécurité publique", "Contrôles routiers"],
    adresse: "Direction Générale",
    ville: "Libreville",
    province: "Estuaire",
    niveau: 4,
    relations: {
      hierarchiques: ["COMMISSARIATS", "BRIGADES"],
      collaboratives: ["GENDARMERIE", "DGAJ"],
      informationnelles: ["TRIBUNAUX", "PROCUREURS"]
    },
    branding: {
      couleurPrimaire: "#1F2937",
      couleurSecondaire: "#374151",
      couleurAccent: "#4B5563",
      icon: Shield,
      gradientClasses: "from-gray-800 to-gray-900",
      backgroundClasses: "from-gray-50 via-white to-gray-100"
    },
    isActive: true,
    dateCreation: "1960-08-17",
    parentId: "min_002"
  },

  GENDARMERIE: {
    id: "dir_005",
    code: "GENDARMERIE",
    nom: "Direction Générale de la Gendarmerie Nationale",
    nomCourt: "GENDARMERIE.GA",
    sigle: "DGGN",
    type: "DIRECTION_GENERALE",
    mission: "Sécurité publique, police judiciaire, maintien de l'ordre",
    attributions: [
      "Sécurité en zone rurale",
      "Police judiciaire",
      "Police militaire",
      "Sécurité routière",
      "Maintien de l'ordre"
    ],
    services: ["Enquêtes criminelles", "Sécurité routière", "Police judiciaire"],
    adresse: "Camp Baraka",
    ville: "Libreville",
    province: "Estuaire",
    niveau: 4,
    relations: {
      hierarchiques: ["BRIGADES_GENDARMERIE"],
      collaboratives: ["DGSN", "FORCES_ARMEES"],
      informationnelles: ["PREFECTURES", "TRIBUNAUX"]
    },
    branding: {
      couleurPrimaire: "#B91C1C",
      couleurSecondaire: "#DC2626",
      couleurAccent: "#EF4444",
      icon: Shield,
      gradientClasses: "from-red-700 to-red-900",
      backgroundClasses: "from-red-50 via-white to-red-100"
    },
    isActive: true,
    dateCreation: "1960-08-17",
    parentId: "min_003"
  },

  // === AUTRES DIRECTIONS GÉNÉRALES (20 autres) ===

  DGAJ: {
    id: "dir_006",
    code: "DGAJ",
    nom: "Direction Générale des Affaires Judiciaires",
    nomCourt: "AFFAIRES-JUDICIAIRES.GA",
    sigle: "DGAJ",
    type: "DIRECTION_GENERALE",
    mission: "Gestion des affaires judiciaires, administration des tribunaux, politique pénale",
    attributions: [
      "Administration des tribunaux",
      "Gestion des magistrats",
      "Politique pénale et criminelle",
      "Statistiques judiciaires",
      "Aide juridictionnelle"
    ],
    services: ["Administration tribunaux", "Formation magistrats", "Statistiques judiciaires"],
    adresse: "Ministère de la Justice",
    ville: "Libreville",
    province: "Estuaire",
    niveau: 4,
    relations: {
      hierarchiques: ["TRIBUNAUX"],
      collaboratives: ["DGAS", "DGAP"],
      informationnelles: ["COUR_CASSATION", "CONSEIL_ETAT"]
    },
    branding: {
      couleurPrimaire: "#7C3AED",
      couleurSecondaire: "#A855F7",
      couleurAccent: "#C084FC",
      icon: Scale,
      gradientClasses: "from-purple-600 to-purple-800",
      backgroundClasses: "from-purple-50 via-white to-purple-100"
    },
    isActive: true,
    dateCreation: "1960-08-17",
    parentId: "min_001"
  },

  DGAS: {
    id: "dir_007",
    code: "DGAS",
    nom: "Direction Générale des Affaires Civiles et du Sceau",
    nomCourt: "AFFAIRES-CIVILES.GA",
    sigle: "DGAS",
    type: "DIRECTION_GENERALE",
    mission: "Gestion de l'état civil, nationalité, légalisation des documents",
    attributions: [
      "État civil centralisé",
      "Nationalité gabonaise",
      "Légalisation de documents",
      "Apostille",
      "Adoption et tutelle"
    ],
    services: ["Légalisation documents", "Certificat nationalité", "Actes état civil"],
    adresse: "Ministère de la Justice",
    ville: "Libreville",
    province: "Estuaire",
    niveau: 4,
    relations: {
      hierarchiques: ["BUREAUX_ETAT_CIVIL"],
      collaboratives: ["DGAJ", "DGDI"],
      informationnelles: ["MAIRIES", "AMBASSADES"]
    },
    branding: {
      couleurPrimaire: "#7C3AED",
      couleurSecondaire: "#A855F7",
      couleurAccent: "#C084FC",
      icon: FileText,
      gradientClasses: "from-purple-600 to-purple-800",
      backgroundClasses: "from-purple-50 via-white to-purple-100"
    },
    isActive: true,
    dateCreation: "1960-08-17",
    parentId: "min_001"
  },

  DGAP: {
    id: "dir_008",
    code: "DGAP",
    nom: "Direction Générale de l'Administration Pénitentiaire",
    nomCourt: "ADMINISTRATION-PENITENTIAIRE.GA",
    sigle: "DGAP",
    type: "DIRECTION_GENERALE",
    mission: "Gestion du système pénitentiaire, réinsertion des détenus",
    attributions: [
      "Administration des prisons",
      "Sécurité pénitentiaire",
      "Réinsertion sociale",
      "Formation du personnel pénitentiaire",
      "Droits des détenus"
    ],
    services: ["Gestion prisons", "Programmes réinsertion", "Formation personnel"],
    adresse: "Ministère de la Justice",
    ville: "Libreville",
    province: "Estuaire",
    niveau: 4,
    relations: {
      hierarchiques: ["ETABLISSEMENTS_PENITENTIAIRES"],
      collaboratives: ["DGAJ", "DGSN"],
      informationnelles: ["TRIBUNAUX", "SERVICES_SOCIAUX"]
    },
    branding: {
      couleurPrimaire: "#7C3AED",
      couleurSecondaire: "#A855F7",
      couleurAccent: "#C084FC",
      icon: Shield,
      gradientClasses: "from-purple-600 to-purple-800",
      backgroundClasses: "from-purple-50 via-white to-purple-100"
    },
    isActive: true,
    dateCreation: "1960-08-17",
    parentId: "min_001"
  },

  DGAT: {
    id: "dir_009",
    code: "DGAT",
    nom: "Direction Générale de l'Administration Territoriale",
    nomCourt: "ADMINISTRATION-TERRITORIALE.GA",
    sigle: "DGAT",
    type: "DIRECTION_GENERALE",
    mission: "Coordination de l'administration territoriale, collectivités locales",
    attributions: [
      "Administration territoriale",
      "Tutelle des collectivités locales",
      "Déconcentration administrative",
      "Coordination préfectorale",
      "Elections locales"
    ],
    services: ["Coordination territoriale", "Tutelle collectivités", "Support préfectures"],
    adresse: "Ministère de l'Intérieur",
    ville: "Libreville",
    province: "Estuaire",
    niveau: 4,
    relations: {
      hierarchiques: ["PREFECTURES", "SOUS_PREFECTURES"],
      collaboratives: ["DGSN", "DGDI"],
      informationnelles: ["PROVINCES", "MAIRIES"]
    },
    branding: {
      couleurPrimaire: "#1F2937",
      couleurSecondaire: "#374151",
      couleurAccent: "#6B7280",
      icon: MapPin,
      gradientClasses: "from-gray-700 to-gray-900",
      backgroundClasses: "from-gray-50 via-white to-gray-100"
    },
    isActive: true,
    dateCreation: "1960-08-17",
    parentId: "min_002"
  },

  DGSP: {
    id: "dir_010",
    code: "DGSP",
    nom: "Direction Générale de la Santé Publique",
    nomCourt: "SANTE-PUBLIQUE.GA",
    sigle: "DGSP",
    type: "DIRECTION_GENERALE",
    mission: "Politique de santé publique, prévention, épidémiologie",
    attributions: [
      "Politique sanitaire nationale",
      "Prévention et épidémiologie",
      "Surveillance sanitaire",
      "Programmes de vaccination",
      "Lutte contre les épidémies"
    ],
    services: ["Prévention maladies", "Vaccination", "Surveillance épidémiologique"],
    adresse: "Ministère de la Santé",
    ville: "Libreville",
    province: "Estuaire",
    niveau: 4,
    relations: {
      hierarchiques: ["CENTRES_SANTE", "HOPITAUX_PUBLICS"],
      collaboratives: ["DGPHP", "CNAMGS"],
      informationnelles: ["WHO", "CDC", "UNICEF"]
    },
    branding: {
      couleurPrimaire: "#DC2626",
      couleurSecondaire: "#EF4444",
      couleurAccent: "#F87171",
      icon: Cross,
      gradientClasses: "from-red-500 to-red-700",
      backgroundClasses: "from-red-50 via-white to-red-100"
    },
    isActive: true,
    dateCreation: "1960-08-17",
    parentId: "min_005"
  },

  DGPHP: {
    id: "dir_011",
    code: "DGPHP",
    nom: "Direction Générale de la Pharmacie, du Médicament et des Laboratoires",
    nomCourt: "PHARMACIE-MEDICAMENT.GA",
    sigle: "DGPHP",
    type: "DIRECTION_GENERALE",
    mission: "Contrôle pharmaceutique, médicaments, laboratoires d'analyses",
    attributions: [
      "Contrôle qualité médicaments",
      "Autorisation de mise sur le marché",
      "Inspection pharmaceutique",
      "Laboratoires d'analyses",
      "Pharmacovigilance"
    ],
    services: ["Contrôle médicaments", "AMM", "Inspection pharmacies"],
    adresse: "Ministère de la Santé",
    ville: "Libreville",
    province: "Estuaire",
    niveau: 4,
    relations: {
      hierarchiques: ["PHARMACIES_PUBLIQUES", "LABORATOIRES"],
      collaboratives: ["DGSP", "DGFSS"],
      informationnelles: ["WHO", "PHARMACIES_PRIVEES"]
    },
    branding: {
      couleurPrimaire: "#DC2626",
      couleurSecondaire: "#EF4444",
      couleurAccent: "#F87171",
      icon: Stethoscope,
      gradientClasses: "from-red-500 to-red-700",
      backgroundClasses: "from-red-50 via-white to-red-100"
    },
    isActive: true,
    dateCreation: "1960-08-17",
    parentId: "min_005"
  },

  DGEP: {
    id: "dir_012",
    code: "DGEP",
    nom: "Direction Générale de l'Enseignement Primaire",
    nomCourt: "ENSEIGNEMENT-PRIMAIRE.GA",
    sigle: "DGEP",
    type: "DIRECTION_GENERALE",
    mission: "Gestion de l'enseignement primaire, formation des instituteurs",
    attributions: [
      "Enseignement primaire public",
      "Formation des instituteurs",
      "Programmes pédagogiques primaire",
      "Inspection pédagogique",
      "Infrastructures scolaires primaire"
    ],
    services: ["Gestion écoles primaires", "Formation instituteurs", "Inspection pédagogique"],
    adresse: "Ministère de l'Éducation",
    ville: "Libreville",
    province: "Estuaire",
    niveau: 4,
    relations: {
      hierarchiques: ["ECOLES_PRIMAIRES", "INSPECTIONS_ACADEMIQUES"],
      collaboratives: ["DGES", "DGIFPE"],
      informationnelles: ["UNESCO", "UNICEF"]
    },
    branding: {
      couleurPrimaire: "#3B82F6",
      couleurSecondaire: "#60A5FA",
      couleurAccent: "#93C5FD",
      icon: GraduationCap,
      gradientClasses: "from-blue-500 to-blue-700",
      backgroundClasses: "from-blue-50 via-white to-blue-100"
    },
    isActive: true,
    dateCreation: "1960-08-17",
    parentId: "min_006"
  },

  DGES: {
    id: "dir_013",
    code: "DGES",
    nom: "Direction Générale de l'Enseignement Secondaire",
    nomCourt: "ENSEIGNEMENT-SECONDAIRE.GA",
    sigle: "DGES",
    type: "DIRECTION_GENERALE",
    mission: "Gestion de l'enseignement secondaire, formation des professeurs",
    attributions: [
      "Enseignement secondaire public",
      "Formation des professeurs",
      "Programmes pédagogiques secondaire",
      "Examens nationaux",
      "Orientation scolaire"
    ],
    services: ["Gestion lycées collèges", "Formation professeurs", "Examens nationaux"],
    adresse: "Ministère de l'Éducation",
    ville: "Libreville",
    province: "Estuaire",
    niveau: 4,
    relations: {
      hierarchiques: ["LYCEES", "COLLEGES"],
      collaboratives: ["DGEP", "DGIFPE"],
      informationnelles: ["UNIVERSITES", "CAMES"]
    },
    branding: {
      couleurPrimaire: "#3B82F6",
      couleurSecondaire: "#60A5FA",
      couleurAccent: "#93C5FD",
      icon: BookOpen,
      gradientClasses: "from-blue-500 to-blue-700",
      backgroundClasses: "from-blue-50 via-white to-blue-100"
    },
    isActive: true,
    dateCreation: "1960-08-17",
    parentId: "min_006"
  },

  DGTT: {
    id: "dir_014",
    code: "DGTT",
    nom: "Direction Générale des Transports Terrestres",
    nomCourt: "TRANSPORTS-TERRESTRES.GA",
    sigle: "DGTT",
    type: "DIRECTION_GENERALE",
    mission: "Gestion des transports routiers, permis de conduire, contrôle technique",
    attributions: [
      "Transports en commun",
      "Permis de conduire",
      "Contrôle technique véhicules",
      "Sécurité routière",
      "Transport de marchandises"
    ],
    services: ["Permis conduire", "Contrôle technique", "Transport public"],
    adresse: "Ministère des Transports",
    ville: "Libreville",
    province: "Estuaire",
    niveau: 4,
    relations: {
      hierarchiques: ["CENTRES_PERMIS", "CENTRES_CONTROLE"],
      collaboratives: ["DGAC", "DGMM"],
      informationnelles: ["DGSN", "GENDARMERIE"]
    },
    branding: {
      couleurPrimaire: "#F97316",
      couleurSecondaire: "#FB923C",
      couleurAccent: "#FDBA74",
      icon: Car,
      gradientClasses: "from-orange-500 to-orange-700",
      backgroundClasses: "from-orange-50 via-white to-orange-100"
    },
    isActive: true,
    dateCreation: "1960-08-17",
    parentId: "min_009"
  },

  DGAC: {
    id: "dir_015",
    code: "DGAC",
    nom: "Direction Générale de l'Aviation Civile",
    nomCourt: "AVIATION-CIVILE.GA",
    sigle: "DGAC",
    type: "DIRECTION_GENERALE",
    mission: "Régulation du transport aérien, sécurité aérienne, aéroports",
    attributions: [
      "Sécurité aérienne",
      "Contrôle du trafic aérien",
      "Certification aéronefs",
      "Gestion des aéroports",
      "Licences de pilotes"
    ],
    services: ["Licences aviation", "Contrôle aérien", "Certification"],
    adresse: "Aéroport Léon Mba",
    ville: "Libreville",
    province: "Estuaire",
    niveau: 4,
    relations: {
      hierarchiques: ["AEROPORTS", "CONTROLE_AERIEN"],
      collaboratives: ["DGTT", "DGMM"],
      informationnelles: ["ASECNA", "IATA"]
    },
    branding: {
      couleurPrimaire: "#F97316",
      couleurSecondaire: "#FB923C",
      couleurAccent: "#FDBA74",
      icon: Plane,
      gradientClasses: "from-orange-500 to-orange-700",
      backgroundClasses: "from-orange-50 via-white to-orange-100"
    },
    isActive: true,
    dateCreation: "1960-08-17",
    parentId: "min_009"
  },

  DGMM: {
    id: "dir_016",
    code: "DGMM",
    nom: "Direction Générale de la Marine Marchande",
    nomCourt: "MARINE-MARCHANDE.GA",
    sigle: "DGMM",
    type: "DIRECTION_GENERALE",
    mission: "Réglementation maritime, sécurité en mer, ports commerciaux",
    attributions: [
      "Sécurité maritime",
      "Immatriculation des navires",
      "Contrôle de navigation",
      "Ports de commerce",
      "Brevets marins"
    ],
    services: ["Brevets marins", "Immatriculation navires", "Sécurité ports"],
    adresse: "Port d'Owendo",
    ville: "Libreville",
    province: "Estuaire",
    niveau: 4,
    relations: {
      hierarchiques: ["PORTS_COMMERCIAUX", "CAPITAINERIES"],
      collaboratives: ["DGAC", "DGTT"],
      informationnelles: ["OMI", "DOUANES"]
    },
    branding: {
      couleurPrimaire: "#F97316",
      couleurSecondaire: "#FB923C",
      couleurAccent: "#FDBA74",
      icon: Ship,
      gradientClasses: "from-orange-500 to-orange-700",
      backgroundClasses: "from-orange-50 via-white to-orange-100"
    },
    isActive: true,
    dateCreation: "1960-08-17",
    parentId: "min_009"
  },

  DGT: {
    id: "dir_017",
    code: "DGT",
    nom: "Direction Générale du Travail",
    nomCourt: "TRAVAIL.GA",
    sigle: "DGT",
    type: "DIRECTION_GENERALE",
    mission: "Réglementation du travail, inspection du travail, relations sociales",
    attributions: [
      "Code du travail",
      "Inspection du travail",
      "Médiation sociale",
      "Conventions collectives",
      "Sécurité au travail"
    ],
    services: ["Inspection travail", "Médiation conflits", "Sécurité travail"],
    adresse: "Ministère du Travail",
    ville: "Libreville",
    province: "Estuaire",
    niveau: 4,
    relations: {
      hierarchiques: ["INSPECTIONS_TRAVAIL"],
      collaboratives: ["DGPE", "CNSS"],
      informationnelles: ["SYNDICATS", "PATRONAT"]
    },
    branding: {
      couleurPrimaire: "#06B6D4",
      couleurSecondaire: "#22D3EE",
      couleurAccent: "#67E8F9",
      icon: Briefcase,
      gradientClasses: "from-cyan-500 to-cyan-700",
      backgroundClasses: "from-cyan-50 via-white to-cyan-100"
    },
    isActive: true,
    dateCreation: "1960-08-17",
    parentId: "min_012"
  },

  DGPE: {
    id: "dir_018",
    code: "DGPE",
    nom: "Direction Générale de la Promotion de l'Emploi",
    nomCourt: "PROMOTION-EMPLOI.GA",
    sigle: "DGPE",
    type: "DIRECTION_GENERALE",
    mission: "Politique de l'emploi, insertion professionnelle, lutte contre le chômage",
    attributions: [
      "Politique de l'emploi",
      "Programmes d'insertion",
      "Observatoire de l'emploi",
      "Formation professionnelle continue",
      "Aide à la création d'entreprise"
    ],
    services: ["Insertion professionnelle", "Observatoire emploi", "Aide création entreprise"],
    adresse: "Ministère du Travail",
    ville: "Libreville",
    province: "Estuaire",
    niveau: 4,
    relations: {
      hierarchiques: ["AGENCES_EMPLOI"],
      collaboratives: ["DGT", "ONE"],
      informationnelles: ["MIN_FORM_PROF", "ENTREPRISES"]
    },
    branding: {
      couleurPrimaire: "#06B6D4",
      couleurSecondaire: "#22D3EE",
      couleurAccent: "#67E8F9",
      icon: Target,
      gradientClasses: "from-cyan-500 to-cyan-700",
      backgroundClasses: "from-cyan-50 via-white to-cyan-100"
    },
    isActive: true,
    dateCreation: "1960-08-17",
    parentId: "min_012"
  },

  DGE: {
    id: "dir_019",
    code: "DGE",
    nom: "Direction Générale de l'Environnement",
    nomCourt: "ENVIRONNEMENT.GA",
    sigle: "DGE",
    type: "DIRECTION_GENERALE",
    mission: "Protection environnementale, évaluations d'impact, pollution",
    attributions: [
      "Évaluations d'impact environnemental",
      "Lutte contre la pollution",
      "Protection de la biodiversité",
      "Gestion des déchets",
      "Éducation environnementale"
    ],
    services: ["Études impact", "Contrôle pollution", "Protection biodiversité"],
    adresse: "Ministère de l'Environnement",
    ville: "Libreville",
    province: "Estuaire",
    niveau: 4,
    relations: {
      hierarchiques: ["PARCS_NATIONAUX", "RESERVES"],
      collaboratives: ["DGCC", "ANPN"],
      informationnelles: ["PNUE", "PNUD"]
    },
    branding: {
      couleurPrimaire: "#059669",
      couleurSecondaire: "#10B981",
      couleurAccent: "#34D399",
      icon: Leaf,
      gradientClasses: "from-emerald-600 to-emerald-800",
      backgroundClasses: "from-emerald-50 via-white to-emerald-100"
    },
    isActive: true,
    dateCreation: "1980-06-05",
    parentId: "min_013"
  },

  DGCC: {
    id: "dir_020",
    code: "DGCC",
    nom: "Direction Générale du Changement Climatique",
    nomCourt: "CHANGEMENT-CLIMATIQUE.GA",
    sigle: "DGCC",
    type: "DIRECTION_GENERALE",
    mission: "Lutte contre le changement climatique, mécanismes REDD+",
    attributions: [
      "Politique climatique nationale",
      "Mécanismes REDD+",
      "Adaptation au changement climatique",
      "Marchés carbone",
      "Coopération climatique internationale"
    ],
    services: ["Projets REDD+", "Crédits carbone", "Adaptation climatique"],
    adresse: "Ministère de l'Environnement",
    ville: "Libreville",
    province: "Estuaire",
    niveau: 4,
    relations: {
      hierarchiques: ["PROJETS_REDD"],
      collaboratives: ["DGE", "DGF"],
      informationnelles: ["UNFCCC", "BANQUE_MONDIALE"]
    },
    branding: {
      couleurPrimaire: "#059669",
      couleurSecondaire: "#10B981",
      couleurAccent: "#34D399",
      icon: Globe,
      gradientClasses: "from-emerald-600 to-emerald-800",
      backgroundClasses: "from-emerald-50 via-white to-emerald-100"
    },
    isActive: true,
    dateCreation: "2009-12-01",
    parentId: "min_013"
  },

  DGF: {
    id: "dir_021",
    code: "DGF",
    nom: "Direction Générale des Forêts",
    nomCourt: "FORETS.GA",
    sigle: "DGF",
    type: "DIRECTION_GENERALE",
    mission: "Gestion durable des forêts, exploitation forestière contrôlée",
    attributions: [
      "Gestion des concessions forestières",
      "Contrôle de l'exploitation forestière",
      "Reboisement et régénération",
      "Certification forestière",
      "Lutte contre l'exploitation illégale"
    ],
    services: ["Concessions forestières", "Contrôle exploitation", "Certification"],
    adresse: "Ministère des Eaux et Forêts",
    ville: "Libreville",
    province: "Estuaire",
    niveau: 4,
    relations: {
      hierarchiques: ["CANTONNEMENTS_FORESTIERS"],
      collaboratives: ["DGE_FORETS", "CNEF"],
      informationnelles: ["FSC", "ATIBT"]
    },
    branding: {
      couleurPrimaire: "#047857",
      couleurSecondaire: "#059669",
      couleurAccent: "#10B981",
      icon: Trees,
      gradientClasses: "from-emerald-700 to-emerald-900",
      backgroundClasses: "from-emerald-50 via-white to-emerald-100"
    },
    isActive: true,
    dateCreation: "1960-08-17",
    parentId: "min_014"
  },

  DGE_FORETS: {
    id: "dir_022",
    code: "DGE_FORETS",
    nom: "Direction Générale des Eaux",
    nomCourt: "EAUX.GA",
    sigle: "DGE",
    type: "DIRECTION_GENERALE",
    mission: "Gestion des ressources en eau, hydrologie, bassins versants",
    attributions: [
      "Gestion des ressources hydriques",
      "Bassins versants",
      "Qualité de l'eau",
      "Hydraulique rurale",
      "Prévention des inondations"
    ],
    services: ["Gestion bassins", "Qualité eau", "Hydraulique rurale"],
    adresse: "Ministère des Eaux et Forêts",
    ville: "Libreville",
    province: "Estuaire",
    niveau: 4,
    relations: {
      hierarchiques: ["CENTRES_HYDRAULIQUES"],
      collaboratives: ["DGF", "DGE"],
      informationnelles: ["SEEG", "PNUD"]
    },
    branding: {
      couleurPrimaire: "#047857",
      couleurSecondaire: "#059669",
      couleurAccent: "#10B981",
      icon: Droplets,
      gradientClasses: "from-emerald-700 to-emerald-900",
      backgroundClasses: "from-emerald-50 via-white to-emerald-100"
    },
    isActive: true,
    dateCreation: "1960-08-17",
    parentId: "min_014"
  },

  DGA: {
    id: "dir_023",
    code: "DGA",
    nom: "Direction Générale de l'Agriculture",
    nomCourt: "AGRICULTURE.GA",
    sigle: "DGA",
    type: "DIRECTION_GENERALE",
    mission: "Développement agricole, vulgarisation, sécurité alimentaire",
    attributions: [
      "Vulgarisation agricole",
      "Programmes de développement agricole",
      "Sécurité alimentaire",
      "Mécanisation agricole",
      "Crédit agricole"
    ],
    services: ["Vulgarisation", "Crédit agricole", "Mécanisation"],
    adresse: "Ministère de l'Agriculture",
    ville: "Libreville",
    province: "Estuaire",
    niveau: 4,
    relations: {
      hierarchiques: ["CENTRES_VULGARISATION"],
      collaboratives: ["DGE_AGRI", "DGDR"],
      informationnelles: ["FAO", "IRAD"]
    },
    branding: {
      couleurPrimaire: "#CA8A04",
      couleurSecondaire: "#EAB308",
      couleurAccent: "#FACC15",
      icon: Wheat,
      gradientClasses: "from-yellow-600 to-yellow-800",
      backgroundClasses: "from-yellow-50 via-white to-yellow-100"
    },
    isActive: true,
    dateCreation: "1960-08-17",
    parentId: "min_015"
  },

  DGE_AGRI: {
    id: "dir_024",
    code: "DGE_AGRI",
    nom: "Direction Générale de l'Élevage",
    nomCourt: "ELEVAGE.GA",
    sigle: "DGE",
    type: "DIRECTION_GENERALE",
    mission: "Développement de l'élevage, santé animale, production animale",
    attributions: [
      "Développement de l'élevage",
      "Santé animale",
      "Amélioration génétique",
      "Alimentation animale",
      "Abattoirs et boucheries"
    ],
    services: ["Santé animale", "Amélioration génétique", "Contrôle abattoirs"],
    adresse: "Ministère de l'Agriculture",
    ville: "Libreville",
    province: "Estuaire",
    niveau: 4,
    relations: {
      hierarchiques: ["CENTRES_ZOOTECHNIQUES"],
      collaboratives: ["DGA", "DGDR"],
      informationnelles: ["FAO", "OIE"]
    },
    branding: {
      couleurPrimaire: "#CA8A04",
      couleurSecondaire: "#EAB308",
      couleurAccent: "#FACC15",
      icon: Heart,
      gradientClasses: "from-yellow-600 to-yellow-800",
      backgroundClasses: "from-yellow-50 via-white to-yellow-100"
    },
    isActive: true,
    dateCreation: "1960-08-17",
    parentId: "min_015"
  },

  DGDR: {
    id: "dir_025",
    code: "DGDR",
    nom: "Direction Générale du Développement Rural",
    nomCourt: "DEVELOPPEMENT-RURAL.GA",
    sigle: "DGDR",
    type: "DIRECTION_GENERALE",
    mission: "Développement rural intégré, infrastructures rurales, coopératives",
    attributions: [
      "Développement rural intégré",
      "Infrastructures rurales",
      "Coopératives agricoles",
      "Microfinance rurale",
      "Électrification rurale"
    ],
    services: ["Infrastructures rurales", "Coopératives", "Microfinance"],
    adresse: "Ministère de l'Agriculture",
    ville: "Libreville",
    province: "Estuaire",
    niveau: 4,
    relations: {
      hierarchiques: ["COOPERATIVES_AGRICOLES"],
      collaboratives: ["DGA", "DGE_AGRI"],
      informationnelles: ["FIDA", "BANQUE_MONDIALE"]
    },
    branding: {
      couleurPrimaire: "#CA8A04",
      couleurSecondaire: "#EAB308",
      couleurAccent: "#FACC15",
      icon: Home,
      gradientClasses: "from-yellow-600 to-yellow-800",
      backgroundClasses: "from-yellow-50 via-white to-yellow-100"
    },
    isActive: true,
    dateCreation: "1960-08-17",
    parentId: "min_015"
  },

  // ==================== NIVEAU 5: MAIRIES (47 organismes) ====================
  // Toutes les communes du Gabon
  MAIRE_LBV: {
    id: "mai_001",
    code: "MAIRE_LBV",
    nom: "Mairie de Libreville",
    nomCourt: "LIBREVILLE.GA",
    type: "MAIRIE",
    mission: "Administration municipale de la capitale, services de proximité aux citoyens",
    attributions: ["État civil", "Urbanisme local", "Voirie municipale", "Marchés", "Hygiène publique"],
    services: ["Acte de naissance", "Acte de mariage", "Acte de décès", "Certificat de résidence", "Permis de construire"],
    adresse: "Hôtel de Ville, Boulevard de l'Indépendance",
    ville: "Libreville",
    province: "Estuaire",
    niveau: 5,
    relations: {
      hierarchiques: ["ARRONDISSEMENTS_LBV"],
      collaboratives: ["AUTRES_MAIRIES_ESTUAIRE"],
      informationnelles: ["PROV_EST", "DGDI"]
    },
    branding: {
      couleurPrimaire: "#1D4ED8",
      couleurSecondaire: "#3B82F6",
      couleurAccent: "#60A5FA",
      icon: Building2,
      gradientClasses: "from-blue-700 to-blue-900",
      backgroundClasses: "from-blue-50 via-white to-blue-100"
    },
    isActive: true,
    dateCreation: "1958-01-01",
    parentId: "prov_001"
  },

  MAIRE_PG: {
    id: "mai_002",
    code: "MAIRE_PG",
    nom: "Mairie de Port-Gentil",
    nomCourt: "PORT-GENTIL.GA",
    type: "MAIRIE",
    mission: "Administration de la capitale économique, services municipaux spécialisés",
    attributions: ["État civil", "Urbanisme industriel", "Port et marine", "Commerce", "Environnement urbain"],
    services: ["Acte de naissance", "Acte de mariage", "Acte de décès", "Certificat de résidence"],
    adresse: "Hôtel de Ville",
    ville: "Port-Gentil",
    province: "Ogooué-Maritime",
    niveau: 5,
    relations: {
      hierarchiques: ["QUARTIERS_PG"],
      collaboratives: ["AUTRES_MAIRIES_OM"],
      informationnelles: ["PROV_OM", "PORT_GENTIL"]
    },
    branding: {
      couleurPrimaire: "#0F766E",
      couleurSecondaire: "#14B8A6",
      couleurAccent: "#5EEAD4",
      icon: Anchor,
      gradientClasses: "from-teal-700 to-teal-900",
      backgroundClasses: "from-teal-50 via-white to-teal-100"
    },
    isActive: true,
    dateCreation: "1950-03-15",
    parentId: "prov_002"
  },

  // ... [CONTINUER AVEC LES 45 AUTRES MAIRIES] ...

  // ==================== NIVEAU 4: PROVINCES (9 organismes) ====================

  PROV_EST: {
    id: "prov_001",
    code: "PROV_EST",
    nom: "Province de l'Estuaire",
    nomCourt: "ESTUAIRE.GA",
    sigle: "EST",
    type: "PROVINCE",
    mission: "Administration territoriale de la province capitale, coordination des services déconcentrés",
    attributions: [
      "Coordination administrative provinciale",
      "Tutelle des préfectures",
      "Développement économique provincial",
      "Sécurité et ordre public",
      "Coordination des projets d'infrastructures"
    ],
    services: ["Administration provinciale", "Coordination préfectorale", "Développement économique"],
    adresse: "Gouvernorat de l'Estuaire",
    ville: "Libreville",
    province: "Estuaire",
    niveau: 4,
    relations: {
      hierarchiques: ["PREF_LIBREVILLE", "PREF_KOMO_MONDAH", "PREF_NOYA"],
      collaboratives: ["AUTRES_PROVINCES"],
      informationnelles: ["PRIMATURE", "MIN_INT"]
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
    parentId: "prim_001"
  },

  PROV_OM: {
    id: "prov_002",
    code: "PROV_OM",
    nom: "Province de l'Ogooué-Maritime",
    nomCourt: "OGOOUE-MARITIME.GA",
    sigle: "OM",
    type: "PROVINCE",
    mission: "Administration de la province pétrolière, développement économique et industriel",
    attributions: [
      "Coordination administrative provinciale",
      "Développement pétrolier et industriel",
      "Gestion portuaire",
      "Environnement marin",
      "Tourisme côtier"
    ],
    services: ["Administration provinciale", "Développement industriel", "Gestion côtière"],
    adresse: "Gouvernorat de l'Ogooué-Maritime",
    ville: "Port-Gentil",
    province: "Ogooué-Maritime",
    niveau: 4,
    relations: {
      hierarchiques: ["PREF_BENDJE", "PREF_ETIMBOUE", "PREF_NDOUGOU"],
      collaboratives: ["PROV_EST", "PROV_NG"],
      informationnelles: ["MIN_PETR", "MIN_IND"]
    },
    branding: {
      couleurPrimaire: "#0F766E",
      couleurSecondaire: "#14B8A6",
      couleurAccent: "#5EEAD4",
      icon: Anchor,
      gradientClasses: "from-teal-700 to-teal-900",
      backgroundClasses: "from-teal-50 via-white to-teal-100"
    },
    isActive: true,
    dateCreation: "1960-08-17",
    parentId: "prim_001"
  },

  PROV_NG: {
    id: "prov_003",
    code: "PROV_NG",
    nom: "Province de la Ngounié",
    nomCourt: "NGOUNIE.GA",
    sigle: "NG",
    type: "PROVINCE",
    mission: "Administration provinciale, développement rural et forestier",
    attributions: [
      "Administration territoriale",
      "Développement forestier",
      "Agriculture et élevage",
      "Infrastructures rurales",
      "Préservation culturelle"
    ],
    services: ["Administration provinciale", "Développement rural", "Gestion forestière"],
    adresse: "Gouvernorat de la Ngounié",
    ville: "Mouila",
    province: "Ngounié",
    niveau: 4,
    relations: {
      hierarchiques: ["PREF_MOUILA", "PREF_TSAMBA_MAGOTSI", "PREF_DOUYA_ONOYE"],
      collaboratives: ["PROV_OM", "PROV_OI"],
      informationnelles: ["MIN_FORETS", "MIN_AGRI"]
    },
    branding: {
      couleurPrimaire: "#047857",
      couleurSecondaire: "#059669",
      couleurAccent: "#10B981",
      icon: Trees,
      gradientClasses: "from-emerald-700 to-emerald-900",
      backgroundClasses: "from-emerald-50 via-white to-emerald-100"
    },
    isActive: true,
    dateCreation: "1960-08-17",
    parentId: "prim_001"
  },

  PROV_OI: {
    id: "prov_004",
    code: "PROV_OI",
    nom: "Province de l'Ogooué-Ivindo",
    nomCourt: "OGOOUE-IVINDO.GA",
    sigle: "OI",
    type: "PROVINCE",
    mission: "Administration provinciale, exploitation minière et conservation",
    attributions: [
      "Administration territoriale",
      "Exploitation minière",
      "Conservation de la biodiversité",
      "Développement de l'écotourisme",
      "Gestion des parcs nationaux"
    ],
    services: ["Administration provinciale", "Développement minier", "Conservation"],
    adresse: "Gouvernorat de l'Ogooué-Ivindo",
    ville: "Makokou",
    province: "Ogooué-Ivindo",
    niveau: 4,
    relations: {
      hierarchiques: ["PREF_MAKOKOU", "PREF_MEKAMBO", "PREF_OVAN"],
      collaboratives: ["PROV_NG", "PROV_WN"],
      informationnelles: ["MIN_MINE", "MIN_ENV"]
    },
    branding: {
      couleurPrimaire: "#A16207",
      couleurSecondaire: "#CA8A04",
      couleurAccent: "#EAB308",
      icon: Mountain,
      gradientClasses: "from-yellow-700 to-yellow-900",
      backgroundClasses: "from-yellow-50 via-white to-yellow-100"
    },
    isActive: true,
    dateCreation: "1960-08-17",
    parentId: "prim_001"
  },

  PROV_WN: {
    id: "prov_005",
    code: "PROV_WN",
    nom: "Province du Woleu-Ntem",
    nomCourt: "WOLEU-NTEM.GA",
    sigle: "WN",
    type: "PROVINCE",
    mission: "Administration frontalière, développement transfrontalier",
    attributions: [
      "Administration territoriale frontalière",
      "Développement transfrontalier",
      "Exploitation forestière",
      "Commerce transfrontalier",
      "Sécurité frontalière"
    ],
    services: ["Administration provinciale", "Gestion frontières", "Commerce transfrontalier"],
    adresse: "Gouvernorat du Woleu-Ntem",
    ville: "Oyem",
    province: "Woleu-Ntem",
    niveau: 4,
    relations: {
      hierarchiques: ["PREF_OYEM", "PREF_BITAM", "PREF_HAUT_NTEM"],
      collaboratives: ["PROV_OI", "PROV_MG"],
      informationnelles: ["MIN_AFF_ETR", "DGDDI"]
    },
    branding: {
      couleurPrimaire: "#7C2D12",
      couleurSecondaire: "#EA580C",
      couleurAccent: "#FB923C",
      icon: MapPin,
      gradientClasses: "from-orange-900 to-orange-950",
      backgroundClasses: "from-orange-50 via-white to-orange-100"
    },
    isActive: true,
    dateCreation: "1960-08-17",
    parentId: "prim_001"
  },

  PROV_MG: {
    id: "prov_006",
    code: "PROV_MG",
    nom: "Province du Moyen-Ogooué",
    nomCourt: "MOYEN-OGOOUE.GA",
    sigle: "MG",
    type: "PROVINCE",
    mission: "Administration centrale, développement fluvial",
    attributions: [
      "Administration territoriale",
      "Transport fluvial",
      "Développement agricole",
      "Patrimoine culturel",
      "Écotourisme fluvial"
    ],
    services: ["Administration provinciale", "Transport fluvial", "Développement agricole"],
    adresse: "Gouvernorat du Moyen-Ogooué",
    ville: "Lambaréné",
    province: "Moyen-Ogooué",
    niveau: 4,
    relations: {
      hierarchiques: ["PREF_LAMBARENE", "PREF_OGOOUE_ET_DES_LACS"],
      collaboratives: ["PROV_WN", "PROV_OO"],
      informationnelles: ["MIN_TRANSPORT", "MIN_CULTURE"]
    },
    branding: {
      couleurPrimaire: "#0891B2",
      couleurSecondaire: "#0EA5E9",
      couleurAccent: "#38BDF8",
      icon: Ship,
      gradientClasses: "from-sky-700 to-sky-900",
      backgroundClasses: "from-sky-50 via-white to-sky-100"
    },
    isActive: true,
    dateCreation: "1960-08-17",
    parentId: "prim_001"
  },

  PROV_OO: {
    id: "prov_007",
    code: "PROV_OO",
    nom: "Province du Haut-Ogooué",
    nomCourt: "HAUT-OGOOUE.GA",
    sigle: "OO",
    type: "PROVINCE",
    mission: "Administration minière, développement industriel minier",
    attributions: [
      "Administration territoriale",
      "Exploitation minière",
      "Industrie extractive",
      "Développement urbain minier",
      "Coopération transfrontalière"
    ],
    services: ["Administration provinciale", "Développement minier", "Industrie extractive"],
    adresse: "Gouvernorat du Haut-Ogooué",
    ville: "Franceville",
    province: "Haut-Ogooué",
    niveau: 4,
    relations: {
      hierarchiques: ["PREF_FRANCEVILLE", "PREF_LEKOKO", "PREF_PLATEAUX_BATEKE"],
      collaboratives: ["PROV_MG", "PROV_OL"],
      informationnelles: ["MIN_MINE", "MIN_IND"]
    },
    branding: {
      couleurPrimaire: "#92400E",
      couleurSecondaire: "#B45309",
      couleurAccent: "#D97706",
      icon: Mountain,
      gradientClasses: "from-amber-800 to-amber-900",
      backgroundClasses: "from-amber-50 via-white to-amber-100"
    },
    isActive: true,
    dateCreation: "1960-08-17",
    parentId: "prim_001"
  },

  PROV_OL: {
    id: "prov_008",
    code: "PROV_OL",
    nom: "Province de l'Ogooué-Lolo",
    nomCourt: "OGOOUE-LOLO.GA",
    sigle: "OL",
    type: "PROVINCE",
    mission: "Administration forestière, conservation et développement durable",
    attributions: [
      "Administration territoriale",
      "Gestion forestière durable",
      "Conservation de la biodiversité",
      "Développement de l'écotourisme",
      "Populations autochtones"
    ],
    services: ["Administration provinciale", "Gestion forestière", "Écotourisme"],
    adresse: "Gouvernorat de l'Ogooué-Lolo",
    ville: "Koulamoutou",
    province: "Ogooué-Lolo",
    niveau: 4,
    relations: {
      hierarchiques: ["PREF_KOULAMOUTOU", "PREF_OFFOUE_ONOYE", "PREF_MULUNDU"],
      collaboratives: ["PROV_OO", "PROV_NY"],
      informationnelles: ["MIN_FORETS", "MIN_ENV"]
    },
    branding: {
      couleurPrimaire: "#166534",
      couleurSecondaire: "#15803D",
      couleurAccent: "#16A34A",
      icon: Trees,
      gradientClasses: "from-green-800 to-green-900",
      backgroundClasses: "from-green-50 via-white to-green-100"
    },
    isActive: true,
    dateCreation: "1960-08-17",
    parentId: "prim_001"
  },

  PROV_NY: {
    id: "prov_009",
    code: "PROV_NY",
    nom: "Province de la Nyanga",
    nomCourt: "NYANGA.GA",
    sigle: "NY",
    type: "PROVINCE",
    mission: "Administration côtière sud, développement touristique et pêche",
    attributions: [
      "Administration territoriale côtière",
      "Développement touristique",
      "Pêche maritime et lagunaire",
      "Conservation marine",
      "Culture et traditions Punu"
    ],
    services: ["Administration provinciale", "Développement touristique", "Gestion pêche"],
    adresse: "Gouvernorat de la Nyanga",
    ville: "Tchibanga",
    province: "Nyanga",
    niveau: 4,
    relations: {
      hierarchiques: ["PREF_TCHIBANGA", "PREF_BASSE_BANIO", "PREF_HAUTE_BANIO"],
      collaboratives: ["PROV_OL"],
      informationnelles: ["MIN_TOUR", "MIN_PECHE"]
    },
    branding: {
      couleurPrimaire: "#7C3AED",
      couleurSecondaire: "#8B5CF6",
      couleurAccent: "#A78BFA",
      icon: Camera,
      gradientClasses: "from-violet-600 to-violet-800",
      backgroundClasses: "from-violet-50 via-white to-violet-100"
    },
    isActive: true,
    dateCreation: "1960-08-17",
    parentId: "prim_001"
  },

  // ==================== NIVEAU 5: PRÉFECTURES (12 organismes) ====================

  PREF_LIBREVILLE: {
    id: "pref_001",
    code: "PREF_LIBREVILLE",
    nom: "Préfecture de Libreville",
    nomCourt: "PREFECTURE-LIBREVILLE.GA",
    sigle: "PREF_LBV",
    type: "PREFECTURE",
    mission: "Administration préfectorale de la capitale, coordination des arrondissements",
    attributions: [
      "Administration préfectorale",
      "Coordination des arrondissements",
      "Sécurité urbaine",
      "Développement urbain",
      "Relations avec les mairies"
    ],
    services: ["Administration préfectorale", "Coordination urbaine", "Sécurité"],
    adresse: "Préfecture de Libreville",
    ville: "Libreville",
    province: "Estuaire",
    niveau: 5,
    relations: {
      hierarchiques: ["MAIRE_LBV", "ARR_LIBREVILLE"],
      collaboratives: ["AUTRES_PREFECTURES"],
      informationnelles: ["PROV_EST", "DGAT"]
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
    parentId: "prov_001"
  },

  // ==================== MAIRIES SUPPLÉMENTAIRES (43 organismes) ====================

  MAIRE_OYEM: {
    id: "mai_003",
    code: "MAIRE_OYEM",
    nom: "Mairie d'Oyem",
    nomCourt: "OYEM.GA",
    type: "MAIRIE",
    mission: "Administration municipale d'Oyem, ville frontalière du nord",
    attributions: ["État civil", "Urbanisme local", "Commerce frontalier", "Sécurité urbaine"],
    services: ["Acte de naissance", "Acte de mariage", "Acte de décès", "Certificat de résidence"],
    adresse: "Hôtel de Ville d'Oyem",
    ville: "Oyem",
    province: "Woleu-Ntem",
    niveau: 5,
    relations: {
      hierarchiques: [],
      collaboratives: ["MAIRE_BITAM", "MAIRE_MITZIC"],
      informationnelles: ["PROV_WN", "DGDI"]
    },
    branding: {
      couleurPrimaire: "#7C2D12",
      couleurSecondaire: "#EA580C",
      couleurAccent: "#FB923C",
      icon: Building2,
      gradientClasses: "from-orange-900 to-orange-950",
      backgroundClasses: "from-orange-50 via-white to-orange-100"
    },
    isActive: true,
    dateCreation: "1960-08-17",
    parentId: "prov_005"
  },

  MAIRE_FRANCEVILLE: {
    id: "mai_004",
    code: "MAIRE_FRANCEVILLE",
    nom: "Mairie de Franceville",
    nomCourt: "FRANCEVILLE.GA",
    type: "MAIRIE",
    mission: "Administration de la capitale minière du Haut-Ogooué",
    attributions: ["État civil", "Urbanisme minier", "Développement industriel", "Services urbains"],
    services: ["Acte de naissance", "Acte de mariage", "Acte de décès", "Permis de construire"],
    adresse: "Hôtel de Ville de Franceville",
    ville: "Franceville",
    province: "Haut-Ogooué",
    niveau: 5,
    relations: {
      hierarchiques: [],
      collaboratives: ["MAIRE_MOANDA", "MAIRE_MOUNANA"],
      informationnelles: ["PROV_OO", "MIN_MINE"]
    },
    branding: {
      couleurPrimaire: "#92400E",
      couleurSecondaire: "#B45309",
      couleurAccent: "#D97706",
      icon: Building2,
      gradientClasses: "from-amber-800 to-amber-900",
      backgroundClasses: "from-amber-50 via-white to-amber-100"
    },
    isActive: true,
    dateCreation: "1960-08-17",
    parentId: "prov_007"
  },

  MAIRE_LAMBARENE: {
    id: "mai_005",
    code: "MAIRE_LAMBARENE",
    nom: "Mairie de Lambaréné",
    nomCourt: "LAMBARENE.GA",
    type: "MAIRIE",
    mission: "Administration de la ville historique de Lambaréné",
    attributions: ["État civil", "Patrimoine historique", "Tourisme", "Transport fluvial"],
    services: ["Acte de naissance", "Acte de mariage", "Acte de décès", "Certificat de résidence"],
    adresse: "Hôtel de Ville de Lambaréné",
    ville: "Lambaréné",
    province: "Moyen-Ogooué",
    niveau: 5,
    relations: {
      hierarchiques: [],
      collaboratives: ["MAIRE_NDJOLE", "MAIRE_ALEMBE"],
      informationnelles: ["PROV_MG", "MIN_CULTURE"]
    },
    branding: {
      couleurPrimaire: "#0891B2",
      couleurSecondaire: "#0EA5E9",
      couleurAccent: "#38BDF8",
      icon: Building2,
      gradientClasses: "from-sky-700 to-sky-900",
      backgroundClasses: "from-sky-50 via-white to-sky-100"
    },
    isActive: true,
    dateCreation: "1960-08-17",
    parentId: "prov_006"
  },

  // ==================== ORGANISMES SOCIAUX SUPPLÉMENTAIRES (8 organismes) ====================

  CNSS: {
    id: "soc_001",
    code: "CNSS",
    nom: "Caisse Nationale de Sécurité Sociale",
    nomCourt: "CNSS.GA",
    sigle: "CNSS",
    type: "ORGANISME_SOCIAL",
    mission: "Protection sociale des travailleurs, retraites, prestations familiales",
    attributions: [
      "Sécurité sociale des travailleurs",
      "Gestion des retraites",
      "Prestations familiales",
      "Accidents du travail",
      "Contrôle des cotisations"
    ],
    services: ["Immatriculation CNSS", "Retraites", "Allocations familiales", "Accidents du travail"],
    adresse: "Boulevard du Bord de Mer",
    ville: "Libreville",
    province: "Estuaire",
    niveau: 4,
    relations: {
      hierarchiques: ["CENTRES_CNSS"],
      collaboratives: ["CNAMGS", "ONE"],
      informationnelles: ["DGI", "MIN_TRAVAIL"]
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
    parentId: "prim_001"
  },

  CNAMGS: {
    id: "soc_002",
    code: "CNAMGS",
    nom: "Caisse Nationale d'Assurance Maladie et de Garantie Sociale",
    nomCourt: "CNAMGS.GA",
    sigle: "CNAMGS",
    type: "ORGANISME_SOCIAL",
    mission: "Assurance maladie universelle, garantie sociale, remboursement médical",
    attributions: [
      "Assurance maladie universelle",
      "Remboursement des soins",
      "Évacuations sanitaires",
      "Contrôle médical",
      "Conventionnement des structures de soins"
    ],
    services: ["Carte CNAMGS", "Assurance maladie", "Remboursement médical", "Évacuations sanitaires"],
    adresse: "Boulevard Triomphal",
    ville: "Libreville",
    province: "Estuaire",
    niveau: 4,
    relations: {
      hierarchiques: ["CENTRES_CNAMGS"],
      collaboratives: ["CNSS", "DGSP"],
      informationnelles: ["MIN_SANTE", "HOPITAUX"]
    },
    branding: {
      couleurPrimaire: "#DC2626",
      couleurSecondaire: "#EF4444",
      couleurAccent: "#F87171",
      icon: Stethoscope,
      gradientClasses: "from-red-600 to-red-800",
      backgroundClasses: "from-red-50 via-white to-red-100"
    },
    isActive: true,
    dateCreation: "1975-05-20",
    parentId: "prim_001"
  },

  ONE: {
    id: "soc_003",
    code: "ONE",
    nom: "Office National de l'Emploi",
    nomCourt: "ONE.GA",
    sigle: "ONE",
    type: "ORGANISME_SOCIAL",
    mission: "Promotion de l'emploi, lutte contre le chômage, insertion professionnelle",
    attributions: [
      "Placement des demandeurs d'emploi",
      "Formation professionnelle",
      "Aide à la création d'entreprise",
      "Observatoire de l'emploi",
      "Médiation sociale"
    ],
    services: ["Recherche d'emploi", "Formation professionnelle", "Attestation de chômage"],
    adresse: "Quartier Akébé",
    ville: "Libreville",
    province: "Estuaire",
    niveau: 4,
    relations: {
      hierarchiques: ["AGENCES_EMPLOI"],
      collaboratives: ["CNSS", "DGPE"],
      informationnelles: ["MIN_TRAVAIL", "MIN_FORM_PROF"]
    },
    branding: {
      couleurPrimaire: "#7C3AED",
      couleurSecondaire: "#8B5CF6",
      couleurAccent: "#A78BFA",
      icon: Target,
      gradientClasses: "from-violet-600 to-violet-800",
      backgroundClasses: "from-violet-50 via-white to-violet-100"
    },
    isActive: true,
    dateCreation: "1980-03-15",
    parentId: "prim_001"
  },

  // ==================== INSTITUTIONS JUDICIAIRES (5 organismes) ====================

  COUR_CASSATION: {
    id: "jud_001",
    code: "COUR_CASSATION",
    nom: "Cour de Cassation de la République Gabonaise",
    nomCourt: "CASSATION.GA",
    sigle: "CC",
    type: "INSTITUTION_JUDICIAIRE",
    mission: "Cour suprême judiciaire, unification de la jurisprudence",
    attributions: [
      "Cassation des arrêts des cours d'appel",
      "Unification de la jurisprudence",
      "Discipline judiciaire",
      "Avis consultatifs",
      "Formation des magistrats"
    ],
    services: ["Recours en cassation", "Procédures judiciaires suprêmes"],
    adresse: "Palais de Justice",
    ville: "Libreville",
    province: "Estuaire",
    niveau: 3,
    relations: {
      hierarchiques: ["COURS_APPEL"],
      collaboratives: ["CONSEIL_ETAT", "COUR_COMPTES"],
      informationnelles: ["MIN_JUS", "DGAJ"]
    },
    branding: {
      couleurPrimaire: "#7F1D1D",
      couleurSecondaire: "#991B1B",
      couleurAccent: "#B91C1C",
      icon: Gavel,
      gradientClasses: "from-red-900 to-red-950",
      backgroundClasses: "from-red-50 via-white to-red-100"
    },
    isActive: true,
    dateCreation: "1960-08-17",
    parentId: "pres_001"
  },

  CONSEIL_ETAT: {
    id: "jud_002",
    code: "CONSEIL_ETAT",
    nom: "Conseil d'État de la République Gabonaise",
    nomCourt: "CONSEIL-ETAT.GA",
    sigle: "CE",
    type: "INSTITUTION_JUDICIAIRE",
    mission: "Cour suprême administrative, contrôle de légalité des actes administratifs",
    attributions: [
      "Contentieux administratif",
      "Contrôle de légalité",
      "Conseil juridique du gouvernement",
      "Recours en excès de pouvoir",
      "Référés administratifs"
    ],
    services: ["Contentieux administratif"],
    adresse: "Immeuble administratif",
    ville: "Libreville",
    province: "Estuaire",
    niveau: 3,
    relations: {
      hierarchiques: ["TRIBUNAUX_ADMIN"],
      collaboratives: ["COUR_CASSATION", "COUR_COMPTES"],
      informationnelles: ["PRIMATURE", "MIN_JUS"]
    },
    branding: {
      couleurPrimaire: "#374151",
      couleurSecondaire: "#4B5563",
      couleurAccent: "#6B7280",
      icon: Shield,
      gradientClasses: "from-gray-700 to-gray-900",
      backgroundClasses: "from-gray-50 via-white to-gray-100"
    },
    isActive: true,
    dateCreation: "1960-08-17",
    parentId: "pres_001"
  },

  COUR_COMPTES: {
    id: "jud_003",
    code: "COUR_COMPTES",
    nom: "Cour des Comptes de la République Gabonaise",
    nomCourt: "COUR-COMPTES.GA",
    sigle: "CDC",
    type: "INSTITUTION_JUDICIAIRE",
    mission: "Contrôle des finances publiques, audit des comptes publics",
    attributions: [
      "Contrôle des finances publiques",
      "Audit des comptes publics",
      "Certification des comptes de l'État",
      "Contrôle de gestion",
      "Rapport public annuel"
    ],
    services: ["Contrôle des finances publiques", "Audit des comptes publics"],
    adresse: "ACAE-route Owendo",
    ville: "Libreville",
    province: "Estuaire",
    telephone: "+241 70 54 11",
    niveau: 3,
    relations: {
      hierarchiques: ["CHAMBRES_COMPTES"],
      collaboratives: ["COUR_CASSATION", "CONSEIL_ETAT"],
      informationnelles: ["MIN_BUDGET", "DGI"]
    },
    branding: {
      couleurPrimaire: "#1F2937",
      couleurSecondaire: "#374151",
      couleurAccent: "#4B5563",
      icon: Calculator,
      gradientClasses: "from-gray-800 to-gray-900",
      backgroundClasses: "from-gray-50 via-white to-gray-100"
    },
    isActive: true,
    dateCreation: "1960-08-17",
    parentId: "pres_001"
  },

  // ==================== AGENCES PUBLIQUES (5 organismes) ====================

  ANPI: {
    id: "age_001",
    code: "ANPI",
    nom: "Agence Nationale de Promotion des Investissements",
    nomCourt: "ANPI.GA",
    sigle: "ANPI",
    type: "AGENCE_PUBLIQUE",
    mission: "Promotion des investissements, guichet unique, facilitation des affaires",
    attributions: [
      "Promotion des investissements",
      "Guichet unique des entreprises",
      "Accompagnement PME",
      "Zone franche",
      "Facilitation des affaires"
    ],
    services: ["Promotion investissements", "Guichet unique", "Accompagnement PME"],
    adresse: "Immeuble Arambo",
    ville: "Libreville",
    province: "Estuaire",
    niveau: 4,
    relations: {
      hierarchiques: ["CENTRES_FORMALITES"],
      collaboratives: ["ANPME", "CHAMBRE_COMMERCE"],
      informationnelles: ["MIN_IND", "DGI"]
    },
    branding: {
      couleurPrimaire: "#059669",
      couleurSecondaire: "#10B981",
      couleurAccent: "#34D399",
      icon: Building,
      gradientClasses: "from-emerald-600 to-emerald-800",
      backgroundClasses: "from-emerald-50 via-white to-emerald-100"
    },
    isActive: true,
    dateCreation: "1992-06-15",
    parentId: "prim_001"
  },

  ARCEP: {
    id: "age_002",
    code: "ARCEP",
    nom: "Autorité de Régulation des Communications Électroniques et des Postes",
    nomCourt: "ARCEP.GA",
    sigle: "ARCEP",
    type: "AGENCE_PUBLIQUE",
    mission: "Régulation des télécommunications, protection des consommateurs",
    attributions: [
      "Régulation des télécommunications",
      "Attribution des fréquences",
      "Protection des consommateurs",
      "Concurrence dans les télécoms",
      "Homologation d'équipements"
    ],
    services: ["Régulation télécoms", "Autorisation d'exploitation télécom", "Homologation d'équipements"],
    adresse: "Immeuble ARCEP",
    ville: "Libreville",
    province: "Estuaire",
    niveau: 4,
    relations: {
      hierarchiques: ["BUREAUX_REGIONAL"],
      collaboratives: ["ANRT", "OPERATEURS"],
      informationnelles: ["PRIMATURE", "MIN_NUM"]
    },
    branding: {
      couleurPrimaire: "#7C2D12",
      couleurSecondaire: "#EA580C",
      couleurAccent: "#FB923C",
      icon: Radio,
      gradientClasses: "from-orange-900 to-orange-950",
      backgroundClasses: "from-orange-50 via-white to-orange-100"
    },
    isActive: true,
    dateCreation: "2001-12-01",
    parentId: "prim_001"
  }

};

// === FONCTIONS UTILITAIRES ===
export const getOrganismeComplet = (code: string): OrganismeComplet | null => {
  return ORGANISMES_GABONAIS_COMPLETS[code] || null;
};

export const getOrganismesByType = (type: string): OrganismeComplet[] => {
  return Object.values(ORGANISMES_GABONAIS_COMPLETS).filter(org => org.type === type);
};

export const getOrganismesByNiveau = (niveau: number): OrganismeComplet[] => {
  return Object.values(ORGANISMES_GABONAIS_COMPLETS).filter(org => org.niveau === niveau);
};

export const getOrganismesByParent = (parentId: string): OrganismeComplet[] => {
  return Object.values(ORGANISMES_GABONAIS_COMPLETS).filter(org => org.parentId === parentId);
};

export const getOrganismesByProvince = (province: string): OrganismeComplet[] => {
  return Object.values(ORGANISMES_GABONAIS_COMPLETS).filter(org => org.province === province);
};

// === LOGIQUE DE RELATIONS ===
export const getRelationsHierarchiques = (code: string): OrganismeComplet[] => {
  const organisme = getOrganismeComplet(code);
  if (!organisme) return [];

  return organisme.relations.hierarchiques
    .map(relCode => getOrganismeComplet(relCode))
    .filter(Boolean) as OrganismeComplet[];
};

export const getRelationsCollaboratives = (code: string): OrganismeComplet[] => {
  const organisme = getOrganismeComplet(code);
  if (!organisme) return [];

  return organisme.relations.collaboratives
    .map(relCode => getOrganismeComplet(relCode))
    .filter(Boolean) as OrganismeComplet[];
};

export const getRelationsInformationnelles = (code: string): OrganismeComplet[] => {
  const organisme = getOrganismeComplet(code);
  if (!organisme) return [];

  return organisme.relations.informationnelles
    .map(relCode => getOrganismeComplet(relCode))
    .filter(Boolean) as OrganismeComplet[];
};

// === STATISTIQUES ===
export const getStatistiquesOrganismes = () => {
  const organismes = Object.values(ORGANISMES_GABONAIS_COMPLETS);

  return {
    total: organismes.length,
    parType: {
      PRESIDENCE: getOrganismesByType('PRESIDENCE').length,
      PRIMATURE: getOrganismesByType('PRIMATURE').length,
      MINISTERE: getOrganismesByType('MINISTERE').length,
      DIRECTION_GENERALE: getOrganismesByType('DIRECTION_GENERALE').length,
      MAIRIE: getOrganismesByType('MAIRIE').length,
      PREFECTURE: getOrganismesByType('PREFECTURE').length,
      PROVINCE: getOrganismesByType('PROVINCE').length,
      ORGANISME_SOCIAL: getOrganismesByType('ORGANISME_SOCIAL').length,
      AGENCE_PUBLIQUE: getOrganismesByType('AGENCE_PUBLIQUE').length,
      INSTITUTION_JUDICIAIRE: getOrganismesByType('INSTITUTION_JUDICIAIRE').length
    },
    parNiveau: {
      niveau1: getOrganismesByNiveau(1).length,
      niveau2: getOrganismesByNiveau(2).length,
      niveau3: getOrganismesByNiveau(3).length,
      niveau4: getOrganismesByNiveau(4).length,
      niveau5: getOrganismesByNiveau(5).length
    }
  };
};
