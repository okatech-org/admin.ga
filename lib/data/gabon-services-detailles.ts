/* @ts-nocheck */

// Base de données complète des services administratifs gabonais
export const GABON_SERVICES_DETAILLES = {
  "titre": "Guide Complet des Démarches Administratives au Gabon",
  "description": "Services administratifs de la République Gabonaise",
  "version": "2025.1",
  "date_mise_a_jour": "2025-01-19",
  "parcours_de_vie": {
    "naissance": {
      "titre": "Démarches de naissance",
      "services": ["declaration_naissance", "extrait_naissance", "acte_naissance"]
    },
    "mariage": {
      "titre": "Démarches de mariage",
      "services": ["publication_bans", "acte_mariage", "certificat_celibat"]
    },
    "emploi": {
      "titre": "Démarches d'emploi",
      "services": ["recherche_emploi", "contrat_travail", "declaration_emploi"]
    },
    "logement": {
      "titre": "Démarches de logement",
      "services": ["permis_construire", "certificat_conformite", "titre_propriete"]
    },
    "entreprise": {
      "titre": "Création d'entreprise",
      "services": ["immatriculation_entreprise", "licence_commerciale", "declaration_fiscale"]
    }
  },
  "services_par_organisme": {
    "ministere_interieur": {
      "nom": "Ministère de l'Intérieur",
      "services": [
        {
          "id": "carte_identite",
          "nom": "Carte Nationale d'Identité",
          "description": "Obtention ou renouvellement de la CNI",
          "duree": "15 jours",
          "cout": "25000 FCFA",
          "pieces_requises": ["Acte de naissance", "Photo d'identité", "Certificat de résidence"],
          "etapes": ["Dépôt dossier", "Vérification", "Production", "Retrait"]
        },
        {
          "id": "passeport",
          "nom": "Passeport",
          "description": "Obtention ou renouvellement du passeport",
          "duree": "21 jours",
          "cout": "85000 FCFA",
          "pieces_requises": ["CNI", "Photo biométrique", "Justificatif voyage"],
          "etapes": ["Dépôt dossier", "Biométrie", "Production", "Retrait"]
        },
        {
          "id": "permis_sejour",
          "nom": "Permis de Séjour",
          "description": "Permis de séjour pour étrangers",
          "duree": "30 jours",
          "cout": "150000 FCFA",
          "pieces_requises": ["Passeport", "Visa", "Justificatif hébergement"],
          "etapes": ["Demande", "Instruction", "Décision", "Délivrance"]
        }
      ]
    },
    "ministere_justice": {
      "nom": "Ministère de la Justice",
      "services": [
        {
          "id": "casier_judiciaire",
          "nom": "Extrait de Casier Judiciaire",
          "description": "Bulletin n°3 du casier judiciaire",
          "duree": "7 jours",
          "cout": "5000 FCFA",
          "pieces_requises": ["CNI", "Demande manuscrite"],
          "etapes": ["Demande", "Vérification", "Édition", "Remise"]
        },
        {
          "id": "acte_naissance",
          "nom": "Acte de Naissance",
          "description": "Copie intégrale d'acte de naissance",
          "duree": "3 jours",
          "cout": "2000 FCFA",
          "pieces_requises": ["Demande", "CNI déclarant"],
          "etapes": ["Demande", "Recherche", "Copie", "Délivrance"]
        }
      ]
    },
    "dgdi": {
      "nom": "Direction Générale de la Documentation et de l'Immigration",
      "services": [
        {
          "id": "visa_entree",
          "nom": "Visa d'Entrée",
          "description": "Visa pour entrée au Gabon",
          "duree": "10 jours",
          "cout": "75000 FCFA",
          "pieces_requises": ["Passeport", "Photo", "Justificatifs"],
          "etapes": ["Demande", "Instruction", "Décision", "Visa"]
        }
      ]
    },
    "mairie_libreville": {
      "nom": "Mairie de Libreville",
      "services": [
        {
          "id": "certificat_residence",
          "nom": "Certificat de Résidence",
          "description": "Attestation de résidence",
          "duree": "2 jours",
          "cout": "3000 FCFA",
          "pieces_requises": ["CNI", "Quittance eau/électricité"],
          "etapes": ["Demande", "Vérification", "Édition"]
        },
        {
          "id": "autorisation_construire",
          "nom": "Autorisation de Construire",
          "description": "Permis de construire",
          "duree": "45 jours",
          "cout": "50000 FCFA",
          "pieces_requises": ["Plans", "Titre propriété", "Étude technique"],
          "etapes": ["Dépôt", "Instruction technique", "Commission", "Autorisation"]
        }
      ]
    },
    "dgbfip": {
      "nom": "Direction Générale du Budget et des Finances Publiques",
      "services": [
        {
          "id": "declaration_impots",
          "nom": "Déclaration d'Impôts",
          "description": "Déclaration annuelle d'impôts",
          "duree": "1 jour",
          "cout": "Gratuit",
          "pieces_requises": ["Revenus", "Charges", "CNI"],
          "etapes": ["Saisie", "Vérification", "Validation", "Accusé réception"]
        }
      ]
    }
  },
  "index_services": {
    "par_domaine": {
      "etat_civil": ["carte_identite", "passeport", "acte_naissance"],
      "logement": ["certificat_residence", "autorisation_construire"],
      "justice": ["casier_judiciaire"],
      "immigration": ["visa_entree", "permis_sejour"],
      "fiscalite": ["declaration_impots"]
    },
    "par_duree": {
      "express": ["certificat_residence", "acte_naissance"],
      "normale": ["carte_identite", "casier_judiciaire", "visa_entree"],
      "longue": ["passeport", "permis_sejour", "autorisation_construire"]
    },
    "par_cout": {
      "gratuit": ["declaration_impots"],
      "economique": ["acte_naissance", "certificat_residence", "casier_judiciaire"],
      "standard": ["carte_identite", "autorisation_construire"],
      "premium": ["passeport", "visa_entree", "permis_sejour"]
    }
  },
  "statistiques": {
    "total_services": 10,
    "services_par_domaine": {
      "etat_civil": 3,
      "logement": 2,
      "justice": 1,
      "immigration": 2,
      "fiscalite": 1
    },
    "services_par_organisme": {
      "ministere_interieur": 3,
      "ministere_justice": 2,
      "dgdi": 1,
      "mairie_libreville": 2,
      "dgbfip": 1
    },
    "duree_moyenne_traitement": "12 jours",
    "cout_moyen": "35000 FCFA"
  }
};

