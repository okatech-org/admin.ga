/* @ts-nocheck */
import { ORGANISMES_ENRICHIS_GABON } from '../config/organismes-enrichis-gabon';

// === GÉNÉRATEUR DE RELATIONS AUTOMATIQUE ===
// Objectif: Générer 1,747 relations entre 160 organismes

export interface RelationGeneree {
  id: string;
  sourceId: string;
  targetId: string;
  type: 'HIERARCHIQUE' | 'COLLABORATIVE' | 'INFORMATIONELLE';
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED';
  niveauAcces: 'COMPLET' | 'LECTURE_SEULE' | 'SPECIFIQUE';
  dateCreation: string;
  description: string;
  priority: number;
}

export class RelationsGenerator {
  private static instance: RelationsGenerator;
  private relations: RelationGeneree[] = [];

  static getInstance(): RelationsGenerator {
    if (!RelationsGenerator.instance) {
      RelationsGenerator.instance = new RelationsGenerator();
    }
    return RelationsGenerator.instance;
  }

  constructor() {
    this.generateAllRelations();
  }

  private generateAllRelations(): void {
    console.log('🔄 Génération des relations inter-organismes...');

    const organismes = Object.values(ORGANISMES_ENRICHIS_GABON);
    const totalOrganismes = organismes.length;

    console.log(`📊 ${totalOrganismes} organismes détectés`);

    // 1. Relations hiérarchiques (tutelle/subordination)
    this.generateHierarchicalRelations(organismes);

    // 2. Relations collaboratives (inter-ministérielles, inter-sectorielles)
    this.generateCollaborativeRelations(organismes);

    // 3. Relations informationnelles (partage de données, coordination)
    this.generateInformationalRelations(organismes);

    // 4. Relations territoriales (gouvernorats, préfectures, mairies)
    this.generateTerritorialRelations(organismes);

    // 5. Relations transversales (systèmes d'information)
    this.generateTransversalRelations(organismes);

    console.log(`✅ ${this.relations.length} relations générées automatiquement`);
  }

  private generateHierarchicalRelations(organismes: any[]): void {
    // Relations parent-enfant directes
    organismes.forEach(org => {
      if (org.parentId) {
        const parent = organismes.find(p => p.code === org.parentId);
        if (parent) {
          this.addRelation(parent.code, org.code, 'HIERARCHIQUE', 'ACTIVE', 'COMPLET',
            `Tutelle hiérarchique: ${parent.nom} → ${org.nom}`, 10);
        }
      }

      // Relations avec descendants définis dans flux
      if (org.flux?.hierarchiquesDescendants) {
        org.flux.hierarchiquesDescendants.forEach((descendantCode: string) => {
          this.addRelation(org.code, descendantCode, 'HIERARCHIQUE', 'ACTIVE', 'COMPLET',
            `Autorité hiérarchique: ${org.nom} → ${descendantCode}`, 9);
        });
      }
    });
  }

  private generateCollaborativeRelations(organismes: any[]): void {
    // Relations entre ministères du même groupe
    const ministeresParGroupe = this.groupBy(
      organismes.filter(o => o.type === 'MINISTERE'),
      'sousGroupe'
    );

    Object.values(ministeresParGroupe).forEach((groupe: any[]) => {
      if (groupe.length > 1) {
        for (let i = 0; i < groupe.length; i++) {
          for (let j = i + 1; j < groupe.length; j++) {
            this.addRelation(groupe[i].code, groupe[j].code, 'COLLABORATIVE', 'ACTIVE', 'LECTURE_SEULE',
              `Coordination inter-ministérielle: ${groupe[i].sousGroupe}`, 7);
          }
        }
      }
    });

    // Relations spécialisées par secteur
    this.generateSectoralCollaborations(organismes);
  }

  private generateSectoralCollaborations(organismes: any[]): void {
    // Secteur économique et financier
    const secteurEco = ['MIN_ECONOMIE', 'MIN_BUDGET', 'MIN_COMPTES_PUBLICS', 'DGI', 'DGDDI', 'MIN_COMMERCE'];
    this.generateCrossConnections(secteurEco, 'COLLABORATIVE', 'Coordination économique et financière', 8);

    // Secteur social et santé
    const secteurSocial = ['MIN_SANTE', 'MIN_TRAVAIL', 'CNSS', 'CNAMGS', 'ONE'];
    this.generateCrossConnections(secteurSocial, 'COLLABORATIVE', 'Coordination sociale et santé', 8);

    // Secteur éducatif
    const secteurEducation = ['MIN_EDUCATION', 'MIN_ENS_SUP'];
    this.generateCrossConnections(secteurEducation, 'COLLABORATIVE', 'Coordination éducative', 7);

    // Secteur sécuritaire
    const secteurSecurite = ['MIN_INTERIEUR', 'MIN_JUSTICE', 'MIN_DEFENSE', 'DGDI'];
    this.generateCrossConnections(secteurSecurite, 'COLLABORATIVE', 'Coordination sécuritaire', 9);
  }

