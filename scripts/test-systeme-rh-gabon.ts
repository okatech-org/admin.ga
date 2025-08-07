#!/usr/bin/env bun

/**
 * TEST DU SYSTÈME RH GABONAIS
 * Teste la nouvelle logique administrative :
 * - Comptes = Postes occupés (Poste + Titulaire)
 * - Postes vacants = Offres d'emploi
 * - Fonctionnaires sans poste = En attente d'affectation
 */

import {
  initialiserSystemeRH,
  genererRapportRH,
  rechercherPostesVacants,
  proposerAffectations
} from '../lib/data/systeme-rh-gabon';

async function testerSystemeRH() {
  console.log('\n' + '='.repeat(80));
  console.log('🏛️ TEST DU SYSTÈME RH - ADMINISTRATION PUBLIQUE GABONAISE');
  console.log('='.repeat(80) + '\n');

  try {
    // 1. Initialiser le système RH
    console.log('📋 1. Initialisation du système RH...\n');
    const systeme = await initialiserSystemeRH();

    console.log('\n' + '='.repeat(60));
    console.log('📊 RÉSULTATS DE L\'INITIALISATION');
    console.log('='.repeat(60));

    // 2. Afficher les statistiques principales
    console.log('\n🏢 ORGANISMES:');
    console.log(`   • Total: ${systeme.statistiques.total_organismes} organismes officiels`);
    console.log(`   • Organismes critiques (>50% postes vacants): ${systeme.statistiques.organismes_critiques.length}`);

    console.log('\n📋 POSTES:');
    console.log(`   • Total postes créés: ${systeme.statistiques.total_postes}`);
    console.log(`   • Postes occupés: ${systeme.statistiques.postes_occupes} (${systeme.statistiques.taux_occupation}%)`);
    console.log(`   • Postes vacants (offres d'emploi): ${systeme.statistiques.postes_vacants}`);

    console.log('\n👥 FONCTIONNAIRES:');
    console.log(`   • Total fonctionnaires: ${systeme.statistiques.total_fonctionnaires}`);
    console.log(`   • En poste (avec affectation): ${systeme.statistiques.fonctionnaires_en_poste}`);
    console.log(`   • En attente d'affectation: ${systeme.statistiques.fonctionnaires_en_attente}`);

    console.log('\n🔐 COMPTES ACTIFS:');
    console.log(`   • Total comptes créés: ${systeme.comptes_actifs.length}`);
    console.log(`   • Répartition par rôle:`);
    Object.entries(systeme.statistiques.repartition_roles).forEach(([role, count]) => {
      console.log(`      - ${role}: ${count}`);
    });

    console.log('\n📊 RÉPARTITION PAR GRADE:');
    Object.entries(systeme.statistiques.repartition_grades).forEach(([grade, count]) => {
      console.log(`   • Grade ${grade}: ${count} fonctionnaires`);
    });

    // 3. Analyser les besoins de recrutement
    console.log('\n🎯 TOP 5 BESOINS DE RECRUTEMENT:');
    systeme.statistiques.besoins_recrutement.slice(0, 5).forEach((besoin, index) => {
      const emoji = besoin.priorite === 'HAUTE' ? '🔴' : besoin.priorite === 'MOYENNE' ? '🟡' : '🟢';
      console.log(`   ${index + 1}. ${emoji} ${besoin.type_poste}: ${besoin.nombre} postes vacants`);
    });

    // 4. Exemples de recherche de postes vacants
    console.log('\n' + '='.repeat(60));
    console.log('🔍 EXEMPLES DE RECHERCHE DE POSTES VACANTS');
    console.log('='.repeat(60));

    // Rechercher des postes de niveau 1 (Direction)
    const postesDirection = rechercherPostesVacants(systeme, { niveau: 1 });
    console.log(`\n📌 Postes de direction vacants: ${postesDirection.length}`);
    if (postesDirection.length > 0) {
      console.log('   Exemples:');
      postesDirection.slice(0, 3).forEach(p => {
        console.log(`   • ${p.poste_titre} - ${p.organisme_code} (Salaire: ${p.salaire_base || 'Non défini'} FCFA)`);
      });
    }

    // Rechercher des postes avec salaire > 500000
    const postesBienPayes = rechercherPostesVacants(systeme, { salaire_min: 500000 });
    console.log(`\n💰 Postes avec salaire > 500.000 FCFA: ${postesBienPayes.length}`);

    // 5. Propositions d'affectation
    console.log('\n' + '='.repeat(60));
    console.log('📝 PROPOSITIONS D\'AFFECTATION');
    console.log('='.repeat(60));

    const propositions = proposerAffectations(systeme);
    console.log(`\n✅ ${propositions.length} fonctionnaires ont des postes compatibles disponibles`);

    // Afficher les 5 premières propositions
    propositions.slice(0, 5).forEach((prop, index) => {
      const fonct = prop.fonctionnaire;
      console.log(`\n${index + 1}. ${fonct.prenom} ${fonct.nom} (${fonct.matricule})`);
      console.log(`   Grade: ${fonct.grade} | Ancienneté: ${fonct.anciennete_annees} ans`);
      console.log(`   Postes proposés: ${prop.postes_proposes.length}`);
      if (prop.postes_proposes.length > 0) {
        const premier = prop.postes_proposes[0];
        console.log(`   → ${premier.poste_titre} à ${premier.organisme_code}`);
      }
    });

    // 6. Exemples de comptes actifs
    console.log('\n' + '='.repeat(60));
    console.log('👤 EXEMPLES DE COMPTES ACTIFS');
    console.log('='.repeat(60));

    const exemplesComptes = systeme.comptes_actifs.slice(0, 5);
    exemplesComptes.forEach((compte, index) => {
      console.log(`\n${index + 1}. ${compte.fonctionnaire_nom_complet}`);
      console.log(`   • Poste: ${compte.poste_titre}`);
      console.log(`   • Organisme: ${compte.organisme_nom}`);
      console.log(`   • Rôle système: ${compte.role_systeme}`);
      console.log(`   • Statut: ${compte.statut}`);
    });

    // 7. Générer le rapport RH complet
    console.log('\n' + '='.repeat(60));
    console.log('📈 RAPPORT RH SYNTHÉTIQUE');
    console.log('='.repeat(60) + '\n');

    const rapport = genererRapportRH(systeme);
    console.log(JSON.stringify(rapport, null, 2));

    // 8. Analyse finale
    console.log('\n' + '='.repeat(60));
    console.log('✅ VALIDATION DU SYSTÈME');
    console.log('='.repeat(60));

    const validations = [
      {
        test: 'Tous les organismes ont des postes',
        ok: systeme.postes_par_organisme.size === systeme.organismes.length
      },
      {
        test: 'Les comptes correspondent aux postes occupés',
        ok: systeme.comptes_actifs.length === systeme.postes_occupes.length
      },
      {
        test: 'Les fonctionnaires sont soit en poste, soit en attente',
        ok: (systeme.fonctionnaires_en_poste.length + systeme.fonctionnaires_en_attente.length) === systeme.fonctionnaires.length
      },
      {
        test: 'Il y a des postes vacants (offres d\'emploi)',
        ok: systeme.postes_vacants.length > 0
      },
      {
        test: 'Il y a des fonctionnaires en attente',
        ok: systeme.fonctionnaires_en_attente.length > 0
      },
      {
        test: 'Le taux d\'occupation est réaliste (60-80%)',
        ok: systeme.statistiques.taux_occupation >= 60 && systeme.statistiques.taux_occupation <= 80
      }
    ];

    validations.forEach(v => {
      console.log(`   ${v.ok ? '✅' : '❌'} ${v.test}`);
    });

    const testsReussis = validations.filter(v => v.ok).length;
    console.log(`\n🎯 Score de validation: ${testsReussis}/${validations.length}`);

    if (testsReussis === validations.length) {
      console.log('\n🎉 LE SYSTÈME RH EST PARFAITEMENT FONCTIONNEL!');
      console.log('\n✨ La logique administrative gabonaise est correctement implémentée:');
      console.log('   • Comptes = Postes occupés (association Poste + Titulaire)');
      console.log('   • Postes vacants = Offres d\'emploi disponibles');
      console.log('   • Fonctionnaires sans poste = En attente d\'affectation');
    }

    // 9. Statistiques détaillées pour debug
    console.log('\n' + '='.repeat(60));
    console.log('🔧 DÉTAILS TECHNIQUES');
    console.log('='.repeat(60));

    // Calculer le ratio par organisme
    const postesParOrganismeMoyenne = Math.round(systeme.statistiques.total_postes / systeme.statistiques.total_organismes * 10) / 10;
    console.log(`\n📊 Moyennes:`);
    console.log(`   • Postes par organisme: ${postesParOrganismeMoyenne}`);
    console.log(`   • Fonctionnaires par poste occupé: ${Math.round(systeme.statistiques.fonctionnaires_en_poste / systeme.statistiques.postes_occupes * 100) / 100}`);

    // Afficher quelques organismes critiques
    if (systeme.statistiques.organismes_critiques.length > 0) {
      console.log(`\n⚠️ Organismes critiques (>50% postes vacants):`);
      systeme.statistiques.organismes_critiques.slice(0, 5).forEach(code => {
        const org = systeme.organismes.find(o => o.code === code);
        const postes = systeme.postes_par_organisme.get(code) || [];
        const vacants = postes.filter(p => p.statut === 'VACANT').length;
        console.log(`   • ${org?.nom} (${code}): ${vacants}/${postes.length} postes vacants`);
      });
    }

  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
    process.exit(1);
  }
}

// Lancer le test
console.log('🚀 Démarrage du test du système RH gabonais...');
testerSystemeRH().catch(console.error);
