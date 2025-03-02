import { useState } from "react";
// import { ReactPropTypes } from "react";
import { Board } from "./Board";
import calculateWin from "./CalculateWin";

export default function Game() {
  // TODO: values that come from difficulty selected
  const boardRows = 15; // small:10, medium:15
  const boardColumns = 20; // small:14, medium:20
  const numberOfMines = 55; // small:25, medium:55
  const [status, setStatus] = useState("");
  const [flagsRemaining, setFlagsRemaining] = useState(0);

  // Generate the minefield --------------------------------------------
  // First populate a list with empty mine locations
  // BAD - All arrays are the same: let initialMinefield = Array(boardRows).fill(Array(boardColumns).fill(0));
  let initialMinefield = [];
  for (let i = 0; i < boardRows; i++) {
    // Each time create new row array
    let newRow = [];
    for (let j = 0; j < boardColumns; j++) {
      // Add items to the current new row
      newRow.push(0);
    }
    initialMinefield.push(newRow);
  }

  // List of all the available indexes for placing mines.
  let availableIndexes = [];
  for (let i = 0; i < boardRows; i++) {
    for (let j = 0; j < boardColumns; j++) {
      availableIndexes.push([i, j]);
    }
  }

  // Place mines at random at available indexes.
  for (let x = 0; x < numberOfMines; x++) {
    // Get random pair of indexes.
    // Math.floor(Math.random() * x) gives a number with no decimals ("integer") between 0 to x-1.
    let randomIndex = Math.floor(Math.random() * availableIndexes.length);
    let availableIndexesPair = availableIndexes[randomIndex];
    let rowIndex = availableIndexesPair[0];
    let columnIndex = availableIndexesPair[1];

    // Set the mine at the random index.
    initialMinefield[rowIndex][columnIndex] = -1;

    // For debug:
    // console.log(rowIndex, columnIndex);
    // initialMinefield.forEach((item, i) => {
    //   console.log("row ", i, ": ", item);
    // });

    // Remove the just used index from the available index list.
    availableIndexes.splice(randomIndex, 1);
  }

  /**
   * Returns the number of mines surrounding a given square,
   * or -1 if the given square is a mine.
   * Square is determined by the passed row and column indexes.
   */
  function countAdjacentMines(rowIndex, columnIndex) {
    let adjacentMines = 0;

    if (initialMinefield[rowIndex][columnIndex] != -1) {
      // Check each of the 8 potential squares surrounding the given square.
      const surroundingIndexes = [
        [rowIndex - 1, columnIndex - 1], // top left
        [rowIndex - 1, columnIndex], // top center
        [rowIndex - 1, columnIndex + 1], // top right
        [rowIndex, columnIndex - 1], // middle left
        [rowIndex, columnIndex + 1], // middle right
        [rowIndex + 1, columnIndex - 1], // bottom left
        [rowIndex + 1, columnIndex], // bottom center
        [rowIndex + 1, columnIndex + 1], // bottom right
      ];

      surroundingIndexes.forEach((indexes) => {
        // Check the row and column indexes are within the range of the arrays.
        if (
          indexes[0] >= 0 &&
          indexes[0] < boardRows &&
          indexes[1] >= 0 &&
          indexes[1] < boardColumns
        ) {
          // Index is valid, so check for a mine.
          if (initialMinefield[indexes[0]][indexes[1]] == -1) {
            adjacentMines++;
          }
        }
      });
    } else {
      // Return the mine value (-1) to continue showing that square is a mine.
      adjacentMines = -1;
    }

    return adjacentMines;
  }

  // Calculate adjacent mines for each square
  for (let i = 0; i < boardRows; i++) {
    // Each time create new row array
    for (let j = 0; j < boardColumns; j++) {
      // Add items to the current new row
      let adjacentMines = countAdjacentMines(i, j);
      initialMinefield[i][j] = adjacentMines;
    }
  }

  /** Lists how many mines surround each mine.
   *    -1: mine
   *   0-8: number of adjacent mines
   */
  const [minefield, setMinefield] = useState(initialMinefield);
  //-----------------------------------------------------------------

  // Initialize array for flags and digs history
  let initialHistory = [];
  for (let i = 0; i < boardRows; i++) {
    // Each time create new row array
    let newRow = [];
    for (let j = 0; j < boardColumns; j++) {
      // Add items to the current new row
      newRow.push(0);
    }
    initialHistory.push(newRow);
  }
  /**
   * Records if each square has nothing, a dug spot, or a flag.
   *     0: nothing, not dug and currently no flag
   *     1: has been left clicked to 'dig'
   *     2: has been right clicked to place a 'flag'
   *        (Note: Flags can be placed and removed with right click)
   */
  const [flagsAndDigs, setFlagsAndDigs] = useState(initialHistory);

  /**
   * Updates the board after a click.
   * Is given a new board array with updated dig and flag placements.
   */
  function handlePlay(nextFlagOrDig) {
    setFlagsAndDigs(nextFlagOrDig);

    const gameIsWon = calculateWin(
      minefield,
      flagsAndDigs,
      boardRows,
      boardColumns,
      numberOfMines
    );

    if (gameIsWon == null) {
      //status = gameIsWon ? "You Win!" : "You Lose";
      setStatus("");
    } else if (!gameIsWon) {
      setStatus("You Lose");
    } else if (gameIsWon) {
      setStatus("You Win");
    }
  }

  return (
    <div className="App">
      <div className="header" style={{ width: boardColumns * 34 }}>
        {/* <h2>This will be minesweeper</h2> */}
        <div className="flags-remaining">{flagsRemaining}</div>
        <div className="status">{status}</div>
        <div className="timer">{"000"}</div>
      </div>

      <div className="board">
        <Board
          minefield={minefield}
          flagsAndDigs={flagsAndDigs}
          rows={boardRows}
          columns={boardColumns}
          onPlay={handlePlay}
          numberOfMines={numberOfMines}
        />
      </div>
    </div>
  );
}
