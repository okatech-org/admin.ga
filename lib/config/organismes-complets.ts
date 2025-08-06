/**
 * Wrapper pour les organismes complets - Compatibility layer
 */

import { OrganismeGabonais, getOrganismesComplets, STATISTIQUES_ORGANISMES } from '@/lib/data/gabon-organismes-141';

// Type alias pour compatibilité
export type OrganismeComplet = OrganismeGabonais;

// Export principal
export const ORGANISMES_GABONAIS_COMPLETS = getOrganismesComplets();

// Fonctions utilitaires
export function getOrganismeComplet(id: string): OrganismeComplet | undefined {
  return ORGANISMES_GABONAIS_COMPLETS.find(org => org.id === id);
}

export function getOrganismesByType(type: string): OrganismeComplet[] {
  return ORGANISMES_GABONAIS_COMPLETS.filter(org => org.type === type);
}

export function getOrganismesByNiveau(niveau: number): OrganismeComplet[] {
  return ORGANISMES_GABONAIS_COMPLETS.filter(org => org.niveau_hierarchique === niveau);
}

export function getOrganismesByParent(parentId: string): OrganismeComplet[] {
  return ORGANISMES_GABONAIS_COMPLETS.filter(org => org.parentId === parentId);
}

export function getStatistiquesOrganismes() {
  return STATISTIQUES_ORGANISMES;
}

// Fonctions de relations - stubs pour compatibilité
export function getRelationsHierarchiques(organismeId: string): any[] {
  // Retourner un tableau vide en attendant l'implémentation complète
  return [];
}

export function getRelationsCollaboratives(organismeId: string): any[] {
  // Retourner un tableau vide en attendant l'implémentation complète
  return [];
}

export function getRelationsInformationnelles(organismeId: string): any[] {
  // Retourner un tableau vide en attendant l'implémentation complète
  return [];
}
