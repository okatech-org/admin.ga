// Service pour la gestion Multi-Tenant

import {
  OrganismeMultiTenant,
  UtilisateurMultiTenant,
  DomaineOrganisme,
  SessionMultiTenant,
  LimitesOrganisme
} from '@/lib/types/multi-tenant';

export class MultiTenantService {
  private static baseUrl = '/api/multi-tenant';

  // ===============================
  // GESTION DES ORGANISMES
  // ===============================

  /**
   * Crée un nouvel organisme multi-tenant
   */
  static async creerOrganisme(data: Partial<OrganismeMultiTenant>): Promise<OrganismeMultiTenant> {
    const response = await fetch(`${this.baseUrl}/organismes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la création de l\'organisme');
    }

    return response.json();
  }

  /**
   * Met à jour un organisme existant
   */
  static async mettreAJourOrganisme(
    organismeId: string,
    data: Partial<OrganismeMultiTenant>
  ): Promise<OrganismeMultiTenant> {
    const response = await fetch(`${this.baseUrl}/organismes/${organismeId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la mise à jour de l\'organisme');
    }

    return response.json();
  }

  /**
   * Récupère un organisme par son ID
   */
  static async getOrganismeParId(organismeId: string): Promise<OrganismeMultiTenant | null> {
    const response = await fetch(`${this.baseUrl}/organismes/${organismeId}`);

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Erreur lors de la récupération de l\'organisme');
    }

    return response.json();
  }

  /**
   * Récupère un organisme par son slug
   */
  static async getOrganismeParSlug(slug: string): Promise<OrganismeMultiTenant | null> {
    const response = await fetch(`${this.baseUrl}/organismes/slug/${slug}`);

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Erreur lors de la récupération de l\'organisme');
    }

    return response.json();
  }

  /**
   * Récupère un organisme par son domaine personnalisé
   */
  static async getOrganismeParDomaine(domaine: string): Promise<OrganismeMultiTenant | null> {
    const response = await fetch(`${this.baseUrl}/organismes/domaine/${domaine}`);

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Erreur lors de la récupération de l\'organisme');
    }

    return response.json();
  }

  /**
   * Liste tous les organismes (super-admin seulement)
   */
  static async listerOrganismes(params?: {
    page?: number;
    limit?: number;
    search?: string;
    statut?: string;
  }): Promise<{
    organismes: OrganismeMultiTenant[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const searchParams = new URLSearchParams();

    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.search) searchParams.append('search', params.search);
    if (params?.statut) searchParams.append('statut', params.statut);

    const response = await fetch(`${this.baseUrl}/organismes?${searchParams}`);

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération de la liste des organismes');
    }

    return response.json();
  }

  // ===============================
  // GESTION DES DOMAINES
  // ===============================

  /**
   * Ajoute un domaine personnalisé à un organisme
   */
  static async ajouterDomaine(
    organismeId: string,
    domaine: string
  ): Promise<DomaineOrganisme> {
    const response = await fetch(`${this.baseUrl}/organismes/${organismeId}/domaines`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ domaine }),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de l\'ajout du domaine');
    }

    return response.json();
  }

  /**
   * Vérifie un domaine via DNS
   */
  static async verifierDomaine(domaineId: string): Promise<{
    verifie: boolean;
    enregistrement_txt: string;
  }> {
    const response = await fetch(`${this.baseUrl}/domaines/${domaineId}/verifier`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la vérification du domaine');
    }

    return response.json();
  }

  // ===============================
  // GESTION DES UTILISATEURS
  // ===============================

  /**
   * Crée un utilisateur dans un organisme
   */
  static async creerUtilisateur(
    organismeId: string,
    userData: Partial<UtilisateurMultiTenant>
  ): Promise<UtilisateurMultiTenant> {
    const response = await fetch(`${this.baseUrl}/organismes/${organismeId}/utilisateurs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la création de l\'utilisateur');
    }

    return response.json();
  }

  /**
   * Liste les utilisateurs d'un organisme
   */
  static async listerUtilisateursOrganisme(
    organismeId: string,
    params?: { page?: number; limit?: number; search?: string; role?: string; }
  ): Promise<{
    utilisateurs: UtilisateurMultiTenant[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const searchParams = new URLSearchParams();

    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.search) searchParams.append('search', params.search);
    if (params?.role) searchParams.append('role', params.role);

    const response = await fetch(
      `${this.baseUrl}/organismes/${organismeId}/utilisateurs?${searchParams}`
    );

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des utilisateurs');
    }

    return response.json();
  }

  // ===============================
  // AUTHENTIFICATION MULTI-TENANT
  // ===============================

  /**
   * Authentifie un utilisateur dans son organisme
   */
  static async authentifierUtilisateur(
    email: string,
    password: string,
    organismeId: string,
    options?: {
      rememberMe?: boolean;
      userAgent?: string;
      ipAddress?: string;
    }
  ): Promise<{
    success: boolean;
    token?: string;
    utilisateur?: UtilisateurMultiTenant;
    session?: SessionMultiTenant;
    error?: string;
  }> {
    const response = await fetch(`${this.baseUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        organisme_id: organismeId,
        ...options,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || 'Erreur d\'authentification' };
    }

    return { success: true, ...data };
  }

  /**
   * Déconnecte un utilisateur
   */
  static async deconnecterUtilisateur(sessionId: string): Promise<boolean> {
    const response = await fetch(`${this.baseUrl}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ session_id: sessionId }),
    });

    return response.ok;
  }

  // ===============================
  // GESTION DES LIMITES
  // ===============================

  /**
   * Récupère les limites d'un organisme
   */
  static async getLimitesOrganisme(organismeId: string): Promise<LimitesOrganisme> {
    const response = await fetch(`${this.baseUrl}/organismes/${organismeId}/limites`);

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des limites');
    }

    return response.json();
  }

  /**
   * Met à jour les limites d'un organisme
   */
  static async mettreAJourLimites(
    organismeId: string,
    limites: Partial<LimitesOrganisme>
  ): Promise<LimitesOrganisme> {
    const response = await fetch(`${this.baseUrl}/organismes/${organismeId}/limites`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(limites),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la mise à jour des limites');
    }

    return response.json();
  }

  /**
   * Vérifie si un organisme peut effectuer une action (quota)
   */
  static async verifierQuota(
    organismeId: string,
    action: 'add_user' | 'api_request' | 'storage' | 'feature_access',
    params?: { feature?: string; size_mo?: number; }
  ): Promise<{
    autorise: boolean;
    limite_actuelle: number;
    limite_max: number;
    pourcentage_utilise: number;
  }> {
    const response = await fetch(`${this.baseUrl}/organismes/${organismeId}/quota/check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action, ...params }),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la vérification du quota');
    }

    return response.json();
  }

  // ===============================
  // PERSONNALISATION & BRANDING
  // ===============================

  /**
   * Met à jour la personnalisation visuelle d'un organisme
   */
  static async mettreAJourBranding(
    organismeId: string,
    branding: {
      logo_url?: string;
      favicon_url?: string;
      couleur_primaire?: string;
      couleur_secondaire?: string;
      css_personnalise?: string;
    }
  ): Promise<OrganismeMultiTenant> {
    const response = await fetch(`${this.baseUrl}/organismes/${organismeId}/branding`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(branding),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la mise à jour du branding');
    }

    return response.json();
  }

  /**
   * Upload d'un logo pour un organisme
   */
  static async uploadLogo(
    organismeId: string,
    file: File
  ): Promise<{ url: string; }> {
    const formData = new FormData();
    formData.append('logo', file);

    const response = await fetch(`${this.baseUrl}/organismes/${organismeId}/logo`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Erreur lors de l\'upload du logo');
    }

    return response.json();
  }

  // ===============================
  // ANALYTICS & RAPPORTS
  // ===============================

  /**
   * Récupère les analytics d'un organisme
   */
  static async getAnalyticsOrganisme(
    organismeId: string,
    periode: 'jour' | 'semaine' | 'mois' = 'mois',
    dateDebut?: string,
    dateFin?: string
  ): Promise<{
    utilisateurs_actifs: number;
    connexions_total: number;
    requetes_api: number;
    stockage_utilise_mo: number;
    temps_reponse_moyen_ms: number;
    evolution: Array<{
      date: string;
      utilisateurs_actifs: number;
      connexions: number;
    }>;
  }> {
    const params = new URLSearchParams({ periode });
    if (dateDebut) params.append('date_debut', dateDebut);
    if (dateFin) params.append('date_fin', dateFin);

    const response = await fetch(
      `${this.baseUrl}/organismes/${organismeId}/analytics?${params}`
    );

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des analytics');
    }

    return response.json();
  }

  // ===============================
  // EXPORT & SAUVEGARDE
  // ===============================

  /**
   * Génère un export des données d'un organisme (RGPD)
   */
  static async genererExportDonnees(
    organismeId: string,
    typeExport: 'complet' | 'utilisateurs' | 'logs' | 'analytics'
  ): Promise<{
    export_id: string;
    statut: 'en_cours' | 'termine' | 'erreur';
    url_telechargement?: string;
  }> {
    const response = await fetch(`${this.baseUrl}/organismes/${organismeId}/export`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type_export: typeExport }),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la génération de l\'export');
    }

    return response.json();
  }

  /**
   * Crée une sauvegarde d'un organisme
   */
  static async creerSauvegarde(organismeId: string): Promise<{
    sauvegarde_id: string;
    statut: 'en_cours' | 'termine' | 'erreur';
  }> {
    const response = await fetch(`${this.baseUrl}/organismes/${organismeId}/sauvegarde`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la création de la sauvegarde');
    }

    return response.json();
  }

  // ===============================
  // UTILITAIRES
  // ===============================

  /**
   * Génère un slug unique pour un organisme
   */
  static async genererSlugUnique(nom: string): Promise<string> {
    const baseSlug = nom
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    const response = await fetch(`${this.baseUrl}/organismes/slug/check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ slug: baseSlug }),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la génération du slug');
    }

    const { slug_unique } = await response.json();
    return slug_unique;
  }

  /**
   * Valide un domaine personnalisé
   */
  static async validerDomaine(domaine: string): Promise<{
    valide: boolean;
    disponible: boolean;
    erreurs?: string[];
  }> {
    const response = await fetch(`${this.baseUrl}/domaines/valider`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ domaine }),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la validation du domaine');
    }

    return response.json();
  }
}
