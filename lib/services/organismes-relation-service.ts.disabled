/* @ts-nocheck */
import {
  ORGANISMES_GABONAIS_COMPLETS,
  OrganismeComplet,
  getOrganismeComplet,
  getOrganismesByType,
  getOrganismesByNiveau,
  getRelationsHierarchiques,
  getRelationsCollaboratives,
  getRelationsInformationnelles
} from '@/lib/config/organismes-complets';

// === INTERFACES ===
export interface RelationModification {
  id: string;
  sourceCode: string;
  targetCode: string;
  type: 'HIERARCHIQUE' | 'COLLABORATIVE' | 'INFORMATIONNELLE';
  action: 'ADD' | 'REMOVE' | 'MODIFY';
  timestamp: string;
  description: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  approvedBy?: string;
  approvedAt?: string;
  rejectedReason?: string;
  metadata?: Record<string, any>;
}

export interface RelationValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
}

export interface OrganismeRelationStats {
  totalOrganismes: number;
  totalRelations: number;
  relationsParType: Record<string, number>;
  relationsParNiveau: Record<string, number>;
  organismesSansRelations: string[];
  relationsDupliquees: Array<{
    source: string;
    target: string;
    types: string[];
  }>;
  grapheConnexite: {
    composantesConnexes: number;
    organismeIsoles: string[];
    centralite: Record<string, number>;
  };
}

export interface RelationSearchFilters {
  type?: 'HIERARCHIQUE' | 'COLLABORATIVE' | 'INFORMATIONNELLE';
  sourceType?: string;
  targetType?: string;
  niveau?: number;
  province?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  dateFrom?: string;
  dateTo?: string;
  keywords?: string;
}

export interface RelationRecommendation {
  id: string;
  sourceCode: string;
  targetCode: string;
  type: 'HIERARCHIQUE' | 'COLLABORATIVE' | 'INFORMATIONNELLE';
  reason: string;
  confidence: number; // 0-100
  justification: string;
  potentialBenefits: string[];
  potentialRisks: string[];
}

// === SERVICE PRINCIPAL ===
export class OrganismesRelationService {
  private modifications: Map<string, RelationModification> = new Map();
  private relationCache: Map<string, any> = new Map();
  private lastCacheUpdate: number = 0;
  private CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  constructor() {
    this.initializeDefaultRelations();
  }

  // === INITIALISATION ===
  private initializeDefaultRelations(): void {
    // Relations hiérarchiques automatiques basées sur la structure admin gabonaise
    this.createDefaultHierarchicalRelations();

    // Relations collaboratives logiques
    this.createDefaultCollaborativeRelations();

    // Relations informationnelles pour le partage de données
    this.createDefaultInformationalRelations();
  }

  private createDefaultHierarchicalRelations(): void {
    const organismes = Object.values(ORGANISMES_GABONAIS_COMPLETS);

    // Présidence -> Primature
    this.addRelationSilent('PRESIDENCE', 'PRIMATURE', 'HIERARCHIQUE', 'Relation constitutionnelle');

    // Primature -> Ministères
    const ministeres = organismes.filter(org => org.type === 'MINISTERE');
    ministeres.forEach(ministere => {
      this.addRelationSilent('PRIMATURE', ministere.code, 'HIERARCHIQUE', 'Tutelle gouvernementale');
    });

    // Ministères -> Directions Générales
    const directions = organismes.filter(org => org.type === 'DIRECTION_GENERALE');
    directions.forEach(direction => {
      if (direction.parentId) {
        const parent = organismes.find(org => org.id === direction.parentId);
        if (parent && parent.type === 'MINISTERE') {
          this.addRelationSilent(parent.code, direction.code, 'HIERARCHIQUE', 'Tutelle ministérielle');
        }
      }
    });

    // Provinces -> Préfectures -> Mairies
    const provinces = organismes.filter(org => org.type === 'PROVINCE');
    const prefectures = organismes.filter(org => org.type === 'PREFECTURE');
    const mairies = organismes.filter(org => org.type === 'MAIRIE');

    // Associer les préfectures aux provinces
    prefectures.forEach(prefecture => {
      const province = provinces.find(prov => prov.province === prefecture.province);
      if (province) {
        this.addRelationSilent(province.code, prefecture.code, 'HIERARCHIQUE', 'Tutelle administrative territoriale');
      }
    });

    // Associer les mairies aux préfectures de leur région
    mairies.forEach(mairie => {
      const prefecture = prefectures.find(pref => pref.province === mairie.province);
      if (prefecture) {
        this.addRelationSilent(prefecture.code, mairie.code, 'HIERARCHIQUE', 'Tutelle préfectorale');
      }
    });
  }