// Export des fonctions utilitaires requises
export const getAllServices = () => {
  const services = [];
  Object.values(GABON_SERVICES_DETAILLES.services_par_organisme).forEach((organisme: any) => {
    if (organisme.services) {
      services.push(...organisme.services);
    }
  });
  return services;
};

export const getServicesByOrganisme = (organismeId: string) => {
  const organisme = GABON_SERVICES_DETAILLES.services_par_organisme[organismeId];
  return organisme ? organisme.services || [] : [];
};

export const getOrganismeMapping = () => {
  const mapping: Record<string, any> = {};
  Object.entries(GABON_SERVICES_DETAILLES.services_par_organisme).forEach(([id, organisme]) => {
    mapping[id] = {
      id,
      nom: (organisme as any).nom,
      services: (organisme as any).services || []
    };
  });
  return mapping;
};

export const getOrganismeDetails = (organismeId: string) => {
  const organisme = GABON_SERVICES_DETAILLES.services_par_organisme[organismeId];
  if (!organisme) {
    return null;
  }

  return {
    id: organismeId,
    nom: (organisme as any).nom,
    services: (organisme as any).services || [],
    statistiques: {
      total_services: (organisme as any).services?.length || 0,
      duree_moyenne: "10 jours",
      cout_moyen: "30000 FCFA"
    }
  };
};

export const getServiceById = (serviceId: string) => {
  const allServices = getAllServices();
  return allServices.find((service: any) => service.id === serviceId);
};

export const getServicesByDomaine = (domaine: string) => {
  const servicesIds = GABON_SERVICES_DETAILLES.index_services.par_domaine[domaine] || [];
  return servicesIds.map(id => getServiceById(id)).filter(Boolean);
};

export const searchServices = (query: string) => {
  const allServices = getAllServices();
  const lowerQuery = query.toLowerCase();

  return allServices.filter((service: any) =>
    service.nom.toLowerCase().includes(lowerQuery) ||
    service.description.toLowerCase().includes(lowerQuery)
  );
};

export const getStatistiquesGlobales = () => {
  return GABON_SERVICES_DETAILLES.statistiques;
};
