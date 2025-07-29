/* @ts-nocheck */
/**
 * Base de données complète des postes et fonctions administratives gabonaises
 * Utilisée pour la création de comptes collaborateurs et la gestion des administrations
 */

export interface PosteAdministratif {
  id: string;
  titre: string;
  code: string;
  niveau: string;
  grade_requis: string[];
  presence: string;
  description?: string;
  specialites?: string[];
  nomination?: string;
  salaire_base?: number;
  departements_cibles?: string[];
}

export interface CategoriePoste {
  id: string;
  nom: string;
  description: string;
  grade_requis: string[];
  postes: PosteAdministratif[];
}

export interface DirectionCentrale {
  sigle: string;
  nom: string;
  fonction: string;
  postes_standards: string[];
}

// Métadonnées de l'administration gabonaise
export const METADATA_ADMINISTRATION = {
  date_mise_a_jour: "2025-07-28",
  nombre_ministeres: 30,
  categories_fonction_publique: ["A1", "A2", "B1", "B2", "C"],
  structure_territoriale: {
    provinces: 9,
    departements: 48,
    communes: 52,
    villages: 2743
  }
};

// Grades de la fonction publique gabonaise
export const GRADES_FONCTION_PUBLIQUE = [
  { code: "A1", nom: "Catégorie A1 - Cadres supérieurs", salaire_base: 850000 },
  { code: "A2", nom: "Catégorie A2 - Cadres moyens", salaire_base: 650000 },
  { code: "B1", nom: "Catégorie B1 - Agents de maîtrise", salaire_base: 450000 },
  { code: "B2", nom: "Catégorie B2 - Agents qualifiés", salaire_base: 350000 },
  { code: "C", nom: "Catégorie C - Agents d'exécution", salaire_base: 250000 }
];

// Catégorie 1: Direction et Encadrement Supérieur
export const POSTES_DIRECTION: CategoriePoste = {
  id: "direction",
  nom: "Direction et Encadrement Supérieur",
  description: "Postes de haute responsabilité et d'encadrement supérieur",
  grade_requis: ["A1", "A2"],
  postes: [
    {
      id: "dg",
      titre: "Directeur Général",
      code: "DG",
      niveau: "Direction supérieure",
      grade_requis: ["A1"],
      presence: "Tous ministères et grandes administrations",
      nomination: "Décret en Conseil des ministres",
      salaire_base: 1200000,
      description: "Responsable de la direction générale de l'administration"
    },
    {
      id: "dga",
      titre: "Directeur Général Adjoint",
      code: "DGA",
      niveau: "Direction supérieure",
      grade_requis: ["A1"],
      presence: "Ministères et grandes directions",
      salaire_base: 1000000
    },
    {
      id: "sg",
      titre: "Secrétaire Général",
      code: "SG",
      niveau: "Direction administrative",
      grade_requis: ["A1"],
      presence: "Tous ministères et institutions",
      salaire_base: 950000
    },
    {
      id: "dc",
      titre: "Directeur Central",
      code: "DC",
      niveau: "Direction centrale",
      grade_requis: ["A1"],
      presence: "Services transversaux ministériels",
      salaire_base: 900000
    },
    {
      id: "dir",
      titre: "Directeur",
      code: "DIR",
      niveau: "Direction",
      grade_requis: ["A1", "A2"],
      presence: "Toutes administrations",
      salaire_base: 800000
    },
    {
      id: "da",
      titre: "Directeur Adjoint",
      code: "DA",
      niveau: "Direction",
      grade_requis: ["A1", "A2"],
      presence: "Services importants",
      salaire_base: 750000
    },
    {
      id: "cs",
      titre: "Chef de Service",
      code: "CS",
      niveau: "Encadrement intermédiaire",
      grade_requis: ["A2"],
      presence: "Toutes administrations",
      salaire_base: 700000
    },
    {
      id: "cb",
      titre: "Chef de Bureau",
      code: "CB",
      niveau: "Encadrement",
      grade_requis: ["A2"],
      presence: "Toutes administrations",
      salaire_base: 650000
    },
    {
      id: "ct",
      titre: "Conseiller Technique",
      code: "CT",
      niveau: "Expertise",
      grade_requis: ["A1"],
      presence: "Cabinets ministériels",
      salaire_base: 850000
    },
    {
      id: "igs",
      titre: "Inspecteur Général des Services",
      code: "IGS",
      niveau: "Contrôle supérieur",
      grade_requis: ["A1"],
      presence: "Grands ministères",
      salaire_base: 1100000
    },
    {
      id: "dircab",
      titre: "Directeur de Cabinet",
      code: "DIRCAB",
      niveau: "Direction politique",
      grade_requis: ["A1"],
      presence: "Tous ministères",
      salaire_base: 1150000
    },
    {
      id: "chcab",
      titre: "Chef de Cabinet",
      code: "CHCAB",
      niveau: "Direction administrative cabinet",
      grade_requis: ["A1"],
      presence: "Ministères et institutions",
      salaire_base: 900000
    }
  ]
};

