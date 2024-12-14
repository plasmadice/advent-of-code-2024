import { readInput } from '@src/utils';

interface Robot {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

function modWrap(value: number, max: number): number {
  return ((value % max) + max) % max;
}

function solve(input: string[], partTwo: boolean = false): number {
  // Dimensions for part one (with wrapping)
  const width = 101;
  const height = 103;
  const timePartOne = 100;
  const centerX = Math.floor(width / 2);   // 50
  const centerY = Math.floor(height / 2);  // 51

  const robots: Robot[] = input.filter(line => line.trim() !== '').map(line => {
    const match = line.match(/p=(-?\d+),(-?\d+)\s+v=(-?\d+),(-?\d+)/);
    if (!match) {
      throw new Error("Invalid input line: " + line);
    }
    const [, xStr, yStr, vxStr, vyStr] = match;
    return {
      x: parseInt(xStr, 10),
      y: parseInt(yStr, 10),
      vx: parseInt(vxStr, 10),
      vy: parseInt(vyStr, 10)
    };
  });

  if (!partTwo) {
    // Part One: After 100 seconds with wrapping
    const finalPositions = robots.map(r => {
      const finalX = modWrap(r.x + r.vx * timePartOne, width);
      const finalY = modWrap(r.y + r.vy * timePartOne, height);
      return { x: finalX, y: finalY };
    });

    let q1 = 0; // top-left
    let q2 = 0; // top-right
    let q3 = 0; // bottom-left
    let q4 = 0; // bottom-right

    for (const { x, y } of finalPositions) {
      if (x === centerX || y === centerY) continue;
      if (x < centerX && y < centerY) q1++;
      else if (x > centerX && y < centerY) q2++;
      else if (x < centerX && y > centerY) q3++;
      else if (x > centerX && y > centerY) q4++;
    }

    return q1 * q2 * q3 * q4;
  } else {
    // Part Two: 
    // Ignore wrapping. Assume infinite plane movement.
    // This is analogous to AoC Day 10 (2018). 
    // We'll simulate until we find the minimal bounding box area.

    let t = 0;
    let minimalArea = Number.MAX_SAFE_INTEGER;
    let minimalTime = 0;

    // We'll run until the area starts increasing after finding a minimum.
    // Typically, this doesn't take excessively long. 
    // We'll implement a loop break condition if the area grows significantly.

    let previousArea = Number.MAX_SAFE_INTEGER;
    let increasingCount = 0; // Count how many times area has increased in a row

    while (true) {
      const xs = robots.map(r => r.x + r.vx * t);
      const ys = robots.map(r => r.y + r.vy * t);
      const minX = Math.min(...xs);
      const maxX = Math.max(...xs);
      const minY = Math.min(...ys);
      const maxY = Math.max(...ys);
      const area = (maxX - minX + 1) * (maxY - minY + 1);

      if (area < minimalArea) {
        minimalArea = area;
        minimalTime = t;
        increasingCount = 0; // reset since we found a new minimum
      } else {
        // If area is increasing, increment the count
        if (area > previousArea) {
          increasingCount++;
        } else {
          // If we find an equal or smaller area after increases, reset the count
          increasingCount = 0;
        }
      }

      previousArea = area;

      // Break if we've seen the area increase several times in a row after the minimum.
      // This indicates we've passed the minimum point and the pattern has started dispersing again.
      if (increasingCount > 100) {
        // 100 is arbitrary, ensures we moved well past the minimal point.
        break;
      }

      t++;
      // As a safeguard, we can put a maximum limit here if needed, 
      // but typically these puzzles don't require going too far.
      if (t > 1_000_000) {
        // If we reach 1,000,000 without stabilizing, something is off.
        break;
      }
    }

    return minimalTime;
  }
}

// Measure performance of the solution
const start = performance.now();
const result = solve(readInput(__dirname));
const result2 = solve(readInput(__dirname), true);
const end = performance.now();

console.log(result, result2, `\nOperation took ${(end - start).toFixed(3)} milliseconds`);
