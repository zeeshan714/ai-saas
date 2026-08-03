"use client";

import { useState, useEffect, useCallback } from "react";

// الفاظ اور ان کے ہنٹس کی لسٹ
const WORDS_WITH_HINTS = [
  { word: "NEXTJS", hint: "Popular React framework for web development" },
  { word: "VERCEL", hint: "Platform to deploy Next.js apps easily" },
  { word: "CODING", hint: "Writing instructions for computers" },
  { word: "SCRIPT", hint: "A set of code/instructions (e.g. JavaScript)" },
  { word: "DESIGN", hint: "Creating UI/UX and visual structure" },
  { word: "GITHUB", hint: "Platform for code hosting & version control" },
  { word: "PYTHON", hint: "Popular language for AI and Data Science" },
  { word: "DOCKER", hint: "Container technology to package applications" },
  { word: "SERVER", hint: "Central computer that provides data to other computers" },
  { word: "MOBILE", hint: "Handheld computing device like smartphones" },
  { word: "SYSTEM", hint: "Set of detailed methods or procedures" },
  { word: "ACTION", hint: "Event or function executed upon user interaction" },
  { word: "SEARCH", hint: "Looking for specific information in a database" },
  { word: "OBJECT", hint: "An instance of a class in programming" },
  { word: "CANVAS", hint: "HTML element used to draw graphics on the fly" },
  { word: "NUMBER", hint: "Mathematical object used to count and measure" }
];

