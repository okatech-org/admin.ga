/* @ts-nocheck */
// Utilitaires pour la gestion des services et organismes dans le dashboard super admin
import { getAllAdministrations } from '@/lib/data/gabon-administrations';
import { getAllServices, getServicesByOrganisme, getOrganismeMapping } from '@/lib/data/gabon-services-detailles';
import { ORGANISMES_ENRICHIS_GABON } from '@/lib/config/organismes-enrichis-gabon';

export interface ServiceWithDetails {
  code: string;
  nom: string;
  organisme_responsable: string;
  type_organisme: string;
  cout: string;
  delai_traitement: string;
  validite?: string;
  documents_requis: string[];
  category: string;
}

export interface OrganismeWithServices {
  id: string;
  nom: string;
  code: string;
  type: string;
  localisation: string;
  services_basiques: string[];
  services_detailles: ServiceWithDetails[];
  total_services: number;
  responsable?: string;
  telephone?: string;
  website?: string;
  status: 'ACTIVE' | 'MAINTENANCE' | 'INACTIVE';
  satisfaction?: number;
  demandes_mois?: number;
}

// Mapper les services détaillés aux organismes existants
export const getOrganismesWithDetailedServices = (): OrganismeWithServices[] => {
  // Utiliser les organismes enrichis (160) au lieu des administrations de base
  const organismesEnrichis = Object.values(ORGANISMES_ENRICHIS_GABON);
  const allServices = getAllServices();
  const organismeMapping = getOrganismeMapping();

  return organismesEnrichis.map((org, index) => {
    // Récupérer les services détaillés pour cet organisme
    const servicesDetailles = allServices.filter(service =>
      service.organisme_responsable === org.code
    );

    // Déterminer la catégorie principale
    const getMainCategory = (services: any[]) => {
      if (services.some(s => s.nom.includes('CNI') || s.nom.includes('passeport'))) return 'identite';
      if (services.some(s => s.nom.includes('naissance') || s.nom.includes('mariage'))) return 'etat_civil';
      if (services.some(s => s.nom.includes('fiscal') || s.nom.includes('impôt'))) return 'fiscal';
      if (services.some(s => s.nom.includes('social') || s.nom.includes('pension'))) return 'social';
      if (services.some(s => s.nom.includes('permis') || s.nom.includes('transport'))) return 'transport';
      if (services.some(s => s.nom.includes('santé') || s.nom.includes('médical'))) return 'sante';
      if (services.some(s => s.nom.includes('éducation') || s.nom.includes('diplôme'))) return 'education';
      if (services.some(s => s.nom.includes('justice') || s.nom.includes('juridique'))) return 'justice';
      return 'autre';
    };

    // Générer des services basiques par défaut selon le type d'organisme
    const generateDefaultServices = (type: string) => {
      switch (type) {
        case 'MINISTERE':
          return ['Coordination sectorielle', 'Élaboration des politiques', 'Supervision administrative'];
        case 'DIRECTION_GENERALE':
          return ['Gestion administrative', 'Coordination technique', 'Supervision opérationnelle'];
        case 'MAIRIE':
          return ['État civil', 'Urbanisme', 'Services municipaux'];
        case 'GOUVERNORAT':
          return ['Administration territoriale', 'Coordination préfectorale', 'Services déconcentrés'];
        case 'PREFECTURE':
          return ['Administration locale', 'Services préfectoraux', 'Coordination communale'];
        case 'ORGANISME_SOCIAL':
          return ['Prestations sociales', 'Gestion des cotisations', 'Services aux assurés'];
        case 'ETABLISSEMENT_PUBLIC':
          return ['Services publics spécialisés', 'Missions statutaires', 'Prestations techniques'];
        case 'AGENCE_PUBLIQUE':
          return ['Services d\'agence', 'Missions spécialisées', 'Prestations publiques'];
        case 'INSTITUTION_JUDICIAIRE':
          return ['Services judiciaires', 'Procédures légales', 'Administration de la justice'];
        default:
          return ['Services administratifs', 'Prestations publiques', 'Missions institutionnelles'];
      }
    };

    return {
      id: org.code,
      nom: org.nom,
      code: org.code,
      type: org.type,
      localisation: org.ville || 'Libreville',
      services_basiques: generateDefaultServices(org.type),
      services_detailles: servicesDetailles,
      total_services: generateDefaultServices(org.type).length + servicesDetailles.length,
      responsable: org.responsable || 'Non spécifié',
      telephone: org.telephone || '+241 00 00 00 00',
      website: org.email ? `https://${org.code.toLowerCase()}.gouv.ga` : undefined,
      status: Math.random() > 0.1 ? 'ACTIVE' : (Math.random() > 0.5 ? 'MAINTENANCE' : 'INACTIVE'),
      satisfaction: Math.floor(85 + Math.random() * 15), // 85-100%
      demandes_mois: Math.floor(50 + Math.random() * 500) // 50-550 demandes/mois
    };
  });
};

