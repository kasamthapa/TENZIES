import React from "react";

function Dice({ id, value, isHeld, isInvalid, hold }) {
  return (
    <button
      onClick={() => hold(id)}
      className={`dice ${isHeld ? "held" : ""} ${isInvalid ? "invalid" : ""}`}
      aria-label={`Die with value ${value}, ${isHeld ? "held" : "not held"}`}
    >
      {value}
    </button>
  );
}

export default Dice;
