import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { organizationRelationService } from '@/lib/services/organization-relation.service';
import {
  RelationType,
  DataShareType,
  RelationStatus,
  RelationRequest
} from '@/lib/types/organization-relations';

// Schémas de validation
const CreateRelationSchema = z.object({
  fromOrgId: z.string().min(1, 'ID organisation source requis'),
  toOrgId: z.string().min(1, 'ID organisation cible requis'),
  relationType: z.nativeEnum(RelationType),
  dataShareType: z.nativeEnum(DataShareType),
  sharedData: z.object({
    services: z.array(z.string()).optional(),
    fields: z.array(z.string()).optional(),
    customConfig: z.any().optional()
  }).optional(),
  permissions: z.record(z.boolean()).optional(),
  endDate: z.string().optional(),
  notes: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM')
});

const UpdateRelationSchema = z.object({
  relationId: z.string().min(1),
  status: z.nativeEnum(RelationStatus).optional(),
  notes: z.string().optional(),
  reason: z.string().optional(),
  sharedData: z.object({
    services: z.array(z.string()).optional(),
    fields: z.array(z.string()).optional(),
    customConfig: z.any().optional()
  }).optional(),
  permissions: z.record(z.boolean()).optional()
});

const FilterRelationsSchema = z.object({
  orgId: z.string().min(1),
  type: z.nativeEnum(RelationType).optional(),
  status: z.nativeEnum(RelationStatus).optional(),
  direction: z.enum(['incoming', 'outgoing', 'all']).optional(),
  searchQuery: z.string().optional(),
  limit: z.coerce.number().min(1).max(100).default(50),
  offset: z.coerce.number().min(0).default(0)
});

// Helper pour gérer les erreurs
function handleError(error: any, defaultMessage: string) {
  console.error('API Error:', error);

  if (error instanceof z.ZodError) {
    return NextResponse.json(
      {
        error: 'Données invalides',
        details: error.errors.map(e => `${e.path.join('.')}: ${e.message}`)
      },
      { status: 400 }
    );
  }

  if (error.message?.includes('unauthorized') || error.message?.includes('permission')) {
    return NextResponse.json(
      { error: 'Accès non autorisé' },
      { status: 403 }
    );
  }

  if (error.message?.includes('not found')) {
    return NextResponse.json(
      { error: 'Ressource non trouvée' },
      { status: 404 }
    );
  }

  if (error.message?.includes('already exists') || error.message?.includes('duplicate')) {
    return NextResponse.json(
      { error: 'Relation déjà existante' },
      { status: 409 }
    );
  }

  return NextResponse.json(
    { error: error.message || defaultMessage },
    { status: 500 }
  );
}

// Helper pour vérifier l'authentification
async function checkAuth() {
  const session = await getServerSession();

  if (!session?.user) {
    throw new Error('Non authentifié');
  }

  return {
    userId: session.user.id || session.user.email || 'unknown',
    userRole: (session.user as any).role || 'USER'
  };
}

// Helper pour vérifier les permissions
function checkPermissions(userRole: string, action: string) {
  const permissions = {
    CREATE_RELATION: ['SUPER_ADMIN', 'ADMIN', 'MANAGER'],
    UPDATE_RELATION: ['SUPER_ADMIN', 'ADMIN', 'MANAGER'],
    DELETE_RELATION: ['SUPER_ADMIN', 'ADMIN'],
    APPROVE_RELATION: ['SUPER_ADMIN', 'ADMIN', 'MANAGER'],
    VIEW_RELATIONS: ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'AGENT'],
    ACCESS_DATA: ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'AGENT']
  };

  if (!permissions[action as keyof typeof permissions]?.includes(userRole)) {
    throw new Error('Permissions insuffisantes');
  }
}

/**
 * POST - Créer une nouvelle relation
 */
