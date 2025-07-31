/**
 * Service de base de connaissances pour l'enrichissement intelligent des données d'organismes
 * Analyse et segmente les données collectées par l'IA pour optimiser la gestion
 */

import type { OrganismeIntervenant, SearchResult } from './gemini-ai.service';

interface OrganismeKnowledge {
  id: string;
  nom: string;
  code: string;
  type: string;

  // Données de base
  intervenants: OrganismeIntervenant[];
  structure: {
    niveauxHierarchiques: string[];
    departments: string[];
    postesIdentifies: string[];
  };

  // Segmentation intelligente
  segments: {
    category: 'STRATEGIQUE' | 'OPERATIONNEL' | 'SUPPORT' | 'TECHNIQUE';
    importance: 'CRITIQUE' | 'IMPORTANTE' | 'NORMALE' | 'FAIBLE';
    complexite: 'HAUTE' | 'MOYENNE' | 'FAIBLE';
    taille: 'GRANDE' | 'MOYENNE' | 'PETITE';
  };

  // Métadonnées d'enrichissement
  metadonnees: {
    completude: number; // Pourcentage de complétude des données
    fiabilite: number; // Fiabilité des informations
    derniereMiseAJour: string;
    sourcesPrincipales: string[];
  };

  // Enrichissement par IA
  aiEnriched: {
    aiConfidence: number;
    predictiveInsights: string[];
    suggestedImprovements: string[];
    automationOpportunities: string[];
  };

  // Analytics et métriques
  analytics: {
    utilisateursActifs: number;
    tauxActivation: number;
    efficaciteProcessus: number;
    scoreNumerisation: number;
  };
}

interface KnowledgeAnalysis {
  organismeId: string;
  timestamp: string;
  analysis: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
    recommendations: string[];
  };
  metrics: {
    dataQuality: number;
    organizationalMaturity: number;
    digitalReadiness: number;
    riskScore: number;
  };
}

class KnowledgeBaseService {
  private knowledgeStore: Map<string, OrganismeKnowledge> = new Map();
  private analysisStore: Map<string, KnowledgeAnalysis> = new Map();

  constructor() {
    this.initializeBaseKnowledge();
  }

  // Initialisation avec des données de base
  private initializeBaseKnowledge(): void {
    // Simuler quelques organismes de base pour démonstration
    const baseOrganismes = [
      'MIN_SANTE', 'MIN_EDUC_NAT', 'MIN_ECO_FIN', 'DGDI', 'MAIRIE_LBV'
    ];

    baseOrganismes.forEach(orgId => {
      this.createBaseKnowledge(orgId);
    });
  }

  // Créer une base de connaissances initiale pour un organisme
  private createBaseKnowledge(organismeId: string): OrganismeKnowledge {
    const baseKnowledge: OrganismeKnowledge = {
      id: organismeId,
      nom: this.getOrganismeNom(organismeId),
      code: organismeId,
      type: this.getOrganismeType(organismeId),

      intervenants: [],
      structure: {
        niveauxHierarchiques: ['Direction', 'Service', 'Bureau'],
        departments: [],
        postesIdentifies: []
      },

      segments: {
        category: this.categorizeOrganisme(organismeId),
        importance: this.assessImportance(organismeId),
        complexite: this.assessComplexity(organismeId),
        taille: this.assessSize(organismeId)
      },

      metadonnees: {
        completude: 25, // Données de base seulement
        fiabilite: 60,
        derniereMiseAJour: new Date().toISOString(),
        sourcesPrincipales: ['Configuration système']
      },

      aiEnriched: {
        aiConfidence: 0.3,
        predictiveInsights: [],
        suggestedImprovements: [],
        automationOpportunities: []
      },

      analytics: {
        utilisateursActifs: 0,
        tauxActivation: 0,
        efficaciteProcessus: 50,
        scoreNumerisation: 30
      }
    };

    this.knowledgeStore.set(organismeId, baseKnowledge);
    return baseKnowledge;
  }

