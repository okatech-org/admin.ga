/**
 * Script d'analyse comparative entre l'implémentation actuelle et le prompt ministères
 * Identifie les écarts et propose les corrections
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Structure cible selon le prompt (30 ministères)
const STRUCTURE_CIBLE_PROMPT = {
  "BLOC_REGALIEN": {
    ministeres: [
      { nom: "Ministère de l'Intérieur", code: "MIN_INTERIEUR" },
      { nom: "Ministère de la Justice", code: "MIN_JUSTICE" },
      { nom: "Ministère des Affaires Étrangères", code: "MIN_AFFAIRES_ETRANGERES" },
      { nom: "Ministère de la Défense Nationale", code: "MIN_DEFENSE" }
    ],
    effectifs: "150-250 utilisateurs"
  },
  "BLOC_ECONOMIQUE": {
    ministeres: [
      { nom: "Ministère de l'Économie et des Finances", code: "MIN_ECONOMIE_FINANCES" },
      { nom: "Ministère des Comptes Publics", code: "MIN_COMPTES_PUBLICS" },
      { nom: "Ministère du Budget", code: "MIN_BUDGET" },
      { nom: "Ministère du Commerce", code: "MIN_COMMERCE" },
      { nom: "Ministère de l'Industrie", code: "MIN_INDUSTRIE" },
      { nom: "Ministère du Pétrole", code: "MIN_PETROLE" },
      { nom: "Ministère des Mines", code: "MIN_MINES" },
      { nom: "Ministère de l'Énergie", code: "MIN_ENERGIE" }
    ],
    effectifs: "80-150 utilisateurs"
  },
  "BLOC_SOCIAL": {
    ministeres: [
      { nom: "Ministère de la Santé Publique", code: "MIN_SANTE" },
      { nom: "Ministère de l'Éducation Nationale", code: "MIN_EDUCATION" },
      { nom: "Ministère de l'Enseignement Supérieur", code: "MIN_ENSEIGNEMENT_SUP" },
      { nom: "Ministère du Travail", code: "MIN_TRAVAIL" },
      { nom: "Ministère de la Fonction Publique", code: "MIN_FONCTION_PUBLIQUE" },
      { nom: "Ministère de la Promotion de la Femme", code: "MIN_FEMME" },
      { nom: "Ministère de la Culture", code: "MIN_CULTURE" },
      { nom: "Ministère des Affaires Sociales", code: "MIN_AFFAIRES_SOCIALES" }
    ],
    effectifs: "150-250 utilisateurs (Santé, Éducation), 80-150 autres"
  },
  "BLOC_INFRASTRUCTURE": {
    ministeres: [
      { nom: "Ministère des Travaux Publics", code: "MIN_TRAVAUX_PUBLICS" },
      { nom: "Ministère de l'Habitat", code: "MIN_HABITAT" },
      { nom: "Ministère des Transports", code: "MIN_TRANSPORTS" },
      { nom: "Ministère de l'Agriculture", code: "MIN_AGRICULTURE" },
      { nom: "Ministère des Eaux et Forêts", code: "MIN_EAUX_FORETS" },
      { nom: "Ministère de l'Environnement", code: "MIN_ENVIRONNEMENT" }
    ],
    effectifs: "80-150 utilisateurs"
  },
  "BLOC_INNOVATION": {
    ministeres: [
      { nom: "Ministère du Numérique", code: "MIN_NUMERIQUE" },
      { nom: "Ministère de la Communication", code: "MIN_COMMUNICATION" },
      { nom: "Ministère du Tourisme", code: "MIN_TOURISME" },
      { nom: "Ministère de la Modernisation", code: "MIN_MODERNISATION" }
    ],
    effectifs: "40-80 utilisateurs"
  }
};

// Hiérarchie cible selon le prompt
const HIERARCHIE_CIBLE = {
  "NIVEAU_1_DIRECTION": {
    postes: ["Ministre", "Secrétaire Général", "Directeur de Cabinet"],
    role: "ADMIN",
    nb_comptes: 3
  },
  "NIVEAU_2_ENCADREMENT": {
    postes: [
      "Directeur Général Adjoint",
      "Conseiller Technique",
      "Directeur des Affaires Administratives et Financières",
      "Directeur des Ressources Humaines",
      "Inspecteur Général des Services",
      "Directeur de la Communication"
    ],
    role: "MANAGER",
    nb_comptes: "4-6"
  },
  "NIVEAU_3_EXECUTION": {
    postes: [
      "Chef de Service Budget",
      "Chef de Service Juridique",
      "Chef de Service Informatique",
      "Gestionnaire Comptable",
      "Chargé d'Études",
      "Responsable Archives",
      "Assistant Administratif",
      "Secrétaire"
    ],
    role: "AGENT",
    nb_comptes: "5-8"
  }
};

async function analyserImplementationActuelle() {
  console.log('🔍 ANALYSE COMPARATIVE MINISTÈRES - PROMPT vs IMPLÉMENTATION');
  console.log('==============================================================\n');

  try {
    // 1. Analyser l'état actuel
    console.log('📊 ÉTAT ACTUEL DE L\'IMPLÉMENTATION');
    console.log('=====================================');

    const ministeresActuels = await prisma.organization.findMany({
      where: {
        OR: [
          { type: 'MINISTERE' },
          { type: 'MINISTERE_ETAT' }
        ]
      },
      include: {
        _count: { select: { users: true } },
        users: { select: { role: true, jobTitle: true } }
      }
    });

    console.log(`📋 Ministères actuellement implémentés: ${ministeresActuels.length}`);

    const totalUsersMinisteres = ministeresActuels.reduce((acc, m) => acc + m._count.users, 0);
    console.log(`👥 Total agents dans les ministères: ${totalUsersMinisteres}`);

    // Répartition par type
    const ministeresEtat = ministeresActuels.filter(m => m.type === 'MINISTERE_ETAT');
    const ministeresStandard = ministeresActuels.filter(m => m.type === 'MINISTERE');

    console.log(`👑 Ministères d'État: ${ministeresEtat.length}`);
    console.log(`🏛️ Ministères standard: ${ministeresStandard.length}`);

    // Liste détaillée
    console.log('\n📋 LISTE DÉTAILLÉE DES MINISTÈRES ACTUELS:');
    ministeresActuels.forEach((ministere, index) => {
      const roleStats = {};
      ministere.users.forEach(user => {
        roleStats[user.role] = (roleStats[user.role] || 0) + 1;
      });

      console.log(`${index + 1}. ${ministere.name} (${ministere.code})`);
      console.log(`   Type: ${ministere.type}`);
      console.log(`   Agents: ${ministere._count.users}`);
      if (Object.keys(roleStats).length > 0) {
        console.log(`   Rôles: ${Object.entries(roleStats).map(([role, count]) => `${role}:${count}`).join(', ')}`);
      }
    });

    // 2. Calculer les écarts avec la cible
    console.log('\n🎯 ANALYSE DES ÉCARTS AVEC LA CIBLE (30 MINISTÈRES)');
    console.log('=====================================================');

    const totalMinisteresCible = Object.values(STRUCTURE_CIBLE_PROMPT)
      .reduce((acc, bloc) => acc + bloc.ministeres.length, 0);

    console.log(`🎯 Objectif selon prompt: ${totalMinisteresCible} ministères`);
    console.log(`📊 Actuellement implémentés: ${ministeresActuels.length} ministères`);
    console.log(`📈 Écart: ${totalMinisteresCible - ministeresActuels.length} ministères manquants`);

    // 3. Analyser par bloc
    console.log('\n🔍 ANALYSE PAR BLOC SECTORIEL');
    console.log('===============================');

    for (const [nomBloc, bloc] of Object.entries(STRUCTURE_CIBLE_PROMPT)) {
      console.log(`\n📦 ${nomBloc.replace('_', ' ')}: ${bloc.ministeres.length} ministères attendus`);

      let trouves = 0;
      let manquants = [];

      bloc.ministeres.forEach(ministereTarget => {
        // Recherche approximative par nom ou code
        const trouve = ministeresActuels.find(actual =>
          actual.name.toLowerCase().includes(ministereTarget.nom.toLowerCase().split(' ')[1]) ||
          actual.code.toLowerCase().includes(ministereTarget.code.toLowerCase().split('_')[1])
        );

        if (trouve) {
          trouves++;
          console.log(`   ✅ ${ministereTarget.nom} → ${trouve.name}`);
        } else {
          manquants.push(ministereTarget);
          console.log(`   ❌ ${ministereTarget.nom} → MANQUANT`);
        }
      });

      console.log(`   📊 Taux de couverture: ${trouves}/${bloc.ministeres.length} (${Math.round(trouves/bloc.ministeres.length*100)}%)`);

      if (manquants.length > 0) {
        console.log(`   🚨 Ministères à créer:`);
        manquants.forEach(m => console.log(`      - ${m.nom} (${m.code})`));
      }
    }

    // 4. Analyser la hiérarchie
    console.log('\n👥 ANALYSE DE LA HIÉRARCHIE UTILISATEURS');
    console.log('==========================================');

    const allUsers = ministeresActuels.reduce((acc, m) => acc.concat(m.users), []);
    const roleDistribution = {};
    allUsers.forEach(user => {
      roleDistribution[user.role] = (roleDistribution[user.role] || 0) + 1;
    });

    console.log('📊 Répartition actuelle par rôle:');
    Object.entries(roleDistribution).forEach(([role, count]) => {
      console.log(`   ${role}: ${count} (${Math.round(count/allUsers.length*100)}%)`);
    });

    console.log('\n🎯 Structure cible selon prompt:');
    Object.entries(HIERARCHIE_CIBLE).forEach(([niveau, info]) => {
      console.log(`   ${niveau.replace('_', ' ')}: ${info.nb_comptes} comptes ${info.role}`);
      console.log(`   Postes: ${info.postes.slice(0, 3).join(', ')}${info.postes.length > 3 ? '...' : ''}`);
    });

    // 5. Recommandations
    console.log('\n💡 RECOMMANDATIONS POUR ALIGNEMENT AVEC LE PROMPT');
    console.log('===================================================');

    const ministeresManquants = totalMinisteresCible - ministeresActuels.length;

    console.log('🚀 Actions prioritaires:');
    console.log(`   1. Créer ${ministeresManquants} ministères manquants`);
    console.log('   2. Standardiser la structure hiérarchique (3 niveaux)');
    console.log('   3. Ajuster les effectifs selon les recommandations');
    console.log('   4. Implémenter les comptes utilisateurs manquants');
    console.log('   5. Harmoniser les codes ministériels');

    console.log('\n📋 Prochaines étapes:');
    console.log('   ✅ Utiliser le prompt pour générer les ministères manquants');
    console.log('   ✅ Créer un script de migration pour la structure hiérarchique');
    console.log('   ✅ Valider l\'alignement avec la structure officielle gabonaise');

    // 6. Générer un plan de mise en œuvre
    console.log('\n📅 PLAN DE MISE EN ŒUVRE');
    console.log('=========================');

    const blocs = Object.entries(STRUCTURE_CIBLE_PROMPT);
    blocs.forEach(([nomBloc, bloc], index) => {
      const manquants = bloc.ministeres.filter(target =>
        !ministeresActuels.some(actual =>
          actual.name.toLowerCase().includes(target.nom.toLowerCase().split(' ')[1])
        )
      );

      if (manquants.length > 0) {
        console.log(`\n🔄 Phase ${index + 1}: ${nomBloc.replace('_', ' ')}`);
        console.log(`   Ministères à créer: ${manquants.length}`);
        manquants.forEach(m => console.log(`   - ${m.nom}`));
        console.log(`   Effectifs recommandés: ${bloc.effectifs}`);
      }
    });

    console.log('\n✨ CONCLUSION');
    console.log('==============');
    console.log(`📊 Taux de complétude actuel: ${Math.round(ministeresActuels.length/totalMinisteresCible*100)}%`);
    console.log(`🎯 Objectif: Atteindre 100% avec ${totalMinisteresCible} ministères`);
    console.log(`🚀 Le prompt ministères fourni est le guide parfait pour compléter l'implémentation !`);

  } catch (error) {
    console.error('❌ Erreur lors de l\'analyse:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter l'analyse
analyserImplementationActuelle();
