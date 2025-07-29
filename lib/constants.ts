/* @ts-nocheck */
export const ORGANIZATION_TYPES = {
  MINISTERE: 'Ministère',
  DIRECTION_GENERALE: 'Direction Générale',
  MAIRIE: 'Mairie',
  ORGANISME_SOCIAL: 'Organisme Social',
  AUTRE: 'Autre',
} as const;

export const USER_ROLES = {
  SUPER_ADMIN: 'Super Administrateur',
  ADMIN: 'Administrateur',
  MANAGER: 'Responsable',
  AGENT: 'Agent',
  USER: 'Citoyen',
} as const;

export const SERVICE_TYPES = {
  // Documents d'État Civil
  ACTE_NAISSANCE: 'Acte de naissance',
  ACTE_MARIAGE: 'Acte de mariage',
  ACTE_DECES: 'Acte de décès',
  CERTIFICAT_VIE: 'Certificat de vie',
  CERTIFICAT_CELIBAT: 'Certificat de célibat',
  
  // Documents d'Identité
  CNI: 'Carte Nationale d\'Identité',
  PASSEPORT: 'Passeport',
  PERMIS_CONDUIRE: 'Permis de conduire',
  CARTE_SEJOUR: 'Carte de séjour',
  
  // Documents Judiciaires
  CASIER_JUDICIAIRE: 'Casier judiciaire',
  CERTIFICAT_NATIONALITE: 'Certificat de nationalité',
  LEGALISATION: 'Légalisation de documents',
  
  // Services Municipaux
  PERMIS_CONSTRUIRE: 'Permis de construire',
  AUTORISATION_COMMERCE: 'Autorisation de commerce',
  CERTIFICAT_RESIDENCE: 'Certificat de résidence',
  ACTE_FONCIER: 'Acte foncier',
  
  // Services Sociaux
  IMMATRICULATION_CNSS: 'Immatriculation CNSS',
  CARTE_CNAMGS: 'Carte CNAMGS',
  ATTESTATION_CHOMAGE: 'Attestation de chômage',
  ATTESTATION_TRAVAIL: 'Attestation de travail',
} as const;

export const REQUEST_STATUS = {
  DRAFT: 'Brouillon',
  SUBMITTED: 'Soumis',
  ASSIGNED: 'Assigné',
  IN_PROGRESS: 'En cours',
  PENDING_DOCUMENTS: 'Documents manquants',
  VALIDATED: 'Validé',
  READY: 'Prêt',
  COMPLETED: 'Terminé',
  REJECTED: 'Rejeté',
  CANCELLED: 'Annulé',
} as const;

export const GABONESE_ORGANIZATIONS = [
  // Ministères
  {
    name: 'Ministère de l\'Intérieur',
    type: 'MINISTERE' as const,
    code: 'MIN_INT',
    services: ['CNI', 'PASSEPORT', 'CARTE_SEJOUR']
  },
  {
    name: 'Ministère de la Justice',
    type: 'MINISTERE' as const,
    code: 'MIN_JUS',
    services: ['CASIER_JUDICIAIRE', 'CERTIFICAT_NATIONALITE', 'LEGALISATION']
  },
  
  // Directions Générales
  {
    name: 'Direction Générale de la Documentation et de l\'Immigration (DGDI)',
    type: 'DIRECTION_GENERALE' as const,
    code: 'DGDI',
    services: ['PASSEPORT', 'CARTE_SEJOUR']
  },
  
  // Mairies
  {
    name: 'Mairie de Libreville',
    type: 'MAIRIE' as const,
    code: 'MAIRE_LBV',
    services: ['ACTE_NAISSANCE', 'ACTE_MARIAGE', 'ACTE_DECES', 'PERMIS_CONSTRUIRE', 'AUTORISATION_COMMERCE']
  },
  {
    name: 'Mairie de Port-Gentil',
    type: 'MAIRIE' as const,
    code: 'MAIRE_PG',
    services: ['ACTE_NAISSANCE', 'ACTE_MARIAGE', 'ACTE_DECES', 'PERMIS_CONSTRUIRE']
  },
  
  // Organismes Sociaux
  {
    name: 'Caisse Nationale de Sécurité Sociale (CNSS)',
    type: 'ORGANISME_SOCIAL' as const,
    code: 'CNSS',
    services: ['IMMATRICULATION_CNSS', 'ATTESTATION_TRAVAIL']
  },
  {
    name: 'Caisse Nationale d\'Assurance Maladie et de Garantie Sociale (CNAMGS)',
    type: 'ORGANISME_SOCIAL' as const,
    code: 'CNAMGS',
    services: ['CARTE_CNAMGS']
  }
];

