/**
 * Liste complète des Ministères du Gouvernement Gabonais 2025
 * Avec leurs structures internes et postes clés
 */

import {
  TYPES_ORGANISATIONS_GABON,
  TYPES_POSTES_HIERARCHIQUES,
  genererEmailGouvernemental
} from './gouvernement-gabon-2025';

export interface MinistereStructure {
  id: string;
  code: string;
  titre: string;
  titulaire: string;
  rang: 'ministre_etat' | 'ministre';
  secteurs: string[];
  attributions: string[];
  directions_generales?: string[];
  directions_principales?: string[];
  postes_confirmes?: Record<string, string>;
  email_contact?: string;
  telephone?: string;
  adresse?: string;
  ville: string;
}

// Ministères d'État (3)
export const MINISTERES_ETAT: MinistereStructure[] = [
  {
    id: "ME_ECO_FIN",
    code: "MEF",
    titre: "Ministère d'État, Ministère de l'Économie, des Finances, de la Dette et des Participations, chargé de la Lutte contre la Vie Chère",
    titulaire: "Henri-Claude OYIMA",
    rang: "ministre_etat",
    secteurs: ["économie", "finances", "dette", "participations", "vie_chère"],
    attributions: [
      "Politique économique nationale",
      "Gestion des finances publiques",
      "Gestion de la dette publique",
      "Participations de l'État",
      "Lutte contre la vie chère",
      "Budget de l'État",
      "Douanes et impôts"
    ],
    directions_generales: [
      "Direction Générale du Budget",
      "Direction Générale des Impôts",
      "Direction Générale des Douanes",
      "Direction Générale du Trésor",
      "Direction Générale de la Dette",
      "Direction Générale de l'Économie"
    ],
    postes_confirmes: {
      "directeur_general_budget": "Paule Élisabeth Désirée MBOUMBA LASSY"
    },
    email_contact: "contact@mef.gouv.ga",
    telephone: "+241 01 79 50 00",
    adresse: "BP 165 Libreville",
    ville: "Libreville"
  },
  {
    id: "ME_EDU_NAT",
    code: "MEN",
    titre: "Ministère d'État, Ministère de l'Éducation Nationale, de l'Instruction Civique et de la Formation Professionnelle",
    titulaire: "Camélia NTOUTOUME-LECLERCQ",
    rang: "ministre_etat",
    secteurs: ["éducation", "instruction_civique", "formation_professionnelle"],
    attributions: [
      "Politique éducative nationale",
      "Enseignement primaire et secondaire",
      "Instruction civique",
      "Formation professionnelle",
      "Personnel enseignant",
      "Infrastructures scolaires",
      "Programmes scolaires"
    ],
    directions_generales: [
      "Direction Générale de l'Enseignement Primaire",
      "Direction Générale de l'Enseignement Secondaire",
      "Direction Générale de la Formation Professionnelle",
      "Direction Générale de la Pédagogie"
    ],
    email_contact: "contact@men.gouv.ga",
    telephone: "+241 01 76 20 00",
    adresse: "BP 6 Libreville",
    ville: "Libreville"
  },
  {
    id: "ME_TRANS_MAR",
    code: "MTM",
    titre: "Ministère d'État, Ministère des Transports, de la Marine Marchande et de la Logistique",
    titulaire: "Ulrich MANFOUMBI MANFOUMBI",
    rang: "ministre_etat",
    secteurs: ["transports", "marine_marchande", "logistique"],
    attributions: [
      "Politique des transports",
      "Marine marchande",
      "Logistique nationale",
      "Infrastructures de transport",
      "Sécurité des transports",
      "Aviation civile",
      "Transport terrestre et ferroviaire"
    ],
    directions_generales: [
      "Direction Générale des Transports Terrestres",
      "Direction Générale de la Marine Marchande",
      "Direction Générale de l'Aviation Civile",
      "Direction Générale de la Logistique"
    ],
    email_contact: "contact@mtm.gouv.ga",
    telephone: "+241 01 74 47 00",
    adresse: "BP 803 Libreville",
    ville: "Libreville"
  }
];