// Catégorie 2: Postes Techniques et d'Expertise
export const POSTES_TECHNIQUES: CategoriePoste = {
  id: "technique",
  nom: "Postes Techniques et d'Expertise",
  description: "Postes requérant des compétences techniques spécialisées",
  grade_requis: ["A1", "A2", "B1"],
  postes: [
    {
      id: "jur",
      titre: "Juriste",
      code: "JUR",
      niveau: "Expert",
      grade_requis: ["A1", "A2"],
      specialites: ["Droit public", "Droit social", "Droit des affaires", "Droit de l'environnement"],
      presence: "Toutes administrations",
      salaire_base: 750000
    },
    {
      id: "info",
      titre: "Informaticien",
      code: "INFO",
      niveau: "Expert technique",
      grade_requis: ["A2", "B1"],
      specialites: ["Développeur", "Administrateur réseau", "Gestionnaire SI"],
      presence: "Toutes administrations modernes",
      salaire_base: 650000
    },
    {
      id: "eco",
      titre: "Économiste",
      code: "ECO",
      niveau: "Expert",
      grade_requis: ["A1", "A2"],
      presence: "Ministères économiques et sociaux",
      salaire_base: 720000
    },
    {
      id: "stat",
      titre: "Statisticien",
      code: "STAT",
      niveau: "Analyste",
      grade_requis: ["A2", "B1"],
      presence: "Services d'études et planification",
      salaire_base: 680000
    },
    {
      id: "ing",
      titre: "Ingénieur",
      code: "ING",
      niveau: "Expert technique",
      grade_requis: ["A1", "A2"],
      specialites: ["Génie civil", "Informatique", "Télécommunications"],
      presence: "Ministères techniques",
      salaire_base: 780000
    },
    {
      id: "ce",
      titre: "Chargé d'Études",
      code: "CE",
      niveau: "Expertise",
      grade_requis: ["A2", "B1"],
      presence: "Toutes directions",
      salaire_base: 620000
    },
    {
      id: "ap",
      titre: "Analyste-Programmeur",
      code: "AP",
      niveau: "Technique supérieur",
      grade_requis: ["B1"],
      presence: "Services informatiques",
      salaire_base: 580000
    },
    {
      id: "cj",
      titre: "Conseiller Juridique",
      code: "CJ",
      niveau: "Expert juridique",
      grade_requis: ["A1"],
      presence: "Directions générales",
      salaire_base: 820000
    },
    {
      id: "ai",
      titre: "Auditeur Interne",
      code: "AI",
      niveau: "Contrôle",
      grade_requis: ["A1", "A2"],
      presence: "Grandes administrations",
      salaire_base: 750000
    },
    {
      id: "cg",
      titre: "Contrôleur de Gestion",
      code: "CG",
      niveau: "Analyse financière",
      grade_requis: ["A2", "B1"],
      presence: "Services financiers",
      salaire_base: 650000
    },
    {
      id: "efp",
      titre: "Expert en Finances Publiques",
      code: "EFP",
      niveau: "Expertise haute",
      grade_requis: ["A1"],
      presence: "Ministères économiques",
      salaire_base: 850000
    },
    {
      id: "std",
      titre: "Spécialiste en Transformation Digitale",
      code: "STD",
      niveau: "Innovation",
      grade_requis: ["A1", "A2"],
      presence: "Administrations en modernisation",
      salaire_base: 800000
    }
  ]
};

