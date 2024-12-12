import { readInput } from '@src/utils';

function solve(input: string[], partTwo: boolean = false): number {
  // Regular expression to match valid mul instructions like mul(123,456)
  const mulPattern = /mul\((\d{1,3}),(\d{1,3})\)/g;
  // Regular expressions to match "do()" and "don't()" instructions
  const doDontPattern = /do\(\)|don\'t\(\)/g;

  let totalSum = 0;
  let mulEnabled = true; // At the start, mul instructions are enabled

  input.forEach(line => {
    let match;

    // Iterate through all instructions (do(), don't(), mul()) in order
    while ((match = doDontPattern.exec(line)) !== null || (match = mulPattern.exec(line)) !== null) {
      if (match[0] === 'do()') {
        mulEnabled = true;
      } else if (match[0] === "don't()") {
        mulEnabled = false;
      } else if (match[0].startsWith('mul(')) {
        if (!partTwo || mulEnabled) {
          // Extract the numbers from the matched groups
          const x = parseInt(match[1], 10);
          const y = parseInt(match[2], 10);

          // Multiply the numbers and add to the total sum
          totalSum += x * y;
        }
      }
    }
  });

  return totalSum;
}

// Measure performance of the solution
const start = performance.now();
const result = solve(readInput(__dirname)); // Part 1
const result2 = solve(readInput(__dirname), true); // Part 2
const end = performance.now();

console.log(result, result2, `\nOperation took ${(end - start).toFixed(3)} milliseconds`);
