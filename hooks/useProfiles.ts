import { useState, useEffect, useCallback } from "react";
import { PlayerProfile, GameResult } from "@/types/profile";

const STORAGE_KEY_PROFILES = "tic-tac-toe-profiles";
const STORAGE_KEY_RESULTS = "tic-tac-toe-results";

export const useProfiles = () => {
  const [profiles, setProfiles] = useState<PlayerProfile[]>([]);
  const [currentPlayer1, setCurrentPlayer1] = useState<PlayerProfile | null>(null);
  const [currentPlayer2, setCurrentPlayer2] = useState<PlayerProfile | null>(null);
  const [gameResults, setGameResults] = useState<GameResult[]>([]);

  // Load profiles and results from localStorage on mount
  useEffect(() => {
    const storedProfiles = localStorage.getItem(STORAGE_KEY_PROFILES);
    const storedResults = localStorage.getItem(STORAGE_KEY_RESULTS);

    if (storedProfiles) {
      try {
        const parsed = JSON.parse(storedProfiles);
        setProfiles(parsed);
      } catch (error) {
        console.error("Error loading profiles:", error);
      }
    }

    if (storedResults) {
      try {
        const parsed = JSON.parse(storedResults);
        setGameResults(parsed);
      } catch (error) {
        console.error("Error loading results:", error);
      }
    }
  }, []);

  // Save profiles to localStorage whenever they change
  useEffect(() => {
    if (profiles.length > 0) {
      localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(profiles));
    }
  }, [profiles]);

  // Save results to localStorage whenever they change
  useEffect(() => {
    if (gameResults.length > 0) {
      localStorage.setItem(STORAGE_KEY_RESULTS, JSON.stringify(gameResults));
    }
  }, [gameResults]);

  const createProfile = useCallback((name: string): PlayerProfile => {
    const newProfile: PlayerProfile = {
      id: `player-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: name.trim(),
      wins: 0,
      losses: 0,
      draws: 0,
      gamesPlayed: 0,
      winPercentage: 0,
    };

    setProfiles((prev) => {
      const exists = prev.find((p) => p.name.toLowerCase() === name.toLowerCase().trim());
      if (exists) {
        return prev;
      }
      return [...prev, newProfile];
    });

    return newProfile;
  }, []);

  const getOrCreateProfile = useCallback(
    (name: string): PlayerProfile => {
      const existing = profiles.find((p) => p.name.toLowerCase() === name.toLowerCase().trim());
      if (existing) {
        return existing;
      }
      return createProfile(name);
    },
    [profiles, createProfile]
  );

  const updateProfileStats = useCallback(
    (profileId: string, result: "win" | "loss" | "draw") => {
      setProfiles((prev) =>
        prev.map((profile) => {
          if (profile.id === profileId) {
            const wins = result === "win" ? profile.wins + 1 : profile.wins;
            const losses = result === "loss" ? profile.losses + 1 : profile.losses;
            const draws = result === "draw" ? profile.draws + 1 : profile.draws;
            const gamesPlayed = profile.gamesPlayed + 1;
            const winPercentage = gamesPlayed > 0 ? (wins / gamesPlayed) * 100 : 0;

            return {
              ...profile,
              wins,
              losses,
              draws,
              gamesPlayed,
              winPercentage: Math.round(winPercentage * 100) / 100,
            };
          }
          return profile;
        })
      );
    },
    []
  );

  const recordGameResult = useCallback(
    (
      player1Id: string,
      player2Id: string | "AI",
      winner: "player1" | "player2" | "draw",
      gameMode: "multiplayer" | "singleplayer"
    ) => {
      const result: GameResult = {
        player1Id,
        player2Id,
        winner,
        gameMode,
        timestamp: Date.now(),
      };

      setGameResults((prev) => [...prev, result]);

      // Update player1 stats
      if (winner === "player1") {
        updateProfileStats(player1Id, "win");
      } else if (winner === "player2" && player2Id !== "AI") {
        updateProfileStats(player1Id, "loss");
      } else if (winner === "draw") {
        updateProfileStats(player1Id, "draw");
      }

      // Update player2 stats (if not AI)
      if (player2Id !== "AI") {
        if (winner === "player2") {
          updateProfileStats(player2Id, "win");
        } else if (winner === "player1") {
          updateProfileStats(player2Id, "loss");
        } else if (winner === "draw") {
          updateProfileStats(player2Id, "draw");
        }
      }

      // Update AI stats (if single player)
      if (player2Id === "AI") {
        setProfiles((prev) => {
          const aiProfile = prev.find((p) => p.id === "ai-player");
          if (!aiProfile) {
            const newAIProfile: PlayerProfile = {
              id: "ai-player",
              name: "AI",
              wins: winner === "player2" ? 1 : 0,
              losses: winner === "player1" ? 1 : 0,
              draws: winner === "draw" ? 1 : 0,
              gamesPlayed: 1,
              winPercentage: winner === "player2" ? 100 : 0,
            };
            return [...prev, newAIProfile];
          } else {
            return prev.map((profile) => {
              if (profile.id === "ai-player") {
                const wins = winner === "player2" ? profile.wins + 1 : profile.wins;
                const losses = winner === "player1" ? profile.losses + 1 : profile.losses;
                const draws = winner === "draw" ? profile.draws + 1 : profile.draws;
                const gamesPlayed = profile.gamesPlayed + 1;
                const winPercentage = gamesPlayed > 0 ? (wins / gamesPlayed) * 100 : 0;
                return {
                  ...profile,
                  wins,
                  losses,
                  draws,
                  gamesPlayed,
                  winPercentage: Math.round(winPercentage * 100) / 100,
                };
              }
              return profile;
            });
          }
        });
      }
    },
    [profiles, updateProfileStats]
  );

  const clearAllData = useCallback(() => {
    setProfiles([]);
    setGameResults([]);
    setCurrentPlayer1(null);
    setCurrentPlayer2(null);
    localStorage.removeItem(STORAGE_KEY_PROFILES);
    localStorage.removeItem(STORAGE_KEY_RESULTS);
  }, []);

  return {
    profiles,
    currentPlayer1,
    currentPlayer2,
    gameResults,
    setCurrentPlayer1,
    setCurrentPlayer2,
    createProfile,
    getOrCreateProfile,
    recordGameResult,
    clearAllData,
  };
};

