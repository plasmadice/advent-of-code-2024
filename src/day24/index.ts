import { readInput } from '@src/utils';

/**
 * Simulates a system of boolean logic gates as described in the puzzle.
 *
 * IMPORTANT: We use BigInt arithmetic to avoid 32-bit bitwise overflow when constructing the final result.
 *
 * We have two sections in the input:
 *   1) Wire initializations: "wireName: 0 or 1"
 *   2) Gate definitions: "wireA AND|OR|XOR wireB -> wireOut"
 *
 * After simulation, the wires whose names start with "z" represent bits of an output
 * number in ascending order (z00 is the least significant bit, then z01, z02, etc.).
 *
 * This function parses the input lines, simulates the gates, and returns the decimal
 * number corresponding to the binary formed by the 'z' wires. We use BigInt internally
 * to avoid negative results due to 32-bit overflow in JavaScript.
 */
function solve(input: string[], partTwo: boolean = false): number {
  // Light logging array (for debugging)
  const logs: string[] = [];

  // Step 1. Parse the input into wire initial values and gate definitions
  const wireValues: Record<string, boolean | undefined> = {};
  const gates: {
    input1: string;
    input2: string;
    operation: 'AND' | 'OR' | 'XOR';
    output: string;
  }[] = [];

  let parsingWires = true;
  for (const line of input) {
    const trimmed = line.trim();
    if (!trimmed) {
      // Once we leave the wires section, we parse gates
      parsingWires = false;
      continue;
    }

    if (parsingWires) {
      // Try to match wire initializations like "x00: 1"
      const wireMatch = trimmed.match(/^([^:]+):\s*([01])$/);
      if (wireMatch) {
        const wireName = wireMatch[1].trim();
        const wireVal = wireMatch[2] === '1';
        wireValues[wireName] = wireVal;
        logs.push(`Initialized wire "${wireName}" to ${wireVal ? 1 : 0}`);
        continue;
      } else {
        // Switch to gate parsing
        parsingWires = false;
      }
    }

    // Now parse gate definitions: "wireA AND|OR|XOR wireB -> wireOut"
    const gateMatch = trimmed.match(/^(\S+)\s+(AND|OR|XOR)\s+(\S+)\s*->\s*(\S+)$/);
    if (gateMatch) {
      const [, input1, operation, input2, output] = gateMatch;
      gates.push({
        input1,
        input2,
        operation: operation as 'AND' | 'OR' | 'XOR',
        output,
      });
      logs.push(`Gate added: ${input1} ${operation} ${input2} -> ${output}`);
    }
  }

  // Step 2. Evaluate the gates repeatedly until no further updates
  let updated = true;
  while (updated) {
    updated = false;

    for (const gate of gates) {
      const { input1, input2, operation, output } = gate;

      // If output already has a value, skip (it won't change per puzzle statement)
      if (wireValues[output] !== undefined) {
        continue;
      }

      const val1 = wireValues[input1];
      const val2 = wireValues[input2];

      // Only evaluate if both inputs are known
      if (val1 !== undefined && val2 !== undefined) {
        let newValue: boolean;
        switch (operation) {
          case 'AND':
            newValue = val1 && val2;
            break;
          case 'OR':
            newValue = val1 || val2;
            break;
          case 'XOR':
            newValue = (val1 !== val2);
            break;
        }

        wireValues[output] = newValue;
        logs.push(
          `Evaluated gate: ${input1}=${val1 ? 1 : 0} ${operation} ${input2}=${val2 ? 1 : 0} -> ${output}=${newValue ? 1 : 0}`
        );
        updated = true;
      }
    }
  }

  // Step 3. Gather wires that start with 'z', sort by numeric suffix, and build final result
  const zWires = Object.keys(wireValues)
    .filter((name) => name.startsWith('z'))
    .sort((a, b) => {
      // Parse the numeric part after 'z' to sort them in ascending numeric order
      const aNum = parseInt(a.slice(1), 10);
      const bNum = parseInt(b.slice(1), 10);
      return aNum - bNum;
    });

  logs.push(`Final z-wire order: ${zWires.join(', ')}`);

  // Collect bits in ascending order: z00, z01, z02, ...
  // z00 is the least significant bit (rightmost in normal binary)
  // We'll build a BigInt
  let decimalValue = 0n;

  zWires.forEach((zWire, i) => {
    const bit = wireValues[zWire] ? 1n : 0n;
    // If this wire is 1, add 2^i to the BigInt
    if (bit === 1n) {
      decimalValue += (1n << BigInt(i));
    }
  });

  // For logging/debug: build a string of bits (LSB=z00 first -> zWires[0])
  const bitsRightToLeft = zWires.map((z) => (wireValues[z] ? '1' : '0'));
  logs.push(`Final binary (LSB=z00 to MSB): ${bitsRightToLeft.join('')}`);
  logs.push(`Output in BigInt decimal: ${decimalValue.toString()}`);

  if (partTwo) {
    logs.push(`Part two is not specified. Returning same result.`);
  }

  // If the final value is within the safe integer range, you can convert to number:
  const outputNumber = Number(decimalValue);

  // Uncomment to see logs
  // console.log(logs.join('\n'));

  return outputNumber;
}

// Measure performance of the solution
const start = performance.now();
const result = solve(readInput(__dirname));
const result2 = solve(readInput(__dirname), true);
const end = performance.now();

console.log(result, result2, `\nOperation took ${(end - start).toFixed(3)} milliseconds`);
