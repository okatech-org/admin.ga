/**
 * SYSTÈME DE GESTION DES RESSOURCES HUMAINES - ADMINISTRATION GABONAISE
 *
 * Architecture réelle :
 * - COMPTES = Postes occupés (association Poste + Titulaire)
 * - POSTES VACANTS = Offres d'emploi disponibles
 * - FONCTIONNAIRES EN ATTENTE = Utilisateurs sans affectation
 */

import {
  OrganismePublic,
  PosteAdministratif,
  TypeOrganisme,
  ORGANISMES_PUBLICS,
  POSTES_PAR_TYPE,
  POSTES_COMMUNS
} from './systeme-complet-gabon';

// ==================== INTERFACES RH ====================

/**
 * Poste dans un organisme (peut être vacant ou occupé)
 */
export interface PosteOrganisme {
  id: string;
  organisme_code: string;
  poste_id: string; // Référence vers PosteAdministratif
  poste_titre: string;
  poste_code: string;
  niveau: 1 | 2 | 3;
  statut: 'OCCUPE' | 'VACANT' | 'GELE'; // Gelé = temporairement non disponible
  titulaire_id?: string; // Si occupé, référence vers le fonctionnaire
  date_creation: Date;
  date_vacance?: Date; // Date depuis laquelle le poste est vacant
  salaire_base?: number;
  avantages?: string[];
  prerequis: string[];
  description?: string;
}

/**
 * Fonctionnaire (peut avoir un poste ou être en attente)
 */
export interface Fonctionnaire {
  id: string;
  matricule: string; // Numéro matricule unique
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  date_naissance?: Date;
  lieu_naissance?: string;

  // Situation administrative
  statut: 'EN_POSTE' | 'EN_ATTENTE' | 'DETACHE' | 'RETRAITE' | 'SUSPENDU';
  grade: 'A1' | 'A2' | 'B1' | 'B2' | 'C';
  anciennete_annees: number;

  // Affectation actuelle
  poste_actuel?: {
    organisme_code: string;
    poste_id: string;
    poste_titre: string;
    date_affectation: Date;
  };

  // Historique
  affectations_precedentes: AffectationHistorique[];

  // Compétences et formation
  diplomes: Diplome[];
  competences: string[];
  formations_continues: Formation[];

  // Préférences pour affectation
  preferences_affectation?: {
    organismes_preferes: string[];
    types_postes: string[];
    zones_geographiques: string[];
  };

  date_entree_fonction_publique: Date;
  date_creation: Date;
}

/**
 * Compte = Association d'un fonctionnaire à un poste
 */
export interface CompteActif {
  id: string;
  fonctionnaire_id: string;
  fonctionnaire_nom_complet: string;
  poste_id: string;
  poste_titre: string;
  organisme_code: string;
  organisme_nom: string;

  role_systeme: 'ADMIN' | 'USER' | 'RECEPTIONIST' | 'MANAGER';

  date_affectation: Date;
  date_fin_prevue?: Date; // Pour les contrats temporaires

  statut: 'ACTIF' | 'INACTIF' | 'SUSPENDU';

  // Permissions et accès
  permissions: string[];
  dernier_acces?: Date;

  // Évaluation
  derniere_evaluation?: {
    date: Date;
    note: number;
    commentaire: string;
  };
}

// ==================== TYPES SUPPLÉMENTAIRES ====================

interface AffectationHistorique {
  organisme_code: string;
  organisme_nom: string;
  poste_titre: string;
  date_debut: Date;
  date_fin: Date;
  motif_fin: 'MUTATION' | 'PROMOTION' | 'FIN_CONTRAT' | 'RETRAITE' | 'AUTRE';
}

interface Diplome {
  niveau: 'BAC' | 'BAC+2' | 'BAC+3' | 'BAC+5' | 'BAC+8' | 'AUTRE';
  intitule: string;
  etablissement: string;
  annee_obtention: number;
  specialite?: string;
}

interface Formation {
  intitule: string;
  organisme: string;
  date: Date;
  duree_jours: number;
  certificat_obtenu: boolean;
}

// ==================== CONFIGURATION RH ====================

/**
 * Configuration des quotas de postes par type d'organisme
 */
