/**
 * UNIFIED SYSTEM DATA
 * Intégration du système complet des 141 organismes gabonais
 * avec le format de données existant de l'application
 */

import { SystemeComplet, implementerSystemeComplet, initialiserSysteme } from './systeme-complet-gabon';

// ==================== TYPES POUR LE FORMAT EXISTANT ====================

export interface SystemUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'ADMIN' | 'USER' | 'RECEPTIONIST';
  organismeCode: string;
  status: 'active' | 'inactive';
  createdAt: Date;
  position: string;
  phone?: string;
  honorificTitle?: string;
  isVerified?: boolean;
  lastLoginAt?: Date;
}

export interface UnifiedOrganisme {
  code: string;
  nom: string;
  type: string;
  status: 'ACTIF' | 'INACTIF';
  color?: string;
  logo?: string;
  website?: string;
  description?: string;
  contact: {
    email: string;
    telephone?: string;
    adresse?: string;
  };
  stats: {
    totalUsers: number;
    activeUsers: number;
    adminCount?: number;
    receptionistCount?: number;
  };
  metadata?: {
    createdAt?: Date;
    updatedAt?: Date;
    parentCode?: string;
    niveau?: number;
  };
}

export interface UnifiedSystemData {
  systemUsers: SystemUser[];
  unifiedOrganismes: UnifiedOrganisme[];
  statistics: {
    totalOrganismes: number;
    totalUsers: number;
    activeUsers: number;
    inactiveUsers: number;
    organismesByType: Record<string, number>;
    usersByRole: Record<string, number>;
    averageUsersPerOrganisme: number;
  };
  metadata: {
    generatedAt: Date;
    version: string;
    source: string;
  };
}

// ==================== FONCTION DE CONVERSION ====================

/**
 * Convertit le système complet vers le format existant de l'application
 */
