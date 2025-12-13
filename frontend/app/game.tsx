import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useGameStore } from '../src/store/gameStore';
import { Ionicons } from '@expo/vector-icons';
import { CountdownTimer } from '../src/components/CountdownTimer';
import { SignalSelector } from '../src/components/SignalSelector';

export default function Game() {
  const router = useRouter();
  const game = useGameStore((state) => state.game);
  const currentPlayer = useGameStore((state) => state.getCurrentPlayer());
  const submitSignal = useGameStore((state) => state.submitSignal);
  const nextPhase = useGameStore((state) => state.nextPhase);
  const updateTrustLevel = useGameStore((state) => state.updateTrustLevel);
  const leaveGame = useGameStore((state) => state.leaveGame);
  
  const [selectedSignal, setSelectedSignal] = useState<number | undefined>();
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    if (!game || !currentPlayer) {
      router.replace('/');
      return;
    }

    if (game.status === 'finished') {
      router.replace('/result');
      return;
    }
  }, [game]);

  useEffect(() => {
    // Reset cuando cambia de fase
    if (game?.phase === 'decision') {
      setSelectedSignal(undefined);
      setHasSubmitted(false);
    }
  }, [game?.phase]);

  if (!game || !currentPlayer || game.status !== 'playing') {
    return null;
  }

  const currentRound = game.rounds[game.rounds.length - 1];
  const players = Object.values(game.players);
  const signalsSubmitted = Object.keys(currentRound.signals).length;
  const totalPlayers = players.length;

  const handleSubmitSignal = () => {
    if (selectedSignal === undefined) {
      Alert.alert('Error', 'Por favor selecciona un número');
      return;
    }
    
    submitSignal(selectedSignal);
    setHasSubmitted(true);
  };

  const handleLeave = () => {
    Alert.alert(
      'Salir del juego',
      '¿Estás seguro? Perderás el progreso.',
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

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleLeave} style={styles.backButton}>
          <Ionicons name="exit-outline" size={24} color="#ff4757" />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={styles.roundText}>
            Ronda {game.currentRound}/{game.totalRounds}
          </Text>
          <CountdownTimer seconds={game.timer} />
        </View>
        
        <View style={styles.placeholder} />
      </View>

      {/* Role Badge (solo visible para el jugador) */}
      <View style={styles.roleContainer}>
        <View
          style={[
            styles.roleBadge,
            currentPlayer.role === 'synchronizer' ? styles.syncBadge : styles.disruptBadge,
          ]}
        >
          <Ionicons
            name={currentPlayer.role === 'synchronizer' ? 'checkmark-circle' : 'alert-circle'}
            size={20}
            color="#fff"
          />
          <Text style={styles.roleText}>
            {currentPlayer.role === 'synchronizer' ? 'SINCRONIZADOR' : 'DISRUPTOR'}
          </Text>
        </View>
      </View>

      {/* Score */}
      <View style={styles.scoreContainer}>
        <Text style={styles.scoreLabel}>Tu puntuación</Text>
        <Text style={styles.scoreValue}>{currentPlayer.score}</Text>
      </View>

      {/* Content based on phase */}
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* PHASE: MISSION */}
        {game.phase === 'mission' && (
          <View style={styles.phaseContainer}>
            <View style={styles.missionHeader}>
              <Ionicons name="target" size={32} color="#00d2ff" />
              <Text style={styles.phaseTitle}>MISIÓN</Text>
            </View>
            
            <View style={styles.missionCard}>
              <Text style={styles.missionText}>{currentRound.mission.description}</Text>
            </View>
            
            <View style={styles.infoBox}>
              <Ionicons name="people" size={20} color="#888" />
              <Text style={styles.infoText}>{totalPlayers} jugadores activos</Text>
            </View>
            
            <Text style={styles.hintText}>Prepara tu estrategia...</Text>
          </View>
        )}

        {/* PHASE: DECISION */}
        {game.phase === 'decision' && (
          <View style={styles.phaseContainer}>
            <View style={styles.missionHeader}>
              <Ionicons name="radio-button-on" size={32} color="#00d2ff" />
              <Text style={styles.phaseTitle}>ENVÍA TU SEÑAL</Text>
            </View>
            
            <View style={styles.missionReminderCard}>
              <Text style={styles.missionReminderText}>{currentRound.mission.description}</Text>
            </View>
            
            <SignalSelector
              onSelect={setSelectedSignal}
              selectedSignal={selectedSignal}
              disabled={hasSubmitted}
            />
            
            {!hasSubmitted ? (
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  selectedSignal === undefined && styles.submitButtonDisabled,
                ]}
                onPress={handleSubmitSignal}
                disabled={selectedSignal === undefined}
              >
                <Text style={styles.submitButtonText}>ENVIAR SEÑAL</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.waitingBox}>
                <Ionicons name="checkmark-circle" size={32} color="#00d2ff" />
                <Text style={styles.waitingText}>Señal enviada</Text>
                <Text style={styles.waitingSubtext}>
                  {signalsSubmitted}/{totalPlayers} jugadores listos
                </Text>
              </View>
            )}
          </View>
        )}

        {/* PHASE: RESULT */}
        {game.phase === 'result' && (
          <View style={styles.phaseContainer}>
            <View style={styles.resultHeader}>
              <Ionicons
                name={currentRound.result === 'success' ? 'checkmark-circle' : 'close-circle'}
                size={48}
                color={currentRound.result === 'success' ? '#00d2ff' : '#ff4757'}
              />
              <Text
                style={[
                  styles.resultTitle,
                  currentRound.result === 'success' ? styles.successText : styles.failText,
                ]}
              >
                {currentRound.result === 'success' ? '¡MISIÓN COMPLETADA!' : 'MISIÓN FALLADA'}
              </Text>
            </View>
            
            <View style={styles.missionReminderCard}>
              <Text style={styles.missionReminderText}>{currentRound.mission.description}</Text>
            </View>
            
            <View style={styles.signalsContainer}>
              <Text style={styles.signalsTitle}>Señales enviadas:</Text>
              <View style={styles.signalsList}>
                {Object.values(currentRound.signals).map((signal, index) => (
                  <View key={index} style={styles.signalBubble}>
                    <Text style={styles.signalNumber}>{signal}</Text>
                  </View>
                ))}
              </View>
            </View>
            
            <View style={styles.scoreUpdate}>
              <View style={styles.teamScore}>
                <Ionicons name="people" size={24} color="#00d2ff" />
                <Text style={styles.teamLabel}>Sincronizadores</Text>
                <Text style={styles.teamPoints}>{currentRound.synchronizerPoints} ★</Text>
              </View>
              <View style={styles.teamScore}>
                <Ionicons name="warning" size={24} color="#ff4757" />
                <Text style={styles.teamLabel}>Disruptores</Text>
                <Text style={styles.teamPoints}>{currentRound.disruptorPoints} ★</Text>
              </View>
            </View>
          </View>
        )}

        {/* PHASE: TRUST */}
        {game.phase === 'trust' && (
          <View style={styles.phaseContainer}>
            <View style={styles.missionHeader}>
              <Ionicons name="finger-print" size={32} color="#00d2ff" />
              <Text style={styles.phaseTitle}>MARCADORES DE CONFIANZA</Text>
            </View>
            
            <Text style={styles.trustHint}>Marca quién crees que es confiable o sospechoso</Text>
            
            <View style={styles.trustList}>
              {players
                .filter((p) => p.id !== currentPlayer.id)
                .map((player) => (
                  <View key={player.id} style={styles.trustItem}>
                    <Text style={styles.trustPlayerName}>{player.displayName}</Text>
                    <View style={styles.trustButtons}>
                      <TouchableOpacity
                        style={[
                          styles.trustButton,
                          player.trustLevel === 'trusted' && styles.trustButtonActive,
                        ]}
                        onPress={() => updateTrustLevel(player.id, 'trusted')}
                      >
                        <Ionicons
                          name="checkmark-circle"
                          size={24}
                          color={player.trustLevel === 'trusted' ? '#00d2ff' : '#666'}
                        />
                      </TouchableOpacity>
                      
                      <TouchableOpacity
                        style={[
                          styles.trustButton,
                          player.trustLevel === 'neutral' && styles.trustButtonActive,
                        ]}
                        onPress={() => updateTrustLevel(player.id, 'neutral')}
                      >
                        <Ionicons
                          name="remove-circle"
                          size={24}
                          color={player.trustLevel === 'neutral' ? '#888' : '#666'}
                        />
                      </TouchableOpacity>
                      
                      <TouchableOpacity
                        style={[
                          styles.trustButton,
                          player.trustLevel === 'suspicious' && styles.trustButtonActive,
                        ]}
                        onPress={() => updateTrustLevel(player.id, 'suspicious')}
                      >
                        <Ionicons
                          name="close-circle"
                          size={24}
                          color={player.trustLevel === 'suspicious' ? '#ff4757' : '#666'}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1e',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: '#1a1a2e',
  },
  backButton: {
    padding: 8,
  },
  headerCenter: {
    alignItems: 'center',
    gap: 8,
  },
  roundText: {
    fontSize: 14,
    color: '#888',
    fontWeight: '600',
  },
  placeholder: {
    width: 40,
  },
  roleContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  syncBadge: {
    backgroundColor: '#00d2ff',
  },
  disruptBadge: {
    backgroundColor: '#ff4757',
  },
  roleText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  scoreContainer: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  scoreLabel: {
    fontSize: 12,
    color: '#888',
  },
  scoreValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#00d2ff',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  phaseContainer: {
    gap: 20,
  },
  missionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  phaseTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00d2ff',
  },
  missionCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 24,
    borderWidth: 2,
    borderColor: '#00d2ff',
  },
  missionText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    lineHeight: 28,
  },
  missionReminderCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#16213e',
  },
  missionReminderText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#888',
  },
  hintText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  submitButton: {
    backgroundColor: '#00d2ff',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#333',
    opacity: 0.5,
  },
  submitButtonText: {
    color: '#0f0f1e',
    fontSize: 18,
    fontWeight: 'bold',
  },
  waitingBox: {
    backgroundColor: '#1a1a2e',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
  },
  waitingText: {
    fontSize: 18,
    color: '#00d2ff',
    fontWeight: '600',
  },
  waitingSubtext: {
    fontSize: 14,
    color: '#888',
  },
  resultHeader: {
    alignItems: 'center',
    gap: 12,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  successText: {
    color: '#00d2ff',
  },
  failText: {
    color: '#ff4757',
  },
  signalsContainer: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 16,
  },
  signalsTitle: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 12,
    fontWeight: '600',
  },
  signalsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  signalBubble: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#00d2ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signalNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f0f1e',
  },
  scoreUpdate: {
    flexDirection: 'row',
    gap: 12,
  },
  teamScore: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  teamLabel: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
  },
  teamPoints: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  trustHint: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
  trustList: {
    gap: 12,
  },
  trustItem: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  trustPlayerName: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    flex: 1,
  },
  trustButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  trustButton: {
    padding: 4,
  },
  trustButtonActive: {
    transform: [{ scale: 1.2 }],
  },
});
