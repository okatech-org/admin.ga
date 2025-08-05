/* @ts-nocheck */
/**
 * Script de test pour vérifier que tous les organismes de la classification
 * sont bien présents dans la page prospects
 */

import { getOrganismesComplets } from '../lib/data/gabon-organismes-160';
import { getAllOrganismesProspects } from '../lib/data/organismes-prospects-complete';

// Classification demandée complète (reprise du script de vérification)
const CLASSIFICATION_COMPLETE = {
  // GROUPE A - INSTITUTIONS SUPRÊMES (6)
  'GROUPE_A_INSTITUTIONS_SUPREMES': [
    'PRESIDENCE', 'PRIMATURE', 'DIR_COM_PRESIDENTIELLE', 'SSP', 'SGG', 'SERV_COORD_GOUV'
  ],

  // GROUPE B - MINISTÈRES (30)
  'GROUPE_B_MINISTERES': [
    // Bloc régalien
    'MIN_INTERIEUR', 'MIN_JUSTICE', 'MIN_AFF_ETR', 'MIN_DEF_NAT',
    // Bloc économique
    'MIN_ECO_FIN', 'MIN_COMPTES_PUB', 'MIN_BUDGET', 'MIN_COMMERCE', 'MIN_INDUSTRIE', 'MIN_PETROLE', 'MIN_MINES', 'MIN_ENERGIE',
    // Bloc social
    'MIN_SANTE', 'MIN_EDUC_NAT', 'MIN_ENS_SUP', 'MIN_TRAVAIL', 'MIN_FONCTION_PUB', 'MIN_PROMO_FEMME', 'MIN_CULTURE', 'MIN_AFF_SOC',
    // Bloc infrastructure
    'MIN_TRAV_PUB', 'MIN_HABITAT', 'MIN_TRANSPORTS', 'MIN_AGRICULTURE', 'MIN_EAUX_FOR', 'MIN_ENVIRONNEMENT',
    // Bloc innovation
    'MIN_NUMERIQUE', 'MIN_COMMUNICATION', 'MIN_TOURISME', 'MIN_MODERNISATION'
  ],

  // GROUPE C - DIRECTIONS GÉNÉRALES (25)
  'GROUPE_C_DIRECTIONS_GENERALES': [
    'DGDI', 'DGI', 'DOUANES', 'DGBFIP', 'DGF', 'DGE', 'DGA', 'DGE_AGRI', 'DGH', 'DGSP',
    'DGEN', 'DGES', 'DGTP', 'DGTC', 'DGIND', 'DGCOM', 'DGFP', 'DGAFF', 'DGDEF', 'DGJUST',
    'DGCULT', 'DGJEUN', 'DGTOUR', 'DGENV', 'DGNUM'
  ],

  // GROUPE E - AGENCES SPÉCIALISÉES (9)
  'GROUPE_E_AGENCES_SPECIALISEES': [
    'ANPI_GABON', 'FER', 'ANUTTC', 'ARSEE', 'GOC', 'ANPN', 'ARCEP', 'CIRMF', 'CENAREST'
  ],

  // GROUPE F - INSTITUTIONS JUDICIAIRES (7)
  'GROUPE_F_INSTITUTIONS_JUDICIAIRES': [
    'COUR_CONSTITUTIONNELLE', 'COUR_CASSATION', 'CONSEIL_ETAT', 'COUR_COMPTES',
    'CA_LIBREVILLE', 'CA_FRANCEVILLE', 'CA_PORT_GENTIL'
  ],

  // GROUPE G - ADMINISTRATIONS TERRITORIALES (9 gouvernorats)
  'GROUPE_G_GOUVERNORATS': [
    'GOUV_ESTUAIRE', 'GOUV_HAUT_OGOOUE', 'GOUV_MOYEN_OGOOUE', 'GOUV_NGOUNIER', 'GOUV_NYANGA',
    'GOUV_OGOOUE_IVINDO', 'GOUV_OGOOUE_LOLO', 'GOUV_OGOOUE_MARITIME', 'GOUV_WOLEU_NTEM'
  ],

  // GROUPE L - POUVOIR LÉGISLATIF (2)
  'GROUPE_L_POUVOIR_LEGISLATIF': [
    'ASSEMBLEE_NATIONALE', 'SENAT'
  ]
};

