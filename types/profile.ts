export interface PlayerProfile {
  id: string;
  name: string;
  wins: number;
  losses: number;
  draws: number;
  gamesPlayed: number;
  winPercentage: number;
}

export interface GameResult {
  player1Id: string;
  player2Id: string | "AI";
  winner: "player1" | "player2" | "draw";
  gameMode: "multiplayer" | "singleplayer";
  timestamp: number;
}

