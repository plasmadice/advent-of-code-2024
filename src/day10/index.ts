import { readInput } from '@src/utils';

/**
 * Solves the hiking trail problem for both parts of the puzzle.
 *
 * @param input - The topographic map represented as an array of strings.
 * @param partTwo - Whether to calculate the sum of trailhead ratings (true) or scores (false).
 * @returns The sum of all trailhead scores or ratings.
 */
function solve(input: string[], partTwo: boolean = false): number {
  // Directions: [dx, dy] for moving right, down, left, up
  const directions = [
    [0, 1],  // right
    [1, 0],  // down
    [0, -1], // left
    [-1, 0]  // up
  ];

  // Convert input into a height map (2D array of numbers)
  const heightMap: number[][] = input.map(row => row.split('').map(Number));
  const rows = heightMap.length;
  const cols = heightMap[0].length;

  // Check if a position is valid on the map
  function isValid(x: number, y: number): boolean {
    return x >= 0 && x < rows && y >= 0 && y < cols;
  }

  // Depth-First Search to calculate trailhead score or rating
  function dfs(x: number, y: number, visited: boolean[][], trailCount: boolean = false): number {
    if (!isValid(x, y) || visited[x][y] || heightMap[x][y] > 9) {
      return 0;
    }

    visited[x][y] = true;

    if (heightMap[x][y] === 9) {
      return trailCount ? 1 : 1; // Base case: count as one trail or one score
    }

    let count = 0;

    for (const [dx, dy] of directions) {
      const nx = x + dx;
      const ny = y + dy;
      if (isValid(nx, ny) && heightMap[nx][ny] === heightMap[x][y] + 1) {
        count += dfs(nx, ny, visited, trailCount);
      }
    }

    // If counting distinct trails, reset visited to allow different paths
    if (trailCount) visited[x][y] = false;

    return count;
  }

  let total = 0;

  // Loop through the map to find all trailheads (height 0)
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (heightMap[i][j] === 0) {
        // Initialize visited array for DFS
        const visited: boolean[][] = Array.from({ length: rows }, () => Array(cols).fill(false));

        // Calculate score or rating based on the problem part
        total += dfs(i, j, visited, partTwo);
      }
    }
  }

  return total;
}

function solvePartTwo(input: string[], partTwo: boolean = true): number {
  const map = input.map(line => line.split('').map(Number));
  const rows = map.length;
  const cols = map[0].length;

  // Determines if a position is a trailhead. A trailhead is defined as a position
  // with a height of 0, from which hiking trails can originate.
  function isTrailhead(x: number, y: number): boolean {
    return map[x][y] === 0;
  }

  function dfs(x: number, y: number, currentHeight: number): number {
    if (
      x < 0 ||
      x >= rows ||
      y < 0 ||
      y >= cols ||
      map[x][y] !== currentHeight + 1
    ) {
      return 0;
    }

    if (map[x][y] === 9) {
      return 1;
    }

    const nextHeight = map[x][y];
    map[x][y] = -1; // Mark as visited

    let count = 0;
    count += dfs(x - 1, y, nextHeight);
    count += dfs(x + 1, y, nextHeight);
    count += dfs(x, y - 1, nextHeight);
    count += dfs(x, y + 1, nextHeight);

    map[x][y] = nextHeight; // Restore the map
    return count;
  }

  function scoreTrailhead(x: number, y: number): number {
    let score = 0;

    function countPaths(x: number, y: number, currentHeight: number): void {
      if (
        x < 0 ||
        x >= rows ||
        y < 0 ||
        y >= cols ||
        map[x][y] !== currentHeight + 1
      ) {
        return;
      }

      if (map[x][y] === 9) {
        score++;
        return;
      }

      const nextHeight = map[x][y];
      map[x][y] = -1; // Mark as visited

      countPaths(x - 1, y, nextHeight);
      countPaths(x + 1, y, nextHeight);
      countPaths(x, y - 1, nextHeight);
      countPaths(x, y + 1, nextHeight);

      map[x][y] = nextHeight; // Restore the map
    }

    countPaths(x, y, -1);
    return score;
  }

  let totalScore = 0;

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (isTrailhead(i, j)) {
        if (partTwo) {
          totalScore += scoreTrailhead(i, j);
        } else {
          totalScore += dfs(i, j, -1);
        }
      }
    }
  }

  return totalScore;
}

// Measure performance of the solution
const start = performance.now();
const result = solve(readInput(__dirname)); // Part One: Sum of trailhead scores
const result2 = solvePartTwo(readInput(__dirname)); // Part Two: Sum of trailhead ratings
const end = performance.now();

// Output results and execution time
console.log(result, result2, `\nOperation took ${(end - start).toFixed(3)} milliseconds`);