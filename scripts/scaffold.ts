import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

const day = process.argv[2] ? parseInt(process.argv[2], 10) : new Date().getDate();
const paddedDay = day.toString().padStart(2, '0');
const solutionDir = join(__dirname, '..', 'src', `day${paddedDay}`);

// Create directory
mkdirSync(solutionDir, { recursive: true });

// Create solution file
const solutionTemplate = `import { readInput } from '@src/utils';

function solve(input: string[], partTwo: boolean = false): number {
  return 0; // Your solution logic here
}

// Measure performance of the solution
const start = performance.now()
const result = solve(readInput(__dirname)); 
const result2 = solve(readInput(__dirname), true); 
const end = performance.now(); 

console.log(result, result2, \`\\nOperation took \${(end - start).toFixed(3)} milliseconds\`);`;

// Create empty input file and solution file
writeFileSync(join(solutionDir, 'input.txt'), '');
writeFileSync(join(solutionDir, 'index.ts'), solutionTemplate);

console.log(`Created files for Day ${day}:
- src/day${paddedDay}/index.ts
- src/day${paddedDay}/input.txt`);