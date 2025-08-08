import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
// import { UserRole } from '@prisma/client' // UserRole is a string in current schema

interface RegisterRequest {
  firstName: string
  lastName: string
  email: string
  password: string
  phone?: string
  dateNaissance?: string
  lieuNaissance?: string
  adresse?: string
  ville?: string
  province?: string
  acceptTerms: boolean
  acceptNewsletter?: boolean
}

export async function POST(request: NextRequest) {
  try {
    const body: RegisterRequest = await request.json()
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      dateNaissance,
      lieuNaissance,
      adresse,
      ville,
      province,
      acceptTerms,
      acceptNewsletter
    } = body

    // Validation des données obligatoires
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { error: 'Prénom, nom, email et mot de passe sont obligatoires' },
        { status: 400 }
      )
    }

    if (!acceptTerms) {
      return NextResponse.json(
        { error: 'Vous devez accepter les conditions d\'utilisation' },
        { status: 400 }
      )
    }

    // Validation du format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Format d\'email invalide' },
        { status: 400 }
      )
    }

    // Validation de la force du mot de passe
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Le mot de passe doit contenir au moins 8 caractères' },
        { status: 400 }
      )
    }

    // Vérification si l'email existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Un compte avec cet email existe déjà' },
        { status: 409 }
      )
    }

    // Validation du téléphone si fourni
    if (phone) {
      const phoneRegex = /^(\+241|241)?[0-9]{8,9}$/
      if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
        return NextResponse.json(
          { error: 'Format de téléphone invalide' },
          { status: 400 }
        )
      }
    }

    // Hachage du mot de passe
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Préparation des données de naissance
    let birthDate: Date | null = null
    if (dateNaissance) {
      birthDate = new Date(dateNaissance)
      if (isNaN(birthDate.getTime())) {
        return NextResponse.json(
          { error: 'Format de date de naissance invalide' },
          { status: 400 }
        )
      }
    }

    // Création de l'utilisateur
    const newUser = await prisma.user.create({
      data: {
        firstName: firstName.trim(),
        lastName: lastName.trim().toUpperCase(),
        email: email.toLowerCase().trim(),
        // password: hashedPassword, // TODO: Add password field to User model in schema
        phone: phone?.trim(),
        role: 'CITOYEN',
        // dateNaissance: birthDate, // TODO: Add these fields to User model in schema
        // lieuNaissance: lieuNaissance?.trim(),
        // adresse: adresse?.trim(),
        // ville: ville?.trim(),
        // province: province?.trim(),
        isActive: true,
        isVerified: false // L'utilisateur devra vérifier son email
      }
    })

    // Optionnel: Envoi d'un email de vérification
    // await sendVerificationEmail(newUser.email, newUser.id)

    // Optionnel: Inscription à la newsletter si demandée
    if (acceptNewsletter) {
      // Logique d'inscription newsletter
      console.log(`Nouvel abonné newsletter: ${email}`)
    }

    // Log de création de compte pour audit
    console.log(`Nouveau compte citoyen créé: ${email} (ID: ${newUser.id})`)

    // Réponse sans données sensibles
    return NextResponse.json(
      {
        success: true,
        message: 'Compte créé avec succès',
        user: {
          id: newUser.id,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          role: newUser.role,
          isVerified: newUser.isVerified,
          createdAt: newUser.createdAt
        }
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error)

    // Gestion des erreurs Prisma spécifiques
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint')) {
        return NextResponse.json(
          { error: 'Un compte avec cet email existe déjà' },
          { status: 409 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

// Route pour vérifier la disponibilité d'un email
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json(
        { error: 'Email requis' },
        { status: 400 }
      )
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      select: { id: true }
    })

    return NextResponse.json({
      available: !existingUser,
      message: existingUser ? 'Email déjà utilisé' : 'Email disponible'
    })

  } catch (error) {
    console.error('Erreur lors de la vérification d\'email:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
