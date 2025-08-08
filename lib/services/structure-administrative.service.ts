// Service pour la gestion de la structure administrative gabonaise

import {
  OrganismeAdministratif,
  StatistiquesStructure,
  FiltresStructure,
  ResultatRecherche,
  AuditStructure,
  CreationOrganismeData,
  ModificationOrganismeData,
  NiveauHierarchique,
  TypeOrganisme,
  StatutOrganisme
} from '@/lib/types/structure-administrative';

// Import des 141 organismes officiels gabonais
import {
  genererOrganismesAdministratifsReels,
  calculerStatistiquesReelles
} from '@/lib/data/structure-administrative-demo';

class StructureAdministrativeService {
  private baseUrl = '/api/structure-administrative';

  // 🇬🇦 ORGANISMES OFFICIELS : 141 organismes administratifs gabonais réels
  private organismesOfficiels: OrganismeAdministratif[];
  private statistiquesOfficielles: StatistiquesStructure;

  constructor() {
    console.log('🏛️ Initialisation du service avec les 141 organismes officiels gabonais...');
    this.chargerOrganismesOfficiels();
  }

  private chargerOrganismesOfficiels() {
    try {
      // Générer les 141 organismes administratifs réels
      this.organismesOfficiels = genererOrganismesAdministratifsReels();

      // Calculer les statistiques réelles
      this.statistiquesOfficielles = calculerStatistiquesReelles(this.organismesOfficiels);

      console.log(`✅ ${this.organismesOfficiels.length} organismes officiels chargés avec succès`);
      console.log(`📊 Répartition: ${this.statistiquesOfficielles.niveau_1} niveau 1, ${this.statistiquesOfficielles.niveau_2} niveau 2, ${this.statistiquesOfficielles.niveau_3} niveau 3, ${this.statistiquesOfficielles.niveau_4} niveau 4, ${this.statistiquesOfficielles.niveau_5} niveau 5`);

    } catch (error) {
      console.error('❌ Erreur lors du chargement des organismes officiels:', error);

      // Fallback vers des données minimales en cas d'erreur
      this.organismesOfficiels = [];
      this.statistiquesOfficielles = {
        niveau_1: 0, niveau_2: 0, niveau_3: 0, niveau_4: 0, niveau_5: 0,
        ministeres: 0, directions: 0, etablissements: 0, collectivites: 0,
        total_effectifs: 0, total_cadres: 0, total_agents: 0, postes_vacants: 0,
        budget_total: 0, budget_fonctionnement: 0, budget_investissement: 0, masse_salariale_totale: 0,
        organismes_actifs: 0, organismes_inactifs: 0, organismes_en_reorganisation: 0, responsables_vacants: 0,
        taux_occupation: 0, derniere_mise_a_jour: new Date().toISOString()
      };
    }
  }

