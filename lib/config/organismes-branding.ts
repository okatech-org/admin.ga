/* @ts-nocheck */
import { 
  FileText, 
  Shield, 
  Scale, 
  Building2, 
  Heart, 
  Stethoscope, 
  GraduationCap, 
  Briefcase, 
  Car, 
  Home, 
  Receipt, 
  Truck, 
  Leaf, 
  Building, 
  Users, 
  Flag,
  Anchor,
  Trees,
  Wheat,
  Cross,
  Search,
  Calculator,
  Radio,
  Palette,
  Gavel,
  Award,
  Cpu,
  Globe,
  Wrench,
  MapPin
} from 'lucide-react';

// Types pour la configuration des organismes
export interface OrganismeBranding {
  code: string;
  nom: string;
  nomCourt: string;
  couleurPrimaire: string;
  couleurSecondaire: string;
  couleurAccent: string;
  gradientClasses: string;
  backgroundClasses: string;
  icon: any;
  slogan: string;
  description: string;
  website?: string;
  email?: string;
  telephone?: string;
  adresse: string;
  type: 'MINISTERE' | 'DIRECTION_GENERALE' | 'MAIRIE' | 'ORGANISME_SOCIAL' | 'AGENCE_PUBLIQUE' | 'INSTITUTION_JUDICIAIRE' | 'PREFECTURE' | 'PROVINCE';
  services: string[];
}

