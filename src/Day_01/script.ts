// First task

// As they're making the final adjustments, they discover that their calibration document (your puzzle input)
// has been amended by a very young Elf who was apparently just excited to show off her art skills. Consequently,
// the Elves are having trouble reading the values on the document.

// The newly-improved calibration document consists of lines of text; each line originally contained a specific
// calibration value that the Elves now need to recover. On each line, the calibration value can be found by
// combining the first digit and the last digit (in that order) to form a single two-digit number.

// For example:

// 1abc2
// pqr3stu8vwx
// a1b2c3d4e5f
// treb7uchet
// In this example, the calibration values of these four lines are 12, 38, 15, and 77. Adding these together produces 142.

// Consider your entire calibration document. What is the sum of all of the calibration values?

import { data } from "./data";

function firstTask(data: string) {
  const dataArray = data.split("\n");
  let sum = 0;

  dataArray.forEach((line) => {
    // We can use regex to find all numbers in the string
    const numbers = line.match(/[1-9]/g);
    if (!numbers) {
      return;
    }
    // We can then use the first and last number to construct the number we want
    const constructedNumber =
      parseInt(numbers[0]) * 10 + parseInt(numbers[numbers.length - 1]);
    sum += constructedNumber;
  });
  return sum;
}

// console.log("First task result: ", firstTask(data));

// Second task

// Your calculation isn't quite right. It looks like some of the digits are actually spelled out with
// letters: one, two, three, four, five, six, seven, eight, and nine also count as valid "digits".

// Equipped with this new information, you now need to find the real first and last digit on each line.
// For example:

// two1nine
// eightwothree
// abcone2threexyz
// xtwone3four
// 4nineeightseven2
// zoneight234
// 7pqrstsixteen
// In this example, the calibration values are 29, 83, 13, 24, 42, 14, and 76. Adding these together produces 281.

// What is the sum of all of the calibration values?

function secondTask(data: string) {
  // The example eightwothree shows that the same letter can be used multiple times
  // specifically, in eightwo, the t is used to end eight and start two
  // to get around this, we can simply expand every word to be replaced with the same
  // word twice, but with a number in between. This way, we can simply look for numbers
  // and use the first and last one to construct the number
  const validWords = {
    one: "o1e",
    two: "t2o",
    three: "t3e",
    four: "f4r",
    five: "f5e",
    six: "s6x",
    seven: "s7n",
    eight: "e8t",
    nine: "n9e",
  };

  const dataArray = data.split("\n");
  let sum = 0;

  dataArray.forEach((line) => {
    // On each line, we replace all words with the expanded version
    let newLine = line;
    Object.keys(validWords).forEach((word) => {
      newLine = newLine.replaceAll(
        word,
        validWords[word as keyof typeof validWords]
      );
    });

    // Now we can simply filter out all of the letters
    const charArray = newLine.split("");
    const numbers = charArray.filter((char) => {
      return !isNaN(parseInt(char));
    });
    const constructedNumber =
      parseInt(numbers[0]) * 10 + parseInt(numbers[numbers.length - 1]);
    sum += constructedNumber;
  });

  return sum;
}

console.log("Second task result: ", secondTask(data));