// Ministères (17 premiers)
export const MINISTERES_PARTIE_1: MinistereStructure[] = [
  {
    id: "MIN_REF_REL_INST",
    code: "MRRI",
    titre: "Ministère de la Réforme et des Relations avec les Institutions",
    titulaire: "François NDONG OBIANG",
    rang: "ministre",
    secteurs: ["réforme_institutionnelle", "relations_institutions"],
    attributions: [
      "Réforme des institutions",
      "Relations avec les institutions constitutionnelles",
      "Modernisation de l'État",
      "Simplification administrative"
    ],
    directions_principales: [
      "Direction de la Réforme Institutionnelle",
      "Direction des Relations avec le Parlement",
      "Direction de la Modernisation Administrative"
    ],
    ville: "Libreville"
  },
  {
    id: "MIN_AFF_ETR",
    code: "MAE",
    titre: "Ministère des Affaires Étrangères et de la Coopération, chargé de la Diaspora",
    titulaire: "Régis ONANGA NDIAYE",
    rang: "ministre",
    secteurs: ["affaires_étrangères", "coopération", "diaspora"],
    attributions: [
      "Politique étrangère",
      "Relations diplomatiques",
      "Coopération internationale",
      "Gestion de la diaspora gabonaise",
      "Négociations internationales",
      "Protocole d'État"
    ],
    directions_generales: [
      "Direction Générale des Affaires Étrangères",
      "Direction Générale de la Coopération Internationale",
      "Direction Générale des Affaires Consulaires",
      "Direction Générale de la Diaspora"
    ],
    directions_principales: [
      "Direction du Protocole",
      "Direction des Organisations Internationales",
      "Direction des Affaires Juridiques"
    ],
    email_contact: "contact@mae.gouv.ga",
    telephone: "+241 01 79 10 00",
    adresse: "BP 2245 Libreville",
    ville: "Libreville"
  },
  {
    id: "MIN_JUST",
    code: "MJ",
    titre: "Ministère de la Justice, Garde des Sceaux",
    titulaire: "Paul-Marie GONDJOUT",
    rang: "ministre",
    secteurs: ["justice", "droits_humains"],
    attributions: [
      "Politique judiciaire",
      "Administration pénitentiaire",
      "Droits de l'homme",
      "Réforme judiciaire",
      "État civil",
      "Notariat et professions juridiques"
    ],
    directions_generales: [
      "Direction Générale des Affaires Judiciaires",
      "Direction Générale de l'Administration Pénitentiaire",
      "Direction Générale des Droits de l'Homme"
    ],
    email_contact: "contact@justice.gouv.ga",
    telephone: "+241 01 76 46 00",
    adresse: "BP 547 Libreville",
    ville: "Libreville"
  },
  {
    id: "MIN_INT_SEC",
    code: "MISD",
    titre: "Ministère de l'Intérieur, de la Sécurité et de la Décentralisation",
    titulaire: "Hermann IMMONGAULT",
    rang: "ministre",
    secteurs: ["intérieur", "sécurité", "décentralisation"],
    attributions: [
      "Administration territoriale",
      "Sécurité intérieure",
      "Décentralisation",
      "Collectivités locales",
      "Élections",
      "Police nationale",
      "Protection civile"
    ],
    directions_generales: [
      "Direction Générale de l'Administration du Territoire",
      "Direction Générale de la Documentation et de l'Immigration (DGDI)",
      "Direction Générale de la Police Nationale",
      "Direction Générale de la Protection Civile"
    ],
    postes_confirmes: {
      "inspecteur_general_services": "Général Julienne MOUYABI"
    },
    email_contact: "contact@interieur.gouv.ga",
    telephone: "+241 01 76 56 00",
    adresse: "BP 2110 Libreville",
    ville: "Libreville"
  },
  {
    id: "MIN_DEF_NAT",
    code: "MDN",
    titre: "Ministère de la Défense Nationale",
    titulaire: "Général Brigitte ONKANOWA",
    rang: "ministre",
    secteurs: ["défense", "forces_armées"],
    attributions: [
      "Politique de défense",
      "Forces armées",
      "Sécurité nationale",
      "Coopération militaire",
      "Industries de défense"
    ],
    directions_generales: [
      "État-Major Général des Forces Armées",
      "Direction Générale de la Gendarmerie Nationale",
      "Direction Générale du Service de Santé Militaire"
    ],
    ville: "Libreville"
  },
  {
    id: "MIN_SAN_AFF_SOC",
    code: "MSAS",
    titre: "Ministère de la Santé et des Affaires Sociales",
    titulaire: "Adrien MONGOUNGOU",
    rang: "ministre",
    secteurs: ["santé", "affaires_sociales"],
    attributions: [
      "Politique sanitaire nationale",
      "Système de santé",
      "Protection sociale",
      "Lutte contre les épidémies",
      "Hôpitaux et centres de santé",
      "Pharmacie et médicaments"
    ],
    directions_generales: [
      "Direction Générale de la Santé",
      "Direction Générale des Affaires Sociales",
      "Direction Générale de la Pharmacie et du Médicament",
      "Direction Générale de la Prévention"
    ],
    email_contact: "contact@sante.gouv.ga",
    telephone: "+241 01 76 30 00",
    adresse: "BP 50 Libreville",
    ville: "Libreville"
  },
  {
    id: "MIN_ENS_SUP",
    code: "MESRS",
    titre: "Ministère de l'Enseignement Supérieur et de la Recherche Scientifique",
    titulaire: "Simplice Désiré MAMBOULA",
    rang: "ministre",
    secteurs: ["enseignement_supérieur", "recherche"],
    attributions: [
      "Politique de l'enseignement supérieur",
      "Recherche scientifique",
      "Universités et grandes écoles",
      "Innovation technologique",
      "Bourses et œuvres universitaires"
    ],
    directions_generales: [
      "Direction Générale de l'Enseignement Supérieur",
      "Direction Générale de la Recherche Scientifique",
      "Direction Générale des Bourses et Stages"
    ],
    email_contact: "contact@enseignement-superieur.gouv.ga",
    telephone: "+241 01 73 20 00",
    adresse: "BP 3988 Libreville",
    ville: "Libreville"
  },
  {
    id: "MIN_FONC_PUB",
    code: "MFPRC",
    titre: "Ministère de la Fonction Publique et du Renforcement des Capacités",
    titulaire: "Pr Marcelle IBOUNDA",
    rang: "ministre",
    secteurs: ["fonction_publique", "capacités"],
    attributions: [
      "Gestion des agents publics",
      "Réforme administrative",
      "Formation des fonctionnaires",
      "Renforcement des capacités",
      "Modernisation de l'administration",
      "Statut de la fonction publique"
    ],
    directions_generales: [
      "Direction Générale de la Fonction Publique",
      "Direction Générale du Renforcement des Capacités",
      "Direction Générale de la Solde"
    ],
    email_contact: "contact@fonction-publique.gouv.ga",
    telephone: "+241 01 72 10 00",
    adresse: "BP 496 Libreville",
    ville: "Libreville"
  },
  {
    id: "MIN_TRAV_EMP",
    code: "MTEDS",
    titre: "Ministère du Travail, du Plein-emploi et du Dialogue Social",
    titulaire: "Patrick BARBERA ISAAC",
    rang: "ministre",
    secteurs: ["travail", "emploi", "dialogue_social"],
    attributions: [
      "Politique de l'emploi",
      "Relations sociales",
      "Dialogue social",
      "Lutte contre le chômage",
      "Formation professionnelle",
      "Inspection du travail"
    ],
    directions_generales: [
      "Direction Générale du Travail",
      "Direction Générale de l'Emploi",
      "Direction Générale du Dialogue Social"
    ],
    email_contact: "contact@travail.gouv.ga",
    telephone: "+241 01 76 37 00",
    adresse: "BP 2256 Libreville",
    ville: "Libreville"
  }
];

