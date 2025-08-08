/**
 * API ROUTE : UTILISATEURS DU SYSTÈME COMPLET
 * Expose les ~440 utilisateurs des 141 organismes gabonais
 */

import { NextRequest, NextResponse } from 'next/server';
import { getUsersAPI } from '@/lib/services/systeme-complet-api.service';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Récupérer les paramètres de requête
    const params = {
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '100'),
      search: searchParams.get('search') || undefined,
      role: searchParams.get('role') || undefined,
      organismeCode: searchParams.get('organismeCode') || undefined,
      status: searchParams.get('status') || undefined
    };

    // Obtenir les données depuis le système complet
    const result = await getUsersAPI(params);

    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(
        {
          success: false,
          error: 'Erreur lors du chargement des utilisateurs',
          data: { users: [], pagination: { total: 0, page: 1, limit: 20, totalPages: 0 } }
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Erreur API utilisateurs:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue',
        data: { users: [], pagination: { total: 0, page: 1, limit: 20, totalPages: 0 } }
      },
      { status: 500 }
    );
  }
}
