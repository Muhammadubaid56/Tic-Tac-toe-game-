import { Player, GameStatus } from "@/types/game";
import { WIN_PATTERNS } from "@/constants/game";

export const calculateWinner = (squares: Player[]): GameStatus => {
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

export const getAvailableMoves = (board: Player[]): number[] => {
  return board
    .map((square, index) => (square === null ? index : null))
    .filter((index) => index !== null) as number[];
};

