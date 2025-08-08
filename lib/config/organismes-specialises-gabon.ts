/**
 * Organismes Spécialisés de la République Gabonaise
 * Agences Nationales, Conseils, Établissements Publics
 */

export interface OrganismeSpecialise {
  id: string;
  code: string;
  nom: string;
  type: 'AGENCE_NATIONALE' | 'CONSEIL_NATIONAL' | 'ETABLISSEMENT_PUBLIC' | 'ORGANISME_SOCIAL' | 'AUTORITE_INDEPENDANTE';
  description: string;
  ministere_tutelle: string;
  directeur_general?: string;
  president?: string;
  siege: string;
  email?: string;
  telephone?: string;
  site_web?: string;
  date_creation: string;
  missions: string[];
  effectif_estime: number;
  budget_annuel_fcfa?: number;
  statut: 'ACTIF' | 'INACTIF' | 'EN_RESTRUCTURATION';
}

// AGENCES NATIONALES
export const AGENCES_NATIONALES: OrganismeSpecialise[] = [
  {
    id: "ANPN",
    code: "ANPN",
    nom: "Agence Nationale des Parcs Nationaux",
    type: "AGENCE_NATIONALE",
    description: "Gestion et conservation des parcs nationaux du Gabon",
    ministere_tutelle: "MEEC",
    directeur_general: "Dr Christian TCHEMAMBELA",
    siege: "Libreville",
    email: "contact@anpn.ga",
    telephone: "+241 01 44 27 10",
    site_web: "https://anpn.ga",
    date_creation: "2002-08-30",
    missions: [
      "Conservation de la biodiversité",
      "Gestion des parcs nationaux",
      "Développement de l'écotourisme",
      "Recherche scientifique en conservation",
      "Éducation environnementale"
    ],
    effectif_estime: 450,
    budget_annuel_fcfa: 15000000000,
    statut: "ACTIF"
  },
  {
    id: "ANINF",
    code: "ANINF",
    nom: "Agence Nationale des Infrastructures Numériques et des Fréquences",
    type: "AGENCE_NATIONALE",
    description: "Régulation des télécommunications et gestion du spectre",
    ministere_tutelle: "MENDI",
    directeur_general: "Ing. Noël MBOUMBA",
    siege: "Libreville",
    email: "contact@aninf.ga",
    telephone: "+241 01 44 36 20",
    site_web: "https://aninf.ga",
    date_creation: "2012-03-15",
    missions: [
      "Régulation des télécommunications",
      "Gestion du spectre radioélectrique",
      "Homologation des équipements",
      "Protection des consommateurs",
      "Développement du numérique"
    ],
    effectif_estime: 120,
    budget_annuel_fcfa: 8000000000,
    statut: "ACTIF"
  },
  {
    id: "ANGT",
    code: "ANGT",
    nom: "Agence Nationale des Grands Travaux",
    type: "AGENCE_NATIONALE",
    description: "Maîtrise d'ouvrage délégué pour les grands projets",
    ministere_tutelle: "MTPC",
    directeur_general: "Ing. Paul OBAME NGUEMA",
    siege: "Libreville",
    email: "contact@angt.ga",
    telephone: "+241 01 74 85 00",
    date_creation: "2010-01-20",
    missions: [
      "Maîtrise d'ouvrage des grands projets",
      "Coordination des travaux publics",
      "Contrôle de qualité des infrastructures",
      "Assistance technique aux maîtres d'ouvrage"
    ],
    effectif_estime: 200,
    budget_annuel_fcfa: 45000000000,
    statut: "ACTIF"
  },
  {
    id: "ANPE",
    code: "ANPE",
    nom: "Agence Nationale pour l'Emploi",
    type: "AGENCE_NATIONALE",
    description: "Promotion de l'emploi et placement des demandeurs",
    ministere_tutelle: "MTEDS",
    directeur_general: "Marie-José KOMBILA",
    siege: "Libreville",
    email: "contact@anpe.ga",
    telephone: "+241 01 76 58 90",
    date_creation: "2008-05-10",
    missions: [
      "Placement des demandeurs d'emploi",
      "Formation professionnelle",
      "Insertion des jeunes",
      "Observatoire de l'emploi",
      "Conseil en ressources humaines"
    ],
    effectif_estime: 180,
    budget_annuel_fcfa: 12000000000,
    statut: "ACTIF"
  },
  {
    id: "ANBG",
    code: "ANBG",
    nom: "Agence Nationale des Bourses du Gabon",
    type: "AGENCE_NATIONALE",
    description: "Gestion des bourses d'études nationales et internationales",
    ministere_tutelle: "MESRS",
    directeur_general: "Dr Sylvain NDZOMO",
    siege: "Libreville",
    email: "contact@anbg.ga",
    telephone: "+241 01 73 25 30",
    date_creation: "2005-09-15",
    missions: [
      "Attribution des bourses d'études",
      "Suivi des étudiants boursiers",
      "Coopération universitaire internationale",
      "Orientation académique et professionnelle"
    ],
    effectif_estime: 95,
    budget_annuel_fcfa: 25000000000,
    statut: "ACTIF"
  }
];

