import { readInput } from '@src/utils';

function parseInput(input: string[]): { patterns: string[], designs: string[] } {
  const blankLineIndex = input.indexOf('');
  const patterns = input.slice(0, blankLineIndex).join('').split(',').map(p => p.trim());
  const designs = input.slice(blankLineIndex + 1);
  return { patterns, designs };
}

function countWaysToConstructDesign(design: string, patterns: string[]): number {
  const n = design.length;
  const dp = Array(n + 1).fill(0);
  dp[0] = 1;

  for (let i = 1; i <= n; i++) {
    for (const pattern of patterns) {
      const len = pattern.length;
      if (i >= len && design.slice(i - len, i) === pattern) {
        dp[i] += dp[i - len];
      }
    }
  }
  
  return dp[n];
}

function solve(input: string[], partTwo: boolean = false): number {
  const { patterns, designs } = parseInput(input);
  let totalCount = 0;
  
  for (const design of designs) {
    totalCount += partTwo 
      ? countWaysToConstructDesign(design, patterns) 
      : countWaysToConstructDesign(design, patterns) > 0 ? 1 : 0;
  }
  
  return totalCount;
}

const start = performance.now();
const result = solve(readInput(__dirname)); 
const result2 = solve(readInput(__dirname), true); 
const end = performance.now(); 

console.log(result, result2, `\nOperation took ${(end - start).toFixed(3)} milliseconds`);
