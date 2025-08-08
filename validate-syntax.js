const fs = require('fs');

console.log('🔍 Validation de la syntaxe JavaScript...');

const filePath = 'app/super-admin/organismes-prospects/page.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Supprimer temporairement le JSX pour valider uniquement la syntaxe JS
let jsContent = content
  .replace(/<[^>]*>/g, 'null') // Remplacer toutes les balises par null
  .replace(/className="[^"]*"/g, '') // Supprimer les className
  .replace(/{\/\*[^}]*\*\/}/g, '') // Supprimer les commentaires JSX
  .replace(/>\s*\{[^}]*\}\s*</g, '>null<'); // Remplacer les expressions JSX

// Essayer de parser le JavaScript
try {
  // Créer une fonction temporaire pour tester la syntaxe
  const testFunction = new Function(jsContent);
  console.log('✅ Syntaxe JavaScript valide');
} catch (error) {
  console.log('❌ Erreur de syntaxe JavaScript:', error.message);

  // Localiser approximativement l'erreur
  const lines = content.split('\n');
  const errorMatch = error.message.match(/Unexpected token.*line (\d+)/);

  if (errorMatch) {
    const lineNum = parseInt(errorMatch[1]);
    console.log(`📍 Ligne approximative: ${lineNum}`);
    if (lines[lineNum - 1]) {
      console.log(`Code: ${lines[lineNum - 1].trim()}`);
    }
  }
}

// Analyser les accolades et parenthèses
function checkBrackets(content) {
  const brackets = [];
  let lineNum = 1;

  for (let i = 0; i < content.length; i++) {
    if (content[i] === '\n') lineNum++;

    if (content[i] === '{') {
      brackets.push({type: '{', line: lineNum, pos: i});
    } else if (content[i] === '}') {
      const last = brackets.pop();
      if (!last || last.type !== '{') {
        console.log(`❌ Accolade fermante orpheline ligne ${lineNum}`);
      }
    } else if (content[i] === '(') {
      brackets.push({type: '(', line: lineNum, pos: i});
    } else if (content[i] === ')') {
      const last = brackets.pop();
      if (!last || last.type !== '(') {
        console.log(`❌ Parenthèse fermante orpheline ligne ${lineNum}`);
      }
    }
  }

  if (brackets.length > 0) {
    console.log(`❌ ${brackets.length} symboles non fermés:`);
    brackets.forEach(b => {
      const lines = content.split('\n');
      console.log(`   ${b.type} ligne ${b.line}: ${lines[b.line - 1]?.trim()?.substring(0, 50)}...`);
    });
  } else {
    console.log('✅ Parenthèses et accolades équilibrées');
  }
}

checkBrackets(content);

// Vérifier les fonctions mal fermées
const functions = content.match(/(?:function|const\s+\w+\s*=|=>\s*)/g);
console.log(`📊 ${functions?.length || 0} fonctions détectées`);

// Chercher les erreurs communes
const commonErrors = [
  {pattern: /\}\s*(?!;|,|\)|\}|$)/, desc: 'Accolade fermée sans séparateur'},
  {pattern: /\(\s*$/, desc: 'Parenthèse ouverte en fin de ligne'},
  {pattern: /{\s*$/, desc: 'Accolade ouverte en fin de ligne sans fermeture'},
  {pattern: /\w+\s*:\s*$/, desc: 'Propriété sans valeur'},
];

commonErrors.forEach(({pattern, desc}) => {
  const matches = [...content.matchAll(new RegExp(pattern.source, 'gm'))];
  if (matches.length > 0) {
    console.log(`⚠️  ${desc}: ${matches.length} occurrences trouvées`);
  }
});

console.log('\n🔍 Analyse terminée.');
