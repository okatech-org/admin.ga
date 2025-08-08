/**
 * API STATISTIQUES DASHBOARD SUPER ADMIN
 * Utilise le système complet des 141 organismes avec la bonne répartition des utilisateurs
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getStatistiquesAPI } from '@/lib/services/systeme-complet-api.service';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      );
    }

    // Obtenir les statistiques du système complet
    const statsSysteme = await getStatistiquesAPI();

    // Ajouter les 5 citoyens souhaités (utilisateurs externes)
    const citoyens = [
      {
        id: 'citoyen_001',
        email: 'jean.pierre@gmail.com',
        firstName: 'Jean-Pierre',
        lastName: 'MOUNANGA',
        role: 'CITOYEN',
        isActive: true,
        jobTitle: 'Ingénieur'
      },
      {
        id: 'citoyen_002',
        email: 'marie.christine@yahoo.fr',
        firstName: 'Marie-Christine',
        lastName: 'LEYAMA',
        role: 'CITOYEN',
        isActive: true,
        jobTitle: 'Enseignante'
      },
      {
        id: 'citoyen_003',
        email: 'paul.ekomo@hotmail.com',
        firstName: 'Paul',
        lastName: 'EKOMO',
        role: 'CITOYEN',
        isActive: true,
        jobTitle: 'Commerçant'
      },
      {
        id: 'citoyen_004',
        email: 'grace.ndong@gmail.com',
        firstName: 'Grâce',
        lastName: 'NDONG',
        role: 'CITOYEN',
        isActive: false,
        jobTitle: 'Étudiante'
      },
      {
        id: 'citoyen_005',
        email: 'bertrand.mba@yahoo.com',
        firstName: 'Bertrand',
        lastName: 'MBA',
        role: 'CITOYEN',
        isActive: true,
        jobTitle: 'Informaticien'
      }
    ];

    // Ajouter 2-3 super admins
    const superAdmins = [
      {
        id: 'superadmin_001',
        email: 'admin.systeme@admin.ga',
        firstName: 'Administrateur',
        lastName: 'SYSTÈME',
        role: 'SUPER_ADMIN',
        isActive: true,
        jobTitle: 'Super Administrateur Système'
      },
      {
        id: 'superadmin_002',
        email: 'directeur.dgdi@admin.ga',
        firstName: 'Directeur',
        lastName: 'DGDI',
        role: 'SUPER_ADMIN',
        isActive: true,
        jobTitle: 'Directeur Général DGDI'
      }
    ];

    // Calculer les statistiques corrigées
    const citoyensActifs = citoyens.filter(c => c.isActive).length;
    const superAdminsActifs = superAdmins.filter(s => s.isActive).length;

    // Corriger: tous les utilisateurs du système complet sont actifs
    const fonctionnairesActifs = statsSysteme.totalUtilisateurs; // Correction : tous sont actifs

    const stats = {
      // STATISTIQUES PRINCIPALES
      totalUsers: statsSysteme.totalUtilisateurs + citoyens.length + superAdmins.length,
      activeUsers: fonctionnairesActifs + citoyensActifs + superAdminsActifs,
      inactiveUsers: (citoyens.length - citoyensActifs) + (superAdmins.length - superAdminsActifs),
      verifiedUsers: statsSysteme.totalUtilisateurs + citoyens.length + superAdmins.length,
      unverifiedUsers: 0,

      // RÉPARTITION PAR STATUT
      statusDistribution: {
        active: fonctionnairesActifs + citoyensActifs + superAdminsActifs,
        inactive: (citoyens.length - citoyensActifs) + (superAdmins.length - superAdminsActifs)
      },

      // RÉPARTITION PAR RÔLE (CORRIGÉE)
      usersByRole: {
        SUPER_ADMIN: superAdmins.length,
        ADMIN: 141, // Un par organisme
        USER: 153, // Collaborateurs dans les organismes (PAS des citoyens)
        RECEPTIONIST: 141, // Un par organisme
        CITOYEN: citoyens.length // Vrais citoyens externes
      },

      // ORGANISMES
      totalOrganizations: statsSysteme.totalOrganismes,
      activeOrganizations: statsSysteme.organismesActifs,

      // RÉPARTITION ORGANISMES PAR TYPE
      organizationsByType: statsSysteme.repartitionParType,

      // MOYENNES
      averageUsersPerOrganization: statsSysteme.moyenneUsersParOrganisme,

      // TOP ORGANISMES
      topOrganizations: statsSysteme.top5Organismes,

      // MÉTADONNÉES
      lastUpdated: new Date().toISOString(),
      dataSource: 'systeme-complet-141-organismes',

      // DÉTAILS POUR DEBUG
      breakdown: {
        fonctionnaires: {
          admins: 141,
          collaborateurs: 153,
          receptionistes: 141,
          total: statsSysteme.totalUtilisateurs,
          actifs: fonctionnairesActifs // Correction : tous actifs
        },
        citoyens: {
          total: citoyens.length,
          actifs: citoyensActifs,
          inactifs: citoyens.length - citoyensActifs
        },
        superAdmins: {
          total: superAdmins.length,
          actifs: superAdminsActifs
        }
      }
    };

    return NextResponse.json({
      success: true,
      data: stats,
      meta: {
        generatedAt: new Date().toISOString(),
        source: 'Système Complet 141 Organismes Officiels',
        note: 'Statistiques corrigées avec 5 citoyens seulement'
      }
    });

  } catch (error) {
    console.error('Erreur dashboard stats système complet:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur lors du chargement des statistiques',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}
