# [Advent of Code 2024](https://adventofcode.com/2024) Solutions

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
import { readInput } from '@src/utils';

function solve(input: string[]): any {
  return 0; // Your solution logic here
}

// Measure performance of the solution
const start = performance.now()
let result = solve(readInput(__dirname))
const end = performance.now()
console.log(result, `\nOperation took ${(end - start).toFixed(3)} milliseconds`);
```

## Utility Functions

The project includes several utility functions to help with input parsing:

- `readInput(day: number): string` - Reads the entire input file as a string
- `readLines(day: number): string[]` - Reads the input file and splits it into lines
- `readNumbers(day: number): number[]` - Reads the input file and converts each line to a number

# [Advent of No Code](https://www.adventofnocode.io/):

Additionally, I'm trying my hand at a no-code version.

# Submissions

| #  | Service   | Challenge       | Link                                                                 |
|----|------------|-----------------|----------------------------------------------------------------------|
| 1  | bolt.new   | Tic Tac Toe     | [https://tictactoe.haku.lol/](https://tictactoe.haku.lol/)             |
| 2  | v0.dev     | Snake           | [https://bl5yozb8wkm6macs2.lite.vusercontent.net/](https://bl5yozb8wkm6macs2.lite.vusercontent.net/) |
| 3  | val.town   | Pong            | [https://plasmadice-hyperponggame.web.val.run](https://plasmadice-hyperponggame.web.val.run)     |
| 4  | bolt.new   | Piano           | [https://piano.haku.lol/](https://piano.haku.lol/)                     |
| 5  | Suno       | Christmas Song  | [It's Christmas and It's me](https://suno.com/song/033b255c-c576-4674-b837-886215a73497) |
| 6  | QR Generator | QR Code | [aonocookie](https://hwhite.dev/images/blog/aonoc-2024-qr.png) |
| 7  | bolt.new   | Millionaire Game  | [https://cartoon-game-show.haku.lol/](https://cartoon-game-show.haku.lol/) |
| 8  | v0.dev     | Perfect Circle  | [https://v0.dev/chat/nWKqHo0iFaT?b=xS63T1ROmMZ](https://v0.dev/chat/nWKqHo0iFaT?b=xS63T1ROmMZ) |
| 9  | Huggingface | Personal Jingle | [https://hwhite.dev/hosted/perfectwreck.mp3](https://hwhite.dev/hosted/perfectwreck.mp3) |