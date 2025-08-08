/**
 * Données de démonstration pour la structure administrative gabonaise
 * Basé sur la hiérarchie officielle avec 160+ organismes
 */

import {
  OrganismeAdministratif,
  NiveauHierarchique,
  TypeOrganisme,
  StatutOrganisme,
  StatistiquesStructure,
  ResponsableOrganisme,
  CoordonneesOrganisme,
  EffectifsOrganisme,
  BudgetOrganisme
} from '@/lib/types/structure-administrative';
import { OrganismeGabonais, getOrganismesComplets, STATISTIQUES_ORGANISMES } from '@/lib/data/gabon-organismes-141';
import { OrganizationType } from '@/types/auth';

// ===============================================
// FONCTION DE CONVERSION DES DONNÉES RÉELLES
// ===============================================

/**
 * Convertit un OrganizationType vers TypeOrganisme
 */
function convertirTypeOrganisme(type: OrganizationType): TypeOrganisme {
  const mapping: Record<string, TypeOrganisme> = {
    'PRESIDENCE': TypeOrganisme.PRESIDENCE,
    'VICE_PRESIDENCE_GOUVERNEMENT': TypeOrganisme.PRIMATURE,
    'MINISTERE': TypeOrganisme.MINISTERE,
    'DIRECTION_GENERALE': TypeOrganisme.DIRECTION_GENERALE,
    'DIRECTION': TypeOrganisme.DIRECTION_GENERALE,
    'SECRETARIAT_GENERAL': TypeOrganisme.DIRECTION_GENERALE,
    'GOUVERNORAT': TypeOrganisme.GOUVERNORAT,
    'PREFECTURE': TypeOrganisme.PREFECTURE,
    'MAIRIE': TypeOrganisme.MAIRIE,
    'AGENCE': TypeOrganisme.ETABLISSEMENT_PUBLIC,
    'INSTITUTION_JUDICIAIRE': TypeOrganisme.ETABLISSEMENT_PUBLIC,
    'ASSEMBLEE_NATIONALE': TypeOrganisme.ASSEMBLEE_NATIONALE,
    'SENAT': TypeOrganisme.SENAT,
    'INSTITUTION_INDEPENDANTE': TypeOrganisme.ETABLISSEMENT_PUBLIC,
    'ETABLISSEMENT_PUBLIC': TypeOrganisme.ETABLISSEMENT_PUBLIC,
    'ENTREPRISE_PUBLIQUE': TypeOrganisme.ENTREPRISE_PUBLIQUE,
    'COLLECTIVITE_LOCALE': TypeOrganisme.MAIRIE,
    'AUTORITE_ADMINISTRATIVE': TypeOrganisme.DIRECTION_GENERALE,
    'AUTRE': TypeOrganisme.ETABLISSEMENT_PUBLIC
  };

  return mapping[type] || TypeOrganisme.ETABLISSEMENT_PUBLIC;
}

/**
 * Convertit le niveau hiérarchique vers NiveauHierarchique
 */
function convertirNiveauHierarchique(niveau: number): NiveauHierarchique {
  switch (niveau) {
    case 1: return NiveauHierarchique.NIVEAU_1_CONSTITUTIONNEL;
    case 2: return NiveauHierarchique.NIVEAU_2_GOUVERNEMENTAL;
    case 3: return NiveauHierarchique.NIVEAU_3_MINISTERIEL;
    case 4: return NiveauHierarchique.NIVEAU_4_DIRECTIONNEL;
    case 5:
    default: return NiveauHierarchique.NIVEAU_5_TERRITORIAL_SPECIALISE;
  }
}

/**
 * Génère des effectifs réalistes basés sur le type d'organisme
 */
function genererEffectifs(type: TypeOrganisme, niveau: NiveauHierarchique): EffectifsOrganisme {
  const bases = {
    [TypeOrganisme.PRESIDENCE]: { total: 2500, cadres: 1500, agentsExecution: 1000 },
    [TypeOrganisme.PRIMATURE]: { total: 1200, cadres: 800, agentsExecution: 400 },
    [TypeOrganisme.MINISTERE]: { total: 800, cadres: 500, agentsExecution: 300 },
    [TypeOrganisme.DIRECTION_GENERALE]: { total: 350, cadres: 200, agentsExecution: 150 },
    [TypeOrganisme.GOUVERNORAT]: { total: 450, cadres: 250, agentsExecution: 200 },
    [TypeOrganisme.MAIRIE]: { total: 180, cadres: 80, agentsExecution: 100 },
    [TypeOrganisme.ETABLISSEMENT_PUBLIC]: { total: 220, cadres: 120, agentsExecution: 100 },
  };

  const base = bases[type] || bases[TypeOrganisme.ETABLISSEMENT_PUBLIC];

  // Ajuster selon le niveau hiérarchique
  const facteur = niveau <= 2 ? 1.0 : niveau === 3 ? 0.7 : niveau === 4 ? 0.5 : 0.3;

  const total = Math.round(base.total * facteur);
  const cadres = Math.round(base.cadres * facteur);
  const agentsExecution = Math.round(base.agentsExecution * facteur);

  return {
    total,
    cadres,
    agentsExecution,
    contractuels: Math.round(total * 0.1),
    fonctionnaires: Math.round(total * 0.85),
    vacances: Math.round(total * 0.05),
    lastUpdate: new Date().toISOString().split('T')[0]
  };
}

