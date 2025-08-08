/**
 * Service de gestion des relations hiérarchiques entre organismes
 * ADMINISTRATION.GA - Système intelligent de classification
 */

import { OrganismeGabonais } from '../data/gabon-organismes-141';

export interface RelationHierarchique {
  parentId: string;
  enfantId: string;
  type: 'rattachement' | 'supervision' | 'coordination' | 'tutelle';
  niveau_relation: number;
  description?: string;
}

export interface GrapheHierarchique {
  noeud: OrganismeGabonais;
  enfants: GrapheHierarchique[];
  niveau: number;
}

export class OrganismesHierarchieService {

  /**
   * Construire l'arbre hiérarchique complet
   */
  static construireArbreHierarchique(organismes: OrganismeGabonais[]): GrapheHierarchique[] {
    const mapOrganismes = new Map(organismes.map(org => [org.id, org]));
    const racines: GrapheHierarchique[] = [];
    const noeudsTraites = new Set<string>();

    // Construire les relations parent-enfant
    const enfantsParParent = new Map<string, OrganismeGabonais[]>();

    organismes.forEach(org => {
      if (org.parentId) {
        if (!enfantsParParent.has(org.parentId)) {
          enfantsParParent.set(org.parentId, []);
        }
        enfantsParParent.get(org.parentId)!.push(org);
      }
    });

    // Fonction récursive pour construire l'arbre
    function construireNoeud(organisme: OrganismeGabonais, niveau: number): GrapheHierarchique {
      const enfants = enfantsParParent.get(organisme.id) || [];

      return {
        noeud: organisme,
        enfants: enfants.map(enfant => construireNoeud(enfant, niveau + 1)),
        niveau
      };
    }

    // Identifier les organismes racines (sans parent)
    organismes.forEach(org => {
      if (!org.parentId && !noeudsTraites.has(org.id)) {
        const noeudRacine = construireNoeud(org, org.niveau_hierarchique);
        racines.push(noeudRacine);

        // Marquer tous les descendants comme traités
        function marquerDescendants(noeud: GrapheHierarchique) {
          noeudsTraites.add(noeud.noeud.id);
          noeud.enfants.forEach(marquerDescendants);
        }
        marquerDescendants(noeudRacine);
      }
    });

    return racines;
  }

  /**
   * Générer les relations hiérarchiques pour la base de données
   */
  static genererRelations(organismes: OrganismeGabonais[]): RelationHierarchique[] {
    const relations: RelationHierarchique[] = [];

    organismes.forEach(organisme => {
      if (organisme.parentId) {
        // Déterminer le type de relation selon le type d'organisme
        let typeRelation: RelationHierarchique['type'] = 'rattachement';
        let description = '';

        if (organisme.type.includes('DIRECTION_CENTRALE')) {
          typeRelation = 'rattachement';
          description = 'Direction centrale rattachée au ministère';
        } else if (organisme.type === 'DIRECTION_GENERALE') {
          typeRelation = 'supervision';
          description = 'Direction générale sous supervision ministérielle';
        } else if (organisme.type === 'PREFECTURE') {
          typeRelation = 'coordination';
          description = 'Préfecture coordonnée par le gouvernorat';
        } else if (organisme.groupe === 'A') {
          typeRelation = 'supervision';
          description = 'Service présidentiel sous supervision directe';
        }

        relations.push({
          parentId: organisme.parentId,
          enfantId: organisme.id,
          type: typeRelation,
          niveau_relation: organisme.niveau_hierarchique,
          description
        });
      }
    });

    return relations;
  }

