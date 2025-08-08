import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs/promises';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { format, tables, includeData = true } = await request.json();

    if (!format || !['sql', 'csv', 'json'].includes(format)) {
      return NextResponse.json(
        { success: false, error: 'Format non supporté. Utilisez: sql, csv, json' },
        { status: 400 }
      );
    }

    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const exportDir = path.join(process.cwd(), 'exports');

    // Créer le répertoire d'export
    try {
      await fs.mkdir(exportDir, { recursive: true });
    } catch (error) {
      console.error('Erreur création répertoire export:', error);
    }

    let exportContent = '';
    let fileName = '';
    let mimeType = '';

    switch (format) {
      case 'sql':
        const result = await generateSQLExport(tables, includeData);
        exportContent = result.content;
        fileName = `administration_ga_export_${timestamp}.sql`;
        mimeType = 'application/sql';
        break;

      case 'csv':
        const csvResult = await generateCSVExport(tables);
        exportContent = csvResult.content;
        fileName = `administration_ga_export_${timestamp}.csv`;
        mimeType = 'text/csv';
        break;

      case 'json':
        const jsonResult = await generateJSONExport(tables);
        exportContent = jsonResult.content;
        fileName = `administration_ga_export_${timestamp}.json`;
        mimeType = 'application/json';
        break;
    }

    const filePath = path.join(exportDir, fileName);
    await fs.writeFile(filePath, exportContent);

    return NextResponse.json({
      success: true,
      data: {
        fileName,
        filePath,
        size: `${Math.round(exportContent.length / 1024)} KB`,
        format,
        timestamp: new Date().toISOString(),
        downloadUrl: `/api/database/download/${fileName}`
      }
    });

  } catch (error) {
    console.error('Erreur lors de l\'export:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de l\'export' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Génération d'export SQL
async function generateSQLExport(tables?: string[], includeData = true) {
  let content = `-- Export SQL Administration.GA
-- Date: ${new Date().toISOString()}
-- Type: ${includeData ? 'Structure + Données' : 'Structure seulement'}

SET CLIENT_ENCODING TO 'UTF8';
SET STANDARD_CONFORMING_STRINGS TO ON;

`;

  const targetTables = tables || ['users', 'organizations', 'service_requests'];

  for (const tableName of targetTables) {
    try {
      // Structure de la table
      content += `\n-- Structure de la table ${tableName}\n`;

      if (includeData) {
        // Exporter les données (limitées pour éviter des fichiers trop volumineux)
        const data = await getTableData(tableName, 1000);

        if (data.length > 0) {
          content += `\n-- Données de la table ${tableName}\n`;

          for (const row of data) {
            const columns = Object.keys(row);
            const values = Object.values(row).map(val => {
              if (val === null) return 'NULL';
              if (typeof val === 'string') return `'${val.replace(/'/g, "''")}'`;
              if (typeof val === 'boolean') return val ? 'true' : 'false';
              if (val instanceof Date) return `'${val.toISOString()}'`;
              return String(val);
            });

            content += `INSERT INTO "${tableName}" (${columns.map(c => `"${c}"`).join(', ')}) VALUES (${values.join(', ')});\n`;
          }
        }
      }

    } catch (error) {
      content += `-- Erreur lors de l'export de ${tableName}: ${error}\n`;
    }
  }

  content += '\n-- Fin de l\'export\n';

  return { content };
}

// Génération d'export CSV
async function generateCSVExport(tables?: string[]) {
  let content = '';
  const targetTables = tables || ['users', 'organizations'];

  for (const tableName of targetTables) {
    try {
      const data = await getTableData(tableName, 1000);

      if (data.length > 0) {
        content += `\n--- Table: ${tableName} ---\n`;

        // En-têtes
        const headers = Object.keys(data[0]);
        content += headers.join(',') + '\n';

        // Données
        for (const row of data) {
          const values = headers.map(header => {
            const value = row[header];
            if (value === null || value === undefined) return '';
            if (typeof value === 'string') return `"${value.replace(/"/g, '""')}"`;
            return String(value);
          });
          content += values.join(',') + '\n';
        }
      }
    } catch (error) {
      content += `Erreur export ${tableName}: ${error}\n`;
    }
  }

  return { content };
}

// Génération d'export JSON
async function generateJSONExport(tables?: string[]) {
  const exportData: any = {
    metadata: {
      exportDate: new Date().toISOString(),
      version: '1.0',
      source: 'Administration.GA'
    },
    tables: {}
  };

  const targetTables = tables || ['users', 'organizations', 'api_configurations'];

  for (const tableName of targetTables) {
    try {
      const data = await getTableData(tableName, 500);
      exportData.tables[tableName] = {
        count: data.length,
        data: data
      };
    } catch (error) {
      exportData.tables[tableName] = {
        error: `Erreur: ${error}`,
        count: 0,
        data: []
      };
    }
  }

  return { content: JSON.stringify(exportData, null, 2) };
}

// Fonction utilitaire pour récupérer les données d'une table
async function getTableData(tableName: string, limit = 1000) {
  switch (tableName) {
    case 'users':
      return await prisma.user.findMany({
        take: limit,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true,
          createdAt: true
        }
      });

    case 'organizations':
      return await prisma.organization.findMany({
        take: limit,
        select: {
          id: true,
          name: true,
          code: true,
          type: true,
          isActive: true,
          city: true,
          createdAt: true
        }
      });

    case 'service_requests':
      // Table service_requests n'existe pas dans le schéma Prisma actuel
      return [];

    // Pour les nouvelles tables, utiliser des requêtes raw
    case 'api_configurations':
    case 'ai_search_logs':
    case 'organisme_knowledge':
    case 'ai_intervenants':
    case 'postes_administratifs':
      try {
        const result = await prisma.$queryRaw`
          SELECT * FROM ${prisma.$queryRaw`"${tableName}"`}
          LIMIT ${limit}
        `;
        return result as any[];
      } catch (error) {
        console.error(`Erreur requête table ${tableName}:`, error);
        return [];
      }

    default:
      return [];
  }
}