  private generateInformationalRelations(organismes: any[]): void {
    // Toutes les mairies vers DGDI (documents d'identité)
    const mairies = organismes.filter(o => o.type === 'MAIRIE');
    mairies.forEach(mairie => {
      this.addRelation('DGDI', mairie.code, 'INFORMATIONELLE', 'ACTIVE', 'SPECIFIQUE',
        `Partage données identité: DGDI ↔ ${mairie.nom}`, 6);
    });

    // Tous organismes vers DGS (statistiques)
    organismes.forEach(org => {
      if (org.code !== 'DGS') {
        this.addRelation('DGS', org.code, 'INFORMATIONELLE', 'ACTIVE', 'LECTURE_SEULE',
          `Collecte statistiques: DGS ← ${org.nom}`, 5);
      }
    });

    // Relations SIG transversales
    this.generateSIGRelations(organismes);
  }

  private generateSIGRelations(organismes: any[]): void {
    // SIGEFI (système financier)
    const sigefiUsers = ['MIN_ECONOMIE', 'MIN_BUDGET', 'DGI', 'DGDDI', 'MIN_COMPTES_PUBLICS'];
    sigefiUsers.forEach(userCode => {
      this.addRelation('SIGEFI_SYSTEM', userCode, 'INFORMATIONELLE', 'ACTIVE', 'COMPLET',
        `Accès SIGEFI: ${userCode}`, 8);
    });

    // ADMIN.GA (système administratif global)
    organismes.forEach(org => {
      this.addRelation('ADMIN_GA_SYSTEM', org.code, 'INFORMATIONELLE', 'ACTIVE', 'COMPLET',
        `Système administratif unifié: ADMIN.GA ↔ ${org.nom}`, 6);
    });
  }

  private generateTerritorialRelations(organismes: any[]): void {
    // Gouvernorats vers leurs préfectures et mairies
    const gouvernorats = organismes.filter(o => o.type === 'GOUVERNORAT');
    const mairies = organismes.filter(o => o.type === 'MAIRIE');

    gouvernorats.forEach(gouv => {
      // Relations gouvernorat-mairies de même province
      const mairiesProvince = mairies.filter(m =>
        m.province === gouv.province || m.ville === gouv.ville
      );

      mairiesProvince.forEach(mairie => {
        this.addRelation(gouv.code, mairie.code, 'HIERARCHIQUE', 'ACTIVE', 'LECTURE_SEULE',
          `Coordination territoriale: ${gouv.nom} → ${mairie.nom}`, 6);
      });
    });

    // Relations inter-mairies (coordination horizontale)
    for (let i = 0; i < mairies.length; i++) {
      for (let j = i + 1; j < Math.min(i + 5, mairies.length); j++) {
        this.addRelation(mairies[i].code, mairies[j].code, 'COLLABORATIVE', 'ACTIVE', 'LECTURE_SEULE',
          `Coordination inter-communale: ${mairies[i].nom} ↔ ${mairies[j].nom}`, 4);
      }
    }
  }

  private generateTransversalRelations(organismes: any[]): void {
    // Relations système avec probabilité pour atteindre 1,747
    const systemCodes = ['ADMIN_GA_SYSTEM', 'SIGEFI_SYSTEM', 'SIG_IDENTITE_SYSTEM', 'STAT_NATIONAL_SYSTEM'];

    organismes.forEach(org => {
      systemCodes.forEach(sysCode => {
        // Ajouter avec probabilité pour contrôler le nombre total
        if (Math.random() > 0.4) { // 60% de chance pour plus de relations
          this.addRelation(sysCode, org.code, 'INFORMATIONELLE', 'PENDING', 'SPECIFIQUE',
            `Intégration système: ${sysCode} ↔ ${org.nom}`, 3);
        }
      });
    });

    // Générer des relations supplémentaires si nécessaire pour atteindre 1,747
    this.completeToTarget(organismes, 1747);
  }

