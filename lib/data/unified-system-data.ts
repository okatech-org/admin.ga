/* @ts-nocheck */
import { ORGANISMES_ENRICHIS_GABON } from '@/lib/config/organismes-enrichis-gabon';

/**
 * 📊 DONNÉES SYSTÈME UNIFIÉES - ADMIN.GA
 *
 * Ce fichier centralise toutes les données mockées pour :
 * - 160 organismes publics gabonais enrichis
 * - Interface super admin complète
 * - Analytics et statistiques avancées
 * - Gestion multi-niveaux des utilisateurs
 */

// Fonctions utilitaires intégrées pour générer des données mockées
const generateFakeUsers = (count: number) => {
  const roles = ['ADMIN', 'MANAGER', 'AGENT', 'USER', 'SUPER_ADMIN'];
  const organismes = Object.keys(ORGANISMES_ENRICHIS_GABON);
  const prenoms = ['Jean', 'Marie', 'Paul', 'Claire', 'André', 'Sophie', 'Michel', 'Catherine', 'Pierre', 'Isabelle'];
  const noms = ['Martin', 'Bernard', 'Dubois', 'Thomas', 'Robert', 'Richard', 'Petit', 'Durand', 'Leroy', 'Moreau'];

  return Array.from({ length: count }, (_, i) => {
    const prenom = prenoms[Math.floor(Math.random() * prenoms.length)];
    const nomFamille = noms[Math.floor(Math.random() * noms.length)];
    const role = roles[Math.floor(Math.random() * roles.length)];
    const organisme = organismes[Math.floor(Math.random() * organismes.length)];
    const isActive = Math.random() > 0.1;

    return {
      id: i + 1,
      nom: `${prenom} ${nomFamille}`,
      firstName: prenom,
      lastName: nomFamille,
      email: `${prenom.toLowerCase()}.${nomFamille.toLowerCase()}${i + 1}@gabon.ga`,
      role: role,
      statut: isActive ? 'actif' : 'inactif',
      isActive: isActive,
      organizationId: organisme,
      organizationName: ORGANISMES_ENRICHIS_GABON[organisme]?.nom || `Organisation ${organisme}`,
      derniere_connexion: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
    };
  });
};

const generateFakeFinances = () => ({
  budget_annuel: Math.floor(Math.random() * 10000000) + 1000000,
  depenses_courantes: Math.floor(Math.random() * 5000000) + 500000,
  revenus_generated: Math.floor(Math.random() * 2000000) + 200000
});

const generateFakeServices = (count: number) => Array.from({ length: count }, (_, i) => ({
  id: i + 1,
  nom: `Service ${i + 1}`,
  type: ['identite', 'etat_civil', 'fiscal', 'social'][Math.floor(Math.random() * 4)],
  statut: Math.random() > 0.1 ? 'actif' : 'inactif',
  demandes_mois: Math.floor(Math.random() * 1000) + 50
}));

const generateFakeAnalytics = () => ({
  pages_vues: Math.floor(Math.random() * 100000) + 10000,
  sessions: Math.floor(Math.random() * 50000) + 5000,
  duree_moyenne: Math.floor(Math.random() * 600) + 120,
  taux_conversion: Math.random() * 20 + 5
});

const generateFakeDemandes = (count: number) => Array.from({ length: count }, (_, i) => ({
  id: i + 1,
  type: ['CNI', 'Passeport', 'Acte naissance', 'Permis conduire'][Math.floor(Math.random() * 4)],
  statut: ['en_cours', 'traite', 'rejete'][Math.floor(Math.random() * 3)],
  date_creation: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
  citoyen: `Citoyen ${i + 1}`
}));

const generateFakeOrganisations = () => Object.values(ORGANISMES_ENRICHIS_GABON);

