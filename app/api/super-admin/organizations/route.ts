import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Récupérer tous les organismes pour la gestion des utilisateurs
export async function GET(request: NextRequest) {
  try {
    const organizations = await prisma.organization.findMany({
      select: {
        id: true,
        name: true,
        code: true,
        type: true,
        isActive: true,
        city: true,
        province: true
      },
      orderBy: [
        { isActive: 'desc' },
        { name: 'asc' }
      ]
    })

    return NextResponse.json({
      success: true,
      organizations
    })

  } catch (error) {
    console.error('Erreur lors de la récupération des organismes:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
