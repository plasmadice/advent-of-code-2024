import { readInput } from '@src/utils';

function solve(input: string[], partTwo: boolean = false): number {
  // Find where the map ends. The map lines will at least have '#' as boundaries.
  let mapLines: string[] = [];
  let moveLines: string[] = [];
  
  let readingMap = true;
  for (const line of input) {
    // Heuristic: Map lines usually contain '#' characters and form a rectangular shape.
    // Movement lines typically are just sequences of '^', 'v', '<', '>'.
    // If we encounter a line that has no '#' and is composed only of movement chars (or empty), we switch to reading moves.
    if (readingMap) {
      if (line.trim().length === 0) {
        // Empty line might mean end of map, start of moves
        readingMap = false;
      } else if (!line.includes('#') && line.replace(/[v^<>]/g, '').trim().length === 0) {
        // This line has no '#' and only move characters or empty: likely start of moves
        readingMap = false;
        moveLines.push(line);
      } else {
        // Consider this a map line
        mapLines.push(line);
      }
    } else {
      // After we decided we've moved to moves section, all further lines are moves
      moveLines.push(line);
    }
  }
  
  // Normalize the map to a grid
  const warehouse = mapLines.map(line => line.split(''));
  const rows = warehouse.length;
  const cols = warehouse[0].length;

  // Extract the full move sequence (ignore newlines)
  const moves = moveLines.join('').replace(/\s+/g, '');

  // Find the robot's initial position
  let robotRow = 0;
  let robotCol = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (warehouse[r][c] === '@') {
        robotRow = r;
        robotCol = c;
        break;
      }
    }
  }

  // Direction vectors for moves
  const dirMap: Record<string, [number, number]> = {
    '^': [-1, 0],
    'v': [1, 0],
    '<': [0, -1],
    '>': [0, 1]
  };
  
  // Function to attempt a move:
  // - Check if the next cell in direction is wall or box or empty.
  // - If box, we must attempt to push chain of boxes.
  // - If can't push due to wall, do nothing.
  // - If empty, just move robot.
  function attemptMove(move: string) {
    const [dr, dc] = dirMap[move];
    const nextR = robotRow + dr;
    const nextC = robotCol + dc;
    
    // If the next cell is wall (#), no movement.
    if (warehouse[nextR][nextC] === '#') {
      return; 
    }
    
    // If the next cell is empty ('.'), just move the robot
    if (warehouse[nextR][nextC] === '.') {
      // Move robot
      warehouse[robotRow][robotCol] = '.';
      warehouse[nextR][nextC] = '@';
      robotRow = nextR;
      robotCol = nextC;
      return;
    }
    
    // If the next cell is a box ('O'), we must push
    if (warehouse[nextR][nextC] === 'O') {
      // Identify the chain of boxes in this direction
      let boxPositions: {r: number, c: number}[] = [];
      let curR = nextR;
      let curC = nextC;
      while (warehouse[curR][curC] === 'O') {
        boxPositions.push({r: curR, c: curC});
        curR += dr;
        curC += dc;
      }
      
      // Now curR, curC is the cell after the last box in the chain
      const afterLastR = curR;
      const afterLastC = curC;
      
      // Check if this final cell is free for the boxes to move into
      // If it's a wall or out of bounds, no movement occurs
      if (warehouse[afterLastR][afterLastC] === '#') {
        // Cannot push
        return;
      }
      
      // If it's empty, we can push all boxes forward by one cell
      if (warehouse[afterLastR][afterLastC] === '.') {
        // Move the boxes from last to first so we don't overwrite
        // Move last box into afterLastR,afterLastC
        warehouse[afterLastR][afterLastC] = 'O';
        for (let i = boxPositions.length - 1; i > 0; i--) {
          const prev = boxPositions[i - 1];
          const curr = boxPositions[i];
          // Move this box into the cell of the previous box
          warehouse[curr.r][curr.c] = 'O'; // This assignment is not actually needed if done in order, but kept for clarity
        }
        // The first box moves into nextR,nextC
        warehouse[nextR][nextC] = 'O';
        
        // Now the robot moves into the original first box position
        warehouse[robotRow][robotCol] = '.';
        warehouse[robotRow + dr][robotCol + dc] = '@';
        robotRow += dr;
        robotCol += dc;
      } else {
        // If the cell after the last box is also a box or something else not workable, no move.
        // Actually, if it's 'O', that means we have a longer chain. We should have found that already,
        // but if somehow there's a chain continuing, we would have included it. So no push if we didn't.
        return;
      }
    }
  }

  // Process all moves
  for (const m of moves) {
    attemptMove(m);
  }

  // After finishing all moves, sum up the GPS coordinates of all boxes.
  // GPS = 100 * row + col
  let sum = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (warehouse[r][c] === 'O') {
        sum += 100 * r + c;
      }
    }
  }

  return sum;
}

// Measure performance of the solution
const start = performance.now();
const result = solve(readInput(__dirname));
const result2 = solve(readInput(__dirname), true);
const end = performance.now();

console.log(result, result2, `\nOperation took ${(end - start).toFixed(3)} milliseconds`);
