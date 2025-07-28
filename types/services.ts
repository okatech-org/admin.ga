export type ServiceType = 
  | 'ACTE_NAISSANCE'
  | 'ACTE_MARIAGE'
  | 'ACTE_DECES'
  | 'CERTIFICAT_VIE'
  | 'CERTIFICAT_CELIBAT'
  | 'CNI'
  | 'PASSEPORT'
  | 'PERMIS_CONDUIRE'
  | 'CARTE_SEJOUR'
  | 'CASIER_JUDICIAIRE'
  | 'CERTIFICAT_NATIONALITE'
  | 'LEGALISATION'
  | 'PERMIS_CONSTRUIRE'
  | 'AUTORISATION_COMMERCE'
  | 'CERTIFICAT_RESIDENCE'
  | 'ACTE_FONCIER'
  | 'IMMATRICULATION_CNSS'
  | 'CARTE_CNAMGS'
  | 'ATTESTATION_CHOMAGE'
  | 'ATTESTATION_TRAVAIL';

export type RequestStatus = 
  | 'DRAFT'
  | 'SUBMITTED'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'PENDING_DOCUMENTS'
  | 'VALIDATED'
  | 'READY'
  | 'COMPLETED'
  | 'REJECTED'
  | 'CANCELLED';

export type AppointmentStatus = 
  | 'SCHEDULED'
  | 'CONFIRMED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'NO_SHOW';

export interface ServiceRequest {
  id: string;
  type: ServiceType;
  status: RequestStatus;
  submittedAt: Date;
  submittedBy: string; // User ID
  assignedTo?: string; // Agent ID
  organizationId: string;
  documents: Document[];
  notes?: string;
  estimatedCompletion?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  url: string;
  size: number;
  uploadedAt: Date;
  uploadedBy: string; // User ID
  isRequired: boolean;
  isVerified: boolean;
  verifiedBy?: string; // Agent ID
  verifiedAt?: Date;
}

export interface Appointment {
  id: string;
  date: Date;
  duration: number; // en minutes
  status: AppointmentStatus;
  citizenId: string;
  agentId: string;
  serviceType: ServiceType;
  organizationId: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}