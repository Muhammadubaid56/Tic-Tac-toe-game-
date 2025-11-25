import { useCallback } from "react";
import { Player } from "@/types/game";
import { getAIMove } from "@/utils/ai";
import { calculateWinner } from "@/utils/gameLogic";

interface UseAIParams {
  board: Player[];
  setBoard: (board: Player[]) => void;
  setIsXNext: (isXNext: boolean) => void;
  setGameOver: (gameOver: boolean) => void;
  setWinner: (winner: Player | "draw" | null) => void;
}

export const useAI = ({
  board,
  setBoard,
  setIsXNext,
  setGameOver,
  setWinner,
}: UseAIParams) => {
  const makeAIMove = useCallback(() => {
    const move = getAIMove(board);
    if (move !== -1) {
      const newBoard = [...board];
      newBoard[move] = "O";
      setBoard(newBoard);
      setIsXNext(true);

      const gameWinner = calculateWinner(newBoard);
      if (gameWinner) {
        setWinner(gameWinner);
        setGameOver(true);
      }
    }
  }, [board, setBoard, setIsXNext, setGameOver, setWinner]);

  return { makeAIMove };
};