  private createDefaultCollaborativeRelations(): void {
    const organismes = Object.values(ORGANISMES_GABONAIS_COMPLETS);

    // Relations entre ministères ayant des missions complémentaires
    const collaborations = [
      // Sécurité et Justice
      ['MIN_INT', 'MIN_JUS', 'Sécurité publique et application des lois'],
      ['MIN_INT', 'MIN_DEF', 'Sécurité nationale et défense'],
      ['MIN_JUS', 'MIN_DEF', 'Justice militaire et ordre public'],

      // Éducation et Formation
      ['MIN_EDUC', 'MIN_ENS_SUP', 'Continuité éducative'],
      ['MIN_EDUC', 'MIN_FORM_PROF', 'Formation et insertion professionnelle'],
      ['MIN_ENS_SUP', 'MIN_FORM_PROF', 'Formation supérieure technique'],

      // Développement économique
      ['MIN_AGRI', 'MIN_PECHE', 'Sécurité alimentaire'],
      ['MIN_MINE', 'MIN_PETR', 'Ressources naturelles'],
      ['MIN_IND', 'MIN_COM_EXT', 'Développement industriel et export'],
      ['MIN_TRANSPORT', 'MIN_TP', 'Infrastructures de transport'],

      // Environnement et ressources
      ['MIN_ENV', 'MIN_FORETS', 'Protection environnementale'],
      ['MIN_FORETS', 'MIN_AGRI', 'Gestion des terres et forêts'],
      ['MIN_ENV', 'MIN_AGRI', 'Agriculture durable'],

      // Social et santé
      ['MIN_SANTE', 'MIN_TRAVAIL', 'Santé au travail'],
      ['MIN_TRAVAIL', 'MIN_FORM_PROF', 'Insertion professionnelle'],

      // Culture et tourisme
      ['MIN_CULTURE', 'MIN_TOUR', 'Patrimoine et développement touristique'],
      ['MIN_TOUR', 'MIN_TRANSPORT', 'Accessibilité touristique'],

      // Aménagement et habitat
      ['MIN_HABITAT', 'MIN_TP', 'Infrastructures urbaines'],
      ['MIN_HABITAT', 'MIN_ENV', 'Urbanisme durable']
    ];

    collaborations.forEach(([source, target, reason]) => {
      this.addRelationSilent(source, target, 'COLLABORATIVE', reason);
    });

    // Relations entre organismes de même niveau administratif
    const mairies = organismes.filter(org => org.type === 'MAIRIE');
    const mairesCapitales = ['MAIRE_LBV', 'MAIRE_PG'];

    // Coopération entre grandes villes
    mairesCapitales.forEach(maire1 => {
      mairesCapitales.forEach(maire2 => {
        if (maire1 !== maire2) {
          this.addRelationSilent(maire1, maire2, 'COLLABORATIVE', 'Coopération inter-villes');
        }
      });
    });
  }

