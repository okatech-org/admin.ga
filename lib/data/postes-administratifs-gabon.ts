/**
 * Génération automatique de comptes utilisateurs pour les organismes gabonais
 * Basé sur la hiérarchie administrative officielle du Gabon
 */

// Interface pour les comptes utilisateurs générés
export interface CompteUtilisateur {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  phone: string;
  role: 'ADMIN' | 'MANAGER' | 'AGENT';
  poste: string;
  niveau: number;
  organismeId: string;
  dateCreation: string;
}

// Interface pour les organismes
interface Organisme {
  code: string;
  nom: string;
  type: string;
  ville: string;
  isActive: boolean;
}

// Configuration des postes par type d'organisme
export const POSTES_PAR_TYPE_ORGANISME = {
  MINISTERE: [
    { poste: 'Directeur Général', role: 'ADMIN', niveau: 1 },
    { poste: 'Secrétaire Général', role: 'ADMIN', niveau: 2 },
    { poste: 'Directeur Central', role: 'MANAGER', niveau: 3 },
    { poste: 'Chef de Service', role: 'MANAGER', niveau: 4 },
    { poste: 'Chef de Bureau', role: 'AGENT', niveau: 5 },
    { poste: 'Agent Principal', role: 'AGENT', niveau: 6 }
  ],
  PREFECTURE: [
    { poste: 'Préfet', role: 'ADMIN', niveau: 1 },
    { poste: 'Secrétaire Général', role: 'MANAGER', niveau: 2 },
    { poste: 'Chef de Service', role: 'MANAGER', niveau: 3 },
    { poste: 'Agent Administratif', role: 'AGENT', niveau: 4 }
  ],
  MAIRIE: [
    { poste: 'Maire', role: 'ADMIN', niveau: 1 },
    { poste: 'Secrétaire Général', role: 'MANAGER', niveau: 2 },
    { poste: 'Directeur des Services', role: 'MANAGER', niveau: 3 },
    { poste: 'Chef de Service', role: 'AGENT', niveau: 4 },
    { poste: 'Agent Municipal', role: 'AGENT', niveau: 5 }
  ],
  ETABLISSEMENT_PUBLIC: [
    { poste: 'Directeur Général', role: 'ADMIN', niveau: 1 },
    { poste: 'Directeur Adjoint', role: 'MANAGER', niveau: 2 },
    { poste: 'Chef de Département', role: 'MANAGER', niveau: 3 },
    { poste: 'Agent Technique', role: 'AGENT', niveau: 4 }
  ],
  AGENCE: [
    { poste: 'Directeur', role: 'ADMIN', niveau: 1 },
    { poste: 'Directeur Adjoint', role: 'MANAGER', niveau: 2 },
    { poste: 'Chef de Service', role: 'MANAGER', niveau: 3 },
    { poste: 'Agent', role: 'AGENT', niveau: 4 }
  ]
};

// Noms gabonais pour la génération réaliste
const PRENOMS_GABONAIS = {
  masculins: [
    'Alain', 'Bruno', 'Christian', 'Daniel', 'Emmanuel', 'François', 'Georges', 'Henri',
    'Jacques', 'Jean', 'Marcel', 'Michel', 'Pascal', 'Paul', 'Pierre', 'Robert',
    'Serge', 'Thierry', 'Vincent', 'Yves', 'Brice', 'Cédric', 'David', 'Eric',
    'Gaël', 'Hervé', 'Igor', 'Joël', 'Kevin', 'Laurent', 'Marc', 'Nicolas',
    'Olivier', 'Patrick', 'Quentin', 'Rémi', 'Stéphane', 'Thomas', 'Urbain', 'William'
  ],
  feminins: [
    'Alice', 'Brigitte', 'Catherine', 'Denise', 'Elisabeth', 'Françoise', 'Georgette', 'Hélène',
    'Irène', 'Jeanne', 'Karine', 'Louise', 'Marie', 'Nicole', 'Odette', 'Pauline',
    'Rose', 'Sylvie', 'Thérèse', 'Véronique', 'Yvette', 'Agnès', 'Béatrice', 'Claudine',
    'Dominique', 'Eugénie', 'Fabienne', 'Gabrielle', 'Henriette', 'Isabelle', 'Jacqueline',
    'Laure', 'Michèle', 'Nathalie', 'Pascale', 'Rachel', 'Sophie', 'Valérie', 'Amélie', 'Céline'
  ]
};

