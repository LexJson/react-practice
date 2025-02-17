import { useState } from "react";
// import { ReactPropTypes } from "react";

/**
 * Component that displays a single square button.
 */
function Square({ value, squareState, onSquareClick }) {
  // Display content depending on if the square has been dug, flag placed, or untouched.
  let squareDisplay;
  if (squareState == 1) {
    squareDisplay = value;
  } else if (squareState == 2) {
    squareDisplay = "f";
  } else {
    squareDisplay = "";
  }
  return (
    <button className="square" onClick={onSquareClick}>
      {squareDisplay}
    </button>
  );
}

/**
 * Component that displays a grid of Square components.
 *
 * TODO: Handles...
 */
function Board({ minefield, flagsAndDigs, rows, columns, onPlay }) {
  function handleClick(rowIndex, columnIndex) {
    // TODO: Handles differently if right or left click.

    //debug
    //console.log("handleClick", event);

    // Left click / dig:
    // if already dug, flag is on space, TODO: or game is over
    if (flagsAndDigs[rowIndex][columnIndex] > 0) {
      return;
    } //else {}

    // Update the square as dug:
    // Copy entire board array and replace the clicked square value with dug.

    const nextFlagOrDig = flagsAndDigs.slice();
    nextFlagOrDig[rowIndex][columnIndex] = 1;
    onPlay(nextFlagOrDig);
  }

  // Render the board from the given minefield array
  const squareList = minefield.map((row, rowIndex) => {
    const rowList = row.map((squareValue, columnIndex) => {
      // Render individual squares in a row
      //TODO: Different render depending on if square is dug or not.
      return (
        <Square
          key={columnIndex}
          value={squareValue}
          squareState={flagsAndDigs[rowIndex][columnIndex]}
          onSquareClick={() => handleClick(rowIndex, columnIndex)}
        />
      );
    });
    // Render rows of squares
    return (
      <div className="board-row" key={rowIndex}>
        {rowList}
      </div>
    );
  });

  return <>{squareList}</>;
}

export default function Game() {
  // TODO: values that come from difficulty selected:
  const boardRows = 15;
  const boardColumns = 20;
  const numberOfMines = 55;
  //const maxAdjacentMines = 6;
  const [lastClickIndex, setLastClickIndex] = useState([0, 0]); // The last clicked square indexes

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

  /** Returns the number of mines surrounding a given square,
   *  or -1 if the given square is a mine.
   *  Square is determined by the passed row and column indexes.
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
  /** Records where the player has:
   *  null: has not clicked
   *     0: untouched, not dug and no flag
   *     1: left clicked to 'dig'
   *     2: right clicked to place or remove a 'flag'
   */
  const [flagsAndDigs, setFlagsAndDigs] = useState(initialHistory);

  /** Updates the board after a click.
   * Is given a new board array with updated dig and flag placements.
   * nextFlagOrDig: an entire board array with the updated new flag or dig.
   */
  function handlePlay(nextFlagOrDig) {
    setFlagsAndDigs(nextFlagOrDig);
  }

  return (
    <div className="App">
      <h2>This will be minesweeper</h2>
      <div className="game">
        <Board
          minefield={minefield}
          flagsAndDigs={flagsAndDigs}
          rows={boardRows}
          columns={boardColumns}
          onPlay={handlePlay}
        />
      </div>
    </div>
  );
}
