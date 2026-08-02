'use client';

import React, { useState, useEffect } from 'react';

// مختلف الفاظ کی لسٹ
const WORDS = ["REACT", "SMART", "CODE", "LEARN", "WORLD", "TRAIN", "BUILD", "PLANT"];

export default function WordleGame() {
  const [secretWord, setSecretWord] = useState<string>("");
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string>("");
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  // گیم شروع ہوتے ہی یا ری سیٹ پر نیا لفظ منتخب ہوگا
  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    const randomWord = WORDS[Math.floor(Math.random() * WORDS.length)];
    setSecretWord(randomWord);
    setGuesses([]);
    setCurrentGuess("");
    setGameOver(false);
    setMessage("");
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver || !secretWord) return;

      if (e.key === 'Enter') {
        if (currentGuess.length !== 5) {
          setMessage("لفظ 5 حروف کا ہونا چاہیے!");
          return;
        }
        
        const newGuesses = [...guesses, currentGuess.toUpperCase()];
        setGuesses(newGuesses);
        setCurrentGuess("");
        setMessage("");

        if (currentGuess.toUpperCase() === secretWord) {
          setMessage("مبارک ہو! آپ جیت گئے! 🎉");
          setGameOver(true);
        } else if (newGuesses.length === 6) {
          setMessage(`گیم ختم! صحیح لفظ تھا: ${secretWord}`);
          setGameOver(true);
        }
      } else if (e.key === 'Backspace') {
        setCurrentGuess((prev) => prev.slice(0, -1));
      } else if (/^[a-zA-Z]$/.test(e.key) && currentGuess.length < 5) {
        setCurrentGuess((prev) => (prev + e.key).toUpperCase());
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentGuess, guesses, gameOver, secretWord]);

  const getLetterColor = (letter: string, index: number) => {
    if (secretWord[index] === letter) return '#6aaa64'; // ہرا
    if (secretWord.includes(letter)) return '#c9b458'; // پیلا
    return '#787c7e'; // گرے
  };

  return (
    <div style={{ textAlign: 'center', fontFamily: 'sans-serif', padding: '40px 20px', minHeight: '80vh' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '10px', color: '#111827' }}>
        Wordle Game 🎯
      </h1>
      <p style={{ color: '#4b5563', marginBottom: '20px' }}>
        Guess the 5-letter word and press <b>Enter</b>
      </p>
      
      {/* 6 Grid Rows */}
      <div style={{ display: 'inline-block' }}>
        {[...Array(6)].map((_, rowIndex) => {
          const guess = guesses[rowIndex] || (rowIndex === guesses.length ? currentGuess : "");
          return (
            <div key={rowIndex} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              {[...Array(5)].map((_, colIndex) => {
                const letter = guess[colIndex] || "";
                const isSubmitted = rowIndex < guesses.length;
                const bgColor = isSubmitted ? getLetterColor(letter, colIndex) : '#ffffff';
                const textColor = isSubmitted ? '#ffffff' : '#000000';

                return (
                  <div
                    key={colIndex}
                    style={{
                      width: '55px',
                      height: '55px',
                      border: '2px solid #d1d5db',
                      fontSize: '26px',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: bgColor,
                      color: textColor,
                      borderRadius: '6px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                    }}
                  >
                    {letter}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {message && (
        <div style={{ marginTop: '20px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '600', color: gameOver && message.includes('مبارک') ? '#16a34a' : '#e11d48', marginBottom: '15px' }}>
            {message}
          </h3>
          {gameOver && (
            <button
              onClick={startNewGame}
              style={{
                padding: '10px 24px',
                fontSize: '16px',
                fontWeight: 'bold',
                backgroundColor: '#2563eb',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Play Again 🔄
            </button>
          )}
        </div>
      )}
    </div>
  );
}