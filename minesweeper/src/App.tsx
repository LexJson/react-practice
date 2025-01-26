// import "./styles.css";
import { useState } from "react";

/**
 * Component that displays a single square button.
 *
 * TODO: On click...
 */
// Instead of function: const MyComponent = () => { <> ... </> }
function Square({ row, column }) {
  /** Square is initially not dug.
   * Once dug is true, square displayes either a mine or adjacent mine number. */
  // const [dug, setDug] = useState(false);

  // TODO: onClick={onSquareClick}
  console.log(row, column);
  return <button className="square">{row + ", " + column}</button>;
}

/**
 * Component that displays a grid of Square components.
 * Amount of rows and columns in the grid is passed from Game.
 * TODO: Handles...
 */
function Board({ rows, columns }) {
  function handleClick() {
    //TODO
  }

  const boardCoordinateList = [];
  // Fill index array
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      // Add square (i,j) to list
      boardCoordinateList.push([i, j]);
    }
  }
  // Map the indexes to squares for the board
  // return ( {getMessages.map(message => ( <Message thisMessage={message}> </Message> ))} );
  // <li key={coord}> cannot assign array as key // key={boardCoordinateList.indexOf(coord)}
  const squareList = boardCoordinateList.map((coord) => {
    // console.log(rowCoord, columnCoord);
    return <Square row={coord[0]} column={coord[1]} />;
  });

  return <div className="board-row"> {squareList} </div>;
}

export default function Game() {
  // TODO: rows and columns comes from difficulty selected.
  const boardRows = 15;
  const boardColumns = 20;

  return (
    <div className="App">
      <h2>This will be Minesweeper</h2>
      <Board rows={boardRows} columns={boardColumns} />
    </div>
  );
}
