import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getComptesActifsAPI } from '@/lib/services/systeme-rh-api.service';

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
    const limit = parseInt(searchParams.get('limit') || '50'); // Plus élevé pour la page utilisateurs
    const organisme_code = searchParams.get('organisme_code') || undefined;
    const role = searchParams.get('role') || undefined;
    const search = searchParams.get('search') || undefined;

    // Appeler le service RH
    const result = await getComptesActifsAPI({
      page,
      limit,
      organisme_code,
      role,
      search
    });

    if (!result.success) {
      throw new Error('Erreur lors de la récupération des comptes actifs');
    }

    // Transformer les données pour correspondre au format attendu par les pages
    const comptesTransformes = result.data.comptes.map(compte => ({
      id: compte.id,
      firstName: compte.fonctionnaire.nom_complet.split(' ')[0] || '',
      lastName: compte.fonctionnaire.nom_complet.split(' ').slice(1).join(' ') || '',
      name: compte.fonctionnaire.nom_complet,
      email: compte.fonctionnaire.email || 'email@admin.ga',
      phone: compte.fonctionnaire.telephone || '',
      role: compte.role_systeme,
      organizationId: compte.poste.organisme_code,
      organizationName: compte.poste.organisme_nom,
      organization: compte.poste.organisme_nom,
      posteTitle: compte.poste.titre,
      position: compte.poste.titre,
      isActive: compte.statut === 'ACTIF',
      status: compte.statut === 'ACTIF' ? 'active' : 'inactive',
      isVerified: true,
      createdAt: compte.date_affectation,
      lastLoginAt: compte.dernier_acces,
      lastLogin: compte.dernier_acces ? new Date(compte.dernier_acces).toLocaleDateString('fr-FR') : 'Jamais',
      environment: 'ADMIN' as const,
      platform: 'ADMIN.GA' as const,
      grade: compte.fonctionnaire.grade || 'N/A',
      matricule: compte.fonctionnaire.matricule || 'N/A',
      permissions: compte.permissions || [],
      derniere_evaluation: compte.derniere_evaluation
    }));

    return NextResponse.json({
      success: true,
      data: {
        users: comptesTransformes, // Pour compatibilité avec page utilisateurs
        comptes: comptesTransformes, // Pour cohérence API
        total: result.data.total,
        pagination: result.data.pagination
      }
    });

  } catch (error) {
    console.error('Erreur API comptes actifs:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur serveur lors de la récupération des comptes actifs'
      },
      { status: 500 }
    );
  }
}
