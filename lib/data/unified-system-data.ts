/* @ts-nocheck */
/**
 * STRUCTURE DE DONNÉES UNIFIÉE DU SYSTÈME ADMIN.GA
 *
 * Cette structure lie logiquement :
 * - Organismes (127 administrations gabonaises)
 * - Services (liés aux organismes)
 * - Postes administratifs (liés aux organismes)
 * - Utilisateurs/Collaborateurs (liés aux organismes)
 */

import { getAllAdministrations } from './gabon-administrations';
import { getAllServices } from './gabon-services-detailles';
import { getAllPostes, GRADES_FONCTION_PUBLIQUE } from './postes-administratifs';

// === TYPES PRINCIPAUX ===

export interface SystemUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER' | 'AGENT' | 'USER';
  organizationId: string;
  organizationName: string;
  posteId?: string;
  posteTitle?: string;
  grade?: string;
  department?: string;
  isVerified: boolean;
  isActive: boolean;
  lastLogin: string;
  createdAt: string;
}

export interface OrganismWithRelations {
  // Données de base de l'organisme
  id: string;
  code: string;
  nom: string;
  type: string;
  localisation: string;
  contact?: {
    telephone?: string;
    email?: string;
    adresse?: string;
  };

  // Relations
  services: any[];
  users: SystemUser[];
  postes: any[];

  // Statistiques calculées
  stats: {
    totalUsers: number;
    totalServices: number;
    totalPostes: number;
    activeUsers: number;
  };
}

// === DONNÉES CENTRALISÉES ===

/**
 * Génère des utilisateurs réels basés sur les organismes et postes
 */
