import { readInput } from '@src/utils';

function solve(input: string[], partTwo: boolean = false): number {
  const target = "XMAS";
  const rows = input.length;
  const cols = input[0].length;
  let count = 0;

  // Possible directions to search in the grid (row and column changes)
  const directions = [
      [-1, -1], [-1, 0], [-1, 1],  // Diagonal up-left, up, up-right
      [0, -1],          [0, 1],     // Left, right
      [1, -1], [1, 0], [1, 1]      // Diagonal down-left, down, down-right
  ];

  // Function to search for the target word starting from a specific cell
  function searchFromCell(row: number, col: number): void {
      for (const [dr, dc] of directions) {
          let isMatch = true;
          for (let i = 0; i < target.length; i++) {
              const newRow = row + dr * i;
              const newCol = col + dc * i;

              // Check if the position is out of bounds or the character doesn't match
              if (
                  newRow < 0 || newRow >= rows || 
                  newCol < 0 || newCol >= cols || 
                  input[newRow][newCol] !== target[i]
              ) {
                  isMatch = false;
                  break;
              }
          }

          // If the target word was found, increment the counter
          if (isMatch) {
              count++;
          }
      }
  }

  // Iterate over every cell in the grid to start the search
  for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
          searchFromCell(row, col);
      }
  }

  return count;
}

// Measure performance of the solution
const start = performance.now()
const result = solve(readInput(__dirname)); // Part 1
const result2 = solve(readInput(__dirname), true); // Part 2
const end = performance.now()
console.log(result, result2, `\nOperation took ${(end - start).toFixed(3)} milliseconds`);