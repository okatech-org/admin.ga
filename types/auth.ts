export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER' | 'AGENT' | 'USER';

export type OrganizationType =
  | 'PRESIDENCE'
  | 'VICE_PRESIDENCE_REPUBLIQUE'
  | 'VICE_PRESIDENCE_GOUVERNEMENT'
  | 'MINISTERE_ETAT'
  | 'MINISTERE'
  | 'SECRETARIAT_GENERAL'
  | 'DIRECTION_GENERALE'
  | 'DIRECTION'
  | 'SERVICE'
  | 'GOUVERNORAT'
  | 'PREFECTURE'
  | 'MAIRIE'
  | 'ORGANISME_SOCIAL'
  | 'ETABLISSEMENT_PUBLIC'
  | 'AGENCE_NATIONALE'
  | 'CONSEIL_NATIONAL'
  | 'CABINET'
  | 'INSPECTION_GENERALE'
  | 'DIRECTION_CENTRALE_RH'
  | 'DIRECTION_CENTRALE_FINANCES'
  | 'DIRECTION_CENTRALE_SI'
  | 'DIRECTION_CENTRALE_JURIDIQUE'
  | 'DIRECTION_CENTRALE_COMMUNICATION'
  | 'INSTITUTION_SUPREME'
  | 'INSTITUTION_JUDICIAIRE'
  | 'POUVOIR_LEGISLATIF'
  | 'INSTITUTION_INDEPENDANTE'
  | 'AGENCE_SPECIALISEE'
  | 'AUTRE';

export interface User {
  id: string;
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  isVerified: boolean;
  organizationId?: string;
  organization?: Organization;
  createdAt: Date;
  updatedAt: Date;
}

export interface Organization {
  id: string;
  name: string;
  type: OrganizationType;
  code: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthSession {
  user: User;
  token: string;
  expiresAt: Date;
}