// Catégorie 3: Postes Administratifs et de Support
export const POSTES_ADMINISTRATIFS: CategoriePoste = {
  id: "administratif",
  nom: "Postes Administratifs et de Support",
  description: "Postes de gestion administrative et de support",
  grade_requis: ["B1", "B2", "C"],
  postes: [
    {
      id: "sd",
      titre: "Secrétaire de Direction",
      code: "SD",
      niveau: "Assistant qualifié",
      grade_requis: ["B1", "B2"],
      presence: "Toutes directions",
      salaire_base: 450000
    },
    {
      id: "aa",
      titre: "Assistant Administratif",
      code: "AA",
      niveau: "Support administratif",
      grade_requis: ["B2", "C"],
      presence: "Tous services",
      salaire_base: 380000
    },
    {
      id: "attach",
      titre: "Attaché d'Administration",
      code: "ATTACH",
      niveau: "Cadre administratif",
      grade_requis: ["B1"],
      presence: "Services centraux",
      salaire_base: 520000
    },
    {
      id: "red",
      titre: "Rédacteur",
      code: "RED",
      niveau: "Production documentaire",
      grade_requis: ["B1", "B2"],
      presence: "Tous services",
      salaire_base: 420000
    },
    {
      id: "compt",
      titre: "Comptable",
      code: "COMPT",
      niveau: "Gestion financière",
      grade_requis: ["B1"],
      presence: "Toutes administrations",
      salaire_base: 480000
    },
    {
      id: "grh",
      titre: "Gestionnaire des Ressources Humaines",
      code: "GRH",
      niveau: "Administration du personnel",
      grade_requis: ["B1"],
      presence: "Services RH",
      salaire_base: 500000
    },
    {
      id: "agadm",
      titre: "Agent Administratif",
      code: "AGADM",
      niveau: "Exécution administrative",
      grade_requis: ["B2", "C"],
      presence: "Tous services",
      salaire_base: 320000
    },
    {
      id: "gp",
      titre: "Gestionnaire du Patrimoine",
      code: "GP",
      niveau: "Gestion matérielle",
      grade_requis: ["B1", "B2"],
      presence: "Services généraux",
      salaire_base: 420000
    },
    {
      id: "doc",
      titre: "Documentaliste",
      code: "DOC",
      niveau: "Gestion information",
      grade_requis: ["B1", "B2"],
      presence: "Centres de documentation",
      salaire_base: 400000
    },
    {
      id: "arch",
      titre: "Archiviste",
      code: "ARCH",
      niveau: "Conservation documents",
      grade_requis: ["B1", "B2"],
      presence: "Services d'archives",
      salaire_base: 400000
    },
    {
      id: "gb",
      titre: "Gestionnaire du Budget",
      code: "GB",
      niveau: "Suivi budgétaire",
      grade_requis: ["B1"],
      presence: "Services financiers",
      salaire_base: 480000
    },
    {
      id: "ac",
      titre: "Agent Comptable",
      code: "AC",
      niveau: "Comptabilité",
      grade_requis: ["B2"],
      presence: "Services comptables",
      salaire_base: 380000
    }
  ]
};

