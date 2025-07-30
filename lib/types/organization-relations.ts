// Types pour les relations inter-organismes dans Admin.ga
export enum RelationType {
  HIERARCHICAL = 'HIERARCHICAL',    // Relation parent-enfant
  COLLABORATIVE = 'COLLABORATIVE',  // Partage d'informations entre pairs
  INFORMATIONAL = 'INFORMATIONAL'   // Accès en lecture seule
}

export enum DataShareType {
  FULL_ACCESS = 'FULL_ACCESS',       // Accès complet aux données
  READ_ONLY = 'READ_ONLY',           // Lecture seule
  SPECIFIC_FIELDS = 'SPECIFIC_FIELDS', // Accès à des champs spécifiques
  CUSTOM = 'CUSTOM'                  // Configuration personnalisée
}

export enum RelationStatus {
  PENDING = 'PENDING',               // En attente d'approbation
  ACTIVE = 'ACTIVE',                 // Relation active
  SUSPENDED = 'SUSPENDED',           // Temporairement suspendue
  EXPIRED = 'EXPIRED',               // Expirée
  REVOKED = 'REVOKED'                // Révoquée
}

export enum AccessAction {
  VIEW = 'VIEW',
  EXPORT = 'EXPORT',
  MODIFY = 'MODIFY',
  DELETE = 'DELETE'
}

export interface SharedDataConfig {
  services?: string[];               // Services partagés (ex: ['CNI', 'PASSPORT'])
  fields?: string[];                 // Champs spécifiques (ex: ['statistics', 'reports'])
  excludedFields?: string[];         // Champs exclus
  customConfig?: Record<string, any>; // Configuration personnalisée
  timeRestrictions?: {               // Restrictions temporelles
    startHour?: number;
    endHour?: number;
    allowedDays?: number[];          // 0=dimanche, 1=lundi, etc.
  };
  ipRestrictions?: string[];         // Adresses IP autorisées
}

export interface RelationPermissions {
  canView: boolean;
  canExport: boolean;
  canModify: boolean;
  canDelete: boolean;
  canCreateTickets: boolean;
  canViewStatistics: boolean;
  canAccessReports: boolean;
  customPermissions?: Record<string, boolean>;
}

export interface OrganizationRelation {
  id: string;

  // Organisations impliquées
  fromOrgId: string;
  fromOrg?: Organization;
  toOrgId: string;
  toOrg?: Organization;

  // Type et configuration de la relation
  relationType: RelationType;
  dataShareType: DataShareType;
  status: RelationStatus;

  // Données partagées
  sharedData?: SharedDataConfig;
  permissions?: RelationPermissions;

  // Dates et durée
  startDate: string;
  endDate?: string;

  // Approbations
  approvedByFromOrg: boolean;
  approvedByToOrg: boolean;
  approvedAt?: string;

  // Métadonnées
  createdById: string;
  createdBy?: User;
  notes?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

  // Audit
  lastAccessedAt?: string;
  accessCount: number;

  createdAt: string;
  updatedAt: string;
}

export interface OrganizationHierarchy {
  id: string;
  name: string;
  code: string;
  type: string;
  level: number;                     // Niveau dans la hiérarchie (0 = racine)
  parentOrgId?: string;
  parentOrg?: OrganizationHierarchy;
  childOrgs: OrganizationHierarchy[];
  relationCount: number;             // Nombre de relations actives
  sharedServicesCount: number;       // Nombre de services partagés
}

export interface DataShareAuditEntry {
  id: string;
  relationId: string;
  relation?: OrganizationRelation;

  // Détails de l'accès
  accessedById: string;
  accessedBy?: User;
  accessedOrgId: string;
  accessedOrg?: Organization;

  // Données accédées
  dataType: string;                  // "service_request", "statistics", "reports", etc.
  dataId?: string;                   // ID spécifique si applicable
  action: AccessAction;

  // Résultat
  success: boolean;
  errorMessage?: string;
  responseTime?: number;             // Temps de réponse en ms

  // Métadonnées de sécurité
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;

  createdAt: string;
}

export interface RelationRequest {
  fromOrgId: string;
  toOrgId: string;
  relationType: RelationType;
  dataShareType: DataShareType;
  sharedData?: SharedDataConfig;
  permissions?: RelationPermissions;
  endDate?: string;
  notes?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
}

