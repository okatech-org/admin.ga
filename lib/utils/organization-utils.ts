/**
 * Utilitaires pour la gestion et l'affichage des organismes gabonais
 * Classification selon l'implémentation des 160+ organismes ADMINISTRATION.GA
 */

import { OrganizationType } from '@/types/auth';

// Libellés français pour tous les types d'organisations
export const ORGANIZATION_TYPE_LABELS: Record<string, string> = {
  'PRESIDENCE': 'Présidence de la République',
  'VICE_PRESIDENCE_REPUBLIQUE': 'Vice-Présidence de la République',
  'VICE_PRESIDENCE_GOUVERNEMENT': 'Vice-Présidence du Gouvernement',
  'MINISTERE_ETAT': 'Ministère d\'État',
  'MINISTERE': 'Ministère',
  'SECRETARIAT_GENERAL': 'Secrétariat Général',
  'DIRECTION_GENERALE': 'Direction Générale',
  'DIRECTION': 'Direction',
  'SERVICE': 'Service',
  'DIRECTION_CENTRALE_RH': 'Direction Centrale des Ressources Humaines',
  'DIRECTION_CENTRALE_FINANCES': 'Direction Centrale des Affaires Financières',
  'DIRECTION_CENTRALE_SI': 'Direction Centrale des Systèmes d\'Information',
  'DIRECTION_CENTRALE_JURIDIQUE': 'Direction Centrale des Affaires Juridiques',
  'DIRECTION_CENTRALE_COMMUNICATION': 'Direction Centrale de la Communication',
  'GOUVERNORAT': 'Gouvernorat',
  'PREFECTURE': 'Préfecture',
  'MAIRIE': 'Mairie',
  'ORGANISME_SOCIAL': 'Organisme Social',
  'ETABLISSEMENT_PUBLIC': 'Établissement Public',
  'AGENCE_NATIONALE': 'Agence Nationale',
  'AGENCE_SPECIALISEE': 'Agence Spécialisée',
  'CONSEIL_NATIONAL': 'Conseil National',
  'CABINET': 'Cabinet',
  'INSPECTION_GENERALE': 'Inspection Générale',
  'INSTITUTION_SUPREME': 'Institution Suprême',
  'INSTITUTION_JUDICIAIRE': 'Institution Judiciaire',
  'POUVOIR_LEGISLATIF': 'Pouvoir Législatif',
  'INSTITUTION_INDEPENDANTE': 'Institution Indépendante',
  'AUTRE': 'Autre'
};

// Couleurs des badges selon le type d'organisation
export const ORGANIZATION_TYPE_COLORS: Record<string, string> = {
  'PRESIDENCE': 'bg-red-100 text-red-800 border-red-200',
  'VICE_PRESIDENCE_REPUBLIQUE': 'bg-red-100 text-red-800 border-red-200',
  'VICE_PRESIDENCE_GOUVERNEMENT': 'bg-red-100 text-red-800 border-red-200',
  'MINISTERE_ETAT': 'bg-purple-100 text-purple-800 border-purple-200',
  'MINISTERE': 'bg-blue-100 text-blue-800 border-blue-200',
  'SECRETARIAT_GENERAL': 'bg-indigo-100 text-indigo-800 border-indigo-200',
  'DIRECTION_GENERALE': 'bg-indigo-100 text-indigo-800 border-indigo-200',
  'DIRECTION': 'bg-blue-100 text-blue-800 border-blue-200',
  'SERVICE': 'bg-gray-100 text-gray-800 border-gray-200',
  'DIRECTION_CENTRALE_RH': 'bg-green-100 text-green-800 border-green-200',
  'DIRECTION_CENTRALE_FINANCES': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'DIRECTION_CENTRALE_SI': 'bg-cyan-100 text-cyan-800 border-cyan-200',
  'DIRECTION_CENTRALE_JURIDIQUE': 'bg-orange-100 text-orange-800 border-orange-200',
  'DIRECTION_CENTRALE_COMMUNICATION': 'bg-pink-100 text-pink-800 border-pink-200',
  'GOUVERNORAT': 'bg-teal-100 text-teal-800 border-teal-200',
  'PREFECTURE': 'bg-slate-100 text-slate-800 border-slate-200',
  'MAIRIE': 'bg-emerald-100 text-emerald-800 border-emerald-200',
  'ORGANISME_SOCIAL': 'bg-violet-100 text-violet-800 border-violet-200',
  'ETABLISSEMENT_PUBLIC': 'bg-stone-100 text-stone-800 border-stone-200',
  'AGENCE_NATIONALE': 'bg-amber-100 text-amber-800 border-amber-200',
  'AGENCE_SPECIALISEE': 'bg-amber-100 text-amber-800 border-amber-200',
  'CONSEIL_NATIONAL': 'bg-lime-100 text-lime-800 border-lime-200',
  'CABINET': 'bg-rose-100 text-rose-800 border-rose-200',
  'INSPECTION_GENERALE': 'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200',
  'INSTITUTION_SUPREME': 'bg-red-100 text-red-800 border-red-200',
  'INSTITUTION_JUDICIAIRE': 'bg-slate-100 text-slate-800 border-slate-200',
  'POUVOIR_LEGISLATIF': 'bg-stone-100 text-stone-800 border-stone-200',
  'INSTITUTION_INDEPENDANTE': 'bg-neutral-100 text-neutral-800 border-neutral-200',
  'AUTRE': 'bg-gray-100 text-gray-800 border-gray-200'
};

