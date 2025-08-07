import { NextResponse } from 'next/server';
import DONNEES_ECHANTILLON_GABON_2025 from '@/lib/data/donnees-reelles-echantillon-gabon-2025';

export async function GET() {
  try {
    const data = DONNEES_ECHANTILLON_GABON_2025;

    const response = {
      success: true,
      data: {
        // Vue d'ensemble des utilisateurs système
        overview: {
          total_utilisateurs_systeme: data.systeme_utilisateurs.total_utilisateurs_systeme,
          par_role: data.systeme_utilisateurs.par_role,
          taux_adoption: Math.round((data.systeme_utilisateurs.total_utilisateurs_systeme / data.fonctionnaires.total_fonctionnaires_reels) * 100),
        },

        // Statut des comptes
        statut_comptes: data.systeme_utilisateurs.statut_comptes,

        // Répartition des rôles avec détails
        roles_details: {
          super_admins: {
            total: data.systeme_utilisateurs.par_role.super_admins,
            description: "Administration centrale du système",
            permissions: "Accès complet",
            organisations_couvertes: "Toutes"
          },
          administrateurs: {
            total: data.systeme_utilisateurs.par_role.administrateurs,
            description: "1 admin pour ~10 organismes",
            permissions: "Gestion organismes",
            organisations_couvertes: "Assignées"
          },
          managers: {
            total: data.systeme_utilisateurs.par_role.managers,
            description: "Responsables de services",
            permissions: "Gestion équipe",
            organisations_couvertes: "Service"
          },
          agents: {
            total: data.systeme_utilisateurs.par_role.agents,
            description: "Agents opérationnels",
            permissions: "Traitement dossiers",
            organisations_couvertes: "Poste de travail"
          },
          citoyens: {
            total: data.systeme_utilisateurs.par_role.citoyens,
            description: "Citoyens utilisateurs",
            permissions: "Consultation/Demandes",
            organisations_couvertes: "Services publics"
          }
        },

        // Citoyens enregistrés (liste réelle)
        citoyens_enregistres: data.systeme_utilisateurs.citoyens_enregistres,

        // Activité et engagement
        activite: {
          connexions_mensuelles: 712,
          sessions_actives_moyennes: 45,
          temps_session_moyen: "18 minutes",
          pages_vues_moyennes: 12,
          taux_satisfaction: 78
        },

        // Données pour graphiques
        graphiques: {
          evolution_utilisateurs: [
            { mois: 'Jan', total: 85, nouveaux: 0, actifs: 78 },
            { mois: 'Fév', total: 86, nouveaux: 1, actifs: 79 },
            { mois: 'Mar', total: 87, nouveaux: 1, actifs: 80 },
            { mois: 'Avr', total: 87, nouveaux: 0, actifs: 80 },
            { mois: 'Mai', total: 87, nouveaux: 0, actifs: 80 },
            { mois: 'Juin', total: 87, nouveaux: 0, actifs: 80 }
          ],

          repartition_par_organisme: [
            { type: 'Ministères/Directions', utilisateurs: 56, pourcentage: 64.4 },
            { type: 'Administrations Territoriales', utilisateurs: 20, pourcentage: 23.0 },
            { type: 'Organismes Spécialisés', utilisateurs: 11, pourcentage: 12.6 }
          ],

          activite_hebdomadaire: [
            { jour: 'Lundi', connexions: 65, documents: 142 },
            { jour: 'Mardi', connexions: 72, documents: 158 },
            { jour: 'Mercredi', connexions: 68, documents: 135 },
            { jour: 'Jeudi', connexions: 71, documents: 149 },
            { jour: 'Vendredi', connexions: 63, documents: 124 },
            { jour: 'Samedi', connexions: 28, documents: 45 },
            { jour: 'Dimanche', connexions: 15, documents: 23 }
          ]
        },

        // Sécurité et conformité
        securite: {
          comptes_2fa_actives: Math.round(data.systeme_utilisateurs.total_utilisateurs_systeme * 0.85),
          dernieres_connexions_suspectes: 0,
          tentatives_intrusion_bloquees: 0,
          mots_de_passe_expires: 3,
          sessions_actives: 42
        },

        // Performance système
        performance: {
          temps_reponse_moyen: "1.2s",
          disponibilite_mensuelle: "99.8%",
          erreurs_critiques: 0,
          satisfaction_performance: 85
        },

        // Métadonnées
        metadata: {
          derniere_mise_a_jour: new Date().toISOString(),
          periode_analyse: "30 derniers jours",
          version_systeme: "1.0.0"
        }
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Erreur lors du chargement des stats utilisateurs:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
