/**
 * Validation finale - Conformité au prompt ministères gabonais
 * Vérification complète de l'implémentation des 30 ministères
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Structure attendue selon le prompt
const VALIDATION_PROMPT = {
  "TOTAL_MINISTERES": 30,
  "BLOCS_ATTENDUS": {
    "REGALIEN": 4,
    "ECONOMIQUE": 8,
    "SOCIAL": 8,
    "INFRASTRUCTURE": 6,
    "INNOVATION": 4
  },
  "HIERARCHIE_ATTENDUE": {
    "NIVEAU_1_DIRECTION": {
      nb_postes: 3,
      roles: ["SUPER_ADMIN", "ADMIN"],
      postes: ["Ministre", "Secrétaire Général", "Directeur de Cabinet"]
    },
    "NIVEAU_2_ENCADREMENT": {
      nb_postes_range: [4, 6],
      role: "MANAGER",
      postes: ["Directeur Général Adjoint", "Conseiller Technique", "Directeur des Affaires Administratives"]
    },
    "NIVEAU_3_EXECUTION": {
      nb_postes_range: [5, 8],
      role: "AGENT",
      postes: ["Chef de Service Budget", "Chef de Service Juridique", "Gestionnaire Comptable"]
    }
  },
  "NOMS_GABONAIS": {
    "PRENOMS_MASCULINS": ["Jean", "Paul", "Pierre", "Michel", "André", "François"],
    "PRENOMS_FEMININS": ["Marie", "Claire", "Sylvie", "Jeanne", "Catherine", "Françoise"],
    "NOMS_FAMILLE": ["OBIANG", "NZENG", "BOUKOUMOU", "MBOUMBA", "EYEGHE", "NDONG"]
  },
  "FORMAT_EMAIL": ".gov.ga",
  "CODES_MINISTERIELS": "MIN_"
};

async function validationFinalePrompt() {
  console.log('✅ VALIDATION FINALE - CONFORMITÉ AU PROMPT MINISTÈRES');
  console.log('======================================================\n');

  try {
    // 1. Validation du nombre total de ministères
    console.log('🎯 1. VALIDATION NOMBRE TOTAL DE MINISTÈRES');
    console.log('=============================================');

    const totalMinisteres = await prisma.organization.count({
      where: {
        OR: [
          { type: 'MINISTERE' },
          { type: 'MINISTERE_ETAT' }
        ]
      }
    });

    const conformiteTotal = totalMinisteres === VALIDATION_PROMPT.TOTAL_MINISTERES;
    console.log(`📊 Total ministères: ${totalMinisteres}/${VALIDATION_PROMPT.TOTAL_MINISTERES}`);
    console.log(`${conformiteTotal ? '✅' : '❌'} Conformité nombre total: ${conformiteTotal ? 'CONFORME' : 'NON CONFORME'}`);

    // 2. Validation des blocs sectoriels
    console.log('\n🏗️ 2. VALIDATION DES BLOCS SECTORIELS');
    console.log('=====================================');

    const ministeresDetails = await prisma.organization.findMany({
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

    // Classification par bloc (approximative basée sur les noms)
    const classification = {
      "REGALIEN": ministeresDetails.filter(m =>
        m.name.toLowerCase().includes('intérieur') ||
        m.name.toLowerCase().includes('justice') ||
        m.name.toLowerCase().includes('affaires étrangères') ||
        m.name.toLowerCase().includes('défense')
      ),
      "ECONOMIQUE": ministeresDetails.filter(m =>
        m.name.toLowerCase().includes('économie') ||
        m.name.toLowerCase().includes('finances') ||
        m.name.toLowerCase().includes('budget') ||
        m.name.toLowerCase().includes('commerce') ||
        m.name.toLowerCase().includes('industrie') ||
        m.name.toLowerCase().includes('pétrole') ||
        m.name.toLowerCase().includes('mines') ||
        m.name.toLowerCase().includes('énergie') ||
        m.name.toLowerCase().includes('comptes publics')
      ),
      "SOCIAL": ministeresDetails.filter(m =>
        m.name.toLowerCase().includes('santé') ||
        m.name.toLowerCase().includes('éducation') ||
        m.name.toLowerCase().includes('enseignement') ||
        m.name.toLowerCase().includes('travail') ||
        m.name.toLowerCase().includes('fonction publique') ||
        m.name.toLowerCase().includes('femme') ||
        m.name.toLowerCase().includes('culture') ||
        m.name.toLowerCase().includes('affaires sociales')
      ),
      "INFRASTRUCTURE": ministeresDetails.filter(m =>
        m.name.toLowerCase().includes('travaux publics') ||
        m.name.toLowerCase().includes('habitat') ||
        m.name.toLowerCase().includes('transports') ||
        m.name.toLowerCase().includes('agriculture') ||
        m.name.toLowerCase().includes('eaux et forêts') ||
        m.name.toLowerCase().includes('environnement')
      ),
      "INNOVATION": ministeresDetails.filter(m =>
        m.name.toLowerCase().includes('numérique') ||
        m.name.toLowerCase().includes('communication') ||
        m.name.toLowerCase().includes('tourisme') ||
        m.name.toLowerCase().includes('modernisation')
      )
    };

    let conformiteBlocs = true;
    for (const [bloc, attendu] of Object.entries(VALIDATION_PROMPT.BLOCS_ATTENDUS)) {
      const actuel = classification[bloc].length;
      const conforme = actuel >= attendu; // Au moins le nombre attendu
      console.log(`📦 Bloc ${bloc}: ${actuel}/${attendu} ${conforme ? '✅' : '❌'}`);
      if (!conforme) conformiteBlocs = false;
    }

    console.log(`\n${conformiteBlocs ? '✅' : '❌'} Conformité blocs sectoriels: ${conformiteBlocs ? 'CONFORME' : 'NON CONFORME'}`);

    // 3. Validation de la hiérarchie
    console.log('\n👥 3. VALIDATION DE LA HIÉRARCHIE');
    console.log('=================================');

    const totalUtilisateursMinisteres = ministeresDetails.reduce((acc, m) => acc + m._count.users, 0);
    console.log(`👥 Total agents ministériels: ${totalUtilisateursMinisteres}`);

    // Analyse de la répartition des rôles
    const repartitionRoles = {};
    ministeresDetails.forEach(ministere => {
      ministere.users.forEach(user => {
        repartitionRoles[user.role] = (repartitionRoles[user.role] || 0) + 1;
      });
    });

    console.log('\n📊 Répartition par rôle:');
    Object.entries(repartitionRoles).forEach(([role, count]) => {
      const percentage = (count / totalUtilisateursMinisteres * 100).toFixed(1);
      console.log(`   ${role}: ${count} (${percentage}%)`);
    });

    // Validation des ratios hiérarchiques
    const ratioValidation = {
      "SUPER_ADMIN": {
        actuel: repartitionRoles['SUPER_ADMIN'] || 0,
        attendu: totalMinisteres, // 1 par ministère
        tolerance: 0.1
      },
      "ADMIN": {
        actuel: repartitionRoles['ADMIN'] || 0,
        attendu: totalMinisteres * 2, // 2 par ministère
        tolerance: 0.2
      },
      "MANAGER": {
        actuel: repartitionRoles['MANAGER'] || 0,
        attendu: totalMinisteres * 5, // ~5 par ministère
        tolerance: 0.3
      },
      "AGENT": {
        actuel: repartitionRoles['AGENT'] || 0,
        attendu: totalMinisteres * 6, // ~6 par ministère
        tolerance: 0.3
      }
    };

    console.log('\n🎯 Validation des ratios:');
    let conformiteHierarchie = true;
    Object.entries(ratioValidation).forEach(([role, validation]) => {
      const ecart = Math.abs(validation.actuel - validation.attendu) / validation.attendu;
      const conforme = ecart <= validation.tolerance;
      console.log(`   ${role}: ${validation.actuel}/${validation.attendu} (écart: ${(ecart*100).toFixed(1)}%) ${conforme ? '✅' : '❌'}`);
      if (!conforme) conformiteHierarchie = false;
    });

    // 4. Validation des emails et codes
    console.log('\n📧 4. VALIDATION EMAILS ET CODES');
    console.log('=================================');

    const emailsGouvernementaux = await prisma.user.count({
      where: {
        email: { contains: '.gov.ga' },
        primaryOrganization: {
          OR: [
            { type: 'MINISTERE' },
            { type: 'MINISTERE_ETAT' }
          ]
        }
      }
    });

    const codesConformes = ministeresDetails.filter(m =>
      m.code.startsWith('MIN_') ||
      ['MEF', 'MEN', 'MTM'].includes(m.code) // Exceptions pour ministères d'État
    ).length;

    console.log(`📧 Emails .gov.ga: ${emailsGouvernementaux}/${totalUtilisateursMinisteres} ${emailsGouvernementaux === totalUtilisateursMinisteres ? '✅' : '❌'}`);
    console.log(`🏷️ Codes conformes: ${codesConformes}/${totalMinisteres} ${codesConformes === totalMinisteres ? '✅' : '❌'}`);

    // 5. Échantillon de validation des noms
    console.log('\n👤 5. VALIDATION NOMS GABONAIS (ÉCHANTILLON)');
    console.log('============================================');

    const echantillonUtilisateurs = await prisma.user.findMany({
      where: {
        primaryOrganization: {
          OR: [
            { type: 'MINISTERE' },
            { type: 'MINISTERE_ETAT' }
          ]
        }
      },
      select: { firstName: true, lastName: true },
      take: 10
    });

    console.log('📋 Échantillon de noms (10 premiers):');
    echantillonUtilisateurs.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.firstName} ${user.lastName}`);
    });

    // 6. Validation de l'intégrité des données
    console.log('\n🔐 6. VALIDATION INTÉGRITÉ DES DONNÉES');
    console.log('======================================');

    const utilisateursSansOrganisation = await prisma.user.count({
      where: { primaryOrganizationId: null }
    });

    const ministeresSansUtilisateurs = ministeresDetails.filter(m => m._count.users === 0).length;

    const emailsDoublons = await prisma.user.groupBy({
      by: ['email'],
      _count: { email: true },
      having: { email: { _count: { gt: 1 } } }
    });

    console.log(`👥 Utilisateurs sans organisation: ${utilisateursSansOrganisation} ${utilisateursSansOrganisation === 0 ? '✅' : '❌'}`);
    console.log(`🏛️ Ministères sans utilisateurs: ${ministeresSansUtilisateurs} ${ministeresSansUtilisateurs === 0 ? '✅' : '❌'}`);
    console.log(`📧 Emails en doublon: ${emailsDoublons.length} ${emailsDoublons.length === 0 ? '✅' : '❌'}`);

    // 7. Score de conformité global
    console.log('\n🏆 7. SCORE DE CONFORMITÉ GLOBAL');
    console.log('=================================');

    const criteresValidation = [
      { nom: 'Nombre total ministères', conforme: conformiteTotal },
      { nom: 'Blocs sectoriels', conforme: conformiteBlocs },
      { nom: 'Hiérarchie', conforme: conformiteHierarchie },
      { nom: 'Emails gouvernementaux', conforme: emailsGouvernementaux === totalUtilisateursMinisteres },
      { nom: 'Codes ministériels', conforme: codesConformes === totalMinisteres },
      { nom: 'Intégrité données', conforme: utilisateursSansOrganisation === 0 && ministeresSansUtilisateurs === 0 && emailsDoublons.length === 0 }
    ];

    const conformes = criteresValidation.filter(c => c.conforme).length;
    const scoreConformite = (conformes / criteresValidation.length * 100).toFixed(1);

    console.log('📊 Détail des critères:');
    criteresValidation.forEach(critere => {
      console.log(`   ${critere.conforme ? '✅' : '❌'} ${critere.nom}`);
    });

    console.log(`\n🎯 Score de conformité: ${scoreConformite}% (${conformes}/${criteresValidation.length})`);

    // 8. Conclusion et recommandations
    console.log('\n📝 8. CONCLUSION ET RECOMMANDATIONS');
    console.log('===================================');

    if (scoreConformite >= 85) {
      console.log('🎉 IMPLÉMENTATION EXCELLENTE !');
      console.log('✅ L\'implémentation respecte parfaitement le prompt ministères');
      console.log('✅ Structure gouvernementale gabonaise complètement conforme');
      console.log('✅ Prêt pour la production');
    } else if (scoreConformite >= 70) {
      console.log('👍 IMPLÉMENTATION BONNE');
      console.log('⚠️ Quelques ajustements mineurs recommandés');
      console.log('📋 Voir les critères non conformes ci-dessus');
    } else {
      console.log('⚠️ IMPLÉMENTATION À AMÉLIORER');
      console.log('🔧 Corrections nécessaires pour atteindre la conformité');
      console.log('📋 Revoir les critères non respectés');
    }

    // Statistiques finales pour le bilan
    console.log('\n📈 STATISTIQUES FINALES');
    console.log('========================');
    console.log(`🏛️ Ministères: ${totalMinisteres}/30`);
    console.log(`👥 Agents ministériels: ${totalUtilisateursMinisteres}`);
    console.log(`📊 Score conformité: ${scoreConformite}%`);
    console.log(`🇬🇦 Statut: ${scoreConformite >= 85 ? 'CONFORME AU PROMPT' : 'EN COURS D\'ALIGNEMENT'}`);

  } catch (error) {
    console.error('❌ Erreur lors de la validation:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter la validation
validationFinalePrompt();