export default function Home() {
  const [solutionObj, setSolutionObj] = useState<{ word: string; hint: string }>({ word: "", hint: "" });
  const [guesses, setGuesses] = useState<string[]>(Array(6).fill(""));
  const [currentGuess, setCurrentGuess] = useState("");
  const [currentRow, setCurrentRow] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [showRules, setShowRules] = useState(false); // رولز کا پاپ اپ کھولنے کے لیے

  // Score & Timer States
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isRoundOver, setIsRoundOver] = useState(false);

  // اگلا راؤنڈ شروع کرنے کا فنکشن
  const startNextRound = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * WORDS_WITH_HINTS.length);
    const randomItem = WORDS_WITH_HINTS[randomIndex];
    
    setSolutionObj(randomItem);
    setGuesses(Array(6).fill(""));
    setCurrentGuess("");
    setCurrentRow(0);
    setIsRoundOver(false);
    setMessage("");
    setShowHint(false);
  }, []);

  // گیم ری سیٹ کرنے کا فنکشن
  const resetFullGame = useCallback(() => {
    setScore(0);
    setTimeLeft(120);
    setGameOver(false);
    setIsTimerActive(true);
    startNextRound();
  }, [startNextRound]);

  // Initialize Game
  useEffect(() => {
    resetFullGame();
  }, [resetFullGame]);

  const handleKeyPress = useCallback((letter: string) => {
    if (gameOver || isRoundOver || showRules || !solutionObj.word || currentGuess.length >= solutionObj.word.length) return;
    setCurrentGuess((prev) => prev + letter);
  }, [gameOver, isRoundOver, showRules, solutionObj, currentGuess]);

  const handleDelete = useCallback(() => {
    if (gameOver || isRoundOver || showRules) return;
    setCurrentGuess((prev) => prev.slice(0, -1));
  }, [gameOver, isRoundOver, showRules]);

  const handleSubmit = useCallback(() => {
    if (gameOver || isRoundOver || showRules || !solutionObj.word) return;
    if (currentGuess.length !== solutionObj.word.length) {
      setMessage(`Word must be ${solutionObj.word.length} letters!`);
      return;
    }

    const newGuesses = [...guesses];
    newGuesses[currentRow] = currentGuess;
    setGuesses(newGuesses);

    // Winner Logic
    if (currentGuess === solutionObj.word) {
      const points = (6 - currentRow) * 10 + 20;
      setScore((prev) => prev + points);
      setMessage(`🎉 Correct! +${points} Points! Next word coming...`);
      setIsRoundOver(true);

      setTimeout(() => {
        startNextRound();
      }, 1500);

    } else if (currentRow === 5) {
      setMessage(`Word missed! The word was: ${solutionObj.word}`);
      setIsRoundOver(true);
      setTimeout(() => {
        startNextRound();
      }, 2000);
    } else {
      setCurrentRow((prev) => prev + 1);
      setCurrentGuess("");
      setMessage("");
    }
  }, [gameOver, isRoundOver, showRules, solutionObj, currentGuess, guesses, currentRow, startNextRound]);

  // Physical Keyboard Support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver || isRoundOver || showRules) return;

      if (e.key === "Enter") {
        handleSubmit();
      } else if (e.key === "Backspace") {
        handleDelete();
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        handleKeyPress(e.key.toUpperCase());
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSubmit, handleDelete, handleKeyPress, gameOver, isRoundOver, showRules]);

  // Timer Logic
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isTimerActive && timeLeft > 0 && !gameOver && !showRules) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !gameOver) {
      setMessage(`⏰ Time's up! Final Score: ${score}`);
      setGameOver(true);
      setIsTimerActive(false);
    }
    return () => clearInterval(timer);
  }, [isTimerActive, timeLeft, gameOver, score, showRules]);

  const getLetterStyle = (rowIndex: number, colIndex: number) => {
    const guess = guesses[rowIndex];
    if (rowIndex >= currentRow || !guess || !guess[colIndex]) {
      return "bg-slate-900/60 border-slate-700/60 text-white";
    }

    const letter = guess[colIndex];
    if (solutionObj.word[colIndex] === letter) {
      return "bg-emerald-600 border-emerald-500 text-white font-bold shadow-lg shadow-emerald-900/50";
    }
    if (solutionObj.word.includes(letter)) {
      return "bg-amber-600 border-amber-500 text-white font-bold shadow-lg shadow-amber-900/50";
    }
    return "bg-slate-800 border-slate-700 text-slate-400";
  };

  const wordLength = solutionObj.word.length || 6;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white flex flex-col items-center justify-center p-4 relative">
      <div className="max-w-md w-full bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-3xl p-6 shadow-2xl relative">
        
        {/* Header & Rules Button */}
        <div className="flex justify-between items-center mb-1">
          <div className="w-8"></div>
          <h1 className="text-3xl font-black text-center bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">
            Wordle Pro 🧩
          </h1>
          {/* Rules Icon Button */}
          <button
            onClick={() => setShowRules(true)}
            className="w-8 h-8 flex items-center justify-center bg-slate-800 hover:bg-slate-700 rounded-full text-indigo-300 font-bold border border-slate-700 transition"
            title="How to Play"
          >
            ❓
          </button>
        </div>

        <p className="text-slate-400 text-center text-xs mb-3">
          Solve as many words as you can in 2 minutes!
        </p>

        {/* Score & Timer Dashboard */}
        <div className="flex justify-between items-center bg-slate-950/70 border border-slate-800/80 rounded-xl px-4 py-2.5 mb-3 text-sm font-bold">
          <div className="flex items-center gap-1.5 text-amber-400">
            <span>🏆 Score:</span>
            <span className="text-white text-base font-extrabold">{score}</span>
          </div>
          <div className={`flex items-center gap-1.5 ${timeLeft <= 15 ? "text-rose-500 animate-pulse" : "text-emerald-400"}`}>
            <span>⏱️ Time:</span>
            <span className="text-white text-base font-extrabold">{timeLeft}s</span>
          </div>
        </div>

        {/* Hint Section */}
        <div className="mb-4 text-center">
          {!showHint ? (
            <button
              onClick={() => setShowHint(true)}
              className="text-xs bg-indigo-950 hover:bg-indigo-900 border border-indigo-700/60 text-indigo-300 px-3 py-1.5 rounded-full font-semibold transition active:scale-95 shadow-sm"
            >
              💡 Need a Hint? Click here
            </button>
          ) : (
            <div className="bg-indigo-950/80 border border-indigo-700/80 text-indigo-200 text-xs px-3.5 py-2 rounded-xl animate-fade-in font-medium">
              💡 <span className="font-bold text-amber-300">Hint:</span> {solutionObj.hint}
            </div>
          )}
        </div>

        {/* Game Board */}
        <div className="grid grid-rows-6 gap-2 mb-4">
          {guesses.map((guess, rowIndex) => {
            const isCurrentRow = rowIndex === currentRow;
            return (
              <div 
                key={rowIndex} 
                className="grid gap-2"
                style={{ gridTemplateColumns: `repeat(${wordLength}, minmax(0, 1fr))` }}
              >
                {Array.from({ length: wordLength }).map((_, colIndex) => {
                  const letter = isCurrentRow
                    ? currentGuess[colIndex]
                    : guess[colIndex];
                  return (
                    <div
                      key={colIndex}
                      className={`h-11 border-2 rounded-xl flex items-center justify-center text-lg font-bold uppercase transition-all duration-300 ${
                        isCurrentRow && letter
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
            onClick={resetFullGame}
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

      {/* Rules Modal (پاپ اپ) */}
      {showRules && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-700 max-w-sm w-full rounded-2xl p-5 text-slate-200 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                📖 How to Play Rules
              </h2>
              <button 
                onClick={() => setShowRules(false)}
                className="text-slate-400 hover:text-white font-bold text-lg px-2"
              >
                ✕
              </button>
            </div>

            <ul className="text-xs space-y-2.5 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">1.</span> 
                Guess the hidden 6-letter tech word in 6 tries.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">2.</span> 
                Color hints after each guess:
              </li>
              
              {/* Examples */}
              <div className="pl-4 space-y-1.5 text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 bg-emerald-600 flex items-center justify-center rounded text-white font-bold">G</span>
                  <span><strong>Green:</strong> Letter is correct & in right spot.</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 bg-amber-600 flex items-center justify-center rounded text-white font-bold">Y</span>
                  <span><strong>Yellow:</strong> Letter is in word but wrong spot.</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 bg-slate-800 border border-slate-700 flex items-center justify-center rounded text-slate-400 font-bold">X</span>
                  <span><strong>Grey:</strong> Letter is not in the word.</span>
                </div>
              </div>

              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">3.</span> 
                You have <strong>120 seconds</strong> to solve as many words as possible to build a High Score!
              </li>
            </ul>

            <button
              onClick={() => setShowRules(false)}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs transition mt-2"
            >
              Got it, Let's Play! 🚀
            </button>
          </div>
        </div>
      )}
    </main>
  );
}