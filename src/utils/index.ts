import { readFileSync } from 'fs';
import { join } from 'path';

export function readInput(dirPath: string): string[] {
  return readFileSync(join(dirPath, 'input.txt'), 'utf-8')
    .trim()
    .split('\n');
}

export function readInputRaw(dirPath: string): string {
  return readFileSync(join(dirPath, 'input.txt'), 'utf-8')
    .trim();
}

export function quickSort(arr: number[]): number[] {
  if (arr.length <= 1) {
    return arr;
  }
  const pivot = arr[Math.floor(arr.length / 2)];
  const left = [];
  const right = [];

  for (let i = 0; i < arr.length; i++) {
    if (i !== Math.floor(arr.length / 2)) { // Don't include the pivot in either left or right arrays
    if (arr[i] < pivot) {
      left.push(arr[i]);
      } else {
      right.push(arr[i]);
    }
  }
}

  return [...quickSort(left), pivot, ...quickSort(right)];
}