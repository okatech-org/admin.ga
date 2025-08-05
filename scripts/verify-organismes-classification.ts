/* @ts-nocheck */
/**
 * Script de vérification de la classification des organismes
 * Compare la classification demandée avec l'implémentation actuelle
 */

import { getOrganismesComplets } from '../lib/data/gabon-organismes-160';

// Classification demandée par l'utilisateur
const CLASSIFICATION_DEMANDEE = {
  // GROUPE A - INSTITUTIONS SUPRÊMES (6)
  'GROUPE_A_INSTITUTIONS_SUPREMES': [
    'PRESIDENCE',
    'PRIMATURE',
    'DIR_COM_PRESIDENTIELLE',
    'SSP',
    'SGG',
    'SERV_COORD_GOUV'
  ],

  // GROUPE B - MINISTÈRES SECTORIELS (30)
  // BLOC RÉGALIEN (4 ministères)
  'GROUPE_B_BLOC_REGALIEN': [
    'MIN_INTERIEUR',
    'MIN_JUSTICE',
    'MIN_AFF_ETR',
    'MIN_DEF_NAT'
  ],

  // BLOC ÉCONOMIQUE ET FINANCIER (8 ministères)
  'GROUPE_B_BLOC_ECONOMIQUE': [
    'MIN_ECO_FIN',
    'MIN_COMPTES_PUB',
    'MIN_BUDGET',
    'MIN_COMMERCE',
    'MIN_INDUSTRIE',
    'MIN_PETROLE',
    'MIN_MINES',
    'MIN_ENERGIE'
  ],

  // BLOC SOCIAL ET DÉVELOPPEMENT HUMAIN (8 ministères)
  'GROUPE_B_BLOC_SOCIAL': [
    'MIN_SANTE',
    'MIN_EDUC_NAT',
    'MIN_ENS_SUP',
    'MIN_TRAVAIL',
    'MIN_FONCTION_PUB',
    'MIN_PROMO_FEMME',
    'MIN_CULTURE',
    'MIN_AFF_SOC'
  ],

  // BLOC INFRASTRUCTURE ET DÉVELOPPEMENT (6 ministères)
  'GROUPE_B_BLOC_INFRASTRUCTURE': [
    'MIN_TRAV_PUB',
    'MIN_HABITAT',
    'MIN_TRANSPORTS',
    'MIN_AGRICULTURE',
    'MIN_EAUX_FOR',
    'MIN_ENVIRONNEMENT'
  ],

  // BLOC INNOVATION ET MODERNISATION (4 ministères)
  'GROUPE_B_BLOC_INNOVATION': [
    'MIN_NUMERIQUE',
    'MIN_COMMUNICATION',
    'MIN_TOURISME',
    'MIN_MODERNISATION'
  ],

  // GROUPE C - DIRECTIONS GÉNÉRALES (25)
  'GROUPE_C_DIRECTIONS_GENERALES': [
    'DGDI',
    'DGI',
    'DOUANES',
    'DGBFIP',
    'DGF',
    'DGE',
    'DGA',
    'DGE_AGRI',
    'DGH',
    'DGSP',
    'DGEN',
    'DGES',
    'DGTP',
    'DGTC',
    'DGIND',
    'DGCOM',
    'DGFP',
    'DGAFF',
    'DGDEF',
    'DGJUST',
    'DGCULT',
    'DGJEUN',
    'DGTOUR',
    'DGENV',
    'DGNUM'
  ],

  // GROUPE E - AGENCES SPÉCIALISÉES (9)
  'GROUPE_E_AGENCES_SPECIALISEES': [
    'ANPI_GABON',
    'FER',
    'ANUTTC',
    'ARSEE',
    'GOC',
    'ANPN',
    'ARCEP',
    'CIRMF',
    'CENAREST'
  ],

  // GROUPE F - INSTITUTIONS JUDICIAIRES (7)
  'GROUPE_F_INSTITUTIONS_JUDICIAIRES': [
    'COUR_CONSTITUTIONNELLE',
    'COUR_CASSATION',
    'CONSEIL_ETAT',
    'COUR_COMPTES',
    'CA_LIBREVILLE',
    'CA_FRANCEVILLE',
    'CA_PORT_GENTIL'
  ],

  // GROUPE G - ADMINISTRATIONS TERRITORIALES (67)
  // Gouvernorats (9)
  'GROUPE_G_GOUVERNORATS': [
    'GOUV_ESTUAIRE',
    'GOUV_HAUT_OGOOUE',
    'GOUV_MOYEN_OGOOUE',
    'GOUV_NGOUNIER',
    'GOUV_NYANGA',
    'GOUV_OGOOUE_IVINDO',
    'GOUV_OGOOUE_LOLO',
    'GOUV_OGOOUE_MARITIME',
    'GOUV_WOLEU_NTEM'
  ],

  // GROUPE L - POUVOIR LÉGISLATIF (2)
  'GROUPE_L_POUVOIR_LEGISLATIF': [
    'ASSEMBLEE_NATIONALE',
    'SENAT'
  ]
};