// Ministères (suite)
export const MINISTERES_PARTIE_2: MinistereStructure[] = [
  {
    id: "MIN_IND_TRANS",
    code: "MITL",
    titre: "Ministère de l'Industrie et de la Transformation Locale",
    titulaire: "Me Lubin NTOUTOUME",
    rang: "ministre",
    secteurs: ["industrie", "transformation"],
    attributions: [
      "Politique industrielle",
      "Transformation locale",
      "Développement manufacturier",
      "Zones industrielles",
      "Normalisation et qualité"
    ],
    directions_generales: [
      "Direction Générale de l'Industrie",
      "Direction Générale de la Transformation Locale",
      "Direction Générale des Zones Économiques"
    ],
    ville: "Libreville"
  },
  {
    id: "MIN_TRAV_PUB",
    code: "MTPC",
    titre: "Ministère des Travaux Publics et de la Construction",
    titulaire: "Edgard MOUKOUMBI",
    rang: "ministre",
    secteurs: ["travaux_publics", "construction"],
    attributions: [
      "Infrastructures publiques",
      "Routes et ponts",
      "Bâtiments publics",
      "Politique de construction",
      "Urbanisme et habitat"
    ],
    directions_generales: [
      "Direction Générale des Travaux Publics",
      "Direction Générale de la Construction",
      "Direction Générale de l'Habitat et de l'Urbanisme"
    ],
    email_contact: "contact@travaux-publics.gouv.ga",
    telephone: "+241 01 74 65 00",
    adresse: "BP 23 Libreville",
    ville: "Libreville"
  },
  {
    id: "MIN_ECO_NUM",
    code: "MENDI",
    titre: "Ministère de l'Économie Numérique, de la Digitalisation et de l'Innovation",
    titulaire: "Mark-Alexandre DOUMBA",
    rang: "ministre",
    secteurs: ["numérique", "digitalisation", "innovation"],
    attributions: [
      "Transformation digitale",
      "Technologies de l'information",
      "Innovation numérique",
      "Cybersécurité",
      "E-gouvernement",
      "Télécommunications"
    ],
    directions_generales: [
      "Direction Générale du Numérique",
      "Direction Générale de l'Innovation",
      "Direction Générale de la Cybersécurité"
    ],
    email_contact: "contact@numerique.gouv.ga",
    telephone: "+241 01 44 36 00",
    adresse: "BP 798 Libreville",
    ville: "Libreville"
  },
  {
    id: "MIN_ENT_COM",
    code: "MECPME",
    titre: "Ministère de l'Entrepreneuriat, du Commerce et des PME-PMI",
    titulaire: "Zenaba GNINGA CHANING",
    rang: "ministre",
    secteurs: ["entrepreneuriat", "commerce", "pme"],
    attributions: [
      "Promotion de l'entrepreneuriat",
      "Politique commerciale",
      "Développement des PME-PMI",
      "Facilitation des affaires",
      "Commerce intérieur et extérieur"
    ],
    directions_generales: [
      "Direction Générale du Commerce",
      "Direction Générale des PME-PMI",
      "Direction Générale de l'Entrepreneuriat"
    ],
    ville: "Libreville"
  },
  {
    id: "MIN_AGR_ELE",
    code: "MAEDR",
    titre: "Ministère de l'Agriculture, de l'Élevage et du Développement Rural",
    titulaire: "Odette POLO",
    rang: "ministre",
    secteurs: ["agriculture", "élevage", "développement_rural"],
    attributions: [
      "Politique agricole",
      "Développement de l'élevage",
      "Sécurité alimentaire",
      "Développement rural",
      "Pêche continentale",
      "Coopératives agricoles"
    ],
    directions_generales: [
      "Direction Générale de l'Agriculture",
      "Direction Générale de l'Élevage",
      "Direction Générale du Développement Rural"
    ],
    email_contact: "contact@agriculture.gouv.ga",
    telephone: "+241 01 76 13 00",
    adresse: "BP 551 Libreville",
    ville: "Libreville"
  },
  {
    id: "MIN_ENV_ECO",
    code: "MEEC",
    titre: "Ministère de l'Environnement, de l'Écologie et du Climat",
    titulaire: "Mays MOUISSI",
    rang: "ministre",
    secteurs: ["environnement", "écologie", "climat"],
    attributions: [
      "Protection de l'environnement",
      "Politique climatique",
      "Gestion des forêts",
      "Biodiversité",
      "Développement durable",
      "Parcs nationaux"
    ],
    directions_generales: [
      "Direction Générale de l'Environnement",
      "Direction Générale des Forêts",
      "Direction Générale du Climat"
    ],
    postes_confirmes: {
      "directeur_cabinet": "Paul-Timothee Il MBOUMBA",
      "conseiller_juridique": "Ruth TSIOUKACKA",
      "conseiller_communication": "Alex Cédric SAIZONOU ANGUILET",
      "conseiller_diplomatique": "Ines Cecilia MOUSSAVOU NGADJI"
    },
    email_contact: "contact@environnement.gouv.ga",
    telephone: "+241 01 76 61 00",
    adresse: "BP 3241 Libreville",
    ville: "Libreville"
  },
  {
    id: "MIN_FEM_FAM",
    code: "MFFPE",
    titre: "Ministère de la Femme, de la Famille et de la Protection de l'Enfance",
    titulaire: "Elodie Diane FOUEFOUE",
    rang: "ministre",
    secteurs: ["femme", "famille", "enfance"],
    attributions: [
      "Promotion des droits des femmes",
      "Politique familiale",
      "Protection de l'enfance",
      "Égalité des genres",
      "Lutte contre les violences",
      "Autonomisation des femmes"
    ],
    directions_generales: [
      "Direction Générale de la Promotion de la Femme",
      "Direction Générale de la Famille",
      "Direction Générale de la Protection de l'Enfance"
    ],
    ville: "Libreville"
  },
  {
    id: "MIN_JEUN_SPO",
    code: "MJSRCAVA",
    titre: "Ministère de la Jeunesse, des Sports, du Rayonnement Culturel et des Arts, chargé de la Vie Associative",
    titulaire: "Dr Serge Mickoto CHAVAGNE",
    rang: "ministre",
    secteurs: ["jeunesse", "sports", "culture", "arts", "vie_associative"],
    attributions: [
      "Politique de la jeunesse",
      "Développement sportif",
      "Promotion culturelle",
      "Arts et patrimoine",
      "Vie associative",
      "Infrastructures sportives et culturelles"
    ],
    directions_generales: [
      "Direction Générale de la Jeunesse",
      "Direction Générale des Sports",
      "Direction Générale de la Culture et des Arts",
      "Direction Générale de la Vie Associative"
    ],
    email_contact: "contact@jeunesse-sports.gouv.ga",
    telephone: "+241 01 74 36 00",
    adresse: "BP 2139 Libreville",
    ville: "Libreville"
  },
  {
    id: "MIN_TOUR_ART",
    code: "MTA",
    titre: "Ministère du Tourisme et de l'Artisanat",
    titulaire: "Pascal HOUANGNI AMBOUROUE",
    rang: "ministre",
    secteurs: ["tourisme", "artisanat"],
    attributions: [
      "Promotion touristique",
      "Développement de l'artisanat",
      "Sites touristiques",
      "Hôtellerie et restauration",
      "Formation touristique"
    ],
    directions_generales: [
      "Direction Générale du Tourisme",
      "Direction Générale de l'Artisanat"
    ],
    ville: "Libreville"
  },
  {
    id: "MIN_COM_MED",
    code: "MCM",
    titre: "Ministère de la Communication et des Médias",
    titulaire: "Laurence NDONG",
    rang: "ministre",
    secteurs: ["communication", "médias"],
    attributions: [
      "Politique de communication",
      "Régulation des médias",
      "Audiovisuel public",
      "Presse et édition",
      "Communication gouvernementale"
    ],
    directions_generales: [
      "Direction Générale de la Communication",
      "Direction Générale des Médias",
      "Direction Générale de l'Audiovisuel"
    ],
    ville: "Libreville"
  },
  {
    id: "MIN_PET_GAZ",
    code: "MPG",
    titre: "Ministère du Pétrole et du Gaz",
    titulaire: "Marcel ABEKE",
    rang: "ministre",
    secteurs: ["pétrole", "gaz"],
    attributions: [
      "Politique pétrolière et gazière",
      "Exploration et production",
      "Contrats pétroliers",
      "Raffinage et distribution",
      "Revenus pétroliers"
    ],
    directions_generales: [
      "Direction Générale des Hydrocarbures",
      "Direction Générale du Gaz"
    ],
    ville: "Libreville"
  },
  {
    id: "MIN_MIN_GEO",
    code: "MMG",
    titre: "Ministère des Mines et de la Géologie",
    titulaire: "Lionel Cédric EBANG",
    rang: "ministre",
    secteurs: ["mines", "géologie"],
    attributions: [
      "Politique minière",
      "Exploration minière",
      "Exploitation des mines",
      "Géologie et cartographie",
      "Cadastre minier"
    ],
    directions_generales: [
      "Direction Générale des Mines",
      "Direction Générale de la Géologie"
    ],
    ville: "Libreville"
  },
  {
    id: "MIN_EAUX_FOR",
    code: "MEFOR",
    titre: "Ministère des Eaux, des Forêts, de la Mer et de l'Économie Bleue",
    titulaire: "Maurice NTOUTOUME NGUEMA",
    rang: "ministre",
    secteurs: ["eaux", "forêts", "mer", "économie_bleue"],
    attributions: [
      "Gestion des ressources en eau",
      "Exploitation forestière durable",
      "Pêche maritime",
      "Économie bleue",
      "Aires marines protégées"
    ],
    directions_generales: [
      "Direction Générale des Eaux",
      "Direction Générale des Forêts",
      "Direction Générale des Pêches et de l'Aquaculture",
      "Direction Générale de l'Économie Bleue"
    ],
    ville: "Libreville"
  },
  {
    id: "MIN_ENER_HYD",
    code: "MEH",
    titre: "Ministère de l'Énergie et des Ressources Hydrauliques",
    titulaire: "Jeannot KALIMA",
    rang: "ministre",
    secteurs: ["énergie", "hydraulique"],
    attributions: [
      "Politique énergétique",
      "Production et distribution d'électricité",
      "Énergies renouvelables",
      "Barrages hydroélectriques",
      "Électrification rurale"
    ],
    directions_generales: [
      "Direction Générale de l'Énergie",
      "Direction Générale de l'Hydraulique"
    ],
    ville: "Libreville"
  },
  {
    id: "MIN_HAB_URB",
    code: "MHUAT",
    titre: "Ministère de l'Habitat, de l'Urbanisme et de l'Aménagement du Territoire",
    titulaire: "Olivier NANG EKOMIE",
    rang: "ministre",
    secteurs: ["habitat", "urbanisme", "aménagement_territoire"],
    attributions: [
      "Politique du logement",
      "Urbanisme et planification",
      "Aménagement du territoire",
      "Cadastre et domaines",
      "Logement social"
    ],
    directions_generales: [
      "Direction Générale de l'Habitat",
      "Direction Générale de l'Urbanisme",
      "Direction Générale de l'Aménagement du Territoire"
    ],
    ville: "Libreville"
  },
  // MINISTÈRES RESTANTS (11)
  {
    id: "MIN_DEF_NAT",
    code: "MDN",
    titre: "Ministère de la Défense Nationale",
    titulaire: "Général Brigitte ONKANOWA",
    rang: "ministre",
    secteurs: ["défense", "forces_armées", "sécurité_nationale"],
    attributions: [
      "Politique de défense nationale",
      "Forces armées gabonaises",
      "Sécurité nationale",
      "Coopération militaire",
      "Industries de défense",
      "Service national"
    ],
    directions_generales: [
      "État-Major Général des Forces Armées",
      "Direction Générale de la Gendarmerie Nationale",
      "Direction Générale du Service de Santé Militaire",
      "Direction Générale du Matériel"
    ],
    email_contact: "contact@defense.gouv.ga",
    telephone: "+241 01 76 64 00",
    adresse: "Camp de Gaulle, Libreville",
    ville: "Libreville"
  },
  {
    id: "MIN_REL_PARL",
    code: "MRPCI",
    titre: "Ministère des Relations avec le Parlement et les Collectivités Locales, chargé des Droits de l'Homme",
    titulaire: "Erlyne Antonella NDEMBET DAMAS",
    rang: "ministre",
    secteurs: ["parlement", "collectivités", "droits_humains"],
    attributions: [
      "Relations avec le Parlement",
      "Suivi de l'activité parlementaire",
      "Relations avec les collectivités locales",
      "Promotion des droits de l'homme",
      "Coordination interministérielle"
    ],
    directions_principales: [
      "Direction des Relations Parlementaires",
      "Direction des Collectivités Locales",
      "Direction des Droits de l'Homme"
    ],
    ville: "Libreville"
  },
  {
    id: "MIN_RECH_SCIEN",
    code: "MRSTIE",
    titre: "Ministère de la Recherche Scientifique, de la Technologie, de l'Innovation et de l'Économie de la Connaissance",
    titulaire: "Dr Madeleine BERRE",
    rang: "ministre",
    secteurs: ["recherche", "technologie", "innovation", "économie_connaissance"],
    attributions: [
      "Politique de recherche scientifique",
      "Développement technologique",
      "Innovation et transfert de technologie",
      "Économie de la connaissance",
      "Coopération scientifique internationale"
    ],
    directions_generales: [
      "Direction Générale de la Recherche Scientifique",
      "Direction Générale de la Technologie et de l'Innovation",
      "Direction Générale de l'Économie de la Connaissance"
    ],
    ville: "Libreville"
  },
  {
    id: "MIN_PLAN",
    code: "MPDER",
    titre: "Ministère de la Planification et du Développement Économique Régional",
    titulaire: "Hermann IMMONGAULT",
    rang: "ministre",
    secteurs: ["planification", "développement", "économie_régionale"],
    attributions: [
      "Planification nationale",
      "Développement économique régional",
      "Coordination des politiques publiques",
      "Suivi et évaluation des projets",
      "Coopération au développement"
    ],
    directions_generales: [
      "Direction Générale de la Planification",
      "Direction Générale du Développement Régional",
      "Direction Générale du Suivi-Évaluation"
    ],
    ville: "Libreville"
  },
  {
    id: "MIN_ECO_RURAL",
    code: "MERH",
    titre: "Ministère de l'Économie Rurale et du Développement Durable",
    titulaire: "Raymond NDONG SIMA",
    rang: "ministre",
    secteurs: ["économie_rurale", "développement_durable", "coopératives"],
    attributions: [
      "Développement de l'économie rurale",
      "Promotion des coopératives",
      "Développement durable rural",
      "Microfinance rurale",
      "Artisanat rural"
    ],
    directions_generales: [
      "Direction Générale de l'Économie Rurale",
      "Direction Générale des Coopératives",
      "Direction Générale du Développement Durable"
    ],
    ville: "Libreville"
  },
  {
    id: "MIN_SPORTS_JEU",
    code: "MSJVA",
    titre: "Ministère des Sports et de la Jeunesse, chargé de la Vie Associative",
    titulaire: "Franck NGUEMA",
    rang: "ministre",
    secteurs: ["sports", "jeunesse", "vie_associative"],
    attributions: [
      "Développement du sport de haut niveau",
      "Sport pour tous et sport scolaire",
      "Politique de la jeunesse",
      "Promotion de la vie associative",
      "Infrastructures sportives"
    ],
    directions_generales: [
      "Direction Générale des Sports",
      "Direction Générale de la Jeunesse",
      "Direction Générale de la Vie Associative"
    ],
    ville: "Libreville"
  },
  {
    id: "MIN_CULT_ART",
    code: "MCA",
    titre: "Ministère de la Culture et des Arts",
    titulaire: "Dr Hermann MBADINGA",
    rang: "ministre",
    secteurs: ["culture", "arts", "patrimoine", "industries_créatives"],
    attributions: [
      "Promotion de la culture gabonaise",
      "Développement des arts",
      "Protection du patrimoine",
      "Industries créatives et culturelles",
      "Coopération culturelle internationale"
    ],
    directions_generales: [
      "Direction Générale de la Culture",
      "Direction Générale des Arts",
      "Direction Générale du Patrimoine"
    ],
    ville: "Libreville"
  },
  {
    id: "MIN_RELIG",
    code: "MCRA",
    titre: "Ministère des Cultes et des Relations avec les Associations",
    titulaire: "Père Ludovic NGUEMA",
    rang: "ministre",
    secteurs: ["cultes", "relations_associations", "dialogue_interreligieux"],
    attributions: [
      "Relations avec les confessions religieuses",
      "Dialogue interreligieux",
      "Relations avec les associations",
      "Promotion de la tolérance religieuse",
      "Médiation sociale"
    ],
    directions_principales: [
      "Direction des Cultes",
      "Direction des Relations avec les Associations",
      "Direction du Dialogue Interreligieux"
    ],
    ville: "Libreville"
  },
  {
    id: "MIN_DECEN",
    code: "MDL",
    titre: "Ministère de la Décentralisation et des Libertés Locales",
    titulaire: "Mathias OTOUNGA OSSIBADJOUO",
    rang: "ministre",
    secteurs: ["décentralisation", "libertés_locales", "autonomie_locale"],
    attributions: [
      "Politique de décentralisation",
      "Autonomie des collectivités locales",
      "Transfert des compétences",
      "Libertés locales",
      "Développement participatif"
    ],
    directions_generales: [
      "Direction Générale de la Décentralisation",
      "Direction Générale des Libertés Locales",
      "Direction Générale du Développement Participatif"
    ],
    ville: "Libreville"
  },
  {
    id: "MIN_SOCIAL",
    code: "MPASS",
    titre: "Ministère de la Protection Sociale et de l'Action Sociale",
    titulaire: "Nadine NZAMBA",
    rang: "ministre",
    secteurs: ["protection_sociale", "action_sociale", "solidarité"],
    attributions: [
      "Protection sociale des populations",
      "Action sociale",
      "Solidarité nationale",
      "Inclusion sociale",
      "Lutte contre la pauvreté"
    ],
    directions_generales: [
      "Direction Générale de la Protection Sociale",
      "Direction Générale de l'Action Sociale",
      "Direction Générale de la Solidarité"
    ],
    ville: "Libreville"
  },
  {
    id: "MIN_COORD",
    code: "MCGAP",
    titre: "Ministère de la Coordination Gouvernementale et de l'Administration du Personnel",
    titulaire: "Brigitte ONKANOWA",
    rang: "ministre",
    secteurs: ["coordination", "administration_personnel", "réforme_administrative"],
    attributions: [
      "Coordination de l'action gouvernementale",
      "Administration du personnel",
      "Réforme administrative",
      "Modernisation des services publics",
      "Efficacité administrative"
    ],
    directions_generales: [
      "Direction Générale de la Coordination",
      "Direction Générale de l'Administration du Personnel",
      "Direction Générale de la Réforme Administrative"
    ],
    ville: "Libreville"
  }
];

