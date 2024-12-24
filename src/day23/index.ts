import { readInput } from '@src/utils';

/**
 * Solves both parts of the puzzle:
 *  - Part One (partTwo = false): Return the number of sets of 3 fully-connected computers.
 *  - Part Two (partTwo = true): Return the largest set of fully-connected computers (the LAN party)
 *    as a comma-separated password string.
 * 
 * Returns a number for part one, a string password for part two.
 */
function solve(input: string[], partTwo: boolean = false): number | string {
  const debugLog: string[] = [];

  // Build an adjacency list to represent the graph
  const adjacencyList: Record<string, Set<string>> = {};
  debugLog.push('[DEBUG] Building adjacency list...');
  for (const line of input) {
    const [a, b] = line.split('-');
    if (!adjacencyList[a]) adjacencyList[a] = new Set<string>();
    if (!adjacencyList[b]) adjacencyList[b] = new Set<string>();
    adjacencyList[a].add(b);
    adjacencyList[b].add(a);
  }
  debugLog.push(`[DEBUG] Adjacency list constructed with ${Object.keys(adjacencyList).length} unique computers.`);

  // If not partTwo, do the logic for counting triangles
  if (!partTwo) {
    debugLog.push('[DEBUG] Part One: Counting all fully-connected triplets...');
    // Sort the keys so we can systematically form triplets a < b < c
    const computers = Object.keys(adjacencyList).sort();
    let count = 0;

    for (let i = 0; i < computers.length; i++) {
      for (let j = i + 1; j < computers.length; j++) {
        for (let k = j + 1; k < computers.length; k++) {
          const a = computers[i];
          const b = computers[j];
          const c = computers[k];

          const isFullyConnected =
            adjacencyList[a].has(b) &&
            adjacencyList[a].has(c) &&
            adjacencyList[b].has(a) &&
            adjacencyList[b].has(c) &&
            adjacencyList[c].has(a) &&
            adjacencyList[c].has(b);

          if (isFullyConnected) {
            count++;
            debugLog.push(`[DEBUG] Found triplet: (${a}, ${b}, ${c})`);
          }
        }
      }
    }

    debugLog.push(`[DEBUG] Final triplet count (Part One): ${count}`);
    // Uncomment if you need to see debug messages:
    // console.log(debugLog.join('\n'));
    return count;
  }

  // Otherwise, partTwo logic: find the largest clique in the graph.
  debugLog.push('[DEBUG] Part Two: Finding largest set of fully-connected computers...');
  
  // We'll use a Bron–Kerbosch backtracking algorithm to find the maximum clique.
  // For reference, see https://en.wikipedia.org/wiki/Bron%E2%80%93Kerbosch_algorithm

  const nodes = Object.keys(adjacencyList);
  const bestClique: Set<string> = new Set();

  /**
   * Bron–Kerbosch with pivot
   * R: current clique
   * P: potential nodes to explore
   * X: nodes already excluded
   */
  function bronKerbosch(R: Set<string>, P: Set<string>, X: Set<string>) {
    if (P.size === 0 && X.size === 0) {
      // R is a maximal clique
      if (R.size > bestClique.size) {
        bestClique.clear();
        R.forEach((node) => bestClique.add(node));
      }
      return;
    }

    // Heuristic: pick a pivot
    // Pivot is any node from P ∪ X. We'll just pick the first node from P for simplicity.
    // Then we'll only explore nodes in P that are *not* neighbors of the pivot.
    const union = new Set<string>([...P, ...X]);
    const pivot = union.values().next().value as string; // just pick first
    const neighborsOfPivot = adjacencyList[pivot];

    // The non-neighbors of pivot in P are the only candidates we need to explore
    const candidates = [...P].filter((v) => !neighborsOfPivot.has(v));

    for (const v of candidates) {
      // Move v from P to R
      const newR = new Set(R).add(v);
      // Intersection of P with neighbors of v
      const newP = new Set([...P].filter((n) => adjacencyList[v].has(n)));
      // Intersection of X with neighbors of v
      const newX = new Set([...X].filter((n) => adjacencyList[v].has(n)));
      bronKerbosch(newR, newP, newX);

      // Remove v from P, add to X
      P.delete(v);
      X.add(v);
    }
  }

  // We'll call Bron–Kerbosch with R=Ø, P=all nodes, X=Ø initially
  bronKerbosch(new Set(), new Set(nodes), new Set());

  const largestCliqueArray = [...bestClique].sort();
  debugLog.push(`[DEBUG] Largest clique found: ${largestCliqueArray.join(',')}`);
  const password = largestCliqueArray.join(',');

  debugLog.push(`[DEBUG] Password: ${password}`);
  // Uncomment if you need to see debug messages:
  // console.log(debugLog.join('\n'));

  return password;
}

// Measure performance of the solution
const start = performance.now();
const result = solve(readInput(__dirname));        // Part One result: count of triangles
const result2 = solve(readInput(__dirname), true); // Part Two result: password string
const end = performance.now();

console.log(result, result2, `\nOperation took ${(end - start).toFixed(3)} milliseconds`);
