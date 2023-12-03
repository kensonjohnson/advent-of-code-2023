/*
You and the Elf eventually reach a gondola lift station; he says the gondola lift will
take you up to the water source, but this is as far as he can bring you. You go inside.

It doesn't take long to find the gondolas, but there seems to be a problem: they're not moving.

"Aaah!"

You turn around to see a slightly-greasy Elf with a wrench and a look of surprise. "Sorry,
I wasn't expecting anyone! The gondola lift isn't working right now; it'll still be a while
before I can fix it." You offer to help.

The engineer explains that an engine part seems to be missing from the engine, but nobody can
figure out which one. If you can add up all the part numbers in the engine schematic, it
should be easy to work out which part is missing.

The engine schematic (your puzzle input) consists of a visual representation of the engine. 
There are lots of numbers and symbols you don't really understand, but apparently any number 
adjacent to a symbol, even diagonally, is a "part number" and should be included in your sum. 
(Periods (.) do not count as a symbol.)

Here is an example engine schematic:

467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..
In this schematic, two numbers are not part numbers because they are not adjacent to a symbol: 
114 (top right) and 58 (middle right). Every other number is adjacent to a symbol and so is a 
part number; their sum is 4361.

Of course, the actual engine schematic is much larger. What is the sum of all of the part numbers
in the engine schematic?
*/

import { data } from "./data";

const test = `467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`;

function firstTask(data: string) {
  const neighbours = [
    [1, -1], // top left
    [1, 0], // top
    [1, 1], // top right
    [0, 1], // right
    [-1, 1], // bottom right
    [-1, 0], // bottom
    [-1, -1], // bottom left
    [0, -1], // left
  ];

  const dataArray = data.split("\n").map((row) => row.split(""));
  const seen: boolean[][] = [];
  dataArray.forEach((row) => {
    seen.push(row.map((_) => false));
  });
  let sum = 0;
  // walk the martix from top left to bottom right
  // if the current element is symbol, search surrounding elements
  // for numbers and add them to the sum, marking them as seen
  // so they are not counted again
  dataArray.forEach((row, rowIndex) => {
    row.forEach((element, columnIndex) => {
      if (element === ".") {
        seen[rowIndex][columnIndex] = true;
      }
      if (seen[rowIndex][columnIndex]) {
        return;
      }
      if (Number.isInteger(parseInt(element))) return;
      // walk the neighbours
      neighbours.forEach((neighbour) => {
        const neighbourRow = rowIndex + neighbour[0];
        const neighbourColumn = columnIndex + neighbour[1];
        if (
          neighbourRow < 0 ||
          neighbourRow >= dataArray.length ||
          neighbourColumn < 0 ||
          neighbourColumn >= dataArray[0].length ||
          seen[neighbourRow][neighbourColumn]
        )
          return;
        const neighbourElement = dataArray[neighbourRow][neighbourColumn];
        if (Number.isInteger(parseInt(neighbourElement))) {
          const partNumber = parsePartNumber(
            neighbourRow,
            neighbourColumn,
            dataArray,
            seen
          );
          console.log("partNumber: ", partNumber);
          sum += partNumber;
        }
      });
    });
  });
  return sum;
}

function parsePartNumber(
  row: number,
  column: number,
  dataArray: string[][],
  seen: boolean[][]
) {
  let partNumberIndex = findStartIndexOfPartNumber(dataArray[row], column);
  let partNumber = 0;

  while (
    partNumberIndex < dataArray[row].length &&
    Number.isInteger(parseInt(dataArray[row][partNumberIndex]))
  ) {
    partNumber = partNumber * 10 + parseInt(dataArray[row][partNumberIndex]);
    seen[row][partNumberIndex] = true;
    partNumberIndex++;
  }
  return partNumber;
}

function findStartIndexOfPartNumber(row: string[], index: number) {
  while (index >= 0 && Number.isInteger(parseInt(row[index - 1]))) {
    index--;
  }
  return index;
}

// console.log(firstTask(data));

/*
The engineer finds the missing part and installs it in the engine! As the engine springs
to life, you jump in the closest gondola, finally ready to ascend to the water source.

You don't seem to be going very fast, though. Maybe something is still wrong? Fortunately,
the gondola has a phone labeled "help", so you pick it up and the engineer answers.

Before you can explain the situation, she suggests that you look out the window. There
stands the engineer, holding a phone in one hand and waving with the other. You're going
so slowly that you haven't even left the station. You exit the gondola.

The missing part wasn't the only issue - one of the gears in the engine is wrong. A gear
is any * symbol that is adjacent to exactly two part numbers. Its gear ratio is the result
of multiplying those two numbers together.

This time, you need to find the gear ratio of every gear and add them all up so that the
engineer can figure out which gear needs to be replaced.

Consider the same engine schematic again:

467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..

In this schematic, there are two gears. The first is in the top left; it has part numbers 467
and 35, so its gear ratio is 16345. The second gear is in the lower right; its gear ratio is
451490. (The * adjacent to 617 is not a gear because it is only adjacent to one part number.)
Adding up all of the gear ratios produces 467835.

What is the sum of all of the gear ratios in your engine schematic?
*/

function secondTask(data: string) {
  const dataArray = data.split("\n").map((row) => row.split(""));
  let sum = 0;
  dataArray.forEach((row, rowIndex) => {
    row.forEach((element, columnIndex) => {
      if (element !== "*") return;
      sum += parseGearRatio(
        dataArray.slice(rowIndex - 1, rowIndex + 2),
        columnIndex
      );
    });
  });

  return sum;
}

function parseGearRatio(dataSubArray: string[][], gearIndex: number) {
  const neighbours = [
    [1, -1], // top left
    [1, 0], // top
    [1, 1], // top right
    [0, 1], // right
    [-1, 1], // bottom right
    [-1, 0], // bottom
    [-1, -1], // bottom left
    [0, -1], // left
  ];
  const seen: boolean[][] = [];
  dataSubArray.forEach((row) => {
    seen.push(row.map((_) => false));
  });

  const partNumbers: number[] = [];

  neighbours.forEach((neighbour) => {
    const neighbourRow = 1 + neighbour[0];
    const neighbourColumn = gearIndex + neighbour[1];
    if (
      neighbourRow < 0 ||
      neighbourRow >= dataSubArray.length ||
      neighbourColumn < 0 ||
      neighbourColumn >= dataSubArray[0].length ||
      seen[neighbourRow][neighbourColumn]
    ) {
      return;
    }

    const neighbourElement = dataSubArray[neighbourRow][neighbourColumn];
    if (Number.isInteger(parseInt(neighbourElement))) {
      let partNumberIndex = neighbourColumn;
      while (
        partNumberIndex < dataSubArray[neighbourRow].length &&
        Number.isInteger(
          parseInt(dataSubArray[neighbourRow][partNumberIndex - 1])
        )
      ) {
        partNumberIndex--;
      }
      let partNumber = 0;
      while (
        partNumberIndex < dataSubArray[neighbourRow].length &&
        Number.isInteger(parseInt(dataSubArray[neighbourRow][partNumberIndex]))
      ) {
        partNumber =
          partNumber * 10 +
          parseInt(dataSubArray[neighbourRow][partNumberIndex]);
        seen[neighbourRow][partNumberIndex] = true;
        partNumberIndex++;
      }
      partNumbers.push(partNumber);
    }
  });
  return partNumbers.length === 2 ? partNumbers[0] * partNumbers[1] : 0;
}

console.log(secondTask(data));
