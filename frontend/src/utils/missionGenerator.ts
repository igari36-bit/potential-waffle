import { Mission, MissionType } from '../types/game';

const MISSION_TEMPLATES: { [key in MissionType]: (playerCount: number) => Mission } = {
  sum: (playerCount) => {
    const baseTarget = Math.floor(playerCount * 5);
    const min = baseTarget - 5;
    const max = baseTarget + 5;
    return {
      type: 'sum',
      description: `La suma total debe estar entre ${min}-${max}`,
      target: { min, max },
    };
  },
  
  even: (playerCount) => {
    const needed = Math.ceil(playerCount / 2);
    return {
      type: 'even',
      description: `Al menos ${needed} jugadores deben enviar números pares`,
      target: { count: needed },
    };
  },
  
  sequence: (playerCount) => {
    return {
      type: 'sequence',
      description: 'Envía números que formen una secuencia (ej: 3,4,5,6)',
      target: {},
    };
  },
  
  majority: (playerCount) => {
    const needed = Math.ceil(playerCount / 2);
    return {
      type: 'majority',
      description: `Al menos ${needed} jugadores deben enviar el MISMO número`,
      target: { count: needed },
    };
  },
  
  average: (playerCount) => {
    const target = 5;
    return {
      type: 'average',
      description: `El promedio de todos los números debe ser mayor a ${target}`,
      target: { min: target },
    };
  },
  
  unique: (playerCount) => {
    return {
      type: 'unique',
      description: 'Todos los números deben ser DIFERENTES',
      target: { count: playerCount },
    };
  },
};

export const generateMission = (roundNumber: number, playerCount: number): Mission => {
  const types: MissionType[] = ['sum', 'even', 'majority', 'average', 'unique'];
  
  // Primera ronda siempre es suma (más fácil)
  if (roundNumber === 1) {
    return MISSION_TEMPLATES.sum(playerCount);
  }
  
  // Rondas finales pueden incluir secuencia (más difícil)
  if (roundNumber >= 4) {
    types.push('sequence');
  }
  
  const randomType = types[Math.floor(Math.random() * types.length)];
  return MISSION_TEMPLATES[randomType](playerCount);
};

export const validateMission = (mission: Mission, signals: number[]): boolean => {
  switch (mission.type) {
    case 'sum': {
      const sum = signals.reduce((acc, val) => acc + val, 0);
      return sum >= (mission.target.min || 0) && sum <= (mission.target.max || Infinity);
    }
    
    case 'even': {
      const evenCount = signals.filter(s => s % 2 === 0).length;
      return evenCount >= (mission.target.count || 0);
    }
    
    case 'sequence': {
      const sorted = [...signals].sort((a, b) => a - b);
      for (let i = 1; i < sorted.length; i++) {
        if (sorted[i] !== sorted[i - 1] + 1) return false;
      }
      return true;
    }
    
    case 'majority': {
      const counts: { [key: number]: number } = {};
      signals.forEach(s => counts[s] = (counts[s] || 0) + 1);
      const maxCount = Math.max(...Object.values(counts));
      return maxCount >= (mission.target.count || 0);
    }
    
    case 'average': {
      const avg = signals.reduce((acc, val) => acc + val, 0) / signals.length;
      return avg > (mission.target.min || 0);
    }
    
    case 'unique': {
      const uniqueCount = new Set(signals).size;
      return uniqueCount === signals.length;
    }
    
    default:
      return false;
  }
};
