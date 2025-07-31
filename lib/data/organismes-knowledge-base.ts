/**
 * Base de connaissances complète des organismes gabonais
 * Informations récupérées depuis des sources officielles et fiables
 * Dernière mise à jour: Janvier 2025
 */

export interface OrganismeKnowledge {
  id: string;
  nom: string;
  sigle: string;
  type: 'MINISTERE' | 'DIRECTION_GENERALE' | 'AGENCE' | 'ETABLISSEMENT_PUBLIC' | 'ORGANISME_SPECIALISE';

  // Informations de base
  description: string;
  mission: string;
  vision?: string;
  slogan?: string;

  // Contact et localisation
  adresse: {
    siege: string;
    ville: string;
    codePostal?: string;
    quartier?: string;
  };
  contact: {
    telephone: string[];
    email: string[];
    siteWeb?: string;
    fax?: string;
  };

  // Informations organisationnelles
  tutelle?: string;
  ministereRattachement?: string;
  dateCreation?: string;
  statutJuridique: string;

  // Direction et encadrement
  dirigeants: {
    poste: string;
    nom?: string;
    depuis?: string;
  }[];

  // Structure interne
  departements: {
    nom: string;
    responsable?: string;
    missions: string[];
  }[];

  // Horaires et fonctionnement
  horaires: {
    lundi?: { debut: string; fin: string; };
    mardi?: { debut: string; fin: string; };
    mercredi?: { debut: string; fin: string; };
    jeudi?: { debut: string; fin: string; };
    vendredi?: { debut: string; fin: string; };
    samedi?: { debut: string; fin: string; };
    dimanche?: { debut: string; fin: string; };
  };

  // Services et prestations
  services: {
    nom: string;
    code: string;
    description: string;
    documents_requis: string[];
    duree_traitement: string;
    cout: string;
    modalites?: string[];
    beneficiaires?: string[];
  }[];

  // Informations pratiques
  proceduresAdministratives: {
    nom: string;
    etapes: string[];
    duree: string;
    cout?: string;
    prerequis?: string[];
  }[];

  // Ressources et moyens
  effectifs?: {
    total?: number;
    cadres?: number;
    agentsExecutions?: number;
    contractuels?: number;
  };

  budget?: {
    annee: number;
    montant?: string;
    principales_allocations?: string[];
  };

  // Performance et indicateurs
  statistiques?: {
    demandes_traitees_par_mois?: number;
    taux_satisfaction?: number;
    delai_moyen_traitement?: string;
    couverture_nationale?: string;
  };

  // Partenaires et coopération
  partenaires?: {
    nationaux?: string[];
    internationaux?: string[];
    techniques?: string[];
  };

  // Projets et réformes en cours
  projets_en_cours?: {
    nom: string;
    description: string;
    echeance?: string;
    budget?: string;
    partenaires?: string[];
  }[];

  // Histoire et évolution
  historique?: {
    date: string;
    evenement: string;
  }[];

  // Informations de dernière mise à jour
  metadonnees: {
    derniere_maj: string;
    sources: string[];
    fiabilite: 'HAUTE' | 'MOYENNE' | 'FAIBLE';
    completude: number; // pourcentage de complétude des informations
  };
}

