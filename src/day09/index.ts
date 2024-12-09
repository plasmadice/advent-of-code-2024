import { readInput } from '@src/utils';

function solve(input: string[], partTwo: boolean = false): number {
    const diskMap = input[0];
    const blocks: (string | number)[] = [];
    const fileIDs: number[] = [];

    // Parse the disk map into alternating file lengths and free space lengths
    for (let i = 0; i < diskMap.length; i += 2) {
        const fileLength = Number(diskMap[i]);
        const freeSpaceLength = Number(diskMap[i + 1] || 0);
        if (fileLength > 0) fileIDs.push(blocks.length);
        blocks.push(...Array(fileLength).fill(fileIDs.length - 1)); // File blocks
        blocks.push(...Array(freeSpaceLength).fill('.')); // Free space blocks
    }

    if (partTwo) {
        // Part Two: Compact by moving whole files in order of decreasing file ID
        for (let fileID = fileIDs.length - 1; fileID >= 0; fileID--) {
            // Find the start index and length of the file
            const fileStart = blocks.indexOf(fileID);
            if (fileStart === -1) continue; // File is already moved or not found

            const fileLength = blocks.slice(fileStart).filter(block => block === fileID).length;

            // Search for the leftmost free span that can accommodate the file
            let freeSpanStart = -1;
            for (let i = 0; i <= blocks.length - fileLength; i++) {
                if (blocks.slice(i, i + fileLength).every(block => block === '.')) {
                    freeSpanStart = i;
                    break;
                }
            }

            // Only move the file if the free span is to the left of its current position
            if (freeSpanStart !== -1 && freeSpanStart < fileStart) {
                // Clear the file from its current position
                for (let i = fileStart; i < fileStart + fileLength; i++) {
                    blocks[i] = '.';
                }

                // Move the file to the free span
                for (let i = freeSpanStart; i < freeSpanStart + fileLength; i++) {
                    blocks[i] = fileID;
                }
            }
        }
    } else {
        // Part One: Compact by moving individual blocks to the leftmost free space
        let pointer = blocks.length - 1;
        while (pointer >= 0) {
            if (blocks[pointer] !== '.') {
                let leftmostFree = blocks.indexOf('.');
                if (leftmostFree >= 0 && leftmostFree < pointer) {
                    blocks[leftmostFree] = blocks[pointer];
                    blocks[pointer] = '.';
                }
            }
            pointer--;
        }
    }

    // Calculate checksum
    return blocks.reduce((checksum, block, position) => {
        if (block === '.') return checksum; // Skip free spaces
        return checksum as number + position * (block as number);
    }, 0) as number;
}

// Measure performance of the solution
const start = performance.now();
const result = solve(readInput(__dirname));
const result2 = solve(readInput(__dirname), true); // Solve part two
const end = performance.now();

console.log(result, result2, `\nOperation took ${(end - start).toFixed(3)} milliseconds`);
