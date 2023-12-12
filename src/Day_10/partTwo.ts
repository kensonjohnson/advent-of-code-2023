/* 
You quickly reach the farthest point of the loop, but the animal never emerges. 
Maybe its nest is within the area enclosed by the loop?

To determine whether it's even worth taking the time to search for such a nest, 
you should calculate how many tiles are contained within the loop. For example:

...........
.S-------7.
.|F-----7|.
.||.....||.
.||.....||.
.|L-7.F-J|.
.|..|.|..|.
.L--J.L--J.
...........
The above loop encloses merely four tiles - the two pairs of . in the southwest 
and southeast (marked I below). The middle . tiles (marked O below) are not in 
the loop. Here is the same loop again with those regions marked:

...........
.S-------7.
.|F-----7|.
.||OOOOO||.
.||OOOOO||.
.|L-7OF-J|.
.|II|O|II|.
.L--JOL--J.
.....O.....
In fact, there doesn't even need to be a full tile path to the outside for tiles 
to count as outside the loop - squeezing between pipes is also allowed! Here, I 
is still within the loop and O is still outside the loop:

..........
.S------7.
.|F----7|.
.||OOOO||.
.||OOOO||.
.|L-7F-J|.
.|II||II|.
.L--JL--J.
..........
In both of the above examples, 4 tiles are enclosed by the loop.

Here's a larger example:

.F----7F7F7F7F-7....
.|F--7||||||||FJ....
.||.FJ||||||||L7....
FJL7L7LJLJ||LJ.L-7..
L--J.L7...LJS7F-7L7.
....F-J..F7FJ|L7L7L7
....L7.F7||L7|.L7L7|
.....|FJLJ|FJ|F7|.LJ
....FJL-7.||.||||...
....L---J.LJ.LJLJ...
The above sketch has many random bits of ground, some of which are in the loop 
(I) and some of which are outside it (O):

OF----7F7F7F7F-7OOOO
O|F--7||||||||FJOOOO
O||OFJ||||||||L7OOOO
FJL7L7LJLJ||LJIL-7OO
L--JOL7IIILJS7F-7L7O
OOOOF-JIIF7FJ|L7L7L7
OOOOL7IF7||L7|IL7L7|
OOOOO|FJLJ|FJ|F7|OLJ
OOOOFJL-7O||O||||OOO
OOOOL---JOLJOLJLJOOO
In this larger example, 8 tiles are enclosed by the loop.

Any tile that isn't part of the main loop can count as being enclosed by the loop. 
Here's another example with many bits of junk pipe lying around that aren't 
connected to the main loop at all:

FF7FSF7F7F7F7F7F---7
L|LJ||||||||||||F--J
FL-7LJLJ||||||LJL-77
F--JF--7||LJLJ7F7FJ-
L---JF-JLJ.||-FJLJJ7
|F|F-JF---7F7-L7L|7|
|FFJF7L7F-JF7|JL---7
7-L-JL7||F7|L7F-7F7|
L.L7LFJ|||||FJL7||LJ
L7JLJL-JLJLJL--JLJ.L
Here are just the tiles that are enclosed by the loop marked with I:

FF7FSF7F7F7F7F7F---7
L|LJ||||||||||||F--J
FL-7LJLJ||||||LJL-77
F--JF--7||LJLJIF7FJ-
L---JF-JLJIIIIFJLJJ7
|F|F-JF---7IIIL7L|7|
|FFJF7L7F-JF7IIL---7
7-L-JL7||F7|L7F-7F7|
L.L7LFJ|||||FJL7||LJ
L7JLJL-JLJLJL--JLJ.L
In this last example, 10 tiles are enclosed by the loop.

Figure out whether you have time to search for the nest by calculating the area 
within the loop. How many tiles are enclosed by the loop?
*/

import { data } from "./data";

type Point = readonly [number, number]; // y, x

type Direction = "top" | "down" | "left" | "right";

type Position = {
  point: Point;
  direction: Direction;
};

function getStartingPoint(map: string[][]): [number, number] {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x] === "S") {
        return [y, x];
      }
    }
  }
  throw "no starting point";
}

function getNextPosition(val: string, position: Position): Position {
  const { direction, point } = position;

  if (["-", "|"].includes(val)) {
    return newPosition(direction, point);
  }

  if (direction === "top") {
    if (val === "F") {
      return newPosition("right", point);
    }
    if (val === "7") {
      return newPosition("left", point);
    }
  }

  if (direction === "down") {
    if (val === "L") {
      return newPosition("right", point);
    }
    if (val === "J") {
      return newPosition("left", point);
    }
  }

  if (direction === "right") {
    if (val === "J") {
      return newPosition("top", point);
    }
    if (val === "7") {
      return newPosition("down", point);
    }
  }

  if (direction === "left") {
    if (val === "F") {
      return newPosition("down", point);
    }
    if (val === "L") {
      return newPosition("top", point);
    }
  }

  throw `unhandled next position (direction: ${direction}, val: ${val})`;
}