  private createDefaultInformationalRelations(): void {
    const organismes = Object.values(ORGANISMES_GABONAIS_COMPLETS);

    // Relations de partage de données essentielles
    const partagesDonnees = [
      // État civil et identité
      ['DGDI', 'MIN_JUS', 'Vérification identité pour procédures judiciaires'],
      ['DGDI', 'DGI', 'Vérification identité pour fiscalité'],
      ['DGDI', 'DGDDI', 'Contrôle frontalier et douanes'],

      // Fiscalité et finances
      ['DGI', 'DGDDI', 'Coordination fiscale et douanière'],
      ['DGI', 'CNSS', 'Cotisations sociales et fiscalité'],
      ['DGI', 'CNAMGS', 'Contributions santé'],

      // Sécurité et ordre public
      ['DGSN', 'GENDARMERIE', 'Coordination sécuritaire'],
      ['DGSN', 'DGDI', 'Contrôle identité et circulation'],
      ['GENDARMERIE', 'DGDDI', 'Sécurité frontalière'],

      // Social et emploi
      ['CNSS', 'ONE', 'Données emploi et chômage'],
      ['CNAMGS', 'MIN_SANTE', 'Données sanitaires'],
      ['ONE', 'MIN_FORM_PROF', 'Besoins en formation'],

      // Toutes les mairies partagent avec DGDI pour l'état civil
      ...organismes.filter(org => org.type === 'MAIRIE')
        .map(mairie => [mairie.code, 'DGDI', 'Transmission actes état civil']),

      // Toutes les provinces partagent avec Primature
      ...organismes.filter(org => org.type === 'PROVINCE')
        .map(province => [province.code, 'PRIMATURE', 'Rapports administratifs territoriaux'])
    ];

    partagesDonnees.forEach(([source, target, reason]) => {
      this.addRelationSilent(source, target, 'INFORMATIONNELLE', reason);
    });
  }

  private addRelationSilent(sourceCode: string, targetCode: string, type: string, description: string): void {
    const relationId = `${sourceCode}_${targetCode}_${type}`;
    if (!this.modifications.has(relationId)) {
      const modification: RelationModification = {
        id: relationId,
        sourceCode,
        targetCode,
        type: type as any,
        action: 'ADD',
        timestamp: new Date().toISOString(),
        description,
        status: 'APPROVED', // Relations par défaut pré-approuvées
        approvedBy: 'SYSTEM',
        approvedAt: new Date().toISOString()
      };
      this.modifications.set(relationId, modification);
    }
  }

  // === GESTION DES RELATIONS ===
  async createRelation(
    sourceCode: string,
    targetCode: string,
    type: 'HIERARCHIQUE' | 'COLLABORATIVE' | 'INFORMATIONNELLE',
    description: string,
    justification?: string
  ): Promise<RelationModification> {
    // Validation
    const validation = await this.validateRelation(sourceCode, targetCode, type);
    if (!validation.isValid) {
      throw new Error(`Relation invalide: ${validation.errors.join(', ')}`);
    }

    const relationId = `${sourceCode}_${targetCode}_${type}_${Date.now()}`;
    const modification: RelationModification = {
      id: relationId,
      sourceCode,
      targetCode,
      type,
      action: 'ADD',
      timestamp: new Date().toISOString(),
      description,
      status: 'PENDING',
      metadata: { justification }
    };

    this.modifications.set(relationId, modification);
    this.invalidateCache();

    return modification;
  }

  async removeRelation(
    sourceCode: string,
    targetCode: string,
    type: 'HIERARCHIQUE' | 'COLLABORATIVE' | 'INFORMATIONNELLE',
    reason: string
  ): Promise<RelationModification> {
    const relationId = `${sourceCode}_${targetCode}_${type}_${Date.now()}`;
    const modification: RelationModification = {
      id: relationId,
      sourceCode,
      targetCode,
      type,
      action: 'REMOVE',
      timestamp: new Date().toISOString(),
      description: `Suppression: ${reason}`,
      status: 'PENDING'
    };

    this.modifications.set(relationId, modification);
    this.invalidateCache();

    return modification;
  }

