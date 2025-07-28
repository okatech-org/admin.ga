/* @ts-nocheck */
// Utilitaires pour la gestion des services et organismes dans le dashboard super admin
import { getAllAdministrations } from '@/lib/data/gabon-administrations';
import { getAllServices, getServicesByOrganisme, getOrganismeMapping } from '@/lib/data/gabon-services-detailles';

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
  const administrations = getAllAdministrations();
  const allServices = getAllServices();
  const organismeMapping = getOrganismeMapping();
  
  return administrations.map((admin, index) => {
    // Récupérer les services détaillés pour cet organisme
    const servicesDetailles = allServices.filter(service => 
      service.organisme_responsable === admin.code
    );
    
    // Déterminer la catégorie principale
    const getMainCategory = (services: any[]) => {
      if (services.some(s => s.nom.includes('CNI') || s.nom.includes('passeport'))) return 'identite';
      if (services.some(s => s.nom.includes('naissance') || s.nom.includes('mariage'))) return 'etat_civil';
      if (services.some(s => s.nom.includes('CNSS') || s.nom.includes('emploi'))) return 'travail_emploi';
      if (services.some(s => s.nom.includes('permis') || s.nom.includes('construire'))) return 'logement';
      if (services.some(s => s.nom.includes('commerce') || s.nom.includes('entreprise'))) return 'commerce';
      if (services.some(s => s.nom.includes('impôt') || s.nom.includes('fiscal'))) return 'fiscal';
      if (services.some(s => s.nom.includes('médical') || s.nom.includes('santé'))) return 'sante_social';
      if (services.some(s => s.nom.includes('justice') || s.nom.includes('casier'))) return 'justice';
      return 'administratif';
    };
    
    const mainCategory = getMainCategory(servicesDetailles);
    
    // Convertir les services détaillés au bon format
    const servicesWithDetails: ServiceWithDetails[] = servicesDetailles.map(service => ({
      code: service.code,
      nom: service.nom,
      organisme_responsable: service.organisme_responsable,
      type_organisme: service.type_organisme,
      cout: service.cout,
      delai_traitement: service.delai_traitement,
      validite: service.validite,
      documents_requis: service.documents_requis,
      category: mainCategory
    }));
    
    // Générer des métriques basées sur le type d'organisme
    const generateMetrics = (orgType: string, idx: number) => {
      const metricsMap = {
        'PRESIDENCE': { satisfaction: 95, demandes: 50, status: 'ACTIVE' },
        'PRIMATURE': { satisfaction: 93, demandes: 40, status: 'ACTIVE' },
        'MINISTERE': { satisfaction: 88, demandes: 800, status: 'ACTIVE' },
        'DIRECTION_GENERALE': { satisfaction: 85, demandes: 600, status: 'ACTIVE' },
        'MAIRIE': { satisfaction: 82, demandes: 1200, status: 'ACTIVE' },
        'ORGANISME_SOCIAL': { satisfaction: 80, demandes: 500, status: 'ACTIVE' },
        'INSTITUTION_JUDICIAIRE': { satisfaction: 78, demandes: 300, status: 'ACTIVE' },
        'AGENCE_PUBLIQUE': { satisfaction: 75, demandes: 150, status: 'ACTIVE' }
      };
      
      const base = metricsMap[orgType] || metricsMap['AGENCE_PUBLIQUE'];
      
      return {
        satisfaction: Math.min(95, base.satisfaction + (idx % 15)),
        demandes_mois: base.demandes + (idx % 100),
        status: idx % 15 === 0 ? 'MAINTENANCE' : 'ACTIVE'
      };
    };
    
    const metrics = generateMetrics(admin.type, index);
    
    return {
      id: (index + 1).toString(),
      nom: admin.nom,
      code: admin.code || `ORG_${index + 1}`,
      type: admin.type,
      localisation: admin.localisation,
      services_basiques: admin.services,
      services_detailles: servicesWithDetails,
      total_services: admin.services.length + servicesDetailles.length,
      responsable: generateResponsableName(admin.type, index),
      telephone: generatePhoneNumber(index),
      website: generateWebsite(admin.code),
      status: metrics.status as 'ACTIVE' | 'MAINTENANCE' | 'INACTIVE',
      satisfaction: metrics.satisfaction,
      demandes_mois: metrics.demandes_mois
    };
  });
};

