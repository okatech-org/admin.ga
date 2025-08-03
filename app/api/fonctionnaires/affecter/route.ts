import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)) {
      return NextResponse.json(
        { success: false, error: 'Accès non autorisé' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      fonctionnaireId,
      organismeDestination,
      service,
      poste,
      typeAffectation,
      dateDebut,
      pourcentageTemps,
      motif,
      observations,
      responsableAffectation
    } = body;

    // Validation des données
    if (!fonctionnaireId || !organismeDestination || !service || !poste) {
      return NextResponse.json(
        { success: false, error: 'Données manquantes pour l\'affectation' },
        { status: 400 }
      );
    }

    // Simuler le processus d'affectation
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Créer l'objet d'affectation
    const affectation = {
      id: `affectation_${Date.now()}`,
      fonctionnaireId,
      organismeDestination,
      service,
      poste,
      typeAffectation,
      dateDebut: new Date(dateDebut),
      pourcentageTemps: pourcentageTemps || 100,
      motif,
      observations,
      responsableAffectation,
      dateCreation: new Date(),
      statut: 'VALIDEE'
    };

    // Log pour audit
    console.log('✅ Affectation créée:', {
      affectation,
      responsable: session.user.email,
      timestamp: new Date().toISOString()
    });

    // Dans une vraie application, on sauvegarderait en base de données
    // await prisma.affectation.create({ data: affectation });
    // await prisma.fonctionnaire.update({
    //   where: { id: fonctionnaireId },
    //   data: { statut: 'AFFECTE' }
    // });

    return NextResponse.json({
      success: true,
      data: affectation,
      message: `Affectation créée avec succès - ${poste} à ${organismeDestination}`
    });

  } catch (error) {
    console.error('❌ Erreur lors de l\'affectation:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de l\'affectation' },
      { status: 500 }
    );
  }
}
