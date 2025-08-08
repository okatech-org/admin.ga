/**
 * SERVICE API POUR LE SYSTÈME RH GABONAIS
 * Expose les données RH (postes, fonctionnaires, comptes) via API REST
 */

import {
  initialiserSystemeRH,
  SystemeRHComplet,
  PosteOrganisme,
  Fonctionnaire,
  CompteActif,
  rechercherPostesVacants,
  proposerAffectations,
  genererRapportRH
} from '@/lib/data/systeme-rh-gabon';

// ==================== CACHE ET SINGLETON ====================

class SystemeRHAPIService {
  private systemeRHCache: SystemeRHComplet | null = null;
  private cacheTimestamp: number = 0;
  private readonly CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

  /**
   * Obtenir le système RH avec cache
   */
  async getSystemeRH(): Promise<SystemeRHComplet> {
    const now = Date.now();

    // Vérifier le cache
    if (this.systemeRHCache && (now - this.cacheTimestamp) < this.CACHE_DURATION) {
      return this.systemeRHCache;
    }

    // Initialiser le système RH
    console.log('🔄 Chargement du système RH gabonais...');
    this.systemeRHCache = await initialiserSystemeRH();
    this.cacheTimestamp = now;

    return this.systemeRHCache;
  }

  /**
   * Invalider le cache
   */
  invalidateCache(): void {
    this.systemeRHCache = null;
    this.cacheTimestamp = 0;
    console.log('🗑️ Cache RH invalidé');
  }

  // ==================== API POSTES VACANTS ====================

  /**
   * Obtenir les postes vacants (offres d'emploi)
   */
  async getPostesVacants(params?: {
    page?: number;
    limit?: number;
    organisme_code?: string;
    niveau?: number;
    salaire_min?: number;
  }): Promise<{
    success: boolean;
    data: {
      postes: any[];
      total: number;
      pagination: {
        page: number;
        limit: number;
        totalPages: number;
      };
    };
  }> {
    try {
      const systeme = await this.getSystemeRH();

      // Rechercher les postes selon critères
      let postes = rechercherPostesVacants(systeme, {
        organisme_code: params?.organisme_code,
        niveau: params?.niveau,
        salaire_min: params?.salaire_min
      });

      // Pagination
      const page = params?.page || 1;
      const limit = params?.limit || 20;
      const offset = (page - 1) * limit;
      const total = postes.length;
      const totalPages = Math.ceil(total / limit);

      // Paginer
      const postesPages = postes.slice(offset, offset + limit);

      // Transformer pour l'API
      const postesAPI = postesPages.map(poste => ({
        id: poste.id,
        titre: poste.poste_titre,
        code: poste.poste_code,
        organisme_code: poste.organisme_code,
        organisme_nom: systeme.organismes.find(o => o.code === poste.organisme_code)?.nom,
        niveau: poste.niveau,
        niveau_label: poste.niveau === 1 ? 'Direction' : poste.niveau === 2 ? 'Encadrement' : 'Exécution',
        salaire_base: poste.salaire_base,
        statut: poste.statut,
        date_vacance: poste.date_vacance,
        prerequis: poste.prerequis,
        description: poste.description
      }));

      return {
        success: true,
        data: {
          postes: postesAPI,
          total,
          pagination: {
            page,
            limit,
            totalPages
          }
        }
      };
    } catch (error) {
      console.error('Erreur API postes vacants:', error);
      return {
        success: false,
        data: {
          postes: [],
          total: 0,
          pagination: { page: 1, limit: 20, totalPages: 0 }
        }
      };
    }
  }

  // ==================== API FONCTIONNAIRES ====================