  async getRelations(filters?: RelationSearchFilters): Promise<RelationModification[]> {
    let relations = Array.from(this.modifications.values())
      .filter(rel => rel.status === 'APPROVED' && rel.action === 'ADD');

    if (!filters) return relations;

    // Appliquer les filtres
    if (filters.type) {
      relations = relations.filter(rel => rel.type === filters.type);
    }

    if (filters.sourceType) {
      relations = relations.filter(rel => {
        const sourceOrg = getOrganismeComplet(rel.sourceCode);
        return sourceOrg?.type === filters.sourceType;
      });
    }

    if (filters.targetType) {
      relations = relations.filter(rel => {
        const targetOrg = getOrganismeComplet(rel.targetCode);
        return targetOrg?.type === filters.targetType;
      });
    }

    if (filters.niveau) {
      relations = relations.filter(rel => {
        const sourceOrg = getOrganismeComplet(rel.sourceCode);
        const targetOrg = getOrganismeComplet(rel.targetCode);
        return sourceOrg?.niveau === filters.niveau || targetOrg?.niveau === filters.niveau;
      });
    }

    if (filters.province) {
      relations = relations.filter(rel => {
        const sourceOrg = getOrganismeComplet(rel.sourceCode);
        const targetOrg = getOrganismeComplet(rel.targetCode);
        return sourceOrg?.province === filters.province || targetOrg?.province === filters.province;
      });
    }

    if (filters.keywords) {
      const keywords = filters.keywords.toLowerCase();
      relations = relations.filter(rel =>
        rel.description.toLowerCase().includes(keywords) ||
        rel.sourceCode.toLowerCase().includes(keywords) ||
        rel.targetCode.toLowerCase().includes(keywords)
      );
    }

    return relations;
  }

  async getModifications(status?: 'PENDING' | 'APPROVED' | 'REJECTED'): Promise<RelationModification[]> {
    let modifications = Array.from(this.modifications.values());

    if (status) {
      modifications = modifications.filter(mod => mod.status === status);
    }

    return modifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  async approveModification(modificationId: string, approvedBy: string): Promise<void> {
    const modification = this.modifications.get(modificationId);
    if (!modification) {
      throw new Error('Modification introuvable');
    }

    modification.status = 'APPROVED';
    modification.approvedBy = approvedBy;
    modification.approvedAt = new Date().toISOString();

    this.modifications.set(modificationId, modification);
    this.invalidateCache();
  }

  async rejectModification(modificationId: string, reason: string, rejectedBy: string): Promise<void> {
    const modification = this.modifications.get(modificationId);
    if (!modification) {
      throw new Error('Modification introuvable');
    }

    modification.status = 'REJECTED';
    modification.rejectedReason = reason;
    modification.metadata = { ...modification.metadata, rejectedBy, rejectedAt: new Date().toISOString() };

    this.modifications.set(modificationId, modification);
    this.invalidateCache();
  }

  async applyAllPendingModifications(approvedBy: string): Promise<{ applied: number; errors: string[] }> {
    const pendingModifications = await this.getModifications('PENDING');
    let applied = 0;
    const errors: string[] = [];

    for (const modification of pendingModifications) {
      try {
        await this.approveModification(modification.id, approvedBy);
        applied++;
      } catch (error: any) {
        errors.push(`${modification.id}: ${error.message}`);
      }
    }

    return { applied, errors };
  }

  // === VALIDATION ===
  async validateRelation(
    sourceCode: string,
    targetCode: string,
    type: 'HIERARCHIQUE' | 'COLLABORATIVE' | 'INFORMATIONNELLE'
  ): Promise<RelationValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];

    // Vérifier l'existence des organismes
    const sourceOrg = getOrganismeComplet(sourceCode);
    const targetOrg = getOrganismeComplet(targetCode);

    if (!sourceOrg) {
      errors.push(`Organisme source '${sourceCode}' introuvable`);
    }
    if (!targetOrg) {
      errors.push(`Organisme cible '${targetCode}' introuvable`);
    }

