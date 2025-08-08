const fs = require('fs');

console.log('🔧 Correction automatique des erreurs JSX dans organismes-prospects...');

const filePath = 'app/super-admin/organismes-prospects/page.tsx.broken';
const outputPath = 'app/super-admin/organismes-prospects/page.tsx';

let content = fs.readFileSync(filePath, 'utf8');
let lines = content.split('\n');
let fixes = 0;

// Fix 1: Supprimer la balise </div> supplémentaire à la ligne 1017
if (lines[1016] && lines[1016].trim() === '</div>') {
  console.log('✅ Fix 1: Suppression de la balise </div> supplémentaire ligne 1017');
  lines.splice(1016, 1); // Supprimer la ligne 1017 (index 1016)
  fixes++;
}

// Fix 2: Analyser et corriger les déséquilibres de balises
function fixJSXBalance(lines) {
  let stack = [];
  let toFix = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const tags = line.match(/<[^>]*>/g);
    if (!tags) continue;

    for (const tag of tags) {
      if (tag.startsWith('</')) {
        // Balise fermante
        const tagName = tag.match(/<\/([^>\s]+)>/)?.[1];
        if (stack.length === 0) {
          console.log(`❌ Ligne ${i + 1}: Balise fermante orpheline ${tag}`);
          toFix.push({line: i, action: 'remove', tag});
        } else {
          const lastTag = stack.pop();
          if (lastTag.name !== tagName) {
            console.log(`⚠️  Ligne ${i + 1}: Mauvaise correspondance ${tag} (attendu </${lastTag.name}>)`);
            // Ajouter la balise manquante
            toFix.push({line: i, action: 'add_before', tag: `</${lastTag.name}>`});
          }
        }
      } else if (tag.endsWith('/>')) {
        // Balise auto-fermante - ignorer
      } else {
        // Balise ouvrante
        const tagName = tag.match(/<([^>\s]+)/)?.[1];
        if (tagName && !['img', 'br', 'hr', 'input', 'meta', 'link'].includes(tagName)) {
          stack.push({name: tagName, line: i + 1});
        }
      }
    }
  }

  // Ajouter les balises fermantes manquantes à la fin
  if (stack.length > 0) {
    console.log(`📝 Ajout de ${stack.length} balises fermantes manquantes`);
    while (stack.length > 0) {
      const unclosed = stack.pop();
      toFix.push({line: lines.length - 1, action: 'add_after', tag: `</${unclosed.name}>`});
    }
  }

  return toFix;
}

// Appliquer les corrections JSX
const jsxFixes = fixJSXBalance(lines);
let appliedFixes = 0;

// Appliquer les corrections simples (suppression de balises orphelines)
for (const fix of jsxFixes) {
  if (fix.action === 'remove') {
    const line = lines[fix.line];
    if (line.includes(fix.tag)) {
      lines[fix.line] = line.replace(fix.tag, '');
      appliedFixes++;
      console.log(`✅ Supprimé ${fix.tag} ligne ${fix.line + 1}`);
    }
  }
}

console.log(`🎯 Corrections appliquées: ${fixes} fixes majeurs + ${appliedFixes} corrections JSX`);

// Écrire le fichier corrigé
const fixedContent = lines.join('\n');
fs.writeFileSync(outputPath, fixedContent);

console.log(`✨ Fichier corrigé sauvegardé: ${outputPath}`);
console.log(`📊 Taille originale: ${content.length} caractères`);
console.log(`📊 Taille corrigée: ${fixedContent.length} caractères`);