// Couleurs des bordures selon le type d'organisation
export const ORGANIZATION_BORDER_COLORS: Record<string, string> = {
  'PRESIDENCE': 'border-l-red-500',
  'VICE_PRESIDENCE_REPUBLIQUE': 'border-l-red-400',
  'VICE_PRESIDENCE_GOUVERNEMENT': 'border-l-red-400',
  'MINISTERE_ETAT': 'border-l-purple-500',
  'MINISTERE': 'border-l-blue-500',
  'SECRETARIAT_GENERAL': 'border-l-indigo-500',
  'DIRECTION_GENERALE': 'border-l-indigo-500',
  'DIRECTION': 'border-l-blue-400',
  'SERVICE': 'border-l-gray-400',
  'DIRECTION_CENTRALE_RH': 'border-l-green-500',
  'DIRECTION_CENTRALE_FINANCES': 'border-l-yellow-500',
  'DIRECTION_CENTRALE_SI': 'border-l-cyan-500',
  'DIRECTION_CENTRALE_JURIDIQUE': 'border-l-orange-500',
  'DIRECTION_CENTRALE_COMMUNICATION': 'border-l-pink-500',
  'GOUVERNORAT': 'border-l-teal-500',
  'PREFECTURE': 'border-l-slate-500',
  'MAIRIE': 'border-l-emerald-500',
  'ORGANISME_SOCIAL': 'border-l-violet-500',
  'ETABLISSEMENT_PUBLIC': 'border-l-stone-500',
  'AGENCE_NATIONALE': 'border-l-amber-500',
  'AGENCE_SPECIALISEE': 'border-l-amber-500',
  'CONSEIL_NATIONAL': 'border-l-lime-500',
  'CABINET': 'border-l-rose-500',
  'INSPECTION_GENERALE': 'border-l-fuchsia-500',
  'INSTITUTION_SUPREME': 'border-l-red-600',
  'INSTITUTION_JUDICIAIRE': 'border-l-slate-600',
  'POUVOIR_LEGISLATIF': 'border-l-stone-600',
  'INSTITUTION_INDEPENDANTE': 'border-l-neutral-500',
  'AUTRE': 'border-l-gray-500'
};

// Groupes administratifs selon la classification ADMINISTRATION.GA
export const ORGANIZATION_GROUPS = {
  A: { name: 'Institutions Suprêmes', description: 'Organes suprêmes de l\'État' },
  B: { name: 'Ministères', description: 'Ministères et directions centrales' },
  C: { name: 'Directions Générales', description: 'Directions générales uniques' },
  D: { name: 'Établissements Publics', description: 'Établissements publics spécialisés' },
  E: { name: 'Agences Spécialisées', description: 'Agences et organismes sociaux' },
  F: { name: 'Institutions Judiciaires', description: 'Cours et tribunaux' },
  G: { name: 'Administrations Territoriales', description: 'Gouvernorats, préfectures, mairies' },
  L: { name: 'Pouvoir Législatif', description: 'Assemblée et Sénat' },
  I: { name: 'Institutions Indépendantes', description: 'Organismes indépendants' }
};

/**
 * Obtenir le libellé français d'un type d'organisation
 */
export function getOrganizationTypeLabel(type: string): string {
  return ORGANIZATION_TYPE_LABELS[type] || type.replace(/_/g, ' ');
}

/**
 * Obtenir la classe CSS pour la couleur du badge d'un type d'organisation
 */
export function getOrganizationTypeColor(type: string): string {
  return ORGANIZATION_TYPE_COLORS[type] || 'bg-gray-100 text-gray-800 border-gray-200';
}

/**
 * Obtenir la classe CSS pour la couleur de bordure d'un type d'organisation
 */
export function getOrganizationBorderColor(type: string): string {
  return ORGANIZATION_BORDER_COLORS[type] || 'border-l-gray-500';
}

/**
 * Obtenir le groupe administratif d'un type d'organisation
 */
export function getOrganizationGroup(type: string): keyof typeof ORGANIZATION_GROUPS | null {
  const groupMapping: Record<string, keyof typeof ORGANIZATION_GROUPS> = {
    'PRESIDENCE': 'A',
    'VICE_PRESIDENCE_REPUBLIQUE': 'A',
    'VICE_PRESIDENCE_GOUVERNEMENT': 'A',
    'SECRETARIAT_GENERAL': 'A',
    'MINISTERE_ETAT': 'B',
    'MINISTERE': 'B',
    'DIRECTION_CENTRALE_RH': 'B',
    'DIRECTION_CENTRALE_FINANCES': 'B',
    'DIRECTION_CENTRALE_SI': 'B',
    'DIRECTION_CENTRALE_JURIDIQUE': 'B',
    'DIRECTION_CENTRALE_COMMUNICATION': 'B',
    'DIRECTION_GENERALE': 'C',
    'DIRECTION': 'C',
    'ETABLISSEMENT_PUBLIC': 'D',
    'AGENCE_NATIONALE': 'E',
    'AGENCE_SPECIALISEE': 'E',
    'ORGANISME_SOCIAL': 'E',
    'INSTITUTION_JUDICIAIRE': 'F',
    'GOUVERNORAT': 'G',
    'PREFECTURE': 'G',
    'MAIRIE': 'G',
    'POUVOIR_LEGISLATIF': 'L',
    'INSTITUTION_INDEPENDANTE': 'I'
  };

  return groupMapping[type] || null;
}

