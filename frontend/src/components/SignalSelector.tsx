import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

interface SignalSelectorProps {
  onSelect: (signal: number) => void;
  selectedSignal?: number;
  disabled?: boolean;
}

export const SignalSelector: React.FC<SignalSelectorProps> = ({
  onSelect,
  selectedSignal,
  disabled = false,
}) => {
  const [tempSelected, setTempSelected] = useState<number | undefined>(selectedSignal);
  
  const handleSelect = (num: number) => {
    if (disabled) return;
    setTempSelected(num);
    onSelect(num);
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Elige tu señal</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.numbers}
      >
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
          <TouchableOpacity
            key={num}
            style={[
              styles.numberButton,
              tempSelected === num && styles.selectedButton,
              disabled && styles.disabledButton,
            ]}
            onPress={() => handleSelect(num)}
            disabled={disabled}
          >
            <Text
              style={[
                styles.numberText,
                tempSelected === num && styles.selectedText,
              ]}
            >
              {num}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {tempSelected !== undefined && (
        <View style={styles.selectedInfo}>
          <Text style={styles.selectedLabel}>Seleccionado: {tempSelected}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 20,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  numbers: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
  },
  numberButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#1a1a2e',
    borderWidth: 2,
    borderColor: '#16213e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: '#00d2ff',
    borderColor: '#00d2ff',
    transform: [{ scale: 1.1 }],
  },
  disabledButton: {
    opacity: 0.5,
  },
  numberText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  selectedText: {
    color: '#0f0f1e',
  },
  selectedInfo: {
    marginTop: 16,
    alignItems: 'center',
  },
  selectedLabel: {
    color: '#00d2ff',
    fontSize: 16,
    fontWeight: '600',
  },
});
