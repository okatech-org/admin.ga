/**
 * MODULE D'EXTENSIONS POUR LE SYSTÈME COMPLET
 * Permet d'ajouter des organismes, postes et utilisateurs personnalisés
 * aux 141 organismes officiels gabonais
 */

import {
  OrganismePublic,
  PosteAdministratif,
  UtilisateurOrganisme,
  TypeOrganisme,
  Grade,
  SystemeComplet,
  ORGANISMES_PUBLICS,
  POSTES_PAR_TYPE,
  POSTES_COMMUNS,
  creerUtilisateursOrganisme,
  genererEmail,
  genererTelephone,
  implementerSystemeComplet
} from './systeme-complet-gabon';

// ==================== TYPES POUR LES EXTENSIONS ====================

export interface OrganismePersonnalise extends Partial<OrganismePublic> {
  nom: string;
  code: string;
  type: TypeOrganisme;
}

export interface PostePersonnalise extends Partial<PosteAdministratif> {
  titre: string;
  code: string;
  niveau: number;
  organisme_types: TypeOrganisme[];
}

export interface ExtensionsSysteme {
  organismesPersonnalises: OrganismePublic[];
  postesPersonnalises: PosteAdministratif[];
  utilisateursSupplementaires: UtilisateurOrganisme[];
  statistiques: {
    organismesAjoutes: number;
    postesAjoutes: number;
    utilisateursAjoutes: number;
    totalOrganismesAvecExtensions: number;
    totalUtilisateursAvecExtensions: number;
  };
}

// ==================== GESTIONNAIRE D'EXTENSIONS ====================

class GestionnaireExtensions {
  private organismesPersonnalises: OrganismePublic[] = [];
  private postesPersonnalises: Map<TypeOrganisme, PosteAdministratif[]> = new Map();
  private utilisateursSupplementaires: UtilisateurOrganisme[] = [];
  private compteurOrganismes = 1;
  private compteurPostes = 1;
  private compteurUtilisateurs = 1;

  // ==================== AJOUT D'ORGANISMES ====================

  /**
   * Ajouter un organisme personnalisé au système
   */
  ajouterOrganismePersonnalise(params: OrganismePersonnalise): OrganismePublic {
    const organisme: OrganismePublic = {
      id: params.id || `org_custom_${String(this.compteurOrganismes).padStart(3, '0')}`,
      code: params.code.toUpperCase().replace(/[^A-Z0-9_]/g, '_'),
      nom: params.nom,
      type: params.type,
      statut: params.statut || 'ACTIF',
      email_contact: params.email_contact || `contact@${params.code.toLowerCase().replace(/_/g, '-')}.ga`,
      telephone: params.telephone || genererTelephone(),
      adresse: params.adresse || 'Libreville, Gabon',
      couleur_principale: params.couleur_principale || this.getCouleurParType(params.type),
      site_web: params.site_web,
      logo: params.logo,
      description: params.description || `${params.nom} - Organisme personnalisé`
    };

    // Vérifier que le code n'existe pas déjà
    const codeExiste = [...ORGANISMES_PUBLICS, ...this.organismesPersonnalises]
      .some(o => o.code === organisme.code);

    if (codeExiste) {
      throw new Error(`Le code d'organisme "${organisme.code}" existe déjà`);
    }

    this.organismesPersonnalises.push(organisme);
    this.compteurOrganismes++;

    console.log(`✅ Organisme personnalisé ajouté: ${organisme.nom} (${organisme.code})`);
    return organisme;
  }

  /**
   * Ajouter plusieurs organismes en une fois
   */
  ajouterOrganismesEnMasse(organismes: OrganismePersonnalise[]): OrganismePublic[] {
    return organismes.map(org => this.ajouterOrganismePersonnalise(org));
  }

  // ==================== AJOUT DE POSTES ====================

  /**
   * Ajouter un poste personnalisé pour un type d'organisme
   */
  ajouterPostePersonnalise(params: PostePersonnalise): PosteAdministratif {
    const poste: PosteAdministratif = {
      id: params.id || `custom_poste_${String(this.compteurPostes).padStart(2, '0')}`,
      titre: params.titre,
      code: params.code.toUpperCase(),
      niveau: params.niveau,
      grade_requis: params.grade_requis || ['A1', 'A2'],
      organisme_types: params.organisme_types,
      salaire_base: params.salaire_base || 600000,
      salaire_max: params.salaire_max || params.salaire_base ? params.salaire_base * 1.5 : 900000,
      responsabilites: params.responsabilites || [],
      prerequis: params.prerequis || [],
      avantages: params.avantages || ['Assurance santé', 'Congés payés']
    };

    // Ajouter le poste pour chaque type d'organisme spécifié
    params.organisme_types.forEach(type => {
      if (!this.postesPersonnalises.has(type)) {
        this.postesPersonnalises.set(type, []);
      }
      this.postesPersonnalises.get(type)!.push(poste);
    });

    this.compteurPostes++;
    console.log(`✅ Poste personnalisé ajouté: ${poste.titre} pour ${params.organisme_types.join(', ')}`);
    return poste;
  }

