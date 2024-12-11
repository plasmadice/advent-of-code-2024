import { readInput } from '@src/utils';

function solve(input: string[], partTwo: boolean = false): number {
    // Parse the input to get the initial numbers
    let stoneCounts = new Map<number, number>();
    // Initialize the stone counts map with the input stones and their frequencies
    input[0].split(' ').map(Number).forEach(stone => {
        stoneCounts.set(stone, (stoneCounts.get(stone) || 0) + 1);
    });

    // Determine the total number of blinks based on whether partTwo is active
    const totalBlinks = partTwo ? 75 : 25;

    // Perform the specified number of blinks
    for (let blink = 0; blink < totalBlinks; blink++) {
        const newStoneCounts = new Map<number, number>(); // Store new stone counts after this blink

        for (const [stone, count] of stoneCounts.entries()) {
            if (stone === 0) {
                // Rule 1: Replace 0 with 1, and increase the count for 1
                newStoneCounts.set(1, (newStoneCounts.get(1) || 0) + count);
            } else if (stone.toString().length % 2 === 0) {
                // Rule 2: If the stone has an even number of digits, split it into two stones
                const digits = stone.toString();
                const mid = digits.length / 2;
                const left = parseInt(digits.slice(0, mid), 10); // Left half of the digits
                const right = parseInt(digits.slice(mid), 10);   // Right half of the digits
                // Increment the counts for the resulting stones
                newStoneCounts.set(left, (newStoneCounts.get(left) || 0) + count);
                newStoneCounts.set(right, (newStoneCounts.get(right) || 0) + count);
            } else {
                // Rule 3: If none of the above, multiply the stone by 2024
                const newStone = stone * 2024;
                newStoneCounts.set(newStone, (newStoneCounts.get(newStone) || 0) + count);
            }
        }

        // Update the stone counts with the new arrangement from this blink
        stoneCounts = newStoneCounts;
    }

    // Calculate the total number of stones after all blinks
    let totalStones = 0;
    for (const count of stoneCounts.values()) {
        totalStones += count;
    }

    return totalStones; // Return the total count of stones
}

// Measure performance of the solution
const start = performance.now();
// Solve for part one (25 blinks) and part two (75 blinks)
const result = solve(readInput(__dirname)); 
const result2 = solve(readInput(__dirname), true); 
const end = performance.now();

// Log the results and the performance time
console.log(result, result2, `\nOperation took ${(end - start).toFixed(3)} milliseconds`);