const NOMS_GABONAIS = [
  'ADZAGBO', 'AKAGHA', 'AKENDENGUE', 'ALLOGHO', 'ANDEME', 'ANYOUZOU', 'ASSENG', 'ASSOUMOU',
  'AUBAME', 'AVARO', 'AYECABA', 'BONGO', 'BOUSSOUGOU', 'DAMAS', 'DITUTALA', 'DJEMBA',
  'EKOMI', 'ELLA', 'FANG', 'KOUMBA', 'LECKAT', 'MABIKA', 'MAKAYA', 'MATSANGA',
  'MAYER', 'MBADINGA', 'MBOUMBA', 'MEBIAME', 'MENDAME', 'MINTSA', 'MOUBAMBA', 'MOUENDI',
  'MOUSSOUNDA', 'MOUTELET', 'MVOMO', 'NDONG', 'NGOUA', 'NGUEMA', 'NKOGHE', 'NTOUTOUME',
  'OBAMA', 'OBAME', 'ONDO', 'OSSA', 'OYANE', 'TCHOUMOU', 'TOUNG', 'YEMBIT'
];

// Fonction pour générer un nom réaliste
function genererNomComplet(): { prenom: string; nom: string } {
  const estMasculin = Math.random() > 0.5;
  const prenoms = estMasculin ? PRENOMS_GABONAIS.masculins : PRENOMS_GABONAIS.feminins;

  const prenom = prenoms[Math.floor(Math.random() * prenoms.length)];
  const nom = NOMS_GABONAIS[Math.floor(Math.random() * NOMS_GABONAIS.length)];

  return { prenom, nom };
}

// Fonction pour générer un email professionnel
function genererEmail(prenom: string, nom: string, organismeCode: string): string {
  const prenomClean = prenom.toLowerCase().replace(/[àáâãäå]/g, 'a').replace(/[èéêë]/g, 'e');
  const nomClean = nom.toLowerCase().replace(/[àáâãäå]/g, 'a').replace(/[èéêë]/g, 'e');
  return `${prenomClean}.${nomClean}@${organismeCode.toLowerCase()}.gov.ga`;
}

// Fonction pour générer un numéro de téléphone gabonais
function genererTelephone(): string {
  const prefixes = ['01', '02', '05', '06', '07'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const numero = Math.floor(Math.random() * 900000) + 100000; // 6 chiffres
  return `+241 ${prefix} ${numero.toString().substring(0, 2)} ${numero.toString().substring(2, 4)} ${numero.toString().substring(4, 6)}`;
}

// Fonction pour déterminer le type d'organisme basé sur le nom
function determinerTypeOrganisme(nomOrganisme: string): keyof typeof POSTES_PAR_TYPE_ORGANISME {
  const nom = nomOrganisme.toLowerCase();

  if (nom.includes('ministère') || nom.includes('ministre')) {
    return 'MINISTERE';
  } else if (nom.includes('préfecture') || nom.includes('préfet')) {
    return 'PREFECTURE';
  } else if (nom.includes('mairie') || nom.includes('maire') || nom.includes('commune')) {
    return 'MAIRIE';
  } else if (nom.includes('agence') || nom.includes('office')) {
    return 'AGENCE';
  } else {
    return 'ETABLISSEMENT_PUBLIC';
  }
}

/**
 * Génère des comptes utilisateurs pour un organisme spécifique
 */
export function genererComptesParOrganisme(organisme: Organisme): CompteUtilisateur[] {
  const typeOrganisme = determinerTypeOrganisme(organisme.nom);
  const postesConfig = POSTES_PAR_TYPE_ORGANISME[typeOrganisme];

  const comptes: CompteUtilisateur[] = [];
  const dateCreation = new Date().toISOString();

  postesConfig.forEach((config, index) => {
    const { prenom, nom } = genererNomComplet();
    const email = genererEmail(prenom, nom, organisme.code);
    const phone = genererTelephone();

    comptes.push({
      id: `${organisme.code}-${index + 1}`,
      nom,
      prenom,
      email,
      phone,
      role: config.role,
      poste: config.poste,
      niveau: config.niveau,
      organismeId: organisme.code,
      dateCreation
    });
  });

  return comptes;
}

/**
 * Génère des comptes pour tous les organismes fournis
 */
export function genererTousLesComptes(organismes: Organisme[]): CompteUtilisateur[] {
  const tousLesComptes: CompteUtilisateur[] = [];

  organismes.forEach(organisme => {
    if (organisme.isActive) {
      const comptesOrganisme = genererComptesParOrganisme(organisme);
      tousLesComptes.push(...comptesOrganisme);
    }
  });

  return tousLesComptes;
}

/**
 * Calcule les statistiques des comptes générés
 */
export function getStatistiquesComptes(comptes: CompteUtilisateur[]) {
  const total = comptes.length;
  const parRole = comptes.reduce((acc, compte) => {
    acc[compte.role] = (acc[compte.role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const parOrganisme = comptes.reduce((acc, compte) => {
    acc[compte.organismeId] = (acc[compte.organismeId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    total,
    parRole,
    parOrganisme,
    moyenneParOrganisme: Math.round(total / Object.keys(parOrganisme).length) || 0
  };
}