export async function POST(request: NextRequest) {
  try {
    // Authentification
    const { userId, userRole } = await checkAuth();
    checkPermissions(userRole, 'CREATE_RELATION');

    // Validation des données
    const body = await request.json();
    const validatedData = CreateRelationSchema.parse(body);

    // Vérifications métier
    if (validatedData.fromOrgId === validatedData.toOrgId) {
      return NextResponse.json(
        { error: 'Une organisation ne peut pas avoir une relation avec elle-même' },
        { status: 400 }
      );
    }

    // Création de la relation
    const relation = await organizationRelationService.createRelation(
      {
        ...validatedData,
        permissions: validatedData.permissions as any // TODO: Mapper vers RelationPermissions
      } as RelationRequest,
      userId
    );

    return NextResponse.json({
      success: true,
      data: relation,
      message: 'Relation créée avec succès'
    }, { status: 201 });

  } catch (error) {
    return handleError(error, 'Erreur lors de la création de la relation');
  }
}

/**
 * GET - Récupérer les relations d'une organisation
 */
export async function GET(request: NextRequest) {
  try {
    // Authentification
    const { userId, userRole } = await checkAuth();
    checkPermissions(userRole, 'VIEW_RELATIONS');

    // Validation des paramètres
    const { searchParams } = new URL(request.url);
    const params = Object.fromEntries(searchParams.entries());
    const validatedParams = FilterRelationsSchema.parse(params);

    // Récupération des relations
    const filters: any = {};
    if (validatedParams.type) filters.type = validatedParams.type;
    if (validatedParams.status) filters.status = validatedParams.status;
    if (validatedParams.direction) filters.direction = validatedParams.direction;
    if (validatedParams.searchQuery) filters.searchQuery = validatedParams.searchQuery;

    const relations = await organizationRelationService.getOrganizationRelations(
      validatedParams.orgId,
      filters
    );

    // Pagination
    const total = relations.length;
    const paginatedRelations = relations.slice(
      validatedParams.offset,
      validatedParams.offset + validatedParams.limit
    );

    return NextResponse.json({
      success: true,
      data: paginatedRelations,
      pagination: {
        total,
        limit: validatedParams.limit,
        offset: validatedParams.offset,
        hasMore: validatedParams.offset + validatedParams.limit < total
      }
    });

  } catch (error) {
    return handleError(error, 'Erreur lors de la récupération des relations');
  }
}

/**
 * PUT - Mettre à jour une relation
 */
export async function PUT(request: NextRequest) {
  try {
    // Authentification
    const { userId, userRole } = await checkAuth();
    checkPermissions(userRole, 'UPDATE_RELATION');

    // Validation des données
    const body = await request.json();
    const validatedData = UpdateRelationSchema.parse(body);

    let updatedRelation;

    // Mise à jour selon le type d'action
    if (validatedData.status) {
      updatedRelation = await organizationRelationService.updateRelationStatus(
        validatedData.relationId,
        validatedData.status,
        validatedData.reason || 'Mise à jour via API',
        userId
      );
    } else {
      // TODO: Implémenter updateRelation dans le service
      return NextResponse.json(
        { error: 'Mise à jour générale non encore implémentée' },
        { status: 501 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedRelation,
      message: 'Relation mise à jour avec succès'
    });

  } catch (error) {
    return handleError(error, 'Erreur lors de la mise à jour de la relation');
  }
}

/**
 * DELETE - Supprimer une relation
 */
export async function DELETE(request: NextRequest) {
  try {
    // Authentification
    const { userId, userRole } = await checkAuth();
    checkPermissions(userRole, 'DELETE_RELATION');

    // Récupération de l'ID de la relation
    const { searchParams } = new URL(request.url);
    const relationId = searchParams.get('relationId');

    if (!relationId) {
      return NextResponse.json(
        { error: 'ID de relation requis' },
        { status: 400 }
      );
    }

    // TODO: Implémenter deleteRelation dans le service
    // Pour l'instant, utiliser updateRelationStatus avec REVOKED
    await organizationRelationService.updateRelationStatus(
      relationId,
      RelationStatus.REVOKED,
      'Relation supprimée via API',
      userId
    );

    return NextResponse.json({
      success: true,
      message: 'Relation supprimée avec succès'
    });

  } catch (error) {
    return handleError(error, 'Erreur lors de la suppression de la relation');
  }
}