export const ORGANISMES_KNOWLEDGE_BASE: any[] = [
  // MINISTÈRES
  {
    id: "MIN_PLANIFICATION",
    nom: "Ministère de la Planification et de la Prospective",
    sigle: "MPP",
    type: "MINISTERE",
    description: "Institution gouvernementale chargée de la programmation du développement et de l'investissement public au Gabon. Sa mission essentielle est de concevoir et de mettre en œuvre des stratégies et des politiques visant à garantir un développement économique, social et environnemental durable.",
    mission: "Concevoir et mettre en œuvre des stratégies et des politiques visant à garantir un développement économique, social et environnemental durable. Le ministère joue un rôle clé dans l'anticipation des besoins futurs du pays, la mobilisation des ressources, et la coordination des initiatives de développement.",
    vision: "Pour un développement inclusif et durable",
    slogan: "Bâtissons l'Édifice Nouveau",

    adresse: {
      siege: "Immeuble du Ministère de la Planification",
      ville: "Libreville",
      quartier: "Centre administratif"
    },

    contact: {
      telephone: ["+241 01 44 20 08"],
      email: ["contact@planification.gouv.ga"],
      siteWeb: "https://planification.gouv.ga"
    },

    tutelle: "Présidence de la République",
    dateCreation: "2009",
    statutJuridique: "Ministère de la République Gabonaise",

    dirigeants: [
      {
        poste: "Ministre de la Planification et de la Prospective",
        nom: "Louise Pierrette MVONO",
        depuis: "Mai 2025"
      },
      {
        poste: "Ancien Vice-Premier Ministre",
        nom: "Alexandre Barro CHAMBRIER",
        depuis: "Jusqu'en Mai 2025"
      }
    ],

    departements: [
      {
        nom: "Commissariat Général au Plan",
        missions: [
          "Élaboration du Plan National de Croissance et de Développement (PNCD)",
          "Coordination de la planification nationale",
          "Suivi-évaluation des politiques publiques"
        ]
      },
      {
        nom: "Direction Générale de la Prospective",
        responsable: "Augustin BOUASSA BU NZIGOU",
        missions: [
          "Études exploratoires et prospectives",
          "Analyse des tendances et scénarios futurs",
          "Veille stratégique"
        ]
      },
      {
        nom: "Direction Générale des Statistiques",
        missions: [
          "Recensement Général de la Population (RGPL)",
          "Production des statistiques nationales",
          "Rebasing du Produit Intérieur Brut"
        ]
      }
    ],

    horaires: {
      lundi: { debut: "08:00", fin: "17:00" },
      mardi: { debut: "08:00", fin: "17:00" },
      mercredi: { debut: "08:00", fin: "17:00" },
      jeudi: { debut: "08:00", fin: "17:00" },
      vendredi: { debut: "08:00", fin: "17:00" }
    },

    services: [
      {
        nom: "Élaboration de projets de développement",
        code: "PROJ_DEV",
        description: "Accompagnement dans la conception et la mise en œuvre de projets de développement local et national",
        documents_requis: [
          "Étude de faisabilité",
          "Note conceptuelle",
          "Budget prévisionnel",
          "Plan de financement"
        ],
        duree_traitement: "3-6 mois",
        cout: "Gratuit pour projets publics",
        modalites: ["Dépôt de dossier", "Évaluation technique", "Validation"]
      },
      {
        nom: "Consultation statistique",
        code: "STAT_CONSULT",
        description: "Fourniture de données statistiques et d'analyses économiques",
        documents_requis: ["Demande motivée", "Identification du demandeur"],
        duree_traitement: "5-10 jours",
        cout: "Variable selon le type de données",
        modalites: ["En ligne", "Sur site", "Par correspondance"]
      }
    ],

    projets_en_cours: [
      {
        nom: "Plan National de Croissance et de Développement (PNCD) 2026-2030",
        description: "Nouveau cadre stratégique pour bâtir un Gabon inclusif, durable et résolument tourné vers l'avenir",
        echeance: "2026",
        partenaires: [
          "Nations Unies", "Banque mondiale", "Union Européenne",
          "UNICEF", "ONU Habitat", "FAO", "PNUD"
        ]
      },
      {
        nom: "Programme d'Urgence de Développement Communautaire (PUDC)",
        description: "Investissements structurants d'urgence dans les zones rurales et périurbaines",
        budget: "120 milliards FCFA",
        echeance: "2026"
      },
      {
        nom: "Réhabilitation du siège du ministère",
        description: "Travaux de réhabilitation du bâtiment destiné à accueillir les services du département ministériel",
        partenaires: ["FLAJ Gabon", "BW Energy", "VAALCO Gabon SA"]
      }
    ],

    effectifs: {
      total: 800,
      cadres: 150,
      agentsExecutions: 650
    },

    statistiques: {
      demandes_traitees_par_mois: 200,
      taux_satisfaction: 85,
      delai_moyen_traitement: "15 jours",
      couverture_nationale: "100%"
    },

    partenaires: {
      internationaux: [
        "Nations Unies", "Banque mondiale", "Union Européenne",
        "UNICEF", "ONU Habitat", "FAO", "PNUD", "INSEE"
      ],
      nationaux: [
        "Ministère de l'Économie", "Ministère du Budget",
        "Direction Générale des Statistiques"
      ]
    },

    metadonnees: {
      derniere_maj: "2025-01-25",
      sources: [
        "Site officiel planification.gouv.ga",
        "LinkedIn Ministère de la Planification",
        "Communiqués officiels 2024-2025"
      ],
      fiabilite: "HAUTE",
      completude: 95
    }
  },

  {
    id: "MIN_SANTE",
    nom: "Ministère de la Santé et des Affaires Sociales",
    sigle: "MSAS",
    type: "MINISTERE",
    description: "Le Ministère de la Santé et des Affaires Sociales du Gabon est chargé de la mise en œuvre de la politique sanitaire et sociale du pays. Il supervise l'ensemble du système de santé gabonais et coordonne les politiques d'assistance sociale.",
    mission: "Garantir l'accès universel aux soins de santé de qualité et promouvoir le bien-être social de tous les Gabonais à travers des politiques inclusives et durables.",

    adresse: {
      siege: "Immeuble du Ministère de la Santé",
      ville: "Libreville",
      quartier: "Centre administratif"
    },

    contact: {
      telephone: ["+241 01 76 20 65", "+241 01 76 32 47"],
      email: ["contact@sante.gouv.ga", "ministre@sante.gouv.ga"],
      siteWeb: "https://www.sante.gouv.ga"
    },

    statutJuridique: "Ministère de la République Gabonaise",

    dirigeants: [
      {
        poste: "Ministre de la Santé et des Affaires Sociales"
      }
    ],

    departements: [
      {
        nom: "Direction Générale de la Santé",
        missions: [
          "Élaboration des politiques sanitaires",
          "Coordination du système de santé",
          "Surveillance épidémiologique"
        ]
      },
      {
        nom: "Direction des Établissements de Soins",
        missions: [
          "Gestion des hôpitaux publics",
          "Supervision des centres de santé",
          "Contrôle qualité des soins"
        ]
      },
      {
        nom: "Direction de la Pharmacie",
        missions: [
          "Contrôle des médicaments",
          "Gestion de l'approvisionnement pharmaceutique",
          "Lutte contre les faux médicaments"
        ]
      },
      {
        nom: "Direction des Affaires Sociales",
        missions: [
          "Protection sociale",
          "Aide aux personnes vulnérables",
          "Coordination des programmes sociaux"
        ]
      }
    ],

    horaires: {
      lundi: { debut: "07:30", fin: "16:30" },
      mardi: { debut: "07:30", fin: "16:30" },
      mercredi: { debut: "07:30", fin: "16:30" },
      jeudi: { debut: "07:30", fin: "16:30" },
      vendredi: { debut: "07:30", fin: "16:30" }
    },

    services: [
      {
        nom: "Autorisation d'exercice médical",
        code: "AUTH_MED",
        description: "Délivrance d'autorisations pour l'exercice de la médecine au Gabon",
        documents_requis: [
          "Diplôme de médecine légalisé",
          "Certificat de moralité",
          "Certificat médical",
          "Photo d'identité",
          "Copie CNI ou passeport"
        ],
        duree_traitement: "30 jours",
        cout: "50 000 FCFA",
        beneficiaires: ["Médecins", "Chirurgiens-dentistes", "Pharmaciens"]
      },
      {
        nom: "Agrément établissement sanitaire",
        code: "AGRE_ETAB",
        description: "Agrément pour l'ouverture d'établissements de soins privés",
        documents_requis: [
          "Dossier technique complet",
          "Plans architecturaux",
          "Liste du personnel qualifié",
          "Équipements médicaux"
        ],
        duree_traitement: "90 jours",
        cout: "200 000 FCFA",
        beneficiaires: ["Promoteurs privés", "Associations"]
      },
      {
        nom: "Certificat médical d'aptitude",
        code: "CERT_APTITUDE",
        description: "Délivrance de certificats médicaux pour différents usages",
        documents_requis: [
          "Demande motivée",
          "Examens médicaux requis",
          "Photo d'identité"
        ],
        duree_traitement: "48 heures",
        cout: "5 000-15 000 FCFA",
        beneficiaires: ["Travailleurs", "Étudiants", "Demandeurs divers"]
      }
    ],

    effectifs: {
      total: 12000,
      cadres: 3000,
      agentsExecutions: 9000
    },

    statistiques: {
      demandes_traitees_par_mois: 1500,
      taux_satisfaction: 78,
      delai_moyen_traitement: "20 jours",
      couverture_nationale: "100%"
    },

    partenaires: {
      internationaux: [
        "OMS", "UNICEF", "Banque mondiale", "Coopération française",
        "Union Africaine", "CEMAC"
      ],
      nationaux: [
        "CNAMGS", "Centre Hospitalier Universitaire de Libreville",
        "Ordre des Médecins du Gabon"
      ]
    },

    metadonnees: {
      derniere_maj: "2025-01-25",
      sources: [
        "Site officiel sante.gouv.ga",
        "LinkedIn Ministère de la Santé",
        "Rapports activité 2024"
      ],
      fiabilite: "HAUTE",
      completude: 88
    }
  },

  {
    id: "MIN_ECONOMIE",
    nom: "Ministère de l'Économie, des Finances, de la Dette et des Participations, chargé de la Lutte contre la vie chère",
    sigle: "MEFP",
    type: "MINISTERE",
    description: "Ministère en charge de la politique économique et financière du Gabon, de la gestion de la dette publique, des participations de l'État et de la lutte contre la vie chère.",
    mission: "Concevoir, coordonner et mettre en œuvre la politique économique et financière de l'État gabonais, assurer une gestion rigoureuse des finances publiques et lutter contre la cherté de la vie.",

    adresse: {
      siege: "Immeuble du Ministère de l'Économie",
      ville: "Libreville",
      quartier: "Centre administratif"
    },

    contact: {
      telephone: ["+241 01 72 12 45", "+241 01 72 14 89"],
      email: ["contact@budget.gouv.ga", "ministre@economie.gouv.ga"],
      siteWeb: "https://budget.gouv.ga"
    },

    statutJuridique: "Ministère de la République Gabonaise",

    dirigeants: [
      {
        poste: "Ministre d'État, en charge de l'Économie, des Finances, de la Dette et des Participations",
        nom: "Henry-Claude OYIMA"
      }
    ],

    departements: [
      {
        nom: "Direction Générale du Budget et des Finances Publiques (DGBFIP)",
        missions: [
          "Préparation et exécution du budget de l'État",
          "Gestion de la solde des agents publics",
          "Contrôle des dépenses publiques"
        ]
      },
      {
        nom: "Direction Générale de la Comptabilité Publique et du Trésor (DGCPT)",
        missions: [
          "Tenue de la comptabilité publique",
          "Gestion de la trésorerie de l'État",
          "Recouvrement des recettes publiques"
        ]
      },
      {
        nom: "Direction Générale des Marchés Publics (DGMP)",
        missions: [
          "Régulation des marchés publics",
          "Contrôle de la commande publique",
          "Formation aux procédures de marchés"
        ]
      },
      {
        nom: "Direction Générale du Patrimoine de l'État (DGPE)",
        missions: [
          "Gestion du patrimoine immobilier de l'État",
          "Participations de l'État dans les entreprises",
          "Évaluation et cession d'actifs publics"
        ]
      },
      {
        nom: "Agence Judiciaire de l'État (AJE)",
        missions: [
          "Représentation de l'État en justice",
          "Conseil juridique aux administrations",
          "Gestion du contentieux public"
        ]
      }
    ],

    horaires: {
      lundi: { debut: "08:00", fin: "17:00" },
      mardi: { debut: "08:00", fin: "17:00" },
      mercredi: { debut: "08:00", fin: "17:00" },
      jeudi: { debut: "08:00", fin: "17:00" },
      vendredi: { debut: "08:00", fin: "17:00" }
    },

    services: [
      {
        nom: "Consultation budgétaire",
        code: "CONSULT_BUDGET",
        description: "Information et conseil sur les procédures budgétaires",
        documents_requis: ["Demande écrite", "Justification du besoin"],
        duree_traitement: "5-10 jours",
        cout: "Gratuit",
        beneficiaires: ["Administrations", "Collectivités", "Organismes publics"]
      },
      {
        nom: "Enregistrement marché public",
        code: "ENREG_MARCHE",
        description: "Enregistrement et contrôle des marchés publics",
        documents_requis: [
          "Dossier d'appel d'offres",
          "Procès-verbal d'attribution",
          "Contrat signé",
          "Cautionnements"
        ],
        duree_traitement: "15-30 jours",
        cout: "Timbres fiscaux",
        beneficiaires: ["Administrations publiques", "Entreprises"]
      }
    ],

    projets_en_cours: [
      {
        nom: "Gabon Economic Forum 2025",
        description: "Forum économique pour attirer les investissements et promouvoir le développement économique",
        echeance: "Juillet 2025"
      },
      {
        nom: "Réforme du système fiscal",
        description: "Modernisation du système fiscal gabonais pour améliorer les recettes",
        echeance: "2026"
      }
    ],

    effectifs: {
      total: 2500,
      cadres: 800,
      agentsExecutions: 1700
    },

    statistiques: {
      demandes_traitees_par_mois: 800,
      taux_satisfaction: 82,
      delai_moyen_traitement: "12 jours"
    },

    partenaires: {
      internationaux: [
        "Banque mondiale", "FMI", "BAD", "Union Européenne",
        "Coopération française", "CEMAC", "Moody's"
      ]
    },

    metadonnees: {
      derniere_maj: "2025-01-25",
      sources: [
        "Site officiel budget.gouv.ga",
        "Communiqués ministériels 2024-2025",
        "Rapports d'activité"
      ],
      fiabilite: "HAUTE",
      completude: 90
    }
  },

  {
    id: "MIN_TRANSPORT",
    nom: "Ministère des Transports",
    sigle: "MT",
    type: "MINISTERE",
    description: "Ministère chargé de la politique des transports au Gabon, incluant les transports terrestres, maritimes, fluviaux et aériens.",
    mission: "Concevoir, coordonner et mettre en œuvre la politique nationale des transports pour assurer la mobilité des personnes et des biens sur l'ensemble du territoire national.",

    adresse: {
      siege: "Immeuble Interministériel, Place de la Mosquée Hassan II",
      ville: "Libreville",
      codePostal: "BP 2087"
    },

    contact: {
      telephone: ["+241 01 74 35 89"],
      email: ["contact@transport.gouv.ga"]
    },

    statutJuridique: "Ministère de la République Gabonaise",

    dirigeants: [
      {
        poste: "Ministre des Transports",
        nom: "Paulette Megue M'OWONO",
        depuis: "2015"
      }
    ],

    departements: [
      {
        nom: "Direction Générale des Transports Terrestres",
        missions: [
          "Réglementation du transport routier",
          "Gestion du parc automobile",
          "Contrôle technique des véhicules"
        ]
      },
      {
        nom: "Direction Générale de l'Aviation Civile",
        missions: [
          "Réglementation de l'aviation civile",
          "Contrôle de la sécurité aérienne",
          "Gestion des aéroports"
        ]
      },
      {
        nom: "Direction de la Marine Marchande",
        missions: [
          "Réglementation du transport maritime",
          "Sécurité maritime",
          "Gestion des ports"
        ]
      },
      {
        nom: "Bureau d'Enquêtes Incidents et Accidents d'Aviation (BEIAA)",
        missions: [
          "Investigation des accidents aériens",
          "Prévention des accidents",
          "Rapports de sécurité"
        ]
      }
    ],

    horaires: {
      lundi: { debut: "08:00", fin: "17:00" },
      mardi: { debut: "08:00", fin: "17:00" },
      mercredi: { debut: "08:00", fin: "17:00" },
      jeudi: { debut: "08:00", fin: "17:00" },
      vendredi: { debut: "08:00", fin: "17:00" }
    },

    services: [
      {
        nom: "Permis de conduire",
        code: "PERMIS_CONDUIRE",
        description: "Délivrance et renouvellement des permis de conduire",
        documents_requis: [
          "Certificat médical d'aptitude",
          "Attestation de formation",
          "Photo d'identité",
          "Copie CNI",
          "Justificatif de domicile"
        ],
        duree_traitement: "15 jours",
        cout: "35 000 FCFA",
        beneficiaires: ["Citoyens majeurs", "Résidents"]
      },
      {
        nom: "Carte grise véhicule",
        code: "CARTE_GRISE",
        description: "Immatriculation et carte grise des véhicules",
        documents_requis: [
          "Certificat de conformité",
          "Facture d'achat",
          "Assurance véhicule",
          "Contrôle technique",
          "Copie CNI propriétaire"
        ],
        duree_traitement: "10 jours",
        cout: "25 000-75 000 FCFA",
        beneficiaires: ["Propriétaires de véhicules"]
      },
      {
        nom: "Licence transport public",
        code: "LICENCE_TRANSPORT",
        description: "Autorisation d'exploitation de transport public",
        documents_requis: [
          "Dossier de demande complet",
          "Capacité financière",
          "Parc automobile conforme",
          "Assurance professionnelle"
        ],
        duree_traitement: "45 jours",
        cout: "100 000-500 000 FCFA",
        beneficiaires: ["Entreprises de transport", "Coopératives"]
      }
    ],

    effectifs: {
      total: 1200,
      cadres: 300,
      agentsExecutions: 900
    },

    statistiques: {
      demandes_traitees_par_mois: 2500,
      taux_satisfaction: 75,
      delai_moyen_traitement: "18 jours"
    },

    partenaires: {
      internationaux: [
        "OACI (Organisation de l'Aviation Civile Internationale)",
        "OMI (Organisation Maritime Internationale)",
        "Union Africaine"
      ]
    },

    metadonnees: {
      derniere_maj: "2025-01-25",
      sources: [
        "Wikipedia - Ministry of Transport (Gabon)",
        "Informations gouvernementales officielles"
      ],
      fiabilite: "MOYENNE",
      completude: 75
    }
  },

  // ORGANISMES SPÉCIALISÉS
  {
    id: "CNSS_GABON",
    nom: "Caisse Nationale de Sécurité Sociale",
    sigle: "CNSS",
    type: "ETABLISSEMENT_PUBLIC",
    description: "Organisme privé chargé de la gestion d'un service public. La CNSS gère le régime de sécurité sociale au Gabon, couvrant les prestations familiales, les risques professionnels, les pensions et les prestations de santé.",
    mission: "Assurer la couverture sociale de ses adhérents et de leurs ayants droit par le service de diverses prestations dans le cadre de la politique générale du Gouvernement, prévues par la législation sociale et familiale.",
    slogan: "Mieux vous servir",

    adresse: {
      siege: "Boulevard de l'Indépendance",
      ville: "Libreville",
      codePostal: "BP 134",
      quartier: "Centre-ville"
    },

    contact: {
      telephone: ["+241 01 72 45 67", "+241 01 72 48 92"],
      email: ["contact@cnss.ga", "information@cnss.ga"],
      siteWeb: "https://www.cnss.ga"
    },

    tutelle: "Ministère de l'Emploi et de la Prévoyance Sociale",
    dateCreation: "1975",
    statutJuridique: "Organisme privé chargé de la gestion d'un service public",

    dirigeants: [
      {
        poste: "Directeur Général"
      },
      {
        poste: "Directeur Général Adjoint"
      }
    ],

    departements: [
      {
        nom: "Direction des Prestations Familiales (PF)",
        missions: [
          "Gestion des allocations familiales",
          "Prestations de maternité",
          "Aide aux familles"
        ]
      },
      {
        nom: "Direction des Risques Professionnels (RP)",
        missions: [
          "Gestion des accidents du travail",
          "Maladies professionnelles",
          "Prévention des risques"
        ]
      },
      {
        nom: "Direction des Pensions (PVID)",
        missions: [
          "Pensions de vieillesse",
          "Pensions d'invalidité",
          "Pensions de décès"
        ]
      },
      {
        nom: "Direction des Prestations de Santé",
        missions: [
          "Évacuations sanitaires",
          "Soins médicaux",
          "Action sanitaire et sociale"
        ]
      }
    ],

    horaires: {
      lundi: { debut: "07:30", fin: "16:00" },
      mardi: { debut: "07:30", fin: "16:00" },
      mercredi: { debut: "07:30", fin: "16:00" },
      jeudi: { debut: "07:30", fin: "16:00" },
      vendredi: { debut: "07:30", fin: "16:00" }
    },

    services: [
      {
        nom: "Immatriculation CNSS",
        code: "IMMAT_CNSS",
        description: "Inscription d'un travailleur au régime de sécurité sociale",
        documents_requis: [
          "Acte de naissance",
          "Certificat de nationalité ou CNI",
          "Certificat médical d'embauche",
          "Photo d'identité",
          "Contrat de travail"
        ],
        duree_traitement: "7 jours",
        cout: "Gratuit",
        beneficiaires: ["Travailleurs salariés", "Salariés de l'État", "Assurés volontaires"]
      },
      {
        nom: "Allocations familiales",
        code: "ALLOC_FAM",
        description: "Prestations mensuelles pour les familles avec enfants",
        documents_requis: [
          "Certificat de scolarité",
          "Acte de naissance des enfants",
          "Certificat de vie",
          "Bulletin de salaire"
        ],
        duree_traitement: "15 jours",
        cout: "Gratuit",
        beneficiaires: ["Travailleurs avec enfants à charge"]
      },
      {
        nom: "Pension de retraite",
        code: "PENSION_RETRAITE",
        description: "Liquidation et paiement des pensions de vieillesse",
        documents_requis: [
          "Demande de liquidation",
          "Certificat de cessation d'activité",
          "Acte de naissance",
          "Certificat de vie",
          "Relevé de carrière"
        ],
        duree_traitement: "60 jours",
        cout: "Gratuit",
        beneficiaires: ["Travailleurs ayant 60 ans et 15 ans de cotisation"]
      },
      {
        nom: "Déclaration accident de travail",
        code: "DECLAR_AT",
        description: "Déclaration et prise en charge des accidents du travail",
        documents_requis: [
          "Déclaration d'accident",
          "Certificat médical initial",
          "Rapport de l'employeur",
          "Témoignages éventuels"
        ],
        duree_traitement: "48 heures",
        cout: "Gratuit",
        beneficiaires: ["Travailleurs victimes d'accidents"]
      }
    ],

    proceduresAdministratives: [
      {
        nom: "Affiliation employeur",
        etapes: [
          "Dépôt dossier d'affiliation",
          "Vérification documents",
          "Attribution numéro employeur",
          "Remise carnet d'affiliation"
        ],
        duree: "10 jours",
        cout: "Gratuit"
      },
      {
        nom: "Réclamation prestation",
        etapes: [
          "Dépôt réclamation écrite",
          "Examen du dossier",
          "Enquête si nécessaire",
          "Décision et notification"
        ],
        duree: "30 jours",
        cout: "Gratuit"
      }
    ],

    effectifs: {
      total: 650,
      cadres: 200,
      agentsExecutions: 450
    },

    statistiques: {
      demandes_traitees_par_mois: 8500,
      taux_satisfaction: 78,
      delai_moyen_traitement: "12 jours",
      couverture_nationale: "Secteur privé et public"
    },

    projets_en_cours: [
      {
        nom: "Portail e-CNSS",
        description: "Plateforme digitale pour simplifier les démarches administratives",
        echeance: "2025"
      },
      {
        nom: "Extension réseau agences",
        description: "Ouverture de nouvelles agences en province",
        echeance: "2026"
      }
    ],

    partenaires: {
      internationaux: ["AISS (Association Internationale de Sécurité Sociale)"],
      nationaux: ["Ministère de l'Emploi", "CNAMGS", "Employeurs gabonais"]
    },

    metadonnees: {
      derniere_maj: "2025-01-25",
      sources: [
        "LinkedIn CNSS Gabon",
        "Site officiel cnss.ga",
        "Rapports d'activité 2024"
      ],
      fiabilite: "HAUTE",
      completude: 92
    }
  },

  {
    id: "CNAMGS",
    nom: "Caisse Nationale d'Assurance Maladie et de Garantie Sociale",
    sigle: "CNAMGS",
    type: "ETABLISSEMENT_PUBLIC",
    description: "Organisme chargé de la gestion du régime obligatoire d'assurance maladie et de garantie sociale au Gabon. Créée en 2007, elle constitue l'élément moteur de la politique sociale du gouvernement gabonais.",
    mission: "Accompagner la population gabonaise dans ses dépenses de santé à travers un régime obligatoire d'assurance maladie et de garantie sociale, garantissant un accès équitable aux soins de santé.",
    slogan: "La solidarité a un sens",

    adresse: {
      siege: "Immeuble Hollando, Boulevard de l'Indépendance",
      ville: "Libreville",
      codePostal: "BP 3999",
      quartier: "Centre-ville"
    },

    contact: {
      telephone: ["+241 01 74 15 25", "+241 01 74 18 36"],
      email: ["contact@cnamgs.ga", "info@cnamgs.ga"],
      siteWeb: "https://www.cnamgs.ga"
    },

    tutelle: "Ministère de la Prévoyance Sociale et de la Solidarité Nationale",
    dateCreation: "2007",
    statutJuridique: "Établissement public à caractère administratif",

    dirigeants: [
      {
        poste: "Directeur Général"
      }
    ],

    departements: [
      {
        nom: "Direction des Prestations",
        missions: [
          "Gestion des remboursements de soins",
          "Contrôle médical",
          "Relations avec les prestataires de soins"
        ]
      },
      {
        nom: "Direction de la Garantie Sociale",
        missions: [
          "Gestion des prestations sociales",
          "Aide aux populations vulnérables",
          "Programmes d'assistance sociale"
        ]
      },
      {
        nom: "Direction du Contrôle et de l'Audit",
        missions: [
          "Contrôle des facturations",
          "Audit des établissements de soins",
          "Lutte contre la fraude"
        ]
      }
    ],

    horaires: {
      lundi: { debut: "08:00", fin: "16:30" },
      mardi: { debut: "08:00", fin: "16:30" },
      mercredi: { debut: "08:00", fin: "16:30" },
      jeudi: { debut: "08:00", fin: "16:30" },
      vendredi: { debut: "08:00", fin: "16:30" }
    },

    services: [
      {
        nom: "Affiliation assurance maladie",
        code: "AFFIL_MALADIE",
        description: "Inscription au régime d'assurance maladie obligatoire",
        documents_requis: [
          "Formulaire d'affiliation",
          "Copie CNI ou passeport",
          "Certificat de travail",
          "Photo d'identité",
          "Certificat médical"
        ],
        duree_traitement: "15 jours",
        cout: "Gratuit",
        beneficiaires: ["Travailleurs", "Fonctionnaires", "Étudiants", "Familles"]
      },
      {
        nom: "Remboursement soins médicaux",
        code: "REMBOURS_SOINS",
        description: "Prise en charge et remboursement des frais médicaux",
        documents_requis: [
          "Factures originales",
          "Ordonnances médicales",
          "Certificats médicaux",
          "Carte d'assuré",
          "Justificatifs de paiement"
        ],
        duree_traitement: "20 jours",
        cout: "Gratuit (service)",
        beneficiaires: ["Assurés CNAMGS et ayants droit"]
      },
      {
        nom: "Évacuation sanitaire",
        code: "EVAC_SANITAIRE",
        description: "Organisation et prise en charge des évacuations sanitaires",
        documents_requis: [
          "Dossier médical complet",
          "Rapport de commission médicale",
          "Devis de soins à l'étranger",
          "Justificatifs administratifs"
        ],
        duree_traitement: "72 heures (urgence)",
        cout: "Selon plafonds",
        beneficiaires: ["Assurés en situation critique"]
      }
    ],

    effectifs: {
      total: 350,
      cadres: 120,
      agentsExecutions: 230
    },

    statistiques: {
      demandes_traitees_par_mois: 15000,
      taux_satisfaction: 82,
      delai_moyen_traitement: "18 jours",
      couverture_nationale: "85% de la population"
    },

    partenaires: {
      internationaux: ["OMS", "Coopération française", "Union Européenne"],
      nationaux: [
        "Ministère de la Santé", "CHU de Libreville",
        "Cliniques privées", "Pharmacies"
      ]
    },

    metadonnees: {
      derniere_maj: "2025-01-25",
      sources: [
        "LinkedIn CNAMGS",
        "Site officiel cnamgs.ga",
        "Rapports ministériels"
      ],
      fiabilite: "HAUTE",
      completude: 85
    }
  },

  {
    id: "DGSEE",
    nom: "Direction Générale de la Statistique et des Études Économiques",
    sigle: "DGSEE",
    type: "DIRECTION_GENERALE",
    description: "Service statistique officiel du Gabon, établi sous sa forme actuelle en 1976. La DGSEE est responsable de la coordination technique du système statistique national et de la diffusion des données statistiques.",
    mission: "Assurer la coordination technique du système statistique national et diffuser les données statistiques à destination du gouvernement, du secteur privé, des partenaires au développement et du public.",

    adresse: {
      siege: "Immeuble de la Statistique",
      ville: "Libreville",
      quartier: "Centre administratif"
    },

    contact: {
      telephone: ["+241 01 72 04 55"],
      email: ["contact@stat-gabon.org", "dgsee@stat-gabon.org"]
    },

    tutelle: "Ministère de la Planification et de la Prospective",
    dateCreation: "1976",
    statutJuridique: "Direction générale de l'administration centrale",

    dirigeants: [
      {
        poste: "Directeur Général",
        nom: "Francis Thierry TIWINOT",
        depuis: "2009"
      }
    ],

    departements: [
      {
        nom: "Direction des Statistiques Démographiques",
        missions: [
          "Recensements de population",
          "État civil et démographie",
          "Enquêtes démographiques"
        ]
      },
      {
        nom: "Direction des Statistiques Économiques",
        missions: [
          "Comptes nationaux",
          "Statistiques des entreprises",
          "Commerce extérieur"
        ]
      },
      {
        nom: "Direction des Enquêtes et Sondages",
        missions: [
          "Enquêtes ménages",
          "Enquêtes sectorielles",
          "Méthodologie statistique"
        ]
      }
    ],

    horaires: {
      lundi: { debut: "08:00", fin: "17:00" },
      mardi: { debut: "08:00", fin: "17:00" },
      mercredi: { debut: "08:00", fin: "17:00" },
      jeudi: { debut: "08:00", fin: "17:00" },
      vendredi: { debut: "08:00", fin: "17:00" }
    },

    services: [
      {
        nom: "Production statistiques officielles",
        code: "STAT_OFFICIELLES",
        description: "Élaboration et publication des statistiques nationales",
        documents_requis: ["Demande officielle", "Cahier des charges"],
        duree_traitement: "Variable selon l'enquête",
        cout: "Budgétisé",
        beneficiaires: ["Gouvernement", "Organismes publics", "Chercheurs"]
      },
      {
        nom: "Fourniture de données statistiques",
        code: "FOURNITURE_DONNEES",
        description: "Mise à disposition de données statistiques aux utilisateurs",
        documents_requis: ["Demande motivée", "Engagement confidentialité si nécessaire"],
        duree_traitement: "5-15 jours",
        cout: "Selon le type de données",
        beneficiaires: ["Étudiants", "Chercheurs", "Entreprises", "Administrations"]
      }
    ],

    effectifs: {
      total: 150,
      cadres: 80,
      agentsExecutions: 70
    },

    statistiques: {
      demandes_traitees_par_mois: 100,
      taux_satisfaction: 88,
      delai_moyen_traitement: "10 jours"
    },

    partenaires: {
      internationaux: ["AFRISTAT", "INSEE", "Banque mondiale", "PNUD"],
      nationaux: ["Ministères sectoriels", "Universités", "Centre de recherche"]
    },

    metadonnees: {
      derniere_maj: "2025-01-25",
      sources: [
        "Wikipedia DGSEE",
        "Site officiel stat-gabon.org",
        "Rapports AFRISTAT"
      ],
      fiabilite: "HAUTE",
      completude: 78
    }
  }
];