// Fonction principale de vérification
function verifierClassification() {
  console.log('🔍 VÉRIFICATION DE LA CLASSIFICATION DES ORGANISMES\n');

  // Charger les organismes actuels
  const organismesActuels = getOrganismesComplets();
  const codesActuels = organismesActuels.map(org => org.code);

  console.log(`📊 Organismes actuellement chargés: ${organismesActuels.length}`);
  console.log(`📋 Codes uniques: ${[...new Set(codesActuels)].length}`);

  let totalDemande = 0;
  let totalTrouve = 0;
  let totalManquant = 0;

  const manquants: string[] = [];
  const presents: string[] = [];

  // Vérifier chaque groupe
  Object.entries(CLASSIFICATION_DEMANDEE).forEach(([groupe, codes]) => {
    console.log(`\n📁 ${groupe}`);
    console.log(`   Attendus: ${codes.length}`);

    const trouvesGroupe: string[] = [];
    const manquantsGroupe: string[] = [];

    codes.forEach(code => {
      totalDemande++;
      if (codesActuels.includes(code)) {
        trouvesGroupe.push(code);
        presents.push(code);
        totalTrouve++;
      } else {
        manquantsGroupe.push(code);
        manquants.push(code);
        totalManquant++;
      }
    });

    console.log(`   ✅ Présents: ${trouvesGroupe.length} - ${trouvesGroupe.join(', ')}`);

    if (manquantsGroupe.length > 0) {
      console.log(`   ❌ Manquants: ${manquantsGroupe.length} - ${manquantsGroupe.join(', ')}`);
    }
  });

  // Vérifier les directions centrales (générées dynamiquement)
  const directionsCentralesActuelles = organismesActuels.filter(org =>
    org.code.startsWith('DCRH_') ||
    org.code.startsWith('DCAF_') ||
    org.code.startsWith('DCSI_') ||
    org.code.startsWith('DCAJ_') ||
    org.code.startsWith('DCC_')
  );

  console.log(`\n📁 DIRECTIONS CENTRALES (Générées automatiquement)`);
  console.log(`   Attendues: 150 (30 ministères × 5 types)`);
  console.log(`   Présentes: ${directionsCentralesActuelles.length}`);

  // Résumé final
  console.log('\n' + '='.repeat(60));
  console.log('📊 RÉSUMÉ DE LA VÉRIFICATION');
  console.log('='.repeat(60));
  console.log(`Total organismes demandés: ${totalDemande}`);
  console.log(`✅ Organismes présents: ${totalTrouve}`);
  console.log(`❌ Organismes manquants: ${totalManquant}`);
  console.log(`📈 Pourcentage de couverture: ${((totalTrouve/totalDemande)*100).toFixed(1)}%`);

  if (manquants.length > 0) {
    console.log('\n❌ ORGANISMES MANQUANTS:');
    manquants.forEach(code => console.log(`   - ${code}`));
  }

  // Suggestions d'action
  console.log('\n💡 ACTIONS RECOMMANDÉES:');
  if (totalManquant > 0) {
    console.log('   1. Créer les organismes manquants dans gabon-organismes-160.ts');
    console.log('   2. Mettre à jour la fonction getOrganismesComplets() pour inclure tous les groupes');
    console.log('   3. Vérifier que tous les organismes sont en statut "prospect"');
  } else {
    console.log('   ✅ Tous les organismes sont présents !');
  }

  console.log('   4. Tester la page /super-admin/organismes-prospects');
  console.log('\n🎯 Objectif: Tous les organismes en statut PROSPECT dans la page prospects');
}

// Exécuter la vérification
verifierClassification();