  /**
   * Obtenir les fonctionnaires en attente d'affectation
   */
  async getFonctionnairesEnAttente(params?: {
    page?: number;
    limit?: number;
    grade?: string;
    search?: string;
  }): Promise<{
    success: boolean;
    data: {
      fonctionnaires: any[];
      total: number;
      pagination: {
        page: number;
        limit: number;
        totalPages: number;
      };
    };
  }> {
    try {
      const systeme = await this.getSystemeRH();

      let fonctionnaires = systeme.fonctionnaires_en_attente;

      // Filtrage
      if (params?.grade) {
        fonctionnaires = fonctionnaires.filter(f => f.grade === params.grade);
      }

      if (params?.search) {
        const searchLower = params.search.toLowerCase();
        fonctionnaires = fonctionnaires.filter(f =>
          f.nom.toLowerCase().includes(searchLower) ||
          f.prenom.toLowerCase().includes(searchLower) ||
          f.matricule.toLowerCase().includes(searchLower)
        );
      }

      // Pagination
      const page = params?.page || 1;
      const limit = params?.limit || 20;
      const offset = (page - 1) * limit;
      const total = fonctionnaires.length;
      const totalPages = Math.ceil(total / limit);

      // Paginer
      const fonctionnairesPages = fonctionnaires.slice(offset, offset + limit);

      // Transformer pour l'API avec la structure attendée par le frontend
      const fonctionnairesAPI = fonctionnairesPages.map(f => ({
        id: f.id,
        matricule: f.matricule,
        nom: f.nom,
        prenom: f.prenom,
        email: f.email,
        telephone: f.telephone || `+241 ${Math.floor(Math.random() * 90000000) + 10000000}`,
        dateNaissance: f.date_naissance || new Date(1980 + Math.floor(Math.random() * 30), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
        lieuNaissance: f.lieu_naissance || 'Libreville',
        diplomes: f.diplomes?.map(d => ({
          niveau: d.niveau || 'Licence',
          intitule: d.intitule || 'Administration',
          etablissement: d.etablissement || 'Université Omar Bongo',
          annee: d.annee || 2020
        })) || [{
          niveau: 'Licence',
          intitule: 'Administration',
          etablissement: 'Université Omar Bongo',
          annee: 2020
        }],
        experiencePrecedente: f.affectations_precedentes?.map(exp => ({
          poste: exp.poste_titre || 'Agent administratif',
          organisme: exp.organisme_nom || 'Administration',
          duree: exp.duree || '2 ans',
          description: exp.description || 'Fonctions administratives'
        })) || [],
        statut: f.statut || 'EN_ATTENTE',
        dateInscription: f.date_entree_fonction_publique || new Date().toISOString().split('T')[0],
        prioriteAffectation: f.priorite_affectation || 'MOYENNE',
        preferences: {
          organismes: f.preferences_affectation?.organismes_preferes || ['Ministères'],
          regions: f.preferences_affectation?.regions_preferees || ['Libreville'],
          typePoste: f.preferences_affectation?.types_postes || ['Administration']
        },
        rattachementPrimaire: f.affectation_actuelle ? {
          organisme: f.affectation_actuelle.organisme_nom,
          service: f.affectation_actuelle.service,
          poste: f.affectation_actuelle.poste_titre,
          dateDebut: f.affectation_actuelle.date_debut
        } : undefined,
        rattachementSecondaire: f.affectation_secondaire ? {
          organisme: f.affectation_secondaire.organisme_nom,
          service: f.affectation_secondaire.service,
          poste: f.affectation_secondaire.poste_titre,
          dateDebut: f.affectation_secondaire.date_debut,
          pourcentageTemps: f.affectation_secondaire.pourcentage_temps || 50
        } : undefined,
        historique: f.historique_actions?.map(h => ({
          action: h.action,
          date: h.date,
          organisme: h.organisme,
          motif: h.motif,
          responsable: h.responsable
        })) || [{
          action: 'Inscription',
          date: f.date_entree_fonction_publique || new Date().toISOString(),
          motif: 'Nouvelle inscription',
          responsable: 'Direction des Ressources Humaines'
        }],
        evaluation: f.derniere_evaluation ? {
          note: f.derniere_evaluation.note,
          commentaires: f.derniere_evaluation.commentaires,
          evaluateur: f.derniere_evaluation.evaluateur,
          date: f.derniere_evaluation.date
        } : undefined
      }));

      return {
        success: true,
        data: {
          fonctionnaires: fonctionnairesAPI,
          total,
          pagination: {
            page,
            limit,
            totalPages
          }
        }
      };
    } catch (error) {
      console.error('Erreur API fonctionnaires en attente:', error);
      return {
        success: false,
        data: {
          fonctionnaires: [],
          total: 0,
          pagination: { page: 1, limit: 20, totalPages: 0 }
        }
      };
    }
  }

  // ==================== API COMPTES ACTIFS ====================

  /**
   * Obtenir les comptes actifs
   */
  async getComptesActifs(params?: {
    page?: number;
    limit?: number;
    organisme_code?: string;
    role?: string;
    search?: string;
  }): Promise<{
    success: boolean;
    data: {
      comptes: any[];
      total: number;
      pagination: {
        page: number;
        limit: number;
        totalPages: number;
      };
    };
  }> {
    try {
      const systeme = await this.getSystemeRH();

      let comptes = systeme.comptes_actifs;

      // Filtrage
      if (params?.organisme_code) {
        comptes = comptes.filter(c => c.organisme_code === params.organisme_code);
      }

      if (params?.role) {
        comptes = comptes.filter(c => c.role_systeme === params.role);
      }

      if (params?.search) {
        const searchLower = params.search.toLowerCase();
        comptes = comptes.filter(c =>
          c.fonctionnaire_nom_complet.toLowerCase().includes(searchLower) ||
          c.poste_titre.toLowerCase().includes(searchLower)
        );
      }

      // Pagination
      const page = params?.page || 1;
      const limit = params?.limit || 20;
      const offset = (page - 1) * limit;
      const total = comptes.length;
      const totalPages = Math.ceil(total / limit);

      // Paginer
      const comptesPages = comptes.slice(offset, offset + limit);

      // Enrichir avec les données des fonctionnaires
      const comptesAPI = comptesPages.map(compte => {
        const fonctionnaire = systeme.fonctionnaires.find(f => f.id === compte.fonctionnaire_id);

        return {
          id: compte.id,
          fonctionnaire: {
            id: compte.fonctionnaire_id,
            nom_complet: compte.fonctionnaire_nom_complet,
            matricule: fonctionnaire?.matricule,
            grade: fonctionnaire?.grade,
            email: fonctionnaire?.email,
            telephone: fonctionnaire?.telephone
          },
          poste: {
            id: compte.poste_id,
            titre: compte.poste_titre,
            organisme_code: compte.organisme_code,
            organisme_nom: compte.organisme_nom
          },
          role_systeme: compte.role_systeme,
          date_affectation: compte.date_affectation,
          statut: compte.statut,
          permissions: compte.permissions,
          dernier_acces: compte.dernier_acces,
          derniere_evaluation: compte.derniere_evaluation
        };
      });

      return {
        success: true,
        data: {
          comptes: comptesAPI,
          total,
          pagination: {
            page,
            limit,
            totalPages
          }
        }
      };
    } catch (error) {
      console.error('Erreur API comptes actifs:', error);
      return {
        success: false,
        data: {
          comptes: [],
          total: 0,
          pagination: { page: 1, limit: 20, totalPages: 0 }
        }
      };
    }
  }

  // ==================== API PROPOSITIONS ====================

  /**
   * Obtenir les propositions d'affectation
   */
  async getPropositionsAffectation(params?: {
    fonctionnaire_id?: string;
    limit?: number;
  }): Promise<{
    success: boolean;
    data: {
      propositions: any[];
      total: number;
    };
  }> {
    try {
      const systeme = await this.getSystemeRH();

      let propositions = proposerAffectations(systeme);

      // Filtrer par fonctionnaire si spécifié
      if (params?.fonctionnaire_id) {
        propositions = propositions.filter(p => p.fonctionnaire.id === params.fonctionnaire_id);
      }

      // Limiter le nombre de résultats
      const limit = params?.limit || 10;
      propositions = propositions.slice(0, limit);

      // Transformer pour l'API
      const propositionsAPI = propositions.map(prop => ({
        fonctionnaire: {
          id: prop.fonctionnaire.id,
          matricule: prop.fonctionnaire.matricule,
          nom_complet: `${prop.fonctionnaire.prenom} ${prop.fonctionnaire.nom}`,
          grade: prop.fonctionnaire.grade,
          anciennete: prop.fonctionnaire.anciennete_annees
        },
        postes_proposes: prop.postes_proposes.map(poste => ({
          id: poste.id,
          titre: poste.poste_titre,
          organisme_code: poste.organisme_code,
          organisme_nom: systeme.organismes.find(o => o.code === poste.organisme_code)?.nom,
          niveau: poste.niveau,
          salaire_base: poste.salaire_base,
          compatibilite: 'EXCELLENTE' // Calculer selon critères
        })),
        nombre_propositions: prop.postes_proposes.length
      }));

      return {
        success: true,
        data: {
          propositions: propositionsAPI,
          total: propositionsAPI.length
        }
      };
    } catch (error) {
      console.error('Erreur API propositions:', error);
      return {
        success: false,
        data: {
          propositions: [],
          total: 0
        }
      };
    }
  }

  // ==================== API STATISTIQUES RH ====================

  /**
   * Obtenir les statistiques RH
   */
  async getStatistiquesRH(): Promise<{
    success: boolean;
    data: any;
  }> {
    try {
      const systeme = await this.getSystemeRH();
      const rapport = genererRapportRH(systeme);

      return {
        success: true,
        data: {
          ...rapport,
          statistiques_detaillees: systeme.statistiques,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('Erreur API statistiques RH:', error);
      return {
        success: false,
        data: null
      };
    }
  }

  /**
   * Obtenir la liste des organismes
   */
  async getOrganismes(params?: {
    search?: string;
    type?: string;
  }): Promise<{
    success: boolean;
    data: any;
  }> {
    try {
      const systeme = await this.getSystemeRH();
      let organismes = systeme.organismes;

      // Filtrer par recherche textuelle
      if (params?.search) {
        const searchTerm = params.search.toLowerCase();
        organismes = organismes.filter(org =>
          org.nom.toLowerCase().includes(searchTerm) ||
          org.code.toLowerCase().includes(searchTerm)
        );
      }

      // Filtrer par type
      if (params?.type) {
        organismes = organismes.filter(org => org.type === params.type);
      }

      return {
        success: true,
        data: {
          organismes,
          total: organismes.length,
          par_type: systeme.statistiques?.repartition_par_type || {}
        }
      };
    } catch (error) {
      console.error('Erreur API organismes:', error);
      return {
        success: false,
        data: null
      };
    }
  }

  // ==================== API MUTATIONS ====================

  /**
   * Affecter un fonctionnaire à un poste
   */
  async affecterFonctionnaire(data: {
    fonctionnaire_id: string;
    poste_id: string;
  }): Promise<{
    success: boolean;
    message: string;
    compte?: CompteActif;
  }> {
    try {
      const systeme = await this.getSystemeRH();

      // Trouver le fonctionnaire
      const fonctionnaire = systeme.fonctionnaires_en_attente.find(f => f.id === data.fonctionnaire_id);
      if (!fonctionnaire) {
        return {
          success: false,
          message: 'Fonctionnaire non trouvé ou déjà affecté'
        };
      }

      // Trouver le poste
      const poste = systeme.postes_vacants.find(p => p.id === data.poste_id);
      if (!poste) {
        return {
          success: false,
          message: 'Poste non trouvé ou déjà occupé'
        };
      }

      // Créer le compte actif (simulation)
      const nouveauCompte: CompteActif = {
        id: `compte_${fonctionnaire.id}_${poste.id}`,
        fonctionnaire_id: fonctionnaire.id,
        fonctionnaire_nom_complet: `${fonctionnaire.prenom} ${fonctionnaire.nom}`,
        poste_id: poste.id,
        poste_titre: poste.poste_titre,
        organisme_code: poste.organisme_code,
        organisme_nom: systeme.organismes.find(o => o.code === poste.organisme_code)?.nom || '',
        role_systeme: 'USER', // À déterminer selon le poste
        date_affectation: new Date(),
        statut: 'ACTIF',
        permissions: ['lecture', 'ecriture'],
        dernier_acces: new Date()
      };

      // Invalider le cache pour forcer le rechargement
      this.invalidateCache();

      return {
        success: true,
        message: 'Affectation réussie',
        compte: nouveauCompte
      };
    } catch (error) {
      console.error('Erreur affectation:', error);
      return {
        success: false,
        message: 'Erreur lors de l\'affectation'
      };
    }
  }
}

// ==================== INSTANCE SINGLETON ====================

export const systemeRHAPI = new SystemeRHAPIService();

// ==================== FONCTIONS D'API SIMPLIFIÉES ====================

export async function getPostesVacantsAPI(params?: any) {
  return systemeRHAPI.getPostesVacants(params);
}

export async function getFonctionnairesEnAttenteAPI(params?: any) {
  return systemeRHAPI.getFonctionnairesEnAttente(params);
}

export async function getComptesActifsAPI(params?: any) {
  return systemeRHAPI.getComptesActifs(params);
}

export async function getPropositionsAPI(params?: any) {
  return systemeRHAPI.getPropositionsAffectation(params);
}

export async function getStatistiquesRHAPI() {
  return systemeRHAPI.getStatistiquesRH();
}

export async function affecterFonctionnaireAPI(data: any) {
  return systemeRHAPI.affecterFonctionnaire(data);
}

export async function getOrganismesAPI(params?: any) {
  return systemeRHAPI.getOrganismes(params);
}

// ==================== EXPORT ====================

export default systemeRHAPI;
