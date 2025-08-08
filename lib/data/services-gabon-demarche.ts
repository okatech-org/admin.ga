import { ServiceCategory, OrganismeType } from '@prisma/client'

export interface ServiceData {
  code: string
  nom: string
  description: string
  category: ServiceCategory
  organismeCode: string
  organismeNom: string
  organismeType: OrganismeType
  cout?: number
  dureeEstimee?: number
  documentsRequis?: string[]
  procedure?: string
  isPopular?: boolean
}

export interface OrganismeData {
  code: string
  nom: string
  type: string
  organismeType: OrganismeType
  description?: string
  adresse?: string
  ville?: string
  province?: string
  telephone?: string
  email?: string
  siteWeb?: string
}

// Liste des organismes gabonais
export const organismes: OrganismeData[] = [
  {
    code: 'DGDI',
    nom: 'Direction Générale de la Documentation et de l\'Immigration',
    type: 'Direction Générale',
    organismeType: OrganismeType.DIRECTION_GENERALE,
    description: 'Responsable des documents d\'identité et de l\'immigration',
    adresse: 'Boulevard Triomphal Omar Bongo',
    ville: 'Libreville',
    province: 'Estuaire',
    telephone: '+241 01 76 10 23',
    email: 'contact@dgdi.ga',
    siteWeb: 'https://dgdi.ga'
  },
  {
    code: 'DGI',
    nom: 'Direction Générale des Impôts',
    type: 'Direction Générale',
    organismeType: OrganismeType.DIRECTION_GENERALE,
    description: 'Administration fiscale gabonaise',
    adresse: 'Avenue de l\'Indépendance',
    ville: 'Libreville',
    province: 'Estuaire',
    telephone: '+241 01 74 85 20',
    email: 'contact@dgi.ga',
    siteWeb: 'https://dgi.ga'
  },
  {
    code: 'CNSS',
    nom: 'Caisse Nationale de Sécurité Sociale',
    type: 'Organisme Social',
    organismeType: OrganismeType.ORGANISME_SOCIAL,
    description: 'Sécurité sociale des travailleurs gabonais',
    adresse: 'Boulevard de l\'Indépendance',
    ville: 'Libreville',
    province: 'Estuaire',
    telephone: '+241 01 72 34 56',
    email: 'contact@cnss.ga',
    siteWeb: 'https://cnss.ga'
  },
  {
    code: 'CNAMGS',
    nom: 'Caisse Nationale d\'Assurance Maladie et de Garantie Sociale',
    type: 'Organisme Social',
    organismeType: OrganismeType.ORGANISME_SOCIAL,
    description: 'Assurance maladie gabonaise',
    adresse: 'Immeuble CNAMGS, Centre-ville',
    ville: 'Libreville',
    province: 'Estuaire',
    telephone: '+241 01 76 28 91',
    email: 'contact@cnamgs.ga',
    siteWeb: 'https://cnamgs.ga'
  },
  {
    code: 'MAIRIE_LBV',
    nom: 'Mairie de Libreville',
    type: 'Mairie',
    organismeType: OrganismeType.MAIRIE,
    description: 'Administration municipale de Libreville',
    adresse: 'Place de l\'Indépendance',
    ville: 'Libreville',
    province: 'Estuaire',
    telephone: '+241 01 72 01 85',
    email: 'contact@mairie-libreville.ga',
    siteWeb: 'https://libreville.ga'
  },
  {
    code: 'PREFECTURE_ES',
    nom: 'Préfecture de l\'Estuaire',
    type: 'Préfecture',
    organismeType: OrganismeType.PREFECTURE,
    description: 'Administration préfectorale de l\'Estuaire',
    adresse: 'Avenue Hassan II',
    ville: 'Libreville',
    province: 'Estuaire',
    telephone: '+241 01 74 12 33',
    email: 'contact@prefecture-estuaire.ga',
    siteWeb: 'https://prefecture-estuaire.ga'
  }
]