export function convertirVersFormatExistant(systeme: SystemeComplet): UnifiedSystemData {
  const generatedAt = new Date();

  // Conversion des utilisateurs
  const systemUsers: SystemUser[] = systeme.utilisateurs.map(user => ({
    id: user.id,
    firstName: user.prenom,
    lastName: user.nom,
    email: user.email,
    role: user.role,
    organismeCode: user.organisme_code,
    status: (user.statut.toLowerCase() as 'active' | 'inactive'),
    createdAt: user.date_creation,
    position: user.poste_titre,
    phone: user.telephone,
    honorificTitle: user.titre_honorifique,
    isVerified: user.statut === 'ACTIF',
    lastLoginAt: undefined
  }));

  // Conversion des organismes avec statistiques enrichies
  const unifiedOrganismes: UnifiedOrganisme[] = systeme.organismes.map(org => {
    const orgUsers = systeme.utilisateurs.filter(u => u.organisme_code === org.code);
    const activeUsers = orgUsers.filter(u => u.statut === 'ACTIF');
    const adminCount = orgUsers.filter(u => u.role === 'ADMIN').length;
    const receptionistCount = orgUsers.filter(u => u.role === 'RECEPTIONIST').length;

    return {
      code: org.code,
      nom: org.nom,
      type: org.type,
      status: org.statut,
      color: org.couleur_principale,
      logo: org.logo,
      website: org.site_web,
      description: org.description,
      contact: {
        email: org.email_contact,
        telephone: org.telephone,
        adresse: org.adresse
      },
      stats: {
        totalUsers: orgUsers.length,
        activeUsers: activeUsers.length,
        adminCount,
        receptionistCount
      },
      metadata: {
        createdAt: generatedAt,
        updatedAt: generatedAt,
        niveau: undefined
      }
    };
  });

  // Calcul des statistiques globales
  const activeUsersCount = systemUsers.filter(u => u.status === 'active').length;
  const inactiveUsersCount = systemUsers.filter(u => u.status === 'inactive').length;

  const usersByRole = systemUsers.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const organismesByType = unifiedOrganismes.reduce((acc, org) => {
    acc[org.type] = (acc[org.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    systemUsers,
    unifiedOrganismes,
    statistics: {
      totalOrganismes: unifiedOrganismes.length,
      totalUsers: systemUsers.length,
      activeUsers: activeUsersCount,
      inactiveUsers: inactiveUsersCount,
      organismesByType,
      usersByRole,
      averageUsersPerOrganisme: Math.round((systemUsers.length / unifiedOrganismes.length) * 10) / 10
    },
    metadata: {
      generatedAt,
      version: '2.0.0',
      source: 'systeme-complet-gabon'
    }
  };
}

// ==================== FONCTIONS D'ACCÈS AUX DONNÉES ====================

/**
 * Récupère les données unifiées du système complet
 */
export async function getUnifiedSystemData(): Promise<UnifiedSystemData> {
  console.log('📊 Chargement des données unifiées du système...');

  // Initialiser le système complet
  const systeme = await initialiserSysteme();

  if (!systeme) {
    throw new Error('Impossible d\'initialiser le système');
  }

  // Convertir vers le format unifié
  const unifiedData = convertirVersFormatExistant(systeme);

  console.log(`✅ Données unifiées chargées: ${unifiedData.statistics.totalOrganismes} organismes, ${unifiedData.statistics.totalUsers} utilisateurs`);

  return unifiedData;
}

/**
 * Récupère les utilisateurs par organisme
 */
export function getUsersByOrganisme(unifiedData: UnifiedSystemData, organismeCode: string): SystemUser[] {
  return unifiedData.systemUsers.filter(user => user.organismeCode === organismeCode);
}

/**
 * Récupère un organisme par son code
 */
export function getOrganismeByCode(unifiedData: UnifiedSystemData, code: string): UnifiedOrganisme | undefined {
  return unifiedData.unifiedOrganismes.find(org => org.code === code);
}

/**
 * Récupère les organismes par type
 */
export function getOrganismesByType(unifiedData: UnifiedSystemData, type: string): UnifiedOrganisme[] {
  return unifiedData.unifiedOrganismes.filter(org => org.type === type);
}

/**
 * Récupère les utilisateurs par rôle
 */
export function getUsersByRole(unifiedData: UnifiedSystemData, role: SystemUser['role']): SystemUser[] {
  return unifiedData.systemUsers.filter(user => user.role === role);
}

/**
 * Recherche des organismes par nom
 */
export function searchOrganismes(unifiedData: UnifiedSystemData, searchTerm: string): UnifiedOrganisme[] {
  const term = searchTerm.toLowerCase();
  return unifiedData.unifiedOrganismes.filter(org =>
    org.nom.toLowerCase().includes(term) ||
    org.code.toLowerCase().includes(term) ||
    org.description?.toLowerCase().includes(term)
  );
}

/**
 * Recherche des utilisateurs
 */
export function searchUsers(unifiedData: UnifiedSystemData, searchTerm: string): SystemUser[] {
  const term = searchTerm.toLowerCase();
  return unifiedData.systemUsers.filter(user =>
    user.firstName.toLowerCase().includes(term) ||
    user.lastName.toLowerCase().includes(term) ||
    user.email.toLowerCase().includes(term) ||
    user.position.toLowerCase().includes(term)
  );
}

// ==================== EXPORT DE DONNÉES ====================

/**
 * Exporte les données au format JSON
 */
export function exportToJSON(unifiedData: UnifiedSystemData): string {
  return JSON.stringify(unifiedData, null, 2);
}

/**
 * Exporte les données au format CSV (utilisateurs)
 */
export function exportUsersToCSV(users: SystemUser[]): string {
  const headers = ['ID', 'Prénom', 'Nom', 'Email', 'Rôle', 'Organisme', 'Poste', 'Statut', 'Téléphone'];
  const rows = users.map(user => [
    user.id,
    user.firstName,
    user.lastName,
    user.email,
    user.role,
    user.organismeCode,
    user.position,
    user.status,
    user.phone || ''
  ]);

  return [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');
}

/**
 * Exporte les données au format CSV (organismes)
 */
export function exportOrganismesToCSV(organismes: UnifiedOrganisme[]): string {
  const headers = ['Code', 'Nom', 'Type', 'Statut', 'Email', 'Téléphone', 'Total Utilisateurs', 'Utilisateurs Actifs'];
  const rows = organismes.map(org => [
    org.code,
    org.nom,
    org.type,
    org.status,
    org.contact.email,
    org.contact.telephone || '',
    org.stats.totalUsers.toString(),
    org.stats.activeUsers.toString()
  ]);

  return [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');
}

// ==================== CACHE ET SINGLETON ====================

let cachedData: UnifiedSystemData | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Récupère les données avec cache
 */
export async function getUnifiedSystemDataWithCache(): Promise<UnifiedSystemData> {
  const now = Date.now();

  // Vérifier si le cache est valide
  if (cachedData && (now - cacheTimestamp) < CACHE_DURATION) {
    console.log('📦 Utilisation des données en cache');
    return cachedData;
  }

  // Recharger les données
  console.log('🔄 Rechargement des données...');
  cachedData = await getUnifiedSystemData();
  cacheTimestamp = now;

  return cachedData;
}

/**
 * Invalide le cache
 */
export function invalidateCache(): void {
  cachedData = null;
  cacheTimestamp = 0;
  console.log('🗑️ Cache invalidé');
}

// ==================== EXPORT PRINCIPAL ====================

export default {
  // Fonctions principales
  getUnifiedSystemData,
  getUnifiedSystemDataWithCache,
  convertirVersFormatExistant,
  invalidateCache,

  // Fonctions d'accès
  getUsersByOrganisme,
  getOrganismeByCode,
  getOrganismesByType,
  getUsersByRole,
  searchOrganismes,
  searchUsers,

  // Fonctions d'export
  exportToJSON,
  exportUsersToCSV,
  exportOrganismesToCSV
};
