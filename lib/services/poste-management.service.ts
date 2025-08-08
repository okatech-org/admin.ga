// =============================================================================
// 🏛️ ADMINISTRATION.GA - Service de Gestion des Postes et Emploi Public
// =============================================================================

import {
  Organisme,
  Poste,
  Personne,
  Affectation,
  CompteUtilisateur,
  OpportuniteEmploi,
  Candidature,
  StatistiquesEmploi,
  FiltresPoste,
  FiltresFonctionnaire,
  ResultatRecherche,
  StatutPoste,
  StatutFonctionnaire,
  NiveauHierarchique
} from '@/lib/types/poste-management';

class PosteManagementService {

  // =============================================================================
  // 🏢 GESTION DES ORGANISMES
  // =============================================================================

  /**
   * Récupère tous les organismes avec leurs statistiques de postes
   */
  getOrganismes(): Organisme[] {
    // Simulation - à remplacer par appel API/DB
    return this.getOrganismesSimulés();
  }

  /**
   * Met à jour les statistiques de postes d'un organisme
   */
  updateStatistiquesPostes(organismeId: string): void {
    const postes = this.getPostesByOrganisme(organismeId);
    const stats = {
      total_postes: postes.length,
      postes_occupés: postes.filter(p => p.statut === 'OCCUPÉ').length,
      postes_vacants: postes.filter(p => p.statut === 'VACANT').length,
      postes_en_transition: postes.filter(p => p.statut === 'EN_TRANSITION').length
    };

    // Mise à jour en base de données
    console.log(`📊 Statistiques mises à jour pour ${organismeId}:`, stats);
  }

  // =============================================================================
  // 💼 GESTION DES POSTES
  // =============================================================================

  /**
   * Recherche de postes avec filtres
   */
  rechercherPostes(filtres: FiltresPoste, page: number = 1, itemsParPage: number = 20): ResultatRecherche<Poste> {
    let postes = this.getTousLesPostes();

    // Application des filtres
    if (filtres.organisme_ids?.length) {
      postes = postes.filter(p => filtres.organisme_ids!.includes(p.organisme_id));
    }

    if (filtres.statuts?.length) {
      postes = postes.filter(p => filtres.statuts!.includes(p.statut));
    }

    if (filtres.niveaux_hierarchiques?.length) {
      postes = postes.filter(p => filtres.niveaux_hierarchiques!.includes(p.niveau_hierarchique));
    }

    if (filtres.est_strategique !== undefined) {
      postes = postes.filter(p => p.est_strategique === filtres.est_strategique);
    }

    if (filtres.competences_requises?.length) {
      postes = postes.filter(p =>
        filtres.competences_requises!.some(comp =>
          p.competences_requises.includes(comp)
        )
      );
    }

    // Pagination
    const debut = (page - 1) * itemsParPage;
    const fin = debut + itemsParPage;
    const postesPage = postes.slice(debut, fin);

    return {
      items: postesPage,
      total: postes.length,
      page,
      pages_total: Math.ceil(postes.length / itemsParPage),
      filtres_appliqués: filtres
    };
  }

  /**
   * Récupère les postes vacants prioritaires
   */
  getPostesVacantsPrioritaires(): Poste[] {
    return this.getTousLesPostes()
      .filter(p => p.statut === 'VACANT' && p.est_strategique)
      .sort((a, b) => {
        // Priorité par niveau hiérarchique
        const prioriteNiveau = { 'DIRECTION': 3, 'ENCADREMENT': 2, 'EXÉCUTION': 1 };
        return prioriteNiveau[b.niveau_hierarchique] - prioriteNiveau[a.niveau_hierarchique];
      });
  }

