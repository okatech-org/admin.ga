#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Fonction pour corriger les emphases utilisées comme titres
function fixMarkdownEmphasis(content) {
  // Pattern pour détecter les lignes avec du texte en gras qui ressemblent à des titres
  // Éviter de toucher aux titres qui sont déjà bien formatés avec ###
  const patterns = [
    // Texte en gras seul sur une ligne qui finit par ! ou ✨ ou 🎉 ou ✅
    /^(\*\*)(.*[!✨🎉✅])(\*\*)$/gm,
    // Texte en gras seul sur une ligne avec des mots en majuscules
    /^(\*\*)([A-Z][A-Z\s]*[A-Z])(\*\*)$/gm,
    // Texte en gras qui commence par des émojis ou des mots clés de titre
    /^(\*\*)((?:✅|🎉|✨|🇬🇦|🎯|🏆|🔧)\s+.*)(\*\*)$/gm
  ];

  let fixedContent = content;

  patterns.forEach(pattern => {
    fixedContent = fixedContent.replace(pattern, (match, start, content, end) => {
      // Éviter de corriger si c'est déjà dans un titre markdown
      if (match.includes('###') || match.includes('##') || match.includes('#')) {
        return match;
      }
      // Convertir en titre de niveau 2
      return `## ${content}`;
    });
  });

  return fixedContent;
}

// Fonction pour traiter tous les fichiers markdown
async function processMarkdownFiles() {
  try {
    const files = glob.sync('**/*.md', {
      ignore: ['node_modules/**', '.git/**', 'dist/**', 'build/**']
    });

    let totalFixed = 0;

    for (const file of files) {
      try {
        const content = fs.readFileSync(file, 'utf8');
        const fixedContent = fixMarkdownEmphasis(content);

        if (content !== fixedContent) {
          fs.writeFileSync(file, fixedContent);
          console.log(`✅ Corrigé: ${file}`);
          totalFixed++;
        }
      } catch (error) {
        console.error(`❌ Erreur avec ${file}:`, error.message);
      }
    }

    console.log(`\n🎉 Correction terminée! ${totalFixed} fichier(s) corrigé(s)`);

  } catch (error) {
    console.error('❌ Erreur globale:', error);
    process.exit(1);
  }
}

// Exécution du script
if (require.main === module) {
  processMarkdownFiles();
}

module.exports = { fixMarkdownEmphasis };