export const DEMO_ACCOUNTS = [
  {
    email: 'superadmin@admin.ga',
    password: 'SuperAdmin2024!',
    role: 'SUPER_ADMIN' as const,
    firstName: 'Jean-Baptiste',
    lastName: 'NGUEMA',
    organization: null
  },
  {
    email: 'admin.libreville@admin.ga',
    password: 'AdminLib2024!',
    role: 'ADMIN' as const,
    firstName: 'Marie-Claire',
    lastName: 'MBADINGA',
    organization: 'MAIRE_LBV'
  },
  {
    email: 'manager.cnss@admin.ga',
    password: 'Manager2024!',
    role: 'MANAGER' as const,
    firstName: 'Paul',
    lastName: 'MBOUMBA',
    organization: 'CNSS'
  },
  {
    email: 'agent.mairie@admin.ga',
    password: 'Agent2024!',
    role: 'AGENT' as const,
    firstName: 'Sophie',
    lastName: 'NZAMBA',
    organization: 'MAIRE_LBV'
  },
  {
    email: 'jean.dupont@gmail.com',
    password: 'User2024!',
    role: 'USER' as const,
    firstName: 'Jean',
    lastName: 'DUPONT',
    organization: null
  },
  // Comptes citoyens DEMARCHE.GA avec accès global aux 85+ services
  {
    email: 'marie.mvogo@demarche.ga',
    password: 'Citoyen2024!',
    role: 'USER' as const,
    firstName: 'Marie-Christine',
    lastName: 'MVOGO',
    organization: null
  },
  {
    email: 'pierre.mba@demarche.ga',
    password: 'Citoyen2024!',
    role: 'USER' as const,
    firstName: 'Pierre',
    lastName: 'MBA ABESSOLO',
    organization: null
  },
  {
    email: 'fatou.nguema@demarche.ga',
    password: 'Citoyen2024!',
    role: 'USER' as const,
    firstName: 'Fatou',
    lastName: 'NGUEMA',
    organization: null
  },
  {
    email: 'citoyen.test@demarche.ga',
    password: 'DemarcheGA2024!',
    role: 'USER' as const,
    firstName: 'Citoyen',
    lastName: 'TEST',
    organization: null
  },
  // Compte démo principal DEMARCHE.GA - Accès direct depuis la page d'accueil
  {
    email: 'demo.citoyen@demarche.ga',
    password: 'CitoyenDemo2024!',
    role: 'USER' as const,
    firstName: 'Jean',
    lastName: 'MBADINGA',
    organization: null,
    isDemo: true,
    profile: {
      phone: '+241 06 12 34 56 78',
      dateOfBirth: '1985-03-15',
      placeOfBirth: 'Libreville, Gabon',
      nationality: 'Gabonaise',
      address: '123 Boulevard Triomphal, Libreville',
      city: 'Libreville',
      postalCode: '1234',
      country: 'Gabon',
      profession: 'Ingénieur informatique',
      maritalStatus: 'Marié(e)',
      emergencyContact: {
        name: 'Marie MBADINGA',
        phone: '+241 06 98 76 54 32',
        relationship: 'Épouse'
      }
    }
  }
];