import { readInput } from '@src/utils';

function solve(input: string[], partTwo: boolean = false): number {
  let count = 0;

  // Function to check if the levels are safe
  const checkIfSafe = (arr: number[]): boolean => {
    const isAscending = arr[0] < arr[1];

    for (let i = 0; i < arr.length - 1; i++) {
      const [left, right] = [arr[i], arr[i + 1]];

      if (left === right) return false;
      if (isAscending && left >= right) return false;
      if (!isAscending && left <= right) return false;
      if (Math.abs(left - right) > 3) return false;
    }

    return true;
  };

  // Function to check if the array becomes safe by removing one element
  const checkWithDampener = (arr: number[]): boolean => {
    for (let i = 0; i < arr.length; i++) {
      const modifiedArray = arr.slice(0, i).concat(arr.slice(i + 1));
      if (checkIfSafe(modifiedArray)) {
        return true;
      }
    }
    return false;
  };

  input.forEach((line) => {
    const arr = line.split(' ').map(Number);

    if (checkIfSafe(arr)) {
      count++;
    } else if (partTwo && checkWithDampener(arr)) {
      count++;
    }
  });

  return count;
}

// Measure performance of the solution
const start = performance.now();
const result = solve(readInput(__dirname)); // Part 1
const result2 = solve(readInput(__dirname), true); // Part 2
const end = performance.now();

console.log(result, result2, `\nOperation took ${(end - start).toFixed(3)} milliseconds`);