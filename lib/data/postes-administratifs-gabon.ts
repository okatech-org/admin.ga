/* @ts-nocheck */
// === SYSTÈME COMPLET DES POSTES ADMINISTRATIFS GABONAIS ===

export interface PosteAdministratif {
  id: string;
  intitule: string;
  niveau: number; // 1=Direction, 2=Encadrement, 3=Exécution
  typeOrganisme: string[];
  responsabilites: string[];
  prerequis: string[];
  salaire?: {
    min: number;
    max: number;
    devise: 'XAF';
  };
  avantages?: string[];
}

// === HIÉRARCHIE DES POSTES PAR TYPE D'ORGANISME ===

export const POSTES_PAR_TYPE_ORGANISME = {

  // ==================== PRÉSIDENCE DE LA RÉPUBLIQUE ====================
  PRESIDENCE: {
    direction: [
      {
        id: 'pres_001',
        intitule: 'Président de la République',
        niveau: 1,
        responsabilites: [
          'Chef de l\'État et des armées',
          'Garant de la Constitution',
          'Conduite de la politique étrangère',
          'Nomination des hauts fonctionnaires'
        ],
        prerequis: ['Élu au suffrage universel', 'Citoyen gabonais', 'Âge minimum 35 ans']
      },
      {
        id: 'pres_002',
        intitule: 'Directeur de Cabinet du Président',
        niveau: 1,
        responsabilites: [
          'Coordination du Cabinet présidentiel',
          'Interface avec les ministères',
          'Gestion de l\'agenda présidentiel'
        ],
        prerequis: ['Diplôme supérieur', '15+ ans expérience administration', 'Confiance présidentielle']
      },
      {
        id: 'pres_003',
        intitule: 'Secrétaire Général de la Présidence',
        niveau: 1,
        responsabilites: [
          'Administration des services présidentiels',
          'Gestion des ressources humaines',
          'Coordination administrative'
        ],
        prerequis: ['ENA ou équivalent', '12+ ans expérience', 'Concours de la fonction publique']
      }
    ],
    encadrement: [
      {
        id: 'pres_004',
        intitule: 'Conseiller Spécial du Président',
        niveau: 2,
        responsabilites: ['Conseil en politique publique', 'Expertise sectorielle', 'Missions spéciales'],
        prerequis: ['Expertise reconnue', '10+ ans expérience', 'Diplôme supérieur']
      },
      {
        id: 'pres_005',
        intitule: 'Chef de Protocole',
        niveau: 2,
        responsabilites: ['Organisation cérémonies officielles', 'Relations diplomatiques', 'Étiquette d\'État'],
        prerequis: ['Formation protocole', '8+ ans expérience', 'Langues étrangères']
      }
    ]
  },

  // ==================== PRIMATURE ====================
  PRIMATURE: {
    direction: [
      {
        id: 'prim_001',
        intitule: 'Premier Ministre',
        niveau: 1,
        responsabilites: [
          'Chef du Gouvernement',
          'Coordination de l\'action gouvernementale',
          'Exécution de la politique définie par le Président'
        ],
        prerequis: ['Nommé par le Président', 'Expérience politique/administrative', 'Diplôme supérieur']
      },
      {
        id: 'prim_002',
        intitule: 'Secrétaire Général du Gouvernement',
        niveau: 1,
        responsabilites: [
          'Secrétariat du Conseil des ministres',
          'Légistique gouvernementale',
          'Coordination interministérielle'
        ],
        prerequis: ['ENA ou droit', 'Magistrat ou haut fonctionnaire', '15+ ans expérience']
      },
      {
        id: 'prim_003',
        intitule: 'Directeur de Cabinet du Premier Ministre',
        niveau: 1,
        responsabilites: [
          'Coordination du Cabinet',
          'Interface avec Présidence',
          'Gestion politique courante'
        ],
        prerequis: ['Sciences politiques/ENA', '10+ ans expérience', 'Confiance du Premier Ministre']
      }
    ]
  },

  // ==================== MINISTÈRES ====================
  MINISTERE: {
    direction: [
      {
        id: 'min_001',
        intitule: 'Ministre',
        niveau: 1,
        responsabilites: [
          'Direction du département ministériel',
          'Définition des politiques sectorielles',
          'Représentation gouvernementale'
        ],
        prerequis: ['Nommé en Conseil des ministres', 'Expérience sectorielle', 'Leadership reconnu']
      },
      {
        id: 'min_002',
        intitule: 'Secrétaire Général (SG)',
        niveau: 1,
        responsabilites: [
          'Administration du ministère',
          'Coordination des directions',
          'Gestion des ressources humaines et budgétaires'
        ],
        prerequis: ['ENA ou équivalent', 'Concours A+ fonction publique', '12+ ans expérience']
      },
      {
        id: 'min_003',
        intitule: 'Directeur de Cabinet',
        niveau: 1,
        responsabilites: [
          'Coordination politique',
          'Interface avec autres ministères',
          'Conseil au ministre'
        ],
        prerequis: ['Formation supérieure', '8+ ans expérience', 'Confiance ministérielle']
      }
    ],
    encadrement: [
      {
        id: 'min_004',
        intitule: 'Directeur Général Adjoint',
        niveau: 2,
        responsabilites: ['Assistance au SG', 'Coordination opérationnelle', 'Suppléance'],
        prerequis: ['ENA ou master', 'Concours A fonction publique', '8+ ans expérience']
      },
      {
        id: 'min_005',
        intitule: 'Conseiller Technique',
        niveau: 2,
        responsabilites: ['Expertise technique sectorielle', 'Appui aux décisions', 'Études et analyses'],
        prerequis: ['Expertise reconnue', 'Diplôme spécialisé', '6+ ans expérience']
      },
      {
        id: 'min_006',
        intitule: 'Directeur des Affaires Administratives et Financières',
        niveau: 2,
        responsabilites: ['Gestion budgétaire', 'Ressources humaines', 'Logistique'],
        prerequis: ['Formation gestion/finances', 'Concours A fonction publique', '6+ ans expérience']
      }
    ]
  },

  // ==================== DIRECTIONS GÉNÉRALES ====================
  DIRECTION_GENERALE: {
    direction: [
      {
        id: 'dg_001',
        intitule: 'Directeur Général (DG)',
        niveau: 1,
        responsabilites: [
          'Direction de l\'établissement',
          'Mise en œuvre des politiques sectorielles',
          'Gestion stratégique'
        ],
        prerequis: ['ENA ou formation supérieure spécialisée', 'Concours A+ ou nomination', '10+ ans expérience']
      },
      {
        id: 'dg_002',
        intitule: 'Directeur Général Adjoint',
        niveau: 1,
        responsabilites: [
          'Assistance au DG',
          'Coordination opérationnelle',
          'Suppléance direction'
        ],
        prerequis: ['Formation supérieure', 'Concours A fonction publique', '8+ ans expérience']
      }
    ],
    encadrement: [
      {
        id: 'dg_003',
        intitule: 'Directeur de Département',
        niveau: 2,
        responsabilites: ['Direction d\'un département technique', 'Coordination des services', 'Expertise sectorielle'],
        prerequis: ['Formation spécialisée', 'Concours A fonction publique', '6+ ans expérience']
      },
      {
        id: 'dg_004',
        intitule: 'Chef de Service',
        niveau: 2,
        responsabilites: ['Gestion d\'un service', 'Encadrement d\'équipe', 'Exécution des activités'],
        prerequis: ['Formation technique', 'Concours B+ fonction publique', '4+ ans expérience']
      }
    ],
    execution: [
      {
        id: 'dg_005',
        intitule: 'Chargé d\'Études',
        niveau: 3,
        responsabilites: ['Études techniques', 'Analyses sectorielles', 'Appui opérationnel'],
        prerequis: ['Licence/Master', 'Concours B fonction publique', '2+ ans expérience']
      }
    ]
  },

  // ==================== GOUVERNORATS ====================
  GOUVERNORAT: {
    direction: [
      {
        id: 'gouv_001',
        intitule: 'Gouverneur de Province',
        niveau: 1,
        responsabilites: [
          'Représentant de l\'État en province',
          'Coordination des services déconcentrés',
          'Maintien de l\'ordre public'
        ],
        prerequis: ['Préfet ou équivalent', 'ENA', 'Nomination en Conseil des ministres']
      },
      {
        id: 'gouv_002',
        intitule: 'Secrétaire Général du Gouvernorat',
        niveau: 1,
        responsabilites: [
          'Administration du gouvernorat',
          'Coordination des services',
          'Suppléance du Gouverneur'
        ],
        prerequis: ['ENA ou équivalent', 'Concours A+ fonction publique', '10+ ans expérience']
      }
    ],
    encadrement: [
      {
        id: 'gouv_003',
        intitule: 'Chef de Cabinet du Gouverneur',
        niveau: 2,
        responsabilites: ['Coordination politique locale', 'Relations avec élus', 'Agenda du Gouverneur'],
        prerequis: ['Formation supérieure', 'Expérience administrative', 'Connaissance locale']
      }
    ]
  },

  // ==================== PRÉFECTURES ====================
  PREFECTURE: {
    direction: [
      {
        id: 'pref_001',
        intitule: 'Préfet',
        niveau: 1,
        responsabilites: [
          'Représentant de l\'État dans le département',
          'Coordination des services déconcentrés',
          'Application des lois et règlements'
        ],
        prerequis: ['ENA ou équivalent', 'Concours A+ fonction publique', '8+ ans expérience']
      },
      {
        id: 'pref_002',
        intitule: 'Secrétaire Général de Préfecture',
        niveau: 1,
        responsabilites: [
          'Administration de la préfecture',
          'Gestion des services',
          'Suppléance du Préfet'
        ],
        prerequis: ['Formation supérieure', 'Concours A fonction publique', '6+ ans expérience']
      }
    ],
    encadrement: [
      {
        id: 'pref_003',
        intitule: 'Chef de Service Administratif',
        niveau: 2,
        responsabilites: ['Gestion administrative', 'État civil', 'Délivrance documents officiels'],
        prerequis: ['Formation administrative', 'Concours B+ fonction publique', '4+ ans expérience']
      }
    ]
  },

  // ==================== MAIRIES ====================
  MAIRIE: {
    direction: [
      {
        id: 'maire_001',
        intitule: 'Maire',
        niveau: 1,
        responsabilites: [
          'Direction de la commune',
          'Exécution des délibérations du conseil municipal',
          'Représentation de la commune'
        ],
        prerequis: ['Élu municipal', 'Citoyen de la commune', 'Âge minimum 25 ans']
      },
      {
        id: 'maire_002',
        intitule: 'Secrétaire Général de Mairie',
        niveau: 1,
        responsabilites: [
          'Administration municipale',
          'Coordination des services techniques',
          'Gestion du personnel'
        ],
        prerequis: ['Formation administrative', 'Concours fonction publique territoriale', '5+ ans expérience']
      }
    ],
    encadrement: [
      {
        id: 'maire_003',
        intitule: 'Directeur des Services Techniques',
        niveau: 2,
        responsabilites: ['Travaux municipaux', 'Entretien infrastructure', 'Urbanisme local'],
        prerequis: ['Formation technique/ingénieur', 'Expérience travaux publics', '4+ ans expérience']
      },
      {
        id: 'maire_004',
        intitule: 'Receveur Municipal',
        niveau: 2,
        responsabilites: ['Gestion financière', 'Recouvrement taxes', 'Comptabilité municipale'],
        prerequis: ['Formation comptabilité/finances', 'Agrément trésor public', '3+ ans expérience']
      }
    ]
  },

  // ==================== ÉTABLISSEMENTS PUBLICS ====================
  ETABLISSEMENT_PUBLIC: {
    direction: [
      {
        id: 'etab_001',
        intitule: 'Directeur Général',
        niveau: 1,
        responsabilites: [
          'Direction de l\'établissement',
          'Mise en œuvre de la politique sectorielle',
          'Gestion stratégique et opérationnelle'
        ],
        prerequis: ['Formation supérieure spécialisée', 'Expertise sectorielle', '10+ ans expérience']
      },
      {
        id: 'etab_002',
        intitule: 'Directeur Général Adjoint',
        niveau: 1,
        responsabilites: [
          'Assistance au DG',
          'Coordination des départements',
          'Suppléance'
        ],
        prerequis: ['Formation supérieure', 'Expérience gestionnaire', '8+ ans expérience']
      }
    ],
    encadrement: [
      {
        id: 'etab_003',
        intitule: 'Directeur Administratif et Financier',
        niveau: 2,
        responsabilites: ['Gestion administrative', 'Finances et budget', 'Ressources humaines'],
        prerequis: ['Formation gestion/finances', 'Expérience administrative', '6+ ans expérience']
      },
      {
        id: 'etab_004',
        intitule: 'Directeur Technique',
        niveau: 2,
        responsabilites: ['Activités techniques', 'Innovation sectorielle', 'Expertise métier'],
        prerequis: ['Formation technique spécialisée', 'Expertise reconnue', '6+ ans expérience']
      }
    ]
  },

  // ==================== AGENCES SPÉCIALISÉES ====================
  AGENCE_SPECIALISEE: {
    direction: [
      {
        id: 'agence_001',
        intitule: 'Directeur Général',
        niveau: 1,
        responsabilites: [
          'Direction de l\'agence',
          'Mise en œuvre des missions spécialisées',
          'Relations avec tutelle'
        ],
        prerequis: ['Expertise sectorielle reconnue', 'Formation supérieure', '8+ ans expérience']
      }
    ],
    encadrement: [
      {
        id: 'agence_002',
        intitule: 'Directeur des Opérations',
        niveau: 2,
        responsabilites: ['Coordination opérationnelle', 'Mise en œuvre programmes', 'Suivi activités'],
        prerequis: ['Formation spécialisée', 'Expérience opérationnelle', '5+ ans expérience']
      }
    ]
  },

  // ==================== INSTITUTIONS JUDICIAIRES ====================
  INSTITUTION_JUDICIAIRE: {
    direction: [
      {
        id: 'jud_001',
        intitule: 'Premier Président (Cour)',
        niveau: 1,
        responsabilites: [
          'Direction de la juridiction',
          'Administration judiciaire',
          'Discipline des magistrats'
        ],
        prerequis: ['Magistrat hors hiérarchie', 'École de magistrature', '15+ ans expérience']
      },
      {
        id: 'jud_002',
        intitule: 'Procureur Général',
        niveau: 1,
        responsabilites: [
          'Direction du parquet général',
          'Politique pénale',
          'Coordination poursuites'
        ],
        prerequis: ['Magistrat hors hiérarchie', 'École de magistrature', '15+ ans expérience']
      },
      {
        id: 'jud_003',
        intitule: 'Greffier en Chef',
        niveau: 1,
        responsabilites: [
          'Administration du greffe',
          'Gestion des personnels de greffe',
          'Tenue des registres'
        ],
        prerequis: ['École de greffiers', 'Concours greffe', '10+ ans expérience']
      }
    ]
  }
};

