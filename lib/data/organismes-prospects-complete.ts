/**
 * ORGANISMES PROSPECTS COMPLETS
 * Tous les organismes gabonais en statut PROSPECT selon la classification officielle
 */

import { OrganismeGabonais } from './gabon-organismes-160';

// GROUPE B - MINISTÈRES SECTORIELS (30) - COMPLETS
export const MINISTERES_PROSPECTS: OrganismeGabonais[] = [

  // 🛡️ BLOC RÉGALIEN (4 ministères)
  {
    id: 'ORG_MIN_INTERIEUR',
    code: 'MIN_INTERIEUR',
    name: 'Ministère de l\'Intérieur',
    type: 'MINISTERE',
    groupe: 'B',
    description: 'Sécurité intérieure et administration territoriale',
    city: 'Libreville',
    address: 'Boulevard Triomphal Omar Bongo',
    phone: '+241 01 72 10 30',
    email: 'contact@interieur.gov.ga',
    niveau_hierarchique: 2,
    est_organisme_principal: true
  },
  {
    id: 'ORG_MIN_JUSTICE',
    code: 'MIN_JUSTICE',
    name: 'Ministère de la Justice',
    type: 'MINISTERE',
    groupe: 'B',
    description: 'Justice et affaires judiciaires',
    city: 'Libreville',
    address: 'Boulevard de l\'Indépendance',
    phone: '+241 01 72 11 30',
    email: 'contact@justice.gov.ga',
    niveau_hierarchique: 2,
    est_organisme_principal: true
  },
  {
    id: 'ORG_MIN_AFF_ETR',
    code: 'MIN_AFF_ETR',
    name: 'Ministère des Affaires Étrangères',
    type: 'MINISTERE',
    groupe: 'B',
    description: 'Relations diplomatiques et coopération internationale',
    city: 'Libreville',
    address: 'Boulevard de la République',
    phone: '+241 01 72 12 30',
    email: 'contact@affaires-etrangeres.gov.ga',
    niveau_hierarchique: 2,
    est_organisme_principal: true
  },
  {
    id: 'ORG_MIN_DEF_NAT',
    code: 'MIN_DEF_NAT',
    name: 'Ministère de la Défense Nationale',
    type: 'MINISTERE',
    groupe: 'B',
    description: 'Défense nationale et forces armées',
    city: 'Libreville',
    address: 'Camp de Gaulle',
    phone: '+241 01 72 13 30',
    email: 'contact@defense.gov.ga',
    niveau_hierarchique: 2,
    est_organisme_principal: true
  },

  // 💰 BLOC ÉCONOMIQUE ET FINANCIER (8 ministères)
  {
    id: 'ORG_MIN_ECO_FIN',
    code: 'MIN_ECO_FIN',
    name: 'Ministère de l\'Économie et des Finances',
    type: 'MINISTERE',
    groupe: 'B',
    description: 'Politique économique et gestion financière',
    city: 'Libreville',
    address: 'Immeuble des Finances',
    phone: '+241 01 72 14 30',
    email: 'contact@finances.gov.ga',
    niveau_hierarchique: 2,
    est_organisme_principal: true
  },
  {
    id: 'ORG_MIN_COMPTES_PUB',
    code: 'MIN_COMPTES_PUB',
    name: 'Ministère des Comptes Publics',
    type: 'MINISTERE',
    groupe: 'B',
    description: 'Contrôle et gestion des comptes publics',
    city: 'Libreville',
    phone: '+241 01 72 15 30',
    email: 'contact@comptes-publics.gov.ga',
    niveau_hierarchique: 2,
    est_organisme_principal: true
  },
  {
    id: 'ORG_MIN_BUDGET',
    code: 'MIN_BUDGET',
    name: 'Ministère du Budget',
    type: 'MINISTERE',
    groupe: 'B',
    description: 'Préparation et exécution du budget national',
    city: 'Libreville',
    phone: '+241 01 72 16 30',
    email: 'contact@budget.gov.ga',
    niveau_hierarchique: 2,
    est_organisme_principal: true
  },
  {
    id: 'ORG_MIN_COMMERCE',
    code: 'MIN_COMMERCE',
    name: 'Ministère du Commerce',
    type: 'MINISTERE',
    groupe: 'B',
    description: 'Développement commercial et régulation des marchés',
    city: 'Libreville',
    phone: '+241 01 72 17 30',
    email: 'contact@commerce.gov.ga',
    niveau_hierarchique: 2,
    est_organisme_principal: true
  },
  {
    id: 'ORG_MIN_INDUSTRIE',
    code: 'MIN_INDUSTRIE',
    name: 'Ministère de l\'Industrie',
    type: 'MINISTERE',
    groupe: 'B',
    description: 'Développement industriel et transformation',
    city: 'Libreville',
    phone: '+241 01 72 18 30',
    email: 'contact@industrie.gov.ga',
    niveau_hierarchique: 2,
    est_organisme_principal: true
  },
  {
    id: 'ORG_MIN_PETROLE',
    code: 'MIN_PETROLE',
    name: 'Ministère du Pétrole',
    type: 'MINISTERE',
    groupe: 'B',
    description: 'Secteur pétrolier et hydrocarbures',
    city: 'Libreville',
    phone: '+241 01 72 19 30',
    email: 'contact@petrole.gov.ga',
    niveau_hierarchique: 2,
    est_organisme_principal: true
  },
  {
    id: 'ORG_MIN_MINES',
    code: 'MIN_MINES',
    name: 'Ministère des Mines',
    type: 'MINISTERE',
    groupe: 'B',
    description: 'Exploitation minière et ressources du sous-sol',
    city: 'Libreville',
    phone: '+241 01 72 20 30',
    email: 'contact@mines.gov.ga',
    niveau_hierarchique: 2,
    est_organisme_principal: true
  },
  {
    id: 'ORG_MIN_ENERGIE',
    code: 'MIN_ENERGIE',
    name: 'Ministère de l\'Énergie',
    type: 'MINISTERE',
    groupe: 'B',
    description: 'Politique énergétique et électrification',
    city: 'Libreville',
    phone: '+241 01 72 21 30',
    email: 'contact@energie.gov.ga',
    niveau_hierarchique: 2,
    est_organisme_principal: true
  },

  // 👥 BLOC SOCIAL ET DÉVELOPPEMENT HUMAIN (8 ministères)
  {
    id: 'ORG_MIN_SANTE',
    code: 'MIN_SANTE',
    name: 'Ministère de la Santé Publique',
    type: 'MINISTERE',
    groupe: 'B',
    description: 'Santé publique et politique sanitaire',
    city: 'Libreville',
    phone: '+241 01 72 22 30',
    email: 'contact@sante.gov.ga',
    niveau_hierarchique: 2,
    est_organisme_principal: true
  },
  {
    id: 'ORG_MIN_EDUC_NAT',
    code: 'MIN_EDUC_NAT',
    name: 'Ministère de l\'Éducation Nationale',
    type: 'MINISTERE',
    groupe: 'B',
    description: 'Enseignement primaire et secondaire',
    city: 'Libreville',
    phone: '+241 01 72 23 30',
    email: 'contact@education.gov.ga',
    niveau_hierarchique: 2,
    est_organisme_principal: true
  },
  {
    id: 'ORG_MIN_ENS_SUP',
    code: 'MIN_ENS_SUP',
    name: 'Ministère de l\'Enseignement Supérieur',
    type: 'MINISTERE',
    groupe: 'B',
    description: 'Universités et enseignement supérieur',
    city: 'Libreville',
    phone: '+241 01 72 24 30',
    email: 'contact@enseignement-superieur.gov.ga',
    niveau_hierarchique: 2,
    est_organisme_principal: true
  },
  {
    id: 'ORG_MIN_TRAVAIL',
    code: 'MIN_TRAVAIL',
    name: 'Ministère du Travail',
    type: 'MINISTERE',
    groupe: 'B',
    description: 'Emploi et relations de travail',
    city: 'Libreville',
    phone: '+241 01 72 25 30',
    email: 'contact@travail.gov.ga',
    niveau_hierarchique: 2,
    est_organisme_principal: true
  },
  {
    id: 'ORG_MIN_FONCTION_PUB',
    code: 'MIN_FONCTION_PUB',
    name: 'Ministère de la Fonction Publique',
    type: 'MINISTERE',
    groupe: 'B',
    description: 'Gestion des fonctionnaires et administration publique',
    city: 'Libreville',
    phone: '+241 01 72 26 30',
    email: 'contact@fonction-publique.gov.ga',
    niveau_hierarchique: 2,
    est_organisme_principal: true
  },
  {
    id: 'ORG_MIN_PROMO_FEMME',
    code: 'MIN_PROMO_FEMME',
    name: 'Ministère de la Promotion de la Femme',
    type: 'MINISTERE',
    groupe: 'B',
    description: 'Égalité des genres et promotion de la femme',
    city: 'Libreville',
    phone: '+241 01 72 27 30',
    email: 'contact@promotion-femme.gov.ga',
    niveau_hierarchique: 2,
    est_organisme_principal: true
  },
  {
    id: 'ORG_MIN_CULTURE',
    code: 'MIN_CULTURE',
    name: 'Ministère de la Culture',
    type: 'MINISTERE',
    groupe: 'B',
    description: 'Patrimoine culturel et arts',
    city: 'Libreville',
    phone: '+241 01 72 28 30',
    email: 'contact@culture.gov.ga',
    niveau_hierarchique: 2,
    est_organisme_principal: true
  },
  {
    id: 'ORG_MIN_AFF_SOC',
    code: 'MIN_AFF_SOC',
    name: 'Ministère des Affaires Sociales',
    type: 'MINISTERE',
    groupe: 'B',
    description: 'Protection sociale et solidarité',
    city: 'Libreville',
    phone: '+241 01 72 29 30',
    email: 'contact@affaires-sociales.gov.ga',
    niveau_hierarchique: 2,
    est_organisme_principal: true
  },

  // 🏗️ BLOC INFRASTRUCTURE ET DÉVELOPPEMENT (6 ministères)
  {
    id: 'ORG_MIN_TRAV_PUB',
    code: 'MIN_TRAV_PUB',
    name: 'Ministère des Travaux Publics',
    type: 'MINISTERE',
    groupe: 'B',
    description: 'Infrastructures et travaux publics',
    city: 'Libreville',
    phone: '+241 01 72 30 30',
    email: 'contact@travaux-publics.gov.ga',
    niveau_hierarchique: 2,
    est_organisme_principal: true
  },
  {
    id: 'ORG_MIN_HABITAT',
    code: 'MIN_HABITAT',
    name: 'Ministère de l\'Habitat',
    type: 'MINISTERE',
    groupe: 'B',
    description: 'Logement et urbanisme',
    city: 'Libreville',
    phone: '+241 01 72 31 30',
    email: 'contact@habitat.gov.ga',
    niveau_hierarchique: 2,
    est_organisme_principal: true
  },
  {
    id: 'ORG_MIN_TRANSPORTS',
    code: 'MIN_TRANSPORTS',
    name: 'Ministère des Transports',
    type: 'MINISTERE',
    groupe: 'B',
    description: 'Transport et mobilité',
    city: 'Libreville',
    phone: '+241 01 72 32 30',
    email: 'contact@transports.gov.ga',
    niveau_hierarchique: 2,
    est_organisme_principal: true
  },
  {
    id: 'ORG_MIN_AGRICULTURE',
    code: 'MIN_AGRICULTURE',
    name: 'Ministère de l\'Agriculture',
    type: 'MINISTERE',
    groupe: 'B',
    description: 'Agriculture et développement rural',
    city: 'Libreville',
    phone: '+241 01 72 33 30',
    email: 'contact@agriculture.gov.ga',
    niveau_hierarchique: 2,
    est_organisme_principal: true
  },
  {
    id: 'ORG_MIN_EAUX_FOR',
    code: 'MIN_EAUX_FOR',
    name: 'Ministère des Eaux et Forêts',
    type: 'MINISTERE',
    groupe: 'B',
    description: 'Ressources forestières et gestion de l\'eau',
    city: 'Libreville',
    phone: '+241 01 72 34 30',
    email: 'contact@eaux-forets.gov.ga',
    niveau_hierarchique: 2,
    est_organisme_principal: true
  },
  {
    id: 'ORG_MIN_ENVIRONNEMENT',
    code: 'MIN_ENVIRONNEMENT',
    name: 'Ministère de l\'Environnement',
    type: 'MINISTERE',
    groupe: 'B',
    description: 'Protection de l\'environnement et climat',
    city: 'Libreville',
    phone: '+241 01 72 35 30',
    email: 'contact@environnement.gov.ga',
    niveau_hierarchique: 2,
    est_organisme_principal: true
  },

  // 🚀 BLOC INNOVATION ET MODERNISATION (4 ministères)
  {
    id: 'ORG_MIN_NUMERIQUE',
    code: 'MIN_NUMERIQUE',
    name: 'Ministère du Numérique',
    type: 'MINISTERE',
    groupe: 'B',
    description: 'Transformation numérique et technologies',
    city: 'Libreville',
    phone: '+241 01 72 36 30',
    email: 'contact@numerique.gov.ga',
    niveau_hierarchique: 2,
    est_organisme_principal: true
  },
  {
    id: 'ORG_MIN_COMMUNICATION',
    code: 'MIN_COMMUNICATION',
    name: 'Ministère de la Communication',
    type: 'MINISTERE',
    groupe: 'B',
    description: 'Communication et médias',
    city: 'Libreville',
    phone: '+241 01 72 37 30',
    email: 'contact@communication.gov.ga',
    niveau_hierarchique: 2,
    est_organisme_principal: true
  },
  {
    id: 'ORG_MIN_TOURISME',
    code: 'MIN_TOURISME',
    name: 'Ministère du Tourisme',
    type: 'MINISTERE',
    groupe: 'B',
    description: 'Développement touristique et artisanat',
    city: 'Libreville',
    phone: '+241 01 72 38 30',
    email: 'contact@tourisme.gov.ga',
    niveau_hierarchique: 2,
    est_organisme_principal: true
  },
  {
    id: 'ORG_MIN_MODERNISATION',
    code: 'MIN_MODERNISATION',
    name: 'Ministère de la Modernisation',
    type: 'MINISTERE',
    groupe: 'B',
    description: 'Modernisation de l\'administration',
    city: 'Libreville',
    phone: '+241 01 72 39 30',
    email: 'contact@modernisation.gov.ga',
    niveau_hierarchique: 2,
    est_organisme_principal: true
  }
];