/**
 * Génère un budget réaliste
 */
function genererBudget(type: TypeOrganisme, niveau: NiveauHierarchique): BudgetOrganisme {
  const budgetsBases = {
    [TypeOrganisme.PRESIDENCE]: 150_000_000_000,
    [TypeOrganisme.PRIMATURE]: 80_000_000_000,
    [TypeOrganisme.MINISTERE]: 45_000_000_000,
    [TypeOrganisme.DIRECTION_GENERALE]: 12_000_000_000,
    [TypeOrganisme.GOUVERNORAT]: 8_000_000_000,
    [TypeOrganisme.MAIRIE]: 3_500_000_000,
    [TypeOrganisme.ETABLISSEMENT_PUBLIC]: 5_500_000_000,
  };

  const base = budgetsBases[type] || budgetsBases[TypeOrganisme.ETABLISSEMENT_PUBLIC];
  const facteur = niveau <= 2 ? 1.0 : niveau === 3 ? 0.6 : niveau === 4 ? 0.4 : 0.25;
  const annuel = Math.round(base * facteur);

  return {
    annuel,
    devise: 'XAF' as const,
    exercice: 2024,
    fonctionnement: Math.round(annuel * 0.6),
    investissement: Math.round(annuel * 0.4),
    masse_salariale: Math.round(annuel * 0.35),
    lastUpdate: new Date().toISOString().split('T')[0]
  };
}

/**
 * Convertit un OrganismeGabonais vers OrganismeAdministratif
 */
function convertirOrganismeGabonais(organisme: OrganismeGabonais): OrganismeAdministratif {
  const niveau = convertirNiveauHierarchique(organisme.niveau_hierarchique);
  const type = convertirTypeOrganisme(organisme.type);
  const effectifs = genererEffectifs(type, niveau);
  const budget = genererBudget(type, niveau);

  return {
    id: organisme.id,
    code: organisme.code,
    nom: organisme.name,
    nomCourt: organisme.name.length > 40 ? organisme.name.substring(0, 37) + '...' : organisme.name,
    sigle: organisme.code,
    niveau: niveau,
    type: type,
    statut: StatutOrganisme.ACTIF,
    parentId: organisme.parentId,
    enfantsIds: [], // Sera calculé dynamiquement
    chemin_hierarchique: `${organisme.name}`,
    coordonnees: {
      adresse: organisme.address || `Adresse ${organisme.name}`,
      ville: organisme.city,
      province: organisme.province || (organisme.city === 'Libreville' ? 'Estuaire' : 'Province'),
      telephone: organisme.phone,
      email: organisme.email,
      siteWeb: organisme.website
    },
    attributions: organisme.secteurs || [organisme.description || 'Administration générale'],
    mission: organisme.description || `Mission de ${organisme.name}`,
    competences: organisme.secteurs || ['Administration générale'],
    effectifs: effectifs,
    budget: budget,
    dateCreation: '2024-01-01T00:00:00Z',
    dateModification: new Date().toISOString(),
    isActive: true,
    organismes_rattaches: [],
    conventions_partenariats: [],
    province: organisme.province || (organisme.city === 'Libreville' ? 'Estuaire' : 'Province'),
    est_structure_centrale: niveau <= NiveauHierarchique.NIVEAU_3_MINISTERIEL,
    participe_conseil_ministres: niveau === NiveauHierarchique.NIVEAU_3_MINISTERIEL,
    // Pas de responsable défini pour les vraies données (sera ajouté manuellement)
    responsable: undefined
  };
}

/**
 * NOUVELLE FONCTION : Génère tous les organismes administratifs à partir des vraies données
 */
