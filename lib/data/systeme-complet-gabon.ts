// ===== SYSTÈME COMPLET DE GESTION DES COMPTES ET POSTES ADMINISTRATIFS GABONAIS =====
// ===== INTÉGRATION COMPLÈTE DES 141 ORGANISMES OFFICIELS =====

// Import des 141 organismes officiels gabonais
import { getOrganismesComplets, OrganismeGabonais } from './gabon-organismes-141';

// ==================== PARTIE 1: TYPES ET INTERFACES ====================

interface OrganismePublic {
  id: string;
  code: string;
  nom: string;
  type: TypeOrganisme;
  statut: 'ACTIF' | 'INACTIF';
  email_contact: string;
  telephone?: string;
  adresse?: string;
  logo?: string;
  couleur_principale?: string;
  site_web?: string;
  description?: string;
}

interface PosteAdministratif {
  id: string;
  titre: string;
  code: string;
  niveau: 1 | 2 | 3; // 1: Direction, 2: Encadrement, 3: Exécution
  grade_requis: Grade[];
  organisme_types: TypeOrganisme[];
  salaire_base?: number;
  description?: string;
  responsabilites: string[];
  prerequis: string[];
}

interface UtilisateurOrganisme {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  role: 'ADMIN' | 'USER' | 'RECEPTIONIST';
  poste_id: string;
  poste_titre: string;
  organisme_code: string;
  titre_honorifique?: string;
  telephone?: string;
  statut: 'ACTIF' | 'INACTIF';
  date_creation: Date;
  mot_de_passe?: string; // Hash en production
}

type TypeOrganisme =
  | 'INSTITUTION_SUPREME'
  | 'MINISTERE'
  | 'DIRECTION_GENERALE'
  | 'ETABLISSEMENT_PUBLIC'
  | 'ENTREPRISE_PUBLIQUE'
  | 'ETABLISSEMENT_SANTE'
  | 'UNIVERSITE'
  | 'GOUVERNORAT'
  | 'PREFECTURE'
  | 'MAIRIE'
  | 'AUTORITE_REGULATION'
  | 'FORCE_SECURITE';

type Grade = 'A1' | 'A2' | 'B1' | 'B2' | 'C';

// ==================== PARTIE 2: DONNÉES DES POSTES ADMINISTRATIFS ====================

const GRADES_FONCTION_PUBLIQUE: Record<Grade, { nom: string; salaire_base: number }> = {
  A1: { nom: 'Cadres supérieurs', salaire_base: 850000 },
  A2: { nom: 'Cadres moyens', salaire_base: 650000 },
  B1: { nom: 'Agents de maîtrise', salaire_base: 450000 },
  B2: { nom: 'Agents qualifiés', salaire_base: 350000 },
  C: { nom: 'Agents d\'exécution', salaire_base: 250000 }
};