// Catégorie 4: Postes Opérationnels et de Terrain
export const POSTES_OPERATIONNELS: CategoriePoste = {
  id: "operationnel",
  nom: "Postes Opérationnels et de Terrain",
  description: "Postes d'exécution et de terrain",
  grade_requis: ["B2", "C"],
  postes: [
    {
      id: "at",
      titre: "Agent de Terrain",
      code: "AT",
      niveau: "Opérationnel",
      grade_requis: ["B2", "C"],
      presence: "Services déconcentrés",
      salaire_base: 300000
    },
    {
      id: "ae",
      titre: "Agent d'Exécution",
      code: "AE",
      niveau: "Exécution",
      grade_requis: ["C"],
      presence: "Tous services",
      salaire_base: 280000
    },
    {
      id: "atech",
      titre: "Agent Technique",
      code: "ATECH",
      niveau: "Technique terrain",
      grade_requis: ["B2"],
      presence: "Services techniques",
      salaire_base: 350000
    },
    {
      id: "chauf",
      titre: "Chauffeur",
      code: "CHAUF",
      niveau: "Service",
      grade_requis: ["C"],
      presence: "Toutes administrations",
      salaire_base: 280000
    },
    {
      id: "as",
      titre: "Agent de Sécurité",
      code: "AS",
      niveau: "Protection",
      grade_requis: ["C"],
      presence: "Toutes administrations",
      salaire_base: 300000
    },
    {
      id: "acour",
      titre: "Agent de Courrier",
      code: "ACOUR",
      niveau: "Distribution",
      grade_requis: ["C"],
      presence: "Services courrier",
      salaire_base: 270000
    },
    {
      id: "aacc",
      titre: "Agent d'Accueil",
      code: "AACC",
      niveau: "Réception",
      grade_requis: ["C"],
      presence: "Toutes administrations",
      salaire_base: 290000
    },
    {
      id: "huis",
      titre: "Huissier",
      code: "HUIS",
      niveau: "Protocole",
      grade_requis: ["B2"],
      presence: "Directions et cabinets",
      salaire_base: 320000
    },
    {
      id: "gard",
      titre: "Gardien",
      code: "GARD",
      niveau: "Surveillance",
      grade_requis: ["C"],
      presence: "Tous sites",
      salaire_base: 260000
    },
    {
      id: "aent",
      titre: "Agent d'Entretien",
      code: "AENT",
      niveau: "Maintenance",
      grade_requis: ["C"],
      presence: "Toutes administrations",
      salaire_base: 250000
    },
    {
      id: "ts",
      titre: "Technicien de Surface",
      code: "TS",
      niveau: "Hygiène",
      grade_requis: ["C"],
      presence: "Tous bâtiments",
      salaire_base: 250000
    },
    {
      id: "plant",
      titre: "Planton",
      code: "PLANT",
      niveau: "Service général",
      grade_requis: ["C"],
      presence: "Bureaux de direction",
      salaire_base: 250000
    }
  ]
};

// Postes spécialisés par secteur
export const POSTES_SANTE = [
  {
    id: "med",
    titre: "Médecin Spécialiste",
    code: "MED",
    grade_requis: ["A1"],
    presence: "Hôpitaux et centres de santé",
    salaire_base: 950000
  },
  {
    id: "ide",
    titre: "Infirmier Diplômé d'État",
    code: "IDE",
    grade_requis: ["B1"],
    presence: "Structures sanitaires",
    salaire_base: 480000
  },
  {
    id: "tsp",
    titre: "Technicien de Santé Publique",
    code: "TSP",
    grade_requis: ["B2"],
    presence: "Services de santé",
    salaire_base: 380000
  },
  {
    id: "cps",
    titre: "Coordonnateur de Programme Santé",
    code: "CPS",
    grade_requis: ["A1"],
    presence: "Programmes nationaux",
    salaire_base: 850000
  }
];

export const POSTES_EDUCATION = [
  {
    id: "ien",
    titre: "Inspecteur de l'Éducation Nationale",
    code: "IEN",
    grade_requis: ["A1"],
    presence: "Inspection académique",
    salaire_base: 800000
  },
  {
    id: "cp",
    titre: "Conseiller Pédagogique",
    code: "CP",
    grade_requis: ["A2"],
    presence: "Services pédagogiques",
    salaire_base: 650000
  },
  {
    id: "prov",
    titre: "Proviseur",
    code: "PROV",
    grade_requis: ["A2"],
    presence: "Lycées",
    salaire_base: 700000
  },
  {
    id: "de",
    titre: "Directeur d'École",
    code: "DE",
    grade_requis: ["B1"],
    presence: "Établissements primaires",
    salaire_base: 520000
  }
];

