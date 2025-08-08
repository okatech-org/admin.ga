import { NextRequest, NextResponse } from 'next/server';
import type { StatistiquesEmploi } from '@/lib/types/emploi';

export async function GET(request: NextRequest) {
  try {
    // Statistiques mockées pour la démonstration
    const statistiques: StatistiquesEmploi = {
      totalOffres: 156,
      offresActives: 42,
      offresPourvues: 89,
      totalCandidatures: 3456,
      candidaturesEnCours: 234,
      tauxConversion: 57.05, // Pourcentage d'offres pourvues
      delaiMoyenRecrutement: 21, // jours
      topCompetences: [
        { competence: 'Management', demandes: 45 },
        { competence: 'Comptabilité', demandes: 38 },
        { competence: 'Informatique', demandes: 35 },
        { competence: 'Communication', demandes: 32 },
        { competence: 'Droit public', demandes: 28 },
        { competence: 'Gestion de projet', demandes: 26 },
        { competence: 'Marketing digital', demandes: 24 },
        { competence: 'Ressources humaines', demandes: 22 }
      ],
      repartitionContrats: [
        { type: 'CDI', nombre: 68 },
        { type: 'CDD', nombre: 42 },
        { type: 'stage', nombre: 28 },
        { type: 'consultant', nombre: 12 },
        { type: 'alternance', nombre: 4 },
        { type: 'vacataire', nombre: 2 }
      ],
      evolutionOffres: [
        { mois: 'Août 2024', nombre: 12 },
        { mois: 'Septembre 2024', nombre: 18 },
        { mois: 'Octobre 2024', nombre: 22 },
        { mois: 'Novembre 2024', nombre: 28 },
        { mois: 'Décembre 2024', nombre: 35 },
        { mois: 'Janvier 2025', nombre: 42 }
      ]
    };

    // Ajouter le nombre d'organismes recruteurs
    const nombreOrganismes = 23; // Nombre d'administrations qui recrutent

    return NextResponse.json({
      ...statistiques,
      nombreOrganismes
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des statistiques' },
      { status: 500 }
    );
  }
}
