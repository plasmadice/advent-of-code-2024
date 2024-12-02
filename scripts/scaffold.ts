import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

const day = process.argv[2] ? parseInt(process.argv[2], 10) : new Date().getDate();
const paddedDay = day.toString().padStart(2, '0');
const solutionDir = join(__dirname, '..', 'src', `day${paddedDay}`);

// Create directory
mkdirSync(solutionDir, { recursive: true });

// Create solution file
const solutionTemplate = `import { readInput } from '@utils/input';

function solve(input: string[]): any {
  return 0; // Your solution logic here
}

if (require.main === module) {
  const result = solve(readInput(__dirname));
  console.log(result);
}`;

// Create empty input file and solution file
writeFileSync(join(solutionDir, 'input.txt'), '');
writeFileSync(join(solutionDir, 'index.ts'), solutionTemplate);

console.log(`Created files for Day ${day}:
- src/day${paddedDay}/index.ts
- src/day${paddedDay}/input.txt`);