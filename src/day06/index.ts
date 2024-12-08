import { readInput } from '@src/utils';

function solve(input: string[], partTwo: boolean = false): number {
  // Define the possible movement directions in order: up, right, down, left
  const directions = [
      [-1, 0], // up
      [0, 1],  // right
      [1, 0],  // down
      [0, -1]  // left
  ];

  // Start facing up, so the initial direction index is 0
  let currentDirectionIndex = 0;

  // Find the starting position of the guard (^) on the map
  let x = input.findIndex(row => row.includes('^'));
  let y = input[x].indexOf('^');

  // Use a set to track visited positions, starting with the initial position
  const visited = new Set<string>();
  visited.add(`${x},${y}`);

  while (true) {
      // Get the current direction based on the direction index
      const [dx, dy] = directions[currentDirectionIndex];
      const nextX = x + dx;
      const nextY = y + dy;

      // Check if the next position is within bounds and not an obstacle (#)
      if (nextX >= 0 && nextX < input.length && 
          nextY >= 0 && nextY < input[nextX].length && 
          input[nextX][nextY] !== '#') {
          // Move to the next position
          // console.log(`Moving to (${nextX}, ${nextY}) - Visited positions: ${visited.size}`)

          x = nextX;
          y = nextY;
      } else if (input[nextX][nextY] === undefined) {
        // Break out of the loop if we reach the edge of the map
        break; 
      } else {
          // Turn right (change direction)
          currentDirectionIndex = (currentDirectionIndex + 1) % 4;

          // console.log(`Turned right (new direction: ${currentDirectionIndex})`)
          continue; // Skip the rest of the loop and check the new direction
      }

      // If the new position has not been visited, mark it as visited
      if (!visited.has(`${x},${y}`)) {
          visited.add(`${x},${y}`);
      }

  }

  // Return the number of distinct positions visited
  return visited.size;
}

// Measure performance of the solution
const start = performance.now()
const result = solve(readInput(__dirname)); // Part 1
const result2 = solve(readInput(__dirname), true); // Part 2
const end = performance.now()
console.log(result, result2, `\nOperation took ${(end - start).toFixed(3)} milliseconds`);