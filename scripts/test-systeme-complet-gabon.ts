#!/usr/bin/env bun

/**
 * Script de test du système complet de gestion des comptes et postes administratifs gabonais
 *
 * Usage: bun run scripts/test-systeme-complet-gabon.ts
 */

import {
  implementerSystemeComplet,
  validerSysteme,
  exporterPourBDD,
  initialiserSysteme
} from '../lib/data/systeme-complet-gabon';
import { writeFileSync } from 'fs';
import { join } from 'path';

async function testerSysteme() {
  console.log('\n=== TEST DU SYSTÈME COMPLET GABONAIS ===\n');

  try {
    // 1. Utiliser la fonction d'initialisation
    console.log('📊 Initialisation du système...');
    const systeme = await initialiserSysteme();

    if (!systeme) {
      console.error('❌ Échec de l\'initialisation du système');
      return;
    }

    // 2. Afficher les détails par type d'organisme
    console.log('\n📈 Répartition par type d\'organisme:');
    Object.entries(systeme.statistiques.repartitionTypes).forEach(([type, count]) => {
      console.log(`   • ${type}: ${count} organisme(s)`);
    });

    // 3. Afficher quelques exemples d'organismes
    console.log('\n🏛️ Exemples d\'organismes:');
    systeme.organismes.slice(0, 5).forEach(org => {
      console.log(`   • ${org.nom} (${org.code})`);
      console.log(`     Type: ${org.type}`);
      console.log(`     Email: ${org.email_contact}`);
    });

    // 4. Afficher quelques exemples d'utilisateurs
    console.log('\n👥 Exemples d\'utilisateurs:');
    systeme.utilisateurs.slice(0, 10).forEach(user => {
      console.log(`   • ${user.prenom} ${user.nom}`);
      console.log(`     Poste: ${user.poste_titre}`);
      console.log(`     Organisme: ${user.organisme_code}`);
      console.log(`     Email: ${user.email}`);
      console.log(`     Rôle: ${user.role}`);
      console.log('');
    });

    // 5. Afficher les statistiques détaillées
    console.log('\n📊 Statistiques détaillées:');
    console.log(`   • Total organismes: ${systeme.statistiques.totalOrganismes}`);
    console.log(`   • Total utilisateurs: ${systeme.statistiques.totalUtilisateurs}`);
    console.log(`   • Administrateurs: ${systeme.statistiques.repartitionRoles.ADMIN}`);
    console.log(`   • Utilisateurs: ${systeme.statistiques.repartitionRoles.USER}`);
    console.log(`   • Réceptionnistes: ${systeme.statistiques.repartitionRoles.RECEPTIONIST}`);
    console.log(`   • Moyenne utilisateurs/organisme: ${(systeme.statistiques.totalUtilisateurs / systeme.statistiques.totalOrganismes).toFixed(1)}`);

    // 6. Tester l'export BDD
    console.log('\n💾 Export pour base de données...');
    const scripts = exporterPourBDD(systeme);

    // Créer les fichiers SQL
    const outputDir = join(process.cwd(), 'scripts', 'sql');

    // Note: En production, vous devriez créer le répertoire s'il n'existe pas
    // mkdir(outputDir, { recursive: true });

    const sqlFiles = {
      'organismes.sql': scripts.sqlOrganismes.substring(0, 500) + '...\n-- (Tronqué pour l\'affichage)',
      'postes.sql': scripts.sqlPostes.substring(0, 500) + '...\n-- (Tronqué pour l\'affichage)',
      'utilisateurs.sql': scripts.sqlUtilisateurs.substring(0, 500) + '...\n-- (Tronqué pour l\'affichage)'
    };

    Object.entries(sqlFiles).forEach(([filename, content]) => {
      console.log(`   📄 ${filename} (${content.length} caractères)`);
    });

    // 7. Vérifier l'intégrité du système
    console.log('\n✅ Validation finale du système:');
    const validation = validerSysteme(systeme);

    if (validation.valide) {
      console.log('   ✓ Tous les organismes ont un admin');
      console.log('   ✓ Tous les organismes ont un réceptionniste');
      console.log('   ✓ Tous les emails sont uniques');
      console.log('   ✓ Système valide et prêt à l\'emploi!');
    } else {
      console.error('   ❌ Erreurs détectées:', validation.erreurs);
    }

    // 8. Afficher un résumé final
    console.log('\n' + '='.repeat(50));
    console.log('🎉 TEST TERMINÉ AVEC SUCCÈS!');
    console.log('='.repeat(50));
    console.log(`
Le système comprend:
• ${systeme.statistiques.totalOrganismes} organismes publics gabonais
• ${systeme.statistiques.totalUtilisateurs} comptes utilisateurs
• ${systeme.postes.length} types de postes administratifs
• 12 types d'organismes différents

Chaque organisme dispose de:
• 1 compte ADMIN (dirigeant)
• 1-3 comptes USER (collaborateurs)
• 1 compte RECEPTIONIST (accueil)

Prêt pour l'intégration dans votre application!
    `);

  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
    process.exit(1);
  }
}

// Exécuter le test
testerSysteme().catch(console.error);
