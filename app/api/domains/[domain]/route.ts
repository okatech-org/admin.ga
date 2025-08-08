/* @ts-nocheck */
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { domainManager } from '@/lib/domain-config';

interface RouteParams {
  params: {
    domain: string;
  };
}

// GET - Récupérer un domaine spécifique
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      );
    }

    const domain = decodeURIComponent(params.domain);
    const domainConfig = domainManager.getDomainConfig(domain);

    if (!domainConfig) {
      return NextResponse.json(
        { error: 'Domaine non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json(domainConfig);
  } catch (error) {
    console.error('Erreur lors de la récupération du domaine:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour un domaine spécifique
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      );
    }

    const domain = decodeURIComponent(params.domain);
    const existingConfig = domainManager.getDomainConfig(domain);

    if (!existingConfig) {
      return NextResponse.json(
        { error: 'Domaine non trouvé' },
        { status: 404 }
      );
    }

    const updateData = await request.json();

    // Fusionner les données existantes avec les nouvelles
    const updatedConfig = {
      ...existingConfig,
      ...updateData,
      updatedAt: new Date(),
    };

    // Mettre à jour le domaine
    domainManager.setDomainConfig(domain, updatedConfig);

    return NextResponse.json(updatedConfig);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du domaine:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un domaine spécifique
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      );
    }

    const domain = decodeURIComponent(params.domain);
    const existingConfig = domainManager.getDomainConfig(domain);

    if (!existingConfig) {
      return NextResponse.json(
        { error: 'Domaine non trouvé' },
        { status: 404 }
      );
    }

    // Empêcher la suppression du domaine principal
    if (existingConfig.isMainDomain) {
      return NextResponse.json(
        { error: 'Impossible de supprimer le domaine principal' },
        { status: 400 }
      );
    }

    // Supprimer le domaine
    const success = domainManager.removeDomainConfig(domain);

    if (success) {
      return NextResponse.json({
        message: 'Domaine supprimé avec succès',
        domain
      });
    } else {
      return NextResponse.json(
        { error: 'Erreur lors de la suppression' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Erreur lors de la suppression du domaine:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