export interface RelationAnalytics {
  totalRelations: number;
  relationsByType: Record<RelationType, number>;
  relationsByStatus: Record<RelationStatus, number>;
  totalDataAccesses: number;
  accessesByDataType: Record<string, number>;
  topAccessedOrganizations: Array<{
    orgId: string;
    orgName: string;
    accessCount: number;
  }>;
  securityAlerts: Array<{
    type: 'SUSPICIOUS_ACCESS' | 'FAILED_AUTH' | 'UNUSUAL_ACTIVITY';
    count: number;
    lastOccurrence: string;
  }>;
  performanceMetrics: {
    avgResponseTime: number;
    successRate: number;
    errorRate: number;
  };
}

export interface Organization {
  id: string;
  name: string;
  code: string;
  type: string;
  description?: string;
  logo?: string;
  contact?: {
    email?: string;
    phone?: string;
    address?: string;
  };
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  hierarchyLevel?: number;
  parentOrgId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  organizationId?: string;
}

// Utilitaires pour la validation
export const RELATION_TYPE_LABELS: Record<RelationType, string> = {
  [RelationType.HIERARCHICAL]: 'Hiérarchique',
  [RelationType.COLLABORATIVE]: 'Collaborative',
  [RelationType.INFORMATIONAL]: 'Informationnelle'
};

export const DATA_SHARE_TYPE_LABELS: Record<DataShareType, string> = {
  [DataShareType.FULL_ACCESS]: 'Accès complet',
  [DataShareType.READ_ONLY]: 'Lecture seule',
  [DataShareType.SPECIFIC_FIELDS]: 'Champs spécifiques',
  [DataShareType.CUSTOM]: 'Configuration personnalisée'
};

export const RELATION_STATUS_LABELS: Record<RelationStatus, string> = {
  [RelationStatus.PENDING]: 'En attente',
  [RelationStatus.ACTIVE]: 'Active',
  [RelationStatus.SUSPENDED]: 'Suspendue',
  [RelationStatus.EXPIRED]: 'Expirée',
  [RelationStatus.REVOKED]: 'Révoquée'
};

// Fonctions utilitaires
export function getRelationDirection(relation: OrganizationRelation, currentOrgId: string): 'outgoing' | 'incoming' {
  return relation.fromOrgId === currentOrgId ? 'outgoing' : 'incoming';
}

export function getPartnerOrganization(relation: OrganizationRelation, currentOrgId: string): Organization | undefined {
  if (relation.fromOrgId === currentOrgId) {
    return relation.toOrg;
  }
  return relation.fromOrg;
}

export function isRelationActive(relation: OrganizationRelation): boolean {
  if (relation.status !== RelationStatus.ACTIVE) return false;
  if (!relation.approvedByFromOrg || !relation.approvedByToOrg) return false;

  if (relation.endDate) {
    const endDate = new Date(relation.endDate);
    const now = new Date();
    if (endDate < now) return false;
  }

  return true;
}

export function canAccessData(
  relation: OrganizationRelation,
  requestingOrgId: string,
  dataType: string,
  action: AccessAction
): boolean {
  if (!isRelationActive(relation)) return false;

  // Vérifier si l'organisation a le droit d'accéder
  const isAuthorizedOrg = relation.fromOrgId === requestingOrgId || relation.toOrgId === requestingOrgId;
  if (!isAuthorizedOrg) return false;

  // Vérifier les permissions spécifiques
  if (relation.permissions) {
    switch (action) {
      case AccessAction.VIEW:
        return relation.permissions.canView;
      case AccessAction.EXPORT:
        return relation.permissions.canExport;
      case AccessAction.MODIFY:
        return relation.permissions.canModify;
      case AccessAction.DELETE:
        return relation.permissions.canDelete;
      default:
        return false;
    }
  }

  // Vérifier selon le type de partage
  switch (relation.dataShareType) {
    case DataShareType.FULL_ACCESS:
      return true;
    case DataShareType.READ_ONLY:
      return action === AccessAction.VIEW;
    case DataShareType.SPECIFIC_FIELDS:
      return relation.sharedData?.fields?.includes(dataType) || false;
    case DataShareType.CUSTOM:
      return relation.sharedData?.customConfig?.[dataType]?.[action] || false;
    default:
      return false;
  }
}
