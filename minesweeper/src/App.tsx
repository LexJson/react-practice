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
      return <Square key={columnIndex} value={columnIndex} />;
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
  // TODO: rows and columns comes from difficulty selected.
  const boardRows = 15;
  const boardColumns = 20;
  /** Array(size of rows) of arrays(each the size of columns)
   *  -1: mine
   * >=0: number of adjacent mines
   */
  const [minefield, setMinefield] = useState(
    Array(boardRows).fill(Array(boardColumns).fill(0))
  );
  //TODO: generate Minefield
  // ...

  /** Array(size of rows) of arrays(each the size of columns)
   * Records where the player has...
   * 0: right clicked to 'dig'
   * 1: left clicked to 'place a flag'
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
