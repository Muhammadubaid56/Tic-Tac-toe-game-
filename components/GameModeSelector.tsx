import { GameMode } from "@/types/game";

interface GameModeSelectorProps {
  gameMode: GameMode;
  onModeChange: (mode: GameMode) => void;
}

export default function GameModeSelector({
  gameMode,
  onModeChange,
}: GameModeSelectorProps) {
  return (
    <div className="mb-6 flex gap-2">
      <button
        onClick={() => onModeChange("multiplayer")}
        className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors ${
          gameMode === "multiplayer"
            ? "bg-blue-600 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
      >
        Multiplayer
      </button>
      <button
        onClick={() => onModeChange("singleplayer")}
        className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors ${
          gameMode === "singleplayer"
            ? "bg-blue-600 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
      >
        Single Player
      </button>
    </div>
  );
}

