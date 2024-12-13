import { readInput } from '@src/utils';

interface Machine {
  Ax: number;
  Ay: number;
  Bx: number;
  By: number;
  Px: number;
  Py: number;
}

// Parse the input lines into a list of Machines
function parseInput(input: string[]): Machine[] {
  const machines: Machine[] = [];
  
  for (let i = 0; i < input.length; i++) {
    const lineA = input[i].trim();
    if (!lineA.startsWith("Button A:")) continue;
    const lineB = input[i+1]?.trim();
    const lineP = input[i+2]?.trim();
    i += 2;
    
    const parseButton = (line: string) => {
      // Example: "Button A: X+94, Y+34"
      const parts = line.split(':')[1].trim().split(',');
      const xPart = parts[0].trim(); // "X+94"
      const yPart = parts[1].trim(); // "Y+34"
      const xVal = parseInt(xPart.replace(/[X+]/g, ''), 10);
      const yVal = parseInt(yPart.replace(/[Y+]/g, ''), 10);
      return { xVal, yVal };
    };

    const parsePrize = (line: string) => {
      // Example: "Prize: X=8400, Y=5400"
      const parts = line.split(':')[1].trim().split(',');
      const xPart = parts[0].trim(); // "X=8400"
      const yPart = parts[1].trim(); // "Y=5400"
      const Px = parseInt(xPart.replace('X=', ''), 10);
      const Py = parseInt(yPart.replace('Y=', ''), 10);
      return { Px, Py };
    };
    
    const { xVal: Ax, yVal: Ay } = parseButton(lineA);
    const { xVal: Bx, yVal: By } = parseButton(lineB);
    const { Px, Py } = parsePrize(lineP);
    
    machines.push({ Ax, Ay, Bx, By, Px, Py });
  }
  
  return machines;
}

/**
 * Solve a single machine configuration to determine the minimum token cost.
 * For part one: We assume a ≤ 100 and b ≤ 100 (the original problem hint).
 * For part two: We must handle very large coordinates and no simple brute force
 */
function solveMachine(machine: Machine, partTwo: boolean): number | null {
  const { Ax, Ay, Bx, By } = machine;
  let { Px, Py } = machine;
  
  // For part two, apply the correction:
  if (partTwo) {
    const offset = 10000000000000;
    Px += offset;
    Py += offset;
  }
  
  if (!partTwo) {
    // Part one approach: brute force (a,b ≤ 100)
    let minCost: number | null = null;
    for (let a = 0; a <= 100; a++) {
      for (let b = 0; b <= 100; b++) {
        const xPos = Ax * a + Bx * b;
        const yPos = Ay * a + By * b;
        if (xPos === Px && yPos === Py) {
          const cost = 3 * a + b;
          if (minCost === null || cost < minCost) {
            minCost = cost;
          }
        }
      }
    }
    return minCost;
  } else {
    // Part two approach: Solve linear equations exactly
    // System:
    //   Ax*a + Bx*b = Px
    //   Ay*a + By*b = Py
    //
    // Determinant D = Ax*By - Ay*Bx
    const D = Ax * By - Ay * Bx;
    if (D === 0) {
      // No unique solution. Either no solution or infinite solutions.
      // Check if there's a solution at all.
      
      // If D=0 and we want to see if any solution exists:
      // For a solution to exist: (Px, Py) must lie in the same linear combination
      // i.e. Ax/ Ay = Bx/ By = Px/ Py if non-zero, or both zero.
      // Let's check consistency:
      const eq1 = (Ax === 0 && Bx === 0 && Px === 0) || (Ax !== 0 || Bx !== 0);
      const eq2 = (Ay === 0 && By === 0 && Py === 0) || (Ay !== 0 || By !== 0);
      if (!eq1 || !eq2) {
        return null; // no solution
      }

      return null;
    }

    // If D != 0:
    // a = (Px*By - Py*Bx) / D
    // b = (Py*Ax - Px*Ay) / D
    const aNum = Px * By - Py * Bx;
    const bNum = Py * Ax - Px * Ay;

    // a and b must be integers and non-negative
    // Check divisibility
    if (aNum % D !== 0 || bNum % D !== 0) {
      return null; // no integral solution
    }

    const a = aNum / D;
    const b = bNum / D;

    if (a < 0 || b < 0) {
      return null; // no non-negative solution
    }

    // Compute cost
    const cost = 3 * a + b;
    return cost;
  }
}

/**
 * We want to find the maximum number of prizes that can be won and the minimum total cost 
 * to achieve that maximum number of prizes.
 */
function solve(input: string[], partTwo: boolean = false): number {
  const machines = parseInput(input);
  
  // Solve each machine
  const costs: number[] = [];
  for (const m of machines) {
    const c = solveMachine(m, partTwo);
    if (c !== null) {
      costs.push(c);
    }
  }

  // If no prizes can be won
  if (costs.length === 0) {
    return 0;
  }

  // Max prizes = all solvable machines, min total cost = sum of their minimal costs
  const minTotalCost = costs.reduce((acc, c) => acc + c, 0);
  return minTotalCost;
}

// Measure performance of the solution
const start = performance.now();
const result = solve(readInput(__dirname));       // Part one
const result2 = solve(readInput(__dirname), true); // Part two
const end = performance.now();

console.log(result, result2, `\nOperation took ${(end - start).toFixed(3)} milliseconds`);
