import {
  OrganizationRelation,
  RelationRequest,
  RelationType,
  DataShareType,
  RelationStatus,
  AccessAction,
  DataShareAuditEntry,
  RelationAnalytics,
  OrganizationHierarchy,
  isRelationActive,
  canAccessData
} from '@/lib/types/organization-relations';

export class OrganizationRelationService {
  // Données simulées pour la démonstration
  private relations: OrganizationRelation[] = [
    {
      id: 'rel_001',
      fromOrgId: 'org_ministere_travail',
      toOrgId: 'org_direction_emploi',
      relationType: RelationType.HIERARCHICAL,
      dataShareType: DataShareType.FULL_ACCESS,
      status: RelationStatus.ACTIVE,
      startDate: '2024-01-01T00:00:00Z',
      approvedByFromOrg: true,
      approvedByToOrg: true,
      approvedAt: '2024-01-02T10:00:00Z',
      createdById: 'user_super_admin',
      priority: 'HIGH',
      accessCount: 156,
      notes: 'Relation hiérarchique - Direction sous tutelle du Ministère',
      createdAt: '2024-01-01T09:00:00Z',
      updatedAt: '2024-01-15T14:30:00Z'
    },
    {
      id: 'rel_002',
      fromOrgId: 'org_mairie_libreville',
      toOrgId: 'org_dgdi',
      relationType: RelationType.COLLABORATIVE,
      dataShareType: DataShareType.SPECIFIC_FIELDS,
      status: RelationStatus.ACTIVE,
      sharedData: {
        services: ['CNI', 'PASSPORT', 'BIRTH_CERTIFICATE'],
        fields: ['statistics', 'reports', 'user_counts'],
        timeRestrictions: {
          startHour: 8,
          endHour: 18,
          allowedDays: [1, 2, 3, 4, 5] // Lun-Ven
        }
      },
      permissions: {
        canView: true,
        canExport: true,
        canModify: false,
        canDelete: false,
        canCreateTickets: true,
        canViewStatistics: true,
        canAccessReports: true
      },
      startDate: '2024-01-10T00:00:00Z',
      approvedByFromOrg: true,
      approvedByToOrg: true,
      approvedAt: '2024-01-12T15:30:00Z',
      createdById: 'user_admin_mairie',
      priority: 'MEDIUM',
      accessCount: 89,
      notes: 'Partage de données statistiques entre la mairie et la DGDI',
      createdAt: '2024-01-10T11:20:00Z',
      updatedAt: '2024-01-15T09:15:00Z'
    },
    {
      id: 'rel_003',
      fromOrgId: 'org_cnss',
      toOrgId: 'org_cnamgs',
      relationType: RelationType.INFORMATIONAL,
      dataShareType: DataShareType.READ_ONLY,
      status: RelationStatus.PENDING,
      sharedData: {
        services: ['HEALTH_CARD', 'INSURANCE'],
        fields: ['beneficiaries', 'coverage_stats']
      },
      permissions: {
        canView: true,
        canExport: false,
        canModify: false,
        canDelete: false,
        canCreateTickets: false,
        canViewStatistics: true,
        canAccessReports: false
      },
      startDate: '2024-01-20T00:00:00Z',
      endDate: '2024-12-31T23:59:59Z',
      approvedByFromOrg: true,
      approvedByToOrg: false,
      createdById: 'user_admin_cnss',
      priority: 'LOW',
      accessCount: 0,
      notes: 'Accès informationnel pour coordination des services de santé',
      createdAt: '2024-01-20T16:45:00Z',
      updatedAt: '2024-01-20T16:45:00Z'
    }
  ];

