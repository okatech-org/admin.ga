import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Données utilisateurs simulées réalistes pour le Gabon
const MOCK_USERS = [
  // Super Administrateurs
  {
    id: 'user_1',
    email: 'superadmin@admin.ga',
    phone: '+241 01 44 30 00',
    firstName: 'Alexandre',
    lastName: 'NGOUA',
    role: 'SUPER_ADMIN',
    isActive: true,
    isVerified: true,
    jobTitle: 'Super Administrateur Système',
    primaryOrganizationId: 'admin-ga',
    organizationName: 'Administration.GA',
    organizationCode: 'admin-ga',
    createdAt: '2024-01-15T08:00:00.000Z',
    lastLoginAt: '2025-01-13T14:30:00.000Z'
  },
  {
    id: 'user_2',
    email: 'tech.lead@admin.ga',
    phone: '+241 01 44 30 01',
    firstName: 'Marie-Claire',
    lastName: 'OBAME',
    role: 'SUPER_ADMIN',
    isActive: true,
    isVerified: true,
    jobTitle: 'Lead Technique',
    primaryOrganizationId: 'admin-ga',
    organizationName: 'Administration.GA',
    organizationCode: 'admin-ga',
    createdAt: '2024-01-15T08:15:00.000Z',
    lastLoginAt: '2025-01-13T15:45:00.000Z'
  },

  // Ministère de la Justice
  {
    id: 'user_3',
    email: 'ministre@justice.gouv.ga',
    phone: '+241 01 44 20 03',
    firstName: 'Paulette',
    lastName: 'MISSAMBO',
    role: 'ADMIN',
    isActive: true,
    isVerified: true,
    jobTitle: 'Ministre de la Justice',
    primaryOrganizationId: 'MIN_JUSTICE',
    organizationName: 'Ministère de la Justice',
    organizationCode: 'MIN_JUSTICE',
    createdAt: '2024-02-01T09:00:00.000Z',
    lastLoginAt: '2025-01-13T08:30:00.000Z'
  },
  {
    id: 'user_4',
    email: 'sg@justice.gouv.ga',
    phone: '+241 01 44 20 04',
    firstName: 'Jean-Baptiste',
    lastName: 'NKOGHE',
    role: 'MANAGER',
    isActive: true,
    isVerified: true,
    jobTitle: 'Secrétaire Général',
    primaryOrganizationId: 'MIN_JUSTICE',
    organizationName: 'Ministère de la Justice',
    organizationCode: 'MIN_JUSTICE',
    createdAt: '2024-02-01T09:30:00.000Z',
    lastLoginAt: '2025-01-13T10:15:00.000Z'
  },
  {
    id: 'user_5',
    email: 'chef.cabinet@justice.gouv.ga',
    phone: '+241 01 44 20 05',
    firstName: 'Régine',
    lastName: 'MBOUMBA',
    role: 'MANAGER',
    isActive: true,
    isVerified: true,
    jobTitle: 'Chef de Cabinet',
    primaryOrganizationId: 'MIN_JUSTICE',
    organizationName: 'Ministère de la Justice',
    organizationCode: 'MIN_JUSTICE',
    createdAt: '2024-02-01T10:00:00.000Z',
    lastLoginAt: '2025-01-13T11:20:00.000Z'
  },
  {
    id: 'user_6',
    email: 'directeur.affaires.juridiques@justice.gouv.ga',
    phone: '+241 01 44 20 06',
    firstName: 'Alain',
    lastName: 'ESSONO',
    role: 'AGENT',
    isActive: true,
    isVerified: true,
    jobTitle: 'Directeur des Affaires Juridiques',
    primaryOrganizationId: 'MIN_JUSTICE',
    organizationName: 'Ministère de la Justice',
    organizationCode: 'MIN_JUSTICE',
    createdAt: '2024-02-05T08:00:00.000Z',
    lastLoginAt: '2025-01-12T16:45:00.000Z'
  },

  // Ministère de la Santé
  {
    id: 'user_7',
    email: 'ministre@sante.gouv.ga',
    phone: '+241 01 44 20 02',
    firstName: 'Guy Patrick',
    lastName: 'OBIANG NDONG',
    role: 'ADMIN',
    isActive: true,
    isVerified: true,
    jobTitle: 'Ministre de la Santé',
    primaryOrganizationId: 'MIN_SANTE',
    organizationName: 'Ministère de la Santé',
    organizationCode: 'MIN_SANTE',
    createdAt: '2024-02-01T09:00:00.000Z',
    lastLoginAt: '2025-01-13T07:30:00.000Z'
  },
  {
    id: 'user_8',
    email: 'sg@sante.gouv.ga',
    phone: '+241 01 44 20 07',
    firstName: 'Micheline',
    lastName: 'ONDO',
    role: 'MANAGER',
    isActive: true,
    isVerified: true,
    jobTitle: 'Secrétaire Générale',
    primaryOrganizationId: 'MIN_SANTE',
    organizationName: 'Ministère de la Santé',
    organizationCode: 'MIN_SANTE',
    createdAt: '2024-02-01T09:30:00.000Z',
    lastLoginAt: '2025-01-13T09:15:00.000Z'
  },
  {
    id: 'user_9',
    email: 'directeur.sante.publique@sante.gouv.ga',
    phone: '+241 01 44 20 08',
    firstName: 'Dr. Roland',
    lastName: 'MOUNGUENGUI',
    role: 'AGENT',
    isActive: true,
    isVerified: true,
    jobTitle: 'Directeur de la Santé Publique',
    primaryOrganizationId: 'MIN_SANTE',
    organizationName: 'Ministère de la Santé',
    organizationCode: 'MIN_SANTE',
    createdAt: '2024-02-05T08:30:00.000Z',
    lastLoginAt: '2025-01-12T17:20:00.000Z'
  },

  // Ministère de l'Intérieur
  {
    id: 'user_10',
    email: 'ministre@interieur.gouv.ga',
    phone: '+241 01 44 20 01',
    firstName: 'Hermann',
    lastName: 'IMMONGAULT',
    role: 'ADMIN',
    isActive: true,
    isVerified: true,
    jobTitle: 'Ministre de l\'Intérieur',
    primaryOrganizationId: 'MIN_INTERIEUR',
    organizationName: 'Ministère de l\'Intérieur',
    organizationCode: 'MIN_INTERIEUR',
    createdAt: '2024-02-01T09:00:00.000Z',
    lastLoginAt: '2025-01-13T08:00:00.000Z'
  },
  {
    id: 'user_11',
    email: 'sg@interieur.gouv.ga',
    phone: '+241 01 44 20 09',
    firstName: 'Sylvie',
    lastName: 'BAKOMBA',
    role: 'MANAGER',
    isActive: true,
    isVerified: true,
    jobTitle: 'Secrétaire Générale',
    primaryOrganizationId: 'MIN_INTERIEUR',
    organizationName: 'Ministère de l\'Intérieur',
    organizationCode: 'MIN_INTERIEUR',
    createdAt: '2024-02-01T09:30:00.000Z',
    lastLoginAt: '2025-01-13T10:45:00.000Z'
  },

  // Préfecture de l'Estuaire
  {
    id: 'user_12',
    email: 'prefet@prefecture-estuaire.ga',
    phone: '+241 01 44 15 01',
    firstName: 'Roger',
    lastName: 'OWONO MEBA',
    role: 'ADMIN',
    isActive: true,
    isVerified: true,
    jobTitle: 'Préfet de l\'Estuaire',
    primaryOrganizationId: 'PREF_ESTUAIRE',
    organizationName: 'Préfecture de l\'Estuaire',
    organizationCode: 'PREF_ESTUAIRE',
    createdAt: '2024-02-10T08:00:00.000Z',
    lastLoginAt: '2025-01-13T12:30:00.000Z'
  },
  {
    id: 'user_13',
    email: 'sg@prefecture-estuaire.ga',
    phone: '+241 01 44 15 02',
    firstName: 'Antoinette',
    lastName: 'NDZANG',
    role: 'MANAGER',
    isActive: true,
    isVerified: true,
    jobTitle: 'Secrétaire Générale',
    primaryOrganizationId: 'PREF_ESTUAIRE',
    organizationName: 'Préfecture de l\'Estuaire',
    organizationCode: 'PREF_ESTUAIRE',
    createdAt: '2024-02-10T08:30:00.000Z',
    lastLoginAt: '2025-01-13T11:15:00.000Z'
  },

  // Mairie de Libreville
  {
    id: 'user_14',
    email: 'maire@mairie-libreville.ga',
    phone: '+241 01 44 10 01',
    firstName: 'Christine',
    lastName: 'MARIN',
    role: 'ADMIN',
    isActive: true,
    isVerified: true,
    jobTitle: 'Maire de Libreville',
    primaryOrganizationId: 'MAIRIE_LIBREVILLE',
    organizationName: 'Mairie de Libreville',
    organizationCode: 'MAIRIE_LIBREVILLE',
    createdAt: '2024-02-15T08:00:00.000Z',
    lastLoginAt: '2025-01-13T13:45:00.000Z'
  },
  {
    id: 'user_15',
    email: 'dgs@mairie-libreville.ga',
    phone: '+241 01 44 10 02',
    firstName: 'François',
    lastName: 'NDONG',
    role: 'MANAGER',
    isActive: true,
    isVerified: true,
    jobTitle: 'Directeur Général des Services',
    primaryOrganizationId: 'MAIRIE_LIBREVILLE',
    organizationName: 'Mairie de Libreville',
    organizationCode: 'MAIRIE_LIBREVILLE',
    createdAt: '2024-02-15T08:30:00.000Z',
    lastLoginAt: '2025-01-13T14:20:00.000Z'
  },
  {
    id: 'user_16',
    email: 'etat.civil@mairie-libreville.ga',
    phone: '+241 01 44 10 03',
    firstName: 'Georgette',
    lastName: 'KOMBILA',
    role: 'AGENT',
    isActive: true,
    isVerified: true,
    jobTitle: 'Chef du Service État Civil',
    primaryOrganizationId: 'MAIRIE_LIBREVILLE',
    organizationName: 'Mairie de Libreville',
    organizationCode: 'MAIRIE_LIBREVILLE',
    createdAt: '2024-02-20T09:00:00.000Z',
    lastLoginAt: '2025-01-12T15:30:00.000Z'
  },

  // Direction Générale des Impôts (DGI)
  {
    id: 'user_17',
    email: 'directeur@dgi.ga',
    phone: '+241 01 44 25 01',
    firstName: 'Pacôme',
    lastName: 'RUFIN ONDZONDO',
    role: 'ADMIN',
    isActive: true,
    isVerified: true,
    jobTitle: 'Directeur Général des Impôts',
    primaryOrganizationId: 'DGI',
    organizationName: 'Direction Générale des Impôts',
    organizationCode: 'DGI',
    createdAt: '2024-02-05T08:00:00.000Z',
    lastLoginAt: '2025-01-13T09:45:00.000Z'
  },
  {
    id: 'user_18',
    email: 'sg@dgi.ga',
    phone: '+241 01 44 25 02',
    firstName: 'Claudine',
    lastName: 'OYANE',
    role: 'MANAGER',
    isActive: true,
    isVerified: true,
    jobTitle: 'Secrétaire Générale',
    primaryOrganizationId: 'DGI',
    organizationName: 'Direction Générale des Impôts',
    organizationCode: 'DGI',
    createdAt: '2024-02-05T08:30:00.000Z',
    lastLoginAt: '2025-01-13T08:15:00.000Z'
  },

  // CNSS (Caisse Nationale de Sécurité Sociale)
  {
    id: 'user_19',
    email: 'directeur@cnss.ga',
    phone: '+241 01 44 35 01',
    firstName: 'Dieudonné',
    lastName: 'MINDZIE',
    role: 'ADMIN',
    isActive: true,
    isVerified: true,
    jobTitle: 'Directeur Général CNSS',
    primaryOrganizationId: 'CNSS',
    organizationName: 'Caisse Nationale de Sécurité Sociale',
    organizationCode: 'CNSS',
    createdAt: '2024-02-08T08:00:00.000Z',
    lastLoginAt: '2025-01-13T10:30:00.000Z'
  },
  {
    id: 'user_20',
    email: 'rh@cnss.ga',
    phone: '+241 01 44 35 02',
    firstName: 'Véronique',
    lastName: 'NGUEMA',
    role: 'AGENT',
    isActive: true,
    isVerified: true,
    jobTitle: 'Responsable Ressources Humaines',
    primaryOrganizationId: 'CNSS',
    organizationName: 'Caisse Nationale de Sécurité Sociale',
    organizationCode: 'CNSS',
    createdAt: '2024-02-10T09:00:00.000Z',
    lastLoginAt: '2025-01-12T16:45:00.000Z'
  },

  // Citoyens utilisateurs
  {
    id: 'user_21',
    email: 'jean.pierre@gmail.com',
    phone: '+241 06 12 34 56',
    firstName: 'Jean-Pierre',
    lastName: 'MOUNANGA',
    role: 'USER',
    isActive: true,
    isVerified: true,
    jobTitle: 'Ingénieur',
    primaryOrganizationId: null,
    organizationName: 'Citoyen',
    organizationCode: 'CITOYEN',
    createdAt: '2024-03-01T10:00:00.000Z',
    lastLoginAt: '2025-01-13T19:30:00.000Z'
  },
  {
    id: 'user_22',
    email: 'marie.christine@yahoo.fr',
    phone: '+241 07 23 45 67',
    firstName: 'Marie-Christine',
    lastName: 'LEYAMA',
    role: 'USER',
    isActive: true,
    isVerified: true,
    jobTitle: 'Enseignante',
    primaryOrganizationId: null,
    organizationName: 'Citoyen',
    organizationCode: 'CITOYEN',
    createdAt: '2024-03-15T14:30:00.000Z',
    lastLoginAt: '2025-01-13T18:15:00.000Z'
  },
  {
    id: 'user_23',
    email: 'paul.ekomo@hotmail.com',
    phone: '+241 05 34 56 78',
    firstName: 'Paul',
    lastName: 'EKOMO',
    role: 'USER',
    isActive: true,
    isVerified: false,
    jobTitle: 'Commerçant',
    primaryOrganizationId: null,
    organizationName: 'Citoyen',
    organizationCode: 'CITOYEN',
    createdAt: '2024-04-01T16:00:00.000Z',
    lastLoginAt: '2025-01-10T20:45:00.000Z'
  },
  {
    id: 'user_24',
    email: 'grace.ndong@gmail.com',
    phone: '+241 06 45 67 89',
    firstName: 'Grâce',
    lastName: 'NDONG',
    role: 'USER',
    isActive: false,
    isVerified: true,
    jobTitle: 'Étudiante',
    primaryOrganizationId: null,
    organizationName: 'Citoyen',
    organizationCode: 'CITOYEN',
    createdAt: '2024-04-15T11:30:00.000Z',
    lastLoginAt: '2025-01-05T15:20:00.000Z'
  },
  {
    id: 'user_25',
    email: 'bertrand.mba@yahoo.com',
    phone: '+241 07 56 78 90',
    firstName: 'Bertrand',
    lastName: 'MBA',
    role: 'USER',
    isActive: true,
    isVerified: true,
    jobTitle: 'Informaticien',
    primaryOrganizationId: null,
    organizationName: 'Citoyen',
    organizationCode: 'CITOYEN',
    createdAt: '2024-05-01T08:45:00.000Z',
    lastLoginAt: '2025-01-13T21:10:00.000Z'
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role') || 'all';
    const status = searchParams.get('status') || 'all';
    const organizationId = searchParams.get('organizationId') || 'all';
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    console.log('🔍 API Users - Paramètres de recherche:', {
      search,
      role,
      status,
      organizationId,
      limit,
      offset
    });

        // Récupération depuis la base de données
    let users = [];
    let fromDatabase = false;

    try {
      console.log('🔍 Récupération des utilisateurs depuis la base de données...');

      // Récupérer les utilisateurs avec leurs organisations
      const dbUsers = await prisma.user.findMany({
        include: {
          primaryOrganization: {
            select: {
              name: true,
              code: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      console.log(`📊 ${dbUsers.length} utilisateurs trouvés en base de données`);

      if (dbUsers.length > 0) {
        fromDatabase = true;
        users = dbUsers.map(user => ({
          id: user.id,
          email: user.email,
          phone: user.phone,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          isActive: user.isActive,
          isVerified: user.isVerified,
          jobTitle: user.jobTitle,
          primaryOrganizationId: user.primaryOrganizationId,
          organizationName: user.primaryOrganization?.name || 'Citoyen',
          organizationCode: user.primaryOrganization?.code || 'CITOYEN',
          createdAt: user.createdAt.toISOString(),
          lastLoginAt: user.lastLoginAt?.toISOString(),
          updatedAt: user.updatedAt.toISOString()
        }));
      } else {
        console.log('⚠️ Aucun utilisateur trouvé en base, utilisation des données simulées');
        users = MOCK_USERS;
      }
    } catch (dbError) {
      console.error('❌ Erreur base de données:', dbError);
      console.log('⚠️ Fallback vers les données simulées');
      users = MOCK_USERS;
    }

    // Filtrage
    let filteredUsers = users;

    // Filtre par recherche
    if (search) {
      const searchLower = search.toLowerCase();
      filteredUsers = filteredUsers.filter(user =>
        user.firstName.toLowerCase().includes(searchLower) ||
        user.lastName.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.organizationName.toLowerCase().includes(searchLower) ||
        (user.jobTitle && user.jobTitle.toLowerCase().includes(searchLower))
      );
    }

    // Filtre par rôle
    if (role && role !== 'all') {
      filteredUsers = filteredUsers.filter(user => user.role === role);
    }

    // Filtre par statut
    if (status && status !== 'all') {
      filteredUsers = filteredUsers.filter(user =>
        status === 'active' ? user.isActive : !user.isActive
      );
    }

    // Filtre par organisation
    if (organizationId && organizationId !== 'all') {
      filteredUsers = filteredUsers.filter(user =>
        user.primaryOrganizationId === organizationId ||
        user.organizationCode === organizationId
      );
    }

    // Pagination
    const total = filteredUsers.length;
    const paginatedUsers = filteredUsers.slice(offset, offset + limit);

    console.log(`✅ ${paginatedUsers.length} utilisateurs retournés sur ${total} total (${fromDatabase ? 'Base de données' : 'Données simulées'})`);

    return NextResponse.json({
      success: true,
      data: {
        users: paginatedUsers,
        total,
        hasMore: total > offset + limit,
        fromDatabase,
        pagination: {
          limit,
          offset,
          totalPages: Math.ceil(total / limit),
          currentPage: Math.floor(offset / limit) + 1
        }
      }
    });

  } catch (error) {
    console.error('❌ Erreur API Users:', error);

    return NextResponse.json({
      success: false,
      error: 'Erreur lors de la récupération des utilisateurs',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
}