  /**
   * Ajouter plusieurs postes en une fois
   */
  ajouterPostesEnMasse(postes: PostePersonnalise[]): PosteAdministratif[] {
    return postes.map(poste => this.ajouterPostePersonnalise(poste));
  }

  // ==================== GÉNÉRATION D'UTILISATEURS SUPPLÉMENTAIRES ====================

  /**
   * Générer des utilisateurs supplémentaires pour un organisme
   */
  genererUtilisateursSupplementaires(
    organismeCode: string,
    nombre: number,
    roles?: Array<'ADMIN' | 'USER' | 'RECEPTIONIST'>
  ): UtilisateurOrganisme[] {
    // Chercher l'organisme dans tous les organismes disponibles
    const organisme = this.getTousLesOrganismes().find(o => o.code === organismeCode);

    if (!organisme) {
      throw new Error(`Organisme avec le code "${organismeCode}" non trouvé`);
    }

    const nouveauxUtilisateurs: UtilisateurOrganisme[] = [];

    for (let i = 0; i < nombre; i++) {
      // Créer des utilisateurs de base
      const utilisateursBase = creerUtilisateursOrganisme(organisme, this.compteurUtilisateurs + i);

      // Filtrer par rôles si spécifiés
      if (roles && roles.length > 0) {
        const utilisateursFiltres = utilisateursBase.filter(u => roles.includes(u.role));

        // Modifier les IDs pour éviter les doublons
        utilisateursFiltres.forEach((user, index) => {
          user.id = `${user.id}_supp_${this.compteurUtilisateurs}_${index}`;
          user.email = user.email.replace('@', `_${this.compteurUtilisateurs}_${index}@`);
        });

        nouveauxUtilisateurs.push(...utilisateursFiltres);
      } else {
        // Ajouter tous les utilisateurs générés avec IDs modifiés
        utilisateursBase.forEach((user, index) => {
          user.id = `${user.id}_supp_${this.compteurUtilisateurs}_${index}`;
          user.email = user.email.replace('@', `_${this.compteurUtilisateurs}_${index}@`);
        });
        nouveauxUtilisateurs.push(...utilisateursBase);
      }

      this.compteurUtilisateurs++;
    }

    this.utilisateursSupplementaires.push(...nouveauxUtilisateurs);

    console.log(`✅ ${nouveauxUtilisateurs.length} utilisateurs supplémentaires générés pour ${organisme.nom}`);
    return nouveauxUtilisateurs;
  }

  /**
   * Générer des utilisateurs en masse pour plusieurs organismes
   */
  genererUtilisateursEnMasse(
    config: Array<{ organismeCode: string; nombre: number; roles?: Array<'ADMIN' | 'USER' | 'RECEPTIONIST'> }>
  ): UtilisateurOrganisme[] {
    const tousLesUtilisateurs: UtilisateurOrganisme[] = [];

    config.forEach(({ organismeCode, nombre, roles }) => {
      try {
        const utilisateurs = this.genererUtilisateursSupplementaires(organismeCode, nombre, roles);
        tousLesUtilisateurs.push(...utilisateurs);
      } catch (error) {
        console.error(`Erreur pour ${organismeCode}:`, error);
      }
    });

    return tousLesUtilisateurs;
  }

  // ==================== FONCTIONS UTILITAIRES ====================

  /**
   * Obtenir une couleur par défaut selon le type
   */
  private getCouleurParType(type: TypeOrganisme): string {
    const couleurs: Record<TypeOrganisme, string> = {
      'INSTITUTION_SUPREME': '#0033A0',
      'MINISTERE': '#006633',
      'DIRECTION_GENERALE': '#228B22',
      'ETABLISSEMENT_PUBLIC': '#FFD700',
      'ENTREPRISE_PUBLIQUE': '#FF8C00',
      'ETABLISSEMENT_SANTE': '#DC143C',
      'UNIVERSITE': '#4B0082',
      'GOUVERNORAT': '#2E8B57',
      'PREFECTURE': '#8B4513',
      'MAIRIE': '#5F9EA0',
      'AUTORITE_REGULATION': '#4169E1',
      'FORCE_SECURITE': '#8B0000'
    };
    return couleurs[type] || '#808080';
  }

  /**
   * Obtenir tous les organismes (officiels + personnalisés)
   */
  getTousLesOrganismes(): OrganismePublic[] {
    return [...ORGANISMES_PUBLICS, ...this.organismesPersonnalises];
  }

