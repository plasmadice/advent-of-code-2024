import { readInput } from '@src/utils';

function solve(input: string[], partTwo: boolean = false): number {
    const map: string[][] = input.map(line => line.split(''));
    const rows: number = map.length;
    const cols: number = map[0].length;

    const visited: boolean[][] = Array.from({ length: rows }, () => Array(cols).fill(false));

    // Directions for traversing neighbors (up, down, left, right)
    const directions: [number, number][] = [
        [-1, 0], [1, 0], [0, -1], [0, 1]
    ];

    function isValid(x: number, y: number): boolean {
        return x >= 0 && x < rows && y >= 0 && y < cols;
    }

    function dfs(x: number, y: number, plantType: string): { area: number; perimeter: number; sides: number } {
        const stack: [number, number][] = [[x, y]];
        let area: number = 0;
        let perimeter: number = 0;
        let sides: number = 0;

        while (stack.length > 0) {
            const [cx, cy] = stack.pop()!;

            if (visited[cx][cy]) continue;
            visited[cx][cy] = true;

            area++;
            let localSides = 0;

            for (const [dx, dy] of directions) {
                const nx = cx + dx;
                const ny = cy + dy;

                if (!isValid(nx, ny) || map[nx][ny] !== plantType) {
                    perimeter++;
                    localSides++;
                } else if (!visited[nx][ny]) {
                    stack.push([nx, ny]);
                }
            }

            sides += localSides;
        }

        return { area, perimeter, sides };
    }

    let totalPrice: number = 0;

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (!visited[i][j]) {
                const plantType: string = map[i][j];
                const { area, perimeter, sides } = dfs(i, j, plantType);

                if (partTwo) {
                    totalPrice += area * sides;
                } else {
                    totalPrice += area * perimeter;
                }
            }
        }
    }

    return totalPrice;
}

// Measure performance of the solution
const start: number = performance.now();
const result: number = solve(readInput(__dirname));
const result2: number = solve(readInput(__dirname), true);
const end: number = performance.now();

console.log(result, result2, `\nOperation took ${(end - start).toFixed(3)} milliseconds`);
