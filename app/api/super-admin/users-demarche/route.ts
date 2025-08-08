import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// GET - Récupérer tous les utilisateurs DEMARCHE.GA
export async function GET(request: NextRequest) {
  try {
    const users = await prisma.user.findMany({
      where: {
        userRole: {
          in: ['CITOYEN', 'AGENT', 'ADMIN', 'SUPER_ADMIN']
        }
      },
      include: {
        primaryOrganization: {
          select: {
            id: true,
            name: true,
            code: true,
            type: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      users
    })

  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

// POST - Créer un nouvel utilisateur
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      email,
      firstName,
      lastName,
      userRole,
      phone,
      ville,
      province,
      organizationId,
      isActive = true,
      isVerified = true,
      password
    } = body

    // Validation des champs obligatoires
    if (!email || !firstName || !lastName || !userRole) {
      return NextResponse.json(
        { error: 'Email, prénom, nom et rôle sont obligatoires' },
        { status: 400 }
      )
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Format d\'email invalide' },
        { status: 400 }
      )
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Un utilisateur avec cet email existe déjà' },
        { status: 409 }
      )
    }

    // Validation de l'organisme pour les agents et admins
    if ((userRole === 'AGENT' || userRole === 'ADMIN') && !organizationId) {
      return NextResponse.json(
        { error: 'Un organisme est requis pour les agents et administrateurs' },
        { status: 400 }
      )
    }

    // Vérifier que l'organisme existe
    if (organizationId) {
      const organization = await prisma.organization.findUnique({
        where: { id: organizationId }
      })

      if (!organization) {
        return NextResponse.json(
          { error: 'Organisme non trouvé' },
          { status: 404 }
        )
      }
    }

    // Générer le mot de passe
    const finalPassword = password || 'Test123!'
    const hashedPassword = await bcrypt.hash(finalPassword, 12)

    // Créer l'utilisateur
    const newUser = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        password: hashedPassword,
        userRole,
        phone: phone || null,
        ville: ville || null,
        province: province || null,
        primaryOrganizationId: organizationId || null,
        isActive,
        isVerified
      },
      include: {
        primaryOrganization: {
          select: {
            id: true,
            name: true,
            code: true,
            type: true
          }
        }
      }
    })

    // Retourner la réponse sans le mot de passe
    const { password: _, ...userWithoutPassword } = newUser

    return NextResponse.json({
      success: true,
      message: 'Utilisateur créé avec succès',
      user: userWithoutPassword,
      temporaryPassword: password ? undefined : finalPassword
    }, { status: 201 })

  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