  /**
   * Obtenir tous les postes pour un type d'organisme
   */
  getTousLesPostes(type: TypeOrganisme): PosteAdministratif[] {
    const postesBase = POSTES_PAR_TYPE[type] || [];
    const postesPersonnalises = this.postesPersonnalises.get(type) || [];
    return [...postesBase, ...postesPersonnalises, ...POSTES_COMMUNS];
  }

  /**
   * Obtenir tous les utilisateurs (base + supplémentaires)
   */
  async getTousLesUtilisateurs(): Promise<UtilisateurOrganisme[]> {
    // Générer le système de base
    const systemeBase = await implementerSystemeComplet();

    // Générer les utilisateurs pour les organismes personnalisés
    const utilisateursOrganismesPersonnalises: UtilisateurOrganisme[] = [];
    this.organismesPersonnalises.forEach((org, index) => {
      const utilisateurs = creerUtilisateursOrganisme(org, 1000 + index);
      utilisateursOrganismesPersonnalises.push(...utilisateurs);
    });

    // Combiner tous les utilisateurs
    return [
      ...systemeBase.utilisateurs,
      ...utilisateursOrganismesPersonnalises,
      ...this.utilisateursSupplementaires
    ];
  }

  // ==================== EXPORT DU SYSTÈME ÉTENDU ====================

  /**
   * Obtenir le système complet avec extensions
   */
  async obtenirSystemeEtendu(): Promise<SystemeComplet & ExtensionsSysteme> {
    const systemeBase = await implementerSystemeComplet();
    const tousLesUtilisateurs = await this.getTousLesUtilisateurs();
    const tousLesOrganismes = this.getTousLesOrganismes();

    // Calculer les nouvelles statistiques
    const statistiquesEtendues = {
      ...systemeBase.statistiques,
      totalOrganismes: tousLesOrganismes.length,
      totalUtilisateurs: tousLesUtilisateurs.length,
      organismesAjoutes: this.organismesPersonnalises.length,
      postesAjoutes: Array.from(this.postesPersonnalises.values()).flat().length,
      utilisateursAjoutes: this.utilisateursSupplementaires.length,
      totalOrganismesAvecExtensions: tousLesOrganismes.length,
      totalUtilisateursAvecExtensions: tousLesUtilisateurs.length
    };

    return {
      organismes: tousLesOrganismes,
      postes: [...systemeBase.postes, ...Array.from(this.postesPersonnalises.values()).flat()],
      utilisateurs: tousLesUtilisateurs,
      statistiques: statistiquesEtendues,
      organismesPersonnalises: this.organismesPersonnalises,
      postesPersonnalises: Array.from(this.postesPersonnalises.values()).flat(),
      utilisateursSupplementaires: this.utilisateursSupplementaires
    };
  }

  /**
   * Obtenir un résumé des extensions
   */
  obtenirResume(): ExtensionsSysteme['statistiques'] {
    return {
      organismesAjoutes: this.organismesPersonnalises.length,
      postesAjoutes: Array.from(this.postesPersonnalises.values()).flat().length,
      utilisateursAjoutes: this.utilisateursSupplementaires.length,
      totalOrganismesAvecExtensions: this.getTousLesOrganismes().length,
      totalUtilisateursAvecExtensions: this.utilisateursSupplementaires.length
    };
  }

  /**
   * Réinitialiser toutes les extensions
   */
  reinitialiser(): void {
    this.organismesPersonnalises = [];
    this.postesPersonnalises.clear();
    this.utilisateursSupplementaires = [];
    this.compteurOrganismes = 1;
    this.compteurPostes = 1;
    this.compteurUtilisateurs = 1;
    console.log('🔄 Extensions réinitialisées');
  }
}

// ==================== INSTANCE SINGLETON ====================

export const extensionsSysteme = new GestionnaireExtensions();

// ==================== FONCTIONS D'API SIMPLIFIÉES ====================

/**
 * Ajouter un organisme personnalisé (API simplifiée)
 */
export function ajouterOrganismePersonnalise(params?: Partial<OrganismePersonnalise>): OrganismePublic {
  const defaultParams: OrganismePersonnalise = {
    nom: params?.nom || 'Nouvel Organisme',
    code: params?.code || 'CUSTOM_ORG',
    type: params?.type || 'ETABLISSEMENT_PUBLIC',
    statut: 'ACTIF',
    email_contact: params?.email_contact || 'contact@custom.ga',
    couleur_principale: params?.couleur_principale || '#FF6347'
  };

  return extensionsSysteme.ajouterOrganismePersonnalise(defaultParams);
}

/**
 * Ajouter un poste personnalisé (API simplifiée)
 */
