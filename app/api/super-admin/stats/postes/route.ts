import { NextResponse } from 'next/server';
import DONNEES_ECHANTILLON_GABON_2025 from '@/lib/data/donnees-reelles-echantillon-gabon-2025';

export async function GET() {
  try {
    const data = DONNEES_ECHANTILLON_GABON_2025;

    const response = {
      success: true,
      data: {
        // Vue d'ensemble des postes
        overview: {
          total_postes_echantillon: data.postes.total_postes_echantillon,
          postes_pourvus_noms_reels: data.postes.postes_pourvus_noms_reels,
          postes_vacants: data.postes.postes_vacants,
          taux_pourvoi: Math.round((data.postes.postes_pourvus_noms_reels / data.postes.total_postes_echantillon) * 100),
          taux_vacance: Math.round((data.postes.postes_vacants / data.postes.total_postes_echantillon) * 100)
        },

        // Répartition par niveau hiérarchique
        repartition_par_niveau: data.postes.repartition_postes,

        // Situation des fonctionnaires
        fonctionnaires: {
          total_fonctionnaires_reels: data.fonctionnaires.total_fonctionnaires_reels,
          statut_affectation: data.fonctionnaires.statut_affectation,
          repartition_par_categorie: data.fonctionnaires.par_categorie
        },

        // Postes avec noms réels (pour les tableaux détaillés)
        postes_avec_noms: {
          ministres: {
            total: data.postes.postes_avec_noms_reels.ministres.length,
            liste: data.postes.postes_avec_noms_reels.ministres
          },
          gouverneurs: {
            total: data.postes.postes_avec_noms_reels.gouverneurs.length,
            liste: data.postes.postes_avec_noms_reels.gouverneurs
          },
          directeurs_confirmes: {
            total: data.postes.postes_avec_noms_reels.directeurs_confirmes.length,
            liste: data.postes.postes_avec_noms_reels.directeurs_confirmes
          }
        },

        // Données pour graphiques
        graphiques: {
          evolution_recrutement: [
            { mois: 'Jan', nouveaux: 0, mutations: 0, total_actifs: 73 },
            { mois: 'Fév', nouveaux: 0, mutations: 1, total_actifs: 73 },
            { mois: 'Mar', nouveaux: 0, mutations: 0, total_actifs: 73 },
            { mois: 'Avr', nouveaux: 0, mutations: 1, total_actifs: 73 },
            { mois: 'Mai', nouveaux: 0, mutations: 0, total_actifs: 73 },
            { mois: 'Juin', nouveaux: 0, mutations: 1, total_actifs: 73 }
          ],

          repartition_postes: [
            { niveau: 'Direction', total: 141, pourvus: 49, vacants: 92, pourcentage: 34.8 },
            { niveau: 'Encadrement', total: 282, pourvus: 20, vacants: 262, pourcentage: 7.1 },
            { niveau: 'Exécution', total: 424, pourvus: 4, vacants: 420, pourcentage: 0.9 }
          ],

          mobilite_geographique: [
            { region: 'Libreville-Estuaire', affectes: 35, demandes_mutation: 8 },
            { region: 'Port-Gentil', affectes: 12, demandes_mutation: 3 },
            { region: 'Franceville', affectes: 8, demandes_mutation: 2 },
            { region: 'Autres provinces', affectes: 18, demandes_mutation: 5 }
          ]
        },

        // Indicateurs RH
        indicateurs_rh: {
          taux_feminisation_direction: 28, // % (ex: Brigitte ONKANOWA, Camélia NTOUTOUME...)
          moyenne_age_direction: 52,
          taux_renouvellement_annuel: 5,
          satisfaction_affectation: 85
        },

        // Métadonnées
        metadata: {
          derniere_mise_a_jour: new Date().toISOString(),
          source: data.metadata.source,
          note: data.metadata.note
        }
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Erreur lors du chargement des stats postes:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
