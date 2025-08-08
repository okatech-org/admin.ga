/**
 * SYSTÈME UNIFIÉ ÉTENDU
 * Intégration des extensions avec le système de données unifiées
 * Permet d'utiliser les 141 organismes officiels + les extensions personnalisées
 */

import {
  UnifiedSystemData,
  SystemUser,
  UnifiedOrganisme,
  convertirVersFormatExistant,
  getUnifiedSystemData
} from './unified-system-data';

import {
  extensionsSysteme,
  ExtensionsSysteme,
  OrganismePersonnalise,
  PostePersonnalise,
  ajouterOrganismePersonnalise,
  ajouterPostePersonnalise,
  genererUtilisateursSupplementaires
} from './systeme-extensions';

// ==================== TYPES ÉTENDUS ====================

export interface UnifiedSystemDataExtended extends UnifiedSystemData {
  extensions: {
    organismesPersonnalises: UnifiedOrganisme[];
    utilisateursSupplementaires: SystemUser[];
    postesPersonnalises: any[];
    statistiques: {
      organismesAjoutes: number;
      utilisateursAjoutes: number;
      postesAjoutes: number;
    };
  };
  metadata: UnifiedSystemData['metadata'] & {
    hasExtensions: boolean;
    extensionsGeneratedAt?: Date;
  };
}

// ==================== GESTIONNAIRE UNIFIÉ ÉTENDU ====================

class SystemeUnifieEtendu {
  private dataCache: UnifiedSystemDataExtended | null = null;
  private cacheTimestamp: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  /**
   * Obtenir les données unifiées avec extensions
   */
  async obtenirDonneesEtendues(forceRefresh = false): Promise<UnifiedSystemDataExtended> {
    const now = Date.now();

    // Vérifier le cache
    if (!forceRefresh && this.dataCache && (now - this.cacheTimestamp) < this.CACHE_DURATION) {
      console.log('📦 Utilisation du cache pour les données étendues');
      return this.dataCache;
    }

    console.log('🔄 Génération des données unifiées étendues...');

    // Obtenir le système étendu complet
    const systemeEtendu = await extensionsSysteme.obtenirSystemeEtendu();

    // Convertir vers le format unifié
    const donneesUnifiees = convertirVersFormatExistant(systemeEtendu);

    // Séparer les données de base et les extensions
    const donneesBase = await getUnifiedSystemData();

    // Identifier les utilisateurs supplémentaires
    const emailsBase = new Set(donneesBase.systemUsers.map(u => u.email));
    const utilisateursSupplementaires = donneesUnifiees.systemUsers.filter(
      u => !emailsBase.has(u.email)
    );

    // Identifier les organismes personnalisés
    const codesBase = new Set(donneesBase.unifiedOrganismes.map(o => o.code));
    const organismesPersonnalises = donneesUnifiees.unifiedOrganismes.filter(
      o => !codesBase.has(o.code)
    );

    // Construire les données étendues
    const donneesEtendues: UnifiedSystemDataExtended = {
      ...donneesUnifiees,
      extensions: {
        organismesPersonnalises,
        utilisateursSupplementaires,
        postesPersonnalises: systemeEtendu.postesPersonnalises || [],
        statistiques: {
          organismesAjoutes: organismesPersonnalises.length,
          utilisateursAjoutes: utilisateursSupplementaires.length,
          postesAjoutes: systemeEtendu.postesPersonnalises?.length || 0
        }
      },
      metadata: {
        ...donneesUnifiees.metadata,
        hasExtensions: organismesPersonnalises.length > 0 || utilisateursSupplementaires.length > 0,
        extensionsGeneratedAt: new Date()
      }
    };

    // Mettre à jour le cache
    this.dataCache = donneesEtendues;
    this.cacheTimestamp = now;

    console.log(`✅ Données étendues générées:`);
    console.log(`   • ${donneesEtendues.statistics.totalOrganismes} organismes total`);
    console.log(`   • ${donneesEtendues.statistics.totalUsers} utilisateurs total`);
    console.log(`   • ${donneesEtendues.extensions.statistiques.organismesAjoutes} organismes ajoutés`);
    console.log(`   • ${donneesEtendues.extensions.statistiques.utilisateursAjoutes} utilisateurs ajoutés`);

    return donneesEtendues;
  }

