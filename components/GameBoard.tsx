import { Player } from "@/types/game";
import GameSquare from "./GameSquare";

interface GameBoardProps {
  board: Player[];
  onSquareClick: (index: number) => void;
  disabled: boolean;
}

export default function GameBoard({ board, onSquareClick, disabled }: GameBoardProps) {
  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      {board.map((square, index) => (
        <GameSquare
          key={index}
          value={square}
          onClick={() => onSquareClick(index)}
          disabled={disabled || square !== null}
        />
      ))}
    </div>
  );
}