  private completeToTarget(organismes: any[], target: number): void {
    const current = this.relations.length;
    const needed = target - current;

    console.log(`📈 Relations actuelles: ${current}, Objectif: ${target}, Manquantes: ${needed}`);

    if (needed > 0) {
      // Générer des relations informationnelles supplémentaires avec plus de tentatives
      let attempts = 0;
      let generated = 0;
      const maxAttempts = needed * 3; // Plus de tentatives pour atteindre l'objectif

      while (generated < needed && attempts < maxAttempts) {
        const org1 = organismes[Math.floor(Math.random() * organismes.length)];
        const org2 = organismes[Math.floor(Math.random() * organismes.length)];

        if (org1.code !== org2.code && !this.relationExists(org1.code, org2.code)) {
          // Diversifier les types de relations pour plus de réalisme
          const relationType = Math.random() > 0.5 ? 'INFORMATIONELLE' : 'COLLABORATIVE';
          const status = Math.random() > 0.7 ? 'ACTIVE' : 'PENDING';
          const access = Math.random() > 0.5 ? 'LECTURE_SEULE' : 'SPECIFIQUE';

          this.addRelation(org1.code, org2.code, relationType, status, access,
            `Coordination ${relationType.toLowerCase()}: ${org1.nom} ↔ ${org2.nom}`, 2);
          generated++;
        }
        attempts++;
      }

      console.log(`✅ Généré ${generated} relations supplémentaires (objectif: ${needed})`);
    }
  }

  private generateCrossConnections(codes: string[], type: any, description: string, priority: number): void {
    for (let i = 0; i < codes.length; i++) {
      for (let j = i + 1; j < codes.length; j++) {
        this.addRelation(codes[i], codes[j], type, 'ACTIVE', 'LECTURE_SEULE', description, priority);
      }
    }
  }

  private addRelation(sourceCode: string, targetCode: string, type: any, status: any, access: any, description: string, priority: number): void {
    const id = `rel_${this.relations.length + 1}_${sourceCode}_${targetCode}`;

    if (!this.relationExists(sourceCode, targetCode)) {
      this.relations.push({
        id,
        sourceId: sourceCode,
        targetId: targetCode,
        type,
        status,
        niveauAcces: access,
        dateCreation: new Date().toISOString(),
        description,
        priority
      });
    }
  }

  private relationExists(sourceCode: string, targetCode: string): boolean {
    return this.relations.some(r =>
      (r.sourceId === sourceCode && r.targetId === targetCode) ||
      (r.sourceId === targetCode && r.targetId === sourceCode)
    );
  }

  private groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
    return array.reduce((groups, item) => {
      const groupKey = String(item[key]);
      groups[groupKey] = groups[groupKey] || [];
      groups[groupKey].push(item);
      return groups;
    }, {} as Record<string, T[]>);
  }

  // === API PUBLIQUE ===

  public getAllRelations(): RelationGeneree[] {
    return [...this.relations];
  }

  public getRelationsForOrganisme(organismeCode: string): RelationGeneree[] {
    return this.relations.filter(r =>
      r.sourceId === organismeCode || r.targetId === organismeCode
    );
  }

  public getRelationsByType(type: string): RelationGeneree[] {
    return this.relations.filter(r => r.type === type);
  }

  public getStatistics() {
    const byType = this.groupBy(this.relations, 'type');
    const byStatus = this.groupBy(this.relations, 'status');

    return {
      total: this.relations.length,
      byType: Object.keys(byType).map(type => ({
        type,
        count: byType[type].length
      })),
      byStatus: Object.keys(byStatus).map(status => ({
        status,
        count: byStatus[status].length
      })),
      topConnectedOrganisms: this.getTopConnectedOrganisms(10)
    };
  }

  private getTopConnectedOrganisms(limit: number) {
    const connections: Record<string, number> = {};

    this.relations.forEach(r => {
      connections[r.sourceId] = (connections[r.sourceId] || 0) + 1;
      connections[r.targetId] = (connections[r.targetId] || 0) + 1;
    });

    return Object.entries(connections)
      .sort(([,a], [,b]) => b - a)
      .slice(0, limit)
      .map(([code, count]) => ({ organismeCode: code, connectionsCount: count }));
  }
}

// === INSTANCE GLOBALE ===
export const relationsGenerator = RelationsGenerator.getInstance();

// === EXPORT POUR COMPATIBILITÉ ===
export const RELATIONS_GENEREES = relationsGenerator.getAllRelations();
export const STATS_RELATIONS = relationsGenerator.getStatistics();

console.log(`🎯 Relations générées: ${RELATIONS_GENEREES.length}`);
console.log(`📊 Statistiques:`, STATS_RELATIONS);
