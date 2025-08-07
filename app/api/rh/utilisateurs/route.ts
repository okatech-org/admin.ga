import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getComptesActifsAPI, getStatistiquesRHAPI } from '@/lib/services/systeme-rh-api.service';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // En mode développement, autoriser l'accès même sans session
    const isDevelopment = process.env.NODE_ENV === 'development' || process.env.VERCEL_ENV !== 'production';

    if (!session?.user && !isDevelopment) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    // Paramètres de requête
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '100');
    const organisme_code = searchParams.get('organisme_code') || undefined;
    const role = searchParams.get('role') || undefined;
    const search = searchParams.get('search') || undefined;
    const includeStats = searchParams.get('includeStats') === 'true';

        // Récupérer les comptes actifs (fonctionnaires)
    const result = await getComptesActifsAPI({
      page,
      limit: limit - 7, // Réserver 7 places pour citoyens + super admins
      organisme_code,
      role,
      search
    });

    if (!result.success) {
      throw new Error('Erreur lors de la récupération des utilisateurs');
    }

    // Ajouter les citoyens (comme dans l'ancien système)
    const citoyens = [
      {
        id: 'citizen_1',
        firstName: 'Alice',
        lastName: 'Dupont',
        name: 'Alice Dupont',
        email: 'alice.dupont@citoyen.ga',
        phone: '+241 01 12 34 56',
        role: 'CITOYEN',
        organizationId: 'CITOYENS',
        organizationName: 'Citoyens Gabonais',
        organization: 'Citoyens Gabonais',
        posteTitle: '',
        position: 'Citoyen',
        isActive: true,
        status: 'active',
        isVerified: true,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        lastLogin: new Date().toLocaleDateString('fr-FR'),
        environment: 'DEMARCHE' as const,
        platform: 'DEMARCHE.GA' as const,
        grade: 'N/A',
        matricule: 'CIT001',
        permissions: ['lecture'],
        type: 'CITOYEN'
      },
      {
        id: 'citizen_2',
        firstName: 'Bob',
        lastName: 'Martin',
        name: 'Bob Martin',
        email: 'bob.martin@citoyen.ga',
        phone: '+241 01 23 45 67',
        role: 'CITOYEN',
        organizationId: 'CITOYENS',
        organizationName: 'Citoyens Gabonais',
        organization: 'Citoyens Gabonais',
        posteTitle: '',
        position: 'Citoyen',
        isActive: true,
        status: 'active',
        isVerified: true,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        lastLogin: new Date().toLocaleDateString('fr-FR'),
        environment: 'DEMARCHE' as const,
        platform: 'DEMARCHE.GA' as const,
        grade: 'N/A',
        matricule: 'CIT002',
        permissions: ['lecture'],
        type: 'CITOYEN'
      },
      {
        id: 'citizen_3',
        firstName: 'Claire',
        lastName: 'Bernard',
        name: 'Claire Bernard',
        email: 'claire.bernard@citoyen.ga',
        phone: '+241 01 34 56 78',
        role: 'CITOYEN',
        organizationId: 'CITOYENS',
        organizationName: 'Citoyens Gabonais',
        organization: 'Citoyens Gabonais',
        posteTitle: '',
        position: 'Citoyen',
        isActive: true,
        status: 'active',
        isVerified: true,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        lastLogin: new Date().toLocaleDateString('fr-FR'),
        environment: 'DEMARCHE' as const,
        platform: 'DEMARCHE.GA' as const,
        grade: 'N/A',
        matricule: 'CIT003',
        permissions: ['lecture'],
        type: 'CITOYEN'
      },
      {
        id: 'citizen_4',
        firstName: 'David',
        lastName: 'Dubois',
        name: 'David Dubois',
        email: 'david.dubois@citoyen.ga',
        phone: '+241 01 45 67 89',
        role: 'CITOYEN',
        organizationId: 'CITOYENS',
        organizationName: 'Citoyens Gabonais',
        organization: 'Citoyens Gabonais',
        posteTitle: '',
        position: 'Citoyen',
        isActive: true,
        status: 'active',
        isVerified: true,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        lastLogin: new Date().toLocaleDateString('fr-FR'),
        environment: 'DEMARCHE' as const,
        platform: 'DEMARCHE.GA' as const,
        grade: 'N/A',
        matricule: 'CIT004',
        permissions: ['lecture'],
        type: 'CITOYEN'
      },
      {
        id: 'citizen_5',
        firstName: 'Eve',
        lastName: 'Petit',
        name: 'Eve Petit',
        email: 'eve.petit@citoyen.ga',
        phone: '+241 01 56 78 90',
        role: 'CITOYEN',
        organizationId: 'CITOYENS',
        organizationName: 'Citoyens Gabonais',
        organization: 'Citoyens Gabonais',
        posteTitle: '',
        position: 'Citoyen',
        isActive: false,
        status: 'inactive',
        isVerified: true,
        createdAt: new Date().toISOString(),
        lastLoginAt: undefined,
        lastLogin: 'Jamais',
        environment: 'DEMARCHE' as const,
        platform: 'DEMARCHE.GA' as const,
        grade: 'N/A',
        matricule: 'CIT005',
        permissions: [],
        type: 'CITOYEN'
      }
    ];

    // Ajouter les super admins
    const superAdmins = [
      {
        id: 'super_admin_1',
        firstName: 'Admin',
        lastName: 'SYSTÈME',
        name: 'Admin SYSTÈME',
        email: 'superadmin@admin.ga',
        phone: '+241 01 11 11 11',
        role: 'SUPER_ADMIN',
        organizationId: 'DGDI',
        organizationName: 'Direction Générale de l\'Informatique',
        organization: 'Direction Générale de l\'Informatique',
        posteTitle: 'Administrateur Système',
        position: 'Administrateur Système',
        isActive: true,
        status: 'active',
        isVerified: true,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        lastLogin: new Date().toLocaleDateString('fr-FR'),
        environment: 'ADMIN' as const,
        platform: 'ADMIN.GA' as const,
        grade: 'A1',
        matricule: 'SUP001',
        permissions: ['all'],
        type: 'SUPER_ADMIN'
      },
      {
        id: 'super_admin_2',
        firstName: 'Directeur',
        lastName: 'DGDI',
        name: 'Directeur DGDI',
        email: 'dgdi@admin.ga',
        phone: '+241 01 22 22 22',
        role: 'SUPER_ADMIN',
        organizationId: 'DGDI',
        organizationName: 'Direction Générale de l\'Informatique',
        organization: 'Direction Générale de l\'Informatique',
        posteTitle: 'Directeur Général DGDI',
        position: 'Directeur Général DGDI',
        isActive: true,
        status: 'active',
        isVerified: true,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        lastLogin: new Date().toLocaleDateString('fr-FR'),
        environment: 'ADMIN' as const,
        platform: 'ADMIN.GA' as const,
        grade: 'A1',
        matricule: 'SUP002',
        permissions: ['all'],
        type: 'SUPER_ADMIN'
      }
    ];

    // Transformer les comptes actifs
    const fonctionnaires = result.data.comptes.map(compte => ({
      ...compte,
      type: 'FONCTIONNAIRE'
    }));

    // Combiner tous les utilisateurs
    let tousLesUtilisateurs = [...fonctionnaires, ...citoyens, ...superAdmins];

    // Filtrer selon les critères si nécessaire
    if (search) {
      const searchLower = search.toLowerCase();
      tousLesUtilisateurs = tousLesUtilisateurs.filter(user =>
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.organizationName.toLowerCase().includes(searchLower)
      );
    }

    if (role && role !== 'ALL') {
      tousLesUtilisateurs = tousLesUtilisateurs.filter(user => user.role === role);
    }

    if (organisme_code && organisme_code !== 'ALL') {
      tousLesUtilisateurs = tousLesUtilisateurs.filter(user => user.organizationId === organisme_code);
    }

    // Pagination manuelle pour le dataset combiné
    const total = tousLesUtilisateurs.length;
    const offset = (page - 1) * limit;
    const utilisateursPagines = tousLesUtilisateurs.slice(offset, offset + limit);

    // Créer le breakdown des types d'utilisateurs
    const breakdown = {
      fonctionnaires: fonctionnaires.length,
      citoyens: citoyens.length,
      superAdmins: superAdmins.length,
      actifs: tousLesUtilisateurs.filter(u => u.isActive).length,
      inactifs: tousLesUtilisateurs.filter(u => !u.isActive).length
    };

    // Statistiques si demandées
    let statistiques = null;
    if (includeStats) {
      const statsResult = await getStatistiquesRHAPI();
      if (statsResult.success) {
        statistiques = statsResult.data;
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        users: utilisateursPagines,
        total,
        pagination: {
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        },
        statistics: statistiques,
        breakdown
      }
    });

  } catch (error) {
    console.error('Erreur API utilisateurs RH:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur serveur lors de la récupération des utilisateurs'
      },
      { status: 500 }
    );
  }
}
