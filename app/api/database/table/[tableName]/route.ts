import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tableName: string }> }
) {
  try {
    const { tableName } = await params;
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const offset = parseInt(url.searchParams.get('offset') || '0');

    // Vérifier que le nom de la table est sécurisé
    if (!isValidTableName(tableName)) {
      return NextResponse.json(
        { success: false, error: 'Nom de table invalide' },
        { status: 400 }
      );
    }

    // Obtenir les données selon la table
    let data: any[] = [];

    switch (tableName) {
      case 'users':
        data = await prisma.user.findMany({
          take: limit,
          skip: offset,
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            isActive: true,
            isVerified: true,
            createdAt: true,
            lastLoginAt: true
          }
        });
        break;

      case 'organizations':
        data = await prisma.organization.findMany({
          take: limit,
          skip: offset,
          select: {
            id: true,
            name: true,
            code: true,
            type: true,
            isActive: true,
            city: true,
            email: true,
            createdAt: true
          }
        });
        break;

      case 'service_requests':
        // Table service_requests n'existe pas dans le schéma Prisma actuel
        // Retourner un tableau vide pour éviter l'erreur
        data = [];
        break;

      case 'ai_search_logs':
        // Utiliser une requête raw pour cette table
        try {
          data = await prisma.$queryRaw`
            SELECT id, "organizationName", query, status, "intervenantsFound",
                   "confidenceScore", "startedAt", "completedAt"
            FROM ai_search_logs
            ORDER BY "startedAt" DESC
            LIMIT ${limit} OFFSET ${offset}
          `;
        } catch (error) {
          console.error('Erreur requête ai_search_logs:', error);
          data = [];
        }
        break;

      case 'api_configurations':
        try {
          data = await prisma.$queryRaw`
            SELECT id, name, provider, "isActive", model, temperature,
                   "maxTokens", "totalRequests", "successfulRequests",
                   "lastUsedAt", "createdAt"
            FROM api_configurations
            ORDER BY "createdAt" DESC
            LIMIT ${limit} OFFSET ${offset}
          `;
        } catch (error) {
          console.error('Erreur requête api_configurations:', error);
          data = [];
        }
        break;

      case 'organisme_knowledge':
        try {
          data = await prisma.$queryRaw`
            SELECT ok.id, ok.category, ok.importance, ok.completude,
                   ok.fiabilite, ok."aiConfidence", ok."utilisateursActifs",
                   ok."scoreNumerisation", ok."lastAIAnalysis",
                   o.name as organization_name, o.code as organization_code, o.type as organization_type
            FROM organisme_knowledge ok
            LEFT JOIN organizations o ON ok."organizationId" = o.id
            ORDER BY ok."lastAIAnalysis" DESC
            LIMIT ${limit} OFFSET ${offset}
          `;
        } catch (error) {
          console.error('Erreur requête organisme_knowledge:', error);
          data = [];
        }
        break;

      case 'ai_intervenants':
        try {
          data = await prisma.$queryRaw`
            SELECT ai.id, ai.nom, ai.prenom, ai.email, ai."posteTitre",
                   ai."confidenceScore", ai."isValidated", ai."validatedAt",
                   o.name as organization_name, o.code as organization_code
            FROM ai_intervenants ai
            LEFT JOIN organizations o ON ai."organizationId" = o.id
            ORDER BY ai."createdAt" DESC
            LIMIT ${limit} OFFSET ${offset}
          `;
        } catch (error) {
          console.error('Erreur requête ai_intervenants:', error);
          data = [];
        }
        break;

      case 'postes_administratifs':
        try {
          data = await prisma.$queryRaw`
            SELECT id, titre, code, level, "isActive", "isAIDetected",
                   "usageCount", "lastUsedAt", "createdAt"
            FROM postes_administratifs
            ORDER BY "createdAt" DESC
            LIMIT ${limit} OFFSET ${offset}
          `;
        } catch (error) {
          console.error('Erreur requête postes_administratifs:', error);
          data = [];
        }
        break;

      default:
        // Pour les autres tables, utiliser une requête raw sécurisée
        try {
          data = await prisma.$queryRaw`
            SELECT * FROM ${prisma.$queryRaw`"${tableName}"`}
            LIMIT ${limit} OFFSET ${offset}
          `;
        } catch (error) {
          console.error(`Erreur requête table ${tableName}:`, error);
          data = [];
        }
        break;
    }

    // Obtenir le nombre total d'enregistrements
    let totalCount = 0;
    try {
      const countResult = await prisma.$queryRaw`
        SELECT COUNT(*) as count FROM ${prisma.$queryRaw`"${tableName}"`}
      `;
      totalCount = Number((countResult as any)[0]?.count || 0);
    } catch (error) {
      console.error(`Erreur count table ${tableName}:`, error);
    }

    return NextResponse.json({
      success: true,
      data: {
        rows: data,
        totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount
      }
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des données de la table:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Fonction pour valider le nom de la table
function isValidTableName(tableName: string): boolean {
  // Validation du format : lettres, chiffres et underscore uniquement
  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(tableName)) {
    return false;
  }

  // Validation de la longueur (éviter les noms trop longs)
  if (tableName.length > 63) {
    return false;
  }

  // Blacklist de tables système sensibles à ne jamais exposer
  const blacklistedTables = [
    'pg_authid', 'pg_shadow', 'pg_user', 'pg_roles', 'pg_database',
    'pg_tablespace', 'pg_auth_members', 'information_schema',
    'pg_proc', 'pg_class', 'pg_namespace', 'pg_attribute',
    'pg_index', 'pg_type', 'pg_constraint', 'pg_settings',
    'pg_stat_user_tables', 'pg_stat_activity'
  ];

  // Vérifier si la table n'est pas dans la blacklist
  if (blacklistedTables.some(blacklisted => tableName.toLowerCase().includes(blacklisted.toLowerCase()))) {
    return false;
  }

  // Tables système PostgreSQL à éviter (commencent par pg_ ou contiennent 'schema')
  if (tableName.toLowerCase().startsWith('pg_') ||
      tableName.toLowerCase().includes('schema') ||
      tableName.toLowerCase().includes('information_')) {
    return false;
  }

  return true;
}