// Configuration des brandins par organisme - 50+ organismes gabonais
export const ORGANISMES_BRANDING: Record<string, OrganismeBranding> = {
  // === MINISTÈRES ===
  MIN_JUS: {
    code: 'MIN_JUS',
    nom: 'Ministère de la Justice, Garde des Sceaux',
    nomCourt: 'JUSTICE.GA',
    couleurPrimaire: '#7C3AED', // Purple
    couleurSecondaire: '#A855F7',
    couleurAccent: '#C084FC',
    gradientClasses: 'from-purple-600 to-purple-800',
    backgroundClasses: 'from-purple-50 via-white to-purple-100',
    icon: Scale,
    slogan: 'Justice, Équité, Légalité',
    description: 'Au service de la justice gabonaise',
    website: 'justice.gov.ga',
    email: 'contact@justice.gov.ga',
    telephone: '+241 11 XX XX XX',
    adresse: 'Boulevard de l\'Indépendance, Libreville',
    type: 'MINISTERE',
    services: ['Casier judiciaire', 'Certificat de nationalité', 'Légalisation de documents', 'Actes notariés']
  },

  MIN_INT: {
    code: 'MIN_INT',
    nom: 'Ministère de l\'Intérieur et de la Sécurité',
    nomCourt: 'INTERIEUR.GA',
    couleurPrimaire: '#1F2937', // Gray-800
    couleurSecondaire: '#374151',
    couleurAccent: '#6B7280',
    gradientClasses: 'from-gray-700 to-gray-900',
    backgroundClasses: 'from-gray-50 via-white to-gray-100',
    icon: Shield,
    slogan: 'Sécurité, Ordre, Protection',
    description: 'Garant de la sécurité intérieure',
    website: 'interieur.gov.ga',
    email: 'contact@interieur.gov.ga',
    telephone: '+241 11 XX XX XX',
    adresse: 'Avenue de la République, Libreville',
    type: 'MINISTERE',
    services: ['Carte Nationale d\'Identité', 'Passeport', 'Carte de séjour', 'Autorisation de réunion']
  },

  MIN_SANTE: {
    code: 'MIN_SANTE',
    nom: 'Ministère de la Santé et des Affaires Sociales',
    nomCourt: 'SANTE.GA',
    couleurPrimaire: '#DC2626', // Red-600
    couleurSecondaire: '#EF4444',
    couleurAccent: '#F87171',
    gradientClasses: 'from-red-500 to-red-700',
    backgroundClasses: 'from-red-50 via-white to-red-100',
    icon: Cross,
    slogan: 'Santé, Bien-être, Solidarité',
    description: 'Pour une santé accessible à tous',
    website: 'sante.gov.ga',
    email: 'contact@sante.gov.ga',
    telephone: '+241 11 XX XX XX',
    adresse: 'Boulevard Triomphal, Libreville',
    type: 'MINISTERE',
    services: ['Carte sanitaire', 'Certificat médical', 'Autorisation d\'exercice médical']
  },

  MIN_EDUC: {
    code: 'MIN_EDUC',
    nom: 'Ministère de l\'Éducation Nationale',
    nomCourt: 'EDUCATION.GA',
    couleurPrimaire: '#3B82F6', // Blue-500
    couleurSecondaire: '#60A5FA',
    couleurAccent: '#93C5FD',
    gradientClasses: 'from-blue-500 to-blue-700',
    backgroundClasses: 'from-blue-50 via-white to-blue-100',
    icon: GraduationCap,
    slogan: 'Éducation, Formation, Excellence',
    description: 'Construire l\'avenir par l\'éducation',
    website: 'education.gov.ga',
    email: 'contact@education.gov.ga',
    telephone: '+241 11 XX XX XX',
    adresse: 'Quartier Louis, Libreville',
    type: 'MINISTERE',
    services: ['Diplômes et attestations', 'Équivalence de diplômes', 'Inscription scolaire']
  },

  MIN_TRANSPORT: {
    code: 'MIN_TRANSPORT',
    nom: 'Ministère des Transports et de la Marine Marchande',
    nomCourt: 'TRANSPORT.GA',
    couleurPrimaire: '#F97316', // Orange-500
    couleurSecondaire: '#FB923C',
    couleurAccent: '#FDBA74',
    gradientClasses: 'from-orange-500 to-orange-700',
    backgroundClasses: 'from-orange-50 via-white to-orange-100',
    icon: Car,
    slogan: 'Mobilité, Sécurité, Modernité',
    description: 'Connecter le Gabon',
    website: 'transport.gov.ga',
    email: 'contact@transport.gov.ga',
    telephone: '+241 11 XX XX XX',
    adresse: 'Boulevard de la Mer, Libreville',
    type: 'MINISTERE',
    services: ['Permis de conduire', 'Immatriculation des véhicules', 'Carte grise']
  },

  MIN_HABITAT: {
    code: 'MIN_HABITAT',
    nom: 'Ministère de l\'Habitat, de l\'Urbanisme et du Cadastre',
    nomCourt: 'HABITAT.GA',
    couleurPrimaire: '#84CC16', // Lime-500
    couleurSecondaire: '#A3E635',
    couleurAccent: '#BEF264',
    gradientClasses: 'from-lime-500 to-lime-700',
    backgroundClasses: 'from-lime-50 via-white to-lime-100',
    icon: Home,
    slogan: 'Habitat, Urbanisme, Aménagement',
    description: 'Construire le Gabon de demain',
    website: 'habitat.gov.ga',
    email: 'contact@habitat.gov.ga',
    telephone: '+241 11 XX XX XX',
    adresse: 'Quartier Batterie IV, Libreville',
    type: 'MINISTERE',
    services: ['Titre foncier', 'Certificat d\'urbanisme', 'Plan cadastral']
  },

  MIN_TRAVAIL: {
    code: 'MIN_TRAVAIL',
    nom: 'Ministère du Travail, du Plein-emploi et du Dialogue Social',
    nomCourt: 'TRAVAIL.GA',
    couleurPrimaire: '#06B6D4', // Cyan-500
    couleurSecondaire: '#22D3EE',
    couleurAccent: '#67E8F9',
    gradientClasses: 'from-cyan-500 to-cyan-700',
    backgroundClasses: 'from-cyan-50 via-white to-cyan-100',
    icon: Briefcase,
    slogan: 'Emploi, Dialogue, Progrès',
    description: 'Promouvoir l\'emploi et le dialogue social',
    website: 'travail.gov.ga',
    email: 'contact@travail.gov.ga',
    telephone: '+241 11 XX XX XX',
    adresse: 'Immeuble CECA, Libreville',
    type: 'MINISTERE',
    services: ['Contrat de travail', 'Attestation de travail', 'Permis de travail']
  },

  MIN_ENV: {
    code: 'MIN_ENV',
    nom: 'Ministère de l\'Environnement et du Climat',
    nomCourt: 'ENVIRONNEMENT.GA',
    couleurPrimaire: '#059669', // Emerald-600
    couleurSecondaire: '#10B981',
    couleurAccent: '#34D399',
    gradientClasses: 'from-emerald-600 to-emerald-800',
    backgroundClasses: 'from-emerald-50 via-white to-emerald-100',
    icon: Leaf,
    slogan: 'Nature, Climat, Durabilité',
    description: 'Protéger notre environnement',
    website: 'environnement.gov.ga',
    email: 'contact@environnement.gov.ga',
    telephone: '+241 11 XX XX XX',
    adresse: 'Immeuble Diamant, Libreville',
    type: 'MINISTERE',
    services: ['Étude d\'impact environnemental', 'Certificat de conformité environnementale']
  },

  MIN_FORETS: {
    code: 'MIN_FORETS',
    nom: 'Ministère des Eaux et Forêts',
    nomCourt: 'FORETS.GA',
    couleurPrimaire: '#047857', // Emerald-700
    couleurSecondaire: '#059669',
    couleurAccent: '#10B981',
    gradientClasses: 'from-emerald-700 to-emerald-900',
    backgroundClasses: 'from-emerald-50 via-white to-emerald-100',
    icon: Trees,
    slogan: 'Forêts, Eaux, Biodiversité',
    description: 'Préserver nos ressources naturelles',
    website: 'forets.gov.ga',
    email: 'contact@forets.gov.ga',
    telephone: '+241 11 XX XX XX',
    adresse: 'Quartier Nomba, Libreville',
    type: 'MINISTERE',
    services: ['Permis d\'exploitation forestière', 'Certificat d\'origine des bois']
  },

  MIN_AGRI: {
    code: 'MIN_AGRI',
    nom: 'Ministère de l\'Agriculture, de l\'Élevage et du Développement Rural',
    nomCourt: 'AGRICULTURE.GA',
    couleurPrimaire: '#CA8A04', // Yellow-600
    couleurSecondaire: '#EAB308',
    couleurAccent: '#FACC15',
    gradientClasses: 'from-yellow-600 to-yellow-800',
    backgroundClasses: 'from-yellow-50 via-white to-yellow-100',
    icon: Wheat,
    slogan: 'Agriculture, Élevage, Développement',
    description: 'Nourrir le Gabon',
    website: 'agriculture.gov.ga',
    email: 'contact@agriculture.gov.ga',
    telephone: '+241 11 XX XX XX',
    adresse: 'Libreville',
    type: 'MINISTERE',
    services: ['Autorisation d\'exploitation agricole', 'Certificat phytosanitaire']
  },

  // === DIRECTIONS GÉNÉRALES ===
  DGDI: {
    code: 'DGDI',
    nom: 'Direction Générale de la Documentation et de l\'Immigration',
    nomCourt: 'DGDI.GA',
    couleurPrimaire: '#1E40AF', // Blue-800
    couleurSecondaire: '#3B82F6',
    couleurAccent: '#60A5FA',
    gradientClasses: 'from-blue-800 to-blue-900',
    backgroundClasses: 'from-blue-50 via-white to-blue-100',
    icon: FileText,
    slogan: 'Documents, Immigration, Identité',
    description: 'Votre identité, notre mission',
    website: 'dgdi.gov.ga',
    email: 'contact@dgdi.gov.ga',
    telephone: '+241 11 XX XX XX',
    adresse: 'Quartier Louis, Libreville',
    type: 'DIRECTION_GENERALE',
    services: ['Passeport', 'Carte de séjour', 'Visa', 'Carte Nationale d\'Identité']
  },

  DGI: {
    code: 'DGI',
    nom: 'Direction Générale des Impôts',
    nomCourt: 'DGI.GA',
    couleurPrimaire: '#B45309', // Amber-700
    couleurSecondaire: '#D97706',
    couleurAccent: '#F59E0B',
    gradientClasses: 'from-amber-700 to-amber-900',
    backgroundClasses: 'from-amber-50 via-white to-amber-100',
    icon: Receipt,
    slogan: 'Fiscalité, Transparence, Service',
    description: 'Au service du contribuable',
    website: 'dgi.gov.ga',
    email: 'contact@dgi.gov.ga',
    telephone: '+241 11 XX XX XX',
    adresse: 'Immeuble des Finances, Libreville',
    type: 'DIRECTION_GENERALE',
    services: ['Déclaration fiscale', 'Attestation fiscale', 'Quitus fiscal']
  },

  DGDDI: {
    code: 'DGDDI',
    nom: 'Direction Générale des Douanes et Droits Indirects',
    nomCourt: 'DOUANES.GA',
    couleurPrimaire: '#1E3A8A', // Blue-900
    couleurSecondaire: '#1E40AF',
    couleurAccent: '#3B82F6',
    gradientClasses: 'from-blue-900 to-blue-950',
    backgroundClasses: 'from-blue-50 via-white to-blue-100',
    icon: Truck,
    slogan: 'Commerce, Contrôle, Facilitation',
    description: 'Faciliter les échanges',
    website: 'douanes.gov.ga',
    email: 'contact@douanes.gov.ga',
    telephone: '+241 11 XX XX XX',
    adresse: 'Port d\'Owendo, Libreville',
    type: 'DIRECTION_GENERALE',
    services: ['Déclaration en douane', 'Mainlevée douanière', 'Dédouanement']
  },

  // === MAIRIES ===
  MAIRE_LBV: {
    code: 'MAIRE_LBV',
    nom: 'Mairie de Libreville',
    nomCourt: 'LIBREVILLE.GA',
    couleurPrimaire: '#1D4ED8', // Blue-700
    couleurSecondaire: '#3B82F6',
    couleurAccent: '#60A5FA',
    gradientClasses: 'from-blue-700 to-blue-900',
    backgroundClasses: 'from-blue-50 via-white to-blue-100',
    icon: Building2,
    slogan: 'Libreville, Capitale Moderne',
    description: 'Au service des Librevillois',
    website: 'libreville.ga',
    email: 'contact@libreville.ga',
    telephone: '+241 11 XX XX XX',
    adresse: 'Hôtel de Ville, Boulevard de l\'Indépendance',
    type: 'MAIRIE',
    services: ['Acte de naissance', 'Acte de mariage', 'Acte de décès', 'Certificat de résidence', 'Permis de construire']
  },

  MAIRE_PG: {
    code: 'MAIRE_PG',
    nom: 'Mairie de Port-Gentil',
    nomCourt: 'PORT-GENTIL.GA',
    couleurPrimaire: '#0F766E', // Teal-700
    couleurSecondaire: '#14B8A6',
    couleurAccent: '#5EEAD4',
    gradientClasses: 'from-teal-700 to-teal-900',
    backgroundClasses: 'from-teal-50 via-white to-teal-100',
    icon: Anchor,
    slogan: 'Port-Gentil, Capitale Économique',
    description: 'Au cœur de l\'économie gabonaise',
    website: 'port-gentil.ga',
    email: 'contact@port-gentil.ga',
    telephone: '+241 55 XX XX XX',
    adresse: 'Hôtel de Ville, Port-Gentil',
    type: 'MAIRIE',
    services: ['Acte de naissance', 'Acte de mariage', 'Acte de décès', 'Certificat de résidence']
  },

  // === ORGANISMES SOCIAUX ===
  CNSS: {
    code: 'CNSS',
    nom: 'Caisse Nationale de Sécurité Sociale',
    nomCourt: 'CNSS.GA',
    couleurPrimaire: '#16A34A', // Green-600
    couleurSecondaire: '#22C55E',
    couleurAccent: '#4ADE80',
    gradientClasses: 'from-green-600 to-green-800',
    backgroundClasses: 'from-green-50 via-white to-green-100',
    icon: Heart,
    slogan: 'Protection, Sécurité, Solidarité',
    description: 'Votre protection sociale',
    website: 'cnss.ga',
    email: 'contact@cnss.ga',
    telephone: '+241 11 XX XX XX',
    adresse: 'Boulevard du Bord de Mer, Libreville',
    type: 'ORGANISME_SOCIAL',
    services: ['Immatriculation CNSS', 'Retraites', 'Allocations familiales', 'Accidents du travail']
  },

  CNAMGS: {
    code: 'CNAMGS',
    nom: 'Caisse Nationale d\'Assurance Maladie et de Garantie Sociale',
    nomCourt: 'CNAMGS.GA',
    couleurPrimaire: '#DC2626', // Red-600
    couleurSecondaire: '#EF4444',
    couleurAccent: '#F87171',
    gradientClasses: 'from-red-600 to-red-800',
    backgroundClasses: 'from-red-50 via-white to-red-100',
    icon: Stethoscope,
    slogan: 'Santé, Assurance, Garantie',
    description: 'Votre santé, notre priorité',
    website: 'cnamgs.ga',
    email: 'contact@cnamgs.ga',
    telephone: '+241 11 XX XX XX',
    adresse: 'Libreville',
    type: 'ORGANISME_SOCIAL',
    services: ['Carte CNAMGS', 'Assurance maladie', 'Remboursement médical', 'Évacuations sanitaires']
  },

  ONE: {
    code: 'ONE',
    nom: 'Office National de l\'Emploi',
    nomCourt: 'ONE.GA',
    couleurPrimaire: '#7C3AED', // Violet-600
    couleurSecondaire: '#8B5CF6',
    couleurAccent: '#A78BFA',
    gradientClasses: 'from-violet-600 to-violet-800',
    backgroundClasses: 'from-violet-50 via-white to-violet-100',
    icon: Search,
    slogan: 'Emploi, Formation, Insertion',
    description: 'Votre partenaire emploi',
    website: 'one.ga',
    email: 'contact@one.ga',
    telephone: '+241 11 XX XX XX',
    adresse: 'Libreville',
    type: 'ORGANISME_SOCIAL',
    services: ['Recherche d\'emploi', 'Formation professionnelle', 'Attestation de chômage']
  },

  // === AGENCES PUBLIQUES ===
  ANPI: {
    code: 'ANPI',
    nom: 'Agence Nationale de Promotion des Investissements',
    nomCourt: 'ANPI.GA',
    couleurPrimaire: '#059669', // Emerald-600
    couleurSecondaire: '#10B981',
    couleurAccent: '#34D399',
    gradientClasses: 'from-emerald-600 to-emerald-800',
    backgroundClasses: 'from-emerald-50 via-white to-emerald-100',
    icon: Building,
    slogan: 'Investissement, Innovation, Croissance',
    description: 'Investir au Gabon',
    website: 'investingabon.ga',
    email: 'contact@anpi.ga',
    telephone: '+241 11 XX XX XX',
    adresse: 'Immeuble Arambo, Libreville',
    type: 'AGENCE_PUBLIQUE',
    services: ['Promotion investissements', 'Guichet unique', 'Accompagnement PME']
  },

  ARCEP: {
    code: 'ARCEP',
    nom: 'Autorité de Régulation des Communications Électroniques et des Postes',
    nomCourt: 'ARCEP.GA',
    couleurPrimaire: '#7C2D12', // Orange-900
    couleurSecondaire: '#EA580C',
    couleurAccent: '#FB923C',
    gradientClasses: 'from-orange-900 to-orange-950',
    backgroundClasses: 'from-orange-50 via-white to-orange-100',
    icon: Radio,
    slogan: 'Régulation, Innovation, Télécoms',
    description: 'Réguler les télécommunications',
    website: 'arcep.ga',
    email: 'contact@arcep.ga',
    telephone: '+241 11 XX XX XX',
    adresse: 'Libreville',
    type: 'AGENCE_PUBLIQUE',
    services: ['Régulation télécoms', 'Autorisation d\'exploitation télécom', 'Homologation d\'équipements']
  },

  // === INSTITUTIONS JUDICIAIRES ===
  COUR_CASSATION: {
    code: 'COUR_CASSATION',
    nom: 'Cour de Cassation de la République Gabonaise',
    nomCourt: 'CASSATION.GA',
    couleurPrimaire: '#7F1D1D', // Red-900
    couleurSecondaire: '#991B1B',
    couleurAccent: '#B91C1C',
    gradientClasses: 'from-red-900 to-red-950',
    backgroundClasses: 'from-red-50 via-white to-red-100',
    icon: Gavel,
    slogan: 'Justice, Cassation, Droit',
    description: 'Cour suprême judiciaire',
    website: 'cassation.justice.ga',
    email: 'contact@cassation.justice.ga',
    telephone: '+241 11 XX XX XX',
    adresse: 'Palais de Justice, Libreville',
    type: 'INSTITUTION_JUDICIAIRE',
    services: ['Recours en cassation', 'Procédures judiciaires suprêmes']
  },

  CONSEIL_ETAT: {
    code: 'CONSEIL_ETAT',
    nom: 'Conseil d\'État de la République Gabonaise',
    nomCourt: 'CONSEIL-ETAT.GA',
    couleurPrimaire: '#374151', // Gray-700
    couleurSecondaire: '#4B5563',
    couleurAccent: '#6B7280',
    gradientClasses: 'from-gray-700 to-gray-900',
    backgroundClasses: 'from-gray-50 via-white to-gray-100',
    icon: Shield,
    slogan: 'Droit Administratif, Contrôle, État',
    description: 'Cour suprême administrative',
    website: 'conseil-etat.gov.ga',
    email: 'contact@conseil-etat.gov.ga',
    telephone: '+241 11 XX XX XX',
    adresse: 'Libreville',
    type: 'INSTITUTION_JUDICIAIRE',
    services: ['Contentieux administratif']
  },

  COUR_COMPTES: {
    code: 'COUR_COMPTES',
    nom: 'Cour des Comptes de la République Gabonaise',
    nomCourt: 'COUR-COMPTES.GA',
    couleurPrimaire: '#1F2937', // Gray-800
    couleurSecondaire: '#374151',
    couleurAccent: '#4B5563',
    gradientClasses: 'from-gray-800 to-gray-900',
    backgroundClasses: 'from-gray-50 via-white to-gray-100',
    icon: Calculator,
    slogan: 'Contrôle, Finances, Transparence',
    description: 'Contrôle des finances publiques',
    website: 'cour-comptes.gov.ga',
    email: 'contact@cour-comptes.gov.ga',
    telephone: '+241 70 54 11',
    adresse: 'ACAE-route Owendo, Libreville',
    type: 'INSTITUTION_JUDICIAIRE',
    services: ['Contrôle des finances publiques', 'Audit des comptes publics']
  },

  // === PROVINCES ===
  PROV_EST: {
    code: 'PROV_EST',
    nom: 'Province de l\'Estuaire',
    nomCourt: 'ESTUAIRE.GA',
    couleurPrimaire: '#1E40AF', // Blue-800
    couleurSecondaire: '#3B82F6',
    couleurAccent: '#60A5FA',
    gradientClasses: 'from-blue-800 to-blue-900',
    backgroundClasses: 'from-blue-50 via-white to-blue-100',
    icon: MapPin,
    slogan: 'Estuaire, Capitale, Développement',
    description: 'Province capitale du Gabon',
    website: 'estuaire.gov.ga',
    email: 'contact@estuaire.gov.ga',
    telephone: '+241 11 XX XX XX',
    adresse: 'Gouvernorat, Libreville',
    type: 'PROVINCE',
    services: ['Services du gouvernorat', 'Coordination administrative provinciale']
  },

  PROV_OM: {
    code: 'PROV_OM',
    nom: 'Province de l\'Ogooué-Maritime',
    nomCourt: 'OGOOUE-MARITIME.GA',
    couleurPrimaire: '#0F766E', // Teal-700
    couleurSecondaire: '#14B8A6',
    couleurAccent: '#5EEAD4',
    gradientClasses: 'from-teal-700 to-teal-900',
    backgroundClasses: 'from-teal-50 via-white to-teal-100',
    icon: Anchor,
    slogan: 'Maritime, Pétrole, Économie',
    description: 'Province économique du Gabon',
    website: 'ogooue-maritime.gov.ga',
    email: 'contact@ogooue-maritime.gov.ga',
    telephone: '+241 55 XX XX XX',
    adresse: 'Gouvernorat, Port-Gentil',
    type: 'PROVINCE',
    services: ['Services du gouvernorat', 'Coordination administrative provinciale']
  }
};

