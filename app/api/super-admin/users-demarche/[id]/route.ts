import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PUT - Mettre à jour un utilisateur
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const {
      firstName,
      lastName,
      phone,
      ville,
      province,
      isActive,
      isVerified
    } = body

    // Vérifier que l'utilisateur existe
    const existingUser = await prisma.user.findUnique({
      where: { id }
    })

    if (!existingUser) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }

    // Mettre à jour l'utilisateur
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        firstName,
        lastName,
        phone: phone || null,
        ville: ville || null,
        province: province || null,
        isActive,
        isVerified,
        updatedAt: new Date()
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
    const { password, ...userWithoutPassword } = updatedUser

    return NextResponse.json({
      success: true,
      message: 'Utilisateur mis à jour avec succès',
      user: userWithoutPassword
    })

  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'utilisateur:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

// DELETE - Supprimer un utilisateur
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Vérifier que l'utilisateur existe
    const existingUser = await prisma.user.findUnique({
      where: { id }
    })

    if (!existingUser) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }

    // Empêcher la suppression du dernier super admin
    if (existingUser.userRole === 'SUPER_ADMIN') {
      const superAdminCount = await prisma.user.count({
        where: { userRole: 'SUPER_ADMIN' }
      })

      if (superAdminCount <= 1) {
        return NextResponse.json(
          { error: 'Impossible de supprimer le dernier super administrateur' },
          { status: 400 }
        )
      }
    }

    // Supprimer l'utilisateur (les contraintes de clé étrangère devraient être gérées)
    await prisma.user.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Utilisateur supprimé avec succès'
    })

  } catch (error) {
    console.error('Erreur lors de la suppression de l\'utilisateur:', error)

    // Gestion des erreurs de contrainte de clé étrangère
    if (error.code === 'P2003') {
      return NextResponse.json(
        { error: 'Impossible de supprimer cet utilisateur car il est référencé dans d\'autres données' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