  // Enrichir la base de connaissances après une recherche IA
  async enrichKnowledgeAfterAISearch(
    organismeId: string,
    searchResult: SearchResult,
    intervenants: OrganismeIntervenant[]
  ): Promise<void> {
    let knowledge = this.knowledgeStore.get(organismeId);

    if (!knowledge) {
      knowledge = this.createBaseKnowledge(organismeId);
    }

    // Enrichir avec les données de l'IA
    knowledge.intervenants = intervenants;
    knowledge.metadonnees.completude = this.calculateCompletude(knowledge, searchResult);
    knowledge.metadonnees.fiabilite = Math.round(searchResult.searchMetadata.confidence * 100);
    knowledge.metadonnees.derniereMiseAJour = new Date().toISOString();
    knowledge.metadonnees.sourcesPrincipales = this.extractSources(searchResult);

    // Enrichissement par IA
    knowledge.aiEnriched.aiConfidence = searchResult.searchMetadata.confidence;
    knowledge.aiEnriched.predictiveInsights = this.generatePredictiveInsights(knowledge);
    knowledge.aiEnriched.suggestedImprovements = this.generateImprovements(knowledge);
    knowledge.aiEnriched.automationOpportunities = this.identifyAutomationOpportunities(knowledge);

    // Mettre à jour la structure
    knowledge.structure.departments = this.extractDepartments(intervenants);
    knowledge.structure.postesIdentifies = this.extractPostes(intervenants);

    // Recalculer les analytics
    knowledge.analytics = this.calculateAnalytics(knowledge);

    // Sauvegarder
    this.knowledgeStore.set(organismeId, knowledge);

    // Générer une analyse SWOT
    await this.generateSWOTAnalysis(organismeId, knowledge);
  }

  // Générer une analyse SWOT de l'organisme
  private async generateSWOTAnalysis(organismeId: string, knowledge: OrganismeKnowledge): Promise<void> {
    const analysis: KnowledgeAnalysis = {
      organismeId,
      timestamp: new Date().toISOString(),
      analysis: {
        strengths: [],
        weaknesses: [],
        opportunities: [],
        threats: [],
        recommendations: []
      },
      metrics: {
        dataQuality: knowledge.metadonnees.fiabilite,
        organizationalMaturity: this.assessOrganizationalMaturity(knowledge),
        digitalReadiness: knowledge.analytics.scoreNumerisation,
        riskScore: this.calculateRiskScore(knowledge)
      }
    };

    // Forces
    if (knowledge.intervenants.length > 5) {
      analysis.analysis.strengths.push('Équipe dirigeante bien structurée');
    }
    if (knowledge.metadonnees.fiabilite > 80) {
      analysis.analysis.strengths.push('Données organisationnelles fiables');
    }
    if (knowledge.structure.departments.length > 3) {
      analysis.analysis.strengths.push('Structure départementale diversifiée');
    }

    // Faiblesses
    if (knowledge.metadonnees.completude < 50) {
      analysis.analysis.weaknesses.push('Données organisationnelles incomplètes');
    }
    if (knowledge.analytics.scoreNumerisation < 40) {
      analysis.analysis.weaknesses.push('Faible niveau de numérisation');
    }
    if (knowledge.intervenants.length < 3) {
      analysis.analysis.weaknesses.push('Équipe dirigeante réduite');
    }

    // Opportunités
    analysis.analysis.opportunities.push('Automatisation des processus administratifs');
    analysis.analysis.opportunities.push('Amélioration de la communication inter-services');
    if (knowledge.aiEnriched.automationOpportunities.length > 0) {
      analysis.analysis.opportunities.push('Opportunités d\'automatisation IA identifiées');
    }

    // Menaces
    if (knowledge.analytics.tauxActivation < 30) {
      analysis.analysis.threats.push('Faible adoption des outils numériques');
    }
    if (analysis.metrics.riskScore > 70) {
      analysis.analysis.threats.push('Risques organisationnels élevés');
    }

    // Recommandations
    analysis.analysis.recommendations = this.generateRecommendations(knowledge, analysis);

    this.analysisStore.set(organismeId, analysis);
  }

  // Générer des recommandations personnalisées
  private generateRecommendations(knowledge: OrganismeKnowledge, analysis: KnowledgeAnalysis): string[] {
    const recommendations: string[] = [];

    if (knowledge.metadonnees.completude < 60) {
      recommendations.push('Compléter la cartographie organisationnelle');
    }

    if (knowledge.analytics.scoreNumerisation < 50) {
      recommendations.push('Accélérer la transformation numérique');
    }

    if (knowledge.intervenants.length > 0) {
      recommendations.push('Former les équipes aux nouveaux outils');
    }

    if (analysis.metrics.riskScore > 60) {
      recommendations.push('Mettre en place un plan de gestion des risques');
    }

    recommendations.push('Automatiser les processus répétitifs');
    recommendations.push('Améliorer la communication interne');

    return recommendations;
  }

