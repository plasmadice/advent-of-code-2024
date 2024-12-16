import { readInput } from '@src/utils';

function solve(input: string[], partTwo: boolean = false): number {
  type Direction = 'N' | 'E' | 'S' | 'W';

  const directions: { [key in Direction]: [number, number] } = {
    N: [-1, 0],
    E: [0, 1],
    S: [1, 0],
    W: [0, -1],
  };

  const turnCost = 1000;
  const moveCost = 1;

  function isValidMove(grid: string[][], x: number, y: number): boolean {
    return x >= 0 && x < grid.length && y >= 0 && y < grid[0].length && grid[x][y] !== '#';
  }

  function heuristic(x: number, y: number, endX: number, endY: number): number {
    return Math.abs(endX - x) + Math.abs(endY - y); // Manhattan distance
  }

  const grid = input.map((row) => row.split(''));
  const startX = grid.findIndex((row) => row.includes('S'));
  const startY = grid[startX].indexOf('S');
  const endX = grid.findIndex((row) => row.includes('E'));
  const endY = grid[endX].indexOf('E');

  if (startX === -1 || startY === -1 || endX === -1 || endY === -1) {
    throw new Error('Start or End position not found in the grid.');
  }

  type State = [number, number, Direction, number]; // [x, y, direction, score]
  const startState: State = [startX, startY, 'E', 0];
  const priorityQueue: { state: State; priority: number }[] = [];
  const visited = new Map<string, number>(); // Map of state keys to scores

  priorityQueue.push({ state: startState, priority: heuristic(startX, startY, endX, endY) });

  while (priorityQueue.length > 0) {
    // Extract the state with the lowest priority
    priorityQueue.sort((a, b) => a.priority - b.priority);
    const { state } = priorityQueue.shift()!;
    const [x, y, dir, score] = state;

    const stateKey = `${x},${y},${dir}`;
    if (visited.has(stateKey) && visited.get(stateKey)! <= score) continue;
    visited.set(stateKey, score);

    if (x === endX && y === endY) return score;

    // Move forward
    const [dx, dy] = directions[dir];
    const newX = x + dx;
    const newY = y + dy;
    if (isValidMove(grid, newX, newY)) {
      const newScore = score + moveCost;
      const newPriority = newScore + heuristic(newX, newY, endX, endY);
      priorityQueue.push({ state: [newX, newY, dir, newScore], priority: newPriority });
    }

    // Rotate clockwise and counterclockwise
    const turnDirs = ['N', 'E', 'S', 'W'];
    const currentDirIndex = turnDirs.indexOf(dir);
    const nextDirs = [turnDirs[(currentDirIndex + 1) % 4], turnDirs[(currentDirIndex + 3) % 4]];
    for (const newDir of nextDirs as Direction[]) {
      const newScore = score + turnCost;
      const newPriority = newScore + heuristic(x, y, endX, endY);
      const newStateKey = `${x},${y},${newDir}`;
      if (!visited.has(newStateKey) || visited.get(newStateKey)! > newScore) {
        priorityQueue.push({ state: [x, y, newDir, newScore], priority: newPriority });
      }
    }
  }

  return -1; // In case no path is found
}

// Measure performance of the solution
const start = performance.now();
const result = solve(readInput(__dirname));
const result2 = solve(readInput(__dirname), true); // Part two
const end = performance.now();

console.log(result, result2, `\nOperation took ${(end - start).toFixed(3)} milliseconds`);
