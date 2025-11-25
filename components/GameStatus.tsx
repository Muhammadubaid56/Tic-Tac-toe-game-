import { GameMode, GameStatus as GameStatusType } from "@/types/game";

interface GameStatusProps {
  winner: GameStatusType;
  gameMode: GameMode;
  isXNext: boolean;
  player1Name?: string;
  player2Name?: string;
}

export default function GameStatus({
  winner,
  gameMode,
  isXNext,
  player1Name = "Player 1",
  player2Name = "Player 2",
}: GameStatusProps) {
  const getStatusMessage = (): string => {
    if (winner === "draw") {
      return "It's a draw!";
    }
    if (winner === "X") {
      return `Winner: ${player1Name} (X)`;
    }
    if (winner === "O") {
      return `Winner: ${player2Name} (O)`;
    }
    if (gameMode === "singleplayer") {
      return isXNext ? `${player1Name}'s turn (X)` : "AI is thinking...";
    }
    return `Next: ${isXNext ? `${player1Name} (X)` : `${player2Name} (O)`}`;
  };

  return (
    <div className="mb-4 text-center">
      <p className="text-lg font-semibold text-gray-700">{getStatusMessage()}</p>
    </div>
  );
}

