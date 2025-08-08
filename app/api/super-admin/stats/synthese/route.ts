import { NextResponse } from 'next/server';
import DONNEES_ECHANTILLON_GABON_2025 from '@/lib/data/donnees-reelles-echantillon-gabon-2025';

export async function GET() {
  try {
    const data = DONNEES_ECHANTILLON_GABON_2025;

    const response = {
      success: true,
      data: {
        // Indicateurs clés du tableau de bord
        kpi_principaux: {
          organismes: {
            total: data.organismes.total_organismes,
            actifs: data.organismes.organismes_actifs,
            pourcentage_actifs: 100,
            trend: 0
          },
          fonctionnaires: {
            total: data.fonctionnaires.total_fonctionnaires_reels,
            affectes: data.fonctionnaires.statut_affectation.affectes_postes,
            taux_affectation: 100,
            trend: 0
          },
          utilisateurs_systeme: {
            total: data.systeme_utilisateurs.total_utilisateurs_systeme,
            actifs: data.systeme_utilisateurs.statut_comptes.comptes_actifs,
            taux_activation: Math.round((data.systeme_utilisateurs.statut_comptes.comptes_actifs / data.systeme_utilisateurs.total_utilisateurs_systeme) * 100),
            trend: 2
          },
          services: {
            total: data.services.total_services,
            actifs: data.services.services_actifs,
            taux_disponibilite: Math.round((data.services.services_actifs / data.services.total_services) * 100),
            trend: 5
          }
        },

        // État du système consolidé
        etat_systeme: {
          phase_deploiement: data.synthese.etat_deploiement.phase,
          sante_globale: "Opérationnel",
          dernier_incident: "Aucun",
          disponibilite_7j: "99.8%",
          performance_globale: 85
        },

        // Répartition géographique
        couverture_territoriale: {
          provinces_couvertes: 9,
          total_provinces: 9,
          pourcentage_couverture: 100,
          organismes_par_province: [
            { province: "Estuaire", organismes: 45, fonctionnaires: 35, services: 25 },
            { province: "Haut-Ogooué", organismes: 18, fonctionnaires: 8, services: 12 },
            { province: "Ogooué-Maritime", organismes: 16, fonctionnaires: 12, services: 15 },
            { province: "Woleu-Ntem", organismes: 14, fonctionnaires: 6, services: 10 },
            { province: "Ngounié", organismes: 12, fonctionnaires: 4, services: 8 },
            { province: "Moyen-Ogooué", organismes: 10, fonctionnaires: 3, services: 6 },
            { province: "Ogooué-Lolo", organismes: 10, fonctionnaires: 2, services: 5 },
            { province: "Ogooué-Ivindo", organismes: 8, fonctionnaires: 2, services: 4 },
            { province: "Nyanga", organismes: 8, fonctionnaires: 1, services: 3 }
          ]
        },

        // Progression vers les objectifs
        objectifs_2025: {
          reduction_postes_vacants: {
            objectif: 15, // %
            actuel: 91.4, // %
            progression: 8.6, // % vers l'objectif
            statut: "En cours"
          },
          numerisation_services: {
            objectif: 85, // %
            actuel: 59, // %
            progression: 69, // % vers l'objectif
            statut: "En bonne voie"
          },
          adoption_utilisateurs: {
            objectif: 500, // utilisateurs
            actuel: 87,
            progression: 17, // % vers l'objectif
            statut: "Début de déploiement"
          }
        },

        // Métriques de performance
        performance_globale: {
          efficacite_administrative: {
            score: 72,
            description: "Taux de traitement des dossiers dans les délais",
            evolution: "+3 points"
          },
          satisfaction_citoyens: {
            score: 78,
            description: "Satisfaction moyenne des services publics",
            evolution: "+5 points"
          },
          modernisation_numerique: {
            score: 59,
            description: "Avancement de la transformation digitale",
            evolution: "+12 points"
          },
          coordination_institutionnelle: {
            score: 76,
            description: "Efficacité de la coordination inter-organismes",
            evolution: "+2 points"
          }
        },

        // Données pour widgets du dashboard
        widgets: {
          activite_recente: [
            {
              type: "organisme_active",
              message: "Ministère de l'Environnement - Nouveau conseiller nommé",
              timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
              importance: "medium"
            },
            {
              type: "service_numerise",
              message: "Casier judiciaire - Processus dématérialisé",
              timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
              importance: "high"
            },
            {
              type: "utilisateur_ajout",
              message: "15 nouveaux agents formés au système",
              timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
              importance: "low"
            },
            {
              type: "relation_etablie",
              message: "Accord de coopération CNSS-CNAMGS signé",
              timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
              importance: "medium"
            }
          ],

          alertes_systeme: [
            {
              niveau: "info",
              message: "Maintenance programmée ce weekend",
              action_requise: false
            },
            {
              niveau: "warning",
              message: "3 comptes utilisateurs nécessitent une validation",
              action_requise: true
            }
          ],

          top_organismes_actifs: [
            { nom: "Ministère de l'Intérieur", activite: 95, services: 8 },
            { nom: "DGDI", activite: 88, services: 3 },
            { nom: "Ministère de la Justice", activite: 82, services: 5 },
            { nom: "CNSS", activite: 85, services: 2 },
            { nom: "Mairie de Libreville", activite: 78, services: 7 }
          ]
        },

        // Indicateurs financiers (estimations)
        impact_financier: {
          economies_realisees: "245M FCFA",
          cout_maintenance_mensuel: "15M FCFA",
          retour_investissement: "18 mois",
          reduction_cout_administratif: "12%"
        },

        // Prochaines échéances importantes
        echeances_importantes: [
          {
            date: "2025-07-31",
            evenement: "Déploiement paiement en ligne",
            organisme: "Multiple",
            criticite: "high"
          },
          {
            date: "2025-09-30",
            evenement: "Dématérialisation CNI",
            organisme: "DGDI",
            criticite: "medium"
          },
          {
            date: "2025-12-31",
            evenement: "Interconnexion organismes",
            organisme: "Tous",
            criticite: "high"
          }
        ],

        // Recommandations stratégiques
        recommandations: [
          {
            priorite: "haute",
            domaine: "Ressources Humaines",
            action: "Accélérer le recrutement pour réduire les postes vacants",
            impact_estime: "Amélioration efficacité +25%"
          },
          {
            priorite: "haute",
            domaine: "Numérique",
            action: "Prioriser la dématérialisation des services les plus demandés",
            impact_estime: "Satisfaction citoyens +15%"
          },
          {
            priorite: "moyenne",
            domaine: "Coordination",
            action: "Renforcer les groupes de travail inter-ministériels",
            impact_estime: "Réduction doublons administratifs"
          }
        ],

        // Métadonnées de synthèse
        metadata: {
          derniere_mise_a_jour: new Date().toISOString(),
          periode_analyse: data.metadata.date_generation,
          version_donnees: "1.0.0",
          niveau_confiance: "85%",
          prochaine_evaluation: "2025-07-20"
        }
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Erreur lors du chargement de la synthèse:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
