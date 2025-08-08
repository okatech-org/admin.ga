/**
 * API ROUTE : FONCTIONNAIRES EN ATTENTE
 * Expose les fonctionnaires en attente d'affectation basés sur le système complet
 */

import { NextRequest, NextResponse } from 'next/server';
import { getFonctionnairesEnAttenteAPI } from '@/lib/services/systeme-complet-api.service';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Récupérer les paramètres de requête
    const params = {
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '50'),
      search: searchParams.get('search') || undefined,
      priorite: searchParams.get('priorite') || undefined
    };

    // Obtenir les données depuis le système complet
    const result = await getFonctionnairesEnAttenteAPI(params);

    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(
        {
          success: false,
          error: 'Erreur lors du chargement des fonctionnaires',
          data: [],
          pagination: { total: 0, page: 1, limit: 20, totalPages: 0 }
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Erreur API fonctionnaires:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue',
        data: [],
        pagination: { total: 0, page: 1, limit: 20, totalPages: 0 }
      },
      { status: 500 }
    );
  }
}