export function generateSystemUsers(): SystemUser[] {
  const administrations = getAllAdministrations();
  const postes = getAllPostes();
  const users: SystemUser[] = [];

  // === ADMIN.GA - Équipe système ===
  users.push({
    id: 'super-admin-001',
    firstName: 'Admin',
    lastName: 'SYSTÈME',
    email: 'admin@admin.ga',
    phone: '+241 77 00 00 00',
    role: 'SUPER_ADMIN',
    organizationId: 'admin-ga',
    organizationName: 'ADMIN.GA',
    posteTitle: 'Super Administrateur',
    grade: 'A1',
    department: 'Administration Système',
    isVerified: true,
    isActive: true,
    lastLogin: new Date().toISOString(),
    createdAt: '2023-12-01T00:00:00Z'
  });

  users.push({
    id: 'admin-tech-001',
    firstName: 'Jean Claude',
    lastName: 'MBENG SYSTEM',
    email: 'tech@admin.ga',
    phone: '+241 77 00 00 01',
    role: 'ADMIN',
    organizationId: 'admin-ga',
    organizationName: 'ADMIN.GA',
    posteTitle: 'Administrateur Technique',
    grade: 'A2',
    department: 'Infrastructure',
    isVerified: true,
    isActive: true,
    lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    createdAt: '2023-12-15T00:00:00Z'
  });

  users.push({
    id: 'admin-support-001',
    firstName: 'Marie Claire',
    lastName: 'NZIGOU SYSTEM',
    email: 'support@admin.ga',
    phone: '+241 77 00 00 02',
    role: 'MANAGER',
    organizationId: 'admin-ga',
    organizationName: 'ADMIN.GA',
    posteTitle: 'Responsable Support',
    grade: 'B1',
    department: 'Support Technique',
    isVerified: true,
    isActive: true,
    lastLogin: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    createdAt: '2024-01-10T00:00:00Z'
  });

    // Générer des utilisateurs pour TOUS les 117 organismes
  console.log(`🏢 Génération d'utilisateurs pour ${administrations.length} organismes...`);

  administrations.forEach((admin, index) => {
        // Adapter le nombre d'utilisateurs selon le type d'organisme
    const nbUsersSelonType = {
      'MINISTERE': 4,           // Ministères : plus d'utilisateurs
      'DIRECTION_GENERALE': 3,  // Directions importantes
      'MAIRIE': 3,              // Mairies importantes
      'PREFECTURE': 2,          // Préfectures moyennes
      'PROVINCE': 2,            // Provinces moyennes
      'DEFAULT': 1              // Autres organismes : au moins 1 utilisateur
    };

    const nbUsers = nbUsersSelonType[admin.type] || nbUsersSelonType['DEFAULT'];

    const adminPostes = postes.filter(poste =>
      ['Directeur', 'Chef', 'Conseiller', 'Inspecteur', 'Agent', 'Attaché'].some(titre =>
        poste.titre.includes(titre)
      )
    ).slice(0, nbUsers);

    adminPostes.forEach((poste, posteIndex) => {
      const userId = `user-${admin.code}-${posteIndex + 1}`.toLowerCase();
      const roleMapping = {
        'Directeur': 'ADMIN' as const,
        'Chef': 'MANAGER' as const,
        'Conseiller': 'MANAGER' as const,
        'Inspecteur': 'AGENT' as const
      };

      const role = Object.entries(roleMapping).find(([titre]) =>
        poste.titre.includes(titre)
      )?.[1] || 'AGENT' as const;

      // Noms gabonais réels
      const prenoms = ['Jean Claude', 'Marie Claire', 'Paul Bertrand', 'Sylvie', 'Michel', 'Françoise', 'Pierre', 'Christine', 'Bernard', 'Jeanne'];
      const noms = ['MBENG', 'MOUSSAVOU', 'NZIGOU', 'OBAME', 'ESSONE', 'BOUNFOUME', 'OVONO', 'NDONG', 'EYEGHE', 'MBA'];

      const prenom = prenoms[Math.floor(Math.random() * prenoms.length)];
      const nom = noms[Math.floor(Math.random() * noms.length)];

      users.push({
        id: userId,
        firstName: prenom,
        lastName: nom,
        email: `${prenom.toLowerCase().replace(' ', '.')}.${nom.toLowerCase()}@${admin.code.toLowerCase()}.ga`,
        phone: `+241 77 ${String(Math.floor(Math.random() * 90) + 10)} ${String(Math.floor(Math.random() * 90) + 10)} ${String(Math.floor(Math.random() * 90) + 10)}`,
        role,
        organizationId: admin.code,
        organizationName: admin.nom,
        posteId: poste.id,
                 posteTitle: poste.titre,
         grade: Array.isArray(poste.grade_requis) ? poste.grade_requis[0] : poste.grade_requis,
         department: poste.niveau,
        isVerified: true,
        isActive: Math.random() > 0.1, // 90% actifs
        lastLogin: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(), // Dans les 7 derniers jours
        createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString() // Dans la dernière année
      });
    });
  });

  // === DEMARCHE.GA - Utilisateurs citoyens ===
  users.push({
    id: 'demarche-responsable-001',
    firstName: 'Sylvie',
    lastName: 'OBAME',
    email: 'responsable@demarche.ga',
    phone: '+241 77 12 34 56',
    role: 'MANAGER',
    organizationId: 'demarche-ga',
    organizationName: 'DEMARCHE.GA',
    posteTitle: 'Responsable Plateforme Citoyenne',
    grade: 'B1',
    department: 'Services Citoyens',
    isVerified: true,
    isActive: true,
    lastLogin: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    createdAt: '2024-01-15T00:00:00Z'
  });

  users.push({
    id: 'demarche-agent-001',
    firstName: 'Marc',
    lastName: 'NGUEMA',
    email: 'support@demarche.ga',
    phone: '+241 77 23 45 67',
    role: 'AGENT',
    organizationId: 'demarche-ga',
    organizationName: 'DEMARCHE.GA',
    posteTitle: 'Agent Support Citoyen',
    grade: 'C',
    department: 'Assistance',
    isVerified: true,
    isActive: true,
    lastLogin: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    createdAt: '2024-02-01T00:00:00Z'
  });

  // Utilisateurs citoyens standard
  for (let i = 0; i < 8; i++) {
    const prenoms = ['Lucie', 'David', 'Nathalie', 'Paul', 'Christine', 'Michel', 'Françoise', 'Bernard'];
    const noms = ['ANDEME', 'OYANE', 'MENGUE', 'ESSONE', 'BOUNFOUME', 'OVONO', 'NDONG', 'EYEGHE'];

    users.push({
      id: `citizen-${i + 1}`,
      firstName: prenoms[i],
      lastName: noms[i],
      email: `${prenoms[i].toLowerCase()}.${noms[i].toLowerCase()}@demarche.ga`,
      phone: `+241 77 ${String(Math.floor(Math.random() * 90) + 10)} ${String(Math.floor(Math.random() * 90) + 10)} ${String(Math.floor(Math.random() * 90) + 10)}`,
      role: 'USER',
      organizationId: 'demarche-ga',
      organizationName: 'DEMARCHE.GA',
      posteTitle: 'Citoyen Utilisateur',
      isVerified: true,
      isActive: Math.random() > 0.2, // 80% actifs
      lastLogin: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString()
    });
  }

  return users;
}

