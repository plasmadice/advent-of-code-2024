import { readInput, quickSort } from '@src/utils';

function solve(input: string[]): any {
  let total = 0
  let l: number[] = []
  let r: number[] = []

  input
    .forEach((line) => {
      let [left, right] = line.split('  ')
      l.push(parseInt(left))
      r.push(parseInt(right))
    })

  let sortedL = quickSort(l)
  let sortedR = quickSort(r)

  for (let i = 0; i < sortedL.length; i++) {
    if (sortedL[i] && sortedR[i]) {
      total += Math.abs(sortedL[i] - sortedR[i])
    }
  }
  
  return total
}

// Measure performance of the solution
const start = performance.now()
let result = solve(readInput(__dirname))
const end = performance.now()
console.log(result, `\nOperation took ${(end - start).toFixed(3)} milliseconds`);