  /**
   * Crée un nouveau poste
   */
  creerPoste(posteData: Omit<Poste, 'id' | 'date_creation' | 'date_mise_a_jour'>): Poste {
    const nouveauPoste: Poste = {
      ...posteData,
      id: `POSTE_${Date.now()}`,
      statut: 'CRÉÉ',
      historique_affectations: [],
      date_creation: new Date().toISOString(),
      date_mise_a_jour: new Date().toISOString()
    };

    // Sauvegarde en base
    console.log('✅ Nouveau poste créé:', nouveauPoste.titre);

    // Mise à jour des statistiques de l'organisme
    this.updateStatistiquesPostes(nouveauPoste.organisme_id);

    return nouveauPoste;
  }

  /**
   * Supprime ou archive un poste
   */
  supprimerPoste(posteId: string, raison: string): void {
    const poste = this.getPosteById(posteId);
    if (!poste) throw new Error('Poste introuvable');

    if (poste.statut === 'OCCUPÉ') {
      throw new Error('Impossible de supprimer un poste occupé. Réaffecter d\'abord le titulaire.');
    }

    // Marquer comme supprimé au lieu de supprimer physiquement
    poste.statut = 'SUPPRIMÉ';
    poste.date_mise_a_jour = new Date().toISOString();

    console.log(`🗑️ Poste supprimé: ${poste.titre} - Raison: ${raison}`);

    this.updateStatistiquesPostes(poste.organisme_id);
  }

  // =============================================================================
  // 👤 GESTION DES FONCTIONNAIRES
  // =============================================================================

  /**
   * Recherche de fonctionnaires avec filtres
   */
  rechercherFonctionnaires(filtres: FiltresFonctionnaire, page: number = 1): ResultatRecherche<Personne> {
    let fonctionnaires = this.getTousLesFonctionnaires();

    // Application des filtres
    if (filtres.statuts?.length) {
      fonctionnaires = fonctionnaires.filter(f => filtres.statuts!.includes(f.statut));
    }

    if (filtres.competences?.length) {
      fonctionnaires = fonctionnaires.filter(f =>
        filtres.competences!.some(comp => f.competences.includes(comp))
      );
    }

    if (filtres.est_disponible !== undefined) {
      fonctionnaires = fonctionnaires.filter(f =>
        f.est_disponible_mutation === filtres.est_disponible ||
        f.est_disponible_promotion === filtres.est_disponible
      );
    }

    // Pagination (implémentation similaire aux postes)
    const itemsParPage = 20;
    const debut = (page - 1) * itemsParPage;
    const fin = debut + itemsParPage;

    return {
      items: fonctionnaires.slice(debut, fin),
      total: fonctionnaires.length,
      page,
      pages_total: Math.ceil(fonctionnaires.length / itemsParPage),
      filtres_appliqués: filtres
    };
  }

  /**
   * Récupère les fonctionnaires disponibles pour mutation
   */
  getFonctionnairesDisponibles(): Personne[] {
    return this.getTousLesFonctionnaires()
      .filter(f =>
        f.statut === 'DISPONIBLE' ||
        (f.statut === 'ACTIF' && f.est_disponible_mutation)
      );
  }

  /**
   * Récupère les fonctionnaires en recherche d'emploi
   */
  getFonctionnairesEnRecherche(): Personne[] {
    return this.getTousLesFonctionnaires()
      .filter(f => f.statut === 'EN_RECHERCHE');
  }

  // =============================================================================
  // 🔄 GESTION DES AFFECTATIONS
  // =============================================================================

