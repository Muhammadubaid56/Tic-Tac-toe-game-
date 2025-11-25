export type Player = "X" | "O" | null;
export type GameMode = "multiplayer" | "singleplayer";
export type GameStatus = Player | "draw" | null;

export interface GameState {
  board: Player[];
  isXNext: boolean;
  gameMode: GameMode;
  gameOver: boolean;
  winner: GameStatus;
}

