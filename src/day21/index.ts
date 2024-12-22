import { readInput } from '@src/utils';

// Helper types
type Cell = {
  char: string;
  x: number;
  y: number;
  links: Link[];
  bestPath: Record<string, string>;
};

type Link = {
  target: Cell;
  move: string;
};

// Helper functions
function distance(a: { x: number; y: number }, b: { x: number; y: number }): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

function getMoveFor(from: { x: number; y: number }, to: { x: number; y: number }): string {
  if (to.x - from.x === -1) return '<';
  if (to.x - from.x === +1) return '>';
  if (to.y - from.y === -1) return '^';
  if (to.y - from.y === +1) return 'v';
  throw new Error('Unexpected move wanted');
}

function charChanges(str: string): number {
  if (str.length < 2) return 0;
  let changes = 0;
  for (let i = 1; i < str.length; i++) {
    if (str[i] !== str[i - 1]) changes++;
  }
  return changes;
}

// Preference order
const order = ['^', '>', 'v', '<'];

// Sorter for path strings
function pathSorter(left: string, right: string): number {
  // Part 1: prefer sequences that repeat chars often
  const one = charChanges(left);
  const two = charChanges(right);
  if (one !== two) return one - two;

  // Part 2: prefer certain characters in order
  for (let i = 0; i < left.length; i++) {
    const a = order.indexOf(left[i]);
    const b = order.indexOf(right[i]);
    if (a !== b) return b - a;
  }

  // Otherwise, considered equal
  return 0;
}

function createPad(input: string): Cell[] {
  const pad: Cell[] = input
    .split(/\r?\n/g)
    .map((line, y) =>
      line.split('').map((char, x) => ({
        char,
        x,
        y,
        links: [] as Link[],
        bestPath: {},
      }))
    )
    .flat()
    // Filter out whitespace cells
    .filter((c) => c.char.trim());

  // Build links
  pad.forEach((p) => {
    p.links = pad
      .filter((p2) => 1 === Math.abs(p2.x - p.x) + Math.abs(p2.y - p.y))
      .map((p2) => ({
        target: p2,
        move: getMoveFor(p, p2),
      }));
  });

  function findPathsTo(goal: Cell, current: Cell, visited: string[] = []): string[] {
    if (current === goal) return ['A'];
    const baseDistance = distance(goal, current);

    return current.links
      .filter((n) => !visited.includes(n.target.char))
      .filter((n) => distance(n.target, goal) < baseDistance)
      .flatMap((n) =>
        findPathsTo(goal, n.target, [...visited, n.target.char]).map(
          (path) => n.move + path
        )
      );
  }

  // Precompute bestPath for each cell
  pad.forEach((pSource) => {
    pad.forEach((pTarget) => {
      if (pSource === pTarget) return;
      const paths = findPathsTo(pTarget, pSource, [pSource.char]).sort(pathSorter);
      pSource.bestPath[pTarget.char] = paths[0] ?? '';
    });
  });

  return pad;
}

// Part 1 logic
function part1(data: string[]): number {
  // Build pads
  const numpad = createPad('789\n456\n123\n 0A');
  const dirpad = createPad(' ^A\n<v>');

  let currentDir1Position = dirpad.find((p) => p.char === 'A')!;
  let currentDir2Position = dirpad.find((p) => p.char === 'A')!;
  let currentNumpadPosition = numpad.find((p) => p.char === 'A')!;

  let result = 0;

  // Each string in data is like "029A" or "980A"
  for (const code of data) {
    let count = 0;

    for (const targetChar of code) {
      // If same number already
      if (targetChar === currentNumpadPosition.char) {
        count++;
        continue;
      }

      // Move on numpad
      const path1 = currentNumpadPosition.bestPath[targetChar];
      for (const dir1Target of path1) {
        // Move on direction pad #1
        if (dir1Target === currentDir1Position.char) {
          count++;
          continue;
        }

        const path2 = currentDir1Position.bestPath[dir1Target];
        for (const dir2Target of path2) {
          // Move on direction pad #2
          if (dir2Target === currentDir2Position.char) {
            count++;
            continue;
          }

          // Now move direction pad #2
          count += currentDir2Position.bestPath[dir2Target].length;
          currentDir2Position = dirpad.find((p) => p.char === dir2Target)!;
        }

        currentDir1Position = dirpad.find((p) => p.char === dir1Target)!;
      }

      currentNumpadPosition = numpad.find((p) => p.char === targetChar)!;
    }

    // Multiply the total moves by the integer portion of the code's first 3 chars
    // e.g., parseInt("029A".substring(0,3)) => 29
    // Adjust as needed if your input format differs
    result += count * parseInt(code.substring(0, 3));
  }

  return result;
}

// Part 2 logic
function part2(data: string[]): number {
  // Example trivial solution
  return data.length;
}

/**
 * solve
 *  - If partTwo is false: runs part1
 *  - If partTwo is true: runs part2
 */
export function solve(input: string[], partTwo: boolean = false): number {
  return partTwo ? part2(input) : part1(input);
}

// Measure performance
const start = performance.now();
const result = solve(readInput(__dirname));
const result2 = solve(readInput(__dirname), true);
const end = performance.now();

console.log(result, result2, `\nOperation took ${(end - start).toFixed(3)} milliseconds`);
