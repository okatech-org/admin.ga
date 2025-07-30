/**
 * Service d'intégration de la base de connaissances
 * Permet d'enrichir automatiquement les données de l'application
 * avec les informations de la base de connaissances
 */

import {
  getOrganismeKnowledge,
  getServicesParOrganisme,
  searchOrganismes,
  OrganismeKnowledge,
  ORGANISMES_KNOWLEDGE_BASE
} from '@/lib/data/organismes-knowledge-base';

export interface EnrichedOrganismeData {
  // Données de base de l'application
  code: string;
  nom: string;
  type?: string;

  // Enrichissement depuis la base de connaissances
  knowledge?: OrganismeKnowledge;
  contact_enriched?: {
    telephone: string[];
    email: string[];
    adresse_complete: string;
    horaires_formatted: string;
  };
  services_enriched?: {
    code: string;
    nom: string;
    description_complete: string;
    cout_exact: string;
    duree_precise: string;
    documents_detailles: string[];
  }[];
  statistics_enriched?: {
    taux_satisfaction: number;
    demandes_mensuelles: number;
    delai_moyen: string;
  };
}

export interface ServiceEnriched {
  // Données de base
  code: string;
  nom: string;
  organisme_code: string;

  // Enrichissement
  description_complete?: string;
  procedure_detaillee?: {
    etapes: string[];
    duree: string;
    cout: string;
    documents_requis: string[];
    modalites: string[];
  };
  contact_service?: {
    responsable: string;
    telephone: string;
    email: string;
    horaires: string;
  };
}

/**
 * Classe principale du service d'intégration
 */
export class KnowledgeIntegrationService {

  /**
   * Enrichit les données d'un organisme avec sa base de connaissances
   */
  static enrichOrganismeData(organismeCode: string, basNom?: string): EnrichedOrganismeData | null {
    // Recherche par code d'abord
    let knowledge = getOrganismeKnowledge(organismeCode);

    // Si pas trouvé par code, recherche par nom
    if (!knowledge && basNom) {
      const searchResults = searchOrganismes(basNom);
      if (searchResults.length > 0) {
        knowledge = searchResults[0]; // Prendre le premier résultat le plus pertinent
      }
    }

    if (!knowledge) {
      return null;
    }

    // Construction de l'objet enrichi
    const enriched: EnrichedOrganismeData = {
      code: organismeCode,
      nom: knowledge.nom,
      type: knowledge.type,
      knowledge,

      // Contact enrichi
      contact_enriched: {
        telephone: knowledge.contact.telephone,
        email: knowledge.contact.email,
        adresse_complete: this.formatAdresse(knowledge.adresse),
        horaires_formatted: this.formatHoraires(knowledge.horaires)
      },

      // Services enrichis
      services_enriched: knowledge.services.map(service => ({
        code: service.code,
        nom: service.nom,
        description_complete: service.description,
        cout_exact: service.cout,
        duree_precise: service.duree_traitement,
        documents_detailles: service.documents_requis
      })),

      // Statistiques enrichies
      statistics_enriched: knowledge.statistiques ? {
        taux_satisfaction: knowledge.statistiques.taux_satisfaction || 0,
        demandes_mensuelles: knowledge.statistiques.demandes_traitees_par_mois || 0,
        delai_moyen: knowledge.statistiques.delai_moyen_traitement || 'Non disponible'
      } : undefined
    };

    return enriched;
  }

  /**
   * Enrichit les données d'un service spécifique
   */
  static enrichServiceData(serviceCode: string, organismeCode: string): ServiceEnriched | null {
    const knowledge = getOrganismeKnowledge(organismeCode);
    if (!knowledge) return null;

    const service = knowledge.services.find(s => s.code === serviceCode);
    if (!service) return null;

    const enriched: ServiceEnriched = {
      code: serviceCode,
      nom: service.nom,
      organisme_code: organismeCode,
      description_complete: service.description,

      procedure_detaillee: {
        etapes: this.generateEtapesProcedure(service),
        duree: service.duree_traitement,
        cout: service.cout,
        documents_requis: service.documents_requis,
        modalites: service.modalites || []
      },

      contact_service: {
        responsable: knowledge.contact.email.length > 0 ? knowledge.contact.email[0] : '',
        telephone: knowledge.contact.telephone.length > 0 ? knowledge.contact.telephone[0] : '',
        email: knowledge.contact.email.length > 0 ? knowledge.contact.email[0] : '',
        horaires: this.formatHoraires(knowledge.horaires)
      }
    };

    return enriched;
  }