function genererOrganismesAdministratifsReels(): OrganismeAdministratif[] {
  console.log('🏛️ Chargement des 141 organismes officiels gabonais...');

  // Récupérer les 141 organismes officiels
  const organismesGabonais = getOrganismesComplets();
  console.log(`📊 Nombre d'organismes récupérés: ${organismesGabonais.length}`);

  // Convertir vers le format OrganismeAdministratif
  const organismesAdministratifs = organismesGabonais.map(convertirOrganismeGabonais);

  // Calculer les enfantsIds pour chaque organisme
  organismesAdministratifs.forEach(organisme => {
    organisme.enfantsIds = organismesAdministratifs
      .filter(enfant => enfant.parentId === organisme.id)
      .map(enfant => enfant.id);
  });

  console.log(`✅ ${organismesAdministratifs.length} organismes administratifs générés avec succès`);

  return organismesAdministratifs;
}

// Responsables fictifs pour la démonstration
const RESPONSABLES_DEMO: ResponsableOrganisme[] = [
  {
    nom: 'Oligui Nguema',
    prenom: 'Brice Clotaire',
    titre: 'Président de la République',
    email: 'president@presidence.ga',
    telephone: '+241 01 79 50 00',
    dateNomination: '2023-08-30',
    biographie: 'Président de la Transition, Chef de l\'État'
  },
  {
    nom: 'Barro Chambrier',
    prenom: 'Raymond Ndong',
    titre: 'Premier Ministre',
    email: 'premier@primature.ga',
    telephone: '+241 01 76 30 30',
    dateNomination: '2023-09-07',
    biographie: 'Chef du Gouvernement'
  },
  {
    nom: 'Roboty Mbou',
    prenom: 'Nicole Janine Lydie',
    titre: 'Ministre de l\'Économie et des Finances',
    email: 'ministre@economie.ga',
    telephone: '+241 01 76 40 40',
    dateNomination: '2023-09-07',
    biographie: 'Ministre de l\'Économie et des Finances'
  },
  {
    nom: 'Immongault',
    prenom: 'Hermann',
    titre: 'Ministre de l\'Intérieur et de la Sécurité',
    email: 'ministre@interieur.ga',
    telephone: '+241 01 76 50 50',
    dateNomination: '2023-09-07',
    biographie: 'Ministre de l\'Intérieur et de la Sécurité'
  },
  {
    nom: 'Angone Abena',
    prenom: 'Murielle',
    titre: 'Ministre de l\'Éducation Nationale',
    email: 'ministre@education.ga',
    telephone: '+241 01 76 60 60',
    dateNomination: '2023-09-07',
    biographie: 'Ministre de l\'Éducation Nationale'
  }
];

// Coordonnées types pour les organismes
const COORDONNEES_LIBREVILLE: CoordonneesOrganisme = {
  adresse: 'Boulevard de l\'Indépendance',
  ville: 'Libreville',
  province: 'Estuaire',
  codePostal: 'BP 546',
  telephone: '+241 01 76 00 00',
  longitude: 9.4673,
  latitude: 0.4162
};

const COORDONNEES_PORT_GENTIL: CoordonneesOrganisme = {
  adresse: 'Avenue du Gouverneur Ballay',
  ville: 'Port-Gentil',
  province: 'Ogooué-Maritime',
  codePostal: 'BP 1120',
  telephone: '+241 01 55 00 00',
  longitude: 8.7879,
  latitude: -0.7193
};

