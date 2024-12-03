import { readInput } from '@src/utils';

function solve(input: string[]): any {
  // Regular expression to match valid mul instructions like mul(123,456)
  const mulPattern = /mul\((\d{1,3}),(\d{1,3})\)/g;

  let totalSum = 0;

  input.forEach(line => {
    let pair;

    while ((pair = mulPattern.exec(line)) !== null) {
      // Extract the numbers from the matched groups
      const x = parseInt(pair[1], 10);
      const y = parseInt(pair[2], 10);
      
      // Multiply the numbers and add to the total sum
      totalSum += x * y;
    }
  })

  return totalSum;
}

// Measure performance of the solution
const start = performance.now()
let result = solve(readInput(__dirname))
const end = performance.now()
console.log(result, `\nOperation took ${(end - start).toFixed(3)} milliseconds`);