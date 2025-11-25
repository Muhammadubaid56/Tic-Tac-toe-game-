import { Player } from "@/types/game";

interface GameSquareProps {
  value: Player;
  onClick: () => void;
  disabled: boolean;
}

export default function GameSquare({ value, onClick, disabled }: GameSquareProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`h-20 w-20 text-4xl font-bold rounded-lg transition-all shadow-md ${
        value === "X"
          ? "bg-red-100 text-red-600"
          : value === "O"
          ? "bg-blue-100 text-blue-600"
          : "bg-yellow-50 hover:bg-yellow-100"
      } ${
        disabled || value !== null
          ? "cursor-default"
          : "cursor-pointer hover:scale-105"
      }`}
    >
      {value}
    </button>
  );
}

