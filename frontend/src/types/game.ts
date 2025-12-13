export type GameStatus = 'waiting' | 'playing' | 'finished';
export type GamePhase = 'mission' | 'decision' | 'result' | 'trust';
export type PlayerRole = 'synchronizer' | 'disruptor';
export type MissionType = 'sum' | 'even' | 'sequence' | 'majority' | 'average' | 'unique';
export type MissionResult = 'success' | 'failed';
export type TrustLevel = 'trusted' | 'neutral' | 'suspicious';

export interface Player {
  id: string;
  displayName: string;
  photoURL?: string;
  role?: PlayerRole;
  score: number;
  isReady: boolean;
  isHost: boolean;
  trustLevel?: TrustLevel;
  signal?: number;
  hasSubmitted?: boolean;
}

export interface Mission {
  type: MissionType;
  description: string;
  target: {
    min?: number;
    max?: number;
    exact?: number;
    count?: number;
  };
}

export interface Round {
  roundNumber: number;
  mission: Mission;
  signals: { [playerId: string]: number };
  result: MissionResult;
  synchronizerPoints: number;
  disruptorPoints: number;
}

export interface Game {
  gameId: string;
  code: string;
  hostId: string;
  status: GameStatus;
  phase: GamePhase;
  players: { [id: string]: Player };
  currentRound: number;
  totalRounds: number;
  rounds: Round[];
  timer: number;
  createdAt: number;
  startedAt?: number;
  finishedAt?: number;
}

export interface GameSettings {
  minPlayers: number;
  maxPlayers: number;
  totalRounds: number;
}
