"use client";

import { useState } from "react";

const WORDS = ["REACT", "NEXTJS", "VERCEL", "CODING", "SCRIPT"];

export default function Home() {
  const [solution] = useState(() => WORDS[Math.floor(Math.random() * WORDS.length)]);
  const [guesses, setGuesses] = useState<string[]>(Array(6).fill(""));
  const [currentGuess, setCurrentGuess] = useState("");
  const [currentRow, setCurrentRow] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState("");

  const handleKeyPress = (letter: string) => {
    if (gameOver || currentGuess.length >= solution.length) return;
    setCurrentGuess((prev) => prev + letter);
  };

  const handleDelete = () => {
    if (gameOver) return;
    setCurrentGuess((prev) => prev.slice(0, -1));
  };

  const handleSubmit = () => {
    if (gameOver) return;
    if (currentGuess.length !== solution.length) {
      setMessage(`Word must be ${solution.length} letters long!`);
      return;
    }

    const newGuesses = [...guesses];
    newGuesses[currentRow] = currentGuess;
    setGuesses(newGuesses);

    if (currentGuess === solution) {
      setMessage("🎉 Excellent! You Won!");
      setGameOver(true);
    } else if (currentRow === 5) {
      setMessage(`Game Over! The word was: ${solution}`);
      setGameOver(true);
    } else {
      setCurrentRow((prev) => prev + 1);
      setCurrentGuess("");
      setMessage("");
    }
  };

  const getLetterStyle = (rowIndex: number, colIndex: number) => {
    const guess = guesses[rowIndex];
    if (!guess || !guess[colIndex]) {
      return "bg-slate-800 border-slate-700 text-white";
    }

    const letter = guess[colIndex];
    if (solution[colIndex] === letter) {
      return "bg-emerald-600 border-emerald-500 text-white font-bold";
    }
    if (solution.includes(letter)) {
      return "bg-amber-600 border-amber-500 text-white font-bold";
    }
    return "bg-slate-700 border-slate-600 text-slate-400";
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
        <h1 className="text-3xl font-extrabold text-center bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent mb-2">
          Wordle Game 🧩
        </h1>
        <p className="text-slate-400 text-center text-sm mb-6">
          Guess the hidden tech word in 6 tries!
        </p>

        {/* Board */}
        <div className="grid grid-rows-6 gap-2 mb-6">
          {guesses.map((guess, rowIndex) => {
            const isCurrentRow = rowIndex === currentRow;
            return (
              <div key={rowIndex} className="grid grid-cols-6 gap-2">
                {Array.from({ length: solution.length }).map((_, colIndex) => {
                  const letter = isCurrentRow
                    ? currentGuess[colIndex]
                    : guess[colIndex];
                  return (
                    <div
                      key={colIndex}
                      className={`h-12 border-2 rounded-lg flex items-center justify-center text-lg font-bold uppercase transition-all duration-300 ${
                        isCurrentRow
                          ? "border-blue-500 bg-slate-800 text-white"
                          : getLetterStyle(rowIndex, colIndex)
                      }`}
                    >
                      {letter || ""}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Message */}
        {message && (
          <div className="text-center font-semibold mb-4 text-emerald-400 animate-pulse">
            {message}
          </div>
        )}

        {/* Keyboard Input Controls */}
        <div className="space-y-2">
          <div className="flex justify-center gap-1 flex-wrap">
            {"QWERTYUIOP".split("").map((char) => (
              <button
                key={char}
                onClick={() => handleKeyPress(char)}
                className="px-2.5 py-2 bg-slate-800 hover:bg-slate-700 rounded text-sm font-semibold transition"
              >
                {char}
              </button>
            ))}
          </div>
          <div className="flex justify-center gap-1 flex-wrap">
            {"ASDFGHJKL".split("").map((char) => (
              <button
                key={char}
                onClick={() => handleKeyPress(char)}
                className="px-2.5 py-2 bg-slate-800 hover:bg-slate-700 rounded text-sm font-semibold transition"
              >
                {char}
              </button>
            ))}
          </div>
          <div className="flex justify-center gap-1 flex-wrap">
            <button
              onClick={handleSubmit}
              className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 rounded text-sm font-bold transition"
            >
              ENTER
            </button>
            {"ZXCVBNM".split("").map((char) => (
              <button
                key={char}
                onClick={() => handleKeyPress(char)}
                className="px-2.5 py-2 bg-slate-800 hover:bg-slate-700 rounded text-sm font-semibold transition"
              >
                {char}
              </button>
            ))}
            <button
              onClick={handleDelete}
              className="px-3 py-2 bg-rose-600 hover:bg-rose-500 rounded text-sm font-bold transition"
            >
              DEL
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}