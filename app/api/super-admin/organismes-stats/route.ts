/* @ts-nocheck */
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        {
          success: false,
          error: 'Accès non autorisé - Rôle Super Admin requis',
          data: null
        },
        { status: 403 }
      );
    }

    console.log('🧹 Organismes stats - retour de statistiques vides (base nettoyée)');

    // Structure compatible avec sidebar-dynamic-badges.tsx
    const statsResponse = {
      success: true,
      data: {
        overview: {
          totalOrganismes: 0,
          activeOrganismes: 0,
          prospectsCount: 0,
          clientsCount: 0,
          relationsCount: 0,
          recentOrganismes: 0
        },
        // Données additionnelles pour compatibilité
        organisesActifs: 0,
        organisesInactifs: 0,
        nouveauxOrganismes: 0,
        organismesSuspendu: 0,
        organisesVerifies: 0,
        organismesByType: {
          MINISTERE: 0,
          PREFECTURE: 0,
          MAIRIE: 0,
          ORGANISME_PUBLIC: 0,
          ORGANISME_PARAPUBLIC: 0
        },
        recentActivities: [],
        tendances: {
          croissance: 0,
          nouveauxCeMois: 0,
          activesAujourdhui: 0
        }
      }
    };

    return NextResponse.json(statsResponse);

  } catch (error) {
    console.error('Erreur organismes stats:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur serveur lors de la récupération des statistiques',
        data: {
          overview: {
            totalOrganismes: 0,
            activeOrganismes: 0,
            prospectsCount: 0,
            clientsCount: 0,
            relationsCount: 0,
            recentOrganismes: 0
          }
        }
      },
      { status: 500 }
    );
  }
}
