/**
 * Component that displays a single square button.
 */
export function Square({ value, squareState, onSquareClick }) {
    // Colour that square backgrounds will be set to whether they're dug or not dug
    const dugSquareColour = "#cfcfcf";
    const notDugSquareColour = "#f0f0f0";
    let valueColour = "black";
  
    /**
     * Returns a specific colour from a given number.
     * Default colour returned is "black".
     */
    function getValueColour(someValue) {
      let valueColour;
      switch (someValue) {
        case 1:
          valueColour = "blue";
          break;
        case 2:
          valueColour = "green";
          break;
        case 3:
          valueColour = "red";
          break;
        case 4:
          valueColour = "navy";
          break;
        case 5:
          valueColour = "maroon";
          break;
        case 6:
          valueColour = "teal";
          break;
        case 7:
          valueColour = "black";
          break;
        case 8:
          valueColour = "gray";
          break;
        default:
          valueColour = "black";
      }
      return valueColour;
    }
  
    // Display content depending on if the square has been dug, flag placed, or untouched.
    let squareDisplay;
    if (squareState == 1) {
      if (value == 0) {
        squareDisplay = "";
      } else {
        valueColour = getValueColour(value);
        squareDisplay = value;
      }
    } else if (squareState == 2) {
      squareDisplay = "f";
    } else {
      squareDisplay = "";
    }
    return (
      <button
        className="square"
        style={{
          background: squareState == 1 ? dugSquareColour : notDugSquareColour,
          color: valueColour,
        }}
        onClick={onSquareClick}
        onContextMenu={onSquareClick}
      >
        {squareDisplay}
      </button>
    );
  }
  