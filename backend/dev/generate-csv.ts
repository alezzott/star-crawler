import { writeFileSync } from 'fs';
import { join } from 'path';

const TOTAL_ROWS = 3000;
const CSV_HEADER = 'name,owner,stars,url';
const lines: string[] = [CSV_HEADER];

for (let i = 1; i <= TOTAL_ROWS; i++) {
  lines.push(
    `repo${i},owner${i},${i * 1},https://github.com/owner${i}/repo${i}`,
  );
}

const outputPath = join(__dirname, 'repositories.csv');
writeFileSync(outputPath, lines.join('\n'), 'utf-8');
console.log(`Arquivo ${outputPath} gerado com ${TOTAL_ROWS} linhas!`);
