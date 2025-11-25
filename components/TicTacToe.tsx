"use client";

import { useState } from "react";

type Player = "X" | "O" | null;
type GameMode = "multiplayer" | "singleplayer";

const WIN_PATTERNS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export default function TicTacToe() {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [gameMode, setGameMode] = useState<GameMode>("multiplayer");
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<Player | "draw">(null);

  const calculateWinner = (squares: Player[]): Player | "draw" | null => {
    for (let i = 0; i < WIN_PATTERNS.length; i++) {
      const [a, b, c] = WIN_PATTERNS[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    if (squares.every((square) => square !== null)) {
      return "draw";
    }
    return null;
  };

  const handleClick = (index: number) => {
    if (board[index] || gameOver) return;
    if (gameMode === "singleplayer" && !isXNext) return; // Prevent clicking during AI turn

    const newBoard = [...board];
    newBoard[index] = isXNext ? "X" : "O";
    const nextPlayer = !isXNext;
    
    setBoard(newBoard);
    setIsXNext(nextPlayer);

    const gameWinner = calculateWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      setGameOver(true);
    } else if (gameMode === "singleplayer" && nextPlayer) {
      // AI's turn (O is AI in single player)
      setTimeout(() => makeAIMove(newBoard), 300);
    }
  };

  const makeAIMove = (currentBoard: Player[]) => {
    // Simple AI: Try to win, then block, then take center, then take corner, else random
    let move = -1;

    // Try to win
    for (let i = 0; i < WIN_PATTERNS.length; i++) {
      const [a, b, c] = WIN_PATTERNS[i];
      const pattern = [currentBoard[a], currentBoard[b], currentBoard[c]];
      if (pattern.filter((p) => p === "O").length === 2 && pattern.includes(null)) {
        move = pattern.indexOf(null) === 0 ? a : pattern.indexOf(null) === 1 ? b : c;
        break;
      }
    }

    // Try to block
    if (move === -1) {
      for (let i = 0; i < WIN_PATTERNS.length; i++) {
        const [a, b, c] = WIN_PATTERNS[i];
        const pattern = [currentBoard[a], currentBoard[b], currentBoard[c]];
        if (pattern.filter((p) => p === "X").length === 2 && pattern.includes(null)) {
          move = pattern.indexOf(null) === 0 ? a : pattern.indexOf(null) === 1 ? b : c;
          break;
        }
      }
    }

    // Take center
    if (move === -1 && currentBoard[4] === null) {
      move = 4;
    }

    // Take corner
    if (move === -1) {
      const corners = [0, 2, 6, 8];
      const availableCorners = corners.filter((corner) => currentBoard[corner] === null);
      if (availableCorners.length > 0) {
        move = availableCorners[Math.floor(Math.random() * availableCorners.length)];
      }
    }

    // Random move
    if (move === -1) {
      const availableMoves = currentBoard
        .map((square, index) => (square === null ? index : null))
        .filter((index) => index !== null) as number[];
      if (availableMoves.length > 0) {
        move = availableMoves[Math.floor(Math.random() * availableMoves.length)];
      }
    }

    if (move !== -1) {
      const newBoard = [...currentBoard];
      newBoard[move] = "O";
      setBoard(newBoard);
      setIsXNext(true);

      const gameWinner = calculateWinner(newBoard);
      if (gameWinner) {
        setWinner(gameWinner);
        setGameOver(true);
      }
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setGameOver(false);
    setWinner(null);
  };

  const handleModeChange = (mode: GameMode) => {
    setGameMode(mode);
    resetGame();
  };

  const getStatusMessage = () => {
    if (winner === "draw") {
      return "It's a draw!";
    }
    if (winner) {
      return `Winner: ${winner}`;
    }
    if (gameMode === "singleplayer") {
      return isXNext ? "Your turn (X)" : "AI is thinking...";
    }
    return `Next player: ${isXNext ? "X" : "O"}`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
      <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">Tic Tac Toe</h1>
      
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => handleModeChange("multiplayer")}
          className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors ${
            gameMode === "multiplayer"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Multiplayer
        </button>
        <button
          onClick={() => handleModeChange("singleplayer")}
          className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors ${
            gameMode === "singleplayer"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Single Player
        </button>
      </div>

      <div className="mb-4 text-center">
        <p className="text-lg font-semibold text-gray-700">{getStatusMessage()}</p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {board.map((square, index) => (
          <button
            key={index}
            onClick={() => handleClick(index)}
            disabled={gameOver || square !== null}
            className={`h-20 w-20 text-4xl font-bold rounded-lg transition-all ${
              square === "X"
                ? "bg-red-100 text-red-600"
                : square === "O"
                ? "bg-blue-100 text-blue-600"
                : "bg-yellow-50 hover:bg-yellow-100"
            } ${gameOver || square !== null ? "cursor-default" : "cursor-pointer hover:scale-105"} shadow-md`}
          >
            {square}
          </button>
        ))}
      </div>

      <button
        onClick={resetGame}
        className="w-full py-3 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-900 transition-colors shadow-lg"
      >
        Reset Game
      </button>
    </div>
  );
}