// Générer des noms de responsables fictifs mais réalistes
const generateResponsableName = (orgType: string, index: number): string => {
  const titres = {
    'MINISTERE': 'Ministre',
    'DIRECTION_GENERALE': 'Directeur Général',
    'MAIRIE': 'Maire',
    'ORGANISME_SOCIAL': 'Directeur',
    'AGENCE_PUBLIQUE': 'Directeur Général',
    'INSTITUTION_JUDICIAIRE': 'Président',
    'PRESIDENCE': 'Secrétaire Général',
    'PRIMATURE': 'Secrétaire Général'
  };
  
  const prenoms = ['Jean', 'Marie', 'Paul', 'Sophie', 'Pierre', 'Françoise', 'Michel', 'Catherine', 'André', 'Sylvie'];
  const noms = ['OBIANG', 'NZENG', 'MBOUMBA', 'BOUKOUMOU', 'NZAMBA', 'ONDO', 'MINTSA', 'ELLA', 'OVONO', 'EYEGHE'];
  
  const titre = titres[orgType] || 'Directeur';
  const prenom = prenoms[index % prenoms.length];
  const nom = noms[index % noms.length];
  
  return `${titre} ${prenom} ${nom}`;
};

// Générer des numéros de téléphone fictifs
const generatePhoneNumber = (index: number): string => {
  const bases = ['07', '06', '05', '04'];
  const base = bases[index % bases.length];
  const numero = String(1000000 + (index * 123456) % 9000000).padStart(7, '0');
  return `+241 ${base} ${numero.substring(0, 2)} ${numero.substring(2, 4)} ${numero.substring(4, 6)}`;
};

// Générer des sites web fictifs
const generateWebsite = (code?: string): string => {
  if (!code) return '';
  const domain = code.toLowerCase().replace(/_/g, '-');
  return `https://${domain}.gabon.ga`;
};

// Obtenir les statistiques globales des services
export const getGlobalServicesStats = () => {
  const organismes = getOrganismesWithDetailedServices();
  const allServices = getAllServices();
  
  const totalOrganismes = organismes.length;
  const totalServices = allServices.length;
  const totalServicesBasiques = organismes.reduce((sum, org) => sum + org.services_basiques.length, 0);
  const totalServicesDetailles = organismes.reduce((sum, org) => sum + org.services_detailles.length, 0);
  
  const satisfactionMoyenne = Math.round(
    organismes.reduce((sum, org) => sum + (org.satisfaction || 0), 0) / totalOrganismes
  );
  
  const demandesMoyennes = organismes.reduce((sum, org) => sum + (org.demandes_mois || 0), 0);
  
  const organismesByType = organismes.reduce((acc, org) => {
    acc[org.type] = (acc[org.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const servicesByCategory = {
    'etat_civil': allServices.filter(s => s.nom.includes('naissance') || s.nom.includes('mariage') || s.nom.includes('décès')).length,
    'identite': allServices.filter(s => s.nom.includes('CNI') || s.nom.includes('passeport') || s.nom.includes('nationalité')).length,
    'travail_emploi': allServices.filter(s => s.nom.includes('CNSS') || s.nom.includes('emploi') || s.nom.includes('travail')).length,
    'education': allServices.filter(s => s.nom.includes('inscription') || s.nom.includes('bourse') || s.nom.includes('diplôme')).length,
    'logement': allServices.filter(s => s.nom.includes('permis') || s.nom.includes('titre') || s.nom.includes('urbanisme')).length,
    'transport': allServices.filter(s => s.nom.includes('permis de conduire') || s.nom.includes('véhicule') || s.nom.includes('transport')).length,
    'commerce': allServices.filter(s => s.nom.includes('commerce') || s.nom.includes('RCCM') || s.nom.includes('patente')).length,
    'justice': allServices.filter(s => s.nom.includes('casier') || s.nom.includes('légalisation') || s.nom.includes('tribunal')).length,
    'fiscal': allServices.filter(s => s.nom.includes('impôt') || s.nom.includes('fiscal') || s.nom.includes('quitus')).length,
    'sante_social': allServices.filter(s => s.nom.includes('médical') || s.nom.includes('santé') || s.nom.includes('allocation')).length
  };
  
  return {
    totalOrganismes,
    totalServices,
    totalServicesBasiques,
    totalServicesDetailles,
    satisfactionMoyenne,
    demandesMoyennes,
    organismesByType,
    servicesByCategory,
    organismesActifs: organismes.filter(o => o.status === 'ACTIVE').length,
    organismesMaintenance: organismes.filter(o => o.status === 'MAINTENANCE').length
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