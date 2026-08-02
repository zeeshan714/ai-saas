"use client";

import { useState, useEffect } from "react";

const WORDS = ["REACT", "NEXTJS", "VERCEL", "CODING", "SCRIPT", "DESIGN", "GITHUB"];

export default function Home() {
  const [solution, setSolution] = useState("");
  const [guesses, setGuesses] = useState<string[]>(Array(6).fill(""));
  const [currentGuess, setCurrentGuess] = useState("");
  const [currentRow, setCurrentRow] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState("");
  
  // Score & Timer States
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isTimerActive, setIsTimerActive] = useState(false);

  // Initialize Game
  useEffect(() => {
    resetGame();
  }, []);

  // Timer Logic
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isTimerActive && timeLeft > 0 && !gameOver) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !gameOver) {
      setMessage(`⏰ Time's up! Word was: ${solution}`);
      setGameOver(true);
      setIsTimerActive(false);
    }
    return () => clearInterval(timer);
  }, [isTimerActive, timeLeft, gameOver, solution]);

  const resetGame = () => {
    const randomWord = WORDS[Math.floor(Math.random() * WORDS.length)];
    setSolution(randomWord);
    setGuesses(Array(6).fill(""));
    setCurrentGuess("");
    setCurrentRow(0);
    setGameOver(false);
    setMessage("");
    setTimeLeft(60);
    setIsTimerActive(true);
  };

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
      setMessage(`Word must be ${solution.length} letters!`);
      return;
    }

    const newGuesses = [...guesses];
    newGuesses[currentRow] = currentGuess;
    setGuesses(newGuesses);

    if (currentGuess === solution) {
      const points = (6 - currentRow) * 10 + timeLeft;
      setScore((prev) => prev + points);
      setMessage(`🎉 Victory! +${points} Points!`);
      setGameOver(true);
      setIsTimerActive(false);
    } else if (currentRow === 5) {
      setMessage(`Game Over! The word was: ${solution}`);
      setGameOver(true);
      setIsTimerActive(false);
    } else {
      setCurrentRow((prev) => prev + 1);
      setCurrentGuess("");
      setMessage("");
    }
  };

  const getLetterStyle = (rowIndex: number, colIndex: number) => {
    const guess = guesses[rowIndex];
    if (!guess || !guess[colIndex]) {
      return "bg-slate-900/60 border-slate-700/60 text-white";
    }

    const letter = guess[colIndex];
    if (solution[colIndex] === letter) {
      return "bg-emerald-600 border-emerald-500 text-white font-bold shadow-lg shadow-emerald-900/50";
    }
    if (solution.includes(letter)) {
      return "bg-amber-600 border-amber-500 text-white font-bold shadow-lg shadow-amber-900/50";
    }
    return "bg-slate-800 border-slate-700 text-slate-400";
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-3xl p-6 shadow-2xl">
        
        {/* Header */}
        <h1 className="text-3xl font-black text-center bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent mb-1">
          Wordle Pro 🧩
        </h1>
        <p className="text-slate-400 text-center text-xs mb-4">
          Guess the hidden tech word before time runs out!
        </p>

        {/* Score & Timer Dashboard */}
        <div className="flex justify-between items-center bg-slate-950/70 border border-slate-800/80 rounded-xl px-4 py-2.5 mb-5 text-sm font-bold">
          <div className="flex items-center gap-1.5 text-amber-400">
            <span>🏆 Score:</span>
            <span className="text-white text-base font-extrabold">{score}</span>
          </div>
          <div className={`flex items-center gap-1.5 ${timeLeft <= 10 ? "text-rose-500 animate-pulse" : "text-emerald-400"}`}>
            <span>⏱️ Time:</span>
            <span className="text-white text-base font-extrabold">{timeLeft}s</span>
          </div>
        </div>

        {/* Game Board */}
        <div className="grid grid-rows-6 gap-2 mb-4">
          {guesses.map((guess, rowIndex) => {
            const isCurrentRow = rowIndex === currentRow;
            return (
              <div key={rowIndex} className="grid grid-cols-6 gap-2">
                {Array.from({ length: solution.length || 6 }).map((_, colIndex) => {
                  const letter = isCurrentRow
                    ? currentGuess[colIndex]
                    : guess[colIndex];
                  return (
                    <div
                      key={colIndex}
                      className={`h-11 border-2 rounded-xl flex items-center justify-center text-lg font-bold uppercase transition-all duration-300 ${
                        isCurrentRow
                          ? "border-blue-500 bg-slate-800/80 text-white scale-105 shadow-md shadow-blue-900/30"
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

        {/* Message & Play Again */}
        {message && (
          <div className="text-center font-bold mb-4 text-emerald-400 text-sm animate-bounce">
            {message}
          </div>
        )}

        {gameOver && (
          <button
            onClick={resetGame}
            className="w-full mb-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-bold transition shadow-lg shadow-indigo-900/40 text-sm"
          >
            Play Again 🔄
          </button>
        )}

        {/* On-Screen Keyboard */}
        <div className="space-y-1.5">
          <div className="flex justify-center gap-1">
            {"QWERTYUIOP".split("").map((char) => (
              <button
                key={char}
                onClick={() => handleKeyPress(char)}
                className="px-2 py-2 bg-slate-800/80 hover:bg-slate-700 active:scale-95 rounded-lg text-xs font-semibold transition"
              >
                {char}
              </button>
            ))}
          </div>
          <div className="flex justify-center gap-1">
            {"ASDFGHJKL".split("").map((char) => (
              <button
                key={char}
                onClick={() => handleKeyPress(char)}
                className="px-2 py-2 bg-slate-800/80 hover:bg-slate-700 active:scale-95 rounded-lg text-xs font-semibold transition"
              >
                {char}
              </button>
            ))}
          </div>
          <div className="flex justify-center gap-1">
            <button
              onClick={handleSubmit}
              className="px-2.5 py-2 bg-emerald-600 hover:bg-emerald-500 active:scale-95 rounded-lg text-xs font-bold transition"
            >
              ENTER
            </button>
            {"ZXCVBNM".split("").map((char) => (
              <button
                key={char}
                onClick={() => handleKeyPress(char)}
                className="px-2 py-2 bg-slate-800/80 hover:bg-slate-700 active:scale-95 rounded-lg text-xs font-semibold transition"
              >
                {char}
              </button>
            ))}
            <button
              onClick={handleDelete}
              className="px-2.5 py-2 bg-rose-600 hover:bg-rose-500 active:scale-95 rounded-lg text-xs font-bold transition"
            >
              DEL
            </button>
          </div>
        </div>

      </div>
    </main>
  );
}