// DIRECTIONS GÉNÉRALES MANQUANTES (20)
export const DIRECTIONS_GENERALES_MANQUANTES: OrganismeGabonais[] = [
  {
    id: 'ORG_DGE',
    code: 'DGE',
    name: 'Direction Générale de l\'Énergie',
    type: 'DIRECTION_GENERALE',
    groupe: 'C',
    description: 'Gestion et régulation du secteur énergétique',
    city: 'Libreville',
    phone: '+241 01 73 01 00',
    email: 'contact@dge.ga',
    niveau_hierarchique: 3,
    est_organisme_principal: true
  },
  {
    id: 'ORG_DGA',
    code: 'DGA',
    name: 'Direction Générale de l\'Agriculture',
    type: 'DIRECTION_GENERALE',
    groupe: 'C',
    description: 'Développement agricole et sécurité alimentaire',
    city: 'Libreville',
    phone: '+241 01 73 02 00',
    email: 'contact@dga.ga',
    niveau_hierarchique: 3,
    est_organisme_principal: true
  },
  {
    id: 'ORG_DGE_AGRI',
    code: 'DGE_AGRI',
    name: 'Direction Générale de l\'Élevage',
    type: 'DIRECTION_GENERALE',
    groupe: 'C',
    description: 'Élevage et productions animales',
    city: 'Libreville',
    phone: '+241 01 73 03 00',
    email: 'contact@dge-agri.ga',
    niveau_hierarchique: 3,
    est_organisme_principal: true
  },
  {
    id: 'ORG_DGH',
    code: 'DGH',
    name: 'Direction Générale de l\'Hydraulique',
    type: 'DIRECTION_GENERALE',
    groupe: 'C',
    description: 'Ressources hydrauliques et adduction d\'eau',
    city: 'Libreville',
    phone: '+241 01 73 04 00',
    email: 'contact@dgh.ga',
    niveau_hierarchique: 3,
    est_organisme_principal: true
  },
  {
    id: 'ORG_DGSP',
    code: 'DGSP',
    name: 'Direction Générale de la Santé Publique',
    type: 'DIRECTION_GENERALE',
    groupe: 'C',
    description: 'Coordination de la politique sanitaire',
    city: 'Libreville',
    phone: '+241 01 73 05 00',
    email: 'contact@dgsp.ga',
    niveau_hierarchique: 3,
    est_organisme_principal: true
  },
  {
    id: 'ORG_DGEN',
    code: 'DGEN',
    name: 'Direction Générale de l\'Éducation Nationale',
    type: 'DIRECTION_GENERALE',
    groupe: 'C',
    description: 'Coordination de l\'enseignement national',
    city: 'Libreville',
    phone: '+241 01 73 06 00',
    email: 'contact@dgen.ga',
    niveau_hierarchique: 3,
    est_organisme_principal: true
  },
  {
    id: 'ORG_DGES',
    code: 'DGES',
    name: 'Direction Générale de l\'Enseignement Supérieur',
    type: 'DIRECTION_GENERALE',
    groupe: 'C',
    description: 'Coordination de l\'enseignement supérieur',
    city: 'Libreville',
    phone: '+241 01 73 07 00',
    email: 'contact@dges.ga',
    niveau_hierarchique: 3,
    est_organisme_principal: true
  },
  {
    id: 'ORG_DGTP',
    code: 'DGTP',
    name: 'Direction Générale des Travaux Publics',
    type: 'DIRECTION_GENERALE',
    groupe: 'C',
    description: 'Coordination des grands travaux',
    city: 'Libreville',
    phone: '+241 01 73 08 00',
    email: 'contact@dgtp.ga',
    niveau_hierarchique: 3,
    est_organisme_principal: true
  },
  {
    id: 'ORG_DGTC',
    code: 'DGTC',
    name: 'Direction Générale des Transports et Communications',
    type: 'DIRECTION_GENERALE',
    groupe: 'C',
    description: 'Régulation des transports et télécommunications',
    city: 'Libreville',
    phone: '+241 01 73 09 00',
    email: 'contact@dgtc.ga',
    niveau_hierarchique: 3,
    est_organisme_principal: true
  },
  {
    id: 'ORG_DGIND',
    code: 'DGIND',
    name: 'Direction Générale de l\'Industrie',
    type: 'DIRECTION_GENERALE',
    groupe: 'C',
    description: 'Développement et régulation industrielle',
    city: 'Libreville',
    phone: '+241 01 73 10 00',
    email: 'contact@dgind.ga',
    niveau_hierarchique: 3,
    est_organisme_principal: true
  },
  {
    id: 'ORG_DGCOM',
    code: 'DGCOM',
    name: 'Direction Générale du Commerce',
    type: 'DIRECTION_GENERALE',
    groupe: 'C',
    description: 'Régulation du commerce et des marchés',
    city: 'Libreville',
    phone: '+241 01 73 11 00',
    email: 'contact@dgcom.ga',
    niveau_hierarchique: 3,
    est_organisme_principal: true
  },
  {
    id: 'ORG_DGFP',
    code: 'DGFP',
    name: 'Direction Générale de la Fonction Publique',
    type: 'DIRECTION_GENERALE',
    groupe: 'C',
    description: 'Gestion de la fonction publique',
    city: 'Libreville',
    phone: '+241 01 73 12 00',
    email: 'contact@dgfp.ga',
    niveau_hierarchique: 3,
    est_organisme_principal: true
  },
  {
    id: 'ORG_DGAFF',
    code: 'DGAFF',
    name: 'Direction Générale des Affaires Étrangères',
    type: 'DIRECTION_GENERALE',
    groupe: 'C',
    description: 'Coordination diplomatique',
    city: 'Libreville',
    phone: '+241 01 73 13 00',
    email: 'contact@dgaff.ga',
    niveau_hierarchique: 3,
    est_organisme_principal: true
  },
  {
    id: 'ORG_DGDEF',
    code: 'DGDEF',
    name: 'Direction Générale de la Défense',
    type: 'DIRECTION_GENERALE',
    groupe: 'C',
    description: 'Coordination de la défense nationale',
    city: 'Libreville',
    phone: '+241 01 73 14 00',
    email: 'contact@dgdef.ga',
    niveau_hierarchique: 3,
    est_organisme_principal: true
  },
  {
    id: 'ORG_DGJUST',
    code: 'DGJUST',
    name: 'Direction Générale de la Justice',
    type: 'DIRECTION_GENERALE',
    groupe: 'C',
    description: 'Administration judiciaire',
    city: 'Libreville',
    phone: '+241 01 73 15 00',
    email: 'contact@dgjust.ga',
    niveau_hierarchique: 3,
    est_organisme_principal: true
  },
  {
    id: 'ORG_DGCULT',
    code: 'DGCULT',
    name: 'Direction Générale de la Culture',
    type: 'DIRECTION_GENERALE',
    groupe: 'C',
    description: 'Promotion du patrimoine culturel',
    city: 'Libreville',
    phone: '+241 01 73 16 00',
    email: 'contact@dgcult.ga',
    niveau_hierarchique: 3,
    est_organisme_principal: true
  },
  {
    id: 'ORG_DGJEUN',
    code: 'DGJEUN',
    name: 'Direction Générale de la Jeunesse',
    type: 'DIRECTION_GENERALE',
    groupe: 'C',
    description: 'Politiques de la jeunesse et sports',
    city: 'Libreville',
    phone: '+241 01 73 17 00',
    email: 'contact@dgjeun.ga',
    niveau_hierarchique: 3,
    est_organisme_principal: true
  },
  {
    id: 'ORG_DGTOUR',
    code: 'DGTOUR',
    name: 'Direction Générale du Tourisme',
    type: 'DIRECTION_GENERALE',
    groupe: 'C',
    description: 'Développement touristique',
    city: 'Libreville',
    phone: '+241 01 73 18 00',
    email: 'contact@dgtour.ga',
    niveau_hierarchique: 3,
    est_organisme_principal: true
  },
  {
    id: 'ORG_DGENV',
    code: 'DGENV',
    name: 'Direction Générale de l\'Environnement',
    type: 'DIRECTION_GENERALE',
    groupe: 'C',
    description: 'Protection environnementale',
    city: 'Libreville',
    phone: '+241 01 73 19 00',
    email: 'contact@dgenv.ga',
    niveau_hierarchique: 3,
    est_organisme_principal: true
  },
  {
    id: 'ORG_DGNUM',
    code: 'DGNUM',
    name: 'Direction Générale du Numérique',
    type: 'DIRECTION_GENERALE',
    groupe: 'C',
    description: 'Transformation numérique nationale',
    city: 'Libreville',
    phone: '+241 01 73 20 00',
    email: 'contact@dgnum.ga',
    niveau_hierarchique: 3,
    est_organisme_principal: true
  }
];