    if (errors.length > 0) {
      return { isValid: false, errors, warnings, suggestions };
    }

    // Vérifier l'auto-relation
    if (sourceCode === targetCode) {
      errors.push('Un organisme ne peut pas avoir une relation avec lui-même');
    }

    // Validation spécifique par type de relation
    if (type === 'HIERARCHIQUE') {
      // Vérifier la cohérence hiérarchique
      if (sourceOrg!.niveau >= targetOrg!.niveau) {
        warnings.push('Relation hiérarchique inhabituelle: niveau source >= niveau cible');
      }

      // Vérifier les cycles hiérarchiques
      const wouldCreateCycle = await this.wouldCreateHierarchicalCycle(sourceCode, targetCode);
      if (wouldCreateCycle) {
        errors.push('Cette relation créerait un cycle hiérarchique');
      }
    }

    if (type === 'COLLABORATIVE') {
      // Suggérer si les organismes sont de types complémentaires
      if (this.areComplementaryTypes(sourceOrg!.type, targetOrg!.type)) {
        suggestions.push('Ces types d\'organismes collaborent habituellement bien');
      }
    }

    if (type === 'INFORMATIONNELLE') {
      // Vérifier la pertinence du partage de données
      if (!this.isDataSharingRelevant(sourceOrg!, targetOrg!)) {
        warnings.push('Le partage de données entre ces organismes pourrait ne pas être pertinent');
      }
    }

    // Vérifier les relations existantes
    const existingRelation = await this.findExistingRelation(sourceCode, targetCode, type);
    if (existingRelation) {
      errors.push(`Une relation ${type} existe déjà entre ces organismes`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions
    };
  }

  private async wouldCreateHierarchicalCycle(sourceCode: string, targetCode: string): Promise<boolean> {
    // Vérifier si ajouter sourceCode -> targetCode créerait un cycle
    // en cherchant un chemin de targetCode vers sourceCode
    const visited = new Set<string>();

    const hasPath = (from: string, to: string): boolean => {
      if (from === to) return true;
      if (visited.has(from)) return false;

      visited.add(from);

      // Trouver tous les organismes que 'from' supervise hiérarchiquement
      const hierarchicalRelations = Array.from(this.modifications.values())
        .filter(rel =>
          rel.status === 'APPROVED' &&
          rel.action === 'ADD' &&
          rel.type === 'HIERARCHIQUE' &&
          rel.sourceCode === from
        );

      for (const relation of hierarchicalRelations) {
        if (hasPath(relation.targetCode, to)) {
          return true;
        }
      }

      return false;
    };

    return hasPath(targetCode, sourceCode);
  }

  private areComplementaryTypes(type1: string, type2: string): boolean {
    const complementaryPairs = [
      ['MINISTERE', 'DIRECTION_GENERALE'],
      ['DIRECTION_GENERALE', 'AGENCE_PUBLIQUE'],
      ['PROVINCE', 'PREFECTURE'],
      ['PREFECTURE', 'MAIRIE'],
      ['ORGANISME_SOCIAL', 'ORGANISME_SOCIAL']
    ];

    return complementaryPairs.some(([t1, t2]) =>
      (type1 === t1 && type2 === t2) || (type1 === t2 && type2 === t1)
    );
  }

  private isDataSharingRelevant(org1: OrganismeComplet, org2: OrganismeComplet): boolean {
    // Logique pour déterminer si le partage de données est pertinent
    const dataIntensiveTypes = ['DGDI', 'DGI', 'DGDDI', 'CNSS', 'CNAMGS'];
    const needsDataTypes = ['MAIRIE', 'PREFECTURE', 'ORGANISME_SOCIAL'];

    return (
      dataIntensiveTypes.includes(org1.code) && needsDataTypes.includes(org2.type) ||
      dataIntensiveTypes.includes(org2.code) && needsDataTypes.includes(org1.type) ||
      org1.province === org2.province // Même province = partage territorial pertinent
    );
  }