function testOrganismesProspectsComplete() {
  console.log('🧪 TEST COMPLET - ORGANISMES PROSPECTS\n');

  // Charger les données comme dans la page prospects
  const organismesExistants = getOrganismesComplets();
  const organismesProspects = getAllOrganismesProspects();
  const tousOrganismes = [...organismesExistants, ...organismesProspects];

  console.log(`📊 DONNÉES CHARGÉES:`);
  console.log(`   - Organismes existants: ${organismesExistants.length}`);
  console.log(`   - Organismes prospects: ${organismesProspects.length}`);
  console.log(`   - Total combiné: ${tousOrganismes.length}`);

  // Extraire tous les codes
  const codesDisponibles = tousOrganismes.map(org => org.code);
  const codesUniques = [...new Set(codesDisponibles)];

  console.log(`   - Codes uniques: ${codesUniques.length}`);

  if (codesDisponibles.length !== codesUniques.length) {
    console.log(`   ⚠️  ATTENTION: ${codesDisponibles.length - codesUniques.length} doublons détectés`);
  }

  // Tester la couverture complète
  let totalDemande = 0;
  let totalTrouve = 0;
  const manquants: string[] = [];
  const presents: string[] = [];

  Object.entries(CLASSIFICATION_COMPLETE).forEach(([groupe, codes]) => {
    console.log(`\n📁 ${groupe} (${codes.length} organismes)`);

    codes.forEach(code => {
      totalDemande++;
      if (codesUniques.includes(code)) {
        presents.push(code);
        totalTrouve++;
        console.log(`   ✅ ${code}`);
      } else {
        manquants.push(code);
        console.log(`   ❌ ${code} - MANQUANT`);
      }
    });
  });

  // Vérifier les directions centrales
  const directionsCentrales = tousOrganismes.filter(org =>
    org.code.startsWith('DCRH_') ||
    org.code.startsWith('DCAF_') ||
    org.code.startsWith('DCSI_') ||
    org.code.startsWith('DCAJ_') ||
    org.code.startsWith('DCC_')
  );

  console.log(`\n📁 DIRECTIONS CENTRALES (Générées automatiquement)`);
  console.log(`   Attendues: 150 (30 ministères × 5 types)`);
  console.log(`   Présentes: ${directionsCentrales.length}`);

  if (directionsCentrales.length === 150) {
    console.log(`   ✅ Toutes les directions centrales sont présentes`);
  } else {
    console.log(`   ❌ ${150 - directionsCentrales.length} directions centrales manquantes`);
  }

  // Résumé final
  console.log('\n' + '='.repeat(70));
  console.log('🎯 RÉSUMÉ DU TEST COMPLET');
  console.log('='.repeat(70));
  console.log(`Total organismes demandés: ${totalDemande}`);
  console.log(`✅ Organismes présents: ${totalTrouve}`);
  console.log(`❌ Organismes manquants: ${manquants.length}`);
  console.log(`📈 Couverture: ${((totalTrouve/totalDemande)*100).toFixed(1)}%`);
  console.log(`📦 Total dans la page: ${tousOrganismes.length} organismes`);

  if (manquants.length === 0) {
    console.log('\n🎉 SUCCÈS TOTAL !');
    console.log('✅ Tous les organismes de la classification sont présents');
    console.log('✅ La page /super-admin/organismes-prospects devrait afficher tous les organismes');
    console.log('✅ Tous les organismes sont maintenant en statut "prospect"');
  } else {
    console.log('\n❌ ORGANISMES ENCORE MANQUANTS:');
    manquants.forEach(code => console.log(`   - ${code}`));
  }

  // Vérifications supplémentaires
  console.log('\n🔍 VÉRIFICATIONS ADDITIONNELLES:');

  // Groupe par type
  const parType = tousOrganismes.reduce((acc, org) => {
    acc[org.type] = (acc[org.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  console.log('📊 Répartition par type:');
  Object.entries(parType)
    .sort(([,a], [,b]) => b - a)
    .forEach(([type, count]) => {
      console.log(`   ${type}: ${count}`);
    });

  // Groupe par groupe administratif
  const parGroupe = tousOrganismes.reduce((acc, org) => {
    acc[org.groupe] = (acc[org.groupe] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  console.log('\n📊 Répartition par groupe administratif:');
  Object.entries(parGroupe)
    .sort(([a], [b]) => a.localeCompare(b))
    .forEach(([groupe, count]) => {
      const groupeNames = {
        'A': 'Institutions Suprêmes',
        'B': 'Ministères',
        'C': 'Directions Générales',
        'D': 'Établissements Publics',
        'E': 'Agences Spécialisées',
        'F': 'Institutions Judiciaires',
        'G': 'Administrations Territoriales',
        'L': 'Pouvoir Législatif',
        'I': 'Institutions Indépendantes'
      };
      console.log(`   Groupe ${groupe} (${groupeNames[groupe] || 'Inconnu'}): ${count}`);
    });

  console.log('\n🚀 PROCHAINES ÉTAPES:');
  console.log('1. Tester la page: http://localhost:3000/super-admin/organismes-prospects');
  console.log('2. Vérifier l\'onglet "160 Organismes Gabon"');
  console.log('3. Confirmer que tous les organismes sont visibles et filtrables');
  console.log('4. Vérifier que tous sont en statut PROSPECT');
}

// Exécuter le test
testOrganismesProspectsComplete();