  /**
   * Obtient les recommandations d'organismes pertinents pour un service
   */
  static getOrganismeRecommendations(typeService: string, localisation?: string): OrganismeKnowledge[] {
    // Mapping des types de services vers les organismes pertinents
    const serviceToOrganismeMapping: Record<string, string[]> = {
      'IDENTITE': ['DGDI', 'MAIRE_LBV'],
      'ETAT_CIVIL': ['MAIRE_LBV', 'DGDI'],
      'SECURITE_SOCIALE': ['CNSS_GABON', 'CNAMGS'],
      'TRANSPORT': ['MIN_TRANSPORT'],
      'SANTE': ['MIN_SANTE'],
      'STATISTIQUES': ['DGSEE'],
      'PLANIFICATION': ['MIN_PLANIFICATION']
    };

    const organismeIds = serviceToOrganismeMapping[typeService] || [];
    const recommendations: OrganismeKnowledge[] = [];

    organismeIds.forEach(id => {
      const knowledge = getOrganismeKnowledge(id);
      if (knowledge) {
        recommendations.push(knowledge);
      }
    });

    return recommendations;
  }

  /**
   * Génère des suggestions intelligentes basées sur la base de connaissances
   */
  static generateSmartSuggestions(userQuery: string): {
    organismes: OrganismeKnowledge[];
    services: { organisme: string; service: any }[];
    procedures: string[];
  } {
    const queryLower = userQuery.toLowerCase();

    // Recherche d'organismes pertinents
    const organismes = searchOrganismes(queryLower);

    // Recherche de services pertinents
    const services: { organisme: string; service: any }[] = [];
    organismes.forEach(org => {
      org.services.forEach(service => {
        if (service.nom.toLowerCase().includes(queryLower) ||
            service.description.toLowerCase().includes(queryLower)) {
          services.push({ organisme: org.nom, service });
        }
      });
    });

    // Génération de suggestions de procédures
    const procedures = this.generateProcedureSuggestions(queryLower);

    return {
      organismes: organismes.slice(0, 5), // Limiter à 5 résultats
      services: services.slice(0, 10),
      procedures
    };
  }

  /**
   * Valide la cohérence des données entre l'application et la base de connaissances
   */
  static validateDataConsistency(organismeCode: string, appData: any): {
    isConsistent: boolean;
    discrepancies: string[];
    suggestions: string[];
  } {
    const knowledge = getOrganismeKnowledge(organismeCode);
    if (!knowledge) {
      return {
        isConsistent: false,
        discrepancies: ['Organisme non trouvé dans la base de connaissances'],
        suggestions: ['Ajouter cet organisme à la base de connaissances']
      };
    }

    const discrepancies: string[] = [];
    const suggestions: string[] = [];

    // Vérification du nom
    if (appData.nom && appData.nom !== knowledge.nom) {
      discrepancies.push(`Nom différent: "${appData.nom}" vs "${knowledge.nom}"`);
      suggestions.push('Mettre à jour le nom dans l\'application ou la base de connaissances');
    }

    // Vérification des contacts
    if (appData.telephone && !knowledge.contact.telephone.includes(appData.telephone)) {
      discrepancies.push(`Téléphone non cohérent: "${appData.telephone}"`);
      suggestions.push('Vérifier et mettre à jour les informations de contact');
    }

    // Vérification des services
    if (appData.services && knowledge.services) {
      const appServicesCodes = appData.services.map((s: any) => s.code || s.id);
      const knowledgeServicesCodes = knowledge.services.map(s => s.code);

      const missingInKnowledge = appServicesCodes.filter((code: string) =>
        !knowledgeServicesCodes.includes(code));
      const missingInApp = knowledgeServicesCodes.filter(code =>
        !appServicesCodes.includes(code));

      if (missingInKnowledge.length > 0) {
        discrepancies.push(`Services manquants dans la base de connaissances: ${missingInKnowledge.join(', ')}`);
        suggestions.push('Ajouter les services manquants à la base de connaissances');
      }

      if (missingInApp.length > 0) {
        discrepancies.push(`Services manquants dans l'application: ${missingInApp.join(', ')}`);
        suggestions.push('Ajouter les services manquants à l\'application');
      }
    }

    return {
      isConsistent: discrepancies.length === 0,
      discrepancies,
      suggestions
    };
  }

  // Méthodes utilitaires privées