const POSTES_PAR_TYPE: Record<TypeOrganisme, PosteAdministratif[]> = {
  INSTITUTION_SUPREME: [
    {
      id: 'pres_01',
      titre: 'Président de la République',
      code: 'PR',
      niveau: 1,
      grade_requis: ['A1'],
      organisme_types: ['INSTITUTION_SUPREME'],
      responsabilites: ['Chef de l\'État', 'Garant des institutions'],
      prerequis: ['Élu au suffrage universel']
    },
    {
      id: 'vp_01',
      titre: 'Vice-Président',
      code: 'VP',
      niveau: 1,
      grade_requis: ['A1'],
      organisme_types: ['INSTITUTION_SUPREME'],
      responsabilites: ['Suppléance du Président', 'Missions spéciales'],
      prerequis: ['Nomination par le Président']
    },
    {
      id: 'pm_01',
      titre: 'Premier Ministre',
      code: 'PM',
      niveau: 1,
      grade_requis: ['A1'],
      organisme_types: ['INSTITUTION_SUPREME'],
      responsabilites: ['Chef du Gouvernement', 'Coordination de l\'action gouvernementale'],
      prerequis: ['Nomination par le Président']
    }
  ],

  MINISTERE: [
    {
      id: 'min_01',
      titre: 'Ministre',
      code: 'MIN',
      niveau: 1,
      grade_requis: ['A1'],
      organisme_types: ['MINISTERE'],
      salaire_base: 1500000,
      responsabilites: ['Direction du ministère', 'Politique sectorielle'],
      prerequis: ['Nomination en Conseil des ministres']
    },
    {
      id: 'sg_01',
      titre: 'Secrétaire Général',
      code: 'SG',
      niveau: 1,
      grade_requis: ['A1'],
      organisme_types: ['MINISTERE', 'DIRECTION_GENERALE'],
      salaire_base: 950000,
      responsabilites: ['Administration du ministère', 'Coordination des directions'],
      prerequis: ['ENA', 'Concours A+', '10+ ans expérience']
    },
    {
      id: 'dc_01',
      titre: 'Directeur de Cabinet',
      code: 'DC',
      niveau: 1,
      grade_requis: ['A1'],
      organisme_types: ['MINISTERE'],
      salaire_base: 900000,
      responsabilites: ['Coordination politique', 'Interface ministérielle'],
      prerequis: ['Formation supérieure', '8+ ans expérience']
    },
    {
      id: 'ct_01',
      titre: 'Conseiller Technique',
      code: 'CT',
      niveau: 2,
      grade_requis: ['A1', 'A2'],
      organisme_types: ['MINISTERE'],
      salaire_base: 750000,
      responsabilites: ['Expertise technique', 'Études et analyses'],
      prerequis: ['Expertise sectorielle', '6+ ans expérience']
    },
    {
      id: 'dir_01',
      titre: 'Directeur',
      code: 'DIR',
      niveau: 2,
      grade_requis: ['A1', 'A2'],
      organisme_types: ['MINISTERE', 'DIRECTION_GENERALE'],
      salaire_base: 700000,
      responsabilites: ['Direction d\'un service', 'Mise en œuvre opérationnelle'],
      prerequis: ['Formation supérieure', 'Concours A', '5+ ans expérience']
    },
    {
      id: 'cs_01',
      titre: 'Chef de Service',
      code: 'CS',
      niveau: 2,
      grade_requis: ['A2', 'B1'],
      organisme_types: ['MINISTERE', 'DIRECTION_GENERALE'],
      salaire_base: 600000,
      responsabilites: ['Gestion d\'un service', 'Encadrement d\'équipe'],
      prerequis: ['Formation technique', 'Concours B+', '4+ ans expérience']
    },
    {
      id: 'insp_01',
      titre: 'Inspecteur',
      code: 'INSP',
      niveau: 2,
      grade_requis: ['A2', 'B1'],
      organisme_types: ['MINISTERE'],
      salaire_base: 650000,
      responsabilites: ['Contrôle et inspection', 'Audit interne'],
      prerequis: ['Formation spécialisée', '5+ ans expérience']
    }
  ],

  DIRECTION_GENERALE: [
    {
      id: 'dg_01',
      titre: 'Directeur Général',
      code: 'DG',
      niveau: 1,
      grade_requis: ['A1'],
      organisme_types: ['DIRECTION_GENERALE', 'ETABLISSEMENT_PUBLIC', 'ENTREPRISE_PUBLIQUE'],
      salaire_base: 1200000,
      responsabilites: ['Direction de l\'établissement', 'Stratégie et politique'],
      prerequis: ['ENA ou équivalent', 'Nomination', '10+ ans expérience']
    },
    {
      id: 'dga_01',
      titre: 'Directeur Général Adjoint',
      code: 'DGA',
      niveau: 1,
      grade_requis: ['A1'],
      organisme_types: ['DIRECTION_GENERALE', 'ETABLISSEMENT_PUBLIC'],
      salaire_base: 1000000,
      responsabilites: ['Assistance au DG', 'Coordination opérationnelle'],
      prerequis: ['Formation supérieure', '8+ ans expérience']
    },
    {
      id: 'dd_01',
      titre: 'Directeur de Département',
      code: 'DD',
      niveau: 2,
      grade_requis: ['A1', 'A2'],
      organisme_types: ['DIRECTION_GENERALE'],
      salaire_base: 750000,
      responsabilites: ['Direction département technique', 'Expertise sectorielle'],
      prerequis: ['Formation spécialisée', '6+ ans expérience']
    }
  ],

  ETABLISSEMENT_PUBLIC: [
    {
      id: 'pca_01',
      titre: 'Président du Conseil d\'Administration',
      code: 'PCA',
      niveau: 1,
      grade_requis: ['A1'],
      organisme_types: ['ETABLISSEMENT_PUBLIC', 'ENTREPRISE_PUBLIQUE'],
      responsabilites: ['Présidence du CA', 'Orientations stratégiques'],
      prerequis: ['Nomination gouvernementale']
    },
    {
      id: 'com_01',
      titre: 'Commissaire Général',
      code: 'COM',
      niveau: 1,
      grade_requis: ['A1'],
      organisme_types: ['ETABLISSEMENT_PUBLIC'],
      salaire_base: 1100000,
      responsabilites: ['Direction générale', 'Mise en œuvre politique'],
      prerequis: ['Expertise reconnue', 'Nomination']
    },
    {
      id: 'se_01',
      titre: 'Secrétaire Exécutif',
      code: 'SE',
      niveau: 1,
      grade_requis: ['A1'],
      organisme_types: ['ETABLISSEMENT_PUBLIC'],
      salaire_base: 1000000,
      responsabilites: ['Coordination exécutive', 'Gestion quotidienne'],
      prerequis: ['Formation supérieure', 'Expérience direction']
    }
  ],

  ENTREPRISE_PUBLIQUE: [
    {
      id: 'pdg_01',
      titre: 'Président Directeur Général',
      code: 'PDG',
      niveau: 1,
      grade_requis: ['A1'],
      organisme_types: ['ENTREPRISE_PUBLIQUE'],
      salaire_base: 1500000,
      responsabilites: ['Direction générale', 'Stratégie d\'entreprise'],
      prerequis: ['Expérience direction entreprise', 'Nomination CA']
    },
    {
      id: 'adg_01',
      titre: 'Administrateur Directeur Général',
      code: 'ADG',
      niveau: 1,
      grade_requis: ['A1'],
      organisme_types: ['ENTREPRISE_PUBLIQUE'],
      salaire_base: 1400000,
      responsabilites: ['Administration et direction', 'Gestion opérationnelle'],
      prerequis: ['Formation gestion', 'Expérience entreprise']
    }
  ],

  GOUVERNORAT: [
    {
      id: 'gouv_01',
      titre: 'Gouverneur',
      code: 'GOUV',
      niveau: 1,
      grade_requis: ['A1'],
      organisme_types: ['GOUVERNORAT'],
      salaire_base: 1200000,
      responsabilites: ['Représentant de l\'État', 'Coordination provinciale'],
      prerequis: ['Préfet ou équivalent', 'Nomination Conseil des ministres']
    },
    {
      id: 'sg_gouv_01',
      titre: 'Secrétaire Général du Gouvernorat',
      code: 'SG-GOUV',
      niveau: 1,
      grade_requis: ['A1'],
      organisme_types: ['GOUVERNORAT'],
      salaire_base: 900000,
      responsabilites: ['Administration gouvernorat', 'Suppléance gouverneur'],
      prerequis: ['ENA', '10+ ans expérience']
    }
  ],

  PREFECTURE: [
    {
      id: 'pref_01',
      titre: 'Préfet',
      code: 'PREF',
      niveau: 1,
      grade_requis: ['A1'],
      organisme_types: ['PREFECTURE'],
      salaire_base: 950000,
      responsabilites: ['Représentant État département', 'Application lois'],
      prerequis: ['ENA', 'Concours A+', '8+ ans expérience']
    },
    {
      id: 'sg_pref_01',
      titre: 'Secrétaire Général de Préfecture',
      code: 'SG-PREF',
      niveau: 1,
      grade_requis: ['A2'],
      organisme_types: ['PREFECTURE'],
      salaire_base: 700000,
      responsabilites: ['Administration préfecture', 'Gestion services'],
      prerequis: ['Formation supérieure', '6+ ans expérience']
    }
  ],

  MAIRIE: [
    {
      id: 'maire_01',
      titre: 'Maire',
      code: 'MAIRE',
      niveau: 1,
      grade_requis: ['A1'],
      organisme_types: ['MAIRIE'],
      responsabilites: ['Direction commune', 'Exécution délibérations'],
      prerequis: ['Élu au suffrage universel']
    },
    {
      id: 'sg_mairie_01',
      titre: 'Secrétaire Général de Mairie',
      code: 'SG-MAIRIE',
      niveau: 1,
      grade_requis: ['A2', 'B1'],
      organisme_types: ['MAIRIE'],
      salaire_base: 650000,
      responsabilites: ['Administration municipale', 'Coordination services'],
      prerequis: ['Formation administrative', '5+ ans expérience']
    },
    {
      id: 'dst_01',
      titre: 'Directeur des Services Techniques',
      code: 'DST',
      niveau: 2,
      grade_requis: ['A2', 'B1'],
      organisme_types: ['MAIRIE'],
      salaire_base: 600000,
      responsabilites: ['Services techniques', 'Travaux municipaux'],
      prerequis: ['Formation technique', 'Expérience travaux publics']
    }
  ],

  ETABLISSEMENT_SANTE: [
    {
      id: 'dg_hop_01',
      titre: 'Directeur Général',
      code: 'DG-HOP',
      niveau: 1,
      grade_requis: ['A1'],
      organisme_types: ['ETABLISSEMENT_SANTE'],
      salaire_base: 1100000,
      responsabilites: ['Direction hôpital', 'Gestion établissement'],
      prerequis: ['Médecin ou administrateur santé', '10+ ans expérience']
    },
    {
      id: 'med_chef_01',
      titre: 'Médecin Chef',
      code: 'MED-CHEF',
      niveau: 2,
      grade_requis: ['A1'],
      organisme_types: ['ETABLISSEMENT_SANTE'],
      salaire_base: 900000,
      responsabilites: ['Direction médicale', 'Coordination soins'],
      prerequis: ['Doctorat médecine', 'Spécialisation', '8+ ans pratique']
    }
  ],

  UNIVERSITE: [
    {
      id: 'rect_01',
      titre: 'Recteur',
      code: 'RECT',
      niveau: 1,
      grade_requis: ['A1'],
      organisme_types: ['UNIVERSITE'],
      salaire_base: 1300000,
      responsabilites: ['Direction université', 'Politique académique'],
      prerequis: ['Professeur titulaire', 'Élection conseil']
    },
    {
      id: 'vr_01',
      titre: 'Vice-Recteur',
      code: 'VR',
      niveau: 1,
      grade_requis: ['A1'],
      organisme_types: ['UNIVERSITE'],
      salaire_base: 1100000,
      responsabilites: ['Assistance recteur', 'Domaines spécifiques'],
      prerequis: ['Professeur', 'Nomination recteur']
    }
  ],

  AUTORITE_REGULATION: [
    {
      id: 'pres_ar_01',
      titre: 'Président',
      code: 'PRES-AR',
      niveau: 1,
      grade_requis: ['A1'],
      organisme_types: ['AUTORITE_REGULATION'],
      salaire_base: 1200000,
      responsabilites: ['Direction autorité', 'Régulation sectorielle'],
      prerequis: ['Expertise reconnue', 'Nomination gouvernement']
    }
  ],

  FORCE_SECURITE: [
    {
      id: 'dg_sec_01',
      titre: 'Directeur Général',
      code: 'DG-SEC',
      niveau: 1,
      grade_requis: ['A1'],
      organisme_types: ['FORCE_SECURITE'],
      responsabilites: ['Commandement force', 'Sécurité publique'],
      prerequis: ['Officier supérieur', 'Formation commandement']
    },
    {
      id: 'com_01',
      titre: 'Commandant en Chef',
      code: 'COM-CHEF',
      niveau: 1,
      grade_requis: ['A1'],
      organisme_types: ['FORCE_SECURITE'],
      responsabilites: ['Commandement opérationnel', 'Direction stratégique'],
      prerequis: ['Général', 'Expérience commandement']
    }
  ]
};

