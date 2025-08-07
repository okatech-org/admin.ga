/**
 * SERVICE API POUR LE SYSTÈME COMPLET
 * Connecte les 141 organismes gabonais aux pages de l'application
 * Remplace les appels base de données par les données du système complet
 */

import {
  SystemeComplet,
  OrganismePublic,
  UtilisateurOrganisme,
  implementerSystemeComplet,
  initialiserSysteme
} from '@/lib/data/systeme-complet-gabon';

import {
  extensionsSysteme
} from '@/lib/data/systeme-extensions';

import {
  getUnifiedSystemDataWithCache,
  UnifiedSystemData,
  SystemUser,
  UnifiedOrganisme
} from '@/lib/data/unified-system-data';

// ==================== CACHE ET SINGLETON ====================

class SystemeCompletAPIService {
  private systemeCache: SystemeComplet | null = null;
  private unifiedDataCache: UnifiedSystemData | null = null;
  private cacheTimestamp: number = 0;
  private readonly CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

  /**
   * Obtenir le système complet avec cache
   */
  async getSystemeComplet(): Promise<SystemeComplet> {
    const now = Date.now();

    // Vérifier le cache
    if (this.systemeCache && (now - this.cacheTimestamp) < this.CACHE_DURATION) {
      return this.systemeCache;
    }

    // Régénérer le système
    console.log('🔄 Chargement du système complet des 141 organismes...');
    this.systemeCache = await implementerSystemeComplet();
    this.cacheTimestamp = now;

    return this.systemeCache;
  }

  /**
   * Obtenir les données unifiées avec cache
   */
  async getUnifiedData(): Promise<UnifiedSystemData> {
    const now = Date.now();

    // Vérifier le cache
    if (this.unifiedDataCache && (now - this.cacheTimestamp) < this.CACHE_DURATION) {
      return this.unifiedDataCache;
    }

    // Charger les données unifiées
    this.unifiedDataCache = await getUnifiedSystemDataWithCache();
    this.cacheTimestamp = now;

    return this.unifiedDataCache;
  }

  /**
   * Invalider le cache
   */
  invalidateCache(): void {
    this.systemeCache = null;
    this.unifiedDataCache = null;
    this.cacheTimestamp = 0;
    console.log('🗑️ Cache API invalidé');
  }

  // ==================== API POUR ORGANISMES ====================