  private static formatAdresse(adresse: OrganismeKnowledge['adresse']): string {
    const parts = [
      adresse.siege,
      adresse.quartier,
      adresse.ville,
      adresse.codePostal
    ].filter(Boolean);

    return parts.join(', ');
  }

  private static formatHoraires(horaires: OrganismeKnowledge['horaires']): string {
    const jours = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
    const horairesParts: string[] = [];

    let currentRange: { debut: string; fin: string; jours: string[] } | null = null;

    jours.forEach(jour => {
      const horaire = horaires[jour as keyof typeof horaires];
      if (horaire) {
        if (!currentRange ||
            currentRange.debut !== horaire.debut ||
            currentRange.fin !== horaire.fin) {

          if (currentRange) {
            horairesParts.push(`${currentRange.jours.join('-')}: ${currentRange.debut}-${currentRange.fin}`);
          }

          currentRange = {
            debut: horaire.debut,
            fin: horaire.fin,
            jours: [jour]
          };
        } else {
          currentRange.jours.push(jour);
        }
      }
    });

    if (currentRange) {
      horairesParts.push(`${currentRange.jours.join('-')}: ${currentRange.debut}-${currentRange.fin}`);
    }

    return horairesParts.join(', ') || 'Horaires non disponibles';
  }

  private static generateEtapesProcedure(service: OrganismeKnowledge['services'][0]): string[] {
    // Génération d'étapes basiques basées sur le type de service
    const etapesBase = [
      'Rassembler les documents requis',
      'Se rendre au guichet ou faire la demande en ligne',
      'Déposer le dossier complet',
      'Attendre le traitement',
      'Récupérer le document ou recevoir la prestation'
    ];

    // Personnalisation selon les modalités du service
    if (service.modalites) {
      const etapesPersonnalisees: string[] = [];

      service.modalites.forEach(modalite => {
        if (modalite.toLowerCase().includes('en ligne')) {
          etapesPersonnalisees.push('Effectuer la demande en ligne sur le portail officiel');
        } else if (modalite.toLowerCase().includes('dépôt')) {
          etapesPersonnalisees.push('Déposer le dossier au guichet physique');
        }
      });

      return etapesPersonnalisees.length > 0 ? etapesPersonnalisees : etapesBase;
    }

    return etapesBase;
  }

  private static generateProcedureSuggestions(query: string): string[] {
    const suggestions: string[] = [];

    // Suggestions basées sur des mots-clés communs
    const keywords = {
      'passeport': ['Demande de passeport biométrique', 'Renouvellement de passeport'],
      'carte': ['Demande de carte nationale d\'identité', 'Carte grise véhicule'],
      'naissance': ['Demande d\'acte de naissance', 'Déclaration de naissance'],
      'mariage': ['Demande d\'acte de mariage', 'Célébration de mariage civil'],
      'permis': ['Demande de permis de conduire', 'Permis de construire'],
      'retraite': ['Demande de pension de retraite', 'Liquidation droits retraite'],
      'emploi': ['Recherche d\'emploi', 'Inscription au Pôle Emploi']
    };

    Object.entries(keywords).forEach(([keyword, proceduresList]) => {
      if (query.includes(keyword)) {
        suggestions.push(...proceduresList);
      }
    });

    return [...new Set(suggestions)]; // Supprimer les doublons
  }
}

/**
 * Hook pour utiliser le service d'intégration dans les composants React
 */
export function useKnowledgeIntegration() {
  const enrichOrganisme = (code: string, nom?: string) => {
    return KnowledgeIntegrationService.enrichOrganismeData(code, nom);
  };

  const enrichService = (serviceCode: string, organismeCode: string) => {
    return KnowledgeIntegrationService.enrichServiceData(serviceCode, organismeCode);
  };

  const getRecommendations = (typeService: string, localisation?: string) => {
    return KnowledgeIntegrationService.getOrganismeRecommendations(typeService, localisation);
  };

  const getSuggestions = (query: string) => {
    return KnowledgeIntegrationService.generateSmartSuggestions(query);
  };

  const validateConsistency = (organismeCode: string, appData: any) => {
    return KnowledgeIntegrationService.validateDataConsistency(organismeCode, appData);
  };

  return {
    enrichOrganisme,
    enrichService,
    getRecommendations,
    getSuggestions,
    validateConsistency
  };
}

/**
 * Utilitaires pour l'export et l'import de données
 */
export class KnowledgeDataUtils {