  // Méthodes utilitaires pour l'évaluation
  private calculateCompletude(knowledge: OrganismeKnowledge, searchResult: SearchResult): number {
    let score = 25; // Base

    if (knowledge.intervenants.length > 0) score += 30;
    if (knowledge.structure.departments.length > 0) score += 20;
    if (searchResult.sourceInfo.sourcesValides > 2) score += 15;
    if (knowledge.structure.postesIdentifies.length > 3) score += 10;

    return Math.min(score, 100);
  }

  private extractSources(searchResult: SearchResult): string[] {
    const sources = ['IA Gemini'];
    if (searchResult.sourceInfo.totalSources > 0) {
      sources.push('Sources web publiques');
    }
    return sources;
  }

  private extractDepartments(intervenants: OrganismeIntervenant[]): string[] {
    const departments = new Set<string>();
    intervenants.forEach(intervenant => {
      if (intervenant.department) {
        departments.add(intervenant.department);
      }
    });
    return Array.from(departments);
  }

  private extractPostes(intervenants: OrganismeIntervenant[]): string[] {
    return intervenants.map(i => i.poste).filter((poste, index, array) => array.indexOf(poste) === index);
  }

  private generatePredictiveInsights(knowledge: OrganismeKnowledge): string[] {
    const insights: string[] = [];

    if (knowledge.intervenants.length > 5) {
      insights.push('Organisation mature avec potentiel d\'expansion');
    }

    if (knowledge.analytics.scoreNumerisation < 40) {
      insights.push('Transformation numérique nécessaire dans les 12 prochains mois');
    }

    insights.push('Automatisation recommandée pour 70% des processus');

    return insights;
  }

  private generateImprovements(knowledge: OrganismeKnowledge): string[] {
    const improvements: string[] = [];

    if (knowledge.metadonnees.completude < 70) {
      improvements.push('Compléter le référencement des collaborateurs');
    }

    improvements.push('Implémenter un système de gestion documentaire');
    improvements.push('Former les équipes aux outils collaboratifs');

    return improvements;
  }

  private identifyAutomationOpportunities(knowledge: OrganismeKnowledge): string[] {
    return [
      'Automatisation de la création de comptes utilisateurs',
      'Workflow de validation des documents',
      'Système de notification automatique',
      'Rapports de performance automatisés'
    ];
  }

  private calculateAnalytics(knowledge: OrganismeKnowledge): typeof knowledge.analytics {
    const baseScore = 30;
    const intervenantsScore = Math.min(knowledge.intervenants.length * 10, 40);
    const structureScore = knowledge.structure.departments.length * 5;

    return {
      utilisateursActifs: knowledge.intervenants.length,
      tauxActivation: Math.min(intervenantsScore + 20, 100),
      efficaciteProcessus: baseScore + intervenantsScore,
      scoreNumerisation: baseScore + structureScore + (knowledge.metadonnees.completude / 2)
    };
  }

  private assessOrganizationalMaturity(knowledge: OrganismeKnowledge): number {
    let score = 50; // Base

    if (knowledge.intervenants.length > 5) score += 20;
    if (knowledge.structure.departments.length > 3) score += 15;
    if (knowledge.metadonnees.completude > 70) score += 15;

    return Math.min(score, 100);
  }

  private calculateRiskScore(knowledge: OrganismeKnowledge): number {
    let risk = 30; // Risque de base

    if (knowledge.metadonnees.completude < 50) risk += 20;
    if (knowledge.intervenants.length < 3) risk += 25;
    if (knowledge.analytics.scoreNumerisation < 40) risk += 15;
    if (knowledge.metadonnees.fiabilite < 60) risk += 10;

    return Math.min(risk, 100);
  }

  // Méthodes de catégorisation
  private categorizeOrganisme(organismeId: string): OrganismeKnowledge['segments']['category'] {
    if (organismeId.includes('MIN_')) return 'STRATEGIQUE';
    if (organismeId.includes('DG')) return 'OPERATIONNEL';
    if (organismeId.includes('MAIRIE')) return 'OPERATIONNEL';
    return 'SUPPORT';
  }

