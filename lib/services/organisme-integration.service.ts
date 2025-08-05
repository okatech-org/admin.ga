// =============================================================================
// 🏛️ ADMINISTRATION.GA - Service d'Intégration Configuration Organisme
// =============================================================================

import {
  ConfigurationOrganisme,
  PosteSensible,
  CompteTechnique
} from '@/lib/types/organisme-configuration';
import {
  Organisme,
  Poste,
  Personne,
  CompteUtilisateur
} from '@/lib/types/poste-management';
import { organismeConfigurationService } from './organisme-configuration.service';
import { posteManagementService } from './poste-management.service';

class OrganismeIntegrationService {

  // =============================================================================
  // 🏗️ CRÉATION D'ORGANISME AVEC CONFIGURATION COMPLÈTE
  // =============================================================================

  /**
   * Crée un organisme complet avec sa configuration
   */
  async creerOrganismeComplet(
    organismeData: {
      code: string;
      nom: string;
      type: string;
      groupe: string;
      province?: string;
      ville?: string;
    },
    configurationPersonnalisee?: Partial<ConfigurationOrganisme>
  ): Promise<{
    organisme: Organisme;
    configuration: ConfigurationOrganisme;
    postes: Poste[];
    comptes: CompteUtilisateur[];
  }> {

    console.log('🏗️ Création d\'organisme complet:', organismeData.nom);

    // 1. Créer l'organisme de base
    const organisme = this.creerOrganismeBase(organismeData);

    // 2. Générer la configuration par défaut
    const configurationBase = organismeConfigurationService.generateDefaultConfiguration({
      id: organisme.id,
      code: organismeData.code,
      nom: organismeData.nom,
      type: organismeData.type as any,
      groupe: organismeData.groupe as any
    });

    // 3. Fusionner avec la configuration personnalisée
    const configuration = this.fusionnerConfigurations(configurationBase, configurationPersonnalisee);

    // 4. Valider la configuration
    const validation = organismeConfigurationService.validateConfiguration(configuration);
    if (!validation.valid) {
      throw new Error(`Configuration invalide: ${validation.errors.map(e => e.message).join(', ')}`);
    }

    // 5. Créer les postes selon la structure organisationnelle
    const postes = await this.creerPostesDepuisConfiguration(organisme.id, configuration);

    // 6. Créer les comptes utilisateurs
    const comptes = await this.creerComptesDepuisConfiguration(organisme.id, configuration, postes);

    // 7. Sauvegarder la configuration
    await organismeConfigurationService.saveConfiguration(configuration);

    // 8. Mettre à jour les statistiques de l'organisme
    posteManagementService.updateStatistiquesPostes(organisme.id);

    console.log('✅ Organisme complet créé:', {
      organisme: organisme.nom,
      postes: postes.length,
      comptes: comptes.length
    });

    return {
      organisme,
      configuration,
      postes,
      comptes
    };
  }

  /**
   * Applique une configuration existante à un organisme
   */
  async appliquerConfiguration(
    organismeId: string,
    configuration: ConfigurationOrganisme
  ): Promise<void> {
    console.log('🔧 Application de configuration pour:', organismeId);

    // 1. Valider la configuration
    const validation = organismeConfigurationService.validateConfiguration(configuration);
    if (!validation.valid) {
      throw new Error('Configuration invalide');
    }

    // 2. Mettre à jour les informations de l'organisme
    await this.mettreAJourOrganisme(organismeId, configuration);

    // 3. Synchroniser les postes
    await this.synchroniserPostes(organismeId, configuration);

    // 4. Synchroniser les comptes
    await this.synchroniserComptes(organismeId, configuration);

    // 5. Appliquer les paramètres de sécurité
    await this.appliquerParametresSecurite(organismeId, configuration);

    // 6. Configurer les modules
    await this.configurerModules(organismeId, configuration);

    // 7. Sauvegarder la configuration
    await organismeConfigurationService.saveConfiguration(configuration);

    console.log('✅ Configuration appliquée avec succès');
  }

  // =============================================================================
  // 🏢 GESTION DES ORGANISMES
  // =============================================================================