  /**
   * Affecte une personne à un poste
   */
  affecter(personneId: string, posteId: string, affectationData: Partial<Affectation>): Affectation {
    const personne = this.getPersonneById(personneId);
    const poste = this.getPosteById(posteId);

    if (!personne || !poste) {
      throw new Error('Personne ou poste introuvable');
    }

    if (poste.statut === 'OCCUPÉ') {
      throw new Error('Poste déjà occupé');
    }

    // Terminer l'affectation actuelle de la personne si elle existe
    if (personne.affectation_actuelle) {
      this.terminerAffectation(personne.affectation_actuelle.id);
    }

    // Créer la nouvelle affectation
    const nouvelleAffectation: Affectation = {
      id: `AFF_${Date.now()}`,
      personne_id: personneId,
      poste_id: posteId,
      organisme_id: poste.organisme_id,
      type_contrat: affectationData.type_contrat || 'FONCTIONNAIRE',
      date_debut: affectationData.date_debut || new Date().toISOString(),
      modalite_affectation: affectationData.modalite_affectation || 'NOMINATION',
      decision_affectation: affectationData.decision_affectation || `DÉCISION_${Date.now()}`,
      statut: 'ACTIVE',
      est_principale: true,
      evaluations: [],
      date_creation: new Date().toISOString(),
      ...affectationData
    };

    // Mettre à jour les entités
    personne.affectation_actuelle = nouvelleAffectation;
    personne.historique_affectations.push(nouvelleAffectation.id);
    personne.statut = 'ACTIF';

    poste.affectation_actuelle = nouvelleAffectation;
    poste.historique_affectations.push(nouvelleAffectation.id);
    poste.statut = 'OCCUPÉ';

    console.log(`✅ Affectation réalisée: ${personne.nom} → ${poste.titre}`);

    // Mise à jour des statistiques
    this.updateStatistiquesPostes(poste.organisme_id);

    return nouvelleAffectation;
  }

  /**
   * Termine une affectation
   */
  terminerAffectation(affectationId: string, dateFinEffective?: string): void {
    const affectation = this.getAffectationById(affectationId);
    if (!affectation) throw new Error('Affectation introuvable');

    affectation.statut = 'TERMINÉE';
    affectation.date_fin_effective = dateFinEffective || new Date().toISOString();

    // Mettre à jour la personne et le poste
    const personne = this.getPersonneById(affectation.personne_id);
    const poste = this.getPosteById(affectation.poste_id);

    if (personne) {
      personne.affectation_actuelle = undefined;
      personne.statut = 'DISPONIBLE';
    }

    if (poste) {
      poste.affectation_actuelle = undefined;
      poste.statut = 'VACANT';
    }

    console.log(`🔚 Affectation terminée: ${affectationId}`);

    if (poste) {
      this.updateStatistiquesPostes(poste.organisme_id);
    }
  }

  // =============================================================================
  // 🔐 GESTION DES COMPTES
  // =============================================================================

  /**
   * Crée un compte personnel pour un fonctionnaire
   */
  creerComptePersonnel(personneId: string, organismeId: string): CompteUtilisateur {
    const personne = this.getPersonneById(personneId);
    if (!personne) throw new Error('Personne introuvable');

    const compte: CompteUtilisateur = {
      id: `COMPTE_PERS_${Date.now()}`,
      type: 'PERSONNEL',
      personne_id: personneId,
      organisme_id: organismeId,
      identifiant: `${personne.nom.toLowerCase()}.${personne.prenom.toLowerCase()}`,
      email: personne.email,
      mot_de_passe_hash: '', // À générer
      role: 'USER', // Par défaut
      permissions: ['READ_PROFILE', 'UPDATE_PROFILE'],
      services_accessibles: [],
      est_actif: true,
      est_verrouille: false,
      tentatives_connexion_echouees: 0,
      doit_changer_mot_de_passe: true,
      date_creation: new Date().toISOString(),
      date_mise_a_jour: new Date().toISOString(),
      créé_par: 'SYSTEM'
    };

    personne.compte_personnel_id = compte.id;

    console.log(`🔐 Compte personnel créé pour: ${personne.nom} ${personne.prenom}`);

    return compte;
  }

