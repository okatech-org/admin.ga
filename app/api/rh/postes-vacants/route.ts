import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getPostesVacantsAPI } from '@/lib/services/systeme-rh-api.service';

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
    const limit = parseInt(searchParams.get('limit') || '20');
    const organisme_code = searchParams.get('organisme_code') || undefined;
    const niveau = searchParams.get('niveau') ? parseInt(searchParams.get('niveau')!) : undefined;
    const salaire_min = searchParams.get('salaire_min') ? parseInt(searchParams.get('salaire_min')!) : undefined;
    const search = searchParams.get('search') || undefined;

    // Appeler le service RH
    const result = await getPostesVacantsAPI({
      page,
      limit,
      organisme_code,
      niveau,
      salaire_min
    });

    if (!result.success) {
      throw new Error('Erreur lors de la récupération des postes vacants');
    }

    // Filtrer par recherche textuelle si nécessaire
    let postes = result.data.postes;
    if (search) {
      const searchLower = search.toLowerCase();
      postes = postes.filter(poste =>
        poste.titre.toLowerCase().includes(searchLower) ||
        poste.organisme_nom?.toLowerCase().includes(searchLower) ||
        poste.code.toLowerCase().includes(searchLower)
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        postes,
        total: search ? postes.length : result.data.total,
        pagination: {
          ...result.data.pagination,
          total: search ? postes.length : result.data.total
        }
      }
    });

  } catch (error) {
    console.error('Erreur API postes vacants:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur serveur lors de la récupération des postes vacants'
      },
      { status: 500 }
    );
  }
}