export const QUOTAS_POSTES: Record<TypeOrganisme, {
  min_postes: number;
  max_postes: number;
  postes_obligatoires: string[]; // Codes des postes obligatoires
  ratio_occupation_cible: number; // % de postes qui doivent être occupés
}> = {
  INSTITUTION_SUPREME: {
    min_postes: 20,
    max_postes: 50,
    postes_obligatoires: ['PR', 'SG', 'DC', 'RECEP'],
    ratio_occupation_cible: 0.85
  },
  MINISTERE: {
    min_postes: 15,
    max_postes: 40,
    postes_obligatoires: ['MIN', 'SG', 'DC', 'RECEP', 'SEC'],
    ratio_occupation_cible: 0.80
  },
  DIRECTION_GENERALE: {
    min_postes: 10,
    max_postes: 25,
    postes_obligatoires: ['DG', 'DGA', 'RECEP', 'SEC'],
    ratio_occupation_cible: 0.75
  },
  ETABLISSEMENT_PUBLIC: {
    min_postes: 8,
    max_postes: 20,
    postes_obligatoires: ['DG', 'RECEP', 'COMPT'],
    ratio_occupation_cible: 0.70
  },
  ENTREPRISE_PUBLIQUE: {
    min_postes: 10,
    max_postes: 30,
    postes_obligatoires: ['PDG', 'RECEP', 'COMPT'],
    ratio_occupation_cible: 0.75
  },
  ETABLISSEMENT_SANTE: {
    min_postes: 15,
    max_postes: 100,
    postes_obligatoires: ['DG-HOP', 'MED-CHEF', 'RECEP'],
    ratio_occupation_cible: 0.85
  },
  UNIVERSITE: {
    min_postes: 20,
    max_postes: 200,
    postes_obligatoires: ['RECT', 'VR', 'RECEP', 'SEC'],
    ratio_occupation_cible: 0.80
  },
  GOUVERNORAT: {
    min_postes: 8,
    max_postes: 15,
    postes_obligatoires: ['GOUV', 'SG-GOUV', 'RECEP'],
    ratio_occupation_cible: 0.85
  },
  PREFECTURE: {
    min_postes: 6,
    max_postes: 12,
    postes_obligatoires: ['PREF', 'SG-PREF', 'RECEP'],
    ratio_occupation_cible: 0.80
  },
  MAIRIE: {
    min_postes: 8,
    max_postes: 20,
    postes_obligatoires: ['MAIRE', 'SG-MAIRIE', 'DST', 'RECEP'],
    ratio_occupation_cible: 0.75
  },
  AUTORITE_REGULATION: {
    min_postes: 5,
    max_postes: 15,
    postes_obligatoires: ['PRES-AR', 'RECEP'],
    ratio_occupation_cible: 0.80
  },
  FORCE_SECURITE: {
    min_postes: 10,
    max_postes: 50,
    postes_obligatoires: ['DG-SEC', 'RECEP'],
    ratio_occupation_cible: 0.90
  }
};

// ==================== GÉNÉRATEURS DE DONNÉES ====================

// Générateur de noms gabonais (copié depuis systeme-complet-gabon.ts)
const PRENOMS_GABONAIS = {
  masculins: [
    'Jean', 'Pierre', 'Paul', 'Jacques', 'François', 'Michel', 'André', 'Philippe',
    'Alain', 'Bernard', 'Christian', 'Daniel', 'Éric', 'Georges', 'Henri', 'Louis',
    'Marcel', 'Patrick', 'Robert', 'Serge', 'Thierry', 'Yves', 'Albert', 'Claude',
    'Léon', 'Jules', 'Olivier', 'Raymond', 'Guy', 'Hervé', 'Landry', 'Brice',
    'Hermann', 'Séraphin', 'Ulrich', 'Régis', 'Abdul', 'Selim', 'Ernest', 'Simon',
    'Hans', 'Alfred', 'Bill', 'Anatole', 'Marcellin', 'Gustave', 'Christophe'
  ],
  feminins: [
    'Marie', 'Jeanne', 'Anne', 'Claire', 'Louise', 'Françoise', 'Monique', 'Nicole',
    'Sylvie', 'Catherine', 'Christine', 'Martine', 'Nathalie', 'Isabelle', 'Valérie',
    'Sophie', 'Céline', 'Sandrine', 'Christelle', 'Alice', 'Brigitte', 'Camélia',
    'Christiane', 'Paulette', 'Thérèse', 'Ange', 'Bertille', 'Rose', 'Madeleine'
  ]
};

