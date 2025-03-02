/**
 * Determines if the game has been won, lost, or is still going.
 * returns: true if the game is won, false if the game is lost, null if the game is not done yet.
 */
const calculateWin = function (
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
  };
  
  export default calculateWin;
  