// Liste des services administratifs gabonais
export const servicesGabon: ServiceData[] = [
  // Services d'identité - DGDI
  {
    code: 'CNI_PREMIERE',
    nom: 'Carte Nationale d\'Identité - Première demande',
    description: 'Obtenir sa première carte nationale d\'identité gabonaise',
    category: ServiceCategory.IDENTITE,
    organismeCode: 'DGDI',
    organismeNom: 'DGDI',
    organismeType: OrganismeType.DIRECTION_GENERALE,
    cout: 5000,
    dureeEstimee: 7,
    isPopular: true,
    documentsRequis: [
      'Extrait d\'acte de naissance',
      'Certificat de nationalité',
      '2 photos d\'identité récentes',
      'Justificatif de domicile',
      'Attestation de résidence'
    ],
    procedure: '1. Dépôt du dossier complet\n2. Vérification et validation des documents\n3. Prise d\'empreintes biométriques\n4. Production de la carte\n5. Retrait de la carte'
  },
  {
    code: 'CNI_RENOUVELLEMENT',
    nom: 'Carte Nationale d\'Identité - Renouvellement',
    description: 'Renouveler sa carte nationale d\'identité expirée',
    category: ServiceCategory.IDENTITE,
    organismeCode: 'DGDI',
    organismeNom: 'DGDI',
    organismeType: OrganismeType.DIRECTION_GENERALE,
    cout: 5000,
    dureeEstimee: 5,
    isPopular: true,
    documentsRequis: [
      'Ancienne CNI (même expirée)',
      '2 photos d\'identité récentes',
      'Justificatif de domicile récent'
    ],
    procedure: '1. Dépôt du dossier avec ancienne CNI\n2. Vérification des informations\n3. Mise à jour des données biométriques\n4. Production\n5. Retrait'
  },
  {
    code: 'PASSEPORT_BIOMETRIQUE',
    nom: 'Passeport Biométrique',
    description: 'Demande ou renouvellement de passeport biométrique gabonais',
    category: ServiceCategory.IDENTITE,
    organismeCode: 'DGDI',
    organismeNom: 'DGDI',
    organismeType: OrganismeType.DIRECTION_GENERALE,
    cout: 70000,
    dureeEstimee: 15,
    isPopular: true,
    documentsRequis: [
      'Carte Nationale d\'Identité valide',
      'Extrait d\'acte de naissance',
      'Certificat de nationalité',
      '4 photos d\'identité biométriques',
      'Justificatif de domicile',
      'Ancien passeport (si renouvellement)'
    ],
    procedure: '1. Constitution du dossier\n2. Dépôt et vérification\n3. Entretien et prise de données biométriques\n4. Validation consulaire\n5. Production\n6. Retrait'
  },
  {
    code: 'VISA_SORTIE',
    nom: 'Visa de Sortie du Territoire',
    description: 'Autorisation de sortie du territoire gabonais',
    category: ServiceCategory.IDENTITE,
    organismeCode: 'DGDI',
    organismeNom: 'DGDI',
    organismeType: OrganismeType.DIRECTION_GENERALE,
    cout: 15000,
    dureeEstimee: 5,
    documentsRequis: [
      'Passeport valide',
      'CNI valide',
      'Billet d\'avion ou réservation',
      'Justificatif de motif de voyage'
    ]
  },

  // Services État Civil - Mairie
  {
    code: 'ACTE_NAISSANCE',
    nom: 'Extrait d\'Acte de Naissance',
    description: 'Obtenir un extrait d\'acte de naissance',
    category: ServiceCategory.ETAT_CIVIL,
    organismeCode: 'MAIRIE_LBV',
    organismeNom: 'Mairie de Libreville',
    organismeType: OrganismeType.MAIRIE,
    cout: 2500,
    dureeEstimee: 3,
    isPopular: true,
    documentsRequis: [
      'Pièce d\'identité du demandeur',
      'Justificatif de lien de parenté (si demande pour tiers)'
    ],
    procedure: '1. Demande à l\'état civil\n2. Recherche dans les registres\n3. Vérification des informations\n4. Établissement de l\'extrait\n5. Remise du document'
  },
  {
    code: 'ACTE_MARIAGE',
    nom: 'Extrait d\'Acte de Mariage',
    description: 'Obtenir un extrait d\'acte de mariage',
    category: ServiceCategory.ETAT_CIVIL,
    organismeCode: 'MAIRIE_LBV',
    organismeNom: 'Mairie de Libreville',
    organismeType: OrganismeType.MAIRIE,
    cout: 2500,
    dureeEstimee: 3,
    documentsRequis: [
      'Pièce d\'identité des époux',
      'Justificatif du demandeur'
    ]
  },
  {
    code: 'CERTIFICAT_DECES',
    nom: 'Certificat de Décès',
    description: 'Obtenir un certificat de décès',
    category: ServiceCategory.ETAT_CIVIL,
    organismeCode: 'MAIRIE_LBV',
    organismeNom: 'Mairie de Libreville',
    organismeType: OrganismeType.MAIRIE,
    cout: 2500,
    dureeEstimee: 2,
    documentsRequis: [
      'Certificat médical de décès',
      'Pièce d\'identité du déclarant',
      'Justificatif de lien de parenté'
    ]
  },

  // Services Judiciaires - Préfecture
  {
    code: 'CASIER_JUDICIAIRE',
    nom: 'Extrait de Casier Judiciaire (Bulletin n°3)',
    description: 'Obtenir un extrait de casier judiciaire',
    category: ServiceCategory.JUDICIAIRE,
    organismeCode: 'PREFECTURE_ES',
    organismeNom: 'Préfecture de l\'Estuaire',
    organismeType: OrganismeType.PREFECTURE,
    cout: 3000,
    dureeEstimee: 7,
    isPopular: true,
    documentsRequis: [
      'CNI valide',
      'Justificatif de la demande (emploi, voyage, etc.)'
    ],
    procedure: '1. Demande motivée\n2. Vérification d\'identité\n3. Consultation des fichiers judiciaires\n4. Établissement du bulletin\n5. Remise'
  },
  {
    code: 'CERTIFICAT_NATIONALITE',
    nom: 'Certificat de Nationalité',
    description: 'Obtenir un certificat de nationalité gabonaise',
    category: ServiceCategory.JUDICIAIRE,
    organismeCode: 'PREFECTURE_ES',
    organismeNom: 'Préfecture de l\'Estuaire',
    organismeType: OrganismeType.PREFECTURE,
    cout: 10000,
    dureeEstimee: 15,
    documentsRequis: [
      'Acte de naissance intégral',
      'Actes de naissance des parents',
      'Pièce d\'identité',
      'Justificatifs de résidence'
    ]
  },

  // Services Municipal - Mairie
  {
    code: 'CERTIFICAT_RESIDENCE',
    nom: 'Certificat de Résidence',
    description: 'Obtenir un certificat attestant de votre résidence',
    category: ServiceCategory.MUNICIPAL,
    organismeCode: 'MAIRIE_LBV',
    organismeNom: 'Mairie de Libreville',
    organismeType: OrganismeType.MAIRIE,
    cout: 2000,
    dureeEstimee: 5,
    documentsRequis: [
      'CNI valide',
      'Justificatifs de domicile',
      'Attestation de 2 témoins domiciliés'
    ],
    procedure: '1. Dépôt de la demande\n2. Enquête de voisinage\n3. Vérification sur le terrain\n4. Validation par les services\n5. Délivrance'
  },
  {
    code: 'PERMIS_CONSTRUIRE',
    nom: 'Permis de Construire',
    description: 'Autorisation de construire un bâtiment',
    category: ServiceCategory.MUNICIPAL,
    organismeCode: 'MAIRIE_LBV',
    organismeNom: 'Mairie de Libreville',
    organismeType: OrganismeType.MAIRIE,
    cout: 50000,
    dureeEstimee: 30,
    documentsRequis: [
      'Plans architecturaux',
      'Titre de propriété',
      'Étude de sol',
      'Autorisation d\'urbanisme'
    ]
  },

  // Services Sociaux - CNSS
  {
    code: 'ATTESTATION_CNSS',
    nom: 'Attestation CNSS',
    description: 'Attestation de situation CNSS',
    category: ServiceCategory.SOCIAL,
    organismeCode: 'CNSS',
    organismeNom: 'CNSS',
    organismeType: OrganismeType.ORGANISME_SOCIAL,
    cout: 1000,
    dureeEstimee: 3,
    documentsRequis: [
      'CNI valide',
      'Numéro de sécurité sociale'
    ]
  },
  {
    code: 'PENSION_RETRAITE',
    nom: 'Demande de Pension de Retraite',
    description: 'Demande de liquidation de pension de retraite',
    category: ServiceCategory.SOCIAL,
    organismeCode: 'CNSS',
    organismeNom: 'CNSS',
    organismeType: OrganismeType.ORGANISME_SOCIAL,
    cout: 0,
    dureeEstimee: 45,
    documentsRequis: [
      'Dossier de carrière complet',
      'Certificats de travail',
      'Relevé de compte CNSS',
      'Certificat médical'
    ]
  },

  // Services Santé - CNAMGS
  {
    code: 'CARTE_CNAMGS',
    nom: 'Carte d\'Assurance Maladie CNAMGS',
    description: 'Obtenir ou renouveler sa carte CNAMGS',
    category: ServiceCategory.SANTE,
    organismeCode: 'CNAMGS',
    organismeNom: 'CNAMGS',
    organismeType: OrganismeType.ORGANISME_SOCIAL,
    cout: 2000,
    dureeEstimee: 7,
    isPopular: true,
    documentsRequis: [
      'CNI valide',
      'Justificatif d\'activité professionnelle',
      'Photo d\'identité'
    ]
  },
  {
    code: 'REMBOURSEMENT_SOINS',
    nom: 'Demande de Remboursement de Soins',
    description: 'Demande de remboursement de frais médicaux',
    category: ServiceCategory.SANTE,
    organismeCode: 'CNAMGS',
    organismeNom: 'CNAMGS',
    organismeType: OrganismeType.ORGANISME_SOCIAL,
    cout: 0,
    dureeEstimee: 15,
    documentsRequis: [
      'Factures médicales originales',
      'Ordonnances médicales',
      'Carte CNAMGS',
      'Relevé d\'identité bancaire'
    ]
  },

  // Services Fiscaux - DGI
  {
    code: 'ATTESTATION_FISCALE',
    nom: 'Attestation Fiscale',
    description: 'Attestation de situation fiscale',
    category: ServiceCategory.FISCAL,
    organismeCode: 'DGI',
    organismeNom: 'DGI',
    organismeType: OrganismeType.DIRECTION_GENERALE,
    cout: 5000,
    dureeEstimee: 5,
    documentsRequis: [
      'CNI valide',
      'Dernières déclarations fiscales',
      'Justificatif de paiement des impôts'
    ]
  },
  {
    code: 'NUMERO_CONTRIBUABLE',
    nom: 'Numéro de Contribuable',
    description: 'Obtenir un numéro de contribuable',
    category: ServiceCategory.FISCAL,
    organismeCode: 'DGI',
    organismeNom: 'DGI',
    organismeType: OrganismeType.DIRECTION_GENERALE,
    cout: 2000,
    dureeEstimee: 7,
    documentsRequis: [
      'CNI valide',
      'Justificatif d\'adresse',
      'Déclaration d\'activité'
    ]
  }
]

// Services les plus populaires (pour la page d'accueil)
export const servicesPopulaires = servicesGabon.filter(service => service.isPopular)