  /**
   * Exporte la base de connaissances en différents formats
   */
  static exportKnowledgeBase(format: 'json' | 'csv' | 'xml' = 'json'): string {
    switch (format) {
      case 'json':
        return JSON.stringify({
          metadata: {
            export_date: new Date().toISOString(),
            total_organismes: ORGANISMES_KNOWLEDGE_BASE.length,
            version: '1.0'
          },
          organismes: ORGANISMES_KNOWLEDGE_BASE
        }, null, 2);

      case 'csv':
        return this.convertToCSV();

      case 'xml':
        return this.convertToXML();

      default:
        throw new Error(`Format non supporté: ${format}`);
    }
  }

  /**
   * Génère un rapport de complétude de la base de connaissances
   */
  static generateCompletudeReport(): {
    global: number;
    par_organisme: { id: string; nom: string; completude: number }[];
    champs_manquants: { champ: string; organismes_concernes: number }[];
    recommandations: string[];
  } {
    const totalOrganismes = ORGANISMES_KNOWLEDGE_BASE.length;

    // Calcul de la complétude globale
    const completudeGlobale = ORGANISMES_KNOWLEDGE_BASE.reduce((sum, org) =>
      sum + org.metadonnees.completude, 0) / totalOrganismes;

    // Complétude par organisme
    const parOrganisme = ORGANISMES_KNOWLEDGE_BASE.map(org => ({
      id: org.id,
      nom: org.nom,
      completude: org.metadonnees.completude
    }));

    // Analyse des champs manquants
    const champsAnalyse = [
      'vision', 'historique', 'effectifs', 'budget', 'statistiques',
      'projets_en_cours', 'partenaires'
    ];

    const champsMnaquants = champsAnalyse.map(champ => {
      const organismesManquants = ORGANISMES_KNOWLEDGE_BASE.filter(org =>
        !org[champ as keyof OrganismeKnowledge] ||
        (Array.isArray(org[champ as keyof OrganismeKnowledge]) &&
         (org[champ as keyof OrganismeKnowledge] as any[]).length === 0)
      ).length;

      return {
        champ,
        organismes_concernes: organismesManquants
      };
    });

    // Génération de recommandations
    const recommandations: string[] = [];

    if (completudeGlobale < 80) {
      recommandations.push('Améliorer la complétude globale en collectant plus de données');
    }

    const organismesFaibleCompletude = parOrganisme.filter(org => org.completude < 70);
    if (organismesFaibleCompletude.length > 0) {
      recommandations.push(`Prioriser l'enrichissement de ${organismesFaibleCompletude.length} organismes à faible complétude`);
    }

    const champLePlusManquant = champsMnaquants.reduce((max, current) =>
      current.organismes_concernes > max.organismes_concernes ? current : max
    );

    if (champLePlusManquant.organismes_concernes > totalOrganismes * 0.5) {
      recommandations.push(`Concentrer les efforts sur la collecte du champ "${champLePlusManquant.champ}"`);
    }

    return {
      global: Math.round(completudeGlobale),
      par_organisme: parOrganisme.sort((a, b) => a.completude - b.completude),
      champs_manquants: champsMnaquants.sort((a, b) => b.organismes_concernes - a.organismes_concernes),
      recommandations
    };
  }

  private static convertToCSV(): string {
    // Implémentation simplifiée pour CSV
    const headers = ['ID', 'Nom', 'Type', 'Description', 'Ville', 'Telephone', 'Email', 'Completude'];
    const rows = ORGANISMES_KNOWLEDGE_BASE.map(org => [
      org.id,
      org.nom,
      org.type,
      org.description.replace(/[,;]/g, ' '),
      org.adresse.ville,
      org.contact.telephone.join(' | '),
      org.contact.email.join(' | '),
      org.metadonnees.completude
    ]);

    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }

  private static convertToXML(): string {
    // Implémentation simplifiée pour XML
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<knowledge_base>\n';

    ORGANISMES_KNOWLEDGE_BASE.forEach(org => {
      xml += `  <organisme id="${org.id}">\n`;
      xml += `    <nom>${org.nom}</nom>\n`;
      xml += `    <type>${org.type}</type>\n`;
      xml += `    <description><![CDATA[${org.description}]]></description>\n`;
      xml += `    <completude>${org.metadonnees.completude}</completude>\n`;
      xml += `  </organisme>\n`;
    });

    xml += '</knowledge_base>';
    return xml;
  }
}

// Export par défaut du service principal
export default KnowledgeIntegrationService;