// === GÉNÉRATION AUTOMATIQUE DES COMPTES UTILISATEURS ===

export interface CompteUtilisateur {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  poste: string;
  organismeId: string;
  role: 'ADMIN' | 'MANAGER' | 'AGENT' | 'USER';
  niveau: number;
  phone?: string;
  statut: 'ACTIF' | 'INACTIF' | 'SUSPENDU';
  dateCreation: string;
}

export function genererComptesParOrganisme(organisme: any): CompteUtilisateur[] {
  const comptes: CompteUtilisateur[] = [];
  const type = organisme.type;
  const postesConfig = POSTES_PAR_TYPE_ORGANISME[type];

  if (!postesConfig) {
    console.warn(`Type d'organisme non configuré: ${type}`);
    return [];
  }

  let compteur = 1;

  // Noms gabonais réalistes
  const nomsGabonais = [
    'ONDO', 'OYANE', 'OBAME', 'MBADINGA', 'NDONG', 'NGUEMA', 'MINKO', 'MOUANDZA',
    'KOUMBA', 'ELLA', 'MOUSSOUNDA', 'MBOUMBA', 'NGOUA', 'OVONO', 'NZUE',
    'MBENG', 'ABESSOLO', 'ALLOGHO', 'ANGOUE', 'AVOUREMBOU', 'BONGO'
  ];

  const prenomsGabonais = [
    'Jean-Claude', 'Marie-Josephine', 'Pierre-Emmanuel', 'Grace-Divine', 'Paul-Brice',
    'Sylvie-Paulette', 'Christian-Ghislain', 'Antoinette-Flore', 'Eric-Patrick', 'Claudine-Georgette',
    'Rodrigue-Steeve', 'Bernadette-Laurence', 'Guy-Bertrand', 'Henriette-Sylviane', 'Landry-Edgar'
  ];

  // Générer les postes de direction
  if (postesConfig.direction) {
    postesConfig.direction.forEach((poste: any) => {
      const nom = nomsGabonais[Math.floor(Math.random() * nomsGabonais.length)];
      const prenom = prenomsGabonais[Math.floor(Math.random() * prenomsGabonais.length)];

      comptes.push({
        id: `${organisme.code}_dir_${compteur.toString().padStart(3, '0')}`,
        email: `${prenom.toLowerCase().replace('-', '.')}.${nom.toLowerCase()}@${organisme.code.toLowerCase()}.ga`,
        nom,
        prenom,
        poste: poste.intitule,
        organismeId: organisme.code,
        role: 'ADMIN',
        niveau: poste.niveau,
        phone: `+241 0${Math.floor(Math.random() * 9) + 1} ${Math.floor(Math.random() * 90) + 10} ${Math.floor(Math.random() * 90) + 10} ${Math.floor(Math.random() * 90) + 10}`,
        statut: 'ACTIF',
        dateCreation: new Date().toISOString()
      });
      compteur++;
    });
  }

  // Générer les postes d'encadrement
  if (postesConfig.encadrement) {
    postesConfig.encadrement.forEach((poste: any) => {
      const nom = nomsGabonais[Math.floor(Math.random() * nomsGabonais.length)];
      const prenom = prenomsGabonais[Math.floor(Math.random() * prenomsGabonais.length)];

      comptes.push({
        id: `${organisme.code}_enc_${compteur.toString().padStart(3, '0')}`,
        email: `${prenom.toLowerCase().replace('-', '.')}.${nom.toLowerCase()}@${organisme.code.toLowerCase()}.ga`,
        nom,
        prenom,
        poste: poste.intitule,
        organismeId: organisme.code,
        role: 'MANAGER',
        niveau: poste.niveau,
        phone: `+241 0${Math.floor(Math.random() * 9) + 1} ${Math.floor(Math.random() * 90) + 10} ${Math.floor(Math.random() * 90) + 10} ${Math.floor(Math.random() * 90) + 10}`,
        statut: 'ACTIF',
        dateCreation: new Date().toISOString()
      });
      compteur++;
    });
  }

  // Générer quelques postes d'exécution additionnels
  for (let i = 0; i < Math.floor(Math.random() * 3) + 2; i++) {
    const nom = nomsGabonais[Math.floor(Math.random() * nomsGabonais.length)];
    const prenom = prenomsGabonais[Math.floor(Math.random() * prenomsGabonais.length)];

    comptes.push({
      id: `${organisme.code}_agent_${compteur.toString().padStart(3, '0')}`,
      email: `${prenom.toLowerCase().replace('-', '.')}.${nom.toLowerCase()}@${organisme.code.toLowerCase()}.ga`,
      nom,
      prenom,
      poste: 'Agent Administratif',
      organismeId: organisme.code,
      role: 'AGENT',
      niveau: 3,
      phone: `+241 0${Math.floor(Math.random() * 9) + 1} ${Math.floor(Math.random() * 90) + 10} ${Math.floor(Math.random() * 90) + 10} ${Math.floor(Math.random() * 90) + 10}`,
      statut: 'ACTIF',
      dateCreation: new Date().toISOString()
    });
    compteur++;
  }

  return comptes;
}