export function ajouterPostePersonnalise(params?: Partial<PostePersonnalise>): PosteAdministratif {
  const defaultParams: PostePersonnalise = {
    titre: params?.titre || 'Responsable Innovation',
    code: params?.code || 'RI',
    niveau: params?.niveau || 2,
    grade_requis: params?.grade_requis || ['A1', 'A2'],
    organisme_types: params?.organisme_types || ['ETABLISSEMENT_PUBLIC'],
    salaire_base: params?.salaire_base || 800000,
    responsabilites: params?.responsabilites || ['Innovation', 'Transformation digitale'],
    prerequis: params?.prerequis || ['Master', '5+ ans expérience tech']
  };

  return extensionsSysteme.ajouterPostePersonnalise(defaultParams);
}

/**
 * Générer des utilisateurs supplémentaires (API simplifiée)
 */
export function genererUtilisateursSupplementaires(
  organismeCode: string,
  nombre: number,
  roles?: Array<'ADMIN' | 'USER' | 'RECEPTIONIST'>
): UtilisateurOrganisme[] {
  return extensionsSysteme.genererUtilisateursSupplementaires(organismeCode, nombre, roles);
}

// ==================== EXEMPLES D'UTILISATION ====================

/**
 * Exemple : Créer un écosystème d'innovation
 */
export function creerEcosystemeInnovation(): void {
  console.log('\n🚀 Création de l\'écosystème d\'innovation...\n');

  // 1. Ajouter des organismes d'innovation
  const organismes = [
    {
      nom: 'Agence Nationale de l\'Innovation',
      code: 'ANI_GABON',
      type: 'ETABLISSEMENT_PUBLIC' as TypeOrganisme,
      description: 'Agence dédiée à la promotion de l\'innovation au Gabon'
    },
    {
      nom: 'Centre de Transformation Digitale',
      code: 'CTD_GABON',
      type: 'ETABLISSEMENT_PUBLIC' as TypeOrganisme,
      description: 'Centre d\'excellence pour la transformation digitale'
    },
    {
      nom: 'Incubateur National des Startups',
      code: 'INS_GABON',
      type: 'ENTREPRISE_PUBLIQUE' as TypeOrganisme,
      description: 'Structure d\'accompagnement des startups gabonaises'
    }
  ];

  const organismesAjoutes = extensionsSysteme.ajouterOrganismesEnMasse(organismes);

  // 2. Ajouter des postes spécialisés
  const postes = [
    {
      titre: 'Chief Innovation Officer',
      code: 'CIO',
      niveau: 1,
      organisme_types: ['ETABLISSEMENT_PUBLIC', 'ENTREPRISE_PUBLIQUE'] as TypeOrganisme[],
      salaire_base: 1500000
    },
    {
      titre: 'Data Scientist',
      code: 'DS',
      niveau: 2,
      organisme_types: ['ETABLISSEMENT_PUBLIC'] as TypeOrganisme[],
      salaire_base: 1000000
    },
    {
      titre: 'Startup Manager',
      code: 'SM',
      niveau: 2,
      organisme_types: ['ENTREPRISE_PUBLIQUE'] as TypeOrganisme[],
      salaire_base: 900000
    }
  ];

  extensionsSysteme.ajouterPostesEnMasse(postes);

  // 3. Générer des équipes pour ces organismes
  organismesAjoutes.forEach(org => {
    extensionsSysteme.genererUtilisateursSupplementaires(org.code, 2, ['USER']);
  });

  console.log('\n✅ Écosystème d\'innovation créé avec succès!');
  const resume = extensionsSysteme.obtenirResume();
  console.log(`   • ${resume.organismesAjoutes} organismes ajoutés`);
  console.log(`   • ${resume.postesAjoutes} postes créés`);
  console.log(`   • ${resume.utilisateursAjoutes} utilisateurs générés`);
}

/**
 * Exemple : Renforcer les ministères avec du personnel supplémentaire
 */
export function renforcerMinisteres(): void {
  console.log('\n💪 Renforcement des ministères...\n');

  // Ajouter 3 utilisateurs supplémentaires pour les ministères principaux
  const ministeresARenforcer = [
    'MIN_ECO_FIN',     // Économie et Finances
    'MIN_SANTE',       // Santé
    'MIN_EDUCATION',   // Éducation
    'MIN_INTERIEUR',   // Intérieur
    'MIN_JUSTICE'      // Justice
  ];

  const config = ministeresARenforcer.map(code => ({
    organismeCode: code,
    nombre: 3,
    roles: ['USER'] as Array<'USER'>
  }));

  const utilisateursAjoutes = extensionsSysteme.genererUtilisateursEnMasse(config);

  console.log(`✅ ${utilisateursAjoutes.length} agents supplémentaires ajoutés aux ministères`);
}

// ==================== EXPORT ====================

export default extensionsSysteme;
