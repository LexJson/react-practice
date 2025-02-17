import React from "react";
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
    <button
      className="square"
      onClick={onSquareClick}
      onContextMenu={onSquareClick}
    >
      {squareDisplay}
    </button>
  );
}

/**
 * Component that displays a grid of Square components.
 * Handles when a Square is clicked, and passes updated data to the Game.
 */
function Board({ minefield, flagsAndDigs, rows, columns, onPlay }) {
  // OLD:  function handleClick(rowIndex, columnIndex) {}

  /**
   * Occurs when one of the Board's Squares are clicked.
   * Determines what happens after a right or left click.
   * For the given Square(by its indexes) either nothing happens, it gets dug, or a flag is placed or removed.
   * rowIndex: row indedx of the clicked Square.
   * columnIndex: column index of the clicked Square.
   * event: the event passed from the clicked Square. Used to determine right/left click.
   */
  const handleClick = React.useCallback((rowIndex, columnIndex, event) => {
    /** The state of the Square that was just clicked. */
    const currentSquareState = flagsAndDigs[rowIndex][columnIndex];

    // Prevent context menu from opening on right click
    event.preventDefault();

    // if the square is already dug, or TODO: the game has ended (|| gameFinished),
    // no new actions/clicks should update anything.
    if (currentSquareState == 1) {
      return;
    } // else {}

    /** Make a copy of the board to update and pass to Game. */
    const nextFlagOrDig = flagsAndDigs.slice();

    // only required if nextFlagOrDig updating was done outsaide of case block. **
    //let newSquareState = currentSquareState;

    // Determine if square was right or left clicked.
    // Currently nextFlagOrDig is changed inside the case so there are no unnecessary changes.**
    // (using a synthetic event for detecting right/left click)
    switch (event.type) {
      case "click":
        console.log(`Left click`);
        if (currentSquareState != 2) {
          // Current square has no flag, so it can be dug.
          nextFlagOrDig[rowIndex][columnIndex] = 1;
          // newSquareState = 1;
        }
        break;
      case "contextmenu":
        console.log(`Right click`);

        // Flags can be placed and removed. This block toggles the flag.
        if (currentSquareState != 2) {
          // Current square has no flag, so place a flag.
          nextFlagOrDig[rowIndex][columnIndex] = 2;
        } else {
          // Flag is already placed on the current square, so remove flag.
          nextFlagOrDig[rowIndex][columnIndex] = 0;
        }
        break;
    }

    // Send updated flag/dig data to the Game
    onPlay(nextFlagOrDig);
  }, []);

  // TODO: Render game over/ongoing text.

  // Render the board from the given minefield array
  const squareList = minefield.map((row, rowIndex) => {
    const rowList = row.map((squareValue, columnIndex) => {
      // Render individual squares in a row
      return (
        <Square
          key={columnIndex}
          value={squareValue}
          squareState={flagsAndDigs[rowIndex][columnIndex]}
          onSquareClick={(e) => handleClick(rowIndex, columnIndex, e)}
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
  // TODO: values that come from difficulty selected
  const boardRows = 15;
  const boardColumns = 20;
  const numberOfMines = 55;
  //const maxAdjacentMines = 6;

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

// TODO: function to determine if game is over or ongoing.