function getStartingPositions(
  map: string[][],
  startingPoint: Point
): Position[] {
  const positions: Position[] = [];
  const topPoint = top(startingPoint);
  const bottomPoint = down(startingPoint);
  const rightPoint = right(startingPoint);
  const leftPoint = left(startingPoint);

  if (startingPoint[0] > 0 && ["|", "F", "7"].includes(getVal(map, topPoint))) {
    positions.push({
      direction: "top",
      point: topPoint,
    });
  }

  if (
    startingPoint[0] <= map.length - 1 &&
    ["|", "L", "J"].includes(getVal(map, bottomPoint))
  ) {
    positions.push({
      direction: "down",
      point: bottomPoint,
    });
  }

  if (
    startingPoint[1] <= map[0].length - 1 &&
    ["-", "7", "J"].includes(getVal(map, rightPoint))
  ) {
    positions.push({
      direction: "right",
      point: rightPoint,
    });
  }

  if (
    startingPoint[1] > 0 &&
    ["-", "F", "L"].includes(getVal(map, leftPoint))
  ) {
    positions.push({
      direction: "left",
      point: leftPoint,
    });
  }

  return positions;
}

function getVal(map: string[][], [y, x]: Point) {
  return map[y][x];
}

function newPosition(direction: Direction, point: Point): Position {
  return {
    direction,
    point: pointByDirection(direction, point),
  };
}

function pointByDirection(direction: Direction, point: Point): Point {
  return { top, down, right, left }[direction](point);
}

function top([y, x]: Point): Point {
  return [y - 1, x];
}

function down([y, x]: Point): Point {
  return [y + 1, x];
}

function right([y, x]: Point): Point {
  return [y, x + 1];
}

function left([y, x]: Point): Point {
  return [y, x - 1];
}

function areEqual([ya, xa]: Point, [yb, xb]: Point) {
  return ya === yb && xa === xb;
}

/**
 * Pick's theorem (https://en.wikipedia.org/wiki/Pick%27s_theorem)
 * loopArea = interiorPointsCount + (boundaryPointsCount / 2) - 1
 *
 * Part 2 answer is interiorPointsCount
 * transforming Pick's formula:
 * interiorPointsCount = loopArea - (boundaryPointsCount / 2) + 1
 *
 * boundaryPointsCount is length of loop (practically part1 answer * 2)
 *
 * loopArea can by calculated using Shoelace formula (https://en.wikipedia.org/wiki/Shoelace_formula):
 * vertices = (x1, y1) (x2, y2) (x3, y3) ...
 * 2 * loopArea = x1 * y2 - y1 * x2 + x2 * y3 - x3 * y2 + ...
 * loopArea = result / 2
 */
function secondTask(data: string) {
  const map = data.split("\n").map((line) => line.split(""));
  // boundaryPointsCount == part1Answer * 2
  const { vertices, boundaryPointsCount } = getLoopData(map);
  const loopArea = getAreaUsingShoelaceFormula(vertices);

  // interiorPointsCount
  return loopArea - boundaryPointsCount / 2 + 1;
}

function getLoopData(map: string[][]): {
  vertices: Point[];
  boundaryPointsCount: number;
} {
  const startingPoint = getStartingPoint(map);
  const vertices: Point[] = [startingPoint];

  let boundaryPointsCount = 1;
  let currentPosition = getStartingPositions(map, startingPoint)[0];

  while (!areEqual(currentPosition.point, startingPoint)) {
    const val = getVal(map, currentPosition.point);
    if (["F", "7", "L", "J"].includes(val)) {
      vertices.push(currentPosition.point);
    }
    currentPosition = getNextPosition(val, currentPosition);
    boundaryPointsCount++;
  }

  return { vertices, boundaryPointsCount };
}

function getAreaUsingShoelaceFormula(vertices: Point[]): number {
  let area = 0;

  for (let i = 0; i < vertices.length; i++) {
    const nextIndex = (i + 1) % vertices.length;
    const [currentY, currentX] = vertices[i];
    const [nextY, nextX] = vertices[nextIndex];
    area += currentX * nextY - currentY * nextX;
  }

  area = Math.abs(area) / 2;

  return area;
}

console.log(secondTask(data));
