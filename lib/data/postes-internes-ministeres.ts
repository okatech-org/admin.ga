/**
 * POSTES INTERNES DES MINISTÈRES
 * Directions centrales - Postes/Comptes vides (sans personnel affecté)
 * Ces entités ne sont PAS des organismes autonomes mais des postes internes
 */

export interface PosteInterne {
  id: string;
  code: string;
  name: string;
  type: 'DCRH' | 'DCAF' | 'DCSI' | 'DCAJ' | 'DCC';
  nom_complet: string;
  ministere_parent: string;
  ministere_code: string;
  description: string;
  mission: string;
  city: string;
  email: string;
  services: string[];
  niveau_hierarchique: number;
  utilisateurs_affectes: number; // Toujours 0 pour l'instant (compte vide)
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Définition des 5 types de postes internes (modèle répétitif transversal)
export const TYPES_POSTES_INTERNES = {
  DCRH: {
    type: 'DCRH' as const,
    nom_complet: 'Direction Centrale des Ressources Humaines',
    mission: 'Gestion du personnel et développement des compétences',
    email_format: '@rh.[ministere].gov.ga',
    services: ['Recrutement', 'Formation', 'Gestion des carrières', 'Évaluation du personnel']
  },
  DCAF: {
    type: 'DCAF' as const,
    nom_complet: 'Direction Centrale des Affaires Financières',
    mission: 'Gestion budgétaire et financière du ministère',
    email_format: '@finances.[ministere].gov.ga',
    services: ['Budget', 'Comptabilité', 'Marchés publics', 'Contrôle financier']
  },
  DCSI: {
    type: 'DCSI' as const,
    nom_complet: 'Direction Centrale des Systèmes d\'Information',
    mission: 'Informatique et télécommunications du ministère',
    email_format: '@si.[ministere].gov.ga',
    services: ['Infrastructure IT', 'Applications', 'Sécurité informatique', 'Télécom']
  },
  DCAJ: {
    type: 'DCAJ' as const,
    nom_complet: 'Direction Centrale des Affaires Juridiques',
    mission: 'Conseil juridique et gestion des contentieux',
    email_format: '@juridique.[ministere].gov.ga',
    services: ['Conseil juridique', 'Contentieux', 'Veille juridique', 'Contrats']
  },
  DCC: {
    type: 'DCC' as const,
    nom_complet: 'Direction Centrale de la Communication',
    mission: 'Communication interne et externe du ministère',
    email_format: '@comm.[ministere].gov.ga',
    services: ['Relations presse', 'Communication digitale', 'Événementiel', 'Publications']
  }
};

// Codes des 30 ministères (repris du fichier principal)
export const MINISTERES_CODES_POSTES = [
  'MIN_ECO_FIN', 'MIN_EDU_NAT', 'MIN_TRANS_MAR', 'MIN_REF_REL_INST',
  'MIN_AFF_ETR', 'MIN_JUST', 'MIN_INT_SEC', 'MIN_DEF_NAT', 'MIN_SAN_AFF_SOC',
  'MIN_ENS_SUP', 'MIN_FONC_PUB', 'MIN_TRAV_EMP', 'MIN_IND_TRANS', 'MIN_TRAV_PUB',
  'MIN_ECO_NUM', 'MIN_ENT_COM', 'MIN_AGR_ELE', 'MIN_ENV_ECO', 'MIN_FEM_FAM',
  'MIN_JEUN_SPO', 'MIN_TOUR_ART', 'MIN_COM_MED', 'MIN_PET_GAZ', 'MIN_MIN_GEO',
  'MIN_EAUX_FOR', 'MIN_ENER_HYD', 'MIN_HAB_URB', 'MIN_REL_PARL', 'MIN_RECH_SCIEN',
  'MIN_PLAN'
];

// FONCTION : Générer tous les postes internes (150 postes = 30 ministères × 5 types)
export function genererPostesInternes(): PosteInterne[] {
  const postesInternes: PosteInterne[] = [];
  const now = new Date().toISOString();

  MINISTERES_CODES_POSTES.forEach((codeMinistere) => {
    Object.values(TYPES_POSTES_INTERNES).forEach((typePoste) => {
      const posteId = `POSTE_${typePoste.type}_${codeMinistere}`;
      const posteCode = `${typePoste.type}_${codeMinistere}`;

      postesInternes.push({
        id: posteId,
        code: posteCode,
        name: `${typePoste.nom_complet} - ${codeMinistere}`,
        type: typePoste.type,
        nom_complet: typePoste.nom_complet,
        ministere_parent: codeMinistere,
        ministere_code: codeMinistere,
        description: `${typePoste.mission} pour le ${codeMinistere}`,
        mission: typePoste.mission,
        city: 'Libreville',
        email: `contact${typePoste.email_format.replace('[ministere]', codeMinistere.toLowerCase())}`,
        services: typePoste.services,
        niveau_hierarchique: 4,
        utilisateurs_affectes: 0, // Compte vide - aucun utilisateur affecté
        isActive: true,
        createdAt: now,
        updatedAt: now
      });
    });
  });

  return postesInternes;
}

// FONCTION : Obtenir les postes par ministère
export function getPostesByMinistere(ministereCode: string): PosteInterne[] {
  return genererPostesInternes().filter(poste => poste.ministere_code === ministereCode);
}

// FONCTION : Obtenir les postes par type
export function getPostesByType(type: 'DCRH' | 'DCAF' | 'DCSI' | 'DCAJ' | 'DCC'): PosteInterne[] {
  return genererPostesInternes().filter(poste => poste.type === type);
}

// STATISTIQUES DES POSTES INTERNES
export const STATISTIQUES_POSTES_INTERNES = {
  total: 150,
  types: {
    DCRH: 30,
    DCAF: 30,
    DCSI: 30,
    DCAJ: 30,
    DCC: 30
  },
  ministeres: 30,
  utilisateurs_total_affectes: 0, // Tous sont des comptes vides pour l'instant
  comptes_vides: 150
};

export default {
  postes: genererPostesInternes(),
  statistiques: STATISTIQUES_POSTES_INTERNES,
  types: TYPES_POSTES_INTERNES
};