  private creerOrganismeBase(data: any): Organisme {
    return {
      id: `ORG_${Date.now()}`,
      code: data.code,
      nom: data.nom,
      type: data.type,
      groupe: data.groupe,
      niveau_hierarchique: this.determinerNiveauHierarchique(data.type),
      est_organisme_principal: this.determinerSiPrincipal(data.type),

      // Localisation
      province: data.province || 'Estuaire',
      ville: data.ville || 'Libreville',

      // Contact
      telephone: `+241 01 XX XX XX`,
      email: `contact@${data.code.toLowerCase()}.gov.ga`,

      // Hiérarchie
      organisme_parent_id: undefined,
      organismes_enfants: [],

      // Statistiques (initialisées)
      stats_postes: {
        total_postes: 0,
        postes_occupés: 0,
        postes_vacants: 0,
        postes_en_transition: 0
      },

      // Métadonnées
      date_creation: new Date().toISOString(),
      date_mise_a_jour: new Date().toISOString()
    };
  }

  private async mettreAJourOrganisme(
    organismeId: string,
    configuration: ConfigurationOrganisme
  ): Promise<void> {
    const info = configuration.informations_generales;

    // Mettre à jour les informations de base
    // En réalité, on ferait un appel à l'API/DB
    console.log('📝 Mise à jour organisme:', {
      id: organismeId,
      nom: info.identification.nom,
      adresse: info.localisation.siege_principal.adresse
    });
  }

  // =============================================================================
  // 💼 GESTION DES POSTES
  // =============================================================================

  private async creerPostesDepuisConfiguration(
    organismeId: string,
    configuration: ConfigurationOrganisme
  ): Promise<Poste[]> {
    const postes: Poste[] = [];
    const structure = configuration.structure;
    const comptesPostes = configuration.comptes_postes;

    // 1. Créer les postes de direction
    for (const posteConfig of comptesPostes.postes_direction) {
      const poste = this.creerPosteDepuisConfig(organismeId, posteConfig, 'DIRECTION');
      postes.push(poste);
    }

    // 2. Créer les postes d'encadrement
    for (const posteConfig of comptesPostes.postes_encadrement) {
      const poste = this.creerPosteDepuisConfig(organismeId, posteConfig, 'ENCADREMENT');
      postes.push(poste);
    }

    // 3. Créer les postes selon l'organigramme
    for (const direction of structure.organigramme.directions_centrales) {
      // Poste de directeur
      const posteDirecteur: Poste = {
        id: `POSTE_${Date.now()}_${Math.random()}`,
        organisme_id: organismeId,
        intitule: `Directeur ${direction.nom}`,
        code_poste: `DIR_${direction.sigle}`,
        description: `Responsable de la ${direction.nom}`,
        niveau_hierarchique: 'ENCADREMENT',
        categorie: 'A',
        statut: 'VACANT',
        est_strategique: true,
        est_eligible_interne: true,
        est_eligible_externe: true,
        priorite_recrutement: 'INTERNE',
        competences_requises: [
          'Management d\'équipe',
          'Gestion administrative',
          'Leadership'
        ],
        diplomes_requis: ['BAC+5', 'Expérience management'],
        experience_minimale: 5,
        historique_affectations: [],
        date_creation: new Date().toISOString(),
        date_mise_a_jour: new Date().toISOString(),
        créé_par: 'SYSTEM'
      };
      postes.push(posteDirecteur);

      // Postes des services
      for (const service of direction.services) {
        const posteChefService: Poste = {
          id: `POSTE_${Date.now()}_${Math.random()}`,
          organisme_id: organismeId,
          intitule: `Chef ${service}`,
          code_poste: `CHEF_${service.replace(/\s+/g, '_').toUpperCase()}`,
          description: `Responsable du ${service}`,
          niveau_hierarchique: 'ENCADREMENT',
          categorie: 'B',
          statut: 'VACANT',
          est_strategique: false,
          est_eligible_interne: true,
          est_eligible_externe: true,
          priorite_recrutement: 'MIXTE',
          competences_requises: [
            'Gestion d\'équipe',
            'Expertise technique'
          ],
          diplomes_requis: ['BAC+3'],
          experience_minimale: 3,
          historique_affectations: [],
          date_creation: new Date().toISOString(),
          date_mise_a_jour: new Date().toISOString(),
          créé_par: 'SYSTEM'
        };
        postes.push(posteChefService);
      }
    }

    console.log(`📋 ${postes.length} postes créés pour l'organisme`);
    return postes;
  }

