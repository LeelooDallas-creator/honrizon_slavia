const testCases = [
  {
    name: "H3 avec tableau",
    input: `### Questions essentielles

| Français | Polonais | Prononciation |
|----------|----------|---------------|
| Bonjour | Dzień dobry | djienne dobri |
| Au revoir | Do widzenia | do vidzègna |`,
    expectedPatterns: [
      /<h3>Questions essentielles<\/h3>/,
      /<table>/,
      /<th>Français<\/th>/,
      /<td>Bonjour<\/td>/,
      /<td>Dzień dobry<\/td>/
    ]
  },
  {
    name: "Multiples H3 avec tableaux",
    input: `### Section 1

| Col1 | Col2 |
|------|------|
| A | B |

### Section 2

| Col1 | Col2 |
|------|------|
| C | D |`,
    expectedPatterns: [
      /<h3>Section 1<\/h3>/,
      /<h3>Section 2<\/h3>/,
      /<td>A<\/td>/,
      /<td>D<\/td>/
    ]
  },
  {
    name: "H2 avec séparateur",
    input: `## POLONAIS

---

Contenu`,
    expectedPatterns: [
      /<h2>POLONAIS<\/h2>/,
      /<hr>/,
      /<p>Contenu<\/p>/
    ]
  },
  {
    name: "Texte en gras et italique",
    input: `**Texte en gras** et *texte en italique*`,
    expectedPatterns: [
      /<strong>Texte en gras<\/strong>/,
      /<em>texte en italique<\/em>/
    ]
  },
  {
    name: "Lien",
    input: `Visitez [Horizon Slavia](https://horizon-slavia.fr)`,
    expectedPatterns: [
      /<a href="https:\/\/horizon-slavia\.fr">Horizon Slavia<\/a>/
    ]
  },
  {
    name: "Liste à puces",
    input: `- Item 1
- Item 2
- Item 3`,
    expectedPatterns: [
      /<ul>/,
      /<li>Item 1<\/li>/,
      /<li>Item 2<\/li>/,
      /<\/ul>/
    ]
  }
];

function markdownToHtml(markdown: string): string {
  if (!markdown) return '';

  let html = markdown;

  const tableRegex = /^\|(.+)\|\s*\n\|[\s\-:|]+\|\s*\n((?:\|.+\|\s*\n?)+)/gm;
  html = html.replace(tableRegex, (_match, headerRow, bodyRows) => {
    const headers = headerRow.split('|').map((h: string) => h.trim()).filter((h: string) => h);
    const rows = bodyRows.trim().split('\n').map((row: string) =>
      row.split('|').map((cell: string) => cell.trim()).filter((cell: string) => cell)
    );

    let table = '<table>\n<thead>\n<tr>\n';
    headers.forEach((header: string) => {
      table += `<th>${header}</th>\n`;
    });
    table += '</tr>\n</thead>\n<tbody>\n';

    rows.forEach((row: string[]) => {
      table += '<tr>\n';
      row.forEach((cell: string) => {
        table += `<td>${cell}</td>\n`;
      });
      table += '</tr>\n';
    });

    table += '</tbody>\n</table>\n';
    return table;
  });

  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  html = html.replace(/^######\s+(.*)$/gim, '<h6>$1</h6>');
  html = html.replace(/^#####\s+(.*)$/gim, '<h5>$1</h5>');
  html = html.replace(/^####\s+(.*)$/gim, '<h4>$1</h4>');
  html = html.replace(/^###\s+(.*)$/gim, '<h3>$1</h3>');
  html = html.replace(/^##\s+(.*)$/gim, '<h2>$1</h2>');
  html = html.replace(/^#\s+(.*)$/gim, '<h1>$1</h1>');

  html = html.replace(/^---+$/gim, '<hr>');

  html = html.replace(/^[\*\-\+]\s+(.*$)/gim, '<li>$1</li>');
  html = html.replace(/(<li>.*?<\/li>\s*)+/gs, (match) => `<ul>${match}</ul>`);
  html = html.replace(/^\d+\.\s+(.*$)/gim, '<li>$1</li>');

  const lines = html.split('\n');
  const result = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trim();

    if (!line) {
      i++;
      continue;
    }

    if (line.startsWith('<h') || line.startsWith('<hr>')) {
      result.push(line);
      i++;
    } else if (line.startsWith('<table')) {
      const tableLines = [line];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('</table>')) {
        tableLines.push(lines[i].trim());
        i++;
      }
      if (i < lines.length) {
        tableLines.push(lines[i].trim());
        i++;
      }
      result.push(tableLines.join('\n'));
    } else if (line.startsWith('<ul')) {
      const listLines = [line];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('</ul>')) {
        listLines.push(lines[i].trim());
        i++;
      }
      if (i < lines.length) {
        listLines.push(lines[i].trim());
        i++;
      }
      result.push(listLines.join('\n'));
    } else if (line.startsWith('<ol')) {
      const listLines = [line];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('</ol>')) {
        listLines.push(lines[i].trim());
        i++;
      }
      if (i < lines.length) {
        listLines.push(lines[i].trim());
        i++;
      }
      result.push(listLines.join('\n'));
    } else {
      const paragraph = [];
      while (i < lines.length && lines[i].trim() &&
             !lines[i].trim().startsWith('<h') &&
             !lines[i].trim().startsWith('<table') &&
             !lines[i].trim().startsWith('<ul') &&
             !lines[i].trim().startsWith('<ol') &&
             !lines[i].trim().startsWith('<hr>')) {
        paragraph.push(lines[i].trim());
        i++;
      }
      if (paragraph.length > 0) {
        result.push(`<p>${paragraph.join(' ')}</p>`);
      }
    }
  }

  html = result.join('\n');

  return html;
}

let passedTests = 0;
let failedTests = 0;

console.log('=== TESTS DE CONVERSION MARKDOWN ===\n');

testCases.forEach((testCase, index) => {
  console.log(`Test ${index + 1}: ${testCase.name}`);
  const result = markdownToHtml(testCase.input);

  let testPassed = true;
  testCase.expectedPatterns.forEach((pattern) => {
    if (!pattern.test(result)) {
      console.log(`  ❌ Pattern non trouvé: ${pattern}`);
      testPassed = false;
    }
  });

  if (testPassed) {
    console.log('  ✅ PASS\n');
    passedTests++;
  } else {
    console.log('  ❌ FAIL');
    console.log('  Résultat:');
    console.log(result);
    console.log('\n');
    failedTests++;
  }
});

console.log('=== RÉSULTATS ===');
console.log(`Tests réussis: ${passedTests}/${testCases.length}`);
console.log(`Tests échoués: ${failedTests}/${testCases.length}`);

if (failedTests === 0) {
  console.log('\n✅ Tous les tests sont passés!');
  process.exit(0);
} else {
  console.log('\n❌ Certains tests ont échoué.');
  process.exit(1);
}