const NOMS_GABONAIS = [
  'Ntoutoume', 'Leclercq', 'Manfoumbi', 'Ndong', 'Obiang', 'Onanga', 'Ndiaye',
  'Immongault', 'Akure', 'Davain', 'Ngodjou', 'Tchemambela', 'Essono', 'Bikissa',
  'Nembe', 'Ivala', 'Ngomanda', 'Rebienot', 'Pellegrin', 'Mayi', 'Massila',
  'Akendengue', 'Batolo', 'Doudou', 'Lengoma', 'Magni', 'Bejaoui', 'Laccruche',
  'Lelabou', 'Vane', 'Ekomie', 'Bikanga', 'Tsioukacka', 'Ngome', 'Ayong',
  'Kabongo', 'Nouhando', 'Leckat', 'Dikoumba', 'Assingambagni', 'Tsanga',
  'Djeki', 'Mengue', 'M\'Owono', 'Mba', 'N\'Dutume', 'Mihindou', 'Apérano',
  'Kadjidja', 'Ngoyo', 'Moussavou', 'Mibindzou', 'Mouelet', 'Ngoma', 'Barassouaga',
  'Balekidra', 'Oyini', 'Moulengui', 'Mfondo', 'Onkanowa', 'Oyima', 'Chambrier'
];

/**
 * Générer un matricule unique
 */
function genererMatricule(index: number): string {
  const annee = new Date().getFullYear();
  const numero = String(index + 1).padStart(6, '0');
  return `MAT${annee}${numero}`;
}

/**
 * Générer un email professionnel
 */
