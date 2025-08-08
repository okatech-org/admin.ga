#!/usr/bin/env node

/**
 * Script d'aide pour l'installation du logo ADMINISTRATION.GA
 *
 * Usage:
 * 1. Placer l'image du logo dans public/images/logo-administration-ga.png
 * 2. Exécuter: node scripts/setup-logo.js
 */

const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, '..', 'public', 'images');
const LOGO_PATH = path.join(PUBLIC_DIR, 'logo-administration-ga.png');

console.log('🎨 Configuration du logo ADMINISTRATION.GA\n');

// Vérifier que le dossier public/images existe
if (!fs.existsSync(PUBLIC_DIR)) {
  console.log('📁 Création du dossier public/images...');
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  console.log('✅ Dossier créé avec succès\n');
}

// Vérifier si le logo existe
if (fs.existsSync(LOGO_PATH)) {
  const stats = fs.statSync(LOGO_PATH);
  console.log('✅ Logo trouvé !');
  console.log(`📊 Taille: ${Math.round(stats.size / 1024)} KB`);
  console.log(`📅 Modifié: ${stats.mtime.toLocaleDateString('fr-FR')}\n`);

  console.log('🚀 Le logo est prêt à être utilisé dans l\'application !');
  console.log('🔗 Chemin d\'accès: /images/logo-administration-ga.png');

} else {
  console.log('❌ Logo non trouvé !');
  console.log(`📍 Veuillez placer l'image à: ${LOGO_PATH}`);
  console.log('\n📋 Instructions:');
  console.log('1. Sauvegardez l\'image fournie sous le nom: logo-administration-ga.png');
  console.log('2. Placez-la dans: public/images/');
  console.log('3. Relancez ce script pour vérifier\n');

  console.log('💡 Formats recommandés:');
  console.log('- PNG avec transparence');
  console.log('- Résolution: 512x512px minimum');
  console.log('- Taille optimisée pour le web');
}

console.log('\n🎯 Usage dans le code:');
console.log('// Utiliser le logo PNG');
console.log('import { LogoPNG } from "@/components/ui/logo-png";');
console.log('<LogoPNG width={32} height={32} />');
console.log('');
console.log('// Ou utiliser avec le composant existant');
console.log('import { LogoAdministrationGA } from "@/components/ui/logo-administration-ga";');
console.log('<LogoAdministrationGA usePNG={true} width={32} height={32} />');
