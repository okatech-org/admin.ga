import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { action, data, dataType, organizationId } = body;

    switch (action) {
      case 'validateAndSave':
        return await validateAndSaveAIData(data, dataType, organizationId, session.user.id);

      case 'checkDuplicates':
        return await checkDuplicates(data, dataType);

      case 'validateData':
        return await validateAIData(data, dataType);

      default:
        return NextResponse.json(
          { error: 'Action non reconnue' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Erreur dans la validation IA:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la validation des données IA' },
      { status: 500 }
    );
  }
}

// Validation et sauvegarde des données IA
async function validateAndSaveAIData(aiData: any[], dataType: string, organizationId: string, validatedById: string) {
  try {
    const results = {
      created: 0,
      updated: 0,
      errors: [] as string[],
      details: [] as any[]
    };

    await prisma.$transaction(async (tx) => {
      for (const item of aiData) {
        try {
          switch (dataType) {
            case 'users':
              await processUserData(tx, item, organizationId, validatedById, results);
              break;

            case 'organizations':
              await processOrganizationData(tx, item, validatedById, results);
              break;

            case 'services':
              await processServiceData(tx, item, organizationId, validatedById, results);
              break;

            case 'postes':
              await processPosteData(tx, item, validatedById, results);
              break;

            default:
              results.errors.push(`Type de données non supporté: ${dataType}`);
          }
        } catch (error) {
          results.errors.push(`Erreur pour ${item.nom}: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
        }
      }
    });

    // TODO: Enregistrer l'activité de validation IA quand le modèle auditLog sera ajouté au schéma Prisma
    // await prisma.auditLog.create({
    //   data: {
    //     userId: validatedById,
    //     action: 'AI_DATA_VALIDATION',
    //     resource: dataType,
    //     resourceId: organizationId,
    //     newValues: {
    //       dataType,
    //       itemsProcessed: aiData.length,
    //       itemsCreated: results.created,
    //       itemsUpdated: results.updated,
    //       errors: results.errors
    //     }
    //   }
    // });

    return NextResponse.json({
      success: true,
      message: `Données sauvegardées avec succès`,
      stats: {
        created: results.created,
        updated: results.updated,
        errors: results.errors.length
      },
      details: results.details,
      errors: results.errors
    });

  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error);
    return NextResponse.json({
      success: false,
      message: 'Erreur lors de la sauvegarde des données',
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
}

// Traitement des données utilisateur
async function processUserData(tx: any, userData: any, organizationId: string, validatedById: string, results: any) {
  // Vérifier si l'utilisateur existe déjà
  const existingUser = await tx.user.findFirst({
    where: {
      OR: [
        { email: userData.email },
        {
          AND: [
            { firstName: userData.prenom || userData.nom.split(' ')[0] },
            { lastName: userData.nom.split(' ').slice(1).join(' ') || userData.nom }
          ]
        }
      ]
    }
  });

  if (existingUser) {
    // Mettre à jour l'utilisateur existant si nécessaire
    if (!existingUser.phone && userData.telephone) {
      await tx.user.update({
        where: { id: existingUser.id },
        data: {
          phone: userData.telephone,
          updatedAt: new Date()
        }
      });
      results.updated++;
      results.details.push({
        type: 'user_updated',
        id: existingUser.id,
        changes: ['phone']
      });
    }
  } else {
    // Créer un nouvel utilisateur
    const hashedPassword = await bcrypt.hash('TempPassword123!', 12);

    const newUser = await tx.user.create({
      data: {
        email: userData.email,
        firstName: userData.prenom || userData.nom.split(' ')[0] || userData.nom,
        lastName: userData.nom.split(' ').slice(1).join(' ') || '',
        phone: userData.telephone,
        password: hashedPassword,
        role: 'AGENT',
        organizationId: organizationId,
        isActive: true,
        isVerified: false,
        aiGenerated: true,
        aiMetadata: {
          source: userData.source,
          confidence: userData.confidence,
          originalData: userData,
          validatedBy: validatedById,
          validatedAt: new Date().toISOString()
        }
      }
    });

    // Créer l'enregistrement AIIntervenant pour traçabilité
    await tx.aIIntervenant.create({
      data: {
        nom: userData.nom,
        prenom: userData.prenom || userData.nom.split(' ')[0],
        poste: userData.poste || 'Poste non spécifié',
        email: userData.email,
        telephone: userData.telephone,
        confidence: userData.confidence,
        source: userData.source,
        organizationId: organizationId,
        userId: newUser.id,
        metadata: userData.metadata || {},
        isValidated: true,
        validatedBy: validatedById
      }
    });

    results.created++;
    results.details.push({
      type: 'user_created',
      id: newUser.id,
      email: newUser.email
    });
  }
}

// Traitement des données d'organisation
async function processOrganizationData(tx: any, orgData: any, validatedById: string, results: any) {
  // Vérifier si l'organisation existe déjà
  const existingOrg = await tx.organization.findFirst({
    where: {
      OR: [
        { name: orgData.nom },
        { code: orgData.code }
      ]
    }
  });

  if (existingOrg) {
    // Mettre à jour si nécessaire
    const updates: any = {};
    let hasUpdates = false;

    if (!existingOrg.description && orgData.description) {
      updates.description = orgData.description;
      hasUpdates = true;
    }

    if (hasUpdates) {
      await tx.organization.update({
        where: { id: existingOrg.id },
        data: { ...updates, updatedAt: new Date() }
      });
      results.updated++;
    }
  } else {
    // Créer une nouvelle organisation
    const newOrg = await tx.organization.create({
      data: {
        name: orgData.nom,
        code: orgData.code || orgData.nom.substring(0, 10).toUpperCase(),
        type: orgData.type || 'AUTRE',
        description: orgData.description,
        isActive: true,
        aiGenerated: true,
        aiMetadata: {
          source: orgData.source,
          confidence: orgData.confidence,
          originalData: orgData,
          validatedBy: validatedById,
          validatedAt: new Date().toISOString()
        }
      }
    });

    results.created++;
    results.details.push({
      type: 'organization_created',
      id: newOrg.id,
      name: newOrg.name
    });
  }
}

// Traitement des données de service
async function processServiceData(tx: any, serviceData: any, organizationId: string, validatedById: string, results: any) {
  // Logique pour les services (à adapter selon vos besoins)
  results.created++;
  results.details.push({
    type: 'service_processed',
    name: serviceData.nom
  });
}

// Traitement des données de poste
async function processPosteData(tx: any, posteData: any, validatedById: string, results: any) {
  // Vérifier si le poste existe déjà
  const existingPoste = await tx.administrativePost.findFirst({
    where: {
      OR: [
        { title: posteData.nom },
        { code: posteData.code }
      ]
    }
  });

  if (!existingPoste) {
    // Créer un nouveau poste
    const newPoste = await tx.administrativePost.create({
      data: {
        title: posteData.nom,
        code: posteData.code || posteData.nom.substring(0, 6).toUpperCase(),
        description: posteData.description || `Poste créé automatiquement par l'IA`,
        level: posteData.level || 'AUTRE',
        isActive: true,
        isAIDetected: true,
        aiMetadata: {
          source: posteData.source,
          confidence: posteData.confidence,
          originalData: posteData,
          validatedBy: validatedById,
          validatedAt: new Date().toISOString()
        }
      }
    });

    results.created++;
    results.details.push({
      type: 'poste_created',
      id: newPoste.id,
      title: newPoste.title
    });
  }
}

// Vérification des doublons
async function checkDuplicates(data: any[], dataType: string) {
  try {
    const duplicates = [];

    for (const item of data) {
      let existingItems = [];

      switch (dataType) {
        case 'users':
          // TODO: Réactiver quand le modèle User sera ajouté au schéma Prisma
          // existingItems = await prisma.user.findMany({
          //   where: {
          //     OR: [
          //       { email: item.email },
          //       {
          //         AND: [
          //           { firstName: { contains: item.prenom || item.nom.split(' ')[0], mode: 'insensitive' } },
          //           { lastName: { contains: item.nom.split(' ').slice(1).join(' ') || item.nom, mode: 'insensitive' } }
          //         ]
          //       }
          //     ]
          //   },
          //   select: { id: true, firstName: true, lastName: true, email: true }
          // });
          existingItems = []; // Temporaire jusqu'à ce que le modèle User soit disponible
          break;

        case 'organizations':
          existingItems = await prisma.organization.findMany({
            where: {
              OR: [
                { name: { contains: item.nom, mode: 'insensitive' } },
                { code: item.code }
              ]
            },
            select: { id: true, name: true, code: true }
          });
          break;
      }

      if (existingItems.length > 0) {
        duplicates.push({
          aiItem: item,
          existingItems: existingItems
        });
      }
    }

    return NextResponse.json({
      success: true,
      duplicates
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Erreur lors de la vérification des doublons',
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
}

// Validation des données IA
async function validateAIData(data: any[], dataType: string) {
  try {
    const validationResults = data.map(item => {
      const errors = [];
      const warnings = [];

      // Validation commune
      if (!item.nom || item.nom.trim() === '') {
        errors.push('Nom requis');
      }

      // Validation spécifique par type
      switch (dataType) {
        case 'users':
          if (!item.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(item.email)) {
            errors.push('Email invalide ou manquant');
          }
          if (item.telephone && !/^\+241/.test(item.telephone)) {
            warnings.push('Format de téléphone non standard');
          }
          if (item.confidence < 0.6) {
            warnings.push('Confiance IA faible');
          }
          break;

        case 'organizations':
          if (!item.type) {
            warnings.push('Type d\'organisation non spécifié');
          }
          break;
      }

      return {
        id: item.id,
        isValid: errors.length === 0,
        errors,
        warnings,
        score: Math.max(0, (item.confidence || 0.5) * 100 - errors.length * 20 - warnings.length * 10)
      };
    });

    return NextResponse.json({
      success: true,
      results: validationResults,
      summary: {
        total: data.length,
        valid: validationResults.filter(r => r.isValid).length,
        withErrors: validationResults.filter(r => r.errors.length > 0).length,
        withWarnings: validationResults.filter(r => r.warnings.length > 0).length
      }
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Erreur lors de la validation',
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
}
