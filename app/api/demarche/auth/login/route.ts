import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'

const JWT_SECRET = process.env.JWT_SECRET || 'demarche_ga_secret_key_2025'
const JWT_EXPIRES_IN = '7d'

interface LoginRequest {
  email: string
  password: string
  userType: 'citoyen' | 'agent' | 'admin'
  organismeCode?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json()
    const { email, password, userType, organismeCode } = body

    // Validation des données
    if (!email || !password || !userType) {
      return NextResponse.json(
        { error: 'Email, mot de passe et type d\'utilisateur requis' },
        { status: 400 }
      )
    }

    // Validation spécifique pour les agents
    if (userType === 'agent' && !organismeCode) {
      return NextResponse.json(
        { error: 'Code organisme requis pour les agents' },
        { status: 400 }
      )
    }

    // Recherche de l'utilisateur
    let user
    if (userType === 'citoyen') {
      user = await prisma.user.findUnique({
        where: {
          email,
          role: 'CITOYEN'
        },
        include: {
          primaryOrganization: true
        }
      })
    } else {
      // Pour agents et admins, vérifier l'organisme
      const organization = await prisma.organization.findUnique({
        where: { code: organismeCode }
      })

      if (!organization) {
        return NextResponse.json(
          { error: 'Organisme non trouvé' },
          { status: 404 }
        )
      }

              const targetRole = userType === 'agent' ? 'AGENT' : 'ADMIN'

      user = await prisma.user.findFirst({
        where: {
          email,
          role: targetRole,
          primaryOrganizationId: organization.id
        },
        include: {
          primaryOrganization: true
        }
      })
    }

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé ou type de compte incorrect' },
        { status: 404 }
      )
    }

    // Vérification du mot de passe
    if (!user.password) {
      return NextResponse.json(
        { error: 'Compte non configuré pour la connexion par mot de passe' },
        { status: 400 }
      )
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Mot de passe incorrect' },
        { status: 401 }
      )
    }

    // Vérification que le compte est actif
    if (!user.isActive) {
      return NextResponse.json(
        { error: 'Compte désactivé' },
        { status: 403 }
      )
    }

    // Mise à jour de la dernière connexion
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    })

    // Génération du token JWT
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      organismeId: user.primaryOrganizationId,
      organismeCode: user.primaryOrganization?.code
    }

    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })

    // Réponse avec les données utilisateur (sans le mot de passe)
    const response = {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        organisme: user.primaryOrganization ? {
          id: user.primaryOrganization.id,
          name: user.primaryOrganization.name,
          code: user.primaryOrganization.code,
          type: user.primaryOrganization.type
        } : null,
        isVerified: user.isVerified,
        lastLoginAt: user.lastLoginAt
      },
      token
    }

    // Création de la réponse avec cookie sécurisé
    const nextResponse = NextResponse.json(response)

    // Configuration du cookie JWT
    nextResponse.cookies.set('demarche_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 7 jours en secondes
    })

    return nextResponse

  } catch (error) {
    console.error('Erreur lors de la connexion:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

// Route pour vérifier le statut de connexion
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('demarche_token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Token non fourni' },
        { status: 401 }
      )
    }

    // Vérification du token
    const decoded = jwt.verify(token, JWT_SECRET) as any

    // Récupération des informations utilisateur actuelles
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        primaryOrganization: true
      }
    })

    if (!user || !user.isActive) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé ou inactif' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        organisme: user.primaryOrganization ? {
          id: user.primaryOrganization.id,
          name: user.primaryOrganization.name,
          code: user.primaryOrganization.code,
          type: user.primaryOrganization.type
        } : null,
        isVerified: user.isVerified,
        lastLoginAt: user.lastLoginAt
      }
    })

  } catch (error) {
    console.error('Erreur lors de la vérification du token:', error)
    return NextResponse.json(
      { error: 'Token invalide' },
      { status: 401 }
    )
  }
}
