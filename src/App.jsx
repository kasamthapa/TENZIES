import { useState, useEffect } from "react";
import "./App.css";
import Dice from "./components/Dice";
import { nanoid } from "nanoid";

const playWinSound = () => {
  const audio = new Audio("/clap.mp3");
  audio.play();
};

// ✅ Move helper function to the top
function generateNewDice() {
  const arr = [];
  for (let i = 0; i < 10; i++) {
    arr.push({
      id: nanoid(),
      value: Math.floor(Math.random() * 6) + 1,
      isHeld: false,
      isInvalid: false,
    });
  }
  return arr;
}

function App() {
  const [dice, setDice] = useState(generateNewDice());
  const [hasWon, setHasWon] = useState(false);
  const [rollCount, setrollCount] = useState(0);
  const [highScore, setHighScore] = useState(
    () => JSON.parse(localStorage.getItem("highScore")) || null
  );

  // ✅ Check if player has won
  function checkWinCondition(diceArray) {
    const allHeld = diceArray.every((die) => die.isHeld);
    const firstValue = diceArray[0].value;
    const allSame = diceArray.every((die) => die.value === firstValue);
    return allHeld && allSame;
  }
  useEffect(() => {
    if (hasWon) {
      if (highScore === null || rollCount < highScore) {
        setHighScore(rollCount);
        localStorage.setItem("highScore", JSON.stringify(rollCount));
      }
      playWinSound();
    }
  }, [hasWon]);

  // ✅ Handle die click (hold/unhold)
  function hold(id) {
    setDice((oldDice) => {
      const heldValue = oldDice.find((d) => d.isHeld)?.value;
      const newDice = oldDice.map((die) => {
        if (die.id === id) {
          if (heldValue === undefined || die.value === heldValue) {
            return { ...die, isHeld: !die.isHeld, isInvalid: false };
          } else {
            return { ...die, isInvalid: true };
          }
        }
        return { ...die, isInvalid: false };
      });

      setHasWon(checkWinCondition(newDice));
      return newDice;
    });
  }

  // ✅ Roll unheld dice
  function rollDice() {
    setrollCount(rollCount + 1);
    if (hasWon) {
      setDice(generateNewDice());
      setHasWon(false);
      setrollCount(0);
    } else {
      setDice((oldDice) => {
        const newDice = oldDice.map((die) =>
          die.isHeld
            ? die
            : {
                ...die,
                value: Math.floor(Math.random() * 6) + 1,
                isInvalid: false,
              }
        );

        setHasWon(checkWinCondition(newDice));
        return newDice;
      });
    }
  }

  return (
    <main>
      <h1>TENZIES</h1>
      <h2>High Score:{highScore}</h2>
      <p>ROLLS:{rollCount}</p>
      {hasWon && (
        <div className="winbar">
          <h2 className="win-message">🎉 You Win! in {rollCount}rolls 🎉</h2>
        </div>
      )}

      <div className="dice-container">
        {dice.map((die) => (
          <Dice
            key={die.id}
            id={die.id}
            value={die.value}
            isHeld={die.isHeld}
            isInvalid={die.isInvalid}
            hold={hold}
          />
        ))}
      </div>

      <button className="rollBtn" onClick={rollDice}>
        {hasWon ? "New Game" : "Roll"}
      </button>
    </main>
  );
}

export default App;
