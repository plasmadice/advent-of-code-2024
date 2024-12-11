import { readInput, quickSort } from '@src/utils';

function solve(input: string[], partTwo: boolean = false): number {
  let total = 0;
  let l: number[] = [];
  let r: number[] = [];

  input.forEach((line) => {
    let [left, right] = line.split('  ');
    l.push(parseInt(left));
    r.push(parseInt(right));
  });

  if (!partTwo) {
    let sortedL = quickSort(l);
    let sortedR = quickSort(r);

    for (let i = 0; i < sortedL.length; i++) {
      if (sortedL[i] && sortedR[i]) {
        total += Math.abs(sortedL[i] - sortedR[i]);
      }
    }
  } else {
    let rCount = new Map<number, number>();

    // Count occurrences of each number in the right list
    for (let num of r) {
      rCount.set(num, (rCount.get(num) || 0) + 1);
    }

    // Calculate similarity score based on occurrences in the right list
    for (let num of l) {
      if (rCount.has(num)) {
        total += num * rCount.get(num)!;
      }
    }
  }

  return total;
}

// Measure performance of the solution
const start = performance.now();
const result = solve(readInput(__dirname)); // Part 1
const result2 = solve(readInput(__dirname), true); // Part 2
const end = performance.now();
console.log(result, result2, `\nOperation took ${(end - start).toFixed(3)} milliseconds`);