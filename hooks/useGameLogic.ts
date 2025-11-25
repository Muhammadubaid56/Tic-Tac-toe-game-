import { useState, useCallback } from "react";
import { Player, GameMode, GameStatus } from "@/types/game";
import { INITIAL_BOARD } from "@/constants/game";
import { calculateWinner } from "@/utils/gameLogic";

export const useGameLogic = () => {
  const [board, setBoard] = useState<Player[]>(INITIAL_BOARD);
  const [isXNext, setIsXNext] = useState(true);
  const [gameMode, setGameMode] = useState<GameMode>("multiplayer");
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<GameStatus>(null);

  const makeMove = useCallback(
    (index: number): boolean => {
      if (board[index] || gameOver) return false;
      if (gameMode === "singleplayer" && !isXNext) return false;

      const newBoard = [...board];
      newBoard[index] = isXNext ? "X" : "O";
      const nextPlayer = !isXNext;

      setBoard(newBoard);
      setIsXNext(nextPlayer);

      const gameWinner = calculateWinner(newBoard);
      if (gameWinner) {
        setWinner(gameWinner);
        setGameOver(true);
        return true;
      }

      return false;
    },
    [board, gameOver, gameMode, isXNext]
  );

  const resetGame = useCallback(() => {
    setBoard(INITIAL_BOARD);
    setIsXNext(true);
    setGameOver(false);
    setWinner(null);
  }, []);

  const changeGameMode = useCallback(
    (mode: GameMode) => {
      setGameMode(mode);
      resetGame();
    },
    [resetGame]
  );

  return {
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
  };
};

