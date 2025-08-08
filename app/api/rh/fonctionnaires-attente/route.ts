import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getFonctionnairesEnAttenteAPI } from '@/lib/services/systeme-rh-api.service';

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
    const grade = searchParams.get('grade') || undefined;
    const search = searchParams.get('search') || undefined;

    // Appeler le service RH
    const result = await getFonctionnairesEnAttenteAPI({
      page,
      limit,
      grade,
      search
    });

    if (!result.success) {
      throw new Error('Erreur lors de la récupération des fonctionnaires en attente');
    }

    // Récupérer tous les fonctionnaires pour calculer les statistiques globales
    const allFonctionnairesResult = await getFonctionnairesEnAttenteAPI({
      page: 1,
      limit: 10000, // Récupérer tous les fonctionnaires
      grade,
      search
    });

    const allFonctionnaires = allFonctionnairesResult.success ? allFonctionnairesResult.data.fonctionnaires : [];

    // Calculer les statistiques basées sur tous les fonctionnaires
    const stats = {
      total: result.data.total,
      enAttente: allFonctionnaires.filter(f => f.statut === 'EN_ATTENTE').length,
      affectes: allFonctionnaires.filter(f => f.statut === 'AFFECTE').length,
      detaches: allFonctionnaires.filter(f => f.statut === 'DETACHE').length,
      suspendus: allFonctionnaires.filter(f => f.statut === 'SUSPENDU').length,
      prioriteHaute: allFonctionnaires.filter(f => f.prioriteAffectation === 'HAUTE').length,
      prioriteMoyenne: allFonctionnaires.filter(f => f.prioriteAffectation === 'MOYENNE').length,
      prioriteBasse: allFonctionnaires.filter(f => f.prioriteAffectation === 'BASSE').length,
      avecDoubleRattachement: allFonctionnaires.filter(f =>
        f.rattachementPrimaire && f.rattachementSecondaire
      ).length
    };

    // Adapter la structure de pagination pour correspondre au frontend
    const pagination = {
      page: result.data.pagination.page,
      limit: result.data.pagination.limit,
      total: result.data.total,
      pages: result.data.pagination.totalPages
    };

    return NextResponse.json({
      success: true,
      data: result.data.fonctionnaires,
      stats,
      pagination
    });

  } catch (error) {
    console.error('Erreur API fonctionnaires en attente:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur serveur lors de la récupération des fonctionnaires en attente'
      },
      { status: 500 }
    );
  }
}
