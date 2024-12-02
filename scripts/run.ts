import { existsSync } from 'fs';
import { join } from 'path';

const day = process.argv[2] ? parseInt(process.argv[2], 10) : new Date().getDate();
const paddedDay = day.toString().padStart(2, '0');
const solutionPath = join(__dirname, '..', 'src', `day${paddedDay}`, 'index.ts');

if (!existsSync(solutionPath)) {
  console.error(`Solution for day ${day} not found!`);
  console.log('Use "npm run new [day]" to create a new solution.');
  process.exit(1);
}

// Import and run the solution
import(`@src/day${paddedDay}/index`);