// AGENCES SPÉCIALISÉES MANQUANTES (8)
export const AGENCES_SPECIALISEES_MANQUANTES: OrganismeGabonais[] = [
  {
    id: 'ORG_FER',
    code: 'FER',
    name: 'Fonds d\'Entreposage et de Répartition',
    type: 'AGENCE_NATIONALE',
    groupe: 'E',
    description: 'Gestion des stocks alimentaires stratégiques',
    city: 'Libreville',
    phone: '+241 01 74 01 00',
    email: 'contact@fer.ga',
    niveau_hierarchique: 3,
    est_organisme_principal: false
  },
  {
    id: 'ORG_ANUTTC',
    code: 'ANUTTC',
    name: 'Agence Nationale des Transports',
    type: 'AGENCE_NATIONALE',
    groupe: 'E',
    description: 'Régulation et contrôle des transports',
    city: 'Libreville',
    phone: '+241 01 74 02 00',
    email: 'contact@anuttc.ga',
    niveau_hierarchique: 3,
    est_organisme_principal: false
  },
  {
    id: 'ORG_ARSEE',
    code: 'ARSEE',
    name: 'Agence de Régulation du Secteur de l\'Eau et de l\'Énergie',
    type: 'AGENCE_NATIONALE',
    groupe: 'E',
    description: 'Régulation des services publics d\'eau et d\'énergie',
    city: 'Libreville',
    phone: '+241 01 74 03 00',
    email: 'contact@arsee.ga',
    niveau_hierarchique: 3,
    est_organisme_principal: false
  },
  {
    id: 'ORG_GOC',
    code: 'GOC',
    name: 'Gabon Oil Company',
    type: 'AGENCE_NATIONALE',
    groupe: 'E',
    description: 'Société nationale des hydrocarbures',
    city: 'Libreville',
    phone: '+241 01 74 04 00',
    email: 'contact@goc.ga',
    niveau_hierarchique: 3,
    est_organisme_principal: false
  },
  {
    id: 'ORG_ANPN',
    code: 'ANPN',
    name: 'Agence Nationale des Parcs Nationaux',
    type: 'AGENCE_NATIONALE',
    groupe: 'E',
    description: 'Conservation et gestion des parcs nationaux',
    city: 'Libreville',
    phone: '+241 01 74 05 00',
    email: 'contact@anpn.ga',
    niveau_hierarchique: 3,
    est_organisme_principal: false
  },
  {
    id: 'ORG_ARCEP',
    code: 'ARCEP',
    name: 'Autorité de Régulation des Communications Électroniques',
    type: 'AGENCE_NATIONALE',
    groupe: 'E',
    description: 'Régulation des télécommunications',
    city: 'Libreville',
    phone: '+241 01 74 06 00',
    email: 'contact@arcep.ga',
    niveau_hierarchique: 3,
    est_organisme_principal: false
  },
  {
    id: 'ORG_CIRMF',
    code: 'CIRMF',
    name: 'Centre International de Recherches Médicales',
    type: 'AGENCE_NATIONALE',
    groupe: 'E',
    description: 'Recherche médicale et épidémiologique',
    city: 'Franceville',
    phone: '+241 01 74 07 00',
    email: 'contact@cirmf.ga',
    niveau_hierarchique: 3,
    est_organisme_principal: false
  },
  {
    id: 'ORG_CENAREST',
    code: 'CENAREST',
    name: 'Centre National de la Recherche Scientifique',
    type: 'AGENCE_NATIONALE',
    groupe: 'E',
    description: 'Coordination de la recherche scientifique nationale',
    city: 'Libreville',
    phone: '+241 01 74 08 00',
    email: 'contact@cenarest.ga',
    niveau_hierarchique: 3,
    est_organisme_principal: false
  },
  {
    id: 'ORG_BEAC',
    code: 'BEAC',
    name: 'Banque des États de l\'Afrique Centrale',
    type: 'AGENCE_NATIONALE',
    groupe: 'E',
    description: 'Banque centrale de la zone CEMAC',
    city: 'Libreville',
    address: 'Avenue du Colonel Parant',
    phone: '+241 01 76 24 00',
    email: 'contact@beac.int',
    website: 'https://www.beac.int',
    niveau_hierarchique: 3,
    est_organisme_principal: true
  },
  {
    id: 'ORG_BGD',
    code: 'BGD',
    name: 'Banque Gabonaise de Développement',
    type: 'AGENCE_NATIONALE',
    groupe: 'E',
    description: 'Banque de développement du Gabon',
    city: 'Libreville',
    address: 'Immeuble BGD, Boulevard Triomphal',
    phone: '+241 01 77 20 00',
    email: 'contact@bgd.ga',
    website: 'https://bgd.ga',
    niveau_hierarchique: 3,
    est_organisme_principal: true
  }
];

