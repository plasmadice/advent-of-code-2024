import { readInput, gcdCalc } from '@src/utils';

function solve(input: string[], partTwo: boolean = false): number {
  const grid = input.map(row => row.split('')); // Parse grid into a 2D array
  const rows = grid.length;
  const cols = grid[0].length;
  const antinodes = new Set<string>();

  // Map to store all antenna positions grouped by frequency
  const frequencyPositions: Record<string, [number, number][]> = {};

  // Collect all antenna positions
  for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
          const freq = grid[r][c];
          if (freq !== '.') {
              if (!frequencyPositions[freq]) {
                  frequencyPositions[freq] = [];
              }
              frequencyPositions[freq].push([r, c]);
          }
      }
  }

  // Helper function to mark a position as an antinode
  const markAntinode = (r: number, c: number) => {
      if (r >= 0 && r < rows && c >= 0 && c < cols) {
          antinodes.add(`${r},${c}`);
      }
  };

  // Process each frequency
  for (const freq in frequencyPositions) {
      const positions = frequencyPositions[freq];

      // Part 1: Only consider potential antinodes near antenna pairs
      if (!partTwo) {
          // Check pairs of antennas for potential antinodes
          for (let i = 0; i < positions.length; i++) {
              for (let j = i + 1; j < positions.length; j++) {
                  const [r1, c1] = positions[i];
                  const [r2, c2] = positions[j];

                  // Calculate directions and mark potential antinodes
                  const dr = r2 - r1;
                  const dc = c2 - c1;
                  markAntinode(r1 - dr, c1 - dc); // Closer side
                  markAntinode(r2 + dr, c2 + dc); // Farther side
              }
          }
      } else {
          // Part 2: Include all grid positions exactly aligned with two or more antennas
          const n = positions.length;

          // Each antenna is an antinode if there is more than one of the same frequency
          if (n > 1) {
              positions.forEach(([r, c]) => markAntinode(r, c));

              // For every pair of antennas, calculate all points on the line connecting them
              for (let i = 0; i < n; i++) {
                  for (let j = i + 1; j < n; j++) {
                      const [r1, c1] = positions[i];
                      const [r2, c2] = positions[j];

                      const dr = r2 - r1;
                      const dc = c2 - c1;
                      const gcd = Math.abs(gcdCalc(dr, dc)); // Normalize step size
                      const stepR = dr / gcd;
                      const stepC = dc / gcd;

                      // Mark all positions along the line in both directions
                      let curR = r1, curC = c1;
                      while (curR >= 0 && curR < rows && curC >= 0 && curC < cols) {
                          markAntinode(curR, curC);
                          curR += stepR;
                          curC += stepC;
                      }

                      curR = r1 - stepR;
                      curC = c1 - stepC;
                      while (curR >= 0 && curR < rows && curC >= 0 && curC < cols) {
                          markAntinode(curR, curC);
                          curR -= stepR;
                          curC -= stepC;
                      }
                  }
              }
          } else {
              // Single antenna case: only mark itself as an antinode
              const [r, c] = positions[0];
              markAntinode(r, c);
          }
      }
  }

  return antinodes.size;
}

// Measure performance of the solution
const start = performance.now();
const result = solve(readInput(__dirname)); // Part 1
const result2 = solve(readInput(__dirname), true); // Part 2
const end = performance.now()
console.log(result, result2, `\nOperation took ${(end - start).toFixed(3)} milliseconds`);