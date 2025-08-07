import { NextResponse } from 'next/server';
import DONNEES_ECHANTILLON_GABON_2025 from '@/lib/data/donnees-reelles-echantillon-gabon-2025';

export async function GET() {
  try {
    const data = DONNEES_ECHANTILLON_GABON_2025;

    const response = {
      success: true,
      data: {
        // Vue d'ensemble des services
        overview: {
          total_services: data.services.total_services,
          services_actifs: data.services.services_actifs,
          services_en_developpement: data.services.services_en_developpement,
          taux_disponibilite: Math.round((data.services.services_actifs / data.services.total_services) * 100)
        },

        // Numérisation des démarches
        numerisation: data.services.demarches_numeriques,

        // Services documentés par catégorie
        services_par_categorie: {
          etat_civil: {
            total: 5,
            actifs: 5,
            services: [
              { nom: "Acte de naissance", organisme: "Mairies", delai: "48h", numerique: true },
              { nom: "Acte de mariage", organisme: "Mairies", delai: "72h", numerique: true },
              { nom: "Acte de décès", organisme: "Mairies", delai: "24h", numerique: false },
              { nom: "Certificat de vie", organisme: "Mairies", delai: "24h", numerique: true },
              { nom: "Certificat de célibat", organisme: "Mairies", delai: "72h", numerique: false }
            ]
          },
          identite: {
            total: 4,
            actifs: 4,
            services: [
              { nom: "CNI", organisme: "DGDI", delai: "15 jours", numerique: false },
              { nom: "Passeport", organisme: "DGDI", delai: "7 jours", numerique: true },
              { nom: "Permis de conduire", organisme: "Transport", delai: "30 jours", numerique: false },
              { nom: "Carte de séjour", organisme: "DGDI", delai: "30 jours", numerique: false }
            ]
          },
          justice: {
            total: 3,
            actifs: 3,
            services: [
              { nom: "Casier judiciaire", organisme: "Justice", delai: "48h", numerique: true },
              { nom: "Certificat de nationalité", organisme: "Justice", delai: "7 jours", numerique: false },
              { nom: "Légalisation", organisme: "Justice", delai: "24h", numerique: true }
            ]
          },
          social: {
            total: 3,
            actifs: 3,
            services: [
              { nom: "Immatriculation CNSS", organisme: "CNSS", delai: "7 jours", numerique: true },
              { nom: "Carte CNAMGS", organisme: "CNAMGS", delai: "15 jours", numerique: false },
              { nom: "Attestation de travail", organisme: "CNSS", delai: "48h", numerique: true }
            ]
          },
          municipal: {
            total: 4,
            actifs: 4,
            services: [
              { nom: "Permis de construire", organisme: "Mairies", delai: "30 jours", numerique: false },
              { nom: "Autorisation commerce", organisme: "Mairies", delai: "15 jours", numerique: true },
              { nom: "Certificat résidence", organisme: "Mairies", delai: "24h", numerique: true },
              { nom: "Acte foncier", organisme: "Cadastre", delai: "60 jours", numerique: false }
            ]
          }
        },

        // Performance des services
        performance: {
          temps_traitement_moyen: "5.2 jours",
          taux_satisfaction_global: 78,
          delais_respectes: 85,
          reclamations_mensuelles: 12,
          ameliorations_implementees: 8
        },

        // Données pour graphiques
        graphiques: {
          evolution_numerisation: [
            { mois: 'Jan', numeriques: 45, hybrides: 35, papier: 35 },
            { mois: 'Fév', numeriques: 47, hybrides: 36, papier: 35 },
            { mois: 'Mar', numeriques: 48, hybrides: 37, papier: 35 },
            { mois: 'Avr', numeriques: 49, hybrides: 37, papier: 35 },
            { mois: 'Mai', numeriques: 50, hybrides: 38, papier: 35 },
            { mois: 'Juin', numeriques: 50, hybrides: 38, papier: 35 }
          ],

          demandes_par_service: [
            { service: "Passeports", demandes: 245, completees: 198, en_cours: 47 },
            { service: "CNI", demandes: 189, completees: 165, en_cours: 24 },
            { service: "Actes naissance", demandes: 156, completees: 142, en_cours: 14 },
            { service: "CNSS", demandes: 98, completees: 89, en_cours: 9 },
            { service: "Casier judiciaire", demandes: 76, completees: 68, en_cours: 8 }
          ],

          satisfaction_par_organisme: [
            { organisme: "DGDI", satisfaction: 82, services: 3 },
            { organisme: "Mairies", satisfaction: 75, services: 9 },
            { organisme: "CNSS", satisfaction: 88, services: 2 },
            { organisme: "Justice", satisfaction: 72, services: 3 },
            { organisme: "Transport", satisfaction: 69, services: 2 }
          ]
        },

        // Indicateurs qualité
        qualite: {
          services_certifies_iso: 12,
          audits_qualite_passes: 8,
          taux_erreur_moyen: 2.3,
          temps_resolution_incident: "4.5h",
          formation_agents_completee: 92
        },

        // Projets d'amélioration
        projets_amelioration: [
          {
            nom: "Dématérialisation CNI",
            avancement: 65,
            echeance: "2025-09-30",
            impact_estime: "Réduction délai de 50%"
          },
          {
            nom: "Interconnexion organismes",
            avancement: 30,
            echeance: "2025-12-31",
            impact_estime: "Échange automatique données"
          },
          {
            nom: "Paiement en ligne",
            avancement: 80,
            echeance: "2025-07-31",
            impact_estime: "Facilitation paiements"
          }
        ],

        // Métadonnées
        metadata: {
          derniere_mise_a_jour: new Date().toISOString(),
          periode_analyse: "6 derniers mois",
          services_evalues: data.services.total_services,
          organismes_concernes: 25
        }
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Erreur lors du chargement des stats services:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