// COURS D'APPEL MANQUANTES (3)
export const COURS_APPEL_MANQUANTES: OrganismeGabonais[] = [
  {
    id: 'ORG_CA_LIBREVILLE',
    code: 'CA_LIBREVILLE',
    name: 'Cour d\'Appel de Libreville',
    type: 'INSTITUTION_JUDICIAIRE',
    groupe: 'F',
    description: 'Juridiction d\'appel de la région de Libreville',
    city: 'Libreville',
    phone: '+241 01 75 01 00',
    email: 'contact@ca-libreville.ga',
    niveau_hierarchique: 3,
    est_organisme_principal: false
  },
  {
    id: 'ORG_CA_FRANCEVILLE',
    code: 'CA_FRANCEVILLE',
    name: 'Cour d\'Appel de Franceville',
    type: 'INSTITUTION_JUDICIAIRE',
    groupe: 'F',
    description: 'Juridiction d\'appel de la région de Franceville',
    city: 'Franceville',
    phone: '+241 01 75 02 00',
    email: 'contact@ca-franceville.ga',
    niveau_hierarchique: 3,
    est_organisme_principal: false
  },
  {
    id: 'ORG_CA_PORT_GENTIL',
    code: 'CA_PORT_GENTIL',
    name: 'Cour d\'Appel de Port-Gentil',
    type: 'INSTITUTION_JUDICIAIRE',
    groupe: 'F',
    description: 'Juridiction d\'appel de la région de Port-Gentil',
    city: 'Port-Gentil',
    phone: '+241 01 75 03 00',
    email: 'contact@ca-port-gentil.ga',
    niveau_hierarchique: 3,
    est_organisme_principal: false
  }
];

