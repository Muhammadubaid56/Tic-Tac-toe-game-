import { GameMode, GameStatus as GameStatusType } from "@/types/game";

interface GameStatusProps {
  winner: GameStatusType;
  gameMode: GameMode;
  isXNext: boolean;
}

export default function GameStatus({ winner, gameMode, isXNext }: GameStatusProps) {
  const getStatusMessage = (): string => {
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
    <div className="mb-4 text-center">
      <p className="text-lg font-semibold text-gray-700">{getStatusMessage()}</p>
    </div>
  );
}

