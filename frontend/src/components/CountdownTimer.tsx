import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface CountdownTimerProps {
  seconds: number;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ seconds }) => {
  const isUrgent = seconds <= 5;
  
  return (
    <View style={[styles.container, isUrgent && styles.urgent]}>
      <Text style={[styles.timer, isUrgent && styles.urgentText]}>
        {seconds}s
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1a1a2e',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 2,
    borderColor: '#16213e',
  },
  urgent: {
    backgroundColor: '#ff4757',
    borderColor: '#ff6b7a',
  },
  timer: {
    color: '#00d2ff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  urgentText: {
    color: '#fff',
  },
});