// GOUVERNORAT MANQUANT (1)
export const GOUVERNORAT_MANQUANT: OrganismeGabonais[] = [
  {
    id: 'ORG_GOUV_NGOUNIER',
    code: 'GOUV_NGOUNIER',
    name: 'Gouvernorat de la Ngounié',
    type: 'GOUVERNORAT',
    groupe: 'G',
    description: 'Administration provinciale de la Ngounié',
    city: 'Mouila',
    province: 'Ngounié',
    phone: '+241 01 76 01 00',
    email: 'contact@ngounier.gov.ga',
    niveau_hierarchique: 3,
    est_organisme_principal: false
  }
];

// FONCTION : Obtenir tous les organismes prospects
export function getAllOrganismesProspects(): OrganismeGabonais[] {
  return [
    ...MINISTERES_PROSPECTS,
    ...DIRECTIONS_GENERALES_MANQUANTES,
    ...AGENCES_SPECIALISEES_MANQUANTES,
    ...COURS_APPEL_MANQUANTES,
    ...GOUVERNORAT_MANQUANT
  ];
}

// STATISTIQUES
export const STATISTIQUES_PROSPECTS = {
  total: 64,
  ministeres: 30,
  directions_generales: 20,
  agences_specialisees: 10, // +2 avec BEAC et BGD
  cours_appel: 3,
  gouvernorats: 1
};

export default {
  organismes: getAllOrganismesProspects(),
  statistiques: STATISTIQUES_PROSPECTS
};