  /**
   * Analyser la cohérence hiérarchique
   */
  static analyserCoherenceHierarchique(organismes: OrganismeGabonais[]): {
    coherent: boolean;
    erreurs: string[];
    statistiques: Record<string, number>;
  } {
    const erreurs: string[] = [];
    const statistiques: Record<string, number> = {};

    // Vérifier les organismes orphelins (avec parentId inexistant)
    const idsExistants = new Set(organismes.map(org => org.id));
    const orphelins = organismes.filter(org =>
      org.parentId && !idsExistants.has(org.parentId)
    );

    if (orphelins.length > 0) {
      erreurs.push(`${orphelins.length} organismes orphelins détectés`);
      orphelins.forEach(org => {
        erreurs.push(`  - ${org.name} (${org.code}) référence un parent inexistant: ${org.parentId}`);
      });
    }

    // Vérifier les cycles hiérarchiques
    const cyclesDetectes = this.detecterCycles(organismes);
    if (cyclesDetectes.length > 0) {
      erreurs.push(`${cyclesDetectes.length} cycles hiérarchiques détectés`);
      cyclesDetectes.forEach(cycle => {
        erreurs.push(`  - Cycle: ${cycle.join(' -> ')}`);
      });
    }

    // Statistiques par groupe
    const parGroupe = organismes.reduce((acc, org) => {
      acc[org.groupe] = (acc[org.groupe] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    statistiques['groupes'] = Object.keys(parGroupe).length;
    Object.entries(parGroupe).forEach(([groupe, count]) => {
      statistiques[`groupe_${groupe}`] = count;
    });

    // Statistiques par niveau hiérarchique
    const parNiveau = organismes.reduce((acc, org) => {
      acc[org.niveau_hierarchique] = (acc[org.niveau_hierarchique] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    statistiques['niveaux_hierarchiques'] = Object.keys(parNiveau).length;
    Object.entries(parNiveau).forEach(([niveau, count]) => {
      statistiques[`niveau_${niveau}`] = count;
    });

    // Organismes principaux
    statistiques['organismes_principaux'] = organismes.filter(org => org.est_organisme_principal).length;

    return {
      coherent: erreurs.length === 0,
      erreurs,
      statistiques
    };
  }

  /**
   * Détecter les cycles dans la hiérarchie
   */
  private static detecterCycles(organismes: OrganismeGabonais[]): string[][] {
    const cycles: string[][] = [];
    const visites = new Set<string>();
    const enCours = new Set<string>();
    const mapOrganismes = new Map(organismes.map(org => [org.id, org]));

    function dfs(orgId: string, chemin: string[]): void {
      if (enCours.has(orgId)) {
        // Cycle détecté
        const indexCycle = chemin.indexOf(orgId);
        if (indexCycle !== -1) {
          cycles.push(chemin.slice(indexCycle).concat([orgId]));
        }
        return;
      }

      if (visites.has(orgId)) {
        return;
      }

      visites.add(orgId);
      enCours.add(orgId);

      const organisme = mapOrganismes.get(orgId);
      if (organisme?.parentId) {
        dfs(organisme.parentId, [...chemin, orgId]);
      }

      enCours.delete(orgId);
    }

    organismes.forEach(org => {
      if (!visites.has(org.id)) {
        dfs(org.id, []);
      }
    });

    return cycles;
  }

  /**
   * Obtenir les descendants d'un organisme
   */
  static obtenirDescendants(organismeId: string, organismes: OrganismeGabonais[]): OrganismeGabonais[] {
    const descendants: OrganismeGabonais[] = [];

    function collecterDescendants(parentId: string) {
      organismes.forEach(org => {
        if (org.parentId === parentId) {
          descendants.push(org);
          collecterDescendants(org.id);
        }
      });
    }

    collecterDescendants(organismeId);
    return descendants;
  }

  /**
   * Obtenir les ascendants d'un organisme
   */
  static obtenirAscendants(organismeId: string, organismes: OrganismeGabonais[]): OrganismeGabonais[] {
    const ascendants: OrganismeGabonais[] = [];
    const mapOrganismes = new Map(organismes.map(org => [org.id, org]));

    let currentOrg = mapOrganismes.get(organismeId);
    while (currentOrg?.parentId) {
      const parent = mapOrganismes.get(currentOrg.parentId);
      if (parent) {
        ascendants.push(parent);
        currentOrg = parent;
      } else {
        break;
      }
    }

    return ascendants;
  }

  /**
   * Filtrer les organismes par critères
   */
  static filtrerOrganismes(
    organismes: OrganismeGabonais[],
    criteres: {
      type?: string;
      groupe?: string;
      ville?: string;
      niveauHierarchique?: number;
      estOrganismePrincipal?: boolean;
      province?: string;
    }
  ): OrganismeGabonais[] {
    return organismes.filter(org => {
      if (criteres.type && org.type !== criteres.type) return false;
      if (criteres.groupe && org.groupe !== criteres.groupe) return false;
      if (criteres.ville && org.city !== criteres.ville) return false;
      if (criteres.niveauHierarchique && org.niveau_hierarchique !== criteres.niveauHierarchique) return false;
      if (criteres.estOrganismePrincipal !== undefined && org.est_organisme_principal !== criteres.estOrganismePrincipal) return false;
      if (criteres.province && org.province !== criteres.province) return false;

      return true;
    });
  }

  /**
   * Générer un rapport hiérarchique complet
   */
  static genererRapportHierarchique(organismes: OrganismeGabonais[]): {
    arbre: GrapheHierarchique[];
    relations: RelationHierarchique[];
    analyse: ReturnType<typeof OrganismesHierarchieService.analyserCoherenceHierarchique>;
    resume: {
      totalOrganismes: number;
      organismesPrincipaux: number;
      niveauxHierarchiques: number;
      groupesAdministratifs: number;
      villesCouvertes: number;
    };
  } {
    const arbre = this.construireArbreHierarchique(organismes);
    const relations = this.genererRelations(organismes);
    const analyse = this.analyserCoherenceHierarchique(organismes);

    const villesUniques = new Set(organismes.map(org => org.city));
    const niveauxUniques = new Set(organismes.map(org => org.niveau_hierarchique));
    const groupesUniques = new Set(organismes.map(org => org.groupe));

    return {
      arbre,
      relations,
      analyse,
      resume: {
        totalOrganismes: organismes.length,
        organismesPrincipaux: organismes.filter(org => org.est_organisme_principal).length,
        niveauxHierarchiques: niveauxUniques.size,
        groupesAdministratifs: groupesUniques.size,
        villesCouvertes: villesUniques.size
      }
    };
  }
}
