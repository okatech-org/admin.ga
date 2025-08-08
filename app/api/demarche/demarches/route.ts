import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'
// import { DemarcheStatus } from '@prisma/client' // DemarcheStatus enum doesn't exist in current schema

const JWT_SECRET = process.env.JWT_SECRET || 'demarche_ga_secret_key_2025'

interface CreateDemarcheRequest {
  serviceId: string
  donneesFormulaire: any
}

// Fonction pour vérifier le token JWT
async function verifyToken(request: NextRequest) {
  const token = request.cookies.get('demarche_token')?.value

  if (!token) {
    throw new Error('Token non fourni')
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { primaryOrganization: true }
    })

    if (!user || !user.isActive) {
      throw new Error('Utilisateur non trouvé ou inactif')
    }

    return user
  } catch (error) {
    throw new Error('Token invalide')
  }
}

// Fonction pour générer un numéro de démarche unique
async function generateDemarcheNumber(): Promise<string> {
  const year = new Date().getFullYear()
  const prefix = `DEM-${year}-`

  // Trouver le dernier numéro pour cette année
  const lastDemarche = await prisma.demarche.findFirst({
    where: {
      numero: {
        startsWith: prefix
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  let nextNumber = 1
  if (lastDemarche) {
    const lastNumberStr = lastDemarche.numero.replace(prefix, '')
    const lastNumber = parseInt(lastNumberStr, 10)
    nextNumber = lastNumber + 1
  }

  // Format avec des zéros à gauche (6 chiffres)
  const paddedNumber = nextNumber.toString().padStart(6, '0')
  return `${prefix}${paddedNumber}`
}

// POST - Créer une nouvelle démarche
export async function POST(request: NextRequest) {
  try {
    // Vérification de l'authentification
    const user = await verifyToken(request)

    if (user.role !== 'CITOYEN') {
      return NextResponse.json(
        { error: 'Seuls les citoyens peuvent créer des démarches' },
        { status: 403 }
      )
    }

    const body: CreateDemarcheRequest = await request.json()
    const { serviceId, donneesFormulaire } = body

    if (!serviceId || !donneesFormulaire) {
      return NextResponse.json(
        { error: 'Service et données du formulaire requis' },
        { status: 400 }
      )
    }

    // Vérification que le service existe et est actif
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      include: { organisme: true }
    })

    if (!service) {
      return NextResponse.json(
        { error: 'Service non trouvé' },
        { status: 404 }
      )
    }

    if (!service.isActive) {
      return NextResponse.json(
        { error: 'Ce service n\'est pas disponible actuellement' },
        { status: 400 }
      )
    }

    // Génération du numéro de démarche
    const numero = await generateDemarcheNumber()

    // Calcul de la date d'expiration
    const dateExpiration = new Date()
    dateExpiration.setDate(dateExpiration.getDate() + (service.dureeEstimee || 30) * 2) // Double du délai estimé

    // Création de la démarche
    const nouvelleDemarche = await prisma.demarche.create({
      data: {
        numero,
        status: 'BROUILLON',
        citoyenId: user.id,
        serviceId: service.id,
        organismeId: service.organismeId,
        donneesFormulaire,
        dateExpiration
      },
      include: {
        service: {
          include: { organisme: true }
        },
        citoyen: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    })

    // Création d'un historique initial
    await prisma.historique.create({
      data: {
        demarcheId: nouvelleDemarche.id,
        action: 'CREATION',
        details: 'Démarche créée par le citoyen',
        acteurId: user.id
      }
    })

    // Log pour audit
    console.log(`Nouvelle démarche créée: ${numero} par ${user.email}`)

    return NextResponse.json({
      success: true,
      demarche: {
        id: nouvelleDemarche.id,
        numero: nouvelleDemarche.numero,
        status: nouvelleDemarche.status,
        service: {
          nom: nouvelleDemarche.service.nom,
          organisme: nouvelleDemarche.service.organisme.name
        },
        dateCreation: nouvelleDemarche.createdAt,
        dateExpiration: nouvelleDemarche.dateExpiration
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Erreur lors de la création de démarche:', error)

    if (error instanceof Error && error.message.includes('Token')) {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

// GET - Récupérer les démarches
export async function GET(request: NextRequest) {
  try {
    // Vérification de l'authentification
    const user = await verifyToken(request)

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = (page - 1) * limit

    let whereClause: any = {}

    // Filtrage selon le rôle
    if (user.role === 'CITOYEN') {
      whereClause.citoyenId = user.id
    } else if (user.role === 'AGENT' && user.primaryOrganizationId) {
      whereClause.organismeId = user.primaryOrganizationId
    } else if (user.role === 'ADMIN' && user.primaryOrganizationId) {
      whereClause.organismeId = user.primaryOrganizationId
    } else if (user.role === 'SUPER_ADMIN') {
      // Super admin peut voir toutes les démarches
    } else {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      )
    }

    // Filtrage par statut si spécifié
    const validStatuses = ['BROUILLON', 'SOUMISE', 'EN_TRAITEMENT', 'EN_ATTENTE_INFO', 'VALIDEE', 'COMPLETEE', 'REJETEE'];
    if (status && validStatuses.includes(status)) {
      whereClause.status = status
    }

    // Récupération des démarches avec pagination
    const [demarches, total] = await Promise.all([
      prisma.demarche.findMany({
        where: whereClause,
        include: {
          service: {
            include: { organisme: true }
          },
          citoyen: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true
            }
          },
          agentTraitant: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          },
          documents: {
            select: {
              id: true,
              nom: true,
              type: true,
              createdAt: true
            }
          },
          messages: {
            select: {
              id: true,
              contenu: true,
              createdAt: true,
              expediteur: {
                select: {
                  firstName: true,
                  lastName: true,
                  userRole: true
                }
              }
            },
            orderBy: { createdAt: 'desc' },
            take: 3
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit
      }),
      prisma.demarche.count({ where: whereClause })
    ])

    // Calcul de progression pour chaque démarche
    const demarchesAvecProgression = demarches.map(demarche => {
      let progression = 0
      switch (demarche.status) {
        case 'BROUILLON':
          progression = 10
          break
        case 'SOUMISE':
          progression = 25
          break
        case 'EN_TRAITEMENT':
          progression = 50
          break
        case 'EN_ATTENTE_INFO':
          progression = 40
          break
        case 'VALIDEE':
          progression = 90
          break
        case 'COMPLETEE':
          progression = 100
          break
        case 'REJETEE':
          progression = 0
          break
      }

      return {
        ...demarche,
        progression,
        delaiRestant: demarche.dateExpiration ?
          Math.max(0, Math.ceil((new Date(demarche.dateExpiration).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))) :
          null
      }
    })

    return NextResponse.json({
      success: true,
      demarches: demarchesAvecProgression,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Erreur lors de la récupération des démarches:', error)

    if (error instanceof Error && error.message.includes('Token')) {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
