import { readInput } from '@src/utils';

function solve(input: string[]): number {
  function evaluateExpression(numbers: number[], operators: string[]): number {
    let result = numbers[0]; // Start with the first number as the initial result.
    for (let i = 0; i < operators.length; i++) {
      if (operators[i] === '+') {
        result += numbers[i + 1];
      } else if (operators[i] === '*') {
        result *= numbers[i + 1];
      }
    }
    return result;
  }

  function generateOperatorCombinations(length: number): string[][] {
    const combinations: string[][] = []; // Stores all valid operator combinations.

    const backtrack = (current: string[], index: number) => {
      if (index === length) {
        // Base case: If we've filled all operator slots, save the combination.
        combinations.push([...current]);
        return;
      }
      // Add '+' to the current combination and continue.
      current.push('+');
      backtrack(current, index + 1);
      current.pop(); // Remove '+' to backtrack.

      // Add '*' to the current combination and continue.
      current.push('*');
      backtrack(current, index + 1);
      current.pop(); // Remove '*' to backtrack.
    };

    backtrack([], 0); // Start with an empty combination.
    return combinations;
  }

  let totalCalibrationResult = 0; // Accumulates the total of all valid test values.

  // Process each line of the input.
  for (const line of input) {
    // Split the line into the target value and the numbers.
    const parts = line.split(':');
    const testValue = parseInt(parts[0], 10); // Target value to match.
    const numbers = parts[1].trim().split(' ').map(Number); // Convert numbers into an array.

    if (numbers.length <= 1) {
      continue; // Skip if there are not enough numbers for operators.
    }

    // Generate all possible combinations of '+' and '*' operators.
    const operatorCombinations = generateOperatorCombinations(numbers.length - 1);
    let isValidEquation = false; // Tracks if a valid combination is found.

    // Check each combination of operators.
    for (const operators of operatorCombinations) {
      // If the expression evaluates to the target value, mark as valid.
      if (evaluateExpression(numbers, operators) === testValue) {
        isValidEquation = true;
        break;
      }
    }

    // If a valid combination was found, add the test value to the total.
    if (isValidEquation) {
      totalCalibrationResult += testValue;
    }
  }

  return totalCalibrationResult; 
}

// Measure performance of the solution
const start = performance.now(); 
const result = solve(readInput(__dirname)); 
const end = performance.now(); 

console.log(result, `\nOperation took ${(end - start).toFixed(3)} milliseconds`);