// Postes communs à tous les organismes
const POSTES_COMMUNS: PosteAdministratif[] = [
  {
    id: 'recep_01',
    titre: 'Réceptionniste',
    code: 'RECEP',
    niveau: 3,
    grade_requis: ['B2', 'C'],
    organisme_types: ['INSTITUTION_SUPREME', 'MINISTERE', 'DIRECTION_GENERALE', 'ETABLISSEMENT_PUBLIC',
                     'ENTREPRISE_PUBLIQUE', 'ETABLISSEMENT_SANTE', 'UNIVERSITE', 'GOUVERNORAT',
                     'PREFECTURE', 'MAIRIE', 'AUTORITE_REGULATION', 'FORCE_SECURITE'],
    salaire_base: 300000,
    responsabilites: ['Accueil physique et téléphonique', 'Gestion courrier', 'Orientation visiteurs'],
    prerequis: ['Bac ou équivalent', 'Formation accueil']
  },
  {
    id: 'sec_01',
    titre: 'Secrétaire',
    code: 'SEC',
    niveau: 3,
    grade_requis: ['B2', 'C'],
    organisme_types: ['INSTITUTION_SUPREME', 'MINISTERE', 'DIRECTION_GENERALE', 'ETABLISSEMENT_PUBLIC',
                     'ENTREPRISE_PUBLIQUE', 'ETABLISSEMENT_SANTE', 'UNIVERSITE', 'GOUVERNORAT',
                     'PREFECTURE', 'MAIRIE', 'AUTORITE_REGULATION', 'FORCE_SECURITE'],
    salaire_base: 350000,
    responsabilites: ['Secrétariat', 'Gestion agenda', 'Rédaction courriers'],
    prerequis: ['Bac+2 secrétariat', 'Maîtrise bureautique']
  },
  {
    id: 'compt_01',
    titre: 'Comptable',
    code: 'COMPT',
    niveau: 3,
    grade_requis: ['B1', 'B2'],
    organisme_types: ['INSTITUTION_SUPREME', 'MINISTERE', 'DIRECTION_GENERALE', 'ETABLISSEMENT_PUBLIC',
                     'ENTREPRISE_PUBLIQUE', 'ETABLISSEMENT_SANTE', 'UNIVERSITE', 'GOUVERNORAT',
                     'PREFECTURE', 'MAIRIE', 'AUTORITE_REGULATION', 'FORCE_SECURITE'],
    salaire_base: 480000,
    responsabilites: ['Tenue comptabilité', 'Suivi budgétaire', 'Déclarations'],
    prerequis: ['BTS/DUT comptabilité', 'Expérience comptable']
  },
  {
    id: 'info_01',
    titre: 'Informaticien',
    code: 'INFO',
    niveau: 3,
    grade_requis: ['A2', 'B1'],
    organisme_types: ['INSTITUTION_SUPREME', 'MINISTERE', 'DIRECTION_GENERALE', 'ETABLISSEMENT_PUBLIC',
                     'ENTREPRISE_PUBLIQUE', 'ETABLISSEMENT_SANTE', 'UNIVERSITE', 'GOUVERNORAT',
                     'PREFECTURE', 'MAIRIE', 'AUTORITE_REGULATION', 'FORCE_SECURITE'],
    salaire_base: 650000,
    responsabilites: ['Support informatique', 'Maintenance systèmes', 'Développement'],
    prerequis: ['Licence informatique', 'Certifications techniques']
  }
];