// Données de démonstration pour les organismes
export const ORGANISMES_DEMO: OrganismeAdministratif[] = [
  // NIVEAU 1 - CONSTITUTIONNEL
  {
    id: 'ORG_PRESIDENCE',
    code: 'PRES',
    nom: 'Présidence de la République',
    nomCourt: 'Présidence',
    sigle: 'PR',
    niveau: NiveauHierarchique.NIVEAU_1_CONSTITUTIONNEL,
    type: TypeOrganisme.PRESIDENCE,
    statut: StatutOrganisme.ACTIF,
    parentId: undefined,
    enfantsIds: ['ORG_PRIMATURE'],
    chemin_hierarchique: 'Présidence',
    responsable: RESPONSABLES_DEMO[0],
    coordonnees: {
      ...COORDONNEES_LIBREVILLE,
      adresse: 'Palais du Bord de Mer, Libreville',
      email: 'contact@presidence.ga',
      siteWeb: 'https://presidence.ga'
    },
    attributions: [
      'Direction de la politique générale de la Nation',
      'Garantie de l\'indépendance nationale',
      'Veille au respect de la Constitution'
    ],
    mission: 'Assurer la continuité de l\'État et l\'unité nationale',
    competences: ['Politique générale', 'Diplomatie', 'Défense'],
    effectifs: {
      total: 450,
      cadres: 120,
      agentsExecution: 280,
      contractuels: 50,
      fonctionnaires: 400,
      vacances: 15,
      lastUpdate: '2024-01-15'
    },
    budget: {
      annuel: 25000000000,
      devise: 'XAF',
      exercice: 2024,
      fonctionnement: 15000000000,
      investissement: 10000000000,
      masse_salariale: 8000000000,
      lastUpdate: '2024-01-01'
    },
    dateCreation: '1960-08-17',
    dateModification: '2024-01-15',
    isActive: true,
    organismes_rattaches: ['ORG_PRIMATURE'],
    conventions_partenariats: [],
    groupe_ministeriel: 'EXECUTIF',
    est_structure_centrale: true,
    participe_conseil_ministres: true
  },

  // NIVEAU 2 - GOUVERNEMENTAL
  {
    id: 'ORG_PRIMATURE',
    code: 'PRIM',
    nom: 'Primature',
    nomCourt: 'Primature',
    sigle: 'PRIM',
    niveau: NiveauHierarchique.NIVEAU_2_GOUVERNEMENTAL,
    type: TypeOrganisme.PRIMATURE,
    statut: StatutOrganisme.ACTIF,
    parentId: 'ORG_PRESIDENCE',
    enfantsIds: ['ORG_MIN_ECONOMIE', 'ORG_MIN_INTERIEUR', 'ORG_MIN_EDUCATION'],
    chemin_hierarchique: 'Présidence > Primature',
    responsable: RESPONSABLES_DEMO[1],
    coordonnees: {
      ...COORDONNEES_LIBREVILLE,
      adresse: 'Immeuble de la Primature, Libreville',
      email: 'contact@primature.ga',
      siteWeb: 'https://primature.ga'
    },
    attributions: [
      'Direction de l\'action du gouvernement',
      'Coordination des ministères',
      'Application de la politique gouvernementale'
    ],
    mission: 'Conduire la politique du gouvernement sous l\'autorité du Président',
    competences: ['Coordination gouvernementale', 'Administration', 'Réformes'],
    effectifs: {
      total: 280,
      cadres: 85,
      agentsExecution: 170,
      contractuels: 25,
      fonctionnaires: 255,
      vacances: 8,
      lastUpdate: '2024-01-15'
    },
    budget: {
      annuel: 12000000000,
      devise: 'XAF',
      exercice: 2024,
      fonctionnement: 8000000000,
      investissement: 4000000000,
      masse_salariale: 5000000000,
      lastUpdate: '2024-01-01'
    },
    dateCreation: '1960-08-17',
    dateModification: '2024-01-15',
    isActive: true,
    organismes_rattaches: ['ORG_MIN_ECONOMIE', 'ORG_MIN_INTERIEUR'],
    conventions_partenariats: [],
    groupe_ministeriel: 'EXECUTIF',
    est_structure_centrale: true,
    participe_conseil_ministres: true
  },

  // NIVEAU 3 - MINISTÉRIEL
  {
    id: 'ORG_MIN_ECONOMIE',
    code: 'MEFP',
    nom: 'Ministère de l\'Économie et des Finances',
    nomCourt: 'Min. Économie',
    sigle: 'MEF',
    niveau: NiveauHierarchique.NIVEAU_3_MINISTERIEL,
    type: TypeOrganisme.MINISTERE,
    statut: StatutOrganisme.ACTIF,
    parentId: 'ORG_PRIMATURE',
    enfantsIds: ['ORG_DG_BUDGET', 'ORG_DG_TRESOR'],
    chemin_hierarchique: 'Présidence > Primature > Min. Économie',
    responsable: RESPONSABLES_DEMO[2],
    coordonnees: {
      ...COORDONNEES_LIBREVILLE,
      adresse: 'Immeuble du Ministère des Finances, Libreville',
      email: 'contact@economie.ga',
      siteWeb: 'https://economie.ga'
    },
    attributions: [
      'Politique économique et financière',
      'Gestion des finances publiques',
      'Relations avec les institutions financières'
    ],
    mission: 'Élaborer et mettre en œuvre la politique économique et financière',
    competences: ['Budget', 'Finances publiques', 'Politique économique'],
    effectifs: {
      total: 850,
      cadres: 340,
      agentsExecution: 450,
      contractuels: 60,
      fonctionnaires: 790,
      vacances: 25,
      lastUpdate: '2024-01-15'
    },
    budget: {
      annuel: 45000000000,
      devise: 'XAF',
      exercice: 2024,
      fonctionnement: 25000000000,
      investissement: 20000000000,
      masse_salariale: 15000000000,
      lastUpdate: '2024-01-01'
    },
    dateCreation: '1960-08-17',
    dateModification: '2024-01-15',
    isActive: true,
    organismes_rattaches: ['ORG_DG_BUDGET', 'ORG_DG_TRESOR'],
    conventions_partenariats: ['FMI', 'BANQUE_MONDIALE'],
    province: 'Estuaire',
    groupe_ministeriel: 'ECONOMIQUE',
    est_structure_centrale: true,
    participe_conseil_ministres: true
  },

  {
    id: 'ORG_MIN_INTERIEUR',
    code: 'MINT',
    nom: 'Ministère de l\'Intérieur et de la Sécurité',
    nomCourt: 'Min. Intérieur',
    sigle: 'MINT',
    niveau: NiveauHierarchique.NIVEAU_3_MINISTERIEL,
    type: TypeOrganisme.MINISTERE,
    statut: StatutOrganisme.ACTIF,
    parentId: 'ORG_PRIMATURE',
    enfantsIds: ['ORG_DGDI', 'ORG_POLICE_NATIONALE'],
    chemin_hierarchique: 'Présidence > Primature > Min. Intérieur',
    responsable: RESPONSABLES_DEMO[3],
    coordonnees: {
      ...COORDONNEES_LIBREVILLE,
      adresse: 'Immeuble du Ministère de l\'Intérieur, Libreville',
      email: 'contact@interieur.ga',
      siteWeb: 'https://interieur.ga'
    },
    attributions: [
      'Administration territoriale',
      'Sécurité intérieure',
      'Police et gendarmerie'
    ],
    mission: 'Assurer la sécurité intérieure et l\'administration du territoire',
    competences: ['Sécurité', 'Administration territoriale', 'Ordre public'],
    effectifs: {
      total: 1250,
      cadres: 185,
      agentsExecution: 950,
      contractuels: 115,
      fonctionnaires: 1135,
      vacances: 45,
      lastUpdate: '2024-01-15'
    },
    budget: {
      annuel: 35000000000,
      devise: 'XAF',
      exercice: 2024,
      fonctionnement: 20000000000,
      investissement: 15000000000,
      masse_salariale: 18000000000,
      lastUpdate: '2024-01-01'
    },
    dateCreation: '1960-08-17',
    dateModification: '2024-01-15',
    isActive: true,
    organismes_rattaches: ['ORG_DGDI', 'ORG_POLICE_NATIONALE'],
    conventions_partenariats: ['INTERPOL', 'CEMAC'],
    province: 'Estuaire',
    groupe_ministeriel: 'SOUVERAINETE',
    est_structure_centrale: true,
    participe_conseil_ministres: true
  },

  {
    id: 'ORG_MIN_EDUCATION',
    code: 'MEN',
    nom: 'Ministère de l\'Éducation Nationale',
    nomCourt: 'Min. Éducation',
    sigle: 'MEN',
    niveau: NiveauHierarchique.NIVEAU_3_MINISTERIEL,
    type: TypeOrganisme.MINISTERE,
    statut: StatutOrganisme.ACTIF,
    parentId: 'ORG_PRIMATURE',
    enfantsIds: ['ORG_DGES', 'ORG_DGEC'],
    chemin_hierarchique: 'Présidence > Primature > Min. Éducation',
    responsable: RESPONSABLES_DEMO[4],
    coordonnees: {
      ...COORDONNEES_LIBREVILLE,
      adresse: 'Immeuble du Ministère de l\'Éducation, Libreville',
      email: 'contact@education.ga',
      siteWeb: 'https://education.ga'
    },
    attributions: [
      'Politique éducative nationale',
      'Enseignement primaire et secondaire',
      'Formation des enseignants'
    ],
    mission: 'Élaborer et mettre en œuvre la politique éducative nationale',
    competences: ['Éducation', 'Formation', 'Pédagogie'],
    effectifs: {
      total: 25000,
      cadres: 8500,
      agentsExecution: 15000,
      contractuels: 1500,
      fonctionnaires: 23500,
      vacances: 1200,
      lastUpdate: '2024-01-15'
    },
    budget: {
      annuel: 180000000000,
      devise: 'XAF',
      exercice: 2024,
      fonctionnement: 120000000000,
      investissement: 60000000000,
      masse_salariale: 95000000000,
      lastUpdate: '2024-01-01'
    },
    dateCreation: '1960-08-17',
    dateModification: '2024-01-15',
    isActive: true,
    organismes_rattaches: ['ORG_DGES', 'ORG_DGEC'],
    conventions_partenariats: ['UNESCO', 'UNICEF'],
    province: 'Estuaire',
    groupe_ministeriel: 'SOCIAL',
    est_structure_centrale: true,
    participe_conseil_ministres: true
  },

  // NIVEAU 4 - DIRECTIONNEL
  {
    id: 'ORG_DG_BUDGET',
    code: 'DGB',
    nom: 'Direction Générale du Budget',
    nomCourt: 'DG Budget',
    sigle: 'DGB',
    niveau: NiveauHierarchique.NIVEAU_4_DIRECTIONNEL,
    type: TypeOrganisme.DIRECTION_GENERALE,
    statut: StatutOrganisme.ACTIF,
    parentId: 'ORG_MIN_ECONOMIE',
    enfantsIds: [],
    chemin_hierarchique: 'Présidence > Primature > Min. Économie > DG Budget',
    coordonnees: {
      ...COORDONNEES_LIBREVILLE,
      adresse: 'Direction Générale du Budget, Libreville',
      email: 'contact@budget.ga'
    },
    attributions: [
      'Préparation du budget de l\'État',
      'Suivi de l\'exécution budgétaire',
      'Contrôle des dépenses publiques'
    ],
    mission: 'Gérer le budget de l\'État et contrôler les finances publiques',
    competences: ['Budget', 'Contrôle financier', 'Comptabilité publique'],
    effectifs: {
      total: 180,
      cadres: 95,
      agentsExecution: 75,
      contractuels: 10,
      fonctionnaires: 170,
      vacances: 5,
      lastUpdate: '2024-01-15'
    },
    budget: {
      annuel: 2500000000,
      devise: 'XAF',
      exercice: 2024,
      fonctionnement: 1800000000,
      investissement: 700000000,
      masse_salariale: 1200000000,
      lastUpdate: '2024-01-01'
    },
    dateCreation: '1970-01-01',
    dateModification: '2024-01-15',
    isActive: true,
    organismes_rattaches: [],
    conventions_partenariats: [],
    province: 'Estuaire',
    est_structure_centrale: true,
    participe_conseil_ministres: false
  },

  {
    id: 'ORG_DG_TRESOR',
    code: 'DGT',
    nom: 'Direction Générale du Trésor',
    nomCourt: 'DG Trésor',
    sigle: 'DGT',
    niveau: NiveauHierarchique.NIVEAU_4_DIRECTIONNEL,
    type: TypeOrganisme.DIRECTION_GENERALE,
    statut: StatutOrganisme.ACTIF,
    parentId: 'ORG_MIN_ECONOMIE',
    enfantsIds: [],
    chemin_hierarchique: 'Présidence > Primature > Min. Économie > DG Trésor',
    coordonnees: {
      ...COORDONNEES_LIBREVILLE,
      adresse: 'Direction Générale du Trésor, Libreville',
      email: 'contact@tresor.ga'
    },
    attributions: [
      'Gestion de la trésorerie de l\'État',
      'Paiements publics',
      'Relations bancaires'
    ],
    mission: 'Gérer la trésorerie et les flux financiers de l\'État',
    competences: ['Trésorerie', 'Paiements', 'Cash management'],
    effectifs: {
      total: 220,
      cadres: 135,
      agentsExecution: 75,
      contractuels: 10,
      fonctionnaires: 210,
      vacances: 8,
      lastUpdate: '2024-01-15'
    },
    budget: {
      annuel: 3200000000,
      devise: 'XAF',
      exercice: 2024,
      fonctionnement: 2200000000,
      investissement: 1000000000,
      masse_salariale: 1500000000,
      lastUpdate: '2024-01-01'
    },
    dateCreation: '1970-01-01',
    dateModification: '2024-01-15',
    isActive: true,
    organismes_rattaches: [],
    conventions_partenariats: [],
    province: 'Estuaire',
    est_structure_centrale: true,
    participe_conseil_ministres: false
  },

  {
    id: 'ORG_DGDI',
    code: 'DGDI',
    nom: 'Direction Générale de la Documentation et de l\'Immigration',
    nomCourt: 'DGDI',
    sigle: 'DGDI',
    niveau: NiveauHierarchique.NIVEAU_4_DIRECTIONNEL,
    type: TypeOrganisme.DIRECTION_GENERALE,
    statut: StatutOrganisme.ACTIF,
    parentId: 'ORG_MIN_INTERIEUR',
    enfantsIds: [],
    chemin_hierarchique: 'Présidence > Primature > Min. Intérieur > DGDI',
    coordonnees: {
      ...COORDONNEES_LIBREVILLE,
      adresse: 'DGDI, Libreville',
      email: 'contact@dgdi.ga'
    },
    attributions: [
      'Délivrance des passeports',
      'Gestion de l\'immigration',
      'Contrôle des frontières'
    ],
    mission: 'Gérer les documents d\'identité et l\'immigration',
    competences: ['Documentation', 'Immigration', 'Frontières'],
    effectifs: {
      total: 320,
      cadres: 85,
      agentsExecution: 215,
      contractuels: 20,
      fonctionnaires: 300,
      vacances: 12,
      lastUpdate: '2024-01-15'
    },
    budget: {
      annuel: 4500000000,
      devise: 'XAF',
      exercice: 2024,
      fonctionnement: 3200000000,
      investissement: 1300000000,
      masse_salariale: 2100000000,
      lastUpdate: '2024-01-01'
    },
    dateCreation: '1975-01-01',
    dateModification: '2024-01-15',
    isActive: true,
    organismes_rattaches: [],
    conventions_partenariats: [],
    province: 'Estuaire',
    est_structure_centrale: true,
    participe_conseil_ministres: false
  }
];