  /**
   * Invalider le cache
   */
  invaliderCache(): void {
    this.dataCache = null;
    this.cacheTimestamp = 0;
    console.log('🗑️ Cache des données étendues invalidé');
  }

  /**
   * Ajouter un organisme et régénérer les données
   */
  async ajouterOrganisme(params: OrganismePersonnalise): Promise<UnifiedSystemDataExtended> {
    ajouterOrganismePersonnalise(params);
    this.invaliderCache();
    return this.obtenirDonneesEtendues(true);
  }

  /**
   * Ajouter un poste et régénérer les données
   */
  async ajouterPoste(params: PostePersonnalise): Promise<UnifiedSystemDataExtended> {
    ajouterPostePersonnalise(params);
    this.invaliderCache();
    return this.obtenirDonneesEtendues(true);
  }

  /**
   * Générer des utilisateurs supplémentaires et régénérer les données
   */
  async ajouterUtilisateurs(
    organismeCode: string,
    nombre: number,
    roles?: Array<'ADMIN' | 'USER' | 'RECEPTIONIST'>
  ): Promise<UnifiedSystemDataExtended> {
    genererUtilisateursSupplementaires(organismeCode, nombre, roles);
    this.invaliderCache();
    return this.obtenirDonneesEtendues(true);
  }

  /**
   * Réinitialiser toutes les extensions
   */
  async reinitialiser(): Promise<UnifiedSystemDataExtended> {
    extensionsSysteme.reinitialiser();
    this.invaliderCache();
    return this.obtenirDonneesEtendues(true);
  }
}

// ==================== INSTANCE SINGLETON ====================

export const systemeUnifieEtendu = new SystemeUnifieEtendu();

// ==================== FONCTIONS D'API ====================

/**
 * Obtenir les données unifiées avec extensions
 */
export async function getUnifiedSystemDataExtended(forceRefresh = false): Promise<UnifiedSystemDataExtended> {
  return systemeUnifieEtendu.obtenirDonneesEtendues(forceRefresh);
}

/**
 * Ajouter un organisme au système unifié
 */
export async function addOrganismeToUnifiedSystem(params: OrganismePersonnalise): Promise<UnifiedSystemDataExtended> {
  return systemeUnifieEtendu.ajouterOrganisme(params);
}

/**
 * Ajouter des utilisateurs au système unifié
 */
export async function addUsersToUnifiedSystem(
  organismeCode: string,
  nombre: number,
  roles?: Array<'ADMIN' | 'USER' | 'RECEPTIONIST'>
): Promise<UnifiedSystemDataExtended> {
  return systemeUnifieEtendu.ajouterUtilisateurs(organismeCode, nombre, roles);
}

/**
 * Réinitialiser les extensions du système unifié
 */
export async function resetUnifiedSystemExtensions(): Promise<UnifiedSystemDataExtended> {
  return systemeUnifieEtendu.reinitialiser();
}

// ==================== FONCTIONS UTILITAIRES ====================

/**
 * Obtenir uniquement les extensions
 */
export async function getExtensionsOnly(): Promise<ExtensionsSysteme['statistiques']> {
  const data = await getUnifiedSystemDataExtended();
  return data.extensions.statistiques;
}

/**
 * Rechercher dans les données étendues
 */
export function searchInExtendedData(
  data: UnifiedSystemDataExtended,
  searchTerm: string,
  includeExtensions = true
): {
  organismes: UnifiedOrganisme[];
  users: SystemUser[];
} {
  const term = searchTerm.toLowerCase();

  let organismes = data.unifiedOrganismes;
  let users = data.systemUsers;

  // Filtrer selon le terme de recherche
  organismes = organismes.filter(org =>
    org.nom.toLowerCase().includes(term) ||
    org.code.toLowerCase().includes(term) ||
    org.description?.toLowerCase().includes(term)
  );

  users = users.filter(user =>
    user.firstName.toLowerCase().includes(term) ||
    user.lastName.toLowerCase().includes(term) ||
    user.email.toLowerCase().includes(term) ||
    user.position.toLowerCase().includes(term)
  );

  // Exclure les extensions si demandé
  if (!includeExtensions) {
    const codesExtensions = new Set(data.extensions.organismesPersonnalises.map(o => o.code));
    const emailsExtensions = new Set(data.extensions.utilisateursSupplementaires.map(u => u.email));

    organismes = organismes.filter(o => !codesExtensions.has(o.code));
    users = users.filter(u => !emailsExtensions.has(u.email));
  }

  return { organismes, users };
}