  private assessImportance(organismeId: string): OrganismeKnowledge['segments']['importance'] {
    const critiques = ['MIN_ECO_FIN', 'MIN_SANTE', 'MIN_INT_SEC', 'DGDI'];
    const importantes = ['MIN_EDUC_NAT', 'MIN_JUSTICE', 'DGI'];

    if (critiques.includes(organismeId)) return 'CRITIQUE';
    if (importantes.includes(organismeId)) return 'IMPORTANTE';
    return 'NORMALE';
  }

  private assessComplexity(organismeId: string): OrganismeKnowledge['segments']['complexite'] {
    const hautes = ['MIN_ECO_FIN', 'DGDI', 'MIN_JUSTICE'];
    const moyennes = ['MIN_SANTE', 'MIN_EDUC_NAT'];

    if (hautes.includes(organismeId)) return 'HAUTE';
    if (moyennes.includes(organismeId)) return 'MOYENNE';
    return 'FAIBLE';
  }

  private assessSize(organismeId: string): OrganismeKnowledge['segments']['taille'] {
    const grandes = ['MIN_ECO_FIN', 'MIN_SANTE', 'MIN_EDUC_NAT'];
    const moyennes = ['DGDI', 'DGI', 'MIN_JUSTICE'];

    if (grandes.includes(organismeId)) return 'GRANDE';
    if (moyennes.includes(organismeId)) return 'MOYENNE';
    return 'PETITE';
  }

  private getOrganismeNom(organismeId: string): string {
    const noms: Record<string, string> = {
      'MIN_SANTE': 'Ministère de la Santé',
      'MIN_EDUC_NAT': 'Ministère de l\'Éducation Nationale',
      'MIN_ECO_FIN': 'Ministère de l\'Économie et des Finances',
      'DGDI': 'Direction Générale de Documentation et d\'Immigration',
      'MAIRIE_LBV': 'Mairie de Libreville'
    };
    return noms[organismeId] || organismeId;
  }

  private getOrganismeType(organismeId: string): string {
    if (organismeId.includes('MIN_')) return 'MINISTERE';
    if (organismeId.includes('DG')) return 'DIRECTION_GENERALE';
    if (organismeId.includes('MAIRIE')) return 'MAIRIE';
    return 'AUTRE';
  }

  // API publique
  getOrganismeKnowledge(organismeId: string): OrganismeKnowledge | null {
    return this.knowledgeStore.get(organismeId) || null;
  }

  getAnalysisResult(organismeId: string): KnowledgeAnalysis | null {
    return this.analysisStore.get(organismeId) || null;
  }

  getAllKnowledge(): OrganismeKnowledge[] {
    return Array.from(this.knowledgeStore.values());
  }

  getOrganismesByCategory(category: OrganismeKnowledge['segments']['category']): OrganismeKnowledge[] {
    return this.getAllKnowledge().filter(org => org.segments.category === category);
  }

  getTopPerformingOrganismes(limit: number = 5): OrganismeKnowledge[] {
    return this.getAllKnowledge()
      .sort((a, b) => b.analytics.efficaciteProcessus - a.analytics.efficaciteProcessus)
      .slice(0, limit);
  }

  getOrganismesNeedingAttention(): OrganismeKnowledge[] {
    return this.getAllKnowledge().filter(org =>
      org.metadonnees.completude < 50 ||
      org.analytics.scoreNumerisation < 40 ||
      org.metadonnees.fiabilite < 60
    );
  }

  // Méthodes d'analytics globales
  getGlobalStats(): {
    totalOrganismes: number;
    moyenneCompletude: number;
    moyenneNumerisation: number;
    organismesCritiques: number;
    derniereMiseAJour: string;
  } {
    const organismes = this.getAllKnowledge();

    return {
      totalOrganismes: organismes.length,
      moyenneCompletude: organismes.reduce((sum, org) => sum + org.metadonnees.completude, 0) / organismes.length,
      moyenneNumerisation: organismes.reduce((sum, org) => sum + org.analytics.scoreNumerisation, 0) / organismes.length,
      organismesCritiques: organismes.filter(org => org.segments.importance === 'CRITIQUE').length,
      derniereMiseAJour: new Date().toISOString()
    };
  }
}

// Instance singleton
export const knowledgeBaseService = new KnowledgeBaseService();

// Export des types
export type {
  OrganismeKnowledge,
  KnowledgeAnalysis
};