  private creerPosteDepuisConfig(
    organismeId: string,
    posteConfig: PosteSensible,
    niveau: 'DIRECTION' | 'ENCADREMENT'
  ): Poste {
    return {
      id: `POSTE_${Date.now()}_${posteConfig.code}`,
      organisme_id: organismeId,
      intitule: posteConfig.titre,
      code_poste: posteConfig.code,
      description: `Poste ${niveau.toLowerCase()} - ${posteConfig.titre}`,
      niveau_hierarchique: niveau,
      categorie: niveau === 'DIRECTION' ? 'A' : 'B',
      statut: 'VACANT',
      est_strategique: niveau === 'DIRECTION',
      est_eligible_interne: true,
      est_eligible_externe: niveau === 'DIRECTION',
      priorite_recrutement: niveau === 'DIRECTION' ? 'INTERNE' : 'MIXTE',
      competences_requises: this.extraireCompetencesDepuisPermissions(posteConfig.permissions_speciales),
      diplomes_requis: niveau === 'DIRECTION' ? ['BAC+5', 'Expérience direction'] : ['BAC+3'],
      experience_minimale: niveau === 'DIRECTION' ? 10 : 5,
      historique_affectations: [],
      date_creation: new Date().toISOString(),
      date_mise_a_jour: new Date().toISOString(),
      créé_par: 'SYSTEM'
    };
  }

  private async synchroniserPostes(
    organismeId: string,
    configuration: ConfigurationOrganisme
  ): Promise<void> {
    // Logique de synchronisation des postes existants avec la nouvelle configuration
    console.log('🔄 Synchronisation des postes...');

    // 1. Identifier les postes à créer, modifier, supprimer
    // 2. Appliquer les changements
    // 3. Mettre à jour les affectations si nécessaire
  }

  // =============================================================================
  // 🔐 GESTION DES COMPTES
  // =============================================================================

  private async creerComptesDepuisConfiguration(
    organismeId: string,
    configuration: ConfigurationOrganisme,
    postes: Poste[]
  ): Promise<CompteUtilisateur[]> {
    const comptes: CompteUtilisateur[] = [];

    // 1. Créer les comptes pour les postes sensibles
    for (const posteConfig of [...configuration.comptes_postes.postes_direction, ...configuration.comptes_postes.postes_encadrement]) {
      const posteCorrespondant = postes.find(p => p.code_poste === posteConfig.code);
      if (posteCorrespondant) {
        const compte = this.creerCompteDepuisPosteConfig(organismeId, posteConfig, posteCorrespondant.id);
        comptes.push(compte);
      }
    }

    // 2. Créer les comptes techniques
    for (const compteConfig of configuration.comptes_postes.comptes_techniques) {
      const compte = this.creerCompteTechnique(organismeId, compteConfig);
      comptes.push(compte);
    }

    console.log(`🔐 ${comptes.length} comptes créés`);
    return comptes;
  }

  private creerCompteDepuisPosteConfig(
    organismeId: string,
    posteConfig: PosteSensible,
    posteId: string
  ): CompteUtilisateur {
    return {
      id: `COMPTE_${Date.now()}_${posteConfig.code}`,
      type: 'FONCTIONNEL',
      poste_id: posteId,
      organisme_id: organismeId,
      identifiant: posteConfig.compte.username,
      email: posteConfig.compte.username,
      mot_de_passe_hash: '', // À générer lors de l'activation
      role: posteConfig.role_systeme as any,
      permissions: posteConfig.permissions_speciales,
      services_accessibles: [],
      est_actif: false, // Activé lors de l'affectation
      est_verrouille: false,
      tentatives_connexion_echouees: 0,
      doit_changer_mot_de_passe: true,
      date_creation: new Date().toISOString(),
      date_mise_a_jour: new Date().toISOString(),
      créé_par: 'SYSTEM'
    };
  }

  private creerCompteTechnique(
    organismeId: string,
    compteConfig: CompteTechnique
  ): CompteUtilisateur {
    return {
      id: `COMPTE_TECH_${Date.now()}_${compteConfig.code}`,
      type: 'TEMPORAIRE',
      organisme_id: organismeId,
      identifiant: `${compteConfig.code.toLowerCase()}.${organismeId.toLowerCase()}`,
      email: `${compteConfig.code.toLowerCase()}@system.admin.ga`,
      mot_de_passe_hash: '', // Généré automatiquement
      role: 'AGENT' as any,
      permissions: compteConfig.permissions,
      services_accessibles: [],
      est_actif: true,
      est_verrouille: false,
      tentatives_connexion_echouees: 0,
      doit_changer_mot_de_passe: false,
      date_creation: new Date().toISOString(),
      date_mise_a_jour: new Date().toISOString(),
      créé_par: 'SYSTEM'
    };
  }

