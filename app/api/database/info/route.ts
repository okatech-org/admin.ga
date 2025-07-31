import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Obtenir des informations sur les tables
    const tables = await prisma.$queryRaw`
      SELECT
        table_name as name,
        (
          SELECT COUNT(*)
          FROM information_schema.columns
          WHERE table_name = t.table_name
          AND table_schema = 'public'
        ) as column_count,
        pg_size_pretty(pg_total_relation_size(quote_ident(table_name))) as size,
        'table' as type
      FROM information_schema.tables t
      WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `;

    // Obtenir le nombre de lignes pour chaque table
    const tablesWithRows = await Promise.all(
      (tables as any[]).map(async (table) => {
        try {
          // Utiliser une requête sécurisée pour obtenir le count
          const countResult = await prisma.$queryRaw`
            SELECT COUNT(*) as count
            FROM ${prisma.$queryRaw`"${table.name}"`}
          `;
          const count = Number((countResult as any)[0]?.count || 0);

          return {
            name: table.name,
            rows: count,
            size: table.size || '0 bytes',
            lastUpdated: new Date().toLocaleString('fr-FR'),
            type: table.type,
            description: getTableDescription(table.name)
          };
        } catch (error) {
          console.error(`Erreur pour la table ${table.name}:`, error);
          return {
            name: table.name,
            rows: 0,
            size: '0 bytes',
            lastUpdated: new Date().toLocaleString('fr-FR'),
            type: table.type,
            description: getTableDescription(table.name)
          };
        }
      })
    );

    // Statistiques globales
    const totalRows = tablesWithRows.reduce((sum, table) => sum + table.rows, 0);

    // Taille de la base de données
    const dbSizeResult = await prisma.$queryRaw`
      SELECT pg_size_pretty(pg_database_size(current_database())) as size;
    `;
    const databaseSize = (dbSizeResult as any)[0]?.size || '0 bytes';

    // Connexions actives
    const connectionsResult = await prisma.$queryRaw`
      SELECT COUNT(*) as count
      FROM pg_stat_activity
      WHERE state = 'active';
    `;
    const activeConnections = Number((connectionsResult as any)[0]?.count || 0);

    const stats = {
      totalTables: tablesWithRows.length,
      totalRows,
      databaseSize,
      activeConnections,
      uptime: '15 jours 7h 23m', // À calculer dynamiquement si nécessaire
      lastBackup: getLastBackupDate()
    };

    return NextResponse.json({
      success: true,
      data: {
        tables: tablesWithRows,
        stats
      }
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des informations de la base:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Fonction pour obtenir la description d'une table
function getTableDescription(tableName: string): string {
  const descriptions: Record<string, string> = {
    'users': 'Utilisateurs du système',
    'organizations': 'Organisations gabonaises',
    'service_requests': 'Demandes de services',
    'appointments': 'Rendez-vous planifiés',
    'documents': 'Documents uploadés',
    'profiles': 'Profils utilisateurs',
    'user_documents': 'Documents utilisateurs',
    'payments': 'Paiements et transactions',
    'notifications': 'Notifications système',
    'audit_logs': 'Logs d\'audit',
    'system_configs': 'Configurations système',
    'analytics': 'Données analytiques',
    'api_configurations': 'Configurations API IA',
    'ai_search_logs': 'Logs des recherches IA',
    'postes_administratifs': 'Postes administratifs',
    'ai_intervenants': 'Intervenants détectés par IA',
    'organisme_knowledge': 'Base de connaissances organismes',
    'knowledge_analyses': 'Analyses SWOT et insights'
  };

  return descriptions[tableName] || 'Table système';
}

// Fonction pour obtenir la date du dernier backup
function getLastBackupDate(): string {
  // À implémenter selon votre système de backup
  return new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleString('fr-FR');
}