// ==================== PARTIE 3: DONNÉES DES ORGANISMES ====================

// Fonction pour convertir les organismes gabonais en organismes publics du système
function convertirOrganismeGabonaisEnPublic(orgGabon: OrganismeGabonais): OrganismePublic {
  // Mapping des types d'organismes gabonais vers les types du système
  const mapTypeOrganisme = (type: string): TypeOrganisme => {
    if (type === 'PRESIDENCE' || type === 'VICE_PRESIDENCE_GOUVERNEMENT') return 'INSTITUTION_SUPREME';
    if (type === 'MINISTERE' || type.includes('MINISTERE')) return 'MINISTERE';
    if (type === 'DIRECTION_GENERALE' || type.includes('DIRECTION_CENTRALE')) return 'DIRECTION_GENERALE';
    if (type === 'AGENCE_SPECIALISEE') return 'ETABLISSEMENT_PUBLIC';
    if (type === 'GOUVERNORAT') return 'GOUVERNORAT';
    if (type === 'PREFECTURE') return 'PREFECTURE';
    if (type === 'MAIRIE') return 'MAIRIE';
    if (type === 'INSTITUTION_JUDICIAIRE') return 'AUTORITE_REGULATION';
    if (type === 'FORCE_SECURITE' || type === 'DEFENSE') return 'FORCE_SECURITE';
    if (type.includes('HOPITAL') || type.includes('CHU')) return 'ETABLISSEMENT_SANTE';
    if (type.includes('UNIVERSITE')) return 'UNIVERSITE';
    if (type === 'POUVOIR_LEGISLATIF') return 'AUTORITE_REGULATION';
    if (type === 'INSTITUTION_INDEPENDANTE') return 'AUTORITE_REGULATION';
    return 'ETABLISSEMENT_PUBLIC'; // Par défaut
  };

  // Générer une couleur basée sur le type
  const getCouleurPrincipale = (type: TypeOrganisme): string => {
    const couleurs: Record<string, string> = {
      'INSTITUTION_SUPREME': '#0033A0',
      'MINISTERE': '#006633',
      'DIRECTION_GENERALE': '#228B22',
      'ETABLISSEMENT_PUBLIC': '#FFD700',
      'ENTREPRISE_PUBLIQUE': '#FF8C00',
      'ETABLISSEMENT_SANTE': '#DC143C',
      'UNIVERSITE': '#4B0082',
      'GOUVERNORAT': '#2E8B57',
      'PREFECTURE': '#8B4513',
      'MAIRIE': '#5F9EA0',
      'AUTORITE_REGULATION': '#4169E1',
      'FORCE_SECURITE': '#8B0000'
    };
    return couleurs[type] || '#808080';
  };

  const type = mapTypeOrganisme(orgGabon.type);

  return {
    id: orgGabon.id,
    code: orgGabon.code,
    nom: orgGabon.name,
    type: type,
    statut: 'ACTIF',
    email_contact: orgGabon.email || `contact@${orgGabon.code.toLowerCase().replace(/_/g, '-')}.ga`,
    telephone: orgGabon.phone,
    adresse: orgGabon.address || `${orgGabon.city}, Gabon`,
    couleur_principale: getCouleurPrincipale(type),
    site_web: orgGabon.website,
    description: orgGabon.description
  };
}

