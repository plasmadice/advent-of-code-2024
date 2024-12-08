import { readFileSync } from "fs"
import { join } from "path"

export function readInput(dirPath: string): string[] {
  return readFileSync(join(dirPath, "input.txt"), "utf-8").trim().split("\n")
}

export function readInputRaw(dirPath: string): string {
  return readFileSync(join(dirPath, "input.txt"), "utf-8").trim()
}

export function quickSort(arr: number[]): number[] {
  if (arr.length <= 1) {
    return arr
  }
  const pivot = arr[Math.floor(arr.length / 2)]
  const left = []
  const right = []

  for (let i = 0; i < arr.length; i++) {
    if (i !== Math.floor(arr.length / 2)) {
      // Don't include the pivot in either left or right arrays
      if (arr[i] < pivot) {
        left.push(arr[i])
      } else {
        right.push(arr[i])
      }
    }
  }

  return [...quickSort(left), pivot, ...quickSort(right)]
}

export function depthFirstSearch(graph: Record<string, string[]>, start: string): any {
  const visited = new Set()
  const stack: string[] = [start]

  while (stack.length > 0) {
    const current = stack.pop()!
    if (!visited.has(current)) {
      visited.add(current)
      stack.push(...graph[current])
    }
  }

  return Array.from(visited)
}

// Helper to calculate GCD for normalizing line steps
export function gcdCalc(a: number, b: number): number {
  return b === 0 ? Math.abs(a) : gcdCalc(b, a % b);
}
