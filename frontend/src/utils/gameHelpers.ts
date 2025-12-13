import { PlayerRole, Player } from '../types/game';

export const generateGameCode = (): string => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

export const generatePlayerId = (): string => {
  return `player_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

export const assignRoles = (playerIds: string[]): { [id: string]: PlayerRole } => {
  const playerCount = playerIds.length;
  let disruptorCount = 1;
  
  if (playerCount >= 6) {
    disruptorCount = 2;
  }
  
  // Shuffle players
  const shuffled = [...playerIds].sort(() => Math.random() - 0.5);
  
  const roles: { [id: string]: PlayerRole } = {};
  shuffled.forEach((id, index) => {
    roles[id] = index < disruptorCount ? 'disruptor' : 'synchronizer';
  });
  
  return roles;
};

export const calculateScores = (
  players: { [id: string]: Player },
  missionSuccess: boolean,
  roundNumber: number
): { [id: string]: number } => {
  const scores: { [id: string]: number } = {};
  
  Object.entries(players).forEach(([id, player]) => {
    let points = 0;
    
    if (player.role === 'synchronizer') {
      points = missionSuccess ? 10 : 0;
    } else if (player.role === 'disruptor') {
      points = !missionSuccess ? 15 : 0;
    }
    
    // Bonus en ronda final
    if (roundNumber === 6) {
      points *= 2;
    }
    
    scores[id] = points;
  });
  
  return scores;
};

export const getWinningTeam = (rounds: any[]): 'synchronizer' | 'disruptor' | 'tie' => {
  const successCount = rounds.filter(r => r.result === 'success').length;
  const totalRounds = rounds.length;
  
  if (successCount > totalRounds / 2) {
    return 'synchronizer';
  } else if (successCount < totalRounds / 2) {
    return 'disruptor';
  }
  return 'tie';
};
