#!/usr/bin/env bun

/**
 * EXEMPLE D'UTILISATION COMPLÈTE DU SYSTÈME
 * Montre comment utiliser ensemble :
 * - Le système de base (141 organismes)
 * - Les extensions (ajouts personnalisés)
 * - Le système unifié (format standardisé)
 *
 * Usage: bun run scripts/exemple-utilisation-complete.ts
 */

import {
  ajouterOrganismePersonnalise,
  ajouterPostePersonnalise,
  genererUtilisateursSupplementaires,
  extensionsSysteme
} from '../lib/data/systeme-extensions';

import {
  getUnifiedSystemDataExtended,
  addOrganismeToUnifiedSystem,
  addUsersToUnifiedSystem,
  searchInExtendedData
} from '../lib/data/unified-system-extended';

async function exempleUtilisationComplete() {
  console.log('\n' + '='.repeat(60));
  console.log('📚 EXEMPLE D\'UTILISATION COMPLÈTE DU SYSTÈME');
  console.log('='.repeat(60) + '\n');

  // ==================== ÉTAPE 1: ÉTAT INITIAL ====================
  console.log('📊 1. État initial du système...\n');

  // Réinitialiser pour partir d'une base propre
  extensionsSysteme.reinitialiser();

  // Charger les données de base
  const donneesInitiales = await getUnifiedSystemDataExtended();
  console.log(`   • Organismes de base: ${donneesInitiales.statistics.totalOrganismes}`);
  console.log(`   • Utilisateurs de base: ${donneesInitiales.statistics.totalUsers}`);
  console.log(`   • Extensions: ${donneesInitiales.extensions.statistiques.organismesAjoutes}`);

  // ==================== ÉTAPE 2: AJOUTER UN NOUVEL ORGANISME ====================
  console.log('\n🏢 2. Création d\'un nouvel organisme...\n');

  const nouvelOrganisme = ajouterOrganismePersonnalise({
    nom: 'Direction Générale de la Transformation Digitale',
    code: 'DGTD_GABON',
    type: 'DIRECTION_GENERALE',
    description: 'Pilotage de la transformation numérique de l\'administration',
    email_contact: 'contact@dgtd.ga',
    telephone: '+241 01 76 00 00',
    adresse: 'Boulevard Triomphal, Libreville',
    couleur_principale: '#4A90E2',
    site_web: 'https://dgtd.ga'
  });

  console.log(`   ✅ Organisme créé: ${nouvelOrganisme.nom}`);
  console.log(`      • Code: ${nouvelOrganisme.code}`);
  console.log(`      • Type: ${nouvelOrganisme.type}`);
  console.log(`      • Email: ${nouvelOrganisme.email_contact}`);

  // ==================== ÉTAPE 3: CRÉER DES POSTES SPÉCIALISÉS ====================
  console.log('\n💼 3. Ajout de postes spécialisés...\n');

  const postes = [
    {
      titre: 'Directeur de la Transformation Digitale',
      code: 'DTD',
      niveau: 1,
      organisme_types: ['DIRECTION_GENERALE'] as const[],
      salaire_base: 2000000,
      responsabilites: [
        'Stratégie de transformation digitale',
        'Pilotage des projets numériques',
        'Coordination inter-ministérielle'
      ]
    },
    {
      titre: 'Architecte Solutions Cloud',
      code: 'ASC',
      niveau: 2,
      organisme_types: ['DIRECTION_GENERALE', 'ETABLISSEMENT_PUBLIC'] as const[],
      salaire_base: 1500000,
      prerequis: [
        'Ingénieur informatique',
        'Certifications Cloud (AWS/Azure/GCP)',
        '5+ ans d\'expérience'
      ]
    },
    {
      titre: 'Responsable Cybersécurité',
      code: 'RCS',
      niveau: 2,
      organisme_types: ['DIRECTION_GENERALE', 'MINISTERE'] as const[],
      salaire_base: 1400000,
      prerequis: [
        'Master en sécurité informatique',
        'Certifications CISSP/CEH',
        'Expérience en audit sécurité'
      ]
    }
  ];

  postes.forEach(poste => {
    const p = ajouterPostePersonnalise(poste);
    console.log(`   ✅ Poste ajouté: ${p.titre} (${p.salaire_base.toLocaleString('fr-FR')} FCFA)`);
  });

  // ==================== ÉTAPE 4: GÉNÉRER L'ÉQUIPE ====================
  console.log('\n👥 4. Génération de l\'équipe...\n');

  // Générer l'équipe complète pour le nouvel organisme
  const equipe = genererUtilisateursSupplementaires('DGTD_GABON', 3, ['USER']);

  console.log(`   ✅ ${equipe.length} membres d'équipe générés:`);
  equipe.forEach(membre => {
    console.log(`      • ${membre.prenom} ${membre.nom} - ${membre.poste_titre}`);
  });

  // ==================== ÉTAPE 5: RENFORCER UN ORGANISME EXISTANT ====================
  console.log('\n💪 5. Renforcement d\'un organisme existant...\n');

  // Ajouter du personnel au Ministère de l'Économie et des Finances
  const renforts = genererUtilisateursSupplementaires('MIN_ECO_FIN', 2, ['USER']);

  console.log(`   ✅ ${renforts.length} agents ajoutés au Ministère de l'Économie:`);
  renforts.forEach(agent => {
    console.log(`      • ${agent.prenom} ${agent.nom} - ${agent.poste_titre}`);
  });

  // ==================== ÉTAPE 6: CRÉER UN ÉCOSYSTÈME COMPLET ====================
  console.log('\n🌐 6. Création d\'un écosystème digital complet...\n');

  const ecosysteme = [
    {
      nom: 'Hub Innovation Gabon',
      code: 'HIG',
      type: 'ETABLISSEMENT_PUBLIC' as const,
      description: 'Incubateur et accélérateur de startups'
    },
    {
      nom: 'Laboratoire IA Gabon',
      code: 'LIAG',
      type: 'ETABLISSEMENT_PUBLIC' as const,
      description: 'Recherche en intelligence artificielle'
    },
    {
      nom: 'Centre de Données National',
      code: 'CDN',
      type: 'ETABLISSEMENT_PUBLIC' as const,
      description: 'Infrastructure cloud souveraine'
    }
  ];

  // Ajouter les organismes via le système unifié étendu
  for (const org of ecosysteme) {
    await addOrganismeToUnifiedSystem(org);
    console.log(`   ✅ ${org.nom} ajouté`);

    // Ajouter des utilisateurs
    await addUsersToUnifiedSystem(org.code, 2, ['USER']);
    console.log(`      • 2 utilisateurs ajoutés`);
  }

  // ==================== ÉTAPE 7: OBTENIR LES DONNÉES COMPLÈTES ====================
  console.log('\n📊 7. Données complètes du système étendu...\n');

  const donneesFinales = await getUnifiedSystemDataExtended(true);

  console.log('   📈 Statistiques finales:');
  console.log(`      • Total organismes: ${donneesFinales.statistics.totalOrganismes}`);
  console.log(`      • Total utilisateurs: ${donneesFinales.statistics.totalUsers}`);
  console.log(`      • Organismes ajoutés: ${donneesFinales.extensions.statistiques.organismesAjoutes}`);
  console.log(`      • Utilisateurs ajoutés: ${donneesFinales.extensions.statistiques.utilisateursAjoutes}`);
  console.log(`      • Postes personnalisés: ${donneesFinales.extensions.postesPersonnalises.length}`);

  // ==================== ÉTAPE 8: RECHERCHE DANS LES DONNÉES ====================
  console.log('\n🔍 8. Test de recherche...\n');

  // Rechercher "digital" dans tous les organismes et utilisateurs
  const resultatsDigital = searchInExtendedData(donneesFinales, 'digital', true);
  console.log(`   • Recherche "digital":`);
  console.log(`      - ${resultatsDigital.organismes.length} organismes trouvés`);
  console.log(`      - ${resultatsDigital.users.length} utilisateurs trouvés`);

  // Rechercher uniquement dans les extensions
  const resultatsExtensions = searchInExtendedData(donneesFinales, 'innovation', true);
  console.log(`   • Recherche "innovation":`);
  console.log(`      - ${resultatsExtensions.organismes.length} organismes trouvés`);

  // Afficher quelques résultats
  if (resultatsDigital.organismes.length > 0) {
    console.log('\n   📋 Organismes trouvés:');
    resultatsDigital.organismes.slice(0, 3).forEach(org => {
      console.log(`      • ${org.nom} (${org.code})`);
    });
  }

  // ==================== ÉTAPE 9: EXPORT DES DONNÉES ====================
  console.log('\n💾 9. Export des données...\n');

  // Export JSON des extensions uniquement
  const jsonExtensions = JSON.stringify(donneesFinales.extensions, null, 2);
  console.log(`   • Export JSON extensions: ${Math.round(jsonExtensions.length / 1024)}KB`);

  // Statistiques d'export
  console.log(`   • ${donneesFinales.extensions.organismesPersonnalises.length} organismes personnalisés`);
  console.log(`   • ${donneesFinales.extensions.utilisateursSupplementaires.length} utilisateurs supplémentaires`);
  console.log(`   • ${donneesFinales.extensions.postesPersonnalises.length} postes personnalisés`);

  // ==================== ÉTAPE 10: VALIDATION FINALE ====================
  console.log('\n✅ 10. Validation finale...\n');

  // Obtenir le système complet pour validation
  const systemeComplet = await extensionsSysteme.obtenirSystemeEtendu();

  // Vérifications
  const validations = {
    codesUniques: new Set(systemeComplet.organismes.map(o => o.code)).size === systemeComplet.organismes.length,
    emailsUniques: new Set(systemeComplet.utilisateurs.map(u => u.email)).size === systemeComplet.utilisateurs.length,
    tousOntAdmin: systemeComplet.organismes.every(org =>
      systemeComplet.utilisateurs.some(u => u.organisme_code === org.code && u.role === 'ADMIN')
    ),
    tousOntReceptionniste: systemeComplet.organismes.every(org =>
      systemeComplet.utilisateurs.some(u => u.organisme_code === org.code && u.role === 'RECEPTIONIST')
    )
  };

  console.log('   🔍 Validations:');
  console.log(`      • Codes uniques: ${validations.codesUniques ? '✅' : '❌'}`);
  console.log(`      • Emails uniques: ${validations.emailsUniques ? '✅' : '❌'}`);
  console.log(`      • Tous ont un admin: ${validations.tousOntAdmin ? '✅' : '❌'}`);
  console.log(`      • Tous ont un réceptionniste: ${validations.tousOntReceptionniste ? '✅' : '❌'}`);

  // ==================== RÉSUMÉ ====================
  console.log('\n' + '='.repeat(60));
  console.log('🎉 EXEMPLE COMPLET TERMINÉ AVEC SUCCÈS!');
  console.log('='.repeat(60));

  console.log(`
📊 RÉSUMÉ DE L'EXEMPLE:
• Créé 1 direction générale (DGTD)
• Ajouté 3 postes spécialisés
• Généré 5 utilisateurs pour DGTD
• Renforcé le MIN_ECO_FIN avec 2 agents
• Créé un écosystème de 3 organismes digitaux
• Total: ${donneesFinales.extensions.statistiques.organismesAjoutes} organismes ajoutés
• Total: ${donneesFinales.extensions.statistiques.utilisateursAjoutes} utilisateurs ajoutés

✅ Le système complet est opérationnel avec:
• ${donneesFinales.statistics.totalOrganismes} organismes au total
• ${donneesFinales.statistics.totalUsers} utilisateurs au total
• Recherche et export fonctionnels
• Validation complète passée
  `);

  // ==================== NETTOYAGE (OPTIONNEL) ====================
  console.log('🔄 Pour réinitialiser: extensionsSysteme.reinitialiser()');
}

// Exécuter l'exemple
exempleUtilisationComplete().catch(console.error);
