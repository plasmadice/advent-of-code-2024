import { readInput } from '@src/utils';

/**
 * mixAndPrune:
 *  Performs the bitwise-XOR 'mix' (unsigned) and then modulo 16777216 'prune'.
 */
function mixAndPrune(secret: number, valueToMix: number): number {
  // Force both operands to unsigned 32-bit, then XOR, then again force unsigned.
  let mixed = ((secret >>> 0) ^ (valueToMix >>> 0)) >>> 0;

  // Now we are in the range [0..4294967295]. Next, we take modulo 16777216
  // (which is 2^24), to prune it down to [0..16777215].
  let pruned = mixed % 16777216;

  return pruned;
}

/**
 * getNextSecretNumber:
 *  Evolves a given secret number to the next via the required 3-step process.
 */
function getNextSecretNumber(currentSecret: number): number {
  // Step 1: multiply by 64, mix, prune
  let step1 = mixAndPrune(currentSecret, currentSecret * 64);

  // Step 2: divide by 32 (floor), mix, prune
  let step2Divided = Math.floor(step1 / 32);
  let step2 = mixAndPrune(step1, step2Divided);

  // Step 3: multiply by 2048, mix, prune
  let step3 = mixAndPrune(step2, step2 * 2048);

  // The result is the next secret number
  return step3;
}

/**
 * getSecretsAndPrices:
 *  For a given buyer's initial secret, returns:
 *    - an array of secret numbers of length (STEPS+1)
 *    - an array of last-digit prices (the 'ones' digit) of length (STEPS+1)
 *    - an array of changes (price[i+1] - price[i]) of length STEPS
 */
function getSecretsAndPrices(initialSecret: number, STEPS: number): {
  secrets: number[];
  prices: number[];
  changes: number[];
} {
  const secrets: number[] = new Array(STEPS + 1);
  const prices: number[] = new Array(STEPS + 1);
  const changes: number[] = new Array(STEPS);

  // First secret & price
  secrets[0] = initialSecret;
  prices[0] = initialSecret % 10; // last digit

  // Generate the rest
  for (let i = 1; i <= STEPS; i++) {
    secrets[i] = getNextSecretNumber(secrets[i - 1]);
    prices[i] = secrets[i] % 10; // last digit
    // compute change from i-1 to i
    changes[i - 1] = prices[i] - prices[i - 1];
  }

  return { secrets, prices, changes };
}

/**
 * solvePartOne:
 *  Part One logic: Sum the 2000th new secret for each buyer.
 */
function solvePartOne(input: string[]): number {
  const STEPS = 2000;
  let total = 0;

  for (let i = 0; i < input.length; i++) {
    const initialSecret = Number(input[i]);
    let secret = initialSecret;

    for (let step = 0; step < STEPS; step++) {
      secret = getNextSecretNumber(secret);
    }
    total += secret;
  }

  return total;
}

/**
 * solvePartTwo (Naive Approach):
 *  - For each buyer, we precompute all 2001 prices and the 2000 changes.
 *  - We then try every possible 4-change pattern in [-9..9].
 *  - For each pattern, we find the first occurrence in the buyer's changes (if any),
 *    and then add the corresponding price to the total.
 *  - We keep track of the maximum sum across all possible 4-change patterns.
 *
 *  Potentially expensive for large inputs because 19^4 = 130,321 sequences.
 */
function solvePartTwo(input: string[]): number {
  const STEPS = 2000;

  // Precompute prices and changes for each buyer
  // so we don't redo secret-number generation for each 4-change pattern.
  const data = input.map(line => {
    const initialSecret = Number(line);
    return getSecretsAndPrices(initialSecret, STEPS);
  });

  let maxBananas = 0;

  // We'll try all possible 4-change sequences from -9..9
  for (let s1 = -9; s1 <= 9; s1++) {
    for (let s2 = -9; s2 <= 9; s2++) {
      for (let s3 = -9; s3 <= 9; s3++) {
        for (let s4 = -9; s4 <= 9; s4++) {
          const pattern = [s1, s2, s3, s4];
          let totalForThisPattern = 0;

          // For each buyer, see if this pattern occurs
          for (let b = 0; b < data.length; b++) {
            const { prices, changes } = data[b];
            const foundIndex = findSequenceIndex(changes, pattern);
            if (foundIndex >= 0) {
              // If the pattern is found at changes index i,
              // it means it triggered on the "fourth" of those changes,
              // i.e., we sell at prices[i+4].
              // But watch the indexing: we found the pattern at c[i], c[i+1], c[i+2], c[i+3].
              const sellPriceIndex = foundIndex + 4; 
              // sell at that price
              totalForThisPattern += prices[sellPriceIndex];
            }
          }

          if (totalForThisPattern > maxBananas) {
            maxBananas = totalForThisPattern;
          }
        }
      }
    }
  }

  return maxBananas;
}

/**
 * findSequenceIndex:
 *  Returns the FIRST index in `changes` where `pattern` occurs consecutively.
 *  If not found, returns -1.
 */
function findSequenceIndex(changes: number[], pattern: number[]): number {
  const pLen = pattern.length;
  const cLen = changes.length;

  // We'll do a straightforward search
  for (let i = 0; i <= cLen - pLen; i++) {
    let match = true;
    for (let j = 0; j < pLen; j++) {
      if (changes[i + j] !== pattern[j]) {
        match = false;
        break;
      }
    }
    if (match) {
      return i;
    }
  }
  return -1;
}

/**
 * solve:
 *  - If partTwo = false (default), run Part One logic.
 *  - If partTwo = true, run Part Two logic.
 */
export function solve(input: string[], partTwo: boolean = false): number {
  // const logs: string[] = [];

  if (!partTwo) {
    // Part One
    const total = solvePartOne(input);
    // logs.push(`Part One total: ${total}`);
    return total;
  } else {
    // Part Two
    const bestBananas = solvePartTwo(input);
    // logs.push(`Part Two best bananas: ${bestBananas}`);
    return bestBananas;
  }
}

// Measure performance of the solution
const start = performance.now();
const result = solve(readInput(__dirname));       // Part One
const result2 = solve(readInput(__dirname), true); // Part Two
const end = performance.now();

console.log( result, result2, `\nOperation took ${(end - start).toFixed(3)} milliseconds`);
