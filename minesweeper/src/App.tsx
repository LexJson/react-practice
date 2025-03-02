import React from "react";
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
      return <Square key={columnIndex} value={0} />;
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

/**
 * Determines if the game has been won, lost, or is still going.
 * returns: true if the game is won, false if the game is lost, null if the game is not done yet.
 */
function calculateWin(
  minefield,
  flagsAndDigs,
  boardRows,
  boardColumns,
  numberOfMines
) {
  // Loss: If any dug squares have a mine, game is lost.
  // Win: If all possible squares have been dug, meaning only mines remain un-dug.

  // Number of dug squares, according to the flagsAndDigs list.
  let numberOfDigs = 0;

  // Find each dug square and determine if it was a mine
  for (let i = 0; i < boardRows; i++) {
    for (let j = 0; j < boardColumns; j++) {
      // Check each item and its dig state
      if (flagsAndDigs[i][j] == 1) {
        numberOfDigs++;
        if (minefield[i][j] == -1) {
          // Game was lost, return false to notify the Board
          console.log("Game Lost");
          return false;
        }
      }
    }
  }
  // No mines have been dug.
  // Check if all possible squares have been dug.
  if (numberOfDigs == boardRows * boardColumns - numberOfMines) {
    // Game was won, return true to notify the Board.
    console.log("Game Won");
    return true;
  } else {
    // Game is still going, return null to signify it's not won or lost.
    console.log("Game Ongoing");
    return null;
  }
}
