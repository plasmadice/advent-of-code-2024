# Advent of Code 2024 Solutions

This repository contains my solutions for [Advent of Code 2024](https://adventofcode.com/2024) implemented in TypeScript.

## Project Structure

```
advent-of-code-2024/
├── src/
│   ├── utils/        # Shared utility functions
│   └── dayXX/        # Daily solutions
│       ├── index.ts  # Main entry point for each day
│       └── input.txt # Input file for the puzzle
├── scripts/          # Helper scripts
└── package.json
```

## Setup

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

## Usage

### Creating a New Day's Solution

To scaffold a new day's solution:

```bash
npm run new [day]
```

This will create:
- `src/dayXX/index.ts` - Solution template with part1 and part2 functions
- `src/dayXX/input.txt` - Empty input file for the puzzle


If no day is specified, it will use the current date.

### Running Solutions

To run a specific day's solution:

```bash
npm start [day]
```

## Solution Structure

Each day's solution follows this template:

```typescript
import { readInput } from '@utils/input';

function solve(input: string[]): any {
  return 0; // Your solution logic here
}

if (require.main === module) {
  const result = solve(readInput(__dirname));
  console.log(result);
}
```

## Utility Functions

The project includes several utility functions to help with input parsing:

- `readInput(day: number): string` - Reads the entire input file as a string
- `readLines(day: number): string[]` - Reads the input file and splits it into lines
- `readNumbers(day: number): number[]` - Reads the input file and converts each line to a number