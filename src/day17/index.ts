import { readInput } from '@src/utils';

type ComputerState = {
  A: number;
  B: number;
  C: number;
  pointer: number;
  output: number[];
};

type Program = number[];

const createComputer = (registerA: number, registerB: number, registerC: number, program: Program): ComputerState => ({
  A: registerA,
  B: registerB,
  C: registerC,
  pointer: 0,
  output: [],
});

const runComputer = (state: ComputerState, program: Program): void => {
  while (state.pointer < program.length) {
    const opcode = program[state.pointer];
    const operand = program[state.pointer + 1];
    
    switch (opcode) {
      case 0: // adv
        state.A = Math.floor(state.A / (2 ** getComboValue(state, operand)));
        break;
      case 1: // bxl
        state.B ^= operand;
        break;
      case 2: // bst
        state.B = getComboValue(state, operand) % 8;
        break;
      case 3: // jnz
        if (state.A !== 0) {
          state.pointer = operand;
          continue; // Skip pointer increment
        }
        break;
      case 4: // bxc
        state.B ^= state.C;
        break;
      case 5: // out
        state.output.push(getComboValue(state, operand) % 8);
        break;
      case 6: // bdv
        state.B = Math.floor(state.A / (2 ** getComboValue(state, operand)));
        break;
      case 7: // cdv
        state.C = Math.floor(state.A / (2 ** getComboValue(state, operand)));
        break;
      default:
        throw new Error(`Unknown opcode: ${opcode}`);
    }

    state.pointer += 2;
  }
};

const getComboValue = (state: ComputerState, operand: number): number => {
  if (operand >= 0 && operand <= 3) return operand;
  if (operand === 4) return state.A;
  if (operand === 5) return state.B;
  if (operand === 6) return state.C;
  throw new Error(`Invalid combo operand: ${operand}`);
};

function solve(input: string[], partTwo = false): string | number {
  const registerA = parseInt(input[0].split(': ')[1], 10);
  const registerB = parseInt(input[1].split(': ')[1], 10);
  const registerC = parseInt(input[2].split(': ')[1], 10);
  const program = input[4].split(': ')[1].split(',').map(Number);
  
  const state = createComputer(registerA, registerB, registerC, program);
  runComputer(state, program);

  if (!partTwo) {
    return state.output.join(',');
  } 
  
  // Part two logic can be implemented here if needed
  return 0;
}

// Measure performance of the solution
const start = performance.now();
const result = solve(readInput(__dirname)); 
const result2 = solve(readInput(__dirname), true); 
const end = performance.now();

console.log(result, result2, `\nOperation took ${(end - start).toFixed(3)} milliseconds`);