/**
 * Export des données étendues en JSON
 */
export function exportExtendedDataToJSON(data: UnifiedSystemDataExtended): string {
  return JSON.stringify(data, null, 2);
}

/**
 * Export des extensions uniquement
 */
export function exportExtensionsToJSON(data: UnifiedSystemDataExtended): string {
  return JSON.stringify(data.extensions, null, 2);
}

// ==================== SCÉNARIOS PRÉDÉFINIS ====================

/**
 * Scénario : Créer une structure gouvernementale complète
 */
export async function creerStructureGouvernementaleComplete(): Promise<UnifiedSystemDataExtended> {
  console.log('🏛️ Création d\'une structure gouvernementale complète...');

  // Réinitialiser les extensions
  await resetUnifiedSystemExtensions();

  // 1. Ajouter des cabinets ministériels
  const cabinets = [
    {
      nom: 'Cabinet du Premier Ministre',
      code: 'CAB_PM',
      type: 'INSTITUTION_SUPREME' as const,
      description: 'Cabinet du Chef du Gouvernement'
    },
    {
      nom: 'Secrétariat Général du Gouvernement',
      code: 'SGG',
      type: 'INSTITUTION_SUPREME' as const,
      description: 'Coordination de l\'action gouvernementale'
    }
  ];

  for (const cab of cabinets) {
    await addOrganismeToUnifiedSystem(cab);
    await addUsersToUnifiedSystem(cab.code, 5, ['ADMIN', 'USER']);
  }

  // 2. Ajouter des agences spécialisées
  const agences = [
    {
      nom: 'Agence de Régulation des Télécommunications',
      code: 'ARCEP',
      type: 'AUTORITE_REGULATION' as const
    },
    {
      nom: 'Agence Nationale de l\'Aviation Civile',
      code: 'ANAC',
      type: 'AUTORITE_REGULATION' as const
    },
    {
      nom: 'Agence de Régulation du Secteur Pétrolier',
      code: 'ARSP',
      type: 'AUTORITE_REGULATION' as const
    }
  ];

  for (const agence of agences) {
    await addOrganismeToUnifiedSystem(agence);
    await addUsersToUnifiedSystem(agence.code, 3, ['USER']);
  }

  // 3. Renforcer les ministères existants
  const ministeresARenforcer = ['MIN_ECO_FIN', 'MIN_SANTE', 'MIN_EDUCATION'];
  for (const code of ministeresARenforcer) {
    await addUsersToUnifiedSystem(code, 5, ['USER']);
  }

  return getUnifiedSystemDataExtended();
}

/**
 * Scénario : Créer un pôle santé complet
 */
export async function creerPoleSante(): Promise<UnifiedSystemDataExtended> {
  console.log('🏥 Création d\'un pôle santé complet...');

  const etablissementsSante = [
    {
      nom: 'Centre Hospitalier Universitaire de Libreville',
      code: 'CHU_LBV',
      type: 'ETABLISSEMENT_SANTE' as const
    },
    {
      nom: 'Institut de Recherche Médicale',
      code: 'IRM_GABON',
      type: 'ETABLISSEMENT_PUBLIC' as const
    },
    {
      nom: 'Centre National de Transfusion Sanguine',
      code: 'CNTS',
      type: 'ETABLISSEMENT_SANTE' as const
    }
  ];

  for (const etab of etablissementsSante) {
    await addOrganismeToUnifiedSystem(etab);
    await addUsersToUnifiedSystem(etab.code, 4, ['ADMIN', 'USER']);
  }

  return getUnifiedSystemDataExtended();
}

// ==================== EXPORT PRINCIPAL ====================

export default {
  // Instance singleton
  systemeUnifieEtendu,

  // Fonctions principales
  getUnifiedSystemDataExtended,
  addOrganismeToUnifiedSystem,
  addUsersToUnifiedSystem,
  resetUnifiedSystemExtensions,

  // Fonctions utilitaires
  getExtensionsOnly,
  searchInExtendedData,
  exportExtendedDataToJSON,
  exportExtensionsToJSON,

  // Scénarios
  creerStructureGouvernementaleComplete,
  creerPoleSante
};
