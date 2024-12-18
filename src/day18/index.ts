import { readInput } from '@src/utils';

interface Point {
  x: number;
  y: number;
}

const directions: Point[] = [
  { x: 0, y: 1 },  // Down
  { x: 1, y: 0 },  // Right
  { x: 0, y: -1 }, // Up
  { x: -1, y: 0 }  // Left
];

function isWithinBounds(x: number, y: number, size: number): boolean {
  return x >= 0 && x < size && y >= 0 && y < size;
}

function simulateFallingBytes(input: string[], gridSize: number, byteCount: number): boolean[][] {
  const grid: boolean[][] = Array.from({ length: gridSize }, () => Array(gridSize).fill(false));
  const bytePositions = input.slice(0, byteCount).map(line => {
    const [x, y] = line.split(',').map(Number);
    return { x, y };
  });

  for (const { x, y } of bytePositions) {
    if (isWithinBounds(x, y, gridSize)) {
      grid[y][x] = true; // Mark position as corrupted
    }
  }
  
  return grid;
}

function findShortestPath(grid: boolean[][], start: Point, end: Point): number {
  const gridSize = grid.length;
  const queue: [Point, number][] = [[start, 0]]; // (position, distance)
  const visited: boolean[][] = Array.from({ length: gridSize }, () => Array(gridSize).fill(false));
  visited[start.y][start.x] = true;
  
  while (queue.length > 0) {
    const [{ x, y }, steps] = queue.shift()!;
    
    if (x === end.x && y === end.y) {
      return steps;
    }
    
    for (const { x: dx, y: dy } of directions) {
      const nx = x + dx;
      const ny = y + dy;
      
      if (
        isWithinBounds(nx, ny, gridSize) && 
        !visited[ny][nx] && 
        !grid[ny][nx] // Ensure space isn't corrupted
      ) {
        visited[ny][nx] = true;
        queue.push([{ x: nx, y: ny }, steps + 1]);
      }
    }
  }
  
  return -1; // No path found
}

function solve(input: string[]): number {
  const gridSize = 71
  const byteCount = 1024
  
  const grid = simulateFallingBytes(input, gridSize, byteCount);
  const start: Point = { x: 0, y: 0 };
  const end: Point = { x: gridSize - 1, y: gridSize - 1 };
  
  return findShortestPath(grid, start, end);
}

function findBlockingByte(input: string[], gridSize: number): string {
  const grid: boolean[][] = Array.from({ length: gridSize }, () => Array(gridSize).fill(false));
  const start: Point = { x: 0, y: 0 };
  const end: Point = { x: gridSize - 1, y: gridSize - 1 };
  
  for (let i = 0; i < input.length; i++) {
    const [x, y] = input[i].split(',').map(Number);
    
    if (isWithinBounds(x, y, gridSize)) {
      grid[y][x] = true; // Mark position as corrupted
    }
    
    const pathExists = findShortestPath(grid, start, end) !== -1;
    if (!pathExists) {
      return `${x},${y}`; // Return the first byte that blocks the path
    }
  }
  
  return '';
}

function solvePartTwo(input: string[]): number | string {
  const gridSize = 71
  return findBlockingByte(input, gridSize);
}

// Measure performance of the solution
const start = performance.now();
const result = solve(readInput(__dirname)); 
const result2 = solvePartTwo(readInput(__dirname)); 
const end = performance.now(); 

console.log(result, result2, `\nOperation took ${(end - start).toFixed(3)} milliseconds`);
