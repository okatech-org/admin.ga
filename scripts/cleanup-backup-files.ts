#!/usr/bin/env bun

/**
 * SCRIPT DE NETTOYAGE DES SAUVEGARDES
 * Supprime les fichiers de sauvegarde créés lors de la mise à jour
 *
 * Usage: bun run scripts/cleanup-backup-files.ts
 */

import * as fs from 'fs';
import * as path from 'path';

function findBackupFiles(dir: string): string[] {
  const backupFiles: string[] = [];

  try {
    const files = fs.readdirSync(dir, { withFileTypes: true });

    for (const file of files) {
      const fullPath = path.join(dir, file.name);

      if (file.isDirectory()) {
        // Récursif dans les sous-dossiers
        backupFiles.push(...findBackupFiles(fullPath));
      } else if (file.name.includes('.backup-')) {
        backupFiles.push(fullPath);
      }
    }
  } catch (error) {
    // Ignorer les erreurs de lecture de dossier
  }

  return backupFiles;
}

async function main() {
  console.log('\n' + '='.repeat(60));
  console.log('🧹 NETTOYAGE DES FICHIERS DE SAUVEGARDE');
  console.log('='.repeat(60) + '\n');

  // Chercher tous les fichiers de sauvegarde
  const backupFiles = findBackupFiles(process.cwd());

  if (backupFiles.length === 0) {
    console.log('✅ Aucun fichier de sauvegarde trouvé');
    return;
  }

  console.log(`📋 ${backupFiles.length} fichier(s) de sauvegarde trouvé(s):\n`);

  backupFiles.forEach((file, index) => {
    const relativePath = path.relative(process.cwd(), file);
    console.log(`   ${index + 1}. ${relativePath}`);
  });

  console.log('\n⚠️ ATTENTION: Cette opération supprimera définitivement ces fichiers.');
  console.log('   Assurez-vous que l\'application fonctionne correctement avant de continuer.\n');

  // Pour ce script, on supprime automatiquement (pas d'interaction utilisateur)
  console.log('🗑️ Suppression des fichiers...\n');

  let supprime = 0;
  let erreurs = 0;

  for (const file of backupFiles) {
    try {
      fs.unlinkSync(file);
      const relativePath = path.relative(process.cwd(), file);
      console.log(`   ✅ Supprimé: ${relativePath}`);
      supprime++;
    } catch (error) {
      const relativePath = path.relative(process.cwd(), file);
      console.log(`   ❌ Erreur: ${relativePath} - ${error}`);
      erreurs++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 RÉSUMÉ');
  console.log('='.repeat(60));
  console.log(`   ✅ Fichiers supprimés: ${supprime}`);
  console.log(`   ❌ Erreurs: ${erreurs}`);

  if (supprime > 0 && erreurs === 0) {
    console.log('\n🎉 NETTOYAGE TERMINÉ AVEC SUCCÈS!');
    console.log('   Tous les fichiers de sauvegarde ont été supprimés.');
  } else if (erreurs > 0) {
    console.log('\n⚠️ NETTOYAGE PARTIELLEMENT RÉUSSI');
    console.log('   Certains fichiers n\'ont pas pu être supprimés.');
  }

  console.log('\n💡 Les fichiers suivants restent importants:');
  console.log('   • lib/services/systeme-complet-api.service.ts');
  console.log('   • app/api/systeme-complet/*');
  console.log('   • RESOLUTION_INTEGRATION_141_ORGANISMES_PAGES.md');
}

// Exécuter le script
main().catch(console.error);