  /**
   * Crée un compte fonctionnel pour un poste
   */
  creerCompteFonctionnel(posteId: string): CompteUtilisateur {
    const poste = this.getPosteById(posteId);
    if (!poste) throw new Error('Poste introuvable');

    const compte: CompteUtilisateur = {
      id: `COMPTE_FONC_${Date.now()}`,
      type: 'FONCTIONNEL',
      poste_id: posteId,
      organisme_id: poste.organisme_id,
      identifiant: `${poste.code_poste || poste.id.toLowerCase()}`,
      email: `${poste.code_poste || poste.id}@${poste.organisme_id}.gov.ga`,
      mot_de_passe_hash: '', // À générer
      role: this.determinerRoleSelonPoste(poste),
      permissions: this.determinerPermissionsSelonPoste(poste),
      services_accessibles: [],
      est_actif: true,
      est_verrouille: false,
      tentatives_connexion_echouees: 0,
      doit_changer_mot_de_passe: true,
      date_creation: new Date().toISOString(),
      date_mise_a_jour: new Date().toISOString(),
      créé_par: 'SYSTEM'
    };

    poste.compte_fonctionnel_id = compte.id;

    console.log(`🔐 Compte fonctionnel créé pour le poste: ${poste.titre}`);

    return compte;
  }

  // =============================================================================
  // 💼 MARCHÉ DE L'EMPLOI PUBLIC
  // =============================================================================

  /**
   * Crée une opportunité d'emploi à partir d'un poste vacant
   */
  creerOpportuniteEmploi(posteId: string, typeProcessus: OpportuniteEmploi['type_processus']): OpportuniteEmploi {
    const poste = this.getPosteById(posteId);
    if (!poste) throw new Error('Poste introuvable');

    if (poste.statut !== 'VACANT') {
      throw new Error('Le poste doit être vacant pour créer une opportunité');
    }

    const opportunite: OpportuniteEmploi = {
      id: `OPP_${Date.now()}`,
      poste_id: posteId,
      organisme_id: poste.organisme_id,
      titre: `${poste.titre} - ${this.getOrganismeById(poste.organisme_id)?.nom}`,
      description_détaillée: this.genererDescriptionOpportunite(poste),
      type_opportunite: 'NOUVEAU_POSTE',
      type_processus: typeProcessus,
      date_ouverture: new Date().toISOString(),
      date_fermeture: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // +30 jours
      nombre_postes_ouverts: 1,
      candidatures: [],
      candidats_présélectionnés: [],
      statut: 'OUVERT',
      nombre_candidatures: 0,
      nombre_candidatures_internes: 0,
      nombre_candidatures_externes: 0
    };

    // Mettre à jour le poste avec le processus de recrutement
    poste.processus_recrutement = {
      type: typeProcessus === 'CONCOURS_EXTERNE' ? 'CONCOURS' : 'NOMINATION',
      date_ouverture: opportunite.date_ouverture,
      date_fermeture: opportunite.date_fermeture,
      nombre_candidats: 0,
      statut: 'OUVERT'
    };

    console.log(`💼 Opportunité d'emploi créée: ${opportunite.titre}`);

    return opportunite;
  }

  /**
   * Soumets une candidature à une opportunité
   */
  soumettreCandidature(opportuniteId: string, personneId: string, motivation: string): Candidature {
    const opportunite = this.getOpportuniteById(opportuniteId);
    const personne = this.getPersonneById(personneId);

    if (!opportunite || !personne) {
      throw new Error('Opportunité ou personne introuvable');
    }

    if (opportunite.statut !== 'OUVERT') {
      throw new Error('Cette opportunité n\'est plus ouverte aux candidatures');
    }

    // Vérifier si la personne a déjà candidaté
    const candidatureExistante = opportunite.candidatures.find(c => c.personne_id === personneId);
    if (candidatureExistante) {
      throw new Error('Cette personne a déjà candidaté à cette opportunité');
    }

    const candidature: Candidature = {
      id: `CAND_${Date.now()}`,
      opportunite_id: opportuniteId,
      personne_id: personneId,
      type_candidature: personne.statut === 'ACTIF' ? 'INTERNE' : 'EXTERNE',
      motivation,
      documents_fournis: [],
      statut: 'SOUMISE',
      date_soumission: new Date().toISOString()
    };

    opportunite.candidatures.push(candidature);
    opportunite.nombre_candidatures++;

    if (candidature.type_candidature === 'INTERNE') {
      opportunite.nombre_candidatures_internes++;
    } else {
      opportunite.nombre_candidatures_externes++;
    }

    console.log(`📝 Candidature soumise: ${personne.nom} → ${opportunite.titre}`);

    return candidature;
  }