// Fonction pour obtenir le branding d'un organisme
export const getOrganismeBranding = (code: string): OrganismeBranding | null => {
  return ORGANISMES_BRANDING[code] || null;
};

// Fonction pour obtenir tous les organismes par type
export const getOrganismesByType = (type: string): OrganismeBranding[] => {
  return Object.values(ORGANISMES_BRANDING).filter(org => org.type === type);
};

// Fonction pour obtenir la liste de tous les codes d'organismes
export const getAllOrganismeCodes = (): string[] => {
  return Object.keys(ORGANISMES_BRANDING);
};

// Configuration par défaut pour les organismes non configurés
export const DEFAULT_ORGANISME_BRANDING: OrganismeBranding = {
  code: 'DEFAULT',
  nom: 'Administration Gabonaise',
  nomCourt: 'ADMIN.GA',
  couleurPrimaire: '#374151',
  couleurSecondaire: '#4B5563',
  couleurAccent: '#6B7280',
  gradientClasses: 'from-gray-600 to-gray-800',
  backgroundClasses: 'from-gray-50 via-white to-gray-100',
  icon: Building2,
  slogan: 'Service Public, Excellence, Modernité',
  description: 'Au service du citoyen gabonais',
  website: 'admin.ga',
  email: 'contact@admin.ga',
  telephone: '+241 11 XX XX XX',
  adresse: 'Libreville, Gabon',
  type: 'AGENCE_PUBLIQUE',
  services: ['Services administratifs']
}; 