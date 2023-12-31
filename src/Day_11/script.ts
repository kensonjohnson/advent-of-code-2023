/*
You continue following signs for "Hot Springs" and eventually come across an 
observatory. The Elf within turns out to be a researcher studying cosmic 
expansion using the giant telescope here.

He doesn't know anything about the missing machine parts; he's only visiting 
for this research project. However, he confirms that the hot springs are the 
next-closest area likely to have people; he'll even take you straight there 
once he's done with today's observation analysis.

Maybe you can help him with the analysis to speed things up?

The researcher has collected a bunch of data and compiled the data into a 
single giant image (your puzzle input). The image includes empty space (.) 
and galaxies (#). For example:

...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....
The researcher is trying to figure out the sum of the lengths of the shortest 
path between every pair of galaxies. However, there's a catch: the universe 
expanded in the time it took the light from those galaxies to reach the observatory.

Due to something involving gravitational effects, only some space expands. In fact, 
the result is that any rows or columns that contain no galaxies should all actually 
be twice as big.

In the above example, three columns and two rows contain no galaxies:

   v  v  v
 ...#......
 .......#..
 #.........
>..........<
 ......#...
 .#........
 .........#
>..........<
 .......#..
 #...#.....
   ^  ^  ^
These rows and columns need to be twice as big; the result of cosmic expansion 
therefore looks like this:

....#........
.........#...
#............
.............
.............
........#....
.#...........
............#
.............
.............
.........#...
#....#.......
Equipped with this expanded universe, the shortest path between every pair of 
galaxies can be found. It can help to assign every galaxy a unique number:

....1........
.........2...
3............
.............
.............
........4....
.5...........
............6
.............
.............
.........7...
8....9.......
In these 9 galaxies, there are 36 pairs. Only count each pair once; order 
within the pair doesn't matter. For each pair, find any shortest path between 
the two galaxies using only steps that move up, down, left, or right exactly 
one . or # at a time. (The shortest path between two galaxies is allowed to 
pass through another galaxy.)

For example, here is one of the shortest paths between galaxies 5 and 9:

....1........
.........2...
3............
.............
.............
........4....
.5...........
.##.........6
..##.........
...##........
....##...7...
8....9.......
This path has length 9 because it takes a minimum of nine steps to get from 
galaxy 5 to galaxy 9 (the eight locations marked # plus the step onto galaxy 9 
itself). Here are some other example shortest path lengths:

Between galaxy 1 and galaxy 7: 15
Between galaxy 3 and galaxy 6: 17
Between galaxy 8 and galaxy 9: 5
In this example, after expanding the universe, the sum of the shortest path 
between all 36 pairs of galaxies is 374.

Expand the universe, then find the length of the shortest path between every 
pair of galaxies. What is the sum of these lengths?
*/

import { data } from "./data";

const testData = `...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....`;

function firstTask(data: string) {
  const dataArray = data.split("\n");

  // Expand the universe rows
  const expandedRows: string[] = [];
  dataArray.forEach((row) => {
    expandedRows.push(row);
    if (!row.includes("#")) {
      expandedRows.push(row);
    }
  });

  // Expand the universe columns
  const invertedRows: string[][] = [];
  expandedRows.forEach((row) => {
    row.split("").forEach((char, index) => {
      if (invertedRows[index] === undefined) {
        invertedRows[index] = [];
      }
      invertedRows[index].push(char);
    });
  });

  const invertedExpandedRows: string[][] = [];
  invertedRows.forEach((row) => {
    invertedExpandedRows.push(row);
    if (!row.includes("#")) {
      invertedExpandedRows.push(row);
    }
  });

  const expandedUniverse: string[][] = [];
  invertedExpandedRows.forEach((row) => {
    row.forEach((char, index) => {
      if (expandedUniverse[index] === undefined) {
        expandedUniverse[index] = [];
      }
      expandedUniverse[index].push(char);
    });
  });

  // Find all galaxies
  const galaxies: { [key: string]: { x: number; y: number } } = {};
  let galaxyCounter = 0;
  expandedUniverse.forEach((row, y) => {
    row.forEach((char, x) => {
      if (char === "#") {
        galaxyCounter++;
        galaxies[galaxyCounter] = { x, y };
      }
    });
  });

  // Sum of the shortest path between all pairs of galaxies
  let sum = 0;
  Object.keys(galaxies).forEach((galaxyKey, index) => {
    Object.keys(galaxies)
      .splice(index + 1)
      .forEach((galaxy2Key) => {
        const galaxy = galaxies[galaxyKey];
        const galaxy2 = galaxies[galaxy2Key];
        const x = Math.abs(galaxy.x - galaxy2.x);
        const y = Math.abs(galaxy.y - galaxy2.y);
        sum += x + y;
      });
  });
  return sum;
}

// console.log(firstTask(data));

/*
The galaxies are much older (and thus much farther apart) than the researcher 
initially estimated.

Now, instead of the expansion you did before, make each empty row or column one 
million times larger. That is, each empty row should be replaced with 1000000 
empty rows, and each empty column should be replaced with 1000000 empty columns.

(In the example above, if each empty row or column were merely 10 times larger, 
the sum of the shortest paths between every pair of galaxies would be 1030. If 
each empty row or column were merely 100 times larger, the sum of the shortest 
paths between every pair of galaxies would be 8410. However, your universe will 
need to expand far beyond these values.)

Starting with the same initial image, expand the universe according to these 
new rules, then find the length of the shortest path between every pair of 
galaxies. What is the sum of these lengths?
*/

function secondTask(data: string, expansionConstant = 1000000) {
  const dataArray = data.split("\n").map((row) => row.split(""));

  // Find which rows and columns are empty
  const emptyRows: number[] = [];
  const emptyColumns: number[] = [];
  dataArray.forEach((row, index) => {
    if (!row.includes("#")) {
      emptyRows.push(index);
    }
    for (const row of dataArray) {
      if (row[index] === "#") {
        return;
      }
    }
    emptyColumns.push(index);
  });

  // Find all galaxies
  const galaxies: { x: number; y: number }[] = [];
  dataArray.forEach((row, y) => {
    row.forEach((char, x) => {
      if (char === "#") {
        galaxies.push({ x, y });
      }
    });
  });

  // Sum of the shortest path between all pairs of galaxies
  // Determine if each path crosses an expanded row or column
  // If it does, add the expansionConstant to the path length
  let sum = 0;
  galaxies.forEach((galaxy, index) => {
    for (let i = index + 1; i < galaxies.length; i++) {
      const galaxy2 = galaxies[i];
      let additionalX = 0;
      let additionalY = 0;
      emptyColumns.forEach((column) => {
        if (galaxy.x < galaxy2.x) {
          if (galaxy.x < column && galaxy2.x > column) {
            additionalX += expansionConstant - 1;
          }
        } else {
          if (galaxy2.x < column && galaxy.x > column) {
            additionalX += expansionConstant - 1;
          }
        }
      });
      emptyRows.forEach((row) => {
        if (galaxy.y < row && galaxy2.y > row) {
          additionalY += expansionConstant - 1;
        }
      });
      const x = Math.abs(galaxy.x - galaxy2.x) + additionalX;
      const y = Math.abs(galaxy.y - galaxy2.y) + additionalY;
      sum += x + y;
    }
  });

  return sum;
}

console.log(secondTask(testData, 10)); // expected: 1030
console.log(secondTask(testData, 100)); // expected: 8410
console.log(secondTask(data));