// CONSEILS NATIONAUX
export const CONSEILS_NATIONAUX: OrganismeSpecialise[] = [
  {
    id: "CNC",
    code: "CNC",
    nom: "Conseil National de la Communication",
    type: "CONSEIL_NATIONAL",
    description: "Régulation des médias et de la communication",
    ministere_tutelle: "MCM",
    president: "Me Alexandre BARRO CHAMBRIER",
    siege: "Libreville",
    email: "contact@cnc.ga",
    telephone: "+241 01 76 10 50",
    site_web: "https://cnc.ga",
    date_creation: "1991-12-20",
    missions: [
      "Régulation des médias",
      "Attribution des fréquences audiovisuelles",
      "Contrôle du pluralisme",
      "Protection des journalistes",
      "Médiation dans les conflits médiatiques"
    ],
    effectif_estime: 45,
    budget_annuel_fcfa: 3500000000,
    statut: "ACTIF"
  },
  {
    id: "CNLS",
    code: "CNLS",
    nom: "Conseil National de Lutte contre le SIDA",
    type: "CONSEIL_NATIONAL",
    description: "Coordination de la lutte contre le VIH/SIDA",
    ministere_tutelle: "MSAS",
    president: "Dr Marie NGUEMA",
    siege: "Libreville",
    email: "contact@cnls.ga",
    telephone: "+241 01 76 35 80",
    date_creation: "2001-06-01",
    missions: [
      "Coordination de la lutte contre le SIDA",
      "Prévention et sensibilisation",
      "Prise en charge des PVVIH",
      "Recherche sur le VIH/SIDA",
      "Mobilisation des ressources"
    ],
    effectif_estime: 30,
    budget_annuel_fcfa: 8000000000,
    statut: "ACTIF"
  },
  {
    id: "CNE",
    code: "CNE",
    nom: "Conseil National de l'Environnement",
    type: "CONSEIL_NATIONAL",
    description: "Conseil consultatif sur les questions environnementales",
    ministere_tutelle: "MEEC",
    president: "Prof. Nicaise OSSA",
    siege: "Libreville",
    email: "contact@cne.ga",
    telephone: "+241 01 76 65 20",
    date_creation: "1998-03-12",
    missions: [
      "Conseil en politique environnementale",
      "Évaluation environnementale",
      "Promotion du développement durable",
      "Sensibilisation écologique",
      "Médiation environnementale"
    ],
    effectif_estime: 25,
    budget_annuel_fcfa: 2000000000,
    statut: "ACTIF"
  }
];

// ÉTABLISSEMENTS PUBLICS
export const ETABLISSEMENTS_PUBLICS: OrganismeSpecialise[] = [
  {
    id: "CNSS",
    code: "CNSS",
    nom: "Caisse Nationale de Sécurité Sociale",
    type: "ORGANISME_SOCIAL",
    description: "Régime de sécurité sociale des travailleurs",
    ministere_tutelle: "MTEDS",
    directeur_general: "Jean-Fidèle OTANDAULT",
    siege: "Libreville",
    email: "contact@cnss.ga",
    telephone: "+241 01 76 12 34",
    site_web: "https://cnss.ga",
    date_creation: "1956-07-01",
    missions: [
      "Assurance vieillesse",
      "Prestations familiales",
      "Accidents du travail",
      "Invalidité et décès",
      "Action sociale"
    ],
    effectif_estime: 850,
    budget_annuel_fcfa: 180000000000,
    statut: "ACTIF"
  },
  {
    id: "CNAMGS",
    code: "CNAMGS",
    nom: "Caisse Nationale d'Assurance Maladie et de Garantie Sociale",
    type: "ORGANISME_SOCIAL",
    description: "Assurance maladie universelle",
    ministere_tutelle: "MSAS",
    directeur_general: "Dr Félicien MOUANDA",
    siege: "Libreville",
    email: "contact@cnamgs.ga",
    telephone: "+241 01 76 88 90",
    site_web: "https://cnamgs.ga",
    date_creation: "2007-08-01",
    missions: [
      "Couverture maladie universelle",
      "Remboursement des soins",
      "Contrôle médical",
      "Conventionnement des prestataires",
      "Éducation sanitaire"
    ],
    effectif_estime: 650,
    budget_annuel_fcfa: 120000000000,
    statut: "ACTIF"
  },
  {
    id: "UOB",
    code: "UOB",
    nom: "Université Omar Bongo",
    type: "ETABLISSEMENT_PUBLIC",
    description: "Principal établissement d'enseignement supérieur",
    ministere_tutelle: "MESRS",
    directeur_general: "Prof. Séraphin Brice PEMBA",
    siege: "Libreville",
    email: "contact@uob.ga",
    telephone: "+241 01 73 20 10",
    site_web: "https://uob.ga",
    date_creation: "1970-12-13",
    missions: [
      "Formation supérieure",
      "Recherche scientifique",
      "Service à la communauté",
      "Coopération internationale",
      "Innovation pédagogique"
    ],
    effectif_estime: 2500,
    budget_annuel_fcfa: 35000000000,
    statut: "ACTIF"
  },
  {
    id: "UBB",
    code: "UBB",
    nom: "Université des Sciences de la Santé",
    type: "ETABLISSEMENT_PUBLIC",
    description: "Formation en sciences médicales et de la santé",
    ministere_tutelle: "MESRS",
    directeur_general: "Prof. Dr. Antoine ITOUA",
    siege: "Franceville",
    email: "contact@uss.ga",
    telephone: "+241 06 67 30 20",
    date_creation: "2002-10-05",
    missions: [
      "Formation médicale",
      "Recherche biomédicale",
      "Formation continue des professionnels de santé",
      "Expertise en santé publique"
    ],
    effectif_estime: 400,
    budget_annuel_fcfa: 12000000000,
    statut: "ACTIF"
  },
  {
    id: "BGD",
    code: "BGD",
    nom: "Banque Gabonaise de Développement",
    type: "ETABLISSEMENT_PUBLIC",
    description: "Banque publique de développement",
    ministere_tutelle: "MEF",
    directeur_general: "Mays MOUISSI",
    siege: "Libreville",
    email: "contact@bgd.ga",
    telephone: "+241 01 76 48 00",
    site_web: "https://bgd.ga",
    date_creation: "1960-12-01",
    missions: [
      "Financement du développement",
      "Appui aux PME",
      "Crédit immobilier",
      "Financement agricole",
      "Conseil financier"
    ],
    effectif_estime: 320,
    budget_annuel_fcfa: 85000000000,
    statut: "ACTIF"
  }
];

