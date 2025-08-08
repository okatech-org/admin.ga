/**
 * API ROUTE : ORGANISMES DU SYSTÈME COMPLET
 * Expose les 141 organismes gabonais via API REST
 */

import { NextRequest, NextResponse } from 'next/server';
import { getOrganismesAPI } from '@/lib/services/systeme-complet-api.service';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Récupérer les paramètres de requête
    const params = {
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '500'), // Par défaut 500 pour charger tous les organismes
      search: searchParams.get('search') || undefined,
      type: searchParams.get('type') || undefined,
      city: searchParams.get('city') || undefined,
      isActive: searchParams.get('isActive') ? searchParams.get('isActive') === 'true' : undefined
    };

    // Obtenir les données depuis le système complet
    const result = await getOrganismesAPI(params);

    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(
        {
          success: false,
          error: 'Erreur lors du chargement des organismes',
          data: { organizations: [], pagination: { total: 0, page: 1, limit: 20, totalPages: 0 } }
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Erreur API organismes:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue',
        data: { organizations: [], pagination: { total: 0, page: 1, limit: 20, totalPages: 0 } }
      },
      { status: 500 }
    );
  }
}

// POST pour créer un nouvel organisme (extension)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Pour le moment, on retourne une erreur car l'ajout n'est pas encore implémenté dans l'API
    return NextResponse.json(
      {
        success: false,
        error: 'Ajout d\'organismes pas encore implémenté. Utilisez le module d\'extensions.'
      },
      { status: 501 }
    );
  } catch (error) {
    console.error('Erreur POST organismes:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}