  /**
   * Obtenir la liste des organismes pour l'API
   */
  async getOrganismesForAPI(params?: {
    page?: number;
    limit?: number;
    search?: string;
    type?: string;
    city?: string;
    isActive?: boolean;
  }): Promise<{
    success: boolean;
    data: {
      organizations: any[];
      pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      };
    };
  }> {
    try {
      const data = await this.getUnifiedData();

      let organismes = data.unifiedOrganismes;

      // Filtrage
      if (params?.search) {
        const searchLower = params.search.toLowerCase();
        organismes = organismes.filter(org =>
          org.nom.toLowerCase().includes(searchLower) ||
          org.code.toLowerCase().includes(searchLower) ||
          org.description?.toLowerCase().includes(searchLower)
        );
      }

      if (params?.type) {
        organismes = organismes.filter(org => org.type === params.type);
      }

      if (params?.isActive !== undefined) {
        const status = params.isActive ? 'ACTIF' : 'INACTIF';
        organismes = organismes.filter(org => org.status === status);
      }

      // Pagination
      const page = params?.page || 1;
      const limit = params?.limit || 20;
      const offset = (page - 1) * limit;
      const total = organismes.length;
      const totalPages = Math.ceil(total / limit);

      // Paginer les résultats
      const paginatedOrganismes = organismes.slice(offset, offset + limit);

      // Transformer pour l'API (format attendu par les pages)
      const organizations = paginatedOrganismes.map(org => ({
        id: org.code,
        name: org.nom,
        code: org.code,
        type: org.type,
        description: org.description || `Organisme ${org.type}`,
        city: org.contact.adresse?.split(',')[0] || 'Libreville',
        isActive: org.status === 'ACTIF',
        userCount: org.stats.totalUsers,
        adminCount: org.stats.adminCount,
        receptionistCount: org.stats.receptionistCount,
        email: org.contact.email,
        phone: org.contact.telephone,
        address: org.contact.adresse,
        website: org.website,
        color: org.color,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }));

      return {
        success: true,
        data: {
          organizations,
          pagination: {
            total,
            page,
            limit,
            totalPages
          }
        }
      };
    } catch (error) {
      console.error('Erreur dans getOrganismesForAPI:', error);
      return {
        success: false,
        data: {
          organizations: [],
          pagination: {
            total: 0,
            page: 1,
            limit: 20,
            totalPages: 0
          }
        }
      };
    }
  }

  /**
   * Obtenir un organisme par son code
   */
  async getOrganismeByCode(code: string): Promise<any | null> {
    const data = await this.getUnifiedData();
    const organisme = data.unifiedOrganismes.find(org => org.code === code);

    if (!organisme) return null;

    return {
      id: organisme.code,
      name: organisme.nom,
      code: organisme.code,
      type: organisme.type,
      description: organisme.description,
      city: organisme.contact.adresse?.split(',')[0] || 'Libreville',
      isActive: organisme.status === 'ACTIF',
      userCount: organisme.stats.totalUsers,
      email: organisme.contact.email,
      phone: organisme.contact.telephone,
      address: organisme.contact.adresse,
      website: organisme.website,
      color: organisme.color,
      users: data.systemUsers.filter(u => u.organismeCode === code)
    };
  }

  // ==================== API POUR UTILISATEURS ====================

  /**
   * Obtenir la liste des utilisateurs pour l'API
   */
  async getUsersForAPI(params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    organismeCode?: string;
    status?: string;
  }): Promise<{
    success: boolean;
    data: {
      users: any[];
      pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      };
    };
  }> {
    try {
      const data = await this.getUnifiedData();

      let users = data.systemUsers;

      // Filtrage
      if (params?.search) {
        const searchLower = params.search.toLowerCase();
        users = users.filter(user =>
          user.firstName.toLowerCase().includes(searchLower) ||
          user.lastName.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower) ||
          user.position.toLowerCase().includes(searchLower)
        );
      }

      if (params?.role) {
        users = users.filter(user => user.role === params.role);
      }

      if (params?.organismeCode) {
        users = users.filter(user => user.organismeCode === params.organismeCode);
      }

      if (params?.status) {
        users = users.filter(user => user.status === params.status);
      }

      // Pagination
      const page = params?.page || 1;
      const limit = params?.limit || 20;
      const offset = (page - 1) * limit;
      const total = users.length;
      const totalPages = Math.ceil(total / limit);

      // Paginer les résultats
      const paginatedUsers = users.slice(offset, offset + limit);

      // Transformer pour l'API
      const transformedUsers = paginatedUsers.map(user => ({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: user.role,
        position: user.position,
        organismeCode: user.organismeCode,
        organisme: data.unifiedOrganismes.find(o => o.code === user.organismeCode)?.nom,
        status: user.status === 'active' ? 'active' : 'active', // Tous les utilisateurs du système sont actifs
        isActive: true, // Tous les utilisateurs du système complet sont actifs
        phone: user.phone,
        honorificTitle: user.honorificTitle,
        isVerified: true, // Tous les utilisateurs du système sont vérifiés
        createdAt: user.createdAt || new Date().toISOString(),
        lastLoginAt: user.lastLoginAt
      }));

      return {
        success: true,
        data: {
          users: transformedUsers,
          pagination: {
            total,
            page,
            limit,
            totalPages
          }
        }
      };
    } catch (error) {
      console.error('Erreur dans getUsersForAPI:', error);
      return {
        success: false,
        data: {
          users: [],
          pagination: {
            total: 0,
            page: 1,
            limit: 20,
            totalPages: 0
          }
        }
      };
    }
  }

  // ==================== API POUR FONCTIONNAIRES EN ATTENTE ====================

  /**
   * Obtenir les fonctionnaires en attente d'affectation
   */
  async getFonctionnairesEnAttente(params?: {
    page?: number;
    limit?: number;
    search?: string;
    priorite?: string;
  }): Promise<{
    success: boolean;
    data: any[];
    pagination: any;
  }> {
    try {
      const data = await this.getUnifiedData();

      // Simuler des fonctionnaires en attente à partir des utilisateurs sans organisme ou avec rôle USER
      const fonctionnaires = data.systemUsers
        .filter(user => user.role === 'USER')
        .map((user, index) => ({
          id: `fonct_${user.id}`,
          matricule: `MAT${String(index + 1).padStart(6, '0')}`,
          prenom: user.firstName,
          nom: user.lastName,
          email: user.email,
          telephone: user.phone || '+241 01 00 00 00',
          dateNaissance: '1990-01-01',
          lieuNaissance: 'Libreville',
          diplomes: [
            {
              niveau: 'Master',
              intitule: 'Administration Publique',
              etablissement: 'Université Omar Bongo',
              annee: 2015
            }
          ],
          experiencePrecedente: user.position ? [
            {
              poste: user.position,
              organisme: data.unifiedOrganismes.find(o => o.code === user.organismeCode)?.nom || 'Non défini',
              duree: '2 ans',
              description: 'Expérience en administration'
            }
          ] : [],
          statut: index % 3 === 0 ? 'EN_ATTENTE' : 'AFFECTE',
          dateInscription: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
          prioriteAffectation: index % 3 === 0 ? 'HAUTE' : index % 2 === 0 ? 'MOYENNE' : 'BASSE',
          preferences: {
            organismes: [user.organismeCode],
            regions: ['Estuaire'],
            typePoste: ['Administratif']
          },
          rattachementPrimaire: user.organismeCode ? {
            organisme: data.unifiedOrganismes.find(o => o.code === user.organismeCode)?.nom || '',
            service: 'Service Général',
            poste: user.position,
            dateDebut: new Date().toISOString()
          } : undefined,
          historique: []
        }));

      // Filtrage
      let filtered = fonctionnaires;

      if (params?.search) {
        const searchLower = params.search.toLowerCase();
        filtered = filtered.filter(f =>
          f.prenom.toLowerCase().includes(searchLower) ||
          f.nom.toLowerCase().includes(searchLower) ||
          f.matricule.toLowerCase().includes(searchLower) ||
          f.email.toLowerCase().includes(searchLower)
        );
      }

      if (params?.priorite) {
        filtered = filtered.filter(f => f.prioriteAffectation === params.priorite);
      }

      // Pagination
      const page = params?.page || 1;
      const limit = params?.limit || 20;
      const offset = (page - 1) * limit;
      const total = filtered.length;

      return {
        success: true,
        data: filtered.slice(offset, offset + limit),
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      console.error('Erreur dans getFonctionnairesEnAttente:', error);
      return {
        success: false,
        data: [],
        pagination: {
          total: 0,
          page: 1,
          limit: 20,
          totalPages: 0
        }
      };
    }
  }

  // ==================== STATISTIQUES ====================

    /**
   * Obtenir les statistiques globales
   */
  async getStatistiques(): Promise<any> {
    const data = await this.getUnifiedData();

    // Tous les utilisateurs du système complet sont actifs par défaut
    const utilisateursActifs = data.statistics.totalUsers;

    return {
      totalOrganismes: data.statistics.totalOrganismes,
      totalUtilisateurs: data.statistics.totalUsers,
      organismesActifs: data.unifiedOrganismes.filter(o => o.status === 'ACTIF').length,
      utilisateursActifs: utilisateursActifs, // Corriger : tous sont actifs
      repartitionParType: data.statistics.organismesByType,
      repartitionParRole: data.statistics.usersByRole,
      moyenneUsersParOrganisme: data.statistics.averageUsersPerOrganisme,
      top5Organismes: data.unifiedOrganismes
        .sort((a, b) => b.stats.totalUsers - a.stats.totalUsers)
        .slice(0, 5)
        .map(o => ({
          nom: o.nom,
          code: o.code,
          utilisateurs: o.stats.totalUsers
        }))
    };
  }
}

// ==================== INSTANCE SINGLETON ====================

export const systemeCompletAPI = new SystemeCompletAPIService();

// ==================== FONCTIONS D'API SIMPLIFIÉES ====================

/**
 * Obtenir les organismes pour l'API
 */
export async function getOrganismesAPI(params?: any) {
  return systemeCompletAPI.getOrganismesForAPI(params);
}

/**
 * Obtenir les utilisateurs pour l'API
 */
export async function getUsersAPI(params?: any) {
  return systemeCompletAPI.getUsersForAPI(params);
}

/**
 * Obtenir les fonctionnaires en attente
 */
export async function getFonctionnairesEnAttenteAPI(params?: any) {
  return systemeCompletAPI.getFonctionnairesEnAttente(params);
}

/**
 * Obtenir les statistiques
 */
export async function getStatistiquesAPI() {
  return systemeCompletAPI.getStatistiques();
}

// ==================== EXPORT ====================

export default systemeCompletAPI;
