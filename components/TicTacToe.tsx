"use client";

import { useEffect } from "react";
import { useGameLogic } from "@/hooks/useGameLogic";
import { useAI } from "@/hooks/useAI";
import GameBoard from "./GameBoard";
import GameModeSelector from "./GameModeSelector";
import GameStatus from "./GameStatus";
import ResetButton from "./ResetButton";

export default function TicTacToe() {
  const {
    board,
    isXNext,
    gameMode,
    gameOver,
    winner,
    makeMove,
    resetGame,
    changeGameMode,
    setBoard,
    setIsXNext,
    setGameOver,
    setWinner,
  } = useGameLogic();

  const { makeAIMove } = useAI({
    board,
    setBoard,
    setIsXNext,
    setGameOver,
    setWinner,
  });

  // Trigger AI move when it's AI's turn in single player mode
  useEffect(() => {
    if (gameMode === "singleplayer" && !isXNext && !gameOver && !winner) {
      const timer = setTimeout(() => {
        makeAIMove();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [gameMode, isXNext, gameOver, winner, makeAIMove]);

  const handleSquareClick = (index: number) => {
    makeMove(index);
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
      <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">Tic Tac Toe</h1>

      <GameModeSelector gameMode={gameMode} onModeChange={changeGameMode} />

      <GameStatus winner={winner} gameMode={gameMode} isXNext={isXNext} />

      <GameBoard
        board={board}
        onSquareClick={handleSquareClick}
        disabled={gameOver}
      />

      <ResetButton onReset={resetGame} />
    </div>
  );
}