// === GÉNÉRATION POUR TOUS LES 160 ORGANISMES ===

export function genererTousLesComptes(organismes: any[]): CompteUtilisateur[] {
  const tousLesComptes: CompteUtilisateur[] = [];

  console.log('🏛️ Génération des comptes pour 160 organismes gabonais...');

  organismes.forEach((organisme, index) => {
    console.log(`📋 Traitement organisme ${index + 1}/160: ${organisme.nom}`);
    const comptesOrganisme = genererComptesParOrganisme(organisme);
    tousLesComptes.push(...comptesOrganisme);
  });

  console.log(`✅ ${tousLesComptes.length} comptes générés au total`);
  return tousLesComptes;
}

// === STATISTIQUES DES COMPTES ===

export function getStatistiquesComptes(comptes: CompteUtilisateur[]) {
  return {
    total: comptes.length,
    parRole: {
      ADMIN: comptes.filter(c => c.role === 'ADMIN').length,
      MANAGER: comptes.filter(c => c.role === 'MANAGER').length,
      AGENT: comptes.filter(c => c.role === 'AGENT').length,
    },
    parStatut: {
      ACTIF: comptes.filter(c => c.statut === 'ACTIF').length,
      INACTIF: comptes.filter(c => c.statut === 'INACTIF').length,
      SUSPENDU: comptes.filter(c => c.statut === 'SUSPENDU').length,
    },
    parNiveau: {
      niveau1: comptes.filter(c => c.niveau === 1).length,
      niveau2: comptes.filter(c => c.niveau === 2).length,
      niveau3: comptes.filter(c => c.niveau === 3).length,
    }
  };
}
