import { NextResponse } from 'next/server';
import DONNEES_ECHANTILLON_GABON_2025 from '@/lib/data/donnees-reelles-echantillon-gabon-2025';

export async function GET() {
  try {
    const data = DONNEES_ECHANTILLON_GABON_2025;

    const response = {
      success: true,
      data: {
        // Vue d'ensemble des organismes
        overview: {
          total_organismes: data.organismes.total_organismes,
          organismes_actifs: data.organismes.organismes_actifs,
          organismes_principaux: data.organismes.organismes_principaux,
          organismes_secondaires: data.organismes.organismes_secondaires,
          prospects_actifs: data.organismes.prospects_actifs,
          taux_activite: 100
        },

        // Répartition exacte par type
        repartition_par_type: data.organismes.repartition_exacte_141,

        // Répartition par secteurs
        secteurs: data.secteurs,

        // Statistiques de performance
        performance: {
          organismes_avec_titulaire: Math.round((49 / 141) * 100), // 34.8%
          couverture_territoriale: 100, // 9/9 provinces
          taux_operationnel: 100,
          organismes_numerises: Math.round((50 / 141) * 100) // ~35%
        },

        // Données pour graphiques
        graphiques: {
          evolution_mensuelle: [
            { mois: 'Jan', total: 141, actifs: 141, nouveaux: 0 },
            { mois: 'Fév', total: 141, actifs: 141, nouveaux: 0 },
            { mois: 'Mar', total: 141, actifs: 141, nouveaux: 0 },
            { mois: 'Avr', total: 141, actifs: 141, nouveaux: 0 },
            { mois: 'Mai', total: 141, actifs: 141, nouveaux: 0 },
            { mois: 'Juin', total: 141, actifs: 141, nouveaux: 0 }
          ],

          repartition_geographique: [
            { province: 'Estuaire', organismes: 45, pourcentage: 32 },
            { province: 'Haut-Ogooué', organismes: 18, pourcentage: 13 },
            { province: 'Ogooué-Maritime', organismes: 16, pourcentage: 11 },
            { province: 'Woleu-Ntem', organismes: 14, pourcentage: 10 },
            { province: 'Autres', organismes: 48, pourcentage: 34 }
          ]
        },

        // Métadonnées
        metadata: {
          derniere_mise_a_jour: new Date().toISOString(),
          source: data.metadata.source,
          version: "1.0.0"
        }
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Erreur lors du chargement des stats organismes:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
