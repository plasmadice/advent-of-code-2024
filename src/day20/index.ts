import { readInput } from '@src/utils';

type Point = {
  x: number;
  y: number;
};

type State = {
  pos: Point;
  steps: number;
  distanceToEnd: number; // Not optional anymore to avoid unnecessary checks
};

function solve(input: string[] | string, partTwo: boolean = false): number {
  const lines = Array.isArray(input) ? input : input.trim().split('\n');
  const grid = lines.map(line => line.trim().split(''));

  let start: Point | null = null;
  let end: Point | null = null;

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === 'S') start = { x, y };
      if (grid[y][x] === 'E') end = { x, y };
    }
  }

  if (!start || !end) throw new Error('Start or End not found');

  // Find baseline shortest path length
  const baselinePath = findShortestPath(grid, start, end);
  if (baselinePath === null) throw new Error('No path found from Start to End');

  // Find significant shortcuts
  // const cheats = partTwo 
  //   ? findSignificantCheatsPartTwo(grid, start, end, baselinePath) 
  //   : findSignificantCheats(grid, start, end, baselinePath);
  const cheats = findSignificantCheats(grid, start, end, baselinePath);
  
  const significantCheats = cheats.filter(saving => saving >= 100);

  const savingsDistribution = new Map<number, number>();
  cheats.forEach(saving => {
    if (saving >= 50) { // Only track significant savings
      savingsDistribution.set(saving, (savingsDistribution.get(saving) || 0) + 1);
    }
  });

  Array.from(savingsDistribution.entries())
    .sort((a, b) => a[0] - b[0])

  return significantCheats.length;
}

function manhattan(a: Point, b: Point): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

function findShortestPath(grid: string[][], start: Point, end: Point): number | null {
  const queue: State[] = [{
    pos: start,
    steps: 0,
    distanceToEnd: manhattan(start, end)
  }];
  const visited = new Set<string>();

  while (queue.length > 0) {
    queue.sort((a, b) => (a.steps + a.distanceToEnd) - (b.steps + b.distanceToEnd));
    const current = queue.shift();
    if (!current) continue;

    const key = `${current.pos.x},${current.pos.y}`;
    if (visited.has(key)) continue;
    visited.add(key);

    if (current.pos.x === end.x && current.pos.y === end.y) {
      return current.steps;
    }

    const moves = [{x:0,y:1}, {x:0,y:-1}, {x:1,y:0}, {x:-1,y:0}];
    for (const move of moves) {
      const newX = current.pos.x + move.x;
      const newY = current.pos.y + move.y;

      if (newX < 0 || newY < 0 || newY >= grid.length || newX >= grid[0].length) continue;
      if (grid[newY][newX] === '#') continue;

      const newState: State = {
        pos: { x: newX, y: newY },
        steps: current.steps + 1,
        distanceToEnd: manhattan({ x: newX, y: newY }, end)
      };
      queue.push(newState);
    }
  }

  return null;
}

function findSignificantCheats(grid: string[][], start: Point, end: Point, baselineSteps: number): number[] {
  const savings: number[] = [];
  const batch_size = 100;
  let processedPoints = 0;

  // Create a grid of distances from end
  const distances = new Array(grid.length).fill(null)
    .map(() => new Array(grid[0].length).fill(Infinity));
  
  // Calculate distances from end point
  const endQueue: State[] = [{pos: end, steps: 0, distanceToEnd: 0}];
  const visitedEnd = new Set<string>();
  
  while (endQueue.length > 0) {
    const curr = endQueue.shift()!;
    const key = `${curr.pos.x},${curr.pos.y}`;
    
    if (visitedEnd.has(key)) continue;
    visitedEnd.add(key);
    
    distances[curr.pos.y][curr.pos.x] = curr.steps;
    
    [{x:0,y:1}, {x:0,y:-1}, {x:1,y:0}, {x:-1,y:0}].forEach(move => {
      const newX = curr.pos.x + move.x;
      const newY = curr.pos.y + move.y;
      
      if (newX < 0 || newY < 0 || newY >= grid.length || newX >= grid[0].length) return;
      if (grid[newY][newX] === '#') return;
      
      endQueue.push({
        pos: {x: newX, y: newY},
        steps: curr.steps + 1,
        distanceToEnd: 0
      });
    });
  }

  // Look for significant shortcuts with up to 2-step cheats (Part 1 logic)
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      if (grid[y][x] === '#') continue;
      
      processedPoints++;
      
      const startDist = findShortestPath(grid, start, {x, y});
      if (!startDist) continue;
      
      // Search in a smaller radius (up to 2 steps for Part 1)
      for (let dy = -2; dy <= 2; dy++) {
        for (let dx = -2; dx <= 2; dx++) {
          if (Math.abs(dx) + Math.abs(dy) > 2) continue;  // Manhattan distance ≤ 2
          
          const endX = x + dx;
          const endY = y + dy;
          
          if (endX < 0 || endY < 0 || endY >= grid.length || endX >= grid[0].length) continue;
          if (grid[endY][endX] === '#') continue;
          
          const distToEnd = distances[endY][endX];
          if (distToEnd === Infinity) continue;
          
          const cheatLength = Math.abs(dx) + Math.abs(dy);  // Manhattan distance for cheat
          const totalSteps = startDist + cheatLength + distToEnd;
          const timeSaved = baselineSteps - totalSteps;
          
          if (timeSaved >= 90) {  // Check slightly below 100 to catch edge cases
            savings.push(timeSaved);
          }
        }
      }
    }
  }

  return savings;
}