// Générer les 141 organismes officiels gabonais
const ORGANISMES_141_GABONAIS = getOrganismesComplets();
const ORGANISMES_PUBLICS: OrganismePublic[] = ORGANISMES_141_GABONAIS.map(convertirOrganismeGabonaisEnPublic);

// Les 141 organismes officiels gabonais sont maintenant chargés automatiquement depuis gabon-organismes-141.ts
// Composition: 6 Institutions Suprêmes + 30 Ministères + 51 Directions Centrales + 25 Directions Générales
//            + 3 Agences Spécialisées + 4 Institutions Judiciaires + 19 Administrations Territoriales
//            + 2 Pouvoir Législatif + 1 Institution Indépendante = 141 organismes officiels

// ==================== PARTIE 4: GÉNÉRATEURS ====================

// Générateur de noms gabonais
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

// Fonction de génération d'email
function genererEmail(prenom: string, nom: string, organismeCode: string): string {
  const prenomClean = prenom.toLowerCase().replace(/[éèêë]/g, 'e').replace(/[àâä]/g, 'a').replace(/[' -]/g, '');
  const nomClean = nom.toLowerCase().replace(/[éèêë]/g, 'e').replace(/[àâä]/g, 'a').replace(/[' -]/g, '');
  const domain = organismeCode.toLowerCase().replace(/_/g, '-') + '.ga';
  return `${prenomClean}.${nomClean}@${domain}`;
}

// Fonction de génération de téléphone gabonais
function genererTelephone(): string {
  const prefixes = ['01', '02', '04', '06', '07'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const numero = Math.floor(Math.random() * 9000000) + 1000000;
  return `+241 ${prefix} ${Math.floor(numero / 10000)} ${numero % 10000}`;
}

// ==================== PARTIE 5: IMPLÉMENTATION ====================

// Fonction pour obtenir les postes compatibles avec un type d'organisme
function getPostesOrganisme(typeOrganisme: TypeOrganisme): PosteAdministratif[] {
  const postesSpecifiques = POSTES_PAR_TYPE[typeOrganisme] || [];
  return [...postesSpecifiques, ...POSTES_COMMUNS];
}

// Fonction pour créer les utilisateurs d'un organisme (optimisée pour 141 organismes)
function creerUtilisateursOrganisme(organisme: OrganismePublic, index: number): UtilisateurOrganisme[] {
  const utilisateurs: UtilisateurOrganisme[] = [];
  const postes = getPostesOrganisme(organisme.type);
  const dateCreation = new Date();

  // Déterminer le nombre d'utilisateurs selon l'importance de l'organisme
  const determinerNombreUsers = (type: TypeOrganisme): number => {
    // Organismes majeurs : 2-3 utilisateurs
    if (type === 'INSTITUTION_SUPREME' || type === 'MINISTERE') return Math.floor(Math.random() * 2) + 2;
    // Organismes moyens : 1-2 utilisateurs
    if (type === 'DIRECTION_GENERALE' || type === 'ETABLISSEMENT_PUBLIC' || type === 'ENTREPRISE_PUBLIQUE') return Math.floor(Math.random() * 2) + 1;
    // Organismes locaux : 1 utilisateur
    return 1;
  };

  // 1. Créer le compte ADMIN (dirigeant)
  const posteAdmin = postes.find(p => p.niveau === 1 && !p.titre.includes('Adjoint'));
  if (posteAdmin) {
    // Utiliser l'index pour diversifier les noms
    const prenomIndex = (index * 7) % PRENOMS_GABONAIS.masculins.length;
    const nomIndex = (index * 11) % NOMS_GABONAIS.length;
    const prenomAdmin = PRENOMS_GABONAIS.masculins[prenomIndex];
    const nomAdmin = NOMS_GABONAIS[nomIndex];

    utilisateurs.push({
      id: `user_${organisme.code}_admin`,
      nom: nomAdmin,
      prenom: prenomAdmin,
      email: genererEmail(prenomAdmin, nomAdmin, organisme.code),
      role: 'ADMIN',
      poste_id: posteAdmin.id,
      poste_titre: posteAdmin.titre,
      organisme_code: organisme.code,
      titre_honorifique: getTitreHonorifique(posteAdmin.titre),
      telephone: genererTelephone(),
      statut: 'ACTIF',
      date_creation: dateCreation,
      mot_de_passe: 'hash_password_123' // À hasher en production
    });
  }

  // 2. Créer les comptes USER (collaborateurs) - optimisé pour 141 organismes
  const postesUser = postes.filter(p => p.niveau === 2);
  const nombreUsers = Math.min(postesUser.length, determinerNombreUsers(organisme.type));

  for (let i = 0; i < nombreUsers && i < postesUser.length; i++) {
    const poste = postesUser[i];
    const estFeminin = Math.random() > 0.7;
    const prenomIndex = ((index + i) * 13) % (estFeminin ? PRENOMS_GABONAIS.feminins.length : PRENOMS_GABONAIS.masculins.length);
    const nomIndex = ((index + i) * 17) % NOMS_GABONAIS.length;
    const prenom = estFeminin
      ? PRENOMS_GABONAIS.feminins[prenomIndex]
      : PRENOMS_GABONAIS.masculins[prenomIndex];
    const nom = NOMS_GABONAIS[nomIndex];

    utilisateurs.push({
      id: `user_${organisme.code}_${i + 1}`,
      nom: nom,
      prenom: prenom,
      email: genererEmail(prenom, nom, organisme.code),
      role: 'USER',
      poste_id: poste.id,
      poste_titre: poste.titre,
      organisme_code: organisme.code,
      titre_honorifique: getTitreHonorifique(poste.titre, estFeminin),
      telephone: genererTelephone(),
      statut: 'ACTIF',
      date_creation: dateCreation,
      mot_de_passe: 'hash_password_123'
    });
  }

  // 3. Créer le compte RECEPTIONIST (obligatoire)
  const posteReceptionniste = POSTES_COMMUNS.find(p => p.code === 'RECEP')!;
  const estReceptionisteFeminin = Math.random() > 0.3; // 70% de femmes
  const recepPrenomIndex = (index * 19) % (estReceptionisteFeminin ? PRENOMS_GABONAIS.feminins.length : PRENOMS_GABONAIS.masculins.length);
  const recepNomIndex = (index * 23) % NOMS_GABONAIS.length;
  const prenomRecep = estReceptionisteFeminin
    ? PRENOMS_GABONAIS.feminins[recepPrenomIndex]
    : PRENOMS_GABONAIS.masculins[recepPrenomIndex];
  const nomRecep = NOMS_GABONAIS[recepNomIndex];

  utilisateurs.push({
    id: `user_${organisme.code}_recep`,
    nom: nomRecep,
    prenom: prenomRecep,
    email: `reception@${organisme.code.toLowerCase().replace(/_/g, '-')}.ga`,
    role: 'RECEPTIONIST',
    poste_id: posteReceptionniste.id,
    poste_titre: posteReceptionniste.titre,
    organisme_code: organisme.code,
    titre_honorifique: estReceptionisteFeminin ? 'Madame' : 'Monsieur',
    telephone: genererTelephone(),
    statut: 'ACTIF',
    date_creation: dateCreation,
    mot_de_passe: 'hash_password_123'
  });

  return utilisateurs;
}

// Fonction pour obtenir le titre honorifique
function getTitreHonorifique(posteTitle: string, estFeminin: boolean = false): string {
  if (posteTitle.includes('Président') || posteTitle.includes('Ministre')) {
    return 'Son Excellence';
  }
  if (posteTitle.includes('Gouverneur')) {
    return estFeminin ? 'Son Excellence Madame le Gouverneur' : 'Son Excellence Monsieur le Gouverneur';
  }
  if (posteTitle.includes('Directeur') && posteTitle.includes('Général')) {
    return estFeminin ? 'Madame la Directrice Générale' : 'Monsieur le Directeur Général';
  }
  if (posteTitle.includes('Recteur')) {
    return 'Professeur, Monsieur le Recteur';
  }
  if (posteTitle.includes('Général') || posteTitle.includes('Colonel')) {
    return estFeminin ? 'Madame le Général' : 'Monsieur le Général';
  }
  if (posteTitle.includes('Docteur') || posteTitle.includes('Dr')) {
    return estFeminin ? 'Docteur, Madame' : 'Docteur, Monsieur';
  }
  if (posteTitle.includes('Professeur') || posteTitle.includes('Pr')) {
    return estFeminin ? 'Professeur, Madame' : 'Professeur, Monsieur';
  }
  if (posteTitle.includes('Maire')) {
    return estFeminin ? 'Madame le Maire' : 'Monsieur le Maire';
  }
  return estFeminin ? 'Madame' : 'Monsieur';
}

// ==================== PARTIE 6: FONCTIONS D'IMPLÉMENTATION ====================

interface SystemeComplet {
  organismes: OrganismePublic[];
  postes: PosteAdministratif[];
  utilisateurs: UtilisateurOrganisme[];
  statistiques: {
    totalOrganismes: number;
    totalUtilisateurs: number;
    repartitionRoles: Record<string, number>;
    repartitionTypes: Record<TypeOrganisme, number>;
    organismesAvecAdmin: number;
    organismesAvecReceptionniste: number;
    moyenneUsersParOrganisme?: number;
  };
}

// Fonction principale d'implémentation (optimisée pour 141 organismes)
async function implementerSystemeComplet(): Promise<SystemeComplet> {
  const tousLesUtilisateurs: UtilisateurOrganisme[] = [];

  console.log(`🔄 Génération des utilisateurs pour ${ORGANISMES_PUBLICS.length} organismes...`);

  // Créer les utilisateurs pour chaque organisme avec index pour diversifier les noms
  for (let index = 0; index < ORGANISMES_PUBLICS.length; index++) {
    const organisme = ORGANISMES_PUBLICS[index];
    const utilisateursOrganisme = creerUtilisateursOrganisme(organisme, index);
    tousLesUtilisateurs.push(...utilisateursOrganisme);

    // Log de progression tous les 20 organismes
    if ((index + 1) % 20 === 0) {
      console.log(`   ✓ ${index + 1}/${ORGANISMES_PUBLICS.length} organismes traités...`);
    }
  }

  // Calculer les statistiques détaillées
  const statistiques = {
    totalOrganismes: ORGANISMES_PUBLICS.length,
    totalUtilisateurs: tousLesUtilisateurs.length,
    repartitionRoles: {
      ADMIN: tousLesUtilisateurs.filter(u => u.role === 'ADMIN').length,
      USER: tousLesUtilisateurs.filter(u => u.role === 'USER').length,
      RECEPTIONIST: tousLesUtilisateurs.filter(u => u.role === 'RECEPTIONIST').length
    },
    repartitionTypes: {} as Record<TypeOrganisme, number>,
    organismesAvecAdmin: new Set(
      tousLesUtilisateurs.filter(u => u.role === 'ADMIN').map(u => u.organisme_code)
    ).size,
    organismesAvecReceptionniste: new Set(
      tousLesUtilisateurs.filter(u => u.role === 'RECEPTIONIST').map(u => u.organisme_code)
    ).size,
    moyenneUsersParOrganisme: Math.round(tousLesUtilisateurs.length / ORGANISMES_PUBLICS.length * 10) / 10
  };

  // Calculer la répartition par type d'organisme
  for (const organisme of ORGANISMES_PUBLICS) {
    statistiques.repartitionTypes[organisme.type] =
      (statistiques.repartitionTypes[organisme.type] || 0) + 1;
  }

  console.log(`✅ Système généré: ${statistiques.totalOrganismes} organismes, ${statistiques.totalUtilisateurs} utilisateurs`);

  // Retourner le système complet
  return {
    organismes: ORGANISMES_PUBLICS,
    postes: [...Object.values(POSTES_PAR_TYPE).flat(), ...POSTES_COMMUNS],
    utilisateurs: tousLesUtilisateurs,
    statistiques
  };
}

// Fonction de validation
function validerSysteme(systeme: SystemeComplet): {
  valide: boolean;
  erreurs: string[];
} {
  const erreurs: string[] = [];

  // Vérifier que chaque organisme a un admin
  const organismesAvecAdmin = new Set(
    systeme.utilisateurs.filter(u => u.role === 'ADMIN').map(u => u.organisme_code)
  );

  for (const organisme of systeme.organismes) {
    if (!organismesAvecAdmin.has(organisme.code)) {
      erreurs.push(`Organisme ${organisme.code} n'a pas d'ADMIN`);
    }
  }

  // Vérifier que chaque organisme a un réceptionniste
  const organismesAvecReceptionniste = new Set(
    systeme.utilisateurs.filter(u => u.role === 'RECEPTIONIST').map(u => u.organisme_code)
  );

  for (const organisme of systeme.organismes) {
    if (!organismesAvecReceptionniste.has(organisme.code)) {
      erreurs.push(`Organisme ${organisme.code} n'a pas de RECEPTIONIST`);
    }
  }

  // Vérifier l'unicité des emails
  const emails = systeme.utilisateurs.map(u => u.email);
  const emailsUniques = new Set(emails);
  if (emails.length !== emailsUniques.size) {
    erreurs.push('Des emails sont en double');
  }

  return {
    valide: erreurs.length === 0,
    erreurs
  };
}

// Fonction d'export pour base de données
function exporterPourBDD(systeme: SystemeComplet) {
  return {
    // Script SQL pour les organismes
    sqlOrganismes: systeme.organismes.map(org =>
      `INSERT INTO organismes (code, nom, type, statut, email_contact, telephone, adresse, couleur_principale, site_web)
       VALUES ('${org.code}', '${org.nom}', '${org.type}', '${org.statut}', '${org.email_contact}',
               '${org.telephone || ''}', '${org.adresse || ''}', '${org.couleur_principale || ''}', '${org.site_web || ''}');`
    ).join('\n'),

    // Script SQL pour les postes
    sqlPostes: systeme.postes.map(poste =>
      `INSERT INTO postes (id, titre, code, niveau, grade_requis, salaire_base)
       VALUES ('${poste.id}', '${poste.titre}', '${poste.code}', ${poste.niveau},
               '${poste.grade_requis.join(',')}', ${poste.salaire_base || 'NULL'});`
    ).join('\n'),

    // Script SQL pour les utilisateurs
    sqlUtilisateurs: systeme.utilisateurs.map(user =>
      `INSERT INTO utilisateurs (id, nom, prenom, email, role, poste_id, organisme_code, telephone, statut)
       VALUES ('${user.id}', '${user.nom}', '${user.prenom}', '${user.email}', '${user.role}',
               '${user.poste_id}', '${user.organisme_code}', '${user.telephone || ''}', '${user.statut}');`
    ).join('\n')
  };
}

// ==================== PARTIE 7: FONCTION D'INITIALISATION ====================

async function initialiserSysteme() {
  console.log('🚀 Initialisation du système complet avec 141 organismes officiels gabonais...');

  // Générer le système complet
  const systeme = await implementerSystemeComplet();

  // Valider l'intégrité
  const validation = validerSysteme(systeme);

  if (!validation.valide) {
    console.error('❌ Erreurs de validation:', validation.erreurs);
    return;
  }

  console.log('\n✅ Système des 141 organismes officiels généré avec succès!');
  console.log('=' + '='.repeat(60));
  console.log(`📊 Organismes: ${systeme.statistiques.totalOrganismes} organismes officiels gabonais`);
  console.log(`👥 Utilisateurs: ${systeme.statistiques.totalUtilisateurs} comptes créés`);
  console.log(`   • Administrateurs: ${systeme.statistiques.repartitionRoles.ADMIN}`);
  console.log(`   • Collaborateurs: ${systeme.statistiques.repartitionRoles.USER}`);
  console.log(`   • Réceptionnistes: ${systeme.statistiques.repartitionRoles.RECEPTIONIST}`);
  console.log(`📈 Moyenne: ${systeme.statistiques.moyenneUsersParOrganisme} utilisateurs/organisme`);
  console.log(`✓ ${systeme.statistiques.organismesAvecAdmin}/${systeme.statistiques.totalOrganismes} ont un administrateur`);
  console.log(`✓ ${systeme.statistiques.organismesAvecReceptionniste}/${systeme.statistiques.totalOrganismes} ont un réceptionniste`);

  // Afficher la répartition par type
  console.log('\n📊 Répartition par type d\'organisme:');
  Object.entries(systeme.statistiques.repartitionTypes).forEach(([type, count]) => {
    console.log(`   • ${type}: ${count} organisme(s)`);
  });

  // Exporter pour la base de données
  const scripts = exporterPourBDD(systeme);
  console.log('\n💾 Scripts SQL générés pour export BDD');

  return systeme;
}

// Export des fonctions et données
export {
  // Types
  OrganismePublic,
  PosteAdministratif,
  UtilisateurOrganisme,
  TypeOrganisme,
  Grade,
  SystemeComplet,

  // Données
  ORGANISMES_PUBLICS,
  POSTES_PAR_TYPE,
  POSTES_COMMUNS,
  GRADES_FONCTION_PUBLIQUE,

  // Fonctions
  implementerSystemeComplet,
  creerUtilisateursOrganisme,
  getPostesOrganisme,
  validerSysteme,
  exporterPourBDD,
  genererEmail,
  genererTelephone,
  initialiserSysteme
};