const generateFakeNotifications = (count: number) => Array.from({ length: count }, (_, i) => ({
  id: i + 1,
  titre: `Notification ${i + 1}`,
  message: `Message de notification ${i + 1}`,
  type: ['info', 'warning', 'success', 'error'][Math.floor(Math.random() * 4)],
  lu: Math.random() > 0.5,
  date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
}));

const generateFakeSettings = () => ({
  maintenance_mode: false,
  registrations_enabled: true,
  notifications_enabled: true,
  backup_frequency: 'daily',
  security_level: 'high'
});

const generateFakeLogs = (count: number) => Array.from({ length: count }, (_, i) => ({
  id: i + 1,
  action: ['login', 'logout', 'create', 'update', 'delete'][Math.floor(Math.random() * 5)],
  utilisateur: `Utilisateur ${Math.floor(Math.random() * 100) + 1}`,
  date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
  ip: `192.168.1.${Math.floor(Math.random() * 255)}`
}));

const generateFakeTasks = (count: number) => Array.from({ length: count }, (_, i) => ({
  id: i + 1,
  titre: `Tâche ${i + 1}`,
  description: `Description de la tâche ${i + 1}`,
  statut: ['en_cours', 'termine', 'en_attente'][Math.floor(Math.random() * 3)],
  priorite: ['haute', 'moyenne', 'basse'][Math.floor(Math.random() * 3)],
  assignee: `Utilisateur ${Math.floor(Math.random() * 50) + 1}`,
  date_echeance: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
}));

// Statistiques globales du système ADMIN.GA
export const systemStats = {
  // Organismes et utilisateurs
  totalOrganismes: 160, // Mis à jour vers les organismes enrichis
  organismesPrincipaux: 31,
  utilisateursTotal: 45670,
  utilisateursActifs: 38920,
  comptesCitoyens: 42450,
  comptesAdmins: 2890,
  comptesSuperAdmins: 330,

  // Services et demandes
  servicesTotal: 890,
  servicesActifs: 756,
  demandesTotal: 125640,
  demandesEnCours: 8450,
  demandesTraitees: 117190,

  // Performance et satisfaction
  tempsTraitementMoyen: 2.4, // jours
  tauxReussite: 97.8, // %
  satisfactionMoyenne: 4.6, // /5
  disponibiliteSysteme: 99.7, // %

  // Données financières
  budgetTotal: '47.5M XAF',
  revenusAnnuels: '152.8M XAF',
  economiesRealisees: '89.2M XAF',

  // Géographie
  provincesCouvees: 9,
  communesCouvertes: 51,
  prefecturesConnectees: 47,

  // Répartition par type d'organisme (calculée dynamiquement)
  organismesByType: {} as Record<string, number>,
  servicesByCategory: {} as Record<string, number>
};

// Données des organismes enrichis (160 au lieu de 117)
const enrichedOrganismes = Object.values(ORGANISMES_ENRICHIS_GABON);

console.log(`🔍 UNIFIED SYSTEM DATA - Organismes chargés: ${enrichedOrganismes.length}`);

// Calcul de la répartition par type d'organisme
const organismesByTypeCalculated = enrichedOrganismes.reduce((acc, org) => {
  acc[org.type] = (acc[org.type] || 0) + 1;
  return acc;
}, {} as Record<string, number>);

console.log(`📊 Répartition par type:`, organismesByTypeCalculated);

// Calcul de la répartition par catégorie de service
const servicesByCategory = {
  'identite': 156,
  'etat_civil': 189,
  'fiscal': 134,
  'social': 98,
  'transport': 87,
  'logement': 76,
  'education': 65,
  'sante': 54,
  'justice': 43,
  'autre': 32
};

// Mise à jour des statistiques avec les données calculées
systemStats.organismesByType = organismesByTypeCalculated;
systemStats.servicesByCategory = servicesByCategory;

