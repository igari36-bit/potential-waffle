import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useGameStore } from '../src/store/gameStore';
import { Ionicons } from '@expo/vector-icons';

export default function Lobby() {
  const router = useRouter();
  const game = useGameStore((state) => state.game);
  const currentPlayer = useGameStore((state) => state.getCurrentPlayer());
  const startGame = useGameStore((state) => state.startGame);
  const leaveGame = useGameStore((state) => state.leaveGame);
  const playerCount = useGameStore((state) => state.getPlayerCount());

  useEffect(() => {
    if (!game) {
      router.replace('/');
      return;
    }

    if (game.status === 'playing') {
      router.replace('/game');
    }
  }, [game]);

  if (!game || !currentPlayer) {
    return null;
  }

  const handleStartGame = () => {
    if (playerCount < 4) {
      Alert.alert('Jugadores insuficientes', 'Se necesitan al menos 4 jugadores para comenzar la partida.');
      return;
    }
    
    startGame();
  };

  const handleLeave = () => {
    Alert.alert(
      'Salir del juego',
      '¿Estás seguro que quieres salir?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Salir',
          style: 'destructive',
          onPress: () => {
            leaveGame();
            router.replace('/');
          },
        },
      ]
    );
  };

  const players = Object.values(game.players);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleLeave} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#00d2ff" />
        </TouchableOpacity>
        <Text style={styles.title}>Sala de Espera</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Game Code */}
      <View style={styles.codeContainer}>
        <Text style={styles.codeLabel}>Código de Sala</Text>
        <View style={styles.codeBox}>
          <Text style={styles.codeText}>{game.code}</Text>
        </View>
        <Text style={styles.codeHint}>Comparte este código con tus amigos</Text>
      </View>

      {/* Player Count */}
      <View style={styles.playerCountContainer}>
        <Ionicons name="people" size={24} color="#00d2ff" />
        <Text style={styles.playerCountText}>
          {playerCount}/8 jugadores
        </Text>
      </View>

      {/* Players List */}
      <View style={styles.playersContainer}>
        <FlatList
          data={players}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.playerItem}>
              <View style={styles.playerAvatar}>
                <Ionicons name="person" size={24} color="#00d2ff" />
              </View>
              <Text style={styles.playerName}>{item.displayName}</Text>
              {item.isHost && (
                <View style={styles.hostBadge}>
                  <Text style={styles.hostBadgeText}>HOST</Text>
                </View>
              )}
              {item.id === currentPlayer.id && (
                <View style={styles.youBadge}>
                  <Text style={styles.youBadgeText}>TÚ</Text>
                </View>
              )}
            </View>
          )}
          contentContainerStyle={styles.playersList}
        />
      </View>

      {/* Waiting Slots */}
      {playerCount < 8 && (
        <View style={styles.waitingContainer}>
          <Text style={styles.waitingText}>Esperando más jugadores...</Text>
        </View>
      )}

      {/* Start Button (Only for Host) */}
      {currentPlayer.isHost && (
        <TouchableOpacity
          style={[
            styles.startButton,
            playerCount < 4 && styles.startButtonDisabled,
          ]}
          onPress={handleStartGame}
          disabled={playerCount < 4}
        >
          <Ionicons name="play" size={24} color="#0f0f1e" />
          <Text style={styles.startButtonText}>
            {playerCount < 4
              ? `Se necesitan ${4 - playerCount} jugadores más`
              : 'INICIAR PARTIDA'}
          </Text>
        </TouchableOpacity>
      )}

      {!currentPlayer.isHost && (
        <View style={styles.waitingHostContainer}>
          <Text style={styles.waitingHostText}>
            Esperando a que el host inicie la partida...
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1e',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    marginTop: 8,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  placeholder: {
    width: 40,
  },
  codeContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  codeLabel: {
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
  },
  codeBox: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderWidth: 2,
    borderColor: '#00d2ff',
  },
  codeText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#00d2ff',
    letterSpacing: 8,
  },
  codeHint: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
  },
  playerCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  playerCountText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  playersContainer: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  playersList: {
    gap: 12,
  },
  playerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f0f1e',
    padding: 12,
    borderRadius: 8,
    gap: 12,
  },
  playerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#16213e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playerName: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  hostBadge: {
    backgroundColor: '#00d2ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  hostBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#0f0f1e',
  },
  youBadge: {
    backgroundColor: '#ff6b7a',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  youBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
  },
  waitingContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  waitingText: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
  },
  startButton: {
    backgroundColor: '#00d2ff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 12,
  },
  startButtonDisabled: {
    backgroundColor: '#333',
    opacity: 0.5,
  },
  startButtonText: {
    color: '#0f0f1e',
    fontSize: 18,
    fontWeight: 'bold',
  },
  waitingHostContainer: {
    backgroundColor: '#1a1a2e',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  waitingHostText: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
  },
});