  /**
   * Trouve des candidats potentiels pour un poste
   */
  trouverCandidatsPotentiels(posteId: string): Personne[] {
    const poste = this.getPosteById(posteId);
    if (!poste) return [];

    const fonctionnairesDisponibles = this.getFonctionnairesDisponibles();

    // Matching par compétences
    return fonctionnairesDisponibles
      .filter(f => {
        // Vérifier les compétences
        const competencesCommunes = f.competences.filter(comp =>
          poste.competences_requises.includes(comp)
        );

        // Au moins 30% de compétences en commun
        return competencesCommunes.length >= (poste.competences_requises.length * 0.3);
      })
      .sort((a, b) => {
        // Trier par pourcentage de compétences correspondantes
        const scoreA = a.competences.filter(comp =>
          poste.competences_requises.includes(comp)
        ).length / poste.competences_requises.length;

        const scoreB = b.competences.filter(comp =>
          poste.competences_requises.includes(comp)
        ).length / poste.competences_requises.length;

        return scoreB - scoreA;
      });
  }

  // =============================================================================
  // 📊 STATISTIQUES ET TABLEAUX DE BORD
  // =============================================================================

  /**
   * Génère les statistiques globales de l'emploi public
   */
  getStatistiquesEmploi(): StatistiquesEmploi {
    const organismes = this.getOrganismes();
    const postes = this.getTousLesPostes();
    const fonctionnaires = this.getTousLesFonctionnaires();
    const opportunites = this.getToutesLesOpportunites();

    const postesOccupés = postes.filter(p => p.statut === 'OCCUPÉ');
    const postesVacants = postes.filter(p => p.statut === 'VACANT');

    return {
      global: {
        total_organismes: organismes.length,
        total_postes: postes.length,
        total_fonctionnaires: fonctionnaires.length,
        taux_occupation: (postesOccupés.length / postes.length) * 100,
        postes_vacants: postesVacants.length,
        fonctionnaires_disponibles: this.getFonctionnairesDisponibles().length
      },

      par_organisme: organismes.reduce((acc, org) => {
        const postesOrg = postes.filter(p => p.organisme_id === org.id);
        const postesOccupésOrg = postesOrg.filter(p => p.statut === 'OCCUPÉ');

        acc[org.id] = {
          nom: org.nom,
          postes_total: postesOrg.length,
          postes_occupés: postesOccupésOrg.length,
          postes_vacants: postesOrg.length - postesOccupésOrg.length,
          taux_occupation: postesOrg.length > 0 ? (postesOccupésOrg.length / postesOrg.length) * 100 : 0
        };

        return acc;
      }, {} as Record<string, any>),

      par_niveau: (['DIRECTION', 'ENCADREMENT', 'EXÉCUTION'] as NiveauHierarchique[]).reduce((acc, niveau) => {
        const postesNiveau = postes.filter(p => p.niveau_hierarchique === niveau);
        const postesOccupésNiveau = postesNiveau.filter(p => p.statut === 'OCCUPÉ');

        acc[niveau] = {
          postes_total: postesNiveau.length,
          postes_occupés: postesOccupésNiveau.length,
          postes_vacants: postesNiveau.length - postesOccupésNiveau.length,
          candidatures_en_cours: opportunites.filter(o =>
            o.statut === 'OUVERT' &&
            this.getPosteById(o.poste_id)?.niveau_hierarchique === niveau
          ).reduce((total, opp) => total + opp.nombre_candidatures, 0)
        };

        return acc;
      }, {} as Record<NiveauHierarchique, any>),

      marché_emploi: {
        opportunités_ouvertes: opportunites.filter(o => o.statut === 'OUVERT').length,
        candidatures_en_cours: opportunites.reduce((total, opp) => total + opp.nombre_candidatures, 0),
        postes_pourvus_mois: 45, // Simulation
        délai_moyen_pourvoi: 28, // Simulation en jours
        taux_succès_interne: 65, // Simulation en pourcentage
        taux_succès_externe: 35 // Simulation en pourcentage
      }
    };
  }

