import { create } from 'zustand';
import { Game, Player, GamePhase, Round, GameStatus } from '../types/game';
import { generateGameCode, generatePlayerId, assignRoles, calculateScores } from '../utils/gameHelpers';
import { generateMission, validateMission } from '../utils/missionGenerator';

interface GameState {
  // Current game
  game: Game | null;
  currentPlayerId: string;
  
  // Actions
  createGame: (playerName: string) => string;
  joinGame: (code: string, playerName: string) => boolean;
  startGame: () => void;
  submitSignal: (signal: number) => void;
  updateTrustLevel: (playerId: string, level: 'trusted' | 'neutral' | 'suspicious') => void;
  nextPhase: () => void;
  leaveGame: () => void;
  
  // Helpers
  getCurrentPlayer: () => Player | null;
  getPlayerCount: () => number;
}

let gameTimer: NodeJS.Timeout | null = null;

export const useGameStore = create<GameState>((set, get) => ({
  game: null,
  currentPlayerId: '',
  
  createGame: (playerName: string) => {
    const playerId = generatePlayerId();
    const code = generateGameCode();
    const gameId = `game_${Date.now()}`;
    
    const player: Player = {
      id: playerId,
      displayName: playerName,
      score: 0,
      isReady: true,
      isHost: true,
    };
    
    const game: Game = {
      gameId,
      code,
      hostId: playerId,
      status: 'waiting',
      phase: 'mission',
      players: { [playerId]: player },
      currentRound: 0,
      totalRounds: 6,
      rounds: [],
      timer: 30,
      createdAt: Date.now(),
    };
    
    set({ game, currentPlayerId: playerId });
    return code;
  },
  
  joinGame: (code: string, playerName: string) => {
    const { game } = get();
    
    // Mock: En producción, buscaríamos el juego en Firebase
    // Por ahora, solo permitimos unirse al juego actual si el código coincide
    if (!game || game.code !== code) {
      return false;
    }
    
    if (game.status !== 'waiting') {
      return false;
    }
    
    const playerCount = Object.keys(game.players).length;
    if (playerCount >= 8) {
      return false;
    }
    
    const playerId = generatePlayerId();
    const player: Player = {
      id: playerId,
      displayName: playerName,
      score: 0,
      isReady: true,
      isHost: false,
    };
    
    set({
      game: {
        ...game,
        players: {
          ...game.players,
          [playerId]: player,
        },
      },
      currentPlayerId: playerId,
    });
    
    return true;
  },
  
  startGame: () => {
    const { game } = get();
    if (!game || game.status !== 'waiting') return;
    
    const playerIds = Object.keys(game.players);
    if (playerIds.length < 4) return;
    
    // Asignar roles
    const roles = assignRoles(playerIds);
    const updatedPlayers = { ...game.players };
    Object.entries(roles).forEach(([id, role]) => {
      updatedPlayers[id].role = role;
    });
    
    // Generar primera misión
    const firstMission = generateMission(1, playerIds.length);
    
    set({
      game: {
        ...game,
        status: 'playing',
        phase: 'mission',
        players: updatedPlayers,
        currentRound: 1,
        timer: 10,
        startedAt: Date.now(),
        rounds: [{
          roundNumber: 1,
          mission: firstMission,
          signals: {},
          result: 'failed',
          synchronizerPoints: 0,
          disruptorPoints: 0,
        }],
      },
    });
    
    // Iniciar timer
    startTimer(get, set);
  },
  
  submitSignal: (signal: number) => {
    const { game, currentPlayerId } = get();
    if (!game || game.phase !== 'decision') return;
    
    const currentRound = game.rounds[game.rounds.length - 1];
    currentRound.signals[currentPlayerId] = signal;
    
    // Marcar jugador como enviado
    const updatedPlayers = { ...game.players };
    updatedPlayers[currentPlayerId].hasSubmitted = true;
    updatedPlayers[currentPlayerId].signal = signal;
    
    set({
      game: {
        ...game,
        players: updatedPlayers,
        rounds: [...game.rounds.slice(0, -1), currentRound],
      },
    });
    
    // Verificar si todos enviaron
    const allSubmitted = Object.keys(game.players).every(
      id => currentRound.signals[id] !== undefined
    );
    
    if (allSubmitted) {
      // Auto-avanzar a resultado
      setTimeout(() => {
        get().nextPhase();
      }, 500);
    }
  },
  
  updateTrustLevel: (playerId: string, level: 'trusted' | 'neutral' | 'suspicious') => {
    const { game } = get();
    if (!game) return;
    
    const updatedPlayers = { ...game.players };
    if (updatedPlayers[playerId]) {
      updatedPlayers[playerId].trustLevel = level;
    }
    
    set({
      game: {
        ...game,
        players: updatedPlayers,
      },
    });
  },
  
  nextPhase: () => {
    const { game } = get();
    if (!game || game.status !== 'playing') return;
    
    const phases: GamePhase[] = ['mission', 'decision', 'result', 'trust'];
    const currentPhaseIndex = phases.indexOf(game.phase);
    
    if (game.phase === 'mission') {
      // Mission -> Decision
      set({
        game: {
          ...game,
          phase: 'decision',
          timer: 20,
        },
      });
      startTimer(get, set);
    } else if (game.phase === 'decision') {
      // Decision -> Result (calcular resultado)
      const currentRound = game.rounds[game.rounds.length - 1];
      const signals = Object.values(currentRound.signals);
      const missionSuccess = validateMission(currentRound.mission, signals);
      
      currentRound.result = missionSuccess ? 'success' : 'failed';
      currentRound.synchronizerPoints = missionSuccess ? 1 : 0;
      currentRound.disruptorPoints = !missionSuccess ? 1 : 0;
      
      // Actualizar scores
      const scores = calculateScores(game.players, missionSuccess, game.currentRound);
      const updatedPlayers = { ...game.players };
      Object.entries(scores).forEach(([id, points]) => {
        updatedPlayers[id].score += points;
      });
      
      set({
        game: {
          ...game,
          phase: 'result',
          timer: 15,
          players: updatedPlayers,
          rounds: [...game.rounds.slice(0, -1), currentRound],
        },
      });
      startTimer(get, set);
    } else if (game.phase === 'result') {
      // Result -> Trust (o siguiente ronda)
      if (game.currentRound < game.totalRounds) {
        set({
          game: {
            ...game,
            phase: 'trust',
            timer: 15,
          },
        });
        startTimer(get, set);
      } else {
        // Fin del juego
        set({
          game: {
            ...game,
            status: 'finished',
            finishedAt: Date.now(),
          },
        });
        if (gameTimer) clearInterval(gameTimer);
      }
    } else if (game.phase === 'trust') {
      // Trust -> Nueva ronda
      const nextRoundNumber = game.currentRound + 1;
      const nextMission = generateMission(nextRoundNumber, Object.keys(game.players).length);
      
      // Resetear hasSubmitted
      const updatedPlayers = { ...game.players };
      Object.keys(updatedPlayers).forEach(id => {
        updatedPlayers[id].hasSubmitted = false;
        updatedPlayers[id].signal = undefined;
      });
      
      set({
        game: {
          ...game,
          phase: 'mission',
          currentRound: nextRoundNumber,
          timer: 10,
          players: updatedPlayers,
          rounds: [
            ...game.rounds,
            {
              roundNumber: nextRoundNumber,
              mission: nextMission,
              signals: {},
              result: 'failed',
              synchronizerPoints: 0,
              disruptorPoints: 0,
            },
          ],
        },
      });
      startTimer(get, set);
    }
  },
  
  leaveGame: () => {
    if (gameTimer) clearInterval(gameTimer);
    set({ game: null, currentPlayerId: '' });
  },
  
  getCurrentPlayer: () => {
    const { game, currentPlayerId } = get();
    if (!game || !currentPlayerId) return null;
    return game.players[currentPlayerId] || null;
  },
  
  getPlayerCount: () => {
    const { game } = get();
    return game ? Object.keys(game.players).length : 0;
  },
}));

// Timer helper
const startTimer = (get: any, set: any) => {
  if (gameTimer) clearInterval(gameTimer);
  
  gameTimer = setInterval(() => {
    const { game } = get();
    if (!game || game.status !== 'playing') {
      if (gameTimer) clearInterval(gameTimer);
      return;
    }
    
    if (game.timer <= 1) {
      get().nextPhase();
    } else {
      set({
        game: {
          ...game,
          timer: game.timer - 1,
        },
      });
    }
  }, 1000);
};
