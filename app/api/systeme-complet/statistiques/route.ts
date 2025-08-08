/**
 * API ROUTE : STATISTIQUES DU SYSTÈME COMPLET
 * Expose les statistiques des 141 organismes et leurs utilisateurs
 */

import { NextRequest, NextResponse } from 'next/server';
import { getStatistiquesAPI } from '@/lib/services/systeme-complet-api.service';

export async function GET(request: NextRequest) {
  try {
    // Obtenir les statistiques depuis le système complet
    const stats = await getStatistiquesAPI();

    return NextResponse.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Erreur API statistiques:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue',
        data: null
      },
      { status: 500 }
    );
  }
}
