import React, { MouseEventHandler } from "react";
import { Square } from "./Square";
import calculateWin from "./CalculateWin";

type BoardProps = {
  minefield: number[][];
  flagsAndDigs: number[][];
  rows: number;
  columns: number;
  onPlay: Function;
  numberOfMines: number;
};

/**
 * Component that displays a grid of Square components.
 * Handles when a Square is clicked, and passes updated data to the Game.
 */
export function Board({
  minefield,
  flagsAndDigs,
  rows,
  columns,
  onPlay,
  numberOfMines,
}: BoardProps) {
  /**
   * Digs all adjacent Squares of a given Square if it has no adjacent mines.
   * If one of the adjacent Squares also has no adjacent mines,
   * recursively call this function.
   * rowIndex: row indedx of a given Square.
   * columnIndex: column index of a given Square.
   * currentFlagsAndDigs: a current version of the game's flag and dig data.
   * returns: a copy of Board array with new digs.
   */
  function chainDig(
    rowIndex: number,
    columnIndex: number,
    currentFlagsAndDigs: number[][]
  ) {
    if (minefield[rowIndex][columnIndex] != 0) {
      //console.log(minefield[rowIndex][columnIndex], ": No further chain");
      return currentFlagsAndDigs;
    } else {
      // Copy of the given array to update any new digs.
      let chainDigs = currentFlagsAndDigs.slice();

      // Each of the 8 potential squares surrounding the given square.
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

      // Dig each adjacent square if not already dug or flagged
      surroundingIndexes.forEach((indexes) => {
        // Check the row and column indexes are within the range of the arrays.
        if (
          indexes[0] >= 0 &&
          indexes[0] < rows &&
          indexes[1] >= 0 &&
          indexes[1] < columns
        ) {
          // Index is valid, so dig the square ONLY IF there is no flag AND it has not been dug.
          // This prevents unnecessary updates to the flag/dig list. (Causes error: Maximum call stack size exceeded)
          if (currentFlagsAndDigs[indexes[0]][indexes[1]] == 0) {
            // console.log("Chain dig at: ", minefield[indexes[0]][indexes[1]]);

            // Update the current square
            chainDigs[indexes[0]][indexes[1]] = 1;

            // Update flag/dig list with potential adjacent square chains
            // Passes the current chain digs so any updates are not lost.
            chainDigs = chainDig(indexes[0], indexes[1], chainDigs);
          }
        }
      });
      // Return updated flags and digs list after recursing through all adjacent squares.
      return chainDigs;
    }
  }

  /**
   * Occurs when one of the Board's Squares are clicked.
   * Determines what happens after a right or left click.
   * For the given Square(by its indexes) either nothing happens, it gets dug, or a flag is placed or removed.
   * rowIndex: row indedx of the clicked Square.
   * columnIndex: column index of the clicked Square.
   * event: the event passed from the clicked Square. Used to determine right/left click.
   */
  const handleClick = React.useCallback(
    (rowIndex: number, columnIndex: number, event: Event) => {
      /** The state of the Square that was just clicked. */
      const currentSquareState = flagsAndDigs[rowIndex][columnIndex];

      // Prevent context menu from opening on right click
      event.preventDefault();

      // if the square is already dug, or the game has ended,
      // no new actions/clicks should update anything.
      if (
        currentSquareState == 1 ||
        calculateWin(minefield, flagsAndDigs, rows, columns, numberOfMines) !=
          null
      ) {
        return;
      }

      /** Make a copy of the board to update and pass to Game. */
      let nextFlagOrDig = flagsAndDigs.slice();

      // only required if nextFlagOrDig updating was done outsaide of case block. **
      //let newSquareState = currentSquareState;

      // Determine if square was right or left clicked.
      // Currently nextFlagOrDig is changed inside the case so there are no unnecessary changes.**
      // (using a synthetic event for detecting right/left click)
      switch (event.type) {
        case "click":
          //console.log(`Left click`);
          if (currentSquareState != 2) {
            // Current square has no flag, so it can be dug.
            nextFlagOrDig[rowIndex][columnIndex] = 1;

            // On a successful dig, check if there is a chain-dig reaction
            nextFlagOrDig = chainDig(rowIndex, columnIndex, nextFlagOrDig);
          }
          break;
        case "contextmenu":
          //console.log(`Right click`);

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
    },
    []
  );

  // Render the board from the given minefield array
  const squareList = minefield.map((row, rowIndex) => {
    const rowList = row.map((squareValue, columnIndex) => {
      // Render individual squares in a row
      return (
        <Square
          key={columnIndex}
          value={squareValue}
          squareState={flagsAndDigs[rowIndex][columnIndex]}
          onSquareClick={(e: any) => handleClick(rowIndex, columnIndex, e)}
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

  //TODO: put the flag count in the header ****
  return <>{squareList}</>;
}
