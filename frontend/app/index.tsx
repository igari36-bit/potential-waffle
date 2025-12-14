import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useGameStore } from '../src/store/gameStore';
import { Ionicons } from '@expo/vector-icons';

export default function Index() {
  const router = useRouter();
  const createGame = useGameStore((state) => state.createGame);
  const joinGame = useGameStore((state) => state.joinGame);
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [error, setError] = useState('');

  const handleCreateGame = () => {
    if (!playerName.trim()) {
      setError('Por favor, ingresa tu nombre');
      return;
    }
    
    const code = createGame(playerName.trim());
    Keyboard.dismiss();
    setShowCreateModal(false);
    router.push('/lobby');
  };

  const handleJoinGame = () => {
    if (!playerName.trim()) {
      setError('Por favor, ingresa tu nombre');
      return;
    }
    
    if (!joinCode.trim()) {
      setError('Por favor, ingresa el código');
      return;
    }
    
    const success = joinGame(joinCode.toUpperCase().trim(), playerName.trim());
    if (!success) {
      setError('Código inválido o partida no disponible');
      return;
    }
    
    Keyboard.dismiss();
    setShowJoinModal(false);
    router.push('/lobby');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.iconWrapper}>
          <Ionicons name="eye" size={60} color="#00d2ff" />
        </View>
        <Text style={styles.title}>SOSPECHA</Text>
        <Text style={styles.subtitle}>Confía o desconfía</Text>
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={() => {
            setError('');
            setPlayerName('');
            setShowCreateModal(true);
          }}
        >
          <Ionicons name="add-circle" size={24} color="#0f0f1e" />
          <Text style={styles.primaryButtonText}>CREAR PARTIDA</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => {
            setError('');
            setPlayerName('');
            setJoinCode('');
            setShowJoinModal(true);
          }}
        >
          <Ionicons name="enter" size={24} color="#00d2ff" />
          <Text style={styles.secondaryButtonText}>UNIRSE A PARTIDA</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.tertiaryButton]}
          onPress={() => {
            // TODO: Tutorial
          }}
        >
          <Ionicons name="help-circle" size={24} color="#fff" />
          <Text style={styles.tertiaryButtonText}>¿Cómo jugar?</Text>
        </TouchableOpacity>
      </View>

      {/* Footer Info */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>4-8 jugadores · 6-8 minutos</Text>
      </View>

      {/* Create Game Modal */}
      <Modal
        visible={showCreateModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCreateModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Crear Partida</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Tu nombre"
              placeholderTextColor="#666"
              value={playerName}
              onChangeText={(text) => {
                setPlayerName(text);
                setError('');
              }}
              maxLength={20}
            />
            
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowCreateModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleCreateGame}
              >
                <Text style={styles.confirmButtonText}>Crear</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Join Game Modal */}
      <Modal
        visible={showJoinModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowJoinModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Unirse a Partida</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Tu nombre"
              placeholderTextColor="#666"
              value={playerName}
              onChangeText={(text) => {
                setPlayerName(text);
                setError('');
              }}
              maxLength={20}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Código de partida"
              placeholderTextColor="#666"
              value={joinCode}
              onChangeText={(text) => {
                setJoinCode(text.toUpperCase());
                setError('');
              }}
              maxLength={6}
              autoCapitalize="characters"
            />
            
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowJoinModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleJoinGame}
              >
                <Text style={styles.confirmButtonText}>Unirse</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWrapper: {
    marginBottom: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#00d2ff',
    letterSpacing: 4,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    fontStyle: 'italic',
  },
  buttonContainer: {
    gap: 16,
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
  tertiaryButton: {
    backgroundColor: 'transparent',
  },
  tertiaryButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  footerText: {
    fontSize: 12,
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1a1a2e',
    borderRadius: 20,
    padding: 24,
    width: '85%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00d2ff',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#0f0f1e',
    borderRadius: 12,
    padding: 16,
    color: '#fff',
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#16213e',
  },
  errorText: {
    color: '#ff4757',
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#666',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButton: {
    backgroundColor: '#00d2ff',
  },
  confirmButtonText: {
    color: '#0f0f1e',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