function genererEmailProfessionnel(prenom: string, nom: string): string {
  const prenomClean = prenom.toLowerCase().replace(/[éèêë]/g, 'e').replace(/[àâä]/g, 'a').replace(/[' -]/g, '');
  const nomClean = nom.toLowerCase().replace(/[éèêë]/g, 'e').replace(/[àâä]/g, 'a').replace(/[' -]/g, '');
  return `${prenomClean}.${nomClean}@fonction-publique.ga`;
}

/**
 * Générer les diplômes aléatoires
 */
function genererDiplomes(grade: string): Diplome[] {
  const diplomes: Diplome[] = [];

  if (grade === 'A1' || grade === 'A2') {
    diplomes.push({
      niveau: 'BAC+5',
      intitule: 'Master en Administration Publique',
      etablissement: 'Université Omar Bongo',
      annee_obtention: 2015 + Math.floor(Math.random() * 5),
      specialite: 'Gestion publique'
    });
  } else if (grade === 'B1' || grade === 'B2') {
    diplomes.push({
      niveau: 'BAC+2',
      intitule: 'BTS Administration',
      etablissement: 'Institut National des Sciences de Gestion',
      annee_obtention: 2018 + Math.floor(Math.random() * 4)
    });
  } else {
    diplomes.push({
      niveau: 'BAC',
      intitule: 'Baccalauréat',
      etablissement: 'Lycée National Léon MBA',
      annee_obtention: 2020 + Math.floor(Math.random() * 3)
    });
  }

  return diplomes;
}

/**
 * Créer tous les postes pour un organisme
 */
export function creerPostesOrganisme(organisme: OrganismePublic): PosteOrganisme[] {
  const postes: PosteOrganisme[] = [];
  const quotas = QUOTAS_POSTES[organisme.type];

  // 1. Créer les postes obligatoires
  const postesDisponibles = [...POSTES_PAR_TYPE[organisme.type] || [], ...POSTES_COMMUNS];

  for (const codeObligatoire of quotas.postes_obligatoires) {
    const posteRef = postesDisponibles.find(p => p.code === codeObligatoire);
    if (posteRef) {
      postes.push({
        id: `poste_${organisme.code}_${posteRef.code}_01`,
        organisme_code: organisme.code,
        poste_id: posteRef.id,
        poste_titre: posteRef.titre,
        poste_code: posteRef.code,
        niveau: posteRef.niveau,
        statut: 'VACANT', // Sera mis à jour lors de l'affectation
        date_creation: new Date(),
        salaire_base: posteRef.salaire_base,
        prerequis: posteRef.prerequis,
        description: posteRef.description
      });
    }
  }

  // 2. Ajouter des postes supplémentaires selon le quota
  const nombrePostesSupp = Math.floor(
    Math.random() * (quotas.max_postes - quotas.min_postes) +
    (quotas.min_postes - postes.length)
  );

  const postesNonObligatoires = postesDisponibles.filter(
    p => !quotas.postes_obligatoires.includes(p.code)
  );

  for (let i = 0; i < nombrePostesSupp && i < postesNonObligatoires.length; i++) {
    const posteRef = postesNonObligatoires[i];
    const nombreInstances = posteRef.niveau === 2 ? Math.floor(Math.random() * 3) + 1 : 1;

    for (let j = 0; j < nombreInstances; j++) {
      postes.push({
        id: `poste_${organisme.code}_${posteRef.code}_${j + 1}`,
        organisme_code: organisme.code,
        poste_id: posteRef.id,
        poste_titre: posteRef.titre,
        poste_code: posteRef.code,
        niveau: posteRef.niveau,
        statut: 'VACANT',
        date_creation: new Date(),
        salaire_base: posteRef.salaire_base,
        prerequis: posteRef.prerequis,
        description: posteRef.description
      });
    }
  }

  return postes;
}

/**
 * Créer des fonctionnaires (certains seront affectés, d'autres en attente)
 */
export function creerFonctionnaires(nombre: number): Fonctionnaire[] {
  const fonctionnaires: Fonctionnaire[] = [];

  for (let i = 0; i < nombre; i++) {
    const estFeminin = Math.random() > 0.6;
    const prenoms = estFeminin ? PRENOMS_GABONAIS.feminins : PRENOMS_GABONAIS.masculins;
    const prenom = prenoms[Math.floor(Math.random() * prenoms.length)];
    const nom = NOMS_GABONAIS[Math.floor(Math.random() * NOMS_GABONAIS.length)];

    // Déterminer le grade selon une distribution réaliste
    const randGrade = Math.random();
    const grade = randGrade < 0.15 ? 'A1' :
                  randGrade < 0.30 ? 'A2' :
                  randGrade < 0.50 ? 'B1' :
                  randGrade < 0.75 ? 'B2' : 'C';

    const anciennete = Math.floor(Math.random() * 20) + 1;

    fonctionnaires.push({
      id: `fonct_${String(i + 1).padStart(6, '0')}`,
      matricule: genererMatricule(i),
      nom: nom,
      prenom: prenom,
      email: genererEmailProfessionnel(prenom, nom),
      telephone: `+241 0${Math.floor(Math.random() * 7) + 1} ${Math.floor(Math.random() * 90) + 10} ${Math.floor(Math.random() * 90) + 10} ${Math.floor(Math.random() * 90) + 10}`,

      statut: 'EN_ATTENTE', // Par défaut en attente
      grade: grade as any,
      anciennete_annees: anciennete,

      affectations_precedentes: [],
      diplomes: genererDiplomes(grade),
      competences: ['Bureautique', 'Gestion administrative', 'Accueil'],
      formations_continues: [],

      preferences_affectation: {
        organismes_preferes: [],
        types_postes: [],
        zones_geographiques: ['Libreville', 'Estuaire']
      },

      date_entree_fonction_publique: new Date(Date.now() - anciennete * 365 * 24 * 60 * 60 * 1000),
      date_creation: new Date()
    });
  }

  return fonctionnaires;
}

/**
 * Affecter les fonctionnaires aux postes
 */
export function affecterFonctionnairesAuxPostes(
  fonctionnaires: Fonctionnaire[],
  postesParOrganisme: Map<string, PosteOrganisme[]>
): {
  comptes: CompteActif[];
  postesOccupes: PosteOrganisme[];
  postesVacants: PosteOrganisme[];
  fonctionnairesEnAttente: Fonctionnaire[];
  fonctionnairesEnPoste: Fonctionnaire[];
} {
  const comptes: CompteActif[] = [];
  const fonctionnairesEnPoste: Fonctionnaire[] = [];
  const fonctionnairesEnAttente: Fonctionnaire[] = [];
  const tousLesPostes: PosteOrganisme[] = [];

  // Aplatir tous les postes
  postesParOrganisme.forEach(postes => {
    tousLesPostes.push(...postes);
  });

  // Trier les postes par priorité (niveau 1 d'abord)
  const postesTriees = [...tousLesPostes].sort((a, b) => a.niveau - b.niveau);

  // Trier les fonctionnaires par grade (A1 d'abord)
  const fonctionnairesTriees = [...fonctionnaires].sort((a, b) => {
    const gradeOrder = { 'A1': 0, 'A2': 1, 'B1': 2, 'B2': 3, 'C': 4 };
    return gradeOrder[a.grade] - gradeOrder[b.grade];
  });

  // Map pour suivre les postes occupés
  const postesOccupesMap = new Map<string, boolean>();

  // Affecter les fonctionnaires aux postes selon leur grade
  for (const fonctionnaire of fonctionnairesTriees) {
    let posteAttribue = false;

    for (const poste of postesTriees) {
      // Vérifier si le poste est compatible avec le grade
      const posteRef = getPosteReference(poste.poste_id);
      if (!posteRef || postesOccupesMap.has(poste.id)) continue;

      const gradeCompatible = posteRef.grade_requis?.includes(fonctionnaire.grade);

      if (gradeCompatible) {
        // Créer le compte actif
        const compte: CompteActif = {
          id: `compte_${fonctionnaire.id}_${poste.id}`,
          fonctionnaire_id: fonctionnaire.id,
          fonctionnaire_nom_complet: `${fonctionnaire.prenom} ${fonctionnaire.nom}`,
          poste_id: poste.id,
          poste_titre: poste.poste_titre,
          organisme_code: poste.organisme_code,
          organisme_nom: ORGANISMES_PUBLICS.find(o => o.code === poste.organisme_code)?.nom || '',

          role_systeme: determinerRoleSysteme(poste.poste_code),

          date_affectation: new Date(),
          statut: 'ACTIF',

          permissions: genererPermissions(poste.niveau),
          dernier_acces: new Date()
        };

        comptes.push(compte);

        // Mettre à jour le fonctionnaire
        fonctionnaire.statut = 'EN_POSTE';
        fonctionnaire.poste_actuel = {
          organisme_code: poste.organisme_code,
          poste_id: poste.id,
          poste_titre: poste.poste_titre,
          date_affectation: new Date()
        };

        // Mettre à jour le poste
        poste.statut = 'OCCUPE';
        poste.titulaire_id = fonctionnaire.id;

        postesOccupesMap.set(poste.id, true);
        fonctionnairesEnPoste.push(fonctionnaire);
        posteAttribue = true;
        break;
      }
    }

    if (!posteAttribue) {
      fonctionnairesEnAttente.push(fonctionnaire);
    }
  }

  // Séparer les postes occupés et vacants
  const postesOccupes = tousLesPostes.filter(p => p.statut === 'OCCUPE');
  const postesVacants = tousLesPostes.filter(p => p.statut === 'VACANT');

  return {
    comptes,
    postesOccupes,
    postesVacants,
    fonctionnairesEnAttente,
    fonctionnairesEnPoste
  };
}

/**
 * Obtenir la référence d'un poste
 */
function getPosteReference(posteId: string): PosteAdministratif | undefined {
  const tousLesPostes = [...Object.values(POSTES_PAR_TYPE).flat(), ...POSTES_COMMUNS];
  return tousLesPostes.find(p => p.id === posteId);
}

/**
 * Déterminer le rôle système selon le code du poste
 */
function determinerRoleSysteme(codePoste: string): 'ADMIN' | 'USER' | 'RECEPTIONIST' | 'MANAGER' {
  if (['MIN', 'DG', 'PDG', 'GOUV', 'PREF', 'MAIRE', 'RECT', 'PRES-AR'].includes(codePoste)) {
    return 'ADMIN';
  }
  if (['SG', 'DC', 'DGA', 'VR'].includes(codePoste)) {
    return 'MANAGER';
  }
  if (codePoste === 'RECEP') {
    return 'RECEPTIONIST';
  }
  return 'USER';
}

/**
 * Générer les permissions selon le niveau
 */
function genererPermissions(niveau: number): string[] {
  const permissions: string[] = ['lecture'];

  if (niveau === 1) {
    permissions.push('ecriture', 'suppression', 'validation', 'administration');
  } else if (niveau === 2) {
    permissions.push('ecriture', 'validation');
  } else {
    permissions.push('ecriture_limitee');
  }

  return permissions;
}

// ==================== SYSTÈME RH COMPLET ====================

export interface SystemeRHComplet {
  // Données de base
  organismes: OrganismePublic[];
  postes_references: PosteAdministratif[]; // Catalogue des postes

  // Postes dans les organismes
  postes_par_organisme: Map<string, PosteOrganisme[]>;
  total_postes: number;
  postes_occupes: PosteOrganisme[];
  postes_vacants: PosteOrganisme[];

  // Ressources humaines
  fonctionnaires: Fonctionnaire[];
  fonctionnaires_en_poste: Fonctionnaire[];
  fonctionnaires_en_attente: Fonctionnaire[];

  // Comptes actifs
  comptes_actifs: CompteActif[];

  // Statistiques
  statistiques: {
    total_organismes: number;
    total_postes: number;
    postes_occupes: number;
    postes_vacants: number;
    taux_occupation: number;

    total_fonctionnaires: number;
    fonctionnaires_en_poste: number;
    fonctionnaires_en_attente: number;
    fonctionnaires_detaches: number;

    repartition_grades: Record<string, number>;
    repartition_roles: Record<string, number>;

    organismes_critiques: string[]; // Organismes avec trop de postes vacants
    besoins_recrutement: {
      type_poste: string;
      nombre: number;
      priorite: 'HAUTE' | 'MOYENNE' | 'BASSE';
    }[];
  };
}

/**
 * Initialiser le système RH complet
 */
export async function initialiserSystemeRH(): Promise<SystemeRHComplet> {
  console.log('🚀 Initialisation du système RH gabonais...');

  // 1. Créer tous les postes pour chaque organisme
  const postesParOrganisme = new Map<string, PosteOrganisme[]>();
  let totalPostes = 0;

  for (const organisme of ORGANISMES_PUBLICS) {
    const postesOrganisme = creerPostesOrganisme(organisme);
    postesParOrganisme.set(organisme.code, postesOrganisme);
    totalPostes += postesOrganisme.length;
  }

  console.log(`📋 ${totalPostes} postes créés dans ${ORGANISMES_PUBLICS.length} organismes`);

  // 2. Créer les fonctionnaires (environ 70% du nombre de postes)
  const nombreFonctionnaires = Math.floor(totalPostes * 0.7);
  const fonctionnaires = creerFonctionnaires(nombreFonctionnaires);

  console.log(`👥 ${fonctionnaires.length} fonctionnaires créés`);

  // 3. Affecter les fonctionnaires aux postes
  const affectations = affecterFonctionnairesAuxPostes(fonctionnaires, postesParOrganisme);

  console.log(`✅ ${affectations.comptes.length} comptes actifs créés`);
  console.log(`📊 ${affectations.postesVacants.length} postes vacants (offres d'emploi)`);
  console.log(`⏳ ${affectations.fonctionnairesEnAttente.length} fonctionnaires en attente d'affectation`);

  // 4. Calculer les statistiques
  const repartitionGrades: Record<string, number> = {};
  const repartitionRoles: Record<string, number> = {};

  fonctionnaires.forEach(f => {
    repartitionGrades[f.grade] = (repartitionGrades[f.grade] || 0) + 1;
  });

  affectations.comptes.forEach(c => {
    repartitionRoles[c.role_systeme] = (repartitionRoles[c.role_systeme] || 0) + 1;
  });

  // Identifier les organismes critiques (>50% postes vacants)
  const organismesCritiques: string[] = [];
  postesParOrganisme.forEach((postes, orgCode) => {
    const vacants = postes.filter(p => p.statut === 'VACANT').length;
    if (vacants / postes.length > 0.5) {
      organismesCritiques.push(orgCode);
    }
  });

  // Analyser les besoins de recrutement
  const besoinsMap = new Map<string, number>();
  affectations.postesVacants.forEach(p => {
    besoinsMap.set(p.poste_code, (besoinsMap.get(p.poste_code) || 0) + 1);
  });

  const besoinsRecrutement = Array.from(besoinsMap.entries())
    .map(([type, nombre]) => ({
      type_poste: type,
      nombre: nombre,
      priorite: nombre > 10 ? 'HAUTE' : nombre > 5 ? 'MOYENNE' : 'BASSE' as any
    }))
    .sort((a, b) => b.nombre - a.nombre);

  return {
    organismes: ORGANISMES_PUBLICS,
    postes_references: [...Object.values(POSTES_PAR_TYPE).flat(), ...POSTES_COMMUNS],

    postes_par_organisme: postesParOrganisme,
    total_postes: totalPostes,
    postes_occupes: affectations.postesOccupes,
    postes_vacants: affectations.postesVacants,

    fonctionnaires: fonctionnaires,
    fonctionnaires_en_poste: affectations.fonctionnairesEnPoste,
    fonctionnaires_en_attente: affectations.fonctionnairesEnAttente,

    comptes_actifs: affectations.comptes,

    statistiques: {
      total_organismes: ORGANISMES_PUBLICS.length,
      total_postes: totalPostes,
      postes_occupes: affectations.postesOccupes.length,
      postes_vacants: affectations.postesVacants.length,
      taux_occupation: Math.round((affectations.postesOccupes.length / totalPostes) * 100),

      total_fonctionnaires: fonctionnaires.length,
      fonctionnaires_en_poste: affectations.fonctionnairesEnPoste.length,
      fonctionnaires_en_attente: affectations.fonctionnairesEnAttente.length,
      fonctionnaires_detaches: 0,

      repartition_grades: repartitionGrades,
      repartition_roles: repartitionRoles,

      organismes_critiques: organismesCritiques,
      besoins_recrutement: besoinsRecrutement.slice(0, 10)
    }
  };
}

// ==================== FONCTIONS UTILITAIRES ====================

/**
 * Rechercher des postes vacants selon des critères
 */
export function rechercherPostesVacants(
  systeme: SystemeRHComplet,
  criteres: {
    organisme_code?: string;
    niveau?: number;
    grade_requis?: string;
    salaire_min?: number;
  }
): PosteOrganisme[] {
  let resultats = systeme.postes_vacants;

  if (criteres.organisme_code) {
    resultats = resultats.filter(p => p.organisme_code === criteres.organisme_code);
  }

  if (criteres.niveau) {
    resultats = resultats.filter(p => p.niveau === criteres.niveau);
  }

  if (criteres.salaire_min) {
    resultats = resultats.filter(p => (p.salaire_base || 0) >= criteres.salaire_min);
  }

  return resultats;
}

/**
 * Proposer des affectations pour les fonctionnaires en attente
 */
export function proposerAffectations(
  systeme: SystemeRHComplet
): Array<{
  fonctionnaire: Fonctionnaire;
  postes_proposes: PosteOrganisme[];
}> {
  const propositions = [];

  for (const fonctionnaire of systeme.fonctionnaires_en_attente) {
    const postesCompatibles = systeme.postes_vacants.filter(poste => {
      const posteRef = getPosteReference(poste.poste_id);
      return posteRef?.grade_requis?.includes(fonctionnaire.grade);
    });

    if (postesCompatibles.length > 0) {
      propositions.push({
        fonctionnaire,
        postes_proposes: postesCompatibles.slice(0, 5) // Top 5 propositions
      });
    }
  }

  return propositions;
}

/**
 * Générer un rapport RH
 */
export function genererRapportRH(systeme: SystemeRHComplet) {
  return {
    "📊 VUE D'ENSEMBLE": {
      "Total organismes": systeme.statistiques.total_organismes,
      "Total postes": systeme.statistiques.total_postes,
      "Total fonctionnaires": systeme.statistiques.total_fonctionnaires
    },

    "📋 SITUATION DES POSTES": {
      "Postes occupés": `${systeme.statistiques.postes_occupes} (${systeme.statistiques.taux_occupation}%)`,
      "Postes vacants": systeme.statistiques.postes_vacants,
      "Organismes en sous-effectif": systeme.statistiques.organismes_critiques.length
    },

    "👥 RESSOURCES HUMAINES": {
      "Fonctionnaires en poste": systeme.statistiques.fonctionnaires_en_poste,
      "En attente d'affectation": systeme.statistiques.fonctionnaires_en_attente,
      "Comptes actifs": systeme.comptes_actifs.length
    },

    "📈 BESOINS PRIORITAIRES": systeme.statistiques.besoins_recrutement.slice(0, 5).map(b =>
      `${b.type_poste}: ${b.nombre} postes (priorité ${b.priorite})`
    ),

    "⚠️ ALERTES": [
      systeme.statistiques.organismes_critiques.length > 0
        ? `${systeme.statistiques.organismes_critiques.length} organismes avec >50% postes vacants`
        : "Aucune alerte",
      systeme.statistiques.fonctionnaires_en_attente > 100
        ? `${systeme.statistiques.fonctionnaires_en_attente} fonctionnaires en attente d'affectation`
        : null
    ].filter(Boolean)
  };
}

// ==================== EXPORTS ====================

export default {
  initialiserSystemeRH,
  rechercherPostesVacants,
  proposerAffectations,
  genererRapportRH
};
