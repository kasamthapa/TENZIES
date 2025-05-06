// import { useState } from "react";

function Dice(props) {
  const style = {
    backgroundColor: props.isInvalid
      ? "red"
      : props.isHeld
      ? "#59e391"
      : "#fff",
  };

  return (
    <button onClick={() => props.hold(props.id)} style={style} className="dice">
      {props.value}
    </button>
  );
}

export default Dice;