  private async findExistingRelation(
    sourceCode: string,
    targetCode: string,
    type: string
  ): Promise<RelationModification | null> {
    const relations = await this.getRelations();
    return relations.find(rel =>
      rel.sourceCode === sourceCode &&
      rel.targetCode === targetCode &&
      rel.type === type
    ) || null;
  }

  // === RECOMMENDATIONS ===
  async getRelationRecommendations(organismeCode: string): Promise<RelationRecommendation[]> {
    const organisme = getOrganismeComplet(organismeCode);
    if (!organisme) return [];

    const recommendations: RelationRecommendation[] = [];
    const allOrganismes = Object.values(ORGANISMES_GABONAIS_COMPLETS);

    for (const targetOrg of allOrganismes) {
      if (targetOrg.code === organismeCode) continue;

      // Analyser les recommandations possibles
      const hierarchicalRec = this.analyzeHierarchicalRecommendation(organisme, targetOrg);
      const collaborativeRec = this.analyzeCollaborativeRecommendation(organisme, targetOrg);
      const informationalRec = this.analyzeInformationalRecommendation(organisme, targetOrg);

      if (hierarchicalRec) recommendations.push(hierarchicalRec);
      if (collaborativeRec) recommendations.push(collaborativeRec);
      if (informationalRec) recommendations.push(informationalRec);
    }

    // Trier par confiance décroissante
    return recommendations
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 10); // Top 10 recommandations
  }

  private analyzeHierarchicalRecommendation(
    source: OrganismeComplet,
    target: OrganismeComplet
  ): RelationRecommendation | null {
    // Recommander relations hiérarchiques basées sur la structure administrative
    if (source.niveau < target.niveau && source.type === 'MINISTERE' && target.type === 'DIRECTION_GENERALE') {
      if (this.areSameDomain(source, target)) {
        return {
          id: `hier_${source.code}_${target.code}`,
          sourceCode: source.code,
          targetCode: target.code,
          type: 'HIERARCHIQUE',
          reason: 'Tutelle ministérielle logique',
          confidence: 85,
          justification: `${source.nom} devrait superviser ${target.nom} selon la structure administrative`,
          potentialBenefits: ['Coordination renforcée', 'Chaîne de commandement claire'],
          potentialRisks: ['Possible chevauchement de compétences']
        };
      }
    }

    return null;
  }

  private analyzeCollaborativeRecommendation(
    source: OrganismeComplet,
    target: OrganismeComplet
  ): RelationRecommendation | null {
    // Recommander collaborations basées sur les missions complémentaires
    const missionOverlap = this.calculateMissionOverlap(source, target);

    if (missionOverlap > 0.3 && source.niveau === target.niveau) {
      return {
        id: `collab_${source.code}_${target.code}`,
        sourceCode: source.code,
        targetCode: target.code,
        type: 'COLLABORATIVE',
        reason: 'Missions complémentaires',
        confidence: Math.floor(missionOverlap * 100),
        justification: `Missions complémentaires détectées (${Math.floor(missionOverlap * 100)}% de similarité)`,
        potentialBenefits: ['Synergie opérationnelle', 'Économies d\'échelle', 'Efficacité accrue'],
        potentialRisks: ['Possible confusion des rôles', 'Coordination nécessaire']
      };
    }

    return null;
  }

  private analyzeInformationalRecommendation(
    source: OrganismeComplet,
    target: OrganismeComplet
  ): RelationRecommendation | null {
    // Recommander partage de données basé sur les services
    const dataSharePotential = this.calculateDataSharePotential(source, target);

    if (dataSharePotential > 0.4) {
      return {
        id: `info_${source.code}_${target.code}`,
        sourceCode: source.code,
        targetCode: target.code,
        type: 'INFORMATIONNELLE',
        reason: 'Potentiel de partage de données',
        confidence: Math.floor(dataSharePotential * 100),
        justification: `Services complémentaires nécessitant échange de données`,
        potentialBenefits: ['Efficacité administrative', 'Réduction des délais', 'Qualité des services'],
        potentialRisks: ['Confidentialité des données', 'Complexité technique']
      };
    }

    return null;
  }

  private areSameDomain(org1: OrganismeComplet, org2: OrganismeComplet): boolean {
    // Logique simplifiée pour déterminer si deux organismes sont du même domaine
    const domains = {
      'security': ['MIN_INT', 'MIN_JUS', 'MIN_DEF', 'DGSN', 'GENDARMERIE'],
      'finance': ['DGI', 'DGDDI', 'MIN_BUDGET'],
      'social': ['MIN_SANTE', 'MIN_TRAVAIL', 'CNSS', 'CNAMGS'],
      'education': ['MIN_EDUC', 'MIN_ENS_SUP', 'MIN_FORM_PROF'],
      'environment': ['MIN_ENV', 'MIN_FORETS', 'MIN_AGRI']
    };

    for (const domainOrgs of Object.values(domains)) {
      if (domainOrgs.includes(org1.code) && domainOrgs.includes(org2.code)) {
        return true;
      }
    }

    return false;
  }

  private calculateMissionOverlap(org1: OrganismeComplet, org2: OrganismeComplet): number {
    // Calculer le chevauchement des missions basé sur les mots-clés
    const mission1Words = org1.mission.toLowerCase().split(/\s+/);
    const mission2Words = org2.mission.toLowerCase().split(/\s+/);

    const commonWords = mission1Words.filter(word =>
      mission2Words.includes(word) && word.length > 3
    );

    return commonWords.length / Math.max(mission1Words.length, mission2Words.length);
  }

  private calculateDataSharePotential(org1: OrganismeComplet, org2: OrganismeComplet): number {
    // Calculer le potentiel de partage basé sur les services
    const services1 = org1.services.map(s => s.toLowerCase());
    const services2 = org2.services.map(s => s.toLowerCase());

    // Mots-clés indiquant un potentiel de partage
    const shareKeywords = ['identité', 'état civil', 'fiscal', 'social', 'emploi', 'santé'];

    const org1HasShareData = services1.some(service =>
      shareKeywords.some(keyword => service.includes(keyword))
    );
    const org2NeedsShareData = services2.some(service =>
      shareKeywords.some(keyword => service.includes(keyword))
    );

    if (org1HasShareData && org2NeedsShareData) {
      return 0.7; // Fort potentiel
    }

    if (org1.province === org2.province && org1.type !== org2.type) {
      return 0.5; // Potentiel territorial
    }

    return 0.2; // Potentiel faible
  }

  // === ANALYTICS ===
  async getRelationStats(): Promise<OrganismeRelationStats> {
    const relations = await this.getRelations();
    const organismes = Object.values(ORGANISMES_GABONAIS_COMPLETS);

    // Compter les relations par type
    const relationsParType = relations.reduce((acc, rel) => {
      acc[rel.type] = (acc[rel.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Compter les relations par niveau
    const relationsParNiveau = relations.reduce((acc, rel) => {
      const sourceOrg = getOrganismeComplet(rel.sourceCode);
      if (sourceOrg) {
        const niveau = `niveau_${sourceOrg.niveau}`;
        acc[niveau] = (acc[niveau] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    // Trouver les organismes sans relations
    const organisesAvecRelations = new Set<string>();
    relations.forEach(rel => {
      organisesAvecRelations.add(rel.sourceCode);
      organisesAvecRelations.add(rel.targetCode);
    });

    const organismesSansRelations = organismes
      .filter(org => !organisesAvecRelations.has(org.code))
      .map(org => org.code);

    // Détecter les relations dupliquées
    const relationsDupliquees: Array<{ source: string; target: string; types: string[] }> = [];
    const relationMap = new Map<string, string[]>();

    relations.forEach(rel => {
      const key = `${rel.sourceCode}_${rel.targetCode}`;
      if (!relationMap.has(key)) {
        relationMap.set(key, []);
      }
      relationMap.get(key)!.push(rel.type);
    });

    relationMap.forEach((types, key) => {
      if (types.length > 1) {
        const [source, target] = key.split('_');
        relationsDupliquees.push({ source, target, types });
      }
    });

    // Analyser la connectivité du graphe
    const grapheConnexite = this.analyzeGraphConnectivity(relations, organismes);

    return {
      totalOrganismes: organismes.length,
      totalRelations: relations.length,
      relationsParType,
      relationsParNiveau,
      organismesSansRelations,
      relationsDupliquees,
      grapheConnexite
    };
  }

  private analyzeGraphConnectivity(
    relations: RelationModification[],
    organismes: OrganismeComplet[]
  ): OrganismeRelationStats['grapheConnexite'] {
    // Créer le graphe d'adjacence
    const adjacencyMap = new Map<string, Set<string>>();

    organismes.forEach(org => {
      adjacencyMap.set(org.code, new Set());
    });

    relations.forEach(rel => {
      adjacencyMap.get(rel.sourceCode)?.add(rel.targetCode);
      adjacencyMap.get(rel.targetCode)?.add(rel.sourceCode);
    });

    // Trouver les composantes connexes avec DFS
    const visited = new Set<string>();
    let composantesConnexes = 0;
    const organismeIsoles: string[] = [];

    organismes.forEach(org => {
      if (!visited.has(org.code)) {
        const componentSize = this.dfsComponentSize(org.code, adjacencyMap, visited);
        composantesConnexes++;

        if (componentSize === 1) {
          organismeIsoles.push(org.code);
        }
      }
    });

    // Calculer la centralité (nombre de connexions)
    const centralite: Record<string, number> = {};
    adjacencyMap.forEach((connections, orgCode) => {
      centralite[orgCode] = connections.size;
    });

    return {
      composantesConnexes,
      organismeIsoles,
      centralite
    };
  }

  private dfsComponentSize(
    startNode: string,
    adjacencyMap: Map<string, Set<string>>,
    visited: Set<string>
  ): number {
    if (visited.has(startNode)) return 0;

    visited.add(startNode);
    let size = 1;

    const neighbors = adjacencyMap.get(startNode) || new Set();
    neighbors.forEach(neighbor => {
      size += this.dfsComponentSize(neighbor, adjacencyMap, visited);
    });

    return size;
  }

  // === UTILS ===
  private invalidateCache(): void {
    this.relationCache.clear();
    this.lastCacheUpdate = Date.now();
  }

  async exportConfiguration(): Promise<string> {
    const config = {
      organismes: Object.values(ORGANISMES_GABONAIS_COMPLETS),
      modifications: Array.from(this.modifications.values()),
      stats: await this.getRelationStats(),
      exportedAt: new Date().toISOString(),
      version: '1.0.0'
    };

    return JSON.stringify(config, null, 2);
  }

  async importConfiguration(configJson: string): Promise<{ imported: number; errors: string[] }> {
    try {
      const config = JSON.parse(configJson);
      let imported = 0;
      const errors: string[] = [];

      if (config.modifications && Array.isArray(config.modifications)) {
        for (const modif of config.modifications) {
          try {
            this.modifications.set(modif.id, modif);
            imported++;
          } catch (error: any) {
            errors.push(`Modification ${modif.id}: ${error.message}`);
          }
        }
      }

      this.invalidateCache();
      return { imported, errors };
    } catch (error: any) {
      throw new Error(`Erreur lors de l'import: ${error.message}`);
    }
  }
}

// === INSTANCE SINGLETON ===
export const organismesRelationService = new OrganismesRelationService();