// Fusion de toutes les listes
export const TOUS_MINISTERES = [
  ...MINISTERES_ETAT,
  ...MINISTERES_PARTIE_1,
  ...MINISTERES_PARTIE_2
];

// Générer la structure complète d'un ministère avec ses postes
export function genererStructureMinistere(ministere: MinistereStructure) {
  const structure = {
    organisation: {
      id: ministere.id,
      code: ministere.code,
      name: ministere.titre,
      type: ministere.rang === 'ministre_etat' ? 'MINISTERE_ETAT' : 'MINISTERE',
      description: `${ministere.attributions.slice(0, 3).join(', ')}...`,
      email: ministere.email_contact || genererEmailGouvernemental('contact', 'ministere', ministere.code),
      phone: ministere.telephone,
      address: ministere.adresse,
      city: ministere.ville,
      isActive: true
    },
    postes_cles: [
      {
        titre: ministere.rang === 'ministre_etat' ? 'Ministre d\'État' : 'Ministre',
        titulaire: ministere.titulaire,
        type_poste: ministere.rang === 'ministre_etat' ? 'MINISTRE_ETAT' : 'MINISTRE',
        email: genererEmailGouvernemental(
          ministere.titulaire.split(' ')[0],
          ministere.titulaire.split(' ').slice(1).join('-'),
          ministere.code
        )
      }
    ],
    directions_generales: ministere.directions_generales || [],
    directions_principales: ministere.directions_principales || [],
    services_transversaux: [
      'Service du Personnel et des Archives',
      'Service du Budget et des Finances',
      'Service de la Communication',
      'Service Juridique',
      'Service Informatique'
    ]
  };

  return structure;
}

// Obtenir un ministère par son code
export function getMinistereByCode(code: string): MinistereStructure | undefined {
  return TOUS_MINISTERES.find(m => m.code === code);
}

// Obtenir les ministères par secteur
export function getMinisteresBySecteur(secteur: string): MinistereStructure[] {
  return TOUS_MINISTERES.filter(m => m.secteurs.includes(secteur));
}