/**
 * Lie les services aux organismes
 */
export function getServicesForOrganisme(organismeCode: string) {
  const allServices = getAllServices();
  // Retourner un sous-ensemble des services pour cet organisme
  const orgIndex = organismeCode.charCodeAt(0) % allServices.length;
  return allServices.slice(orgIndex, orgIndex + 5);
}

/**
 * Lie les postes aux organismes
 */
export function getPostesForOrganisme(organismeCode: string, type: string) {
  const allPostes = getAllPostes();

  // Filtrer par type d'organisme selon les niveaux de postes
  const typeFilters = {
    'MINISTERE': ['Direction supérieure', 'Direction centrale', 'Direction', 'Expertise'],
    'DIRECTION_GENERALE': ['Direction centrale', 'Direction', 'Expertise', 'Technique supérieur'],
    'MAIRIE': ['Direction', 'Encadrement', 'Support administratif', 'Exécution'],
    'PREFECTURE': ['Direction', 'Encadrement', 'Support administratif', 'Exécution'],
    'PROVINCE': ['Direction supérieure', 'Direction', 'Support administratif']
  };

  const allowedNiveaux = typeFilters[type as keyof typeof typeFilters] || ['Support administratif'];

  return allPostes.filter(poste =>
    allowedNiveaux.includes(poste.niveau)
  );
}

/**
 * Génère les organismes avec toutes leurs relations
 */
export function getUnifiedOrganismes(): OrganismWithRelations[] {
  const administrations = getAllAdministrations();
  const users = generateSystemUsers();
  const organismes: OrganismWithRelations[] = [];

  // === 1. ADMIN.GA - Système d'administration ===
  const adminGAUsers = users.filter(user => user.organizationId === 'admin-ga');
  organismes.push({
    id: 'admin-ga',
    code: 'admin-ga',
    nom: 'ADMIN.GA',
    type: 'PLATEFORME_SYSTEM',
    localisation: 'Libreville',
    contact: {
      telephone: '+241 77 00 00 00',
      email: 'contact@admin.ga',
      adresse: 'Libreville, Gabon'
    },
    services: [
      'Gestion des organismes',
      'Administration système',
      'Support technique',
      'Monitoring global',
      'Gestion des utilisateurs'
    ],
    users: adminGAUsers,
    postes: [],
    stats: {
      totalUsers: adminGAUsers.length,
      totalServices: 5,
      totalPostes: 0,
      activeUsers: adminGAUsers.filter(u => u.isActive).length
    }
  });

  // === 2. DEMARCHE.GA - Plateforme citoyenne ===
  const demarcheGAUsers = users.filter(user => user.organizationId === 'demarche-ga');
  organismes.push({
    id: 'demarche-ga',
    code: 'demarche-ga',
    nom: 'DEMARCHE.GA',
    type: 'PLATEFORME_CITOYENNE',
    localisation: 'Libreville',
    contact: {
      telephone: '+241 77 12 34 56',
      email: 'contact@demarche.ga',
      adresse: 'Plateforme Numérique Gabon'
    },
    services: [
      'Services aux citoyens',
      'Démarches en ligne',
      'Support utilisateur',
      'Suivi des demandes',
      'Assistance citoyenne'
    ],
    users: demarcheGAUsers,
    postes: [],
    stats: {
      totalUsers: demarcheGAUsers.length,
      totalServices: 5,
      totalPostes: 0,
      activeUsers: demarcheGAUsers.filter(u => u.isActive).length
    }
  });

  // === 3. Toutes les administrations gabonaises ===
  administrations.forEach(admin => {
    const services = getServicesForOrganisme(admin.code);
    const orgUsers = users.filter(user => user.organizationId === admin.code);
    const postes = getPostesForOrganisme(admin.code, admin.type);

    organismes.push({
      id: admin.code,
      code: admin.code,
      nom: admin.nom,
      type: admin.type,
      localisation: admin.localisation,
      contact: {},
      services,
      users: orgUsers,
      postes,
      stats: {
        totalUsers: orgUsers.length,
        totalServices: services.length,
        totalPostes: postes.length,
        activeUsers: orgUsers.filter(u => u.isActive).length
      }
    });
  });

  return organismes;
}

