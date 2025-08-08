#!/usr/bin/env bun

/**
 * SCRIPT DE MISE À JOUR DES PAGES
 * Met à jour les pages pour utiliser le système complet des 141 organismes
 * au lieu de l'ancienne API base de données
 *
 * Usage: bun run scripts/update-pages-to-systeme-complet.ts
 */

import * as fs from 'fs';
import * as path from 'path';

// Liste des fichiers à mettre à jour avec leurs remplacements
const filesToUpdate = [
  {
    path: 'app/super-admin/organismes-vue-ensemble/page.tsx',
    oldEndpoint: '/api/organizations/list',
    newEndpoint: '/api/systeme-complet/organismes',
    description: 'Page Vue d\'Ensemble des Organismes'
  },
  {
    path: 'app/super-admin/fonctionnaires-attente/page.tsx',
    oldEndpoint: '/api/fonctionnaires/en-attente',
    newEndpoint: '/api/systeme-complet/fonctionnaires-attente',
    description: 'Page Fonctionnaires en Attente'
  },
  {
    path: 'app/super-admin/gestion-comptes/page.tsx',
    oldEndpoint: '/api/users/list',
    newEndpoint: '/api/systeme-complet/utilisateurs',
    description: 'Page Gestion des Comptes'
  },
  {
    path: 'app/super-admin/utilisateurs/page.tsx',
    oldEndpoint: '/api/users/list',
    newEndpoint: '/api/systeme-complet/utilisateurs',
    description: 'Page Gestion des Utilisateurs'
  }
];

async function updateFile(fileInfo: typeof filesToUpdate[0]) {
  const filePath = path.join(process.cwd(), fileInfo.path);

  // Vérifier si le fichier existe
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️ Fichier non trouvé: ${fileInfo.path}`);
    return false;
  }

  try {
    // Lire le contenu du fichier
    let content = fs.readFileSync(filePath, 'utf-8');

    // Créer une sauvegarde
    const backupPath = filePath + '.backup-' + Date.now();
    fs.writeFileSync(backupPath, content);
    console.log(`   📁 Sauvegarde créée: ${backupPath}`);

    // Remplacer l'ancien endpoint par le nouveau
    const regex = new RegExp(fileInfo.oldEndpoint.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    const replacements = (content.match(regex) || []).length;

    if (replacements > 0) {
      content = content.replace(regex, fileInfo.newEndpoint);

      // Sauvegarder le fichier modifié
      fs.writeFileSync(filePath, content);
      console.log(`   ✅ ${replacements} remplacement(s) effectué(s)`);
      return true;
    } else {
      console.log(`   ℹ️ Aucun remplacement nécessaire (endpoint déjà à jour ou non trouvé)`);
      // Supprimer la sauvegarde si aucun changement
      fs.unlinkSync(backupPath);
      return false;
    }
  } catch (error) {
    console.error(`   ❌ Erreur: ${error}`);
    return false;
  }
}

async function main() {
  console.log('\n' + '='.repeat(60));
  console.log('🔄 MISE À JOUR DES PAGES VERS LE SYSTÈME COMPLET');
  console.log('='.repeat(60) + '\n');

  console.log('📋 Pages à mettre à jour:');
  filesToUpdate.forEach(file => {
    console.log(`   • ${file.description}`);
  });

  console.log('\n🚀 Début de la mise à jour...\n');

  let updated = 0;
  let failed = 0;

  for (const fileInfo of filesToUpdate) {
    console.log(`\n📝 ${fileInfo.description}:`);
    console.log(`   Fichier: ${fileInfo.path}`);
    console.log(`   ${fileInfo.oldEndpoint} → ${fileInfo.newEndpoint}`);

    const success = await updateFile(fileInfo);
    if (success) {
      updated++;
    } else {
      failed++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 RÉSUMÉ');
  console.log('='.repeat(60));
  console.log(`   ✅ Fichiers mis à jour: ${updated}`);
  console.log(`   ⚠️ Fichiers non modifiés: ${failed}`);

  if (updated > 0) {
    console.log('\n✅ MISE À JOUR RÉUSSIE!');
    console.log('\n⚠️ IMPORTANT:');
    console.log('   1. Les pages utilisent maintenant le système complet des 141 organismes');
    console.log('   2. Les données sont chargées depuis la mémoire, pas de la base de données');
    console.log('   3. Redémarrez l\'application pour voir les changements');
    console.log('   4. Les sauvegardes ont été créées avec l\'extension .backup-[timestamp]');

    console.log('\n📋 PROCHAINES ÉTAPES:');
    console.log('   1. Tester les pages mises à jour');
    console.log('   2. Vérifier que les 141 organismes s\'affichent');
    console.log('   3. Supprimer les sauvegardes si tout fonctionne');
  } else {
    console.log('\n⚠️ Aucune mise à jour effectuée');
    console.log('   Les fichiers sont peut-être déjà à jour ou les endpoints n\'ont pas été trouvés');
  }

  console.log('\n💡 Pour tester les nouvelles API directement:');
  console.log('   curl http://localhost:3000/api/systeme-complet/organismes');
  console.log('   curl http://localhost:3000/api/systeme-complet/utilisateurs');
  console.log('   curl http://localhost:3000/api/systeme-complet/statistiques');
  console.log('   curl http://localhost:3000/api/systeme-complet/fonctionnaires-attente');
}

// Exécuter le script
main().catch(console.error);