// Calcul des statistiques globales avec les organismes enrichis
export const getGlobalServicesStats = () => {
  const organismesEnrichis = Object.values(ORGANISMES_ENRICHIS_GABON);
  const organismes = getOrganismesWithDetailedServices();
  const allServices = getAllServices();

  // Calculer les statistiques par catégorie
  const servicesByCategory = allServices.reduce((acc: Record<string, number>, service) => {
    const category = service.category || 'autre';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  // Calculer les statistiques par type d'organisme
  const organismesByType = organismesEnrichis.reduce((acc: Record<string, number>, org) => {
    acc[org.type] = (acc[org.type] || 0) + 1;
    return acc;
  }, {});

  const totalServicesDetailles = allServices.length;
  const totalServicesBasiques = organismes.reduce((sum, org) => sum + org.services_basiques.length, 0);

  return {
    totalOrganismes: organismesEnrichis.length, // 160 organismes enrichis
    totalServices: totalServicesDetailles + totalServicesBasiques,
    totalServicesBasiques,
    totalServicesDetailles,
    demandesMoyennes: Math.floor(organismes.reduce((sum, org) => sum + (org.demandes_mois || 0), 0) / organismes.length),
    satisfactionMoyenne: Math.floor(organismes.reduce((sum, org) => sum + (org.satisfaction || 90), 0) / organismes.length),
    organismesActifs: organismes.filter(org => org.status === 'ACTIVE').length,
    organismesMaintenance: organismes.filter(org => org.status === 'MAINTENANCE').length,
    servicesByCategory,
    organismesByType,

    // Nouvelles métriques pour les relations inter-organismes
    totalRelations: 1117, // Nombre actuel de relations générées
    densiteRelationnelle: ((1117 / ((organismesEnrichis.length * (organismesEnrichis.length - 1)) / 2)) * 100).toFixed(2),
    niveauxHierarchiques: 6,
    groupesAdministratifs: 9,
    pouvoirsRepresentes: 3 // Exécutif, Législatif, Judiciaire
  };
};

// Export des organismes avec services pour compatibilité
export { getOrganismesWithDetailedServices as getOrganismesWithServices };

// Fonction utilitaire pour obtenir les statistiques consolidées
export const getConsolidatedStats = () => {
  const globalStats = getGlobalServicesStats();
  const organismes = getOrganismesWithDetailedServices();

  return {
    ...globalStats,
    organismesDetails: organismes,
    lastUpdate: new Date().toISOString(),
    version: '2.0 - Organismes Enrichis (160)',

    // Résumé exécutif
    resume: {
      organismes: `${globalStats.totalOrganismes} organismes publics gabonais`,
      relations: `${globalStats.totalRelations} relations inter-organismes établies`,
      hierarchie: `${globalStats.niveauxHierarchiques} niveaux hiérarchiques`,
      couverture: `${globalStats.groupesAdministratifs} groupes administratifs`,
      pouvoirs: `${globalStats.pouvoirsRepresentes} pouvoirs de l'État représentés`
    }
  };
};

// Rechercher dans les services
export const searchServices = (query: string, orgType?: string, category?: string): ServiceWithDetails[] => {
  const allServices = getAllServices();

  return allServices
    .filter(service => {
      const matchesQuery = !query ||
        service.nom.toLowerCase().includes(query.toLowerCase()) ||
        service.code.toLowerCase().includes(query.toLowerCase()) ||
        service.documents_requis.some(doc => doc.toLowerCase().includes(query.toLowerCase()));

      const matchesOrgType = !orgType || service.type_organisme === orgType;

      // Catégorie basée sur le nom du service (approximation)
      const serviceCategory = getServiceCategory(service.nom);
      const matchesCategory = !category || serviceCategory === category;

      return matchesQuery && matchesOrgType && matchesCategory;
    })
    .map(service => ({
      code: service.code,
      nom: service.nom,
      organisme_responsable: service.organisme_responsable,
      type_organisme: service.type_organisme,
      cout: service.cout,
      delai_traitement: service.delai_traitement,
      validite: service.validite,
      documents_requis: service.documents_requis,
      category: getServiceCategory(service.nom)
    }));
};

// Déterminer la catégorie d'un service
const getServiceCategory = (serviceName: string): string => {
  const name = serviceName.toLowerCase();

  if (name.includes('naissance') || name.includes('mariage') || name.includes('décès')) return 'etat_civil';
  if (name.includes('cni') || name.includes('passeport') || name.includes('nationalité')) return 'identite';
  if (name.includes('cnss') || name.includes('emploi') || name.includes('travail') || name.includes('chômage')) return 'travail_emploi';
  if (name.includes('inscription') || name.includes('bourse') || name.includes('diplôme') || name.includes('université')) return 'education';
  if (name.includes('permis de construire') || name.includes('titre') || name.includes('urbanisme') || name.includes('résidence')) return 'logement';
  if (name.includes('permis de conduire') || name.includes('véhicule') || name.includes('transport') || name.includes('immatriculation')) return 'transport';
  if (name.includes('commerce') || name.includes('rccm') || name.includes('patente') || name.includes('entreprise')) return 'commerce';
  if (name.includes('casier') || name.includes('légalisation') || name.includes('tribunal') || name.includes('justice')) return 'justice';
  if (name.includes('impôt') || name.includes('fiscal') || name.includes('quitus') || name.includes('déclaration')) return 'fiscal';
  if (name.includes('médical') || name.includes('santé') || name.includes('allocation') || name.includes('social')) return 'sante_social';
  if (name.includes('retraite') || name.includes('pension') || name.includes('âge')) return 'retraite';
  if (name.includes('succession') || name.includes('hérédité') || name.includes('inhumer')) return 'succession';

  return 'administratif';
};

// Types et fonctions disponibles par import