// Génération des données unifiées basées sur les 160 organismes
export const unifiedOrganismes = enrichedOrganismes.map((org, index) => ({
  id: index + 1,
  nom: org.nom,
  code: org.code,
  type: org.type,
  localisation: org.ville || 'Libreville',
  services: org.services || ['Service général'],
  responsable: org.responsable || `Responsable ${org.nom}`,
  dateCreation: '2020-01-01',
  budget: `${(Math.random() * 10 + 1).toFixed(1)}M FCFA`,
  derniere_activite: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR'),
  utilisateurs: Math.floor(Math.random() * 500) + 50,
  demandes_mois: Math.floor(Math.random() * 1000) + 100,
  satisfaction: Math.floor(Math.random() * 20) + 80, // 80-100%
  status: Math.random() > 0.1 ? 'ACTIVE' : (Math.random() > 0.5 ? 'MAINTENANCE' : 'INACTIVE')
}));

// Génération des utilisateurs du système (basé sur les 160 organismes)
export const systemUsers = generateFakeUsers(systemStats.utilisateursTotal);

// Génération des données unifiées pour le super admin
export const unifiedStats = {
  organismes: {
    total: 160,
    actifs: unifiedOrganismes.filter(o => o.status === 'ACTIVE').length,
    maintenance: unifiedOrganismes.filter(o => o.status === 'MAINTENANCE').length,
    inactifs: unifiedOrganismes.filter(o => o.status === 'INACTIVE').length,
    parType: enrichedOrganismes.reduce((acc, org) => {
      acc[org.type] = (acc[org.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  },

  utilisateurs: {
    total: systemStats.utilisateursTotal,
    actifs: systemStats.utilisateursActifs,
    citoyens: systemStats.comptesCitoyens,
    admins: systemStats.comptesAdmins,
    superAdmins: systemStats.comptesSuperAdmins
  },

  services: {
    total: systemStats.servicesTotal,
    actifs: systemStats.servicesActifs,
    parCategorie: {
      'identite': 156,
      'etat_civil': 189,
      'fiscal': 134,
      'social': 98,
      'transport': 87,
      'logement': 76,
      'education': 65,
      'sante': 54,
      'justice': 43,
      'autre': 32
    }
  },

  demandes: {
    total: systemStats.demandesTotal,
    enCours: systemStats.demandesEnCours,
    traitees: systemStats.demandesTraitees,
    mensuelle: generateFakeDemandes(systemStats.demandesEnCours)
  },

  finances: generateFakeFinances(),
  analytics: generateFakeAnalytics(),
  notifications: generateFakeNotifications(20),
  logs: generateFakeLogs(100),
  tasks: generateFakeTasks(25),
  settings: generateFakeSettings()
};

// Export des organismes traités pour compatibilité
export { unifiedOrganismes as organismes };

// Fonction pour obtenir les utilisateurs par rôle
export const getUsersByRole = (role: string) => {
  return systemUsers.filter(user => user.role === role);
};

// Fonction pour obtenir les utilisateurs par organisme
export const getUsersByOrganisme = (organismeId: string) => {
  return systemUsers.filter(user => user.organizationId === organismeId);
};

// Fonction pour rechercher des utilisateurs
export const searchUsers = (searchTerm: string) => {
  const term = searchTerm.toLowerCase();
  return systemUsers.filter(user =>
    user.firstName?.toLowerCase().includes(term) ||
    user.lastName?.toLowerCase().includes(term) ||
    user.nom?.toLowerCase().includes(term) ||
    user.email?.toLowerCase().includes(term) ||
    user.organizationName?.toLowerCase().includes(term)
  );
};

// Fonction pour obtenir les statistiques consolidées
export const getSystemOverview = () => ({
  ...systemStats,
  organismes: unifiedStats.organismes,
  lastUpdate: new Date().toISOString(),
  version: '2.0 - Organismes Enrichis (160)',
  performance: {
    uptime: systemStats.disponibiliteSysteme,
    responseTime: systemStats.tempsTraitementMoyen,
    successRate: systemStats.tauxReussite,
    satisfaction: systemStats.satisfactionMoyenne
  }
});