// Statistiques calculées
export const STATISTIQUES_DEMO: StatistiquesStructure = {
  niveau_1: 1,
  niveau_2: 1,
  niveau_3: 3,
  niveau_4: 3,
  niveau_5: 0,

  ministeres: 3,
  directions: 3,
  etablissements: 0,
  collectivites: 0,

  total_effectifs: 28550,
  total_cadres: 9360,
  total_agents: 17690,
  postes_vacants: 1315,
  taux_occupation: 95.4,

  budget_total: 307200000000,
  budget_fonctionnement: 195200000000,
  budget_investissement: 112000000000,
  masse_salariale_totale: 144800000000,

  organismes_actifs: 8,
  organismes_inactifs: 0,
  organismes_en_reorganisation: 0,
  responsables_vacants: 3,

  derniere_mise_a_jour: new Date().toISOString()
};

// Fonction pour générer plus d'organismes de démonstration
export const genererOrganismesSupplementaires = (): OrganismeAdministratif[] => {
  const organismes: OrganismeAdministratif[] = [];

  // Ajouter d'autres ministères
  const autresMinisteres = [
    'Ministère de la Santé',
    'Ministère de la Justice',
    'Ministère de la Défense',
    'Ministère des Affaires Étrangères',
    'Ministère du Travail',
    'Ministère de l\'Agriculture',
    'Ministère des Mines',
    'Ministère du Tourisme',
    'Ministère des Transports',
    'Ministère de l\'Environnement'
  ];

  autresMinisteres.forEach((nom, index) => {
    const code = nom.split(' ')[2]?.toUpperCase() || `MIN${index}`;
    organismes.push({
      id: `ORG_${code}`,
      code,
      nom,
      nomCourt: nom.replace('Ministère ', 'Min. '),
      sigle: code,
      niveau: NiveauHierarchique.NIVEAU_3_MINISTERIEL,
      type: TypeOrganisme.MINISTERE,
      statut: StatutOrganisme.ACTIF,
      parentId: 'ORG_PRIMATURE',
      enfantsIds: [],
      chemin_hierarchique: `Présidence > Primature > ${nom}`,
      coordonnees: COORDONNEES_LIBREVILLE,
      attributions: [`Politique ${nom.toLowerCase()}`],
      mission: `Élaborer et mettre en œuvre la politique de ${nom.toLowerCase()}`,
      competences: [nom.split(' ').pop() || 'Général'],
      effectifs: {
        total: 300 + Math.floor(Math.random() * 500),
        cadres: 100 + Math.floor(Math.random() * 150),
        agentsExecution: 200 + Math.floor(Math.random() * 350),
        contractuels: 10 + Math.floor(Math.random() * 40),
        fonctionnaires: 280 + Math.floor(Math.random() * 450),
        vacances: Math.floor(Math.random() * 20),
        lastUpdate: '2024-01-15'
      },
      budget: {
        annuel: 10000000000 + Math.floor(Math.random() * 50000000000),
        devise: 'XAF',
        exercice: 2024,
        fonctionnement: 6000000000 + Math.floor(Math.random() * 30000000000),
        investissement: 4000000000 + Math.floor(Math.random() * 20000000000),
        masse_salariale: 3000000000 + Math.floor(Math.random() * 15000000000),
        lastUpdate: '2024-01-01'
      },
      dateCreation: '1960-08-17',
      dateModification: '2024-01-15',
      isActive: true,
      organismes_rattaches: [],
      conventions_partenariats: [],
      province: 'Estuaire',
      groupe_ministeriel: 'SECTORIEL',
      est_structure_centrale: true,
      participe_conseil_ministres: true
    });
  });

  return organismes;
};

