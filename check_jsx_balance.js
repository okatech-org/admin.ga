const fs = require('fs');

const content = fs.readFileSync('app/super-admin/organismes-prospects/page.tsx', 'utf8');
const lines = content.split('\n');

let stack = [];
let errors = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const lineNum = i + 1;

  // Find all JSX tags in the line
  const tags = line.match(/<[^>]*>/g);
  if (!tags) continue;

  for (const tag of tags) {
    if (tag.startsWith('</')) {
      // Closing tag
      const tagName = tag.match(/<\/([^>]+)>/)?.[1];
      if (stack.length === 0) {
        errors.push(`Line ${lineNum}: Unexpected closing tag ${tag}`);
      } else {
        const lastTag = stack.pop();
        if (lastTag.name !== tagName) {
          errors.push(`Line ${lineNum}: Expected </${lastTag.name}> but found ${tag} (opened at line ${lastTag.line})`);
        }
      }
    } else if (tag.endsWith('/>')) {
      // Self-closing tag - ignore
    } else {
      // Opening tag
      const tagName = tag.match(/<([^>\s]+)/)?.[1];
      if (tagName) {
        stack.push({name: tagName, line: lineNum, tag});
      }
    }
  }
}

console.log(`Unclosed tags (${stack.length}):`);
for (const unclosed of stack.slice(0, 20)) { // Show first 20
  console.log(`  Line ${unclosed.line}: ${unclosed.tag}`);
}

if (errors.length > 0) {
  console.log(`\nErrors (${errors.length}):`);
  for (const error of errors.slice(0, 10)) { // Show first 10
    console.log(`  ${error}`);
  }
}
