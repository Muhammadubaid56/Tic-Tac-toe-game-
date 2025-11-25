import { Player } from "@/types/game";
import { WIN_PATTERNS } from "@/constants/game";
import { getAvailableMoves } from "./gameLogic";

export const getAIMove = (board: Player[]): number => {
  // Try to win
  for (let i = 0; i < WIN_PATTERNS.length; i++) {
    const [a, b, c] = WIN_PATTERNS[i];
    const pattern = [board[a], board[b], board[c]];
    if (pattern.filter((p) => p === "O").length === 2 && pattern.includes(null)) {
      const emptyIndex = pattern.indexOf(null);
      return emptyIndex === 0 ? a : emptyIndex === 1 ? b : c;
    }
  }

  // Try to block
  for (let i = 0; i < WIN_PATTERNS.length; i++) {
    const [a, b, c] = WIN_PATTERNS[i];
    const pattern = [board[a], board[b], board[c]];
    if (pattern.filter((p) => p === "X").length === 2 && pattern.includes(null)) {
      const emptyIndex = pattern.indexOf(null);
      return emptyIndex === 0 ? a : emptyIndex === 1 ? b : c;
    }
  }

  // Take center
  if (board[4] === null) {
    return 4;
  }

  // Take corner
  const corners = [0, 2, 6, 8];
  const availableCorners = corners.filter((corner) => board[corner] === null);
  if (availableCorners.length > 0) {
    return availableCorners[Math.floor(Math.random() * availableCorners.length)];
  }

  // Random move
  const availableMoves = getAvailableMoves(board);
  if (availableMoves.length > 0) {
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  }

  return -1;
};

