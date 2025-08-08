import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

interface RouteContext {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)) {
      return NextResponse.json(
        { success: false, error: 'Accès non autorisé' },
        { status: 403 }
      );
    }

    const { id } = params;

    // Simulation de récupération depuis la base de données
    // En production, remplacer par une vraie requête DB
    const client = {
      id,
      nom: 'Banque Centrale du Gabon',
      code: 'BCG',
      secteurActivite: 'Services Financiers',
      statut: 'ACTIF',
      // ... autres propriétés
    };

    if (!client) {
      return NextResponse.json(
        { success: false, error: 'Client non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: client
    });

  } catch (error) {
    console.error('Erreur récupération client:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)) {
      return NextResponse.json(
        { success: false, error: 'Accès non autorisé' },
        { status: 403 }
      );
    }

    const { id } = params;
    const body = await request.json();

    // Actions spéciales (changement de statut, activation/désactivation, etc.)
    if (body.action) {
      switch (body.action) {
        case 'activate':
          // Logique d'activation
          return NextResponse.json({
            success: true,
            message: 'Client activé avec succès'
          });

        case 'suspend':
          // Logique de suspension
          return NextResponse.json({
            success: true,
            message: 'Client suspendu avec succès'
          });

        case 'convert_to_client':
          // Logique de conversion prospect -> client
          return NextResponse.json({
            success: true,
            message: 'Prospect converti en client avec succès'
          });

        case 'update_contract':
          // Logique de mise à jour du contrat
          return NextResponse.json({
            success: true,
            message: 'Contrat mis à jour avec succès'
          });

        default:
          return NextResponse.json(
            { success: false, error: 'Action non reconnue' },
            { status: 400 }
          );
      }
    }

    // Mise à jour standard
    return NextResponse.json({
      success: true,
      message: 'Client mis à jour avec succès'
    });

  } catch (error) {
    console.error('Erreur mise à jour client:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la mise à jour' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)) {
      return NextResponse.json(
        { success: false, error: 'Accès non autorisé' },
        { status: 403 }
      );
    }

    const { id } = params;

    // Logique de suppression
    // En production, implémenter la vraie logique de suppression

    return NextResponse.json({
      success: true,
      message: 'Client supprimé avec succès'
    });

  } catch (error) {
    console.error('Erreur suppression client:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la suppression' },
      { status: 500 }
    );
  }
}
