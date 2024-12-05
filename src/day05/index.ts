import { readInput } from "@src/utils"

function solve(input: string[]): any {
  const rules: [number, number][] = []
  let updates: number[][] = []

  // Separate rules and updates from the input
  for (let i = 0; i < input.length; i++) {
    if (input[i].includes("|")) {
      const [x, y] = input[i].split("|").map(Number)
      rules.push([x, y])
    } else if (input[i]) {
      updates.push(input[i].split(",").map(Number))
    }
  }

  // Function to check if an update is valid based on the given rules
  function isValidUpdate(update: number[], rules: [number, number][]): boolean {
    // If EVERY rule is satisfied by the update, it is valid
    // rule[0] must appear before rule[1] in the update for the update to be valid
    for (const rule of rules) {
      const indexX = update.indexOf(rule[0])
      const indexY = update.indexOf(rule[1])

      // if rule[0] is found AFTER rule[1], it is invalid
      if (indexX > indexY && indexY !== -1) {
        return false
      }
    }

    return true
  }

  let middleSum = 0

  // Iterate through each update and check if it is valid based on the rules
  for (const update of updates) {
    if (isValidUpdate(update, rules)) {
      const middleIndex = Math.floor(update.length / 2)
      middleSum += update[middleIndex]
    }
  }

  return middleSum
}

// Measure performance of the solution
const start = performance.now()
let result = solve(readInput(__dirname))
const end = performance.now()
console.log(result, `\nOperation took ${(end - start).toFixed(3)} milliseconds`)
