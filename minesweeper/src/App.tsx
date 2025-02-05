import { useState } from "react";
// import { ReactPropTypes } from "react";

/**
 * Component that displays a single square button.
 *
 * TODO: On click...
 */
function Square({ value }) {
  //TODO: Different render depending on if square is dug or not.

  // TODO: onClick={onSquareClick}
  return <button className="square">{value}</button>;
}

/**
 * Component that displays a grid of Square components.
 *
 * TODO: Handles...
 */
function Board({ minefield, history, rows, columns }) {
  function handleClick() {
    //TODO
  }

  // Render the board from the given minefield array
  const squareList = minefield.map((row, rowIndex) => {
    const rowList = row.map((square, columnIndex) => {
      // Render individual squares in a row
      //TODO: Different render depending on if square is dug or not.
      return <Square key={columnIndex} value={square} />;
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

  /** Returns the number of mines surrounding a given square.
   *  Square is determined by the passed row and column indexes.
   */
  function countAdjacentMines(rowIndex, columnIndex) {
    let numberOfMines = 0;

    // Check each square around current one...

    return numberOfMines;
  }

  /** Lists how many mines surround each mine.
   *    -1: mine
   *   0-8: number of adjacent mines
   * Array(size of rows) of arrays(each the size of columns).
   */
  const [minefield, setMinefield] = useState(initialMinefield);
  //-----------------------------------------------------------------

  /** Records where the player has:
   *  null: has not clicked
   *     0: right clicked to 'dig'
   *     1: left clicked to 'place a flag'
   * Array(size of rows) of arrays(each the size of columns)
   */
  const [history, setHistory] = useState(
    Array(boardRows).fill(Array(boardColumns).fill(null))
  );

  return (
    <div className="App">
      <h2>This will be minesweeper</h2>
      <div className="game">
        <Board
          minefield={minefield}
          history={history}
          rows={boardRows}
          columns={boardColumns}
        />
      </div>
    </div>
  );
}
