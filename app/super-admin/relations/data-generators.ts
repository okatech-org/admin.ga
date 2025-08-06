// Générateurs de données pour la démonstration des 141 organismes gabonais
import {
  OrganizationRelation,
  RelationType,
  RelationStatus,
  DataShareType,
  RelationAnalytics
} from '@/lib/types/organization-relations';

// Génération de données mock pour démonstration des 141 organismes
export const generateMockOrganizations = () => {
  const types = ['MINISTERE', 'DIRECTION', 'MAIRIE', 'ORGANISME_SOCIAL', 'AUTRE'];
  const mockOrgs = [];

  // Organismes réels du gouvernement gabonais
  const realOrganisms = [
    { name: 'Direction Générale de la Digitalisation et de l\'Innovation', code: 'DGDI', type: 'DIRECTION' },
    { name: 'Ministère de l\'Économie Numérique', code: 'MEN', type: 'MINISTERE' },
    { name: 'Ministère de l\'Intérieur', code: 'MI', type: 'MINISTERE' },
    { name: 'Ministère de la Justice', code: 'MJ', type: 'MINISTERE' },
    { name: 'Ministère des Finances', code: 'MF', type: 'MINISTERE' },
    { name: 'Ministère de la Santé', code: 'MS', type: 'MINISTERE' },
    { name: 'Ministère de l\'Éducation', code: 'ME', type: 'MINISTERE' },
    { name: 'Ministère du Travail', code: 'MT', type: 'MINISTERE' },
    { name: 'Ministère de l\'Agriculture', code: 'MA', type: 'MINISTERE' },
    { name: 'Ministère du Commerce', code: 'MC', type: 'MINISTERE' },
    { name: 'Ministère des Transports', code: 'MTR', type: 'MINISTERE' },
    { name: 'Ministère de l\'Environnement', code: 'MEV', type: 'MINISTERE' },
    { name: 'Ministère de la Défense', code: 'MD', type: 'MINISTERE' },
    { name: 'Ministère des Affaires Étrangères', code: 'MAE', type: 'MINISTERE' },
    { name: 'Ministère de l\'Enseignement Supérieur', code: 'MES', type: 'MINISTERE' },
    { name: 'Mairie de Libreville', code: 'ML', type: 'MAIRIE' },
    { name: 'Mairie de Port-Gentil', code: 'MPG', type: 'MAIRIE' },
    { name: 'Mairie de Franceville', code: 'MFV', type: 'MAIRIE' },
    { name: 'Mairie d\'Oyem', code: 'MOY', type: 'MAIRIE' },
    { name: 'Mairie de Lambaréné', code: 'MLAB', type: 'MAIRIE' },
    { name: 'CNSS Gabon', code: 'CNSS', type: 'ORGANISME_SOCIAL' },
    { name: 'CNAMGS', code: 'CNAMGS', type: 'ORGANISME_SOCIAL' },
    { name: 'Direction de l\'État Civil', code: 'DEC', type: 'DIRECTION' },
    { name: 'Direction Générale des Impôts', code: 'DGI', type: 'DIRECTION' },
    { name: 'Direction Générale des Douanes', code: 'DGD', type: 'DIRECTION' },
    { name: 'Direction de la Police Nationale', code: 'DPN', type: 'DIRECTION' },
    { name: 'Direction des Ressources Humaines', code: 'DRH', type: 'DIRECTION' },
    { name: 'Direction du Budget', code: 'DB', type: 'DIRECTION' },
    { name: 'Direction de la Comptabilité Publique', code: 'DCP', type: 'DIRECTION' },
    { name: 'Direction de l\'Urbanisme', code: 'DU', type: 'DIRECTION' }
  ];

  // Ajouter les organismes réels
  realOrganisms.forEach((org, index) => {
    mockOrgs.push({
      id: `org-${index + 1}`,
      name: org.name,
      code: org.code,
      type: org.type,
      level: org.type === 'MINISTERE' ? 1 : org.type === 'DIRECTION' ? 2 : 3,
      isActive: true,
      address: `${org.name}, Libreville, Gabon`,
      phone: `+241 01 23 45 ${(index + 1).toString().padStart(2, '0')}`,
      email: `contact@${org.code.toLowerCase()}.ga`,
      description: `${org.name} - Service public gabonais`,
      website: `https://${org.code.toLowerCase()}.gouv.ga`,
      createdAt: new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
      updatedAt: new Date().toISOString()
    });
  });

  // Compléter avec des organismes génériques pour atteindre 141
  const additionalTypes = [
    'Centre de Formation Professionnelle',
    'Établissement Public Administratif',
    'Agence Technique Spécialisée',
    'Service Déconcentré',
    'Collectivité Territoriale',
    'Organisme Consulaire',
    'Institution Spécialisée'
  ];

  for (let i = realOrganisms.length + 1; i <= 141; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const additionalType = additionalTypes[Math.floor(Math.random() * additionalTypes.length)];

    mockOrgs.push({
      id: `org-${i}`,
      name: `${type === 'MINISTERE' ? 'Ministère' : type === 'DIRECTION' ? 'Direction' : type === 'MAIRIE' ? 'Mairie' : additionalType} ${i}`,
      code: `ORG${i.toString().padStart(3, '0')}`,
      type: type,
      level: type === 'MINISTERE' ? 1 : type === 'DIRECTION' ? 2 : Math.floor(Math.random() * 3) + 3,
      isActive: Math.random() > 0.03, // 97% actifs
      address: `Adresse ${i}, ${Math.random() > 0.4 ? 'Libreville' : Math.random() > 0.5 ? 'Port-Gentil' : Math.random() > 0.5 ? 'Franceville' : 'Oyem'}`,
      phone: `+241 01 ${Math.floor(Math.random() * 90) + 10} ${Math.floor(Math.random() * 90) + 10} ${Math.floor(Math.random() * 90) + 10}`,
      email: `contact@organisme${i}.ga`,
      description: `${additionalType} ${i} - Service public gabonais`,
      website: `https://organisme${i}.gouv.ga`,
      createdAt: new Date(2019 + Math.floor(Math.random() * 5), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
      updatedAt: new Date().toISOString()
    });
  }

  return mockOrgs;
};

// Génération de relations mock entre organismes
export const generateMockRelations = (orgs: any[]) => {
  const relations: OrganizationRelation[] = [];
  const relationTypes = Object.values(RelationType);
  const statuses = Object.values(RelationStatus);
  const dataShareTypes = Object.values(DataShareType);
  const priorities = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

  // Fonction utilitaire pour créer une relation
  function createRelation(fromOrg: any, toOrg: any, relationType: RelationType, priority: string): OrganizationRelation {
    const baseDate = new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
    const randomDays = Math.floor(Math.random() * 365);
    const createdAt = new Date(baseDate.getTime() + randomDays * 24 * 60 * 60 * 1000);

    // Probabilité de statut selon le type de relation
    let status = RelationStatus.ACTIVE;
    const rand = Math.random();
    if (rand < 0.1) status = RelationStatus.PENDING;
    else if (rand < 0.15) status = RelationStatus.SUSPENDED;
    else if (rand < 0.18) status = RelationStatus.EXPIRED;
    else if (rand < 0.2) status = RelationStatus.REVOKED;

    return {
      id: `rel-${fromOrg.id}-${toOrg.id}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      fromOrgId: fromOrg.id,
      toOrgId: toOrg.id,
      fromOrg: fromOrg,
      toOrg: toOrg,
      relationType: relationType,
      dataShareType: dataShareTypes[Math.floor(Math.random() * dataShareTypes.length)],
      status: status,
      priority: priority as any,
      accessCount: Math.floor(Math.random() * 2000),
      startDate: createdAt.toISOString(),
      endDate: Math.random() > 0.7 ? new Date(createdAt.getTime() + (Math.random() * 2 + 1) * 365 * 24 * 60 * 60 * 1000).toISOString() : undefined,
      approvedByFromOrg: Math.random() > 0.1,
      approvedByToOrg: Math.random() > 0.15,
      approvedAt: Math.random() > 0.2 ? new Date(createdAt.getTime() + Math.floor(Math.random() * 14) * 24 * 60 * 60 * 1000).toISOString() : undefined,
      notes: Math.random() > 0.6 ? `Relation ${relationType.toLowerCase()} établie entre ${fromOrg.name} et ${toOrg.name}` : undefined,
      permissions: {
        canView: true,
        canExport: Math.random() > 0.3,
        canModify: Math.random() > 0.5,
        canDelete: Math.random() > 0.7,
        canCreateTickets: Math.random() > 0.4,
        canViewStatistics: true,
        canAccessReports: Math.random() > 0.5
      },
      createdAt: createdAt.toISOString(),
      updatedAt: new Date(createdAt.getTime() + Math.floor(Math.random() * 180) * 24 * 60 * 60 * 1000).toISOString(),
      createdById: 'system'
    };
  }

  // Séparer les organismes par type
  const ministeres = orgs.filter(org => org.type === 'MINISTERE');
  const directions = orgs.filter(org => org.type === 'DIRECTION');
  const mairies = orgs.filter(org => org.type === 'MAIRIE');
  const organismesSpeciaux = orgs.filter(org => ['ORGANISME_SOCIAL', 'AUTRE'].includes(org.type));

  console.log(`📊 Distribution: ${ministeres.length} ministères, ${directions.length} directions, ${mairies.length} mairies, ${organismesSpeciaux.length} autres`);

  // 1. Relations hiérarchiques : Ministères -> Directions (forte probabilité)
  ministeres.forEach(ministere => {
    const relatedDirections = directions
      .filter(() => Math.random() > 0.4) // 60% de chance par direction
      .slice(0, Math.floor(Math.random() * 4) + 2); // 2-5 directions par ministère

    relatedDirections.forEach(direction => {
      relations.push(createRelation(ministere, direction, RelationType.HIERARCHICAL, 'HIGH'));
    });
  });

  // 2. Relations collaboratives entre ministères (modérée)
  ministeres.forEach((ministere, index) => {
    const collaborators = ministeres
      .slice(index + 1)
      .filter(() => Math.random() > 0.6) // 40% de chance
      .slice(0, 3); // Max 3 collaborations par ministère

    collaborators.forEach(collaborator => {
      relations.push(createRelation(ministere, collaborator, RelationType.COLLABORATIVE, 'MEDIUM'));
    });
  });

  // 3. Relations informationnelles : Mairies -> Directions (forte)
  mairies.forEach(mairie => {
    const targetDirections = directions
      .filter(() => Math.random() > 0.3) // 70% de chance
      .slice(0, Math.floor(Math.random() * 5) + 2); // 2-6 directions par mairie

    targetDirections.forEach(direction => {
      relations.push(createRelation(mairie, direction, RelationType.INFORMATIONAL, 'MEDIUM'));
    });
  });

  // 4. Relations collaboratives entre mairies (faible)
  mairies.forEach((mairie, index) => {
    const collaborators = mairies
      .slice(index + 1)
      .filter(() => Math.random() > 0.8) // 20% de chance
      .slice(0, 2); // Max 2 collaborations

    collaborators.forEach(collaborator => {
      relations.push(createRelation(mairie, collaborator, RelationType.COLLABORATIVE, 'LOW'));
    });
  });

  // 5. Relations avec organismes spéciaux
  organismesSpeciaux.forEach(orgSpecial => {
    // Vers ministères (moyenne)
    const targetMinisteres = ministeres
      .filter(() => Math.random() > 0.5) // 50% de chance
      .slice(0, Math.floor(Math.random() * 3) + 1);

    targetMinisteres.forEach(ministere => {
      const relType = Math.random() > 0.5 ? RelationType.COLLABORATIVE : RelationType.INFORMATIONAL;
      relations.push(createRelation(orgSpecial, ministere, relType, 'MEDIUM'));
    });

    // Vers directions (faible)
    const targetDirections = directions
      .filter(() => Math.random() > 0.7) // 30% de chance
      .slice(0, Math.floor(Math.random() * 2) + 1);

    targetDirections.forEach(direction => {
      relations.push(createRelation(orgSpecial, direction, RelationType.INFORMATIONAL, 'LOW'));
    });
  });

  // 6. Relations supplémentaires aléatoires pour densifier le réseau
  const allOrgs = [...orgs];
  const additionalRelationsCount = Math.floor(orgs.length * 0.3); // 30% d'organismes auront des relations supplémentaires

  for (let i = 0; i < additionalRelationsCount; i++) {
    const fromOrg = allOrgs[Math.floor(Math.random() * allOrgs.length)];
    const toOrg = allOrgs[Math.floor(Math.random() * allOrgs.length)];

    if (fromOrg.id === toOrg.id) continue;

    // Éviter les doublons
    const exists = relations.find(rel =>
      (rel.fromOrgId === fromOrg.id && rel.toOrgId === toOrg.id) ||
      (rel.fromOrgId === toOrg.id && rel.toOrgId === fromOrg.id)
    );

    if (!exists) {
      const relType = relationTypes[Math.floor(Math.random() * relationTypes.length)];
      const priority = priorities[Math.floor(Math.random() * priorities.length)];
      relations.push(createRelation(fromOrg, toOrg, relType, priority));
    }
  }

  console.log(`🔗 Généré ${relations.length} relations entre ${orgs.length} organismes`);
  console.log(`📈 Répartition: ${relations.filter(r => r.relationType === RelationType.HIERARCHICAL).length} hiérarchiques, ${relations.filter(r => r.relationType === RelationType.COLLABORATIVE).length} collaboratives, ${relations.filter(r => r.relationType === RelationType.INFORMATIONAL).length} informationnelles`);

  return relations;
};

// Calcul des analytics côté client
export const computeAnalyticsFromData = (relationsData: OrganizationRelation[], orgsData: any[]): RelationAnalytics => {
  const totalRelations = relationsData.length;

  const relationsByType = relationsData.reduce((acc, rel) => {
    acc[rel.relationType] = (acc[rel.relationType] || 0) + 1;
    return acc;
  }, {} as Record<RelationType, number>);

  const relationsByStatus = relationsData.reduce((acc, rel) => {
    acc[rel.status] = (acc[rel.status] || 0) + 1;
    return acc;
  }, {} as Record<RelationStatus, number>);

  const totalDataAccesses = relationsData.reduce((sum, rel) => sum + (rel.accessCount || 0), 0);

  // Calcul des organismes les plus actifs
  const orgAccessCounts = new Map<string, number>();
  relationsData.forEach(rel => {
    const fromAccess = rel.accessCount || 0;
    orgAccessCounts.set(rel.fromOrgId, (orgAccessCounts.get(rel.fromOrgId) || 0) + fromAccess);
    orgAccessCounts.set(rel.toOrgId, (orgAccessCounts.get(rel.toOrgId) || 0) + fromAccess);
  });

  const topAccessedOrganizations = Array.from(orgAccessCounts.entries())
    .map(([orgId, accessCount]) => ({
      orgId,
      orgName: orgsData.find(org => org.id === orgId)?.name || 'Inconnu',
      accessCount
    }))
    .sort((a, b) => b.accessCount - a.accessCount)
    .slice(0, 10);

  // Métriques de performance simulées basées sur les données réelles
  const activeRelations = relationsData.filter(rel => rel.status === RelationStatus.ACTIVE).length;
  const pendingRelations = relationsData.filter(rel => rel.status === RelationStatus.PENDING).length;

  return {
    totalRelations,
    relationsByType,
    relationsByStatus,
    totalDataAccesses,
    accessesByDataType: {
      statistics: Math.floor(totalDataAccesses * 0.35),
      reports: Math.floor(totalDataAccesses * 0.28),
      user_data: Math.floor(totalDataAccesses * 0.22),
      services: Math.floor(totalDataAccesses * 0.15)
    },
    topAccessedOrganizations,
    securityAlerts: [
      {
        type: 'SUSPICIOUS_ACCESS',
        count: Math.floor(totalRelations * 0.001), // 0.1% des relations
        lastOccurrence: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        type: 'FAILED_AUTH',
        count: Math.floor(totalRelations * 0.002), // 0.2% des relations
        lastOccurrence: new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        type: 'UNUSUAL_ACTIVITY',
        count: Math.floor(totalRelations * 0.0015), // 0.15% des relations
        lastOccurrence: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString()
      }
    ],
    performanceMetrics: {
      avgResponseTime: Math.floor(200 + (totalRelations / 10)), // Plus de relations = plus de latence
      successRate: Math.max(95, 99.5 - (totalRelations / 1000)), // Performance légèrement dégradée avec plus de relations
      errorRate: Math.min(5, 0.5 + (totalRelations / 1000))
    }
  };
};