// AUTORITÉS INDÉPENDANTES
export const AUTORITES_INDEPENDANTES: OrganismeSpecialise[] = [
  {
    id: "CGR",
    code: "CGR",
    nom: "Cour des Comptes et de Discipline Budgétaire",
    type: "AUTORITE_INDEPENDANTE",
    description: "Contrôle supérieur des finances publiques",
    ministere_tutelle: "AUTONOME",
    president: "Jean-Baptiste BIYOGHE BI NTOUGOU",
    siege: "Libreville",
    email: "contact@courdescomptes.ga",
    telephone: "+241 01 76 22 50",
    date_creation: "1963-05-15",
    missions: [
      "Contrôle des comptes publics",
      "Audit des organismes publics",
      "Discipline budgétaire",
      "Assistance au Parlement",
      "Certification des comptes"
    ],
    effectif_estime: 85,
    budget_annuel_fcfa: 6500000000,
    statut: "ACTIF"
  },
  {
    id: "HAC",
    code: "HAC",
    nom: "Haute Autorité de la Communication",
    type: "AUTORITE_INDEPENDANTE",
    description: "Régulation indépendante de la communication",
    ministere_tutelle: "AUTONOME",
    president: "Marie-Madeleine MBORANTSUO",
    siege: "Libreville",
    email: "contact@hac.ga",
    telephone: "+241 01 77 15 60",
    date_creation: "2019-01-10",
    missions: [
      "Régulation des médias",
      "Protection de la liberté d'expression",
      "Déontologie journalistique",
      "Médiation",
      "Sanctions disciplinaires"
    ],
    effectif_estime: 40,
    budget_annuel_fcfa: 4000000000,
    statut: "ACTIF"
  }
];

// TOUS LES ORGANISMES SPÉCIALISÉS
export const TOUS_ORGANISMES_SPECIALISES = [
  ...AGENCES_NATIONALES,
  ...CONSEILS_NATIONAUX,
  ...ETABLISSEMENTS_PUBLICS,
  ...AUTORITES_INDEPENDANTES
];

// Fonctions utilitaires
export function getOrganismesByType(type: OrganismeSpecialise['type']): OrganismeSpecialise[] {
  return TOUS_ORGANISMES_SPECIALISES.filter(org => org.type === type);
}

export function getOrganismesByMinistere(ministere: string): OrganismeSpecialise[] {
  return TOUS_ORGANISMES_SPECIALISES.filter(org => org.ministere_tutelle === ministere);
}

export function getOrganismeByCode(code: string): OrganismeSpecialise | undefined {
  return TOUS_ORGANISMES_SPECIALISES.find(org => org.code === code);
}

// Statistiques des organismes spécialisés
export const STATS_ORGANISMES_SPECIALISES = {
  total: TOUS_ORGANISMES_SPECIALISES.length,
  par_type: {
    agences_nationales: AGENCES_NATIONALES.length,
    conseils_nationaux: CONSEILS_NATIONAUX.length,
    etablissements_publics: ETABLISSEMENTS_PUBLICS.length,
    autorites_independantes: AUTORITES_INDEPENDANTES.length
  },
  effectif_total: TOUS_ORGANISMES_SPECIALISES.reduce((acc, org) => acc + org.effectif_estime, 0),
  budget_total_fcfa: TOUS_ORGANISMES_SPECIALISES
    .filter(org => org.budget_annuel_fcfa)
    .reduce((acc, org) => acc + (org.budget_annuel_fcfa || 0), 0),
  organismes_actifs: TOUS_ORGANISMES_SPECIALISES.filter(org => org.statut === 'ACTIF').length
};
