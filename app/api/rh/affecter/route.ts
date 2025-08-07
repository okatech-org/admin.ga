import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { affecterFonctionnaireAPI } from '@/lib/services/systeme-rh-api.service';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { fonctionnaire_id, poste_id } = body;

    if (!fonctionnaire_id || !poste_id) {
      return NextResponse.json(
        { error: 'Paramètres manquants: fonctionnaire_id et poste_id requis' },
        { status: 400 }
      );
    }

    // Appeler le service RH pour effectuer l'affectation
    const result = await affecterFonctionnaireAPI({
      fonctionnaire_id,
      poste_id
    });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.message || 'Erreur lors de l\'affectation'
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      data: {
        compte: result.compte
      }
    });

  } catch (error) {
    console.error('Erreur API affectation:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur serveur lors de l\'affectation'
      },
      { status: 500 }
    );
  }
}
