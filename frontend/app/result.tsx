import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useGameStore } from '../src/store/gameStore';
import { Ionicons } from '@expo/vector-icons';
import { getWinningTeam } from '../src/utils/gameHelpers';

export default function Result() {
  const router = useRouter();
  const game = useGameStore((state) => state.game);
  const currentPlayer = useGameStore((state) => state.getCurrentPlayer());
  const leaveGame = useGameStore((state) => state.leaveGame);

  useEffect(() => {
    if (!game || !currentPlayer) {
      router.replace('/');
    }
  }, []);

  if (!game || !currentPlayer) {
    return null;
  }

  const winningTeam = getWinningTeam(game.rounds);
  const players = Object.values(game.players).sort((a, b) => b.score - a.score);
  const mvp = players[0];
  
  const synchronizerWins = game.rounds.filter(r => r.result === 'success').length;
  const disruptorWins = game.rounds.filter(r => r.result === 'failed').length;
  
  const didCurrentPlayerWin = 
    (currentPlayer.role === 'synchronizer' && winningTeam === 'synchronizer') ||
    (currentPlayer.role === 'disruptor' && winningTeam === 'disruptor');

  const handlePlayAgain = () => {
    leaveGame();
    router.replace('/');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Winning Team Banner */}
      <View style={styles.bannerContainer}>
        {winningTeam === 'tie' ? (
          <>
            <Ionicons name="remove-circle" size={64} color="#888" />
            <Text style={styles.bannerTitle}>¡EMPATE!</Text>
          </>
        ) : (
          <>
            <Ionicons
              name={winningTeam === 'synchronizer' ? 'checkmark-circle' : 'close-circle'}
              size={64}
              color={winningTeam === 'synchronizer' ? '#00d2ff' : '#ff4757'}
            />
            <Text
              style={[
                styles.bannerTitle,
                winningTeam === 'synchronizer' ? styles.syncColor : styles.disruptColor,
              ]}
            >
              {winningTeam === 'synchronizer' ? '¡SINCRONIZADORES GANAN!' : '¡DISRUPTORES GANAN!'}
            </Text>
          </>
        )}
      </View>

      {/* Your Result */}
      <View style={styles.resultCard}>
        <Text style={styles.resultLabel}>Tu rol era</Text>
        <View
          style={[
            styles.yourRoleBadge,
            currentPlayer.role === 'synchronizer' ? styles.syncBadge : styles.disruptBadge,
          ]}
        >
          <Ionicons
            name={currentPlayer.role === 'synchronizer' ? 'people' : 'warning'}
            size={32}
            color="#fff"
          />
          <Text style={styles.yourRoleText}>
            {currentPlayer.role === 'synchronizer' ? 'SINCRONIZADOR' : 'DISRUPTOR'}
          </Text>
        </View>
        
        <Text style={styles.outcomeText}>
          {didCurrentPlayerWin ? '🎉 ¡VICTORIA!' : '😔 Derrota'}
        </Text>
        
        <View style={styles.yourScore}>
          <Text style={styles.yourScoreLabel}>Tu puntuación final</Text>
          <Text style={styles.yourScoreValue}>{currentPlayer.score}</Text>
        </View>
      </View>

      {/* Match Statistics */}
      <View style={styles.statsCard}>
        <Text style={styles.sectionTitle}>Estadísticas de la partida</Text>
        
        <View style={styles.statRow}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Misiones completadas</Text>
            <Text style={[styles.statValue, styles.syncColor]}>{synchronizerWins}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Misiones saboteadas</Text>
            <Text style={[styles.statValue, styles.disruptColor]}>{disruptorWins}</Text>
          </View>
        </View>
        
        <View style={styles.statRow}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Total de rondas</Text>
            <Text style={styles.statValue}>{game.rounds.length}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Jugadores</Text>
            <Text style={styles.statValue}>{Object.keys(game.players).length}</Text>
          </View>
        </View>
      </View>

      {/* MVP */}
      {mvp && (
        <View style={styles.mvpCard}>
          <Ionicons name="trophy" size={32} color="#ffd700" />
          <Text style={styles.mvpTitle}>MVP del Juego</Text>
          <Text style={styles.mvpName}>{mvp.displayName}</Text>
          <Text style={styles.mvpScore}>{mvp.score} puntos</Text>
        </View>
      )}

      {/* All Players Ranking */}
      <View style={styles.rankingCard}>
        <Text style={styles.sectionTitle}>Clasificación Final</Text>
        
        <View style={styles.rankingList}>
          {players.map((player, index) => (
            <View
              key={player.id}
              style={[
                styles.rankingItem,
                player.id === currentPlayer.id && styles.currentPlayerItem,
              ]}
            >
              <View style={styles.rankPosition}>
                <Text style={styles.rankNumber}>#{index + 1}</Text>
              </View>
              
              <View style={styles.playerInfo}>
                <Text style={styles.playerName}>{player.displayName}</Text>
                <View
                  style={[
                    styles.miniRoleBadge,
                    player.role === 'synchronizer' ? styles.miniSyncBadge : styles.miniDisruptBadge,
                  ]}
                >
                  <Text style={styles.miniRoleText}>
                    {player.role === 'synchronizer' ? 'SYNC' : 'DISR'}
                  </Text>
                </View>
              </View>
              
              <Text style={styles.playerScore}>{player.score}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={handlePlayAgain}
        >
          <Ionicons name="refresh" size={24} color="#0f0f1e" />
          <Text style={styles.primaryButtonText}>JUGAR DE NUEVO</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => {
            leaveGame();
            router.replace('/');
          }}
        >
          <Ionicons name="home" size={24} color="#00d2ff" />
          <Text style={styles.secondaryButtonText}>IR AL INICIO</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1e',
  },
  contentContainer: {
    padding: 20,
    paddingTop: 60,
    gap: 20,
  },
  bannerContainer: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 16,
  },
  bannerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  syncColor: {
    color: '#00d2ff',
  },
  disruptColor: {
    color: '#ff4757',
  },
  resultCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    gap: 16,
  },
  resultLabel: {
    fontSize: 14,
    color: '#888',
  },
  yourRoleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  syncBadge: {
    backgroundColor: '#00d2ff',
  },
  disruptBadge: {
    backgroundColor: '#ff4757',
  },
  yourRoleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  outcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  yourScore: {
    alignItems: 'center',
    gap: 4,
  },
  yourScoreLabel: {
    fontSize: 12,
    color: '#888',
  },
  yourScoreValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#00d2ff',
  },
  statsCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 20,
    gap: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  statRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statItem: {
    flex: 1,
    backgroundColor: '#0f0f1e',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  mvpCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: '#ffd700',
  },
  mvpTitle: {
    fontSize: 16,
    color: '#ffd700',
    fontWeight: '600',
  },
  mvpName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  mvpScore: {
    fontSize: 18,
    color: '#888',
  },
  rankingCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 20,
    gap: 16,
  },
  rankingList: {
    gap: 12,
  },
  rankingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f0f1e',
    borderRadius: 12,
    padding: 12,
    gap: 12,
  },
  currentPlayerItem: {
    borderWidth: 2,
    borderColor: '#00d2ff',
  },
  rankPosition: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#16213e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00d2ff',
  },
  playerInfo: {
    flex: 1,
    gap: 4,
  },
  playerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  miniRoleBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  miniSyncBadge: {
    backgroundColor: '#00d2ff',
  },
  miniDisruptBadge: {
    backgroundColor: '#ff4757',
  },
  miniRoleText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
  },
  playerScore: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00d2ff',
  },
  buttonContainer: {
    gap: 12,
    marginTop: 8,
    marginBottom: 40,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#00d2ff',
  },
  primaryButtonText: {
    color: '#0f0f1e',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#00d2ff',
  },
  secondaryButtonText: {
    color: '#00d2ff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
