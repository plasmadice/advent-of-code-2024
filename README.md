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

Additionally, I'm trying my hand at a no-code version.

## Submissions

| #  | Service   | Challenge       | Link                                                                 | Mobile Ready |
|----|------------|-----------------|----------------------------------------------------------------------|--------------|
| 1  | bolt.new   | Tic Tac Toe     | [https://tictactoe.haku.lol/](https://tictactoe.haku.lol/)           | Yes          |
| 2  | v0.dev     | Snake           | [https://bl5yozb8wkm6macs2.lite.vusercontent.net/](https://bl5yozb8wkm6macs2.lite.vusercontent.net/) | No           |
| 3  | val.town   | Pong            | [https://plasmadice-hyperponggame.web.val.run](https://plasmadice-hyperponggame.web.val.run) | No           |
| 4  | bolt.new   | Piano           | [https://piano.haku.lol/](https://piano.haku.lol/)                   | Partial - Piano goes offscreen |
| 5  | Suno       | Christmas Song  | [It's Christmas and It's me](https://suno.com/song/033b255c-c576-4674-b837-886215a73497) | Yes          |
| 6  | QR Generator | "Art" QR Code | [aonocookie](https://hwhite.dev/images/blog/aonoc-2024-qr.png)       | Yes          |
| 7  | bolt.new   | Millionaire Game  | [https://cartoon-game-show.haku.lol/](https://cartoon-game-show.haku.lol/) | Partial - Bad text formatting |
| 8  | v0.dev     | Perfect Circle  | [Perfect Circle](https://i9zkujk6pncsdyogq.lite.vusercontent.net/)   | No           |
| 9  | Huggingface | Personal Jingle | [https://hwhite.dev/hosted/perfectwreck.mp3](https://hwhite.dev/hosted/perfectwreck.mp3) | No           |
| 10 | bolt.new   | Fastest Finger First | [https://fastest-finger-first.haku.lol/](https://fastest-finger-first.haku.lol/) | Yes          |
| 11 | Luma       | AI Video        | [Terror Wizard](https://hwhite.dev/hosted/aonoc-terror-wizard.mp4), [(RUNNER-UP) Dungeon Delving](https://hwhite.dev/hosted/aonoc-dungeon-delving.mp4) | Yes          |
| 12 | Huggingface | Illusion        | [Spiral Forest](https://hwhite.dev/hosted/aonoc-illusion.webp), [(RUNNER-UP) Leaf Me Alone](https://hwhite.dev/hosted/aonoc-illusion2.webp) | Yes          |
| 13 | Stable Diffusion | Me, But Epic     | [https://hwhite.dev/hosted/aonoc-me-but-epic.jpg](https://hwhite.dev/hosted/aonoc-me-but-epic.jpg) | Yes          |
| 14 | v0.dev     | 2048 Game      | [2048 Variant](https://f3whuk2nuiwm70nqx.lite.vusercontent.net/)     | No           |
| 15  | Huggingface | Penguin Protocol | [https://hwhite.dev/hosted/aonoc-penguin-protocol.png](https://hwhite.dev/hosted/aonoc-penguin-protocol.png) | Yes          |
| 16  | Huggingface | Christmas Voice Cloner | [https://hwhite.dev/hosted/arnold_christmas_wish.wav](https://hwhite.dev/hosted/aonoc-arnold-christmas-wish.mp3) | Yes          |
| 17  | Stable Diffusion | Drawing With Style | [Unreality Glasses](https://hwhite.dev/hosted/aonoc-unreality-glasses.webp) | Yes          |
| 18  | Gumloop     | YouTube to Blog Post | [Docs link](https://docs.google.com/document/d/1AjtQZK62XoO247Tpmx8xSXzaa_K7PJcV5WzrfCG_LPo/edit?usp=sharing) | Yes          |
| 19  | Huggingface | Moon Object    | [https://hwhite.dev/hosted/aonoc-tesla-moon.png](https://hwhite.dev/hosted/aonoc-tesla-moon.png) | Yes          |
| 20  | v0.dev     | Password Validation System | [Password Validator](https://bw7n67yfajnm9red2.lite.vusercontent.net/) | Yes          |
| 21  | bolt.new   | Button Chase   | [https://button-chase.haku.lol/](https://button-chase.haku.lol/)     | Partial - Timer hidden |
| 22  | v0.dev     | Guess That Flag | [Hyperflag](https://exenrlmjpp7wdp9gz.lite.vusercontent.net/)        | Yes          |
| 23  | Lovable.dev | Christmas Animation | [Cookie Clause](https://cookie-claus.haku.lol/)                     | Yes          |
| 24  | bolt.new   | Full-Stack No-Code | [Terminal Velocity](https://terminal-velocity.haku.lol)             | No           |