  async getOrganismes(): Promise<OrganismeAdministratif[]> {
    // Simuler un appel API avec les données officielles
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`📋 Retour de ${this.organismesOfficiels.length} organismes officiels`);
        resolve(this.organismesOfficiels);
      }, 800); // Légèrement plus long pour montrer le chargement des vraies données
    });
  }

  async getOrganismeById(id: string): Promise<OrganismeAdministratif | null> {
    const organisme = this.organismesOfficiels.find(o => o.id === id);
    return Promise.resolve(organisme || null);
  }

  async getStatistiques(): Promise<StatistiquesStructure> {
    // Retourner les statistiques précalculées des 141 organismes officiels
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`📊 Retour des statistiques officielles calculées sur ${this.organismesOfficiels.length} organismes`);
        resolve(this.statistiquesOfficielles);
      }, 300);
    });
  }

  async rechercherOrganismes(
    searchTerm: string,
    filtres?: FiltresStructure
  ): Promise<ResultatRecherche> {
    let resultats = [...this.organismesOfficiels];

    // Appliquer la recherche sur les 141 organismes officiels
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      resultats = resultats.filter(o =>
        o.nom.toLowerCase().includes(term) ||
        o.code.toLowerCase().includes(term) ||
        o.sigle?.toLowerCase().includes(term) ||
        o.nomCourt?.toLowerCase().includes(term) ||
        o.mission?.toLowerCase().includes(term)
      );
    }

    // Appliquer les filtres
    if (filtres) {
      if (filtres.niveaux.length > 0) {
        resultats = resultats.filter(o => filtres.niveaux.includes(o.niveau));
      }
      if (filtres.types.length > 0) {
        resultats = resultats.filter(o => filtres.types.includes(o.type));
      }
      if (filtres.statuts.length > 0) {
        resultats = resultats.filter(o => filtres.statuts.includes(o.statut));
      }
      if (filtres.provinces.length > 0) {
        resultats = resultats.filter(o =>
          (o.coordonnees?.province && filtres.provinces.includes(o.coordonnees.province)) ||
          (o.province && filtres.provinces.includes(o.province))
        );
      }
    }

    return Promise.resolve({
      organismes: resultats,
      total: resultats.length,
      page: 1,
      limit: 200 // Augmenté pour gérer plus d'organismes
    });
  }

  async creerOrganisme(data: CreationOrganismeData): Promise<OrganismeAdministratif> {
    const nouvelOrganisme: OrganismeAdministratif = {
      id: `org-${Date.now()}`,
      ...data,
      statut: StatutOrganisme.EN_CREATION,
      dateCreation: new Date().toISOString(),
      dateModification: new Date().toISOString()
    };

    this.organismesOfficiels.push(nouvelOrganisme);

    // Recalculer les statistiques après ajout
    this.statistiquesOfficielles = calculerStatistiquesReelles(this.organismesOfficiels);

    console.log(`➕ Nouvel organisme créé: ${nouvelOrganisme.nom} (Total: ${this.organismesOfficiels.length})`);
    return Promise.resolve(nouvelOrganisme);
  }

  async modifierOrganisme(data: ModificationOrganismeData): Promise<OrganismeAdministratif> {
    const index = this.organismesOfficiels.findIndex(o => o.id === data.id);
    if (index === -1) {
      throw new Error('Organisme non trouvé dans les 141 organismes officiels');
    }

    const organisme = {
      ...this.organismesOfficiels[index],
      ...data,
      dateModification: new Date().toISOString()
    };

    this.organismesOfficiels[index] = organisme;

    // Recalculer les statistiques après modification
    this.statistiquesOfficielles = calculerStatistiquesReelles(this.organismesOfficiels);

    console.log(`✏️ Organisme modifié: ${organisme.nom}`);
    return Promise.resolve(organisme);
  }

  async supprimerOrganisme(id: string): Promise<void> {
    const index = this.organismesOfficiels.findIndex(o => o.id === id);
    if (index === -1) {
      throw new Error('Organisme non trouvé dans les 141 organismes officiels');
    }

    const organisme = this.organismesOfficiels[index];
    this.organismesOfficiels.splice(index, 1);

    // Recalculer les statistiques après suppression
    this.statistiquesOfficielles = calculerStatistiquesReelles(this.organismesOfficiels);

    console.log(`🗑️ Organisme supprimé: ${organisme.nom} (Total: ${this.organismesOfficiels.length})`);
    return Promise.resolve();
  }

  async effectuerAudit(): Promise<AuditStructure> {
    const anomalies = [];

    // Audit sur les 141 organismes officiels
    this.organismesOfficiels.forEach(org => {
      // Vérifier les organismes sans responsable
      if (!org.responsable) {
        anomalies.push({
          type: 'RESPONSABLE_MANQUANT',
          organisme: org.nom,
          description: 'Aucun responsable désigné',
          severite: 'MOYENNE' as const
        });
      }

      // Vérifier les organismes sans effectifs
      if (!org.effectifs) {
        anomalies.push({
          type: 'EFFECTIFS_MANQUANTS',
          organisme: org.nom,
          description: 'Données d\'effectifs non renseignées',
          severite: 'FAIBLE' as const
        });
      }

      // Vérifier les organismes sans coordonnées
      if (!org.coordonnees || !org.coordonnees.email) {
        anomalies.push({
          type: 'COORDONNEES_MANQUANTES',
          organisme: org.nom,
          description: 'Coordonnées de contact incomplètes',
          severite: 'FAIBLE' as const
        });
      }

      // Vérifier la cohérence hiérarchique
      if (org.parentId && !this.organismesOfficiels.find(p => p.id === org.parentId)) {
        anomalies.push({
          type: 'HIERARCHIE_INCOHERENTE',
          organisme: org.nom,
          description: 'Parent hiérarchique non trouvé',
          severite: 'ÉLEVÉE' as const
        });
      }
    });

    console.log(`🔍 Audit terminé sur ${this.organismesOfficiels.length} organismes: ${anomalies.length} anomalie(s) détectée(s)`);

    return Promise.resolve({
      date: new Date().toISOString(),
      anomalies,
      recommandations: [
        'Désigner des responsables pour les organismes sans dirigeant',
        'Compléter les données d\'effectifs manquantes',
        'Mettre à jour les coordonnées de contact',
        'Réviser la hiérarchie administrative',
        'Actualiser les attributions et missions'
      ],
      statistiques: this.statistiquesOfficielles
    });
  }

  async exporterStructure(format: 'JSON' | 'CSV' | 'PDF'): Promise<any> {
    const organismes = await this.getOrganismes();
    const stats = await this.getStatistiques();

    const exportData = {
      date_export: new Date().toISOString(),
      format,
      statistiques: stats,
      organismes,
      metadata: {
        version: '1.0',
        source: 'ADMINISTRATION.GA',
        pays: 'Gabon'
      }
    };

    return Promise.resolve(exportData);
  }
}

export const structureAdministrativeService = new StructureAdministrativeService();
