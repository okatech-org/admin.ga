import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// POST - Réinitialiser le mot de passe d'un utilisateur
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Vérifier que l'utilisateur existe
    const existingUser = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        userRole: true
      }
    })

    if (!existingUser) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }

    // Générer un nouveau mot de passe temporaire
    const newPassword = generateTemporaryPassword()
    const hashedPassword = await bcrypt.hash(newPassword, 12)

    // Mettre à jour le mot de passe
    await prisma.user.update({
      where: { id },
      data: {
        password: hashedPassword,
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Mot de passe réinitialisé avec succès',
      newPassword,
      user: {
        id: existingUser.id,
        email: existingUser.email,
        name: `${existingUser.firstName} ${existingUser.lastName}`
      }
    })

  } catch (error) {
    console.error('Erreur lors de la réinitialisation du mot de passe:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

// Fonction pour générer un mot de passe temporaire sécurisé
function generateTemporaryPassword(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789'
  const specialChars = '!@#$%'
  let password = ''

  // Au moins une majuscule
  password += chars.charAt(Math.floor(Math.random() * 25))

  // Au moins une minuscule
  password += chars.charAt(Math.floor(Math.random() * 25) + 25)

  // Au moins un chiffre
  password += chars.charAt(Math.floor(Math.random() * 10) + 50)

  // Au moins un caractère spécial
  password += specialChars.charAt(Math.floor(Math.random() * specialChars.length))

  // Compléter avec des caractères aléatoires pour atteindre 12 caractères
  for (let i = password.length; i < 12; i++) {
    const allChars = chars + specialChars
    password += allChars.charAt(Math.floor(Math.random() * allChars.length))
  }

  // Mélanger le mot de passe pour éviter les patterns prévisibles
  return password.split('').sort(() => Math.random() - 0.5).join('')
}
