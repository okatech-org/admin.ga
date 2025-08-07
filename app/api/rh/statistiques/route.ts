import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getStatistiquesRHAPI } from '@/lib/services/systeme-rh-api.service';

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

    // Appeler le service RH pour les statistiques
    const result = await getStatistiquesRHAPI();

    if (!result.success) {
      throw new Error('Erreur lors de la récupération des statistiques RH');
    }

    return NextResponse.json({
      success: true,
      data: result.data
    });

  } catch (error) {
    console.error('Erreur API statistiques RH:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur serveur lors de la récupération des statistiques RH'
      },
      { status: 500 }
    );
  }
}
