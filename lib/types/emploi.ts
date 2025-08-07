export type StatutOffre = 'active' | 'pourvue' | 'expiree' | 'brouillon';
export type TypeContrat = 'CDI' | 'CDD' | 'stage' | 'alternance' | 'consultant' | 'vacataire';
export type NiveauEtude = 'bac' | 'bac+2' | 'bac+3' | 'bac+5' | 'doctorat' | 'autre';
export type StatutCandidature = 'nouvelle' | 'en_cours' | 'acceptee' | 'refusee' | 'archivee';

export interface OffreEmploi {
  id: string;
  titre: string;
  description: string;
  organismeId: string;
  organismeNom: string;
  localisation: string;
  typeContrat: TypeContrat;
  niveauEtude: NiveauEtude;
  experienceRequise: string;
  competences: string[];
  missions: string[];
  avantages: string[];
  salaire?: {
    min?: number;
    max?: number;
    devise: string;
    periode: 'mois' | 'annee';
  };
  datePublication: Date;
  dateExpiration: Date;
  statut: StatutOffre;
  nombrePostes: number;
  nombreCandidatures?: number;
  reference: string;
  contact?: {
    nom: string;
    email: string;
    telephone?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Candidature {
  id: string;
  offreId: string;
  offre?: OffreEmploi;
  candidat: {
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    dateNaissance?: Date;
    adresse?: string;
    nationalite?: string;
  };
  cv: {
    url: string;
    nom: string;
    taille: number;
  };
  lettreMotivation?: {
    url?: string;
    texte?: string;
  };
  diplomes?: {
    niveau: NiveauEtude;
    specialite: string;
    etablissement: string;
    annee: number;
  }[];
  experiences?: {
    poste: string;
    entreprise: string;
    debut: Date;
    fin?: Date;
    description: string;
  }[];
  competences?: string[];
  pretentionsSalariales?: number;
  disponibilite?: Date;
  statut: StatutCandidature;
  notes?: string;
  evaluations?: {
    critere: string;
    note: number;
    commentaire?: string;
  }[];
  dateCandidature: Date;
  dateTraitement?: Date;
  traitePar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FiltresOffres {
  recherche?: string;
  typeContrat?: TypeContrat[];
  niveauEtude?: NiveauEtude[];
  localisation?: string[];
  organismes?: string[];
  salaireMin?: number;
  salaireMax?: number;
  datePublication?: {
    debut?: Date;
    fin?: Date;
  };
  statut?: StatutOffre[];
}

export interface StatistiquesEmploi {
  totalOffres: number;
  offresActives: number;
  offresPourvues: number;
  totalCandidatures: number;
  candidaturesEnCours: number;
  tauxConversion: number;
  delaiMoyenRecrutement: number;
  topCompetences: { competence: string; demandes: number }[];
  repartitionContrats: { type: TypeContrat; nombre: number }[];
  evolutionOffres: { mois: string; nombre: number }[];
}
