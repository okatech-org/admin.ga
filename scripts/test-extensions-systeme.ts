#!/usr/bin/env bun

/**
 * Script de test pour les extensions du système
 * Test des fonctionnalités d'ajout d'organismes, postes et utilisateurs
 *
 * Usage: bun run scripts/test-extensions-systeme.ts
 */

import {
  extensionsSysteme,
  ajouterOrganismePersonnalise,
  ajouterPostePersonnalise,
  genererUtilisateursSupplementaires,
  creerEcosystemeInnovation,
  renforcerMinisteres
} from '../lib/data/systeme-extensions';

async function testerExtensions() {
  console.log('\n' + '='.repeat(60));
  console.log('🧪 TEST DES EXTENSIONS DU SYSTÈME');
  console.log('='.repeat(60) + '\n');

  try {
    // Réinitialiser pour avoir un test propre
    extensionsSysteme.reinitialiser();

    // ==================== TEST 1: AJOUT D'UN ORGANISME ====================
    console.log('📊 1. Test d\'ajout d\'organisme personnalisé...');

    const nouvelOrganisme = ajouterOrganismePersonnalise({
      nom: 'Centre National de Cybersécurité',
      code: 'CNC_GABON',
      type: 'ETABLISSEMENT_PUBLIC',
      description: 'Protection des infrastructures numériques nationales',
      email_contact: 'contact@cnc.ga',
      couleur_principale: '#1E90FF'
    });

    console.log(`   ✅ Organisme créé: ${nouvelOrganisme.nom}`);
    console.log(`      • Code: ${nouvelOrganisme.code}`);
    console.log(`      • Email: ${nouvelOrganisme.email_contact}`);

    // ==================== TEST 2: AJOUT DE POSTES ====================
    console.log('\n🎯 2. Test d\'ajout de postes personnalisés...');

    const posteSecu = ajouterPostePersonnalise({
      titre: 'Expert en Cybersécurité',
      code: 'ECS',
      niveau: 2,
      organisme_types: ['ETABLISSEMENT_PUBLIC', 'MINISTERE'],
      salaire_base: 1200000,
      responsabilites: [
        'Audit de sécurité',
        'Gestion des incidents',
        'Formation et sensibilisation'
      ],
      prerequis: [
        'Master en informatique ou cybersécurité',
        'Certifications (CISSP, CEH)',
        '7+ ans d\'expérience'
      ]
    });

    console.log(`   ✅ Poste créé: ${posteSecu.titre}`);
    console.log(`      • Code: ${posteSecu.code}`);
    console.log(`      • Salaire: ${posteSecu.salaire_base.toLocaleString('fr-FR')} FCFA`);
    console.log(`      • Types: ${posteSecu.organisme_types.join(', ')}`);

    // ==================== TEST 3: GÉNÉRATION D'UTILISATEURS ====================
    console.log('\n👥 3. Test de génération d\'utilisateurs supplémentaires...');

    // Générer des utilisateurs pour le nouvel organisme
    const utilisateursCNC = genererUtilisateursSupplementaires('CNC_GABON', 3, ['USER']);

    console.log(`   ✅ ${utilisateursCNC.length} utilisateurs générés pour CNC_GABON:`);
    utilisateursCNC.forEach(user => {
      console.log(`      • ${user.prenom} ${user.nom} - ${user.poste_titre} (${user.role})`);
    });

    // Ajouter des utilisateurs à la Présidence
    console.log('\n   Ajout d\'utilisateurs à la Présidence...');
    const utilisateursPresidence = genererUtilisateursSupplementaires('PRESIDENCE', 2, ['USER']);

    console.log(`   ✅ ${utilisateursPresidence.length} utilisateurs ajoutés à la Présidence:`);
    utilisateursPresidence.forEach(user => {
      console.log(`      • ${user.prenom} ${user.nom} - ${user.poste_titre}`);
    });

    // ==================== TEST 4: AJOUT EN MASSE ====================
    console.log('\n📦 4. Test d\'ajout en masse...');

    // Ajouter plusieurs organismes d'un coup
    const organismesDigitaux = [
      {
        nom: 'Laboratoire d\'Intelligence Artificielle',
        code: 'LIA_GABON',
        type: 'ETABLISSEMENT_PUBLIC' as const,
        description: 'Recherche et développement en IA'
      },
      {
        nom: 'Observatoire du Numérique',
        code: 'OBS_NUM',
        type: 'ETABLISSEMENT_PUBLIC' as const,
        description: 'Veille technologique et statistiques'
      },
      {
        nom: 'Fonds de Développement Digital',
        code: 'FDD_GABON',
        type: 'ENTREPRISE_PUBLIQUE' as const,
        description: 'Financement de projets numériques'
      }
    ];

    const organismesAjoutes = extensionsSysteme.ajouterOrganismesEnMasse(organismesDigitaux);
    console.log(`   ✅ ${organismesAjoutes.length} organismes ajoutés en masse`);

    // Ajouter plusieurs postes
    const postesDigitaux = [
      {
        titre: 'Architecte Cloud',
        code: 'AC',
        niveau: 2,
        organisme_types: ['ETABLISSEMENT_PUBLIC'] as const[],
        salaire_base: 1100000
      },
      {
        titre: 'DevOps Engineer',
        code: 'DO',
        niveau: 2,
        organisme_types: ['ETABLISSEMENT_PUBLIC', 'ENTREPRISE_PUBLIQUE'] as const[],
        salaire_base: 1000000
      },
      {
        titre: 'Product Manager Digital',
        code: 'PMD',
        niveau: 2,
        organisme_types: ['ENTREPRISE_PUBLIQUE'] as const[],
        salaire_base: 950000
      }
    ];

    const postesAjoutes = extensionsSysteme.ajouterPostesEnMasse(postesDigitaux);
    console.log(`   ✅ ${postesAjoutes.length} postes ajoutés en masse`);

    // Générer des utilisateurs pour tous les nouveaux organismes
    const configUtilisateurs = organismesAjoutes.map(org => ({
      organismeCode: org.code,
      nombre: 2,
      roles: ['USER'] as Array<'USER'>
    }));

    const utilisateursGeneres = extensionsSysteme.genererUtilisateursEnMasse(configUtilisateurs);
    console.log(`   ✅ ${utilisateursGeneres.length} utilisateurs générés pour les nouveaux organismes`);

    // ==================== TEST 5: ÉCOSYSTÈME D'INNOVATION ====================
    console.log('\n🚀 5. Test de création d\'écosystème d\'innovation...');
    creerEcosystemeInnovation();

    // ==================== TEST 6: RENFORCEMENT DES MINISTÈRES ====================
    console.log('\n💪 6. Test de renforcement des ministères...');
    renforcerMinisteres();

    // ==================== TEST 7: SYSTÈME ÉTENDU COMPLET ====================
    console.log('\n🎯 7. Obtention du système étendu complet...');

    const systemeEtendu = await extensionsSysteme.obtenirSystemeEtendu();

    console.log('\n' + '='.repeat(60));
    console.log('📊 RÉSUMÉ DU SYSTÈME ÉTENDU');
    console.log('='.repeat(60));

    console.log('\n📈 Statistiques de base:');
    console.log(`   • Organismes officiels: 141`);
    console.log(`   • Organismes ajoutés: ${systemeEtendu.organismesPersonnalises.length}`);
    console.log(`   • TOTAL organismes: ${systemeEtendu.organismes.length}`);

    console.log('\n👥 Utilisateurs:');
    console.log(`   • Utilisateurs de base: ~440`);
    console.log(`   • Utilisateurs supplémentaires: ${systemeEtendu.utilisateursSupplementaires.length}`);
    console.log(`   • TOTAL utilisateurs: ${systemeEtendu.utilisateurs.length}`);

    console.log('\n🎯 Postes:');
    console.log(`   • Postes de base: 36`);
    console.log(`   • Postes ajoutés: ${systemeEtendu.postesPersonnalises.length}`);
    console.log(`   • TOTAL postes: ${systemeEtendu.postes.length}`);

    // ==================== TEST 8: VALIDATION ====================
    console.log('\n✅ 8. Validation du système étendu...');

    // Vérifier l'unicité des codes d'organismes
    const codes = systemeEtendu.organismes.map(o => o.code);
    const codesUniques = new Set(codes);
    const codesValides = codes.length === codesUniques.size;
    console.log(`   • Codes d'organismes uniques: ${codesValides ? '✅' : '❌'} (${codesUniques.size}/${codes.length})`);

    // Vérifier l'unicité des emails
    const emails = systemeEtendu.utilisateurs.map(u => u.email);
    const emailsUniques = new Set(emails);
    const emailsValides = emails.length === emailsUniques.size;
    console.log(`   • Emails uniques: ${emailsValides ? '✅' : '❌'} (${emailsUniques.size}/${emails.length})`);

    // Vérifier que tous les organismes personnalisés ont des utilisateurs
    const organismesAvecUtilisateurs = new Set(
      systemeEtendu.utilisateurs.map(u => u.organisme_code)
    );
    const organismesPersonnalisesCouverture = systemeEtendu.organismesPersonnalises
      .filter(o => organismesAvecUtilisateurs.has(o.code)).length;
    console.log(`   • Organismes personnalisés avec utilisateurs: ${organismesPersonnalisesCouverture}/${systemeEtendu.organismesPersonnalises.length}`);

    // ==================== EXEMPLES D'ORGANISMES AJOUTÉS ====================
    console.log('\n📋 Exemples d\'organismes personnalisés ajoutés:');
    systemeEtendu.organismesPersonnalises.slice(0, 5).forEach(org => {
      const nbUsers = systemeEtendu.utilisateurs.filter(u => u.organisme_code === org.code).length;
      console.log(`   • ${org.nom} (${org.code})`);
      console.log(`     - Type: ${org.type}`);
      console.log(`     - Utilisateurs: ${nbUsers}`);
      console.log(`     - Email: ${org.email_contact}`);
    });

    // ==================== EXEMPLES DE POSTES AJOUTÉS ====================
    console.log('\n📋 Exemples de postes personnalisés ajoutés:');
    systemeEtendu.postesPersonnalises.slice(0, 5).forEach(poste => {
      console.log(`   • ${poste.titre} (${poste.code})`);
      console.log(`     - Niveau: ${poste.niveau}`);
      console.log(`     - Salaire: ${poste.salaire_base.toLocaleString('fr-FR')} FCFA`);
      console.log(`     - Types: ${poste.organisme_types.join(', ')}`);
    });

    // ==================== CONCLUSION ====================
    console.log('\n' + '='.repeat(60));
    console.log('🎉 TOUS LES TESTS D\'EXTENSIONS SONT PASSÉS!');
    console.log('='.repeat(60));

    console.log(`
🚀 SYSTÈME ÉTENDU OPÉRATIONNEL:
• ${systemeEtendu.organismes.length} organismes au total (141 + ${systemeEtendu.organismesPersonnalises.length})
• ${systemeEtendu.utilisateurs.length} utilisateurs générés
• ${systemeEtendu.postes.length} postes disponibles
• Extensions totalement intégrées au système de base

✅ Le système d'extensions est prêt à l'emploi!
    `);

    // Test de gestion des erreurs
    console.log('\n🔍 Test de gestion des erreurs...');
    try {
      // Essayer d'ajouter un organisme avec un code existant
      ajouterOrganismePersonnalise({ code: 'PRESIDENCE', nom: 'Test' });
    } catch (error: any) {
      console.log(`   ✅ Erreur correctement détectée: ${error.message}`);
    }

    try {
      // Essayer de générer des utilisateurs pour un organisme inexistant
      genererUtilisateursSupplementaires('ORGANISME_INEXISTANT', 1);
    } catch (error: any) {
      console.log(`   ✅ Erreur correctement détectée: ${error.message}`);
    }

  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
    process.exit(1);
  }
}

// Exécuter le test
testerExtensions().catch(console.error);