// Directions centrales standards
export const DIRECTIONS_CENTRALES: DirectionCentrale[] = [
  {
    sigle: "DCAF",
    nom: "Direction Centrale des Affaires Financières",
    fonction: "Gestion financière et budgétaire",
    postes_standards: ["DC", "DA", "CS", "CB", "COMPT", "GB", "AC"]
  },
  {
    sigle: "DCRH",
    nom: "Direction Centrale des Ressources Humaines",
    fonction: "Gestion du personnel",
    postes_standards: ["DC", "DA", "CS", "GRH", "AA", "RED"]
  },
  {
    sigle: "DCSE",
    nom: "Direction Centrale des Services Économiques",
    fonction: "Analyses économiques",
    postes_standards: ["DC", "ECO", "STAT", "CE", "AA"]
  },
  {
    sigle: "DCAD",
    nom: "Direction Centrale des Affaires Administratives",
    fonction: "Coordination administrative",
    postes_standards: ["DC", "DA", "CS", "ATTACH", "RED", "AA"]
  },
  {
    sigle: "DCAJ",
    nom: "Direction Centrale des Affaires Juridiques",
    fonction: "Conseil juridique",
    postes_standards: ["DC", "JUR", "CJ", "RED", "AA"]
  },
  {
    sigle: "DCC",
    nom: "Direction Centrale de la Communication",
    fonction: "Communication institutionnelle",
    postes_standards: ["DC", "CS", "RED", "DOC", "AA"]
  },
  {
    sigle: "DCSI",
    nom: "Direction Centrale des Systèmes d'Information",
    fonction: "Gestion informatique",
    postes_standards: ["DC", "INFO", "AP", "STD", "ATECH"]
  }
];

// Nouvelles fonctions émergentes pour la transformation digitale
export const POSTES_TRANSFORMATION_DIGITALE = [
  {
    id: "cyber",
    titre: "Spécialiste en Cybersécurité",
    code: "CYBER",
    grade_requis: ["A1", "A2"],
    salaire_base: 900000
  },
  {
    id: "gpn",
    titre: "Gestionnaire de Projets Numériques",
    code: "GPN",
    grade_requis: ["A2"],
    salaire_base: 750000
  },
  {
    id: "adc",
    titre: "Administrateur de Data Center",
    code: "ADC",
    grade_requis: ["B1"],
    salaire_base: 550000
  },
  {
    id: "rssi",
    titre: "Responsable Sécurité SI",
    code: "RSSI",
    grade_requis: ["A1"],
    salaire_base: 950000
  }
];

// Hiérarchie territoriale
export const HIERARCHIE_TERRITORIALE = [
  {
    titre: "Gouverneur de Province",
    niveau: "Provincial",
    nombre: 9,
    grade_requis: ["A1"],
    salaire_base: 1500000
  },
  {
    titre: "Préfet de Département",
    niveau: "Départemental",
    nombre: 48,
    grade_requis: ["A1"],
    salaire_base: 1200000
  },
  {
    titre: "Sous-Préfet de District",
    niveau: "District",
    nombre: 26,
    grade_requis: ["A2"],
    salaire_base: 800000
  },
  {
    titre: "Maire de Commune",
    niveau: "Communal",
    nombre: 52,
    grade_requis: ["A2"],
    salaire_base: 700000
  },
  {
    titre: "Chef de Village",
    niveau: "Village",
    nombre: 2743,
    grade_requis: ["B1", "B2"],
    salaire_base: 300000
  }
];

// Toutes les catégories de postes
export const CATEGORIES_POSTES = [
  POSTES_DIRECTION,
  POSTES_TECHNIQUES,
  POSTES_ADMINISTRATIFS,
  POSTES_OPERATIONNELS
];

// Fonction utilitaire pour obtenir tous les postes
export const getAllPostes = (): PosteAdministratif[] => {
  const allPostes: PosteAdministratif[] = [];

  CATEGORIES_POSTES.forEach(categorie => {
    allPostes.push(...categorie.postes);
  });

  return allPostes;
};

// Fonction pour obtenir les postes par grade
export const getPostesByGrade = (grade: string): PosteAdministratif[] => {
  return getAllPostes().filter(poste =>
    poste.grade_requis.includes(grade)
  );
};

// Fonction pour obtenir les postes adaptés à un type d'administration
export const getPostesForAdministration = (typeAdmin: string): PosteAdministratif[] => {
  const allPostes = getAllPostes();

  // Logique pour filtrer selon le type d'administration
  switch (typeAdmin.toLowerCase()) {
    case 'ministere':
      return allPostes; // Tous les postes pour un ministère
    case 'mairie':
      return allPostes.filter(p =>
        ['CB', 'CS', 'AA', 'GRH', 'COMPT', 'AS', 'AACC'].includes(p.code)
      );
    case 'prefecture':
      return allPostes.filter(p =>
        ['DIR', 'DA', 'CS', 'CB', 'AA', 'RED', 'AS'].includes(p.code)
      );
    default:
      return allPostes;
  }
};