/**
 * Statistiques globales du système
 */
export function getSystemStats() {
  const organismes = getUnifiedOrganismes();
  const users = generateSystemUsers();
  const allServices = getAllServices();
  const allPostes = getAllPostes();

  return {
    // Organismes
    totalOrganismes: organismes.length,
    organismesByType: {
      ministeres: organismes.filter(o => o.type === 'MINISTERE').length,
      directions: organismes.filter(o => o.type === 'DIRECTION_GENERALE').length,
      mairies: organismes.filter(o => o.type === 'MAIRIE').length,
      prefectures: organismes.filter(o => o.type === 'PREFECTURE').length,
      provinces: organismes.filter(o => o.type === 'PROVINCE').length
    },

    // Utilisateurs
    totalUsers: users.length,
    usersByRole: {
      superAdmin: users.filter(u => u.role === 'SUPER_ADMIN').length,
      admin: users.filter(u => u.role === 'ADMIN').length,
      manager: users.filter(u => u.role === 'MANAGER').length,
      agent: users.filter(u => u.role === 'AGENT').length,
      citizen: users.filter(u => u.role === 'USER').length
    },
    activeUsers: users.filter(u => u.isActive).length,
    verifiedUsers: users.filter(u => u.isVerified).length,

    // Services
    totalServices: allServices.length,

         // Postes
     totalPostes: allPostes.length,
     postesByLevel: {
       direction: allPostes.filter(p => p.niveau.includes('Direction')).length,
       expertise: allPostes.filter(p => p.niveau.includes('Expertise')).length,
       encadrement: allPostes.filter(p => p.niveau.includes('Encadrement')).length,
       execution: allPostes.filter(p => p.niveau.includes('Exécution')).length
     }
  };
}

// === EXPORTS PRINCIPAUX ===

export const systemUsers = generateSystemUsers();
export const unifiedOrganismes = getUnifiedOrganismes();
export const systemStats = getSystemStats();

// === FONCTIONS UTILITAIRES ===

export function getUsersByOrganisme(organismeCode: string) {
  return systemUsers.filter(user => user.organizationId === organismeCode);
}

export function getUsersByRole(role: SystemUser['role']) {
  return systemUsers.filter(user => user.role === role);
}

export function getOrganismeWithDetails(organismeCode: string) {
  return unifiedOrganismes.find(org => org.code === organismeCode);
}

export function searchUsers(query: string) {
  const searchTerm = query.toLowerCase();
  return systemUsers.filter(user =>
    user.firstName.toLowerCase().includes(searchTerm) ||
    user.lastName.toLowerCase().includes(searchTerm) ||
    user.email.toLowerCase().includes(searchTerm) ||
    user.organizationName.toLowerCase().includes(searchTerm)
  );
}

export function getActiveUsersByOrganisme() {
  const result: Record<string, number> = {};
  unifiedOrganismes.forEach(org => {
    result[org.code] = org.stats.activeUsers;
  });
  return result;
}