  private auditEntries: DataShareAuditEntry[] = [
    {
      id: 'audit_001',
      relationId: 'rel_001',
      accessedById: 'user_agent_emploi',
      accessedOrgId: 'org_direction_emploi',
      dataType: 'service_statistics',
      action: AccessAction.VIEW,
      success: true,
      responseTime: 245,
      ipAddress: '192.168.1.10',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      createdAt: '2024-01-15T14:20:00Z'
    },
    {
      id: 'audit_002',
      relationId: 'rel_002',
      accessedById: 'user_manager_mairie',
      accessedOrgId: 'org_mairie_libreville',
      dataType: 'cni_reports',
      action: AccessAction.EXPORT,
      success: true,
      responseTime: 1203,
      ipAddress: '10.0.1.25',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X)',
      createdAt: '2024-01-15T11:30:00Z'
    }
  ];

  private organizations = [
    { id: 'org_ministere_travail', name: 'Ministère du Travail', code: 'MT', type: 'MINISTERE' },
    { id: 'org_direction_emploi', name: 'Direction de l\'Emploi', code: 'DE', type: 'DIRECTION' },
    { id: 'org_mairie_libreville', name: 'Mairie de Libreville', code: 'ML', type: 'MAIRIE' },
    { id: 'org_dgdi', name: 'DGDI', code: 'DGDI', type: 'DIRECTION' },
    { id: 'org_cnss', name: 'CNSS', code: 'CNSS', type: 'ORGANISME_SOCIAL' },
    { id: 'org_cnamgs', name: 'CNAMGS', code: 'CNAMGS', type: 'ORGANISME_SOCIAL' }
  ];

  /**
   * Créer une nouvelle relation entre organismes
   */
  async createRelation(request: RelationRequest, userId: string): Promise<OrganizationRelation> {
    // Validation des données
    this.validateRelationRequest(request);

    // Vérifier qu'une relation similaire n'existe pas déjà
    const existingRelation = this.relations.find(rel =>
      ((rel.fromOrgId === request.fromOrgId && rel.toOrgId === request.toOrgId) ||
       (rel.fromOrgId === request.toOrgId && rel.toOrgId === request.fromOrgId)) &&
      rel.relationType === request.relationType &&
      rel.status !== RelationStatus.REVOKED
    );

    if (existingRelation) {
      throw new Error('Une relation similaire existe déjà entre ces organismes');
    }

    // Vérifier la cohérence des relations hiérarchiques
    if (request.relationType === RelationType.HIERARCHICAL) {
      await this.validateHierarchicalRelation(request.fromOrgId, request.toOrgId);
    }

    // Créer la nouvelle relation
    const newRelation: OrganizationRelation = {
      id: `rel_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      fromOrgId: request.fromOrgId,
      toOrgId: request.toOrgId,
      relationType: request.relationType,
      dataShareType: request.dataShareType,
      status: RelationStatus.PENDING,
      sharedData: request.sharedData,
      permissions: request.permissions,
      startDate: new Date().toISOString(),
      endDate: request.endDate,
      approvedByFromOrg: true, // Auto-approuvé par l'org qui crée
      approvedByToOrg: false,
      createdById: userId,
      priority: request.priority || 'MEDIUM',
      accessCount: 0,
      notes: request.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.relations.push(newRelation);

    // Enregistrer dans l'audit
    await this.logAuditEntry({
      relationId: newRelation.id,
      accessedById: userId,
      accessedOrgId: request.fromOrgId,
      dataType: 'relation_creation',
      action: AccessAction.MODIFY,
      success: true,
      responseTime: 150
    });

    return this.enrichRelationData(newRelation);
  }

  /**
   * Obtenir toutes les relations d'un organisme
   */
  async getOrganizationRelations(orgId: string, filters?: {
    type?: RelationType;
    status?: RelationStatus;
    direction?: 'outgoing' | 'incoming' | 'all';
  }): Promise<OrganizationRelation[]> {
    let filteredRelations = this.relations.filter(rel =>
      rel.fromOrgId === orgId || rel.toOrgId === orgId
    );

    if (filters?.type) {
      filteredRelations = filteredRelations.filter(rel => rel.relationType === filters.type);
    }

    if (filters?.status) {
      filteredRelations = filteredRelations.filter(rel => rel.status === filters.status);
    }

    if (filters?.direction) {
      if (filters.direction === 'outgoing') {
        filteredRelations = filteredRelations.filter(rel => rel.fromOrgId === orgId);
      } else if (filters.direction === 'incoming') {
        filteredRelations = filteredRelations.filter(rel => rel.toOrgId === orgId);
      }
    }

    return filteredRelations.map(rel => this.enrichRelationData(rel));
  }

  /**
   * Approuver une relation
   */
  async approveRelation(relationId: string, approvingOrgId: string, userId: string): Promise<OrganizationRelation> {
    const relation = this.relations.find(rel => rel.id === relationId);
    if (!relation) {
      throw new Error('Relation non trouvée');
    }

    if (relation.fromOrgId !== approvingOrgId && relation.toOrgId !== approvingOrgId) {
      throw new Error('Organisation non autorisée à approuver cette relation');
    }

    // Mettre à jour l'approbation
    if (relation.fromOrgId === approvingOrgId) {
      relation.approvedByFromOrg = true;
    } else {
      relation.approvedByToOrg = true;
    }

    // Si les deux ont approuvé, activer la relation
    if (relation.approvedByFromOrg && relation.approvedByToOrg) {
      relation.status = RelationStatus.ACTIVE;
      relation.approvedAt = new Date().toISOString();
    }

    relation.updatedAt = new Date().toISOString();

    // Enregistrer dans l'audit
    await this.logAuditEntry({
      relationId: relation.id,
      accessedById: userId,
      accessedOrgId: approvingOrgId,
      dataType: 'relation_approval',
      action: AccessAction.MODIFY,
      success: true,
      responseTime: 120
    });

    return this.enrichRelationData(relation);
  }

  /**
   * Accéder aux données partagées
   */
  async accessSharedData(
    relationId: string,
    requestingOrgId: string,
    dataType: string,
    action: AccessAction,
    userId: string
  ): Promise<any> {
    const relation = this.relations.find(rel => rel.id === relationId);
    if (!relation) {
      throw new Error('Relation non trouvée');
    }

    // Vérifier les autorisations
    if (!canAccessData(relation, requestingOrgId, dataType, action)) {
      await this.logAuditEntry({
        relationId: relation.id,
        accessedById: userId,
        accessedOrgId: requestingOrgId,
        dataType,
        action,
        success: false,
        errorMessage: 'Accès refusé - permissions insuffisantes',
        responseTime: 50
      });
      throw new Error('Accès refusé - permissions insuffisantes');
    }

    // Vérifier les restrictions temporelles
    if (relation.sharedData?.timeRestrictions) {
      const now = new Date();
      const currentHour = now.getHours();
      const currentDay = now.getDay();

      const { startHour, endHour, allowedDays } = relation.sharedData.timeRestrictions;

      if (startHour && endHour && (currentHour < startHour || currentHour > endHour)) {
        throw new Error('Accès refusé - en dehors des heures autorisées');
      }

      if (allowedDays && !allowedDays.includes(currentDay)) {
        throw new Error('Accès refusé - jour non autorisé');
      }
    }

    // Simuler l'accès aux données
    const responseTime = Math.floor(Math.random() * 1000) + 100;
    await new Promise(resolve => setTimeout(resolve, responseTime));

    // Incrémenter le compteur d'accès
    relation.accessCount++;
    relation.lastAccessedAt = new Date().toISOString();
    relation.updatedAt = new Date().toISOString();

    // Enregistrer dans l'audit
    await this.logAuditEntry({
      relationId: relation.id,
      accessedById: userId,
      accessedOrgId: requestingOrgId,
      dataType,
      action,
      success: true,
      responseTime
    });

    // Retourner des données simulées
          // ⚠️ DONNÉES FICTIVES SUPPRIMÉES - Retour d'erreur explicite
      return this.generateMockData(dataType, action);
  }

  /**
   * Obtenir la hiérarchie d'un organisme
   */
  async getOrganizationHierarchy(orgId: string): Promise<OrganizationHierarchy | null> {
    // Simulation de la hiérarchie
    const hierarchies: OrganizationHierarchy[] = [
      {
        id: 'org_ministere_travail',
        name: 'Ministère du Travail',
        code: 'MT',
        type: 'MINISTERE',
        level: 0,
        childOrgs: [
          {
            id: 'org_direction_emploi',
            name: 'Direction de l\'Emploi',
            code: 'DE',
            type: 'DIRECTION',
            level: 1,
            parentOrgId: 'org_ministere_travail',
            childOrgs: [],
            relationCount: 3,
            sharedServicesCount: 5
          }
        ],
        relationCount: 5,
        sharedServicesCount: 12
      }
    ];

    return hierarchies.find(h => h.id === orgId) || null;
  }

  /**
   * Obtenir les statistiques et analytics
   */
  async getRelationAnalytics(orgId?: string): Promise<RelationAnalytics> {
    const relevantRelations = orgId
      ? this.relations.filter(rel => rel.fromOrgId === orgId || rel.toOrgId === orgId)
      : this.relations;

    const relevantAudits = orgId
      ? this.auditEntries.filter(audit => audit.accessedOrgId === orgId)
      : this.auditEntries;

    return {
      totalRelations: relevantRelations.length,
      relationsByType: {
        [RelationType.HIERARCHICAL]: relevantRelations.filter(r => r.relationType === RelationType.HIERARCHICAL).length,
        [RelationType.COLLABORATIVE]: relevantRelations.filter(r => r.relationType === RelationType.COLLABORATIVE).length,
        [RelationType.INFORMATIONAL]: relevantRelations.filter(r => r.relationType === RelationType.INFORMATIONAL).length
      },
      relationsByStatus: {
        [RelationStatus.PENDING]: relevantRelations.filter(r => r.status === RelationStatus.PENDING).length,
        [RelationStatus.ACTIVE]: relevantRelations.filter(r => r.status === RelationStatus.ACTIVE).length,
        [RelationStatus.SUSPENDED]: relevantRelations.filter(r => r.status === RelationStatus.SUSPENDED).length,
        [RelationStatus.EXPIRED]: relevantRelations.filter(r => r.status === RelationStatus.EXPIRED).length,
        [RelationStatus.REVOKED]: relevantRelations.filter(r => r.status === RelationStatus.REVOKED).length
      },
      totalDataAccesses: relevantAudits.length,
      accessesByDataType: relevantAudits.reduce((acc, audit) => {
        acc[audit.dataType] = (acc[audit.dataType] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      topAccessedOrganizations: this.getTopAccessedOrganizations(relevantAudits),
      securityAlerts: [
        {
          type: 'SUSPICIOUS_ACCESS',
          count: 0,
          lastOccurrence: new Date().toISOString()
        },
        {
          type: 'FAILED_AUTH',
          count: 2,
          lastOccurrence: '2024-01-14T22:15:00Z'
        },
        {
          type: 'UNUSUAL_ACTIVITY',
          count: 1,
          lastOccurrence: '2024-01-13T18:45:00Z'
        }
      ],
      performanceMetrics: {
        avgResponseTime: relevantAudits.reduce((sum, audit) => sum + (audit.responseTime || 0), 0) / relevantAudits.length || 0,
        successRate: relevantAudits.filter(audit => audit.success).length / relevantAudits.length * 100 || 100,
        errorRate: relevantAudits.filter(audit => !audit.success).length / relevantAudits.length * 100 || 0
      }
    };
  }

  /**
   * Suspendre ou révoquer une relation
   */
  async updateRelationStatus(
    relationId: string,
    newStatus: RelationStatus,
    reason: string,
    userId: string
  ): Promise<OrganizationRelation> {
    const relation = this.relations.find(rel => rel.id === relationId);
    if (!relation) {
      throw new Error('Relation non trouvée');
    }

    relation.status = newStatus;
    relation.updatedAt = new Date().toISOString();
    relation.notes = `${relation.notes || ''}\n[${new Date().toISOString()}] Statut changé vers ${newStatus}: ${reason}`;

    await this.logAuditEntry({
      relationId: relation.id,
      accessedById: userId,
      accessedOrgId: relation.fromOrgId,
      dataType: 'relation_status_change',
      action: AccessAction.MODIFY,
      success: true,
      responseTime: 100
    });

    return this.enrichRelationData(relation);
  }

  // Méthodes privées

  private validateRelationRequest(request: RelationRequest): void {
    if (request.fromOrgId === request.toOrgId) {
      throw new Error('Une organisation ne peut pas avoir une relation avec elle-même');
    }

    if (!Object.values(RelationType).includes(request.relationType)) {
      throw new Error('Type de relation invalide');
    }

    if (!Object.values(DataShareType).includes(request.dataShareType)) {
      throw new Error('Type de partage de données invalide');
    }

    if (request.endDate) {
      const endDate = new Date(request.endDate);
      const now = new Date();
      if (endDate <= now) {
        throw new Error('La date de fin doit être dans le futur');
      }
    }
  }

  private async validateHierarchicalRelation(parentOrgId: string, childOrgId: string): Promise<void> {
    // Vérifier qu'il n'y a pas de relation circulaire
    const existingHierarchy = await this.getOrganizationHierarchy(childOrgId);
    if (existingHierarchy) {
      // Vérifier que parentOrgId n'est pas un descendant de childOrgId
      const isCircular = this.checkCircularRelation(existingHierarchy, parentOrgId);
      if (isCircular) {
        throw new Error('Relation circulaire détectée - impossible de créer cette hiérarchie');
      }
    }
  }

  private checkCircularRelation(hierarchy: OrganizationHierarchy, targetOrgId: string): boolean {
    if (hierarchy.id === targetOrgId) return true;

    for (const child of hierarchy.childOrgs) {
      if (this.checkCircularRelation(child, targetOrgId)) {
        return true;
      }
    }

    return false;
  }

  private enrichRelationData(relation: OrganizationRelation): OrganizationRelation {
    const fromOrg = this.organizations.find(org => org.id === relation.fromOrgId);
    const toOrg = this.organizations.find(org => org.id === relation.toOrgId);

    return {
      ...relation,
      fromOrg: fromOrg ? {
        id: fromOrg.id,
        name: fromOrg.name,
        code: fromOrg.code,
        type: fromOrg.type,
        status: 'ACTIVE',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: new Date().toISOString()
      } : undefined,
      toOrg: toOrg ? {
        id: toOrg.id,
        name: toOrg.name,
        code: toOrg.code,
        type: toOrg.type,
        status: 'ACTIVE',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: new Date().toISOString()
      } : undefined
    };
  }

  private async logAuditEntry(entry: Partial<DataShareAuditEntry>): Promise<void> {
    const auditEntry: DataShareAuditEntry = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      relationId: entry.relationId!,
      accessedById: entry.accessedById!,
      accessedOrgId: entry.accessedOrgId!,
      dataType: entry.dataType!,
      action: entry.action!,
      success: entry.success ?? true,
      errorMessage: entry.errorMessage,
      responseTime: entry.responseTime || Math.floor(Math.random() * 500) + 100,
      ipAddress: entry.ipAddress || '192.168.1.' + Math.floor(Math.random() * 255),
      userAgent: entry.userAgent || 'Admin.GA/1.0',
      createdAt: new Date().toISOString()
    };

    this.auditEntries.push(auditEntry);
  }

  private generateMockData(dataType: string, action: AccessAction): any {
    // ⚠️ DONNÉES FICTIVES SUPPRIMÉES - Ces données polluantes ont été retirées
    return {
      error: 'DONNÉES_FICTIVES_SUPPRIMÉES',
      message: `Les données mock pour '${dataType}' ont été supprimées du code.`,
      solution: 'Implémenter une vraie API avec données PostgreSQL',
      dataType,
      action,
      timestamp: new Date().toISOString()
    };
  }

  private getTopAccessedOrganizations(audits: DataShareAuditEntry[]): Array<{
    orgId: string;
    orgName: string;
    accessCount: number;
  }> {
    const accessCounts = audits.reduce((acc, audit) => {
      acc[audit.accessedOrgId] = (acc[audit.accessedOrgId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(accessCounts)
      .map(([orgId, count]) => ({
        orgId,
        orgName: this.organizations.find(org => org.id === orgId)?.name || 'Organisation inconnue',
        accessCount: count
      }))
      .sort((a, b) => b.accessCount - a.accessCount)
      .slice(0, 5);
  }

  /**
   * Obtenir toutes les organisations disponibles
   */
  async getAvailableOrganizations(): Promise<Array<{id: string, name: string, code: string, type: string}>> {
    return this.organizations;
  }

  /**
   * Rechercher des relations
   */
  async searchRelations(query: string): Promise<OrganizationRelation[]> {
    const lowerQuery = query.toLowerCase();
    return this.relations
      .filter(rel => {
        const fromOrg = this.organizations.find(org => org.id === rel.fromOrgId);
        const toOrg = this.organizations.find(org => org.id === rel.toOrgId);

        return fromOrg?.name.toLowerCase().includes(lowerQuery) ||
               toOrg?.name.toLowerCase().includes(lowerQuery) ||
               rel.notes?.toLowerCase().includes(lowerQuery);
      })
      .map(rel => this.enrichRelationData(rel));
  }
}

// Instance singleton du service
export const organizationRelationService = new OrganizationRelationService();
