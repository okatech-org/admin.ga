import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getPropositionsAPI } from '@/lib/services/systeme-rh-api.service';

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
    const fonctionnaire_id = searchParams.get('fonctionnaire_id') || undefined;
    const limit = parseInt(searchParams.get('limit') || '10');

    // Appeler le service RH
    const result = await getPropositionsAPI({
      fonctionnaire_id,
      limit
    });

    if (!result.success) {
      throw new Error('Erreur lors de la récupération des propositions d\'affectation');
    }

    return NextResponse.json({
      success: true,
      data: result.data
    });

  } catch (error) {
    console.error('Erreur API propositions:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur serveur lors de la récupération des propositions d\'affectation'
      },
      { status: 500 }
    );
  }
}
