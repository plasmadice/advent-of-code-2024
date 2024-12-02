import { readInput } from '@src/utils';

function solve(input: string[]): any {
  let count = 0

  // check to see if numbers are ascending or descending by a minimum of 1 to 3
  const checkIfSafe = (arr: number[]): Boolean => {
    const isAscending = arr[0] < arr[1];
    // console.log('isAscending', isAscending)

    for (let i = 0; i < arr.length - 1; i++) {
      const [left, right] = [arr[i], arr[i + 1]];
      // console.log('left:', left, 'right:', right)
    
      // if numbers are the same, fail
      if (arr[i] && arr[i + 1] && arr[i] === arr[i + 1]) return false;
      // console.log('Passed check 1')

      // if numbers reverse, fail
      if (isAscending && arr[i] >= arr[i + 1]) return false;
      if (!isAscending  && arr[i] <= arr[i + 1]) return false;
      // console.log('Passed check 2')

      // if numbers are not ascending or descending by a minimum of 1 to 3, fail
      if (isAscending && arr[i] +  3 < arr[i + 1]) return false;
      if (!isAscending && arr[i] - 3 > arr[i + 1]) return false;
      // console.log('Passed check 3')
    }


    // if numbers are ascending or descending by a minimum of 1 to 3, pass

    return true;
  };

  // loop through all input

  input.forEach((line) => {
    const arr = line.split(' ').map(Number);
    // console.log('arr:', arr)

    if (checkIfSafe(arr)) count++;
  });
  return count; // Your solution logic here
}

// Measure performance of the solution
const start = performance.now()
let result = solve(readInput(__dirname))
const end = performance.now()
console.log(result, `\nOperation took ${(end - start).toFixed(3)} milliseconds`);