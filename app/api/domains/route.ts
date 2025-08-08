/* @ts-nocheck */
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { domainManager, type DomainConfig, type DomainInput } from '@/lib/domain-config';
import { prisma } from '@/lib/prisma';

// GET - Récupérer tous les domaines ou un domaine spécifique
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const domain = searchParams.get('domain');
    const organizationId = searchParams.get('organizationId');

    if (domain) {
      const domainConfig = domainManager.getDomainConfig(domain);
      if (!domainConfig) {
        return NextResponse.json(
          { error: 'Domaine non trouvé' },
          { status: 404 }
        );
      }
      return NextResponse.json(domainConfig);
    }

    let domains = domainManager.getAllDomains();

    if (organizationId) {
      domains = domains.filter(d => d.organizationId === organizationId);
    }

    return NextResponse.json({
      domains,
      total: domains.length,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des domaines:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// POST - Créer un nouveau domaine
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      );
    }

    const data: DomainInput = await request.json();

    // Validation des données
    const validation = domainManager.validateDomainConfig(data);
    if (!validation.valid) {
      return NextResponse.json(
        { error: 'Données invalides', details: validation.errors },
        { status: 400 }
      );
    }

    // Vérifier si le domaine existe déjà
    const fullDomain = data.subdomain ? `${data.subdomain}.${data.domain}` : data.domain;
    if (domainManager.isDomainTaken(fullDomain)) {
      return NextResponse.json(
        { error: 'Ce domaine est déjà utilisé' },
        { status: 409 }
      );
    }

    // Vérifier que l'organisation existe si spécifiée
    if (data.organizationId) {
      const organization = await prisma.organization.findUnique({
        where: { id: data.organizationId },
      });

      if (!organization) {
        return NextResponse.json(
          { error: 'Organisation non trouvée' },
          { status: 404 }
        );
      }
    }

    // Créer la configuration du domaine
    const newDomainConfig: DomainConfig = {
      id: `domain-${Date.now()}`,
      domain: fullDomain,
      subdomain: data.subdomain,
      organizationId: data.organizationId,
      organizationName: data.organizationId ? await getOrganizationName(data.organizationId) : undefined,
      isActive: data.isActive,
      isMainDomain: data.isMainDomain,
      ssl: {
        enabled: data.ssl?.enabled ?? true,
        certificate: data.ssl?.certificate,
        validUntil: data.ssl?.validUntil,
      },
      redirects: data.redirects || [],
      customization: data.customization,
      features: data.features,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Ajouter le domaine au gestionnaire
    domainManager.setDomainConfig(fullDomain, newDomainConfig);

    return NextResponse.json(newDomainConfig, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création du domaine:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour un domaine existant
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const domain = searchParams.get('domain');

    if (!domain) {
      return NextResponse.json(
        { error: 'Domaine requis' },
        { status: 400 }
      );
    }

    const existingConfig = domainManager.getDomainConfig(domain);
    if (!existingConfig) {
      return NextResponse.json(
        { error: 'Domaine non trouvé' },
        { status: 404 }
      );
    }

    const updateData = await request.json();

    // Validation partielle des données
    const updatedConfig: DomainConfig = {
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

// DELETE - Supprimer un domaine
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const domain = searchParams.get('domain');

    if (!domain) {
      return NextResponse.json(
        { error: 'Domaine requis' },
        { status: 400 }
      );
    }

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
      return NextResponse.json({ message: 'Domaine supprimé avec succès' });
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

// Fonction utilitaire pour obtenir le nom de l'organisation
async function getOrganizationName(organizationId: string): Promise<string | undefined> {
  try {
    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
      select: { name: true },
    });
    return organization?.name;
  } catch (error) {
    console.error('Erreur lors de la récupération du nom de l\'organisation:', error);
    return undefined;
  }
}