  private async synchroniserComptes(
    organismeId: string,
    configuration: ConfigurationOrganisme
  ): Promise<void> {
    // Logique de synchronisation des comptes
    console.log('🔄 Synchronisation des comptes...');
  }

  // =============================================================================
  // ⚙️ CONFIGURATION AVANCÉE
  // =============================================================================

  private async appliquerParametresSecurite(
    organismeId: string,
    configuration: ConfigurationOrganisme
  ): Promise<void> {
    const securite = configuration.parametres.securite;

    console.log('🔒 Application des paramètres de sécurité:', {
      organisme: organismeId,
      longueur_mdp_min: securite.authentification.politique_mot_de_passe.longueur_minimale,
      duree_session_max: securite.sessions.duree_max_minutes,
      audit_actif: securite.audit.actif
    });

    // Ici on appliquerait les paramètres dans le système d'authentification
  }

  private async configurerModules(
    organismeId: string,
    configuration: ConfigurationOrganisme
  ): Promise<void> {
    const modules = configuration.modules;

    console.log('📦 Configuration des modules:', {
      organisme: organismeId,
      gestion_documentaire: modules.modules_base.gestion_documentaire.actif,
      gestion_courrier: modules.modules_base.gestion_courrier.actif,
      e_services: modules.modules_avances.e_services?.actif || false
    });

    // Ici on activerait/désactiverait les modules dans le système
  }

  // =============================================================================
  // 🛠️ UTILITAIRES
  // =============================================================================

  private fusionnerConfigurations(
    configBase: ConfigurationOrganisme,
    configPersonnalisee?: Partial<ConfigurationOrganisme>
  ): ConfigurationOrganisme {
    if (!configPersonnalisee) return configBase;

    // Fusion profonde des configurations (implémentation simplifiée)
    return {
      ...configBase,
      ...configPersonnalisee,
      informations_generales: {
        ...configBase.informations_generales,
        ...configPersonnalisee.informations_generales
      },
      parametres: {
        ...configBase.parametres,
        ...configPersonnalisee.parametres
      }
    };
  }

  private determinerNiveauHierarchique(type: string): number {
    const niveaux: Record<string, number> = {
      'PRESIDENCE': 1,
      'MINISTERE': 2,
      'DIRECTION_GENERALE': 3,
      'DIRECTION': 4,
      'SERVICE': 5
    };
    return niveaux[type] || 3;
  }

  private determinerSiPrincipal(type: string): boolean {
    return ['PRESIDENCE', 'MINISTERE', 'DIRECTION_GENERALE'].includes(type);
  }

  private extraireCompetencesDepuisPermissions(permissions: string[]): string[] {
    const mapping: Record<string, string[]> = {
      'GESTION_COMPLETE_ORGANISME': ['Management stratégique', 'Leadership', 'Gestion administrative'],
      'SIGNATURE_ELECTRONIQUE': ['Responsabilité juridique', 'Gestion documentaire'],
      'GESTION_BUDGET': ['Gestion financière', 'Contrôle budgétaire'],
      'GESTION_RH': ['Ressources humaines', 'Management d\'équipe'],
      'GESTION_INFRASTRUCTURE': ['Systèmes d\'information', 'Infrastructure IT']
    };

    const competences = new Set<string>();
    permissions.forEach(perm => {
      const compsPerm = mapping[perm] || [];
      compsPerm.forEach(comp => competences.add(comp));
    });

    return Array.from(competences);
  }

  // =============================================================================
  // 📊 STATISTIQUES ET RAPPORTS
  // =============================================================================

  /**
   * Génère un rapport de déploiement d'organisme
   */
  async genererRapportDeploiement(organismeId: string): Promise<{
    organisme: any;
    configuration: ConfigurationOrganisme | null;
    statistiques: {
      postes_total: number;
      postes_occupés: number;
      comptes_actifs: number;
      modules_activés: number;
    };
    problemes: string[];
    recommandations: string[];
  }> {
    // Implémentation du rapport de déploiement
    const configuration = await organismeConfigurationService.loadConfiguration(organismeId);

    return {
      organisme: null, // À charger depuis la DB
      configuration,
      statistiques: {
        postes_total: 0,
        postes_occupés: 0,
        comptes_actifs: 0,
        modules_activés: 0
      },
      problemes: [],
      recommandations: [
        'Finaliser la configuration des modules',
        'Affecter les postes stratégiques',
        'Valider les paramètres de sécurité'
      ]
    };
  }
}

// Instance singleton
export const organismeIntegrationService = new OrganismeIntegrationService();