  // =============================================================================
  // 🛠️ MÉTHODES UTILITAIRES (Simulations - à remplacer par la vraie DB)
  // =============================================================================

  private getOrganismesSimulés(): Organisme[] {
    // Retourne une simulation des 141 organismes avec leurs stats
    return [];
  }

  private getTousLesPostes(): Poste[] {
    // Simulation des ~2,500 postes
    return [];
  }

  private getTousLesFonctionnaires(): Personne[] {
    // Simulation des fonctionnaires
    return [];
  }

  private getToutesLesOpportunites(): OpportuniteEmploi[] {
    // Simulation des opportunités d'emploi
    return [];
  }

  private getPostesByOrganisme(organismeId: string): Poste[] {
    return this.getTousLesPostes().filter(p => p.organisme_id === organismeId);
  }

  private getPosteById(id: string): Poste | undefined {
    return this.getTousLesPostes().find(p => p.id === id);
  }

  private getPersonneById(id: string): Personne | undefined {
    return this.getTousLesFonctionnaires().find(p => p.id === id);
  }

  private getOrganismeById(id: string): Organisme | undefined {
    return this.getOrganismes().find(o => o.id === id);
  }

  private getAffectationById(id: string): Affectation | undefined {
    // Simulation - à implémenter avec la vraie DB
    return undefined;
  }

  private getOpportuniteById(id: string): OpportuniteEmploi | undefined {
    return this.getToutesLesOpportunites().find(o => o.id === id);
  }

  private determinerRoleSelonPoste(poste: Poste): any {
    // Logique pour déterminer le rôle selon le niveau du poste
    switch (poste.niveau_hierarchique) {
      case 'DIRECTION': return 'ADMIN';
      case 'ENCADREMENT': return 'MANAGER';
      case 'EXÉCUTION': return 'USER';
      default: return 'USER';
    }
  }

  private determinerPermissionsSelonPoste(poste: Poste): string[] {
    // Permissions par défaut selon le niveau
    const basePermissions = ['READ_PROFILE', 'UPDATE_PROFILE'];

    if (poste.niveau_hierarchique === 'DIRECTION') {
      return [...basePermissions, 'MANAGE_TEAM', 'APPROVE_DECISIONS', 'VIEW_REPORTS'];
    }

    if (poste.niveau_hierarchique === 'ENCADREMENT') {
      return [...basePermissions, 'MANAGE_TEAM', 'VIEW_REPORTS'];
    }

    return basePermissions;
  }

  private genererDescriptionOpportunite(poste: Poste): string {
    return `
        Poste: ${poste.titre}
Niveau: ${poste.niveau_hierarchique}
${poste.est_strategique ? 'POSTE STRATÉGIQUE' : ''}

Description: ${poste.description}

Compétences requises:
${poste.competences_requises.map(comp => `- ${comp}`).join('\n')}

Diplômes requis:
${poste.diplomes_requis.map(dip => `- ${dip}`).join('\n')}

Expérience minimale: ${poste.experience_minimale} ans
    `.trim();
  }
}

// Instance singleton
export const posteManagementService = new PosteManagementService();