// function findSignificantCheatsPartTwo(grid: string[][], start: Point, end: Point, baselineSteps: number): number[] {
//   const savings: number[] = [];
//   const batch_size = 100;
//   let processedPoints = 0;

//   // Create a grid of distances from end
//   const distances = new Array(grid.length).fill(null)
//     .map(() => new Array(grid[0].length).fill(Infinity));
  
//   // Calculate distances from end point using BFS
//   const endQueue: State[] = [{pos: end, steps: 0, distanceToEnd: 0}]; 
//   const visitedEnd = new Set<string>();
  
//   while (endQueue.length > 0) {
//     const curr = endQueue.shift()!;
//     const key = `${curr.pos.x},${curr.pos.y}`;
    
//     if (visitedEnd.has(key)) continue;
//     visitedEnd.add(key);
    
//     distances[curr.pos.y][curr.pos.x] = curr.steps;
    
//     [{x:0,y:1}, {x:0,y:-1}, {x:1,y:0}, {x:-1,y:0}].forEach(move => {
//       const newX = curr.pos.x + move.x;
//       const newY = curr.pos.y + move.y;
      
//       if (newX < 0 || newY < 0 || newY >= grid.length || newX >= grid[0].length) return;
//       if (grid[newY][newX] === '#') return;
      
//       endQueue.push({
//         pos: {x: newX, y: newY},
//         steps: curr.steps + 1,
//         distanceToEnd: 0
//       });
//     });
//   }

//   // Look for significant shortcuts with up to 20-step cheats (Part 2 logic)
//   for (let y = 0; y < grid.length; y++) {
//     for (let x = 0; x < grid[0].length; x++) {
//       if (grid[y][x] === '#') continue;
      
//       processedPoints++;
//       if (processedPoints % batch_size === 0) {
//         console.log(`Processed ${processedPoints} points...`);
//       }
      
//       const startDist = findShortestPath(grid, start, {x, y});
//       if (!startDist) continue;

//       // **Cheat range for Part 2**: Manhattan distance ≤ 20
//       for (let dy = -20; dy <= 20; dy++) {
//         for (let dx = -20; dx <= 20; dx++) {
//           if (Math.abs(dx) + Math.abs(dy) > 20) continue; // Manhattan distance ≤ 20
          
//           const endX = x + dx;
//           const endY = y + dy;
          
//           if (endX < 0 || endY < 0 || endY >= grid.length || endX >= grid[0].length) continue;
//           if (grid[endY][endX] === '#') continue;
          
//           const distToEnd = distances[endY][endX];
//           if (distToEnd === Infinity) continue;
          
//           const cheatLength = Math.abs(dx) + Math.abs(dy);
//           const totalSteps = startDist + cheatLength + distToEnd;
//           const timeSaved = baselineSteps - totalSteps;
          
//           if (timeSaved >= 100) {
//             savings.push(timeSaved);
//           }
//         }
//       }
//     }
//   }

//   console.log(`Processed all ${processedPoints} points`);
//   return savings;
// }

const start = performance.now();
const result = solve(readInput(__dirname));
const result2 = solve(readInput(__dirname), true);
const end = performance.now();

console.log(result, result2, `\nOperation took ${(end - start).toFixed(3)} milliseconds`);
