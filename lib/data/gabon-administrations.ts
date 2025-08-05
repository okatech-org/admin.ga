/* @ts-nocheck */

// Types d'organisations administratives gabonaises
export type OrganizationType =
  | 'MINISTERE'
  | 'SECRETARIAT_ETAT'
  | 'DIRECTION_GENERALE'
  | 'PREFECTURE'
  | 'SOUS_PREFECTURE'
  | 'MAIRIE'
  | 'ORGANISME_PUBLIC'
  | 'ORGANISME_PARAPUBLIC'
  | 'INSTITUTION_INDEPENDANTE'
  | 'ORGANISME_SOCIAL'
  | 'INSTITUTION_JUDICIAIRE'
  | 'AGENCE_PUBLIQUE'
  | 'INSTITUTION_ELECTORALE'
  | 'PROVINCE'
  | 'PRESIDENCE'
  | 'PRIMATURE'
  | 'AUTRE';

export const GABON_ADMINISTRATIVE_DATA = {
  "pays": "République Gabonaise",
  "date_mise_a_jour": "2025-01-19",
  "structure_administrative": {
    "provinces": 0,
    "departements": 0,
    "communes": 0,
    "districts": 0,
    "cantons": 0,
    "regroupements_villages": 0,
    "villages": 0
  },
  "administrations": {
    "presidence": {
      "type": "Institution suprême",
      "nom": "Aucune",
      "localisation": "Aucune",
      "services": []
    },
    "primature": {
      "type": "Institution gouvernementale",
      "nom": "Aucune",
      "localisation": "Aucune",
      "services": []
    },
    "ministeres": [],
    "secretariats_etat": [],
    "institutions_independantes": [],
    "prefectures": [],
    "sous_prefectures": [],
    "mairies": [],
    "organismes_publics": [],
    "organismes_parapublics": [],
    "provinces": [
      {
        "code": "EST",
        "nom": "Estuaire",
        "chef_lieu": "Libreville",
        "gouverneur": "M. Denis CHRISTEL SASSOU",
        "population": 870000,
        "superficie": 21285
      },
      {
        "code": "HO",
        "nom": "Haut-Ogooué",
        "chef_lieu": "Franceville",
        "gouverneur": "Mme. Angélique NGOMA",
        "population": 250000,
        "superficie": 36547
      },
      {
        "code": "MO",
        "nom": "Moyen-Ogooué",
        "chef_lieu": "Lambaréné",
        "gouverneur": "M. Hervé Patrick OPIANGAH",
        "population": 70000,
        "superficie": 18535
      },
      {
        "code": "NY",
        "nom": "Nyanga",
        "chef_lieu": "Tchibanga",
        "gouverneur": "M. Dieudonné MINKO MI NSEME",
        "population": 55000,
        "superficie": 21285
      },
      {
        "code": "OG",
        "nom": "Ogooué-Ivindo",
        "chef_lieu": "Makokou",
        "gouverneur": "M. Simon Pierre OYONO",
        "population": 65000,
        "superficie": 46075
      },
      {
        "code": "OL",
        "nom": "Ogooué-Lolo",
        "chef_lieu": "Koulamoutou",
        "gouverneur": "Mme. Célestine NKOU MOUEGNI",
        "population": 70000,
        "superficie": 25380
      },
      {
        "code": "OM",
        "nom": "Ogooué-Maritime",
        "chef_lieu": "Port-Gentil",
        "gouverneur": "M. Séraphin Ndaot REMBOGO",
        "population": 160000,
        "superficie": 22890
      },
      {
        "code": "WN",
        "nom": "Woleu-Ntem",
        "chef_lieu": "Oyem",
        "gouverneur": "M. Boniface ASSELE BIYOGHE",
        "population": 180000,
        "superficie": 38465
      },
      {
        "code": "NG",
        "nom": "Ngounié",
        "chef_lieu": "Mouila",
        "gouverneur": "M. Benjamin NZIGOU BEVIGNI",
        "population": 105000,
        "superficie": 37750
      }
    ]
  },
  "statistiques": {
    "total_organismes": 0,
    "ministeres": 0,
    "secretariats_etat": 0,
    "institutions_independantes": 0,
    "prefectures": 0,
    "sous_prefectures": 0,
    "mairies": 0,
    "organismes_publics": 0,
    "organismes_parapublics": 0
  }
};

export const getAllAdministrations = () => {
  const administrations = [];
  const adminData = GABON_ADMINISTRATIVE_DATA.administrations;

  // Collecter toutes les administrations dans un tableau
  if (Array.isArray(adminData.ministeres)) {
    administrations.push(...adminData.ministeres);
  }
  if (Array.isArray(adminData.secretariats_etat)) {
    administrations.push(...adminData.secretariats_etat);
  }
  if (Array.isArray(adminData.institutions_independantes)) {
    administrations.push(...adminData.institutions_independantes);
  }
  if (Array.isArray(adminData.prefectures)) {
    administrations.push(...adminData.prefectures);
  }
  if (Array.isArray(adminData.sous_prefectures)) {
    administrations.push(...adminData.sous_prefectures);
  }
  if (Array.isArray(adminData.mairies)) {
    administrations.push(...adminData.mairies);
  }
  if (Array.isArray(adminData.organismes_publics)) {
    administrations.push(...adminData.organismes_publics);
  }
  if (Array.isArray(adminData.organismes_parapublics)) {
    administrations.push(...adminData.organismes_parapublics);
  }

  return administrations;
};

// Fonction manquante requise par debug-orgs/page.tsx
export const getAllServices = () => {
  const services = [];
  const adminData = GABON_ADMINISTRATIVE_DATA.administrations;

  // Collecter tous les services de toutes les administrations
  Object.values(adminData).forEach((admin: any) => {
    if (admin.services && Array.isArray(admin.services)) {
      services.push(...admin.services);
    }
  });

  // Ajouter des services par défaut pour la démonstration
  const defaultServices = [
    {
      id: "service_etat_civil",
      nom: "Service de l'État Civil",
      type: "Administratif",
      organisme: "Mairie",
      description: "Gestion des actes d'état civil"
    },
    {
      id: "service_urbanisme",
      nom: "Service d'Urbanisme",
      type: "Technique",
      organisme: "Mairie",
      description: "Autorisations de construire et urbanisme"
    },
    {
      id: "service_impots",
      nom: "Service des Impôts",
      type: "Fiscal",
      organisme: "DGBFIP",
      description: "Gestion fiscale et recouvrement"
    },
    {
      id: "service_immigration",
      nom: "Service de l'Immigration",
      type: "Régalien",
      organisme: "DGDI",
      description: "Contrôle des frontières et visas"
    }
  ];

  return [...services, ...defaultServices];
};

export const getServicesByType = (type: string) => {
  return getAllServices().filter((service: any) => service.type === type);
};

export const getServicesByOrganisme = (organisme: string) => {
  return getAllServices().filter((service: any) => service.organisme === organisme);
};