// Calculer les vraies statistiques à partir des organismes réels
function calculerStatistiquesReelles(organismes: OrganismeAdministratif[]): StatistiquesStructure {
  const totalOrganismes = organismes.length;

  // Compter par niveau
  const organismesParNiveau = organismes.reduce((acc, org) => {
    acc[org.niveau] = (acc[org.niveau] || 0) + 1;
    return acc;
  }, {} as Record<NiveauHierarchique, number>);

  // Compter par type
  const organismesParType = organismes.reduce((acc, org) => {
    acc[org.type] = (acc[org.type] || 0) + 1;
    return acc;
  }, {} as Record<TypeOrganisme, number>);

  // Compter par statut
  const organismesParStatut = organismes.reduce((acc, org) => {
    acc[org.statut] = (acc[org.statut] || 0) + 1;
    return acc;
  }, {} as Record<StatutOrganisme, number>);

  // Calculer les totaux des effectifs et budgets
  const totalEffectifs = organismes.reduce((sum, org) => sum + (org.effectifs?.total || 0), 0);
  const totalBudgetAnnuel = organismes.reduce((sum, org) => sum + (org.budget?.annuel || 0), 0);

  // Compter les postes vacants (organismes sans responsable)
  const postesVacantsResponsables = organismes.filter(org => !org.responsable).length;

  // Compter les organismes en restructuration
  const organismesEnReorganisation = organismesParStatut[StatutOrganisme.EN_REORGANISATION] || 0;

  return {
    niveau_1: organismesParNiveau[NiveauHierarchique.NIVEAU_1_CONSTITUTIONNEL] || 0,
    niveau_2: organismesParNiveau[NiveauHierarchique.NIVEAU_2_GOUVERNEMENTAL] || 0,
    niveau_3: organismesParNiveau[NiveauHierarchique.NIVEAU_3_MINISTERIEL] || 0,
    niveau_4: organismesParNiveau[NiveauHierarchique.NIVEAU_4_DIRECTIONNEL] || 0,
    niveau_5: organismesParNiveau[NiveauHierarchique.NIVEAU_5_TERRITORIAL_SPECIALISE] || 0,

    ministeres: organismesParType[TypeOrganisme.MINISTERE] || 0,
    directions: (organismesParType[TypeOrganisme.DIRECTION_GENERALE] || 0) + (organismesParType[TypeOrganisme.DIRECTION_CENTRALE] || 0),
    etablissements: organismesParType[TypeOrganisme.ETABLISSEMENT_PUBLIC] || 0,
    collectivites: (organismesParType[TypeOrganisme.GOUVERNORAT] || 0) + (organismesParType[TypeOrganisme.PREFECTURE] || 0) + (organismesParType[TypeOrganisme.MAIRIE] || 0),

    total_effectifs: totalEffectifs,
    total_cadres: organismes.reduce((sum, org) => sum + (org.effectifs?.cadres || 0), 0),
    total_agents: organismes.reduce((sum, org) => sum + (org.effectifs?.agentsExecution || 0), 0),
    postes_vacants: organismes.reduce((sum, org) => sum + (org.effectifs?.vacances || 0), 0),

    budget_total: totalBudgetAnnuel,
    budget_fonctionnement: organismes.reduce((sum, org) => sum + (org.budget?.fonctionnement || 0), 0),
    budget_investissement: organismes.reduce((sum, org) => sum + (org.budget?.investissement || 0), 0),
    masse_salariale_totale: organismes.reduce((sum, org) => sum + (org.budget?.masse_salariale || 0), 0),

    organismes_actifs: organismesParStatut[StatutOrganisme.ACTIF] || 0,
    organismes_inactifs: organismesParStatut[StatutOrganisme.INACTIF] || 0,
    organismes_en_reorganisation: organismesEnReorganisation,
    responsables_vacants: postesVacantsResponsables,

    taux_occupation: totalEffectifs > 0 ? ((totalEffectifs - (organismes.reduce((sum, org) => sum + (org.effectifs?.vacances || 0), 0))) / totalEffectifs) * 100 : 0,
    derniere_mise_a_jour: new Date().toISOString()
  };
}

export { ORGANISMES_DEMO as default, genererOrganismesAdministratifsReels, calculerStatistiquesReelles };
