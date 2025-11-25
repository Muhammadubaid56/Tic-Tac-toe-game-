"use client";

import { useEffect, useState } from "react";
import { useGameLogic } from "@/hooks/useGameLogic";
import { useAI } from "@/hooks/useAI";
import { useProfiles } from "@/hooks/useProfiles";
import GameBoard from "./GameBoard";
import GameModeSelector from "./GameModeSelector";
import GameStatus from "./GameStatus";
import ResetButton from "./ResetButton";
import ProfileSelector from "./ProfileSelector";
import Statistics from "./Statistics";

export default function TicTacToe() {
  const {
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
  } = useGameLogic();

  const {
    profiles,
    currentPlayer1,
    currentPlayer2,
    setCurrentPlayer1,
    setCurrentPlayer2,
    getOrCreateProfile,
    recordGameResult,
  } = useProfiles();

  const { makeAIMove } = useAI({
    board,
    setBoard,
    setIsXNext,
    setGameOver,
    setWinner,
  });

  const [showStats, setShowStats] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  // Check if players are ready to start
  const canStartGame = gameMode === "multiplayer" 
    ? currentPlayer1 !== null && currentPlayer2 !== null
    : currentPlayer1 !== null;

  // Trigger AI move when it's AI's turn in single player mode
  useEffect(() => {
    if (gameMode === "singleplayer" && !isXNext && !gameOver && !winner && gameStarted) {
      const timer = setTimeout(() => {
        makeAIMove();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [gameMode, isXNext, gameOver, winner, makeAIMove, gameStarted]);

  // Record game result when game ends
  useEffect(() => {
    if (gameOver && winner && currentPlayer1 && gameStarted) {
      let resultWinner: "player1" | "player2" | "draw";
      
      if (winner === "draw") {
        resultWinner = "draw";
      } else if (winner === "X") {
        resultWinner = "player1";
      } else {
        resultWinner = gameMode === "singleplayer" ? "player2" : "player2";
      }

      const player2Id = gameMode === "singleplayer" ? "AI" : currentPlayer2?.id || "AI";
      
      recordGameResult(
        currentPlayer1.id,
        player2Id,
        resultWinner,
        gameMode
      );
    }
  }, [gameOver, winner, currentPlayer1, currentPlayer2, gameMode, recordGameResult, gameStarted]);

  const handleSquareClick = (index: number) => {
    if (!gameStarted) return;
    makeMove(index);
  };

  const handleStartGame = () => {
    if (canStartGame) {
      setGameStarted(true);
      resetGame();
    }
  };

  const handleReset = () => {
    resetGame();
    // Don't reset gameStarted, just reset the board
  };

  const handleModeChange = (mode: "multiplayer" | "singleplayer") => {
    changeGameMode(mode);
    setGameStarted(false);
    if (mode === "singleplayer") {
      setCurrentPlayer2(null);
    }
  };

  // Auto-select player 2 for single player (AI)
  useEffect(() => {
    if (gameMode === "singleplayer") {
      setCurrentPlayer2(null);
    }
  }, [gameMode, setCurrentPlayer2]);

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-gray-800">Tic Tac Toe</h1>
        <button
          onClick={() => setShowStats(true)}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors text-sm"
        >
          📊 Stats
        </button>
      </div>

      {!gameStarted ? (
        <div className="space-y-4">
          <GameModeSelector gameMode={gameMode} onModeChange={handleModeChange} />

          <ProfileSelector
            profiles={profiles}
            currentProfile={currentPlayer1}
            onSelectProfile={setCurrentPlayer1}
            onCreateProfile={getOrCreateProfile}
            label="Player 1 (X)"
            playerNumber={1}
          />

          {gameMode === "multiplayer" && (
            <ProfileSelector
              profiles={profiles.filter((p) => p.id !== currentPlayer1?.id)}
              currentProfile={currentPlayer2}
              onSelectProfile={setCurrentPlayer2}
              onCreateProfile={getOrCreateProfile}
              label="Player 2 (O)"
              playerNumber={2}
            />
          )}

          {gameMode === "singleplayer" && (
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Player 2 (O)
              </label>
              <div className="bg-gray-100 p-3 rounded-lg">
                <p className="font-semibold text-gray-600">🤖 AI Opponent</p>
              </div>
            </div>
          )}

          <button
            onClick={handleStartGame}
            disabled={!canStartGame}
            className={`w-full py-3 rounded-lg font-semibold transition-colors shadow-lg ${
              canStartGame
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Start Game
          </button>
        </div>
      ) : (
        <>
          <GameModeSelector gameMode={gameMode} onModeChange={handleModeChange} />

          <GameStatus
            winner={winner}
            gameMode={gameMode}
            isXNext={isXNext}
            player1Name={currentPlayer1?.name || "Player 1"}
            player2Name={
              gameMode === "singleplayer" ? "AI" : currentPlayer2?.name || "Player 2"
            }
          />

          <GameBoard
            board={board}
            onSquareClick={handleSquareClick}
            disabled={gameOver}
          />

          <div className="flex gap-2">
            <ResetButton onReset={handleReset} />
            <button
              onClick={() => setGameStarted(false)}
              className="flex-1 py-3 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition-colors shadow-lg"
            >
              Back to Setup
            </button>
          </div>
        </>
      )}

      {showStats && (
        <Statistics
          profiles={profiles}
          onClose={() => setShowStats(false)}
        />
      )}
    </div>
  );
}