/**
 * Vérifier si un organisme est principal (accessible aux citoyens)
 */
export function isOrganismePrincipal(type: string): boolean {
  const organismsPrincipaux = [
    'PRESIDENCE',
    'MINISTERE_ETAT',
    'MINISTERE',
    'DIRECTION_GENERALE',
    'MAIRIE',
    'ORGANISME_SOCIAL',
    'AGENCE_SPECIALISEE'
  ];

  return organismsPrincipaux.includes(type);
}

/**
 * Filtrer les organismes par critères
 */
export function filterOrganizations(
  organizations: any[],
  filters: {
    search?: string;
    type?: string;
    city?: string;
    group?: string;
    isActive?: boolean;
    isPrincipal?: boolean;
  }
) {
  return organizations.filter(org => {
    // Filtre par recherche textuelle
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matches = [
        org.name?.toLowerCase().includes(searchLower),
        org.code?.toLowerCase().includes(searchLower),
        org.description?.toLowerCase().includes(searchLower),
        org.city?.toLowerCase().includes(searchLower),
        getOrganizationTypeLabel(org.type).toLowerCase().includes(searchLower)
      ].some(Boolean);

      if (!matches) return false;
    }

    // Filtre par type
    if (filters.type && org.type !== filters.type) return false;

    // Filtre par ville
    if (filters.city && org.city?.toLowerCase() !== filters.city.toLowerCase()) return false;

    // Filtre par groupe administratif
    if (filters.group && getOrganizationGroup(org.type) !== filters.group) return false;

    // Filtre par statut actif
    if (filters.isActive !== undefined && org.isActive !== filters.isActive) return false;

    // Filtre par organisme principal
    if (filters.isPrincipal !== undefined && isOrganismePrincipal(org.type) !== filters.isPrincipal) return false;

    return true;
  });
}

/**
 * Trier les organismes par hiérarchie et nom
 */
export function sortOrganizations(organizations: any[]) {
  const hierarchyOrder = [
    'PRESIDENCE',
    'VICE_PRESIDENCE_REPUBLIQUE',
    'VICE_PRESIDENCE_GOUVERNEMENT',
    'SECRETARIAT_GENERAL',
    'MINISTERE_ETAT',
    'MINISTERE',
    'DIRECTION_GENERALE',
    'DIRECTION_CENTRALE_RH',
    'DIRECTION_CENTRALE_FINANCES',
    'DIRECTION_CENTRALE_SI',
    'DIRECTION_CENTRALE_JURIDIQUE',
    'DIRECTION_CENTRALE_COMMUNICATION',
    'GOUVERNORAT',
    'PREFECTURE',
    'MAIRIE',
    'ORGANISME_SOCIAL',
    'AGENCE_SPECIALISEE',
    'ETABLISSEMENT_PUBLIC',
    'INSTITUTION_JUDICIAIRE',
    'POUVOIR_LEGISLATIF',
    'INSTITUTION_INDEPENDANTE'
  ];

  return organizations.sort((a, b) => {
    const orderA = hierarchyOrder.indexOf(a.type);
    const orderB = hierarchyOrder.indexOf(b.type);

    // Si les types sont différents, trier par ordre hiérarchique
    if (orderA !== orderB) {
      const priorityA = orderA === -1 ? 999 : orderA;
      const priorityB = orderB === -1 ? 999 : orderB;
      return priorityA - priorityB;
    }

    // Si même type, trier par nom
    return a.name.localeCompare(b.name, 'fr', { sensitivity: 'base' });
  });
}

/**
 * Générer des statistiques sur les organismes
 */
export function generateOrganizationStats(organizations: any[]) {
  const stats = {
    total: organizations.length,
    active: organizations.filter(org => org.isActive).length,
    inactive: organizations.filter(org => !org.isActive).length,
    principals: organizations.filter(org => isOrganismePrincipal(org.type)).length,
    byType: {} as Record<string, number>,
    byCity: {} as Record<string, number>,
    byGroup: {} as Record<string, number>
  };

  // Statistiques par type
  organizations.forEach(org => {
    stats.byType[org.type] = (stats.byType[org.type] || 0) + 1;

    if (org.city) {
      stats.byCity[org.city] = (stats.byCity[org.city] || 0) + 1;
    }

    const group = getOrganizationGroup(org.type);
    if (group) {
      stats.byGroup[group] = (stats.byGroup[group] || 0) + 1;
    }
  });

  return stats;
}