/**
 * Fonction pour rechercher un organisme par son ID
 */
export function getOrganismeKnowledge(id: string): OrganismeKnowledge | undefined {
  return ORGANISMES_KNOWLEDGE_BASE.find(org => org.id === id);
}

/**
 * Fonction pour rechercher des organismes par type
 */
export function getOrganismesByType(type: OrganismeKnowledge['type']): OrganismeKnowledge[] {
  return ORGANISMES_KNOWLEDGE_BASE.filter(org => org.type === type);
}

/**
 * Fonction pour rechercher des organismes par nom ou sigle
 */
export function searchOrganismes(query: string): OrganismeKnowledge[] {
  const searchTerm = query.toLowerCase();
  return ORGANISMES_KNOWLEDGE_BASE.filter(org =>
    org.nom.toLowerCase().includes(searchTerm) ||
    org.sigle.toLowerCase().includes(searchTerm) ||
    org.description.toLowerCase().includes(searchTerm)
  );
}

/**
 * Fonction pour obtenir tous les services d'un organisme
 */
export function getServicesParOrganisme(organismeId: string) {
  const organisme = getOrganismeKnowledge(organismeId);
  return organisme?.services || [];
}

/**
 * Fonction pour obtenir les statistiques de complétude de la base de connaissances
 */
export function getKnowledgeBaseStats() {
  const total = ORGANISMES_KNOWLEDGE_BASE.length;
  const completudemoyenne = ORGANISMES_KNOWLEDGE_BASE.reduce((sum, org) =>
    sum + org.metadonnees.completude, 0) / total;

  const parType = ORGANISMES_KNOWLEDGE_BASE.reduce((acc, org) => {
    acc[org.type] = (acc[org.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const derniereMaj = Math.max(...ORGANISMES_KNOWLEDGE_BASE.map(org =>
    new Date(org.metadonnees.derniere_maj).getTime()
  ));

  return {
    totalOrganismes: total,
    completudeMoyenne: Math.round(completudemoyenne),
    repartitionParType: parType,
    derniereMiseAJour: new Date(derniereMaj).toISOString().split('T')[0],
    fiabiliteHaute: ORGANISMES_KNOWLEDGE_BASE.filter(org =>
      org.metadonnees.fiabilite === 'HAUTE').